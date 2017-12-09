import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DocuJapWikiComponent} from "./docu-jap-wiki.component";

//Components

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DocuJapWikiComponent
  ],
  exports: [
    DocuJapWikiComponent
  ]
})
export class DocuJapWikiModule { }
