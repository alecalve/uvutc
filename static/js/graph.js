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
