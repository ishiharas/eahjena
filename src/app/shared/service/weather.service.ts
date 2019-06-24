import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { weather } from "~/app/shared/config";
import { WeatherModel } from "../model/weather.model";

@Injectable()
export class WeatherService {
    private weatherUrl: string = weather;

    constructor(private http: HttpClient) { }

    getWeatherData(): Observable<WeatherModel> {
        let headers = this.createRequestHeader();
        return this.http.get<WeatherModel>(this.weatherUrl, { headers: headers });
    }

    private createRequestHeader() {
        let headers = new HttpHeaders({
            "AuthKey": "my-key",
            "AuthToken": "my-token",
            "Content-Type": "application/json",
         });

        return headers;
    }
}