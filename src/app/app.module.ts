import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { AuthGuard } from "./shared/service/auth-guard.service";
import { TimestampService } from "./shared/service/timestamp.service";
import { HttpClientModule } from "@angular/common/http";


@NgModule({
    bootstrap: [
        AppComponent
    ],
    providers: [
        AuthGuard,
        TimestampService
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIListViewModule,
        SharedModule,
        HttpClientModule
    ],
    declarations: [
        AppComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
