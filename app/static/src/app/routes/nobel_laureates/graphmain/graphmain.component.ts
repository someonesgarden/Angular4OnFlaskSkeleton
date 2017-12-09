import {Component, Input, OnInit} from '@angular/core';
//Services
import {D3mapService} from '../../../services/d3map.service';
import {TimegraphService} from "../../../services/timegraph.service";
import {BargraphService} from "../../../services/bargraph.service";


@Component({
  selector: 'app-graphmain',
  templateUrl: './graphmain.component.html',
  styleUrls:['./graphmain.component.css']
})
export class GraphmainComponent implements OnInit{

  constructor(
    private d3mapservice: D3mapService,
    private timegraphservice: TimegraphService,
    private bargraphservice: BargraphService
  ) {

  }

  ngOnInit() {
    this.bargraphservice.init();
    this.d3mapservice.init();
    this.timegraphservice.init();
  }
}
