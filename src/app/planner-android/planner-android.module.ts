import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { PlannerRoutingModule } from "./planner-android-routing.module";
import { PlannerAndroidComponent } from "./planner-android.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { SharedModule } from "../shared/shared.module";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HomeInterceptor } from "../shared/mock/home-interceptor";
import { NgRippleModule } from "nativescript-ng-ripple";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        PlannerRoutingModule,
        SharedModule,
        NativeScriptHttpClientModule,
        NgRippleModule
    ],
    declarations: [
        PlannerAndroidComponent
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
export class PlannerAndroidModule { }
