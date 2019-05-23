import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { PlannerEditRoutingModule } from "./planner-edit-routing.module";
import { PlannerEditComponent } from "./planner-edit.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        PlannerEditRoutingModule,
        NativeScriptHttpClientModule,
        SharedModule
    ],
    declarations: [
        PlannerEditComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class PlannerEditModule { }
