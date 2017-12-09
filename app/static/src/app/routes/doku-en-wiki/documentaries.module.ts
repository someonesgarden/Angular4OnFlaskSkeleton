import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Components
import {DocumentariesComponent} from "./documentaries.component";
//Services

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DocumentariesComponent
  ],
  exports: [
    DocumentariesComponent
  ]
})
export class DocumentariesModule { }
