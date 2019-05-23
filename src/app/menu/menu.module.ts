import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { MenuRoutingModule } from "./menu-routing.module";
import { MenuComponent } from "./menu.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";
import { SharedModule } from "../shared/shared.module";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NgRippleModule } from "nativescript-ng-ripple";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        MenuRoutingModule,
        NativeScriptUISideDrawerModule,
        SharedModule,
        NativeScriptHttpClientModule,
        NgRippleModule
    ],
    declarations: [
        MenuComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class MenuModule { }
