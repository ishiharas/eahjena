import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ImprintRoutingModule } from "./imprint-routing.module";
import { ImprintComponent } from "./imprint.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        ImprintRoutingModule,
        NativeScriptUISideDrawerModule,
        SharedModule
    ],
    declarations: [
        ImprintComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ImprintModule { }
