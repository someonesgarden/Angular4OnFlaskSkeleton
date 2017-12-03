import { ModuleWithProviders} from "@angular/core";
import { Routes, RouterModule} from "@angular/router";

// import {AppComponent} from "./app.component";
import {MainComponent} from "./main/main.component";



const myRoutes = [
{path:'', component:MainComponent}
];

export const MY_ROUTES : ModuleWithProviders = RouterModule.forRoot(myRoutes);

