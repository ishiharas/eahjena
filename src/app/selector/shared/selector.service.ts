import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";
import { CourseData } from "./courseData.model";

import { courses, canteens } from "../../shared/config";
import { CanteenData } from "./canteenData.model";

@Injectable()
export class SelectorService {
    private coursesUrl: string = courses;
    private _courseData: Observable<CourseData>;

    private canteensUrl: string = canteens;
    private _canteenData: Observable<Array<CanteenData>>;

    constructor(private http: HttpClient) { }

    getCourseData(): Observable<CourseData> {
        let headers = this.createRequestHeader();
        
        this._courseData = this.http
            .get<CourseData>(this.coursesUrl, { headers: headers });
            
        // this._courseData.subscribe((data) => console.log(data));
        return this._courseData;
    }

    getCanteenData(): Observable<Array<CanteenData>> {
        let headers = this.createRequestHeader();
        
        this._canteenData = this.http
            .get<Array<CanteenData>>(this.canteensUrl, { headers: headers });

        // this._canteenData.subscribe((data) => console.log(data));
        return this._canteenData;
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