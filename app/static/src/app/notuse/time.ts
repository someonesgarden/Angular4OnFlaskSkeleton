import * as d3 from 'd3';
import * as G from '../../globals';

export class NobelTime {

  svg: any;
  dom: any;
  width: number;
  height: number;
  xScale: any;
  yScale: any;

  init(): void {

    this.dom = d3.select('#nobel-time');
    let margin = {top: 20, right: 20, bottom: 30, left: 40};
    let boundingRect = this.dom.node().getBoundingClientRect();

    this.width = boundingRect.width - margin.left - margin.right;
    this.height = boundingRect.height - margin.top - margin.bottom;

    this.svg = this.dom.append("svg")
      .attr("width", this.width + margin.left + margin.right)
      .attr("height", this.height + margin.top + margin.bottom)
      .append('g')
      .attr("class", "chart")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // SCALES
    var ran0: any = d3.range(1901, 2015);
    this.xScale = d3.scaleBand().range([0, this.width]).padding(0.1).domain(ran0);

    var ran1: any = d3.range(15);
    this.yScale = d3.scaleBand().range([this.height, 0]).domain(ran1);

    // AXIS
    var xAxis = d3.axisBottom(this.xScale).tickValues(this.xScale.domain().filter(function (d, i) {
      return !(d % 10);
    }));

    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    // LABELS
    var catLabels = this.dom.select('svg').append('g')
      .attr('class', 'labels')
      .attr('transform', "translate(10, 10)")
      .selectAll('label').data(G.nbviz.CATEGORIES)
      .enter().append('g')
      .attr('transform', function (d, i) {
        return "translate(0," + i * 10 + ")";
      });


    catLabels.append('circle')
      .attr('fill', (G.nbviz.categoryFill))
      .attr('r', this.xScale.bandwidth() / 2);

    catLabels.append('text')
      .text(function (d) {
        return d;
      })
      .attr('dy', '0.4em')
      .attr('x', 10);

  }

  // OUR MAIN UPDATE METHOD, CALLED BY nbviz.onDataChange in nbviz_core.js
  updateTimeChart(data): void {

    var years = this.svg.selectAll(".year")
      .data(data, function (d) {
        return d.key;
      });

    years.enter().append('g')
      .classed('year', true)
      .attr('name', function (d) {
        return d.key;
      })
      .attr("transform", (year) => {
        return "translate(" + this.xScale(+year.key) + ",0)";
      });

    years.exit().remove();

    var winners = years.selectAll(".winner")
      .data(function (d) {
        return d.values;
      }, function (d) {
        return d.name;
      });

    winners.enter().append('circle')
    // .attr('class', function(d) {
    //     return 'winner ' + d.country.replace(/ /g, '-');
    // })
      .classed('winner', true)
      .attr('fill', function (d) {
        return G.nbviz.categoryFill(d.category);
      })
      .attr('cy', this.height)
      .attr('cx', this.xScale.bandwidth() / 2)
      .attr('r', this.xScale.bandwidth() / 2);

    winners
      .transition().duration(2000)
      .attr('cy', (d, i) => {
        return this.yScale(i);
      });

    winners.exit().remove();
  };


}
