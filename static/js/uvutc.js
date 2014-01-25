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
  var evals = uv["evaluations"];

  if (evals.length == 0) {
    return "Non évaluée";
  }

  var nbe = 0;

  for(var i=0;i<evals.length;i++) {
    var e = evals[i];
    nbe += parseInt(e["reponses"]);
    note += parseInt(e["reponses"])*parseFloat(e["appreciation"]);
  }

  return (note/nbe).toFixed(2) + " (" + nbe + ")";
}

function uv_string(uv) {
  var str = "<tr class="+ uv["cat"].toLowerCase() +">";
  var aff = ["code", "cat", "nom", "resp", "branches", "semestres", "tp", "ects", "final", "places"];
  for(var i=0;i<aff.length;i++) {
    var content = uv[aff[i]];
    if (jQuery.isArray(content)) {
      var chaine = content[0];
      for(var j=1;j<content.length;j++) {
        chaine += " "+content[j];
      }
      content = chaine;
    }
      
    str += "<td>"+ content +"</td>";
  }
  str += "<td>"+ compute_note(uv) +"</td>";
  str += "<td><a target='_blank' href='https://assos.utc.fr/uvweb/uv/"+ uv["code"]+"'>ici</a></td></tr>";
  return str;
}

function refresh(liste) {
  $("#table tbody").empty();
  for(var uv in liste) {
    $("#table tbody").append(uv_string(liste[uv]));
  }
  $("#nb").text(Object.keys(liste).length + " uv(s) affichées");
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
