import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MenuEditRoutingModule } from "./menu-edit-routing.module";
import { MenuEditComponent } from "./menu-edit.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        MenuEditRoutingModule,
        NativeScriptHttpClientModule,
        SharedModule
    ],
    declarations: [
        MenuEditComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class MenuEditModule { }
