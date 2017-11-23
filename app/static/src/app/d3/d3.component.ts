import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'underscore';

@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.css']
})
export class D3Component implements OnInit {

  constructor() {
  }

  ngOnInit() {
    const dat = [{r: 10, x: 100, name: 'Alice'}, {r: 8, x: 150, name: 'Bob'}, {r: 15, x: 200, name: 'Chris'}];
    const sel = d3.select('#d3test').append('svg').attr('width', 300).attr('height', 300);

sel.selectAll('circle')
    .data(dat, function(d){ return ''; })
    .enter()
    .append('circle')
    .attr('fill', 'pink')
    .attr('r', function(d){return d.r; })
    .attr('cx', function(d){return d.x; })
    .attr('cy', function(d, i){return i * 50; });
  }


}
