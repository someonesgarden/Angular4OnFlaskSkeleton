import { ModuleWithProviders} from "@angular/core";
import { Routes, RouterModule} from "@angular/router";

// import {AppComponent} from "./app.component";
import {MainComponent} from "./main/main.component";
import {HomeComponent} from "./home/home.component";



const myRoutes = [
  {path:'', component:HomeComponent},
  {path:'main', component:MainComponent}
];

export const MY_ROUTES : ModuleWithProviders = RouterModule.forRoot(myRoutes);

