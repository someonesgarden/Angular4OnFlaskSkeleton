import { ModuleWithProviders} from "@angular/core";
import { Routes, RouterModule} from "@angular/router";

// import {AppComponent} from "./app.component";
import {MainComponent} from "./routes/nobel_laureates/main.component";
import {HomeComponent} from "./routes/home/home.component";
import {DocumentariesComponent} from "./routes/doku-en-wiki/documentaries.component";
import {DocuJapWikiComponent} from "./routes/docu-jap-wiki/docu-jap-wiki.component";
import {YidffmainComponent} from "./routes/yidff/yidffmain.component";
import {IdfamainComponent} from "./routes/idfa/idfamain.component";
import {DocuFesListComponent} from "./routes/docu-fes-list/docu-fes-list.component";
import {CoreComponent} from "./routes/core/core.component";

const myRoutes = [
  {path:'main', component:MainComponent},
  {path: 'docu', component:DocumentariesComponent},
  {path: 'docu_jap_wiki', component:DocuJapWikiComponent},
  {path: 'yidff', component:YidffmainComponent},
  {path: 'idfa', component:IdfamainComponent},
  {path: 'docufeslist', component:DocuFesListComponent},
  {path: 'core', component:CoreComponent},
  {path:'', component:HomeComponent}
];

export const MY_ROUTES : ModuleWithProviders = RouterModule.forRoot(myRoutes);

