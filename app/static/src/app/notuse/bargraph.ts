import * as d3 from 'd3';
import * as G from '../../globals';

export class BarGraph {
  svg: any;
  dom: any;
  width: number;
  height: number;
  xScale: any;
  yScale: any;
  xAxis;
  yAxis;
  paddingLeft: number = 10;

  init(): void {
    // Bar Graph Init
    this.dom = d3.select('#nobel-bar');
    let bar_margin = {top: 10, right: 10, bottom: 10, left: 10};
    let boundingRect = this.dom.node().getBoundingClientRect();
    this.width = boundingRect.width - bar_margin.left - bar_margin.right;
    this.height = boundingRect.height - bar_margin.top - bar_margin.bottom;

    // SCALES
    this.xScale = d3.scaleBand().range([this.paddingLeft, this.width]);
    this.yScale = d3.scaleLinear().range([this.height, 0]);

    // AXES
    this.xAxis = d3.axisBottom(this.xScale).ticks(10);
    this.yAxis = d3.axisLeft(this.yScale)
      .ticks(10)
      .tickFormat(function (d: any) {
        if (G.nbviz.valuePerCapita) {
          return d.toExponential();
        }
        return d;
      });

    this.svg = this.dom.append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(40,-30)");

    this.svg.append("g")
      .attr("class", "y axis")
      .call(this.yAxis)
      .append("text")
      .attr("y", -10)
      .attr("x", 10)
      .style("text-anchor", "end")
      .text("GDP(兆円)");

    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis);
  }

  updateBarChart(data) {
    console.log('BarGraph: updateBarChart');
    console.log(data);
    console.log('G.nbviz.activeCountry');
    console.log(G.nbviz.activeCountry);

    data = data.filter(function (d: any) {
      if (d) {
        return d.value > 0;
      } else {
        return false;
      }
    });
    this.xScale.domain(data.map(function (d) {
      return d.code;
    }));
    this.yScale.domain([0, d3.max(data, function (d: any) {
      return +d.value;
    })]);

    this.svg.select('.x.axis')
      .transition().duration(G.nbviz.TRANS_DURATION)
      .call(this.xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function (d) {
        return "rotate(-65)";
      });

    this.svg.select('.y.axis')
      .transition().duration(G.nbviz.TRANS_DURATION)
      .call(this.yAxis);

    var yLabel = this.svg.select('#y-axis-label');
    yLabel.text("Number of winners");

    var bars = this.svg.selectAll(".bar")
      .data(data, function (d) {
        return d.code;
      });

    bars.enter().append("rect")
      .attr("class", "bar")
      .attr("x", this.paddingLeft);

    bars.classed('active', function (d) {
      return d.key === G.nbviz.activeCountry;
    })
      .transition().duration(G.nbviz.TRANS_DURATION)
      .attr("x", (d) => {
        return this.xScale(d.code);
      })
      .attr("width", this.xScale.bandwidth())
      .attr("y", (d) => {
        return this.yScale(d.value);
      })
      .attr("height", (d) => {
        return this.height - this.yScale(d.value);
      });
    bars.exit().remove();
  };
}
