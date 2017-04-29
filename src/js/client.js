
import "../styles/main.css"

import * as d3 from "d3"
import axios from "axios"

const URL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

axios.get(URL)
	.then(function (response) {
		
		var data = response.data

		var allegedColor = "#910000"
		var notAllegedColor = "#0c9100"

		var chart = d3.select(".chart"),
        margin = {top: 5, right: 140, bottom: 70, left: 70},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom


    var rankOneSec = d3.min(data, function(d) { return d.Seconds })
    data.forEach((element) => {
    	element.Behind = element.Seconds - rankOneSec
    	element.Legend = (element.Doping !== "") ? true : false 
    })

    var x = d3.scaleLinear().range([0, width])
        .domain([d3.max(data, function(d) { return d.Behind }), 0])

    var y = d3.scaleLinear().range([height, 0])
        .domain([d3.max(data, function(d) { return d.Place; }), 0])

    function secToMin(n) {
    	var min = Math.floor(n / 60)
    	var minFormat = (min < 10) ? ("0" + min) : min

    	var sec = Math.floor(n % 60) 
    	var secFormat = (sec < 10) ? ("0" + sec) : sec

    	return minFormat + ":" + secFormat
    }

    var tooltip = d3.select(".card").append("div").attr("class", "toolTip")

    var g = chart.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(15," + (height + 15) + ")")
      .call(d3.axisBottom(x).ticks(10).tickFormat(secToMin))
    .append("text")
    	.attr("y", -20)
    	.attr("x", (width/2))
    	.attr("dy", "0.71em")
    	.attr("text-anchor", "center")
      .attr("fill", "black")
      .style("font-size", "16px")
      .text("Minutes Behind Fastest Time")

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(8))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .style("font-size", "16px")
      .text("Ranking")

    g.selectAll(".dot")
     		.data(data)
     	.enter().append("circle")
     		.attr("class", "dot")
     		.attr("r", 5)
     		.attr("cx", function(d) { return (x(d.Behind) + 15) })
     		.attr("cy", function(d) { return y(d.Place) })
     		.style("fill", function(d) {
     			if (d.Doping) { return allegedColor }
     			else { return notAllegedColor }
     		})
     		.on("mouseover", function(d) {
          var date = new Date(d.date)
          var year = date.getFullYear()
          var month = date.getMonth()

          tooltip.html(`<span class='amount'>${formatCurrency(d.value)} Billion </span><br><span class='year'> ${year} - ${months[month]} </span>`)
            .style("opacity", "0.9")
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY - 50 + "px")

         })
         .on("mouseout", function() { tooltip.style("opacity", "0") });

	})
	.catch(function (error) {
    console.error(error);
  });
