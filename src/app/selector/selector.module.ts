import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { SelectorRoutingModule } from "./selector-routing.module";
import { SelectorComponent } from "./selector.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { PreferencesComponent } from "./preferences/preferences.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { SelectorInterceptor } from "../shared/mock/selector-interceptor";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        SelectorRoutingModule,
        NativeScriptHttpClientModule,
        SharedModule
    ],
    declarations: [
        SelectorComponent
    ],
    providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: SelectorInterceptor,
          multi: true
        }
      ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SelectorModule { }
