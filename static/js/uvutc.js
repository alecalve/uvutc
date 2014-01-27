var filtres = {
  "normal": function(uv, filtre) {
    var value = uv[filtre["item"]].toLowerCase();
    var data = filtre["value"].split(" ").filter(function(e) {return e;});
    for(var m=0; m<data.length; m++) {
      if (value.indexOf(data[m].toLowerCase()) == -1) {
        return false;
      }
    }
    return true;
  },
  
  "string": function(content, filtre) {
    var value = content.toLowerCase();
    var data = filtre["value"].split(" ").filter(function(e) {return e;});
    for(var m=0; m<data.length; m++) {
      if (value.indexOf(data[m].toLowerCase()) == -1) {
        return false;
      }
    }
    return true;
  },
  
 "array": function(uv, filtre) {
    for(var i=0;i<uv[filtre["item"]].length; i++) {
      if (filtres["string"](uv[filtre["item"]][i], filtre))
        return true;
    }
    return false;
  },

  "number": function(uv, filtre) {
    var n;
    if (filtre["item"] == "note") {
      n = compute_note(uv);
    } else {
      n = uv[filtre["item"]];
    }
    return ($("#"+filtre["item"]).data("comp") == "sup") ? parseFloat(n) >= parseFloat(filtre["value"]) : parseFloat(n) < parseFloat(filtre["value"]);
  },
};

function compute_note(uv) {
  var note = 0;
  var evals = uv["evals"];

  if (evals.length == 0) {
    return "Non évaluée";
  }

  var nbe = 0;

  for(var i=0;i<evals.length;i++) {
    var e = evals[i];
    nbe += parseInt(e["r"]);
    note += parseInt(e["r"])*parseFloat(e["appr"]);
  }

  return (note/nbe).toFixed(2) + " (" + nbe + ")";
}

function updateNoteColor () {
  $(".note").each(function () {
    var note = parseFloat($(this).text().split(" ")[0]);
    if ($(this).text() == "Non évaluée") {
      return;
    }
    if (note > 15) {
      $(this).addClass("good");
    } else if (note > 12) {
      $(this).addClass("bad");
    } else {
      $(this).addClass("ugly");
    }
  });
}

function uv_string(uv) {
  var str = "<tr class="+ uv["cat"].toLowerCase() +">";
  var aff = ["code", "cat", "nom", "resp", "branches", "s", "tp", "ects", "final", "p"];
  for(var i=0;i<aff.length;i++) {
    var content = uv[aff[i]];
    if (jQuery.isArray(content)) {
      content = content.join(" ");
    }
      
    str += "<td class='"+ aff[i]+"'>"+ content +"</td>";
  }
  str += "<td class='note'>"+ compute_note(uv) +"</td>";
  str += "<td><a target='_blank' href='https://assos.utc.fr/uvweb/uv/"+ uv["code"]+"'>ici</a></td>";
  str += "<td class='more'><a data-to='"+  uv["code"] + "'href='#'>+</a></td></tr>";
  return str;
}

function refresh(liste) {
  $("#table tbody").empty();
  for(var uv in liste) {
    $("#table tbody").append(uv_string(liste[uv]));
  }
  $("#nb").text(Object.keys(liste).length + " uv(s) affichées");
  updateNoteColor();
}
  
function filtre() {
  var filters = [];

  var all_empty = true;
  $(".table-input").each(function () {
    filters[filters.length] = {
      'value': this.value,
      'item': $(this).data("filter"),
      'type' : ($(this).data("type") == undefined) ? "normal" : $(this).data("type"),
      'comp' : ($(this).data("comp") == undefined) ? "" : $(this).data("comp")
    };
    
    if (this.value != "") {
      all_empty = false;
    }
  });
  
  if (all_empty) {
    return uvs;
  }
    
  var arr = {};
    
  filters = filters.filter( function(n) {
    return n.value != ""
  });
  
  for(var u in uvs) {
    var presence = true;
    for(var f=0; f<filters.length; f++) {
      if (presence == false) {
        break;
      }
      presence = filtres[filters[f]["type"]](uvs[u], filters[f]);
    }
     if (presence) {
      arr[u] = uvs[u];
    }
  }
  return arr;
}

function sortBySemestre(x, y) {
  ax = parseInt(x["semestre"].slice(-2));
  ay = parseInt(y["semestre"].slice(-2));
  if (ax == ay) {
      if (x["semestre"][0] == "P") {
          return -1
      } else {
          return 1
      }
  } else {
      return ax - ay;
  }
}

function getEvals(data, item) {
  var appreciations = [];
  var evals = data["evals"];
  for (var i in evals) {
    appreciations[appreciations.length] = {"note": evals[i][item], "semestre": evals[i]["s"]};
  }
  return appreciations.sort(sortBySemestre);
}

function barChart(data, selector, titre, colorize, custom_scale) {
  if (data.length == 0) {
    return;
  }

  var ydomain = 20;

  var max = function(data) {
    var m = data[0]["note"];
    for (var i in data) {
      m = (data[i]["note"] > m) ? data[i]["note"] : m;
    }
    
    return m;
  }

  if (custom_scale) {
    ydomain = max(data);
  }

  
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 350 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom,
      y = d3.scale.linear().domain([ydomain, 0]).range([0 , height]),
      x = d3.scale.ordinal().rangeRoundBands([0, width], .1);;

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

    
  var svg = d3.select(selector).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
  x.domain(data.map(function(d) { return d["semestre"]; }));

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Note");

  svg.append("g")
    .attr("class", "title")
    .append("text")
      .attr("y", -margin.top + 1)
      .attr("x", width/2)
      .attr("dy", ".71em")
      .attr("dx", "2em")
      .style("text-anchor", "end")
      .text(titre);

  var color = function(d) {
    if (!colorize) {
      return "bar";
    }
    if (d.note > 15) {
      return "bar good";
    } else if (d.note > 12) {
      return "bar bad";
    } else {
      return "bar ugly";
    }
  }
  
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", function (d) {return color(d);})
      .attr("x", function(d) { return x(d.semestre); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.note); })
      .attr("height", function(d) { return height - y(d.note); });
}
