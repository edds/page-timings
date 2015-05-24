(function(){
  "use strict"

  var graph = {
    svg: false,
    x: false,
    y: false,
    width: 600,
    height: 300,
    maxPercent: 20,

    init: function(){
      var padding = 40,
          axis, axisCords;

      graph.svg = d3.select('#graph')
        .append('svg:svg')
          .attr('width', (graph.width + 190 + padding * 2))
          .attr('height', (graph.height + 60 + padding * 2))
          .attr('class', 'stacked')
        .append('g')
          .attr('transform', 'translate('+padding+','+padding+')'),
      graph.axis = graph.svg.append('g').attr('class', 'axis'),
      axisCords = [
        // [ y1, y2, x1, x2 ]
        [ 0.5, graph.width+.5, graph.height+.5, graph.height+.5 ],
        [ 0.5, 0.5, 0.5, graph.height+.5 ],
        [ graph.width+.5, graph.width+.5, 0.5, graph.height+.5 ]
      ];

      graph.timings = graph.svg.append('g').attr('class', 'timings')
      graph.colours = d3.scale.category10();

      axisCords.map(function(d){
        graph.axis.append('svg:line')
          .attr('x1', d[0]).attr('x2', d[1]).attr('y1', d[2]).attr('y2', d[3]);
      });

      graph.area= d3.svg.area()
        .interpolate('step-after')
        .x(function(d, i) { return graph.x(i); })
        .y0(graph.height)
        .y1(function(d, i) { return graph.y(d); });
    },
    maxTime: function(data){
      debugger;
      return d3.max(data[0][1]);
    },
    show: function(data){
      var timings, ticks, tick;

      data = data.reverse();
      graph.x = d3.scale.linear()
        .domain([data[1][1].length, 0])
        .range([graph.width, 0]);
      graph.y = d3.scale.linear()
        .domain([0, graph.maxTime(data)])
        .range([graph.height, 0]).nice();

      // add new data to the timings 
      timings = graph.timings.selectAll('.timing')
        .data(data, function(d){ return d[0]; })

      // add new elemnts not matched by previous data
      timings = timings.enter()
        .append('g').attr('class', 'timing')

      // add new text nodes
 //     timings.append("text")
 //       .datum(function(d) { return {name: d.os+' -  '+d.browser+' - '+d.version }; })
 //       .attr("x", 3)
 //       .attr("dy", ".35em")
 //       .attr('class', 'text')
 //       .text(function(d) { return d.name; });

      // add new lines
      timings.append('path')
        .attr('class', 'area')
        .attr('stroke', function(d,i){ return graph.colours(i); })
        .style('fill', function(d,i){ return d3.rgb(graph.colours(i)).brighter(2); });

//      browsers.select('.text').transition()
//        .attr("transform", function(d){ return "translate("+graph.width+","+graph.y(d.days[d.days.length-1])+")"; })

      // update all the lines to have the new data
      timings.select('.area').transition()
        .attr('d', function(d){ return graph.area(d[1]); });

      timings.on('click', function(){
        var timing= d3.select(this);
        if(timing.attr('class').indexOf('active') < -1){
          timing.attr('class', 'browser')
        } else {
          timming.attr('class', 'browser active');
        }
      });

      ticks = graph.axis.selectAll('.x-tick')
        .data(data, function(d){ return d[0]; })

      tick = ticks.enter()
        .append('g').attr('class', 'x-tick')
      tick.append('svg:line')
        .attr('class', 'line')
        .attr('y1', 0)
        .attr('y2', graph.height);
      tick.append('text')
        .attr('class', 'text')
        .attr('text-anchor', 'start')
        .attr("dy", '15px')
        .attr('transform', function(d, i) { return 'translate(0,'+graph.height+') rotate(45)'; });

      ticks.select('.line').transition()
        .attr('x1', function(d, i){ return graph.x(i)+.5 })
        .attr('x2', function(d, i){ return graph.x(i)+.5 });
      ticks.select('.text').transition()
        .attr('transform', function(d, i) { return 'translate('+graph.x(i)+','+graph.height+') rotate(45)'; })
        .text(function(d){ return d; });

//       ticks = graph.axis.selectAll('.y-tick')
//         .data(graph.y.ticks(5))
// 
//       tick = ticks.enter()
//         .append('g').attr('class', 'y-tick')
//       tick.append('svg:line')
//         .attr('class', 'line')
//         .attr('x1', 0)
//         .attr('x2', graph.width);
//       tick.append('text')
//         .attr('class', 'text')
//         .attr('text-anchor', 'end')
//         .attr('dy', '.4em')
//         .attr('transform', function(d, i) { return 'translate(-2,0)'; })
//         .text(function(d){ return d +'%'; });
// 
//       ticks.select('.line').transition()
//         .attr('y1', function(d, i){ return graph.y(d)+.5 })
//         .attr('y2', function(d, i){ return graph.y(d)+.5 });
//       ticks.select('.text').transition()
//         .attr('transform', function(d, i) { return 'translate(-2, '+graph.y(d)+')'; });
    }
  };
  window.graph = graph;
}());
