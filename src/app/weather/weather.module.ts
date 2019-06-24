import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { WeatherRoutingModule } from "./weather-routing.module";
import { WeatherComponent } from "./weather.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";

@NgModule({
    imports: [
        NativeScriptCommonModule,
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
