import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'underscore';

@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.css']
})
export class D3Component implements OnInit {
  API_URL: string;
  displayJSON: any;
  query: any;

  constructor() {
    this.initMongoServer();
  }

  initMongoServer() {
    // Python EVEサーバー。ここからMONGO DBを叩いている
    this.API_URL = 'http://localhost:5000/api';
    this.displayJSON = function(query) {
      d3.json(this.API_URL + query, function(error, data){

        // console.log(data);
          if (error) {
              return console.warn(error);
          }
          d3.select('#query').html(query);
          d3.select('#data').html(JSON.stringify(data, null, 4));
          // console.log(data);
      });
    };
    // 通常のwhereでセレクトする場合
    // this.query = '/winners?where=' + JSON.stringify({
    //   'year': {'$gt': 2000},
    //   'gender': 'female'
    // });

    this.query = '/winners?where=' + JSON.stringify({
      'name': 'Albert Einstein'
    });

    // projectionを使うときには、'0'のようにシングルコンマを忘れずに！!!!
    // this.query = '/winners?projection=' + JSON.stringify({'mini_bio': '0'});
  }

  sampleGraph() {
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

  ngOnInit() {
    // this.sampleGraph();
    this.displayJSON(this.query);
  }

  onvoted(ev): void {
    console.log('onvoted_init');
    console.log(ev);
    console.log('APP:onvoted_end');
  }
}
