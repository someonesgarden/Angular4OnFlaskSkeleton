import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http'; // HTTPクライアント機能
// Routing
import {MY_ROUTES} from "./app.routing";
// Custom Modules
import { AframeComponent } from './components/aframe/aframe.component';
import { UnderscoreComponent } from './components/underscore/underscore.component';
import { MainComponent } from './main/main.component';
import { MainModule} from "./main/main.module";
// Services
// Firebase
import {FirebaseService} from "./services/firebase.service";
import {AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import {FIREBASE_CONFIG} from './app-firebase.config';


@NgModule({
  declarations: [
    AppComponent,
    // D3graphComponent,
    // D3Component,
    // AframeComponent,
    // UnderscoreComponent,
    MainComponent
  ],
  imports: [
    MY_ROUTES,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MainModule
  ],
  providers: [
    FirebaseService
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
