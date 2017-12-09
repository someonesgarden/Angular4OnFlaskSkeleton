import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpModule, JsonpModule} from '@angular/http'; // HTTPクライアント機能
// Routing
import {MY_ROUTES} from "./app.routing";
// Custom Components
import { MainComponent } from './routes/nobel_laureates/main.component';
import { HomeComponent } from './routes/home/home.component';
// Custom Modules
import { MainModule} from "./routes/nobel_laureates/main.module";
import {DocumentariesModule} from "./routes/doku-en-wiki/documentaries.module";
import {YidffModule} from "./routes/yidff/yidff.module";
// Services
import {FirebaseService} from "./services/firebase.service";
import {AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import {FIREBASE_CONFIG} from './app-firebase.config';
import {DocuJapWikiModule} from "./routes/docu-jap-wiki/docu-jap-wiki.module";
import {IdfaModule} from "./routes/idfa/idfa.module";
import {DocuFesListModule} from "./routes/docu-fes-list/docu-fes-list.module";
import {HatenaService} from "./services/hatena.service";


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HomeComponent
  ],
  imports: [
    MY_ROUTES,
    BrowserModule,
    FormsModule,
    JsonpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MainModule,
    DocumentariesModule,
    DocuJapWikiModule,
    YidffModule,
    IdfaModule,
    DocuFesListModule
  ],
  providers: [
    FirebaseService,
    HatenaService
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
