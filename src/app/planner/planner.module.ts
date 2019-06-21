import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { PlannerRoutingModule } from "./planner-routing.module";
import { PlannerComponent } from "./planner.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";
import { SharedModule } from "../shared/shared.module";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HomeInterceptor } from "../shared/mock/home-interceptor";
import { NgRippleModule } from "nativescript-ng-ripple";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        PlannerRoutingModule,
        NativeScriptUISideDrawerModule,
        SharedModule,
        NativeScriptHttpClientModule,
        NgRippleModule,
        NativeScriptUIListViewModule
    ],
    declarations: [
        PlannerComponent
    ],
    providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HomeInterceptor,
          multi: true
        }
      ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class PlannerModule { }
