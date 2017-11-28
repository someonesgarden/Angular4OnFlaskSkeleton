import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { MyformComponent } from './components/myform/myform.component';
import { ReactiveformComponent } from './components/reactiveform/reactiveform.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NgSemanticModule } from 'ng-semantic';
import { HttpModule } from '@angular/http'; // HTTPクライアント機能

// Custom Modules

import {CoopModule} from './coop/coop.module';
import { ChildComponent } from './components/child/child.component';
import { D3graphComponent } from './d3graph/d3graph.component';
import { D3Service } from 'd3-ng2-service';
import { AframeComponent } from './aframe/aframe.component'; // <-- import statement
import { D3Component} from './d3/d3.component';
import { UnderscoreComponent } from './underscore/underscore.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    MyformComponent,
    ReactiveformComponent,
    ChildComponent,
    D3graphComponent,
    AframeComponent,
    D3Component,
    UnderscoreComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CoopModule,
    BrowserAnimationsModule,
    HttpModule
  ],
  providers: [D3Service],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
