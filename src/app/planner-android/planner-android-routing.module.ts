import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { PlannerAndroidComponent } from "./planner-android.component";

const routes: Routes = [
    { path: "", component: PlannerAndroidComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class PlannerRoutingModule { }
