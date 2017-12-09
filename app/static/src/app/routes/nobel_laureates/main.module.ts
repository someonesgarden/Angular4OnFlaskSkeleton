import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

//Components
import {GraphmainComponent} from "./graphmain/graphmain.component";
import {MenuComponent} from "./menu/menu.component";
// Services
import { D3Service } from 'd3-ng2-service';
import {ListService} from '../../services/list.service';
import {D3mapService} from '../../services/d3map.service';
import {TimegraphService} from "../../services/timegraph.service";
import {BargraphService} from "../../services/bargraph.service";


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    D3Service,
    ListService,
    D3mapService,
    TimegraphService,
    BargraphService,
  ],
  declarations: [
    GraphmainComponent,
    MenuComponent
  ],
  exports: [
    GraphmainComponent,
    MenuComponent
  ]
})
export class MainModule { }

