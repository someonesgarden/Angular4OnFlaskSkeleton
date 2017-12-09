import { ModuleWithProviders} from "@angular/core";
import { Routes, RouterModule} from "@angular/router";

// import {AppComponent} from "./app.component";
import {MainComponent} from "./routes/nobel_laureates/main.component";
import {HomeComponent} from "./routes/home/home.component";
import {DocumentariesComponent} from "./routes/doku-en-wiki/documentaries.component";
import {DocuJapWikiComponent} from "./routes/docu-jap-wiki/docu-jap-wiki.component";
import {YidffmainComponent} from "./routes/yidff/yidffmain.component";

const myRoutes = [
  {path:'main', component:MainComponent},
  {path: 'docu', component:DocumentariesComponent},
  {path: 'docu_jap_wiki', component:DocuJapWikiComponent},
  {path: 'yidff', component:YidffmainComponent},
  {path:'', component:HomeComponent}
];

export const MY_ROUTES : ModuleWithProviders = RouterModule.forRoot(myRoutes);

