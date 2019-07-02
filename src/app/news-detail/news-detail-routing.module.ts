import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { NewsDetailComponent } from "./news-detail.component";

const routes: Routes = [
    { path: "", component: NewsDetailComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class NewsDetailRoutingModule { }
