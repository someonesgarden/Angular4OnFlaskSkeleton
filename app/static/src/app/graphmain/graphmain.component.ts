import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as G from '../../globals';
import {BarGraph} from '../models/bargraph'
import {D3Map} from '../models/d3map'
import {NobelList} from '../models/list'
import {NobelTime} from '../models/time'


@Component({
  selector: 'app-graphmain',
  templateUrl: './graphmain.component.html',
  styleUrls:['./graphmain.component.css']
})
export class GraphmainComponent implements OnInit{

  barGraph: BarGraph;
  d3Map: D3Map;
  nobelList: NobelList;
  nobelTime: NobelTime;

  constructor() {
  }

  ngOnInit() {
    this.barGraph = new BarGraph;
    this.d3Map = new D3Map;
    this.nobelList = new NobelList;
    this.nobelTime = new NobelTime;

    this.barGraph.init();
    this.d3Map.init();
    this.nobelTime.init();
  }
}
