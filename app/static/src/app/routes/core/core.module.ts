import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import {DragZoom2Component} from "../../components/d3graph/drag-zoom-2/drag-zoom-2.component";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    CoreComponent,
    DragZoom2Component]
})
export class CoreModule { }
