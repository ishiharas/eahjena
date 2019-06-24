import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { weather } from "~/app/shared/config";

@Injectable()
export class WeatherService {
    private weatherUrl: string = weather;
    // private _weatherData: Observable<Array<WeatherModel>>;

    constructor(private http: HttpClient) { }

    // getWeatherData(): Observable<Array<WeatherModel>> {
    //     let headers = this.createRequestHeader();
        
    //     this._weatherData = this.http
    //         .get<Array<WeatherModel>>(this.weatherUrl, { headers: headers });
            
    //     // this._weatherData.subscribe((data) => console.log(data));
    //     return this._weatherData;
    // }

    // getWeatherData(): Observable<WeatherModel[]> {
    //     let headers = this.createRequestHeader();
    //     return this.http.get<Array<WeatherModel>>(this.weatherUrl, { headers: headers });
    // }

    private createRequestHeader() {
        let headers = new HttpHeaders({
            "AuthKey": "my-key",
            "AuthToken": "my-token",
            "Content-Type": "application/json",
         });

        return headers;
    }
}