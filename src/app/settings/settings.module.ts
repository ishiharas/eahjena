import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        SettingsRoutingModule,
        SharedModule
    ],
    declarations: [
        SettingsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SettingsModule { }
