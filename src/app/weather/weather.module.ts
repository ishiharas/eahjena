import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { WeatherRoutingModule } from "./weather-routing.module";
import { WeatherComponent } from "./weather.component";

@NgModule({
    imports: [
        NativeScriptModule,
        WeatherRoutingModule
    ],
    declarations: [
        WeatherComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class WeatherModule { }
