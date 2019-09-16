import { Component, OnInit } from "@angular/core";
import { WeatherService } from "../shared/service/weather.service";
import { WeatherModel } from "../shared/model/weather.model";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Page } from "tns-core-modules/ui/page/page";

@Component({
    selector: "Weather",
    moduleId: module.id,
    templateUrl: "./weather.component.html",
	styleUrls: ['./weather.component.css'],
    providers: [WeatherService]
})
export class WeatherComponent implements OnInit {
    public requestFinished: boolean = false;
    public weather: WeatherModel;

    constructor(private page: Page,
        private _weatherService: WeatherService) {
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.extractWeatherData();
    }

    openDrawer(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    
    extractWeatherData(): void {
        this._weatherService.getWeatherData()
            .subscribe((result: WeatherModel) => {
                this.weather = result;
                this.requestFinished = true;
            }, (error) => console.log(error));
    }
}

