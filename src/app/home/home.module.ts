import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NgRippleModule } from 'nativescript-ng-ripple';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HomeInterceptor } from "../shared/mock/home-interceptor";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";
import { SharedModule } from "../shared/shared.module";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        HomeRoutingModule,
        NativeScriptHttpClientModule,
        NgRippleModule,
        NativeScriptUISideDrawerModule,
        SharedModule
    ],
    declarations: [
        HomeComponent
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
export class HomeModule { }
