import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { CoursesModel } from "../model/courses.model";
import { TimestampService } from "./timestamp.service";
import { LSOBJECTS } from "../ls-objects";
import { flatMap, finalize, map } from "rxjs/operators";
import { courses, eventQuery } from "../../selector/shared/config";
import { getString } from "tns-core-modules/application-settings/application-settings";
import * as localStorage from 'nativescript-localstorage';

@Injectable()
export class CoursesService {
    private coursesUrl: string = courses;
    private localCourseData: CoursesModel[] = localStorage.getItem(LSOBJECTS.MODULEPLAN);

    private _updateAvailable: Observable<{ updatable: boolean, time: string }>;

    constructor(
        private http: HttpClient,
        private _timestampService: TimestampService) { 
            this._updateAvailable = _timestampService._updateAvailable;
    } 

    private createRequestHeader() {
        let headers = new HttpHeaders({
            "AuthKey": "my-key",
            "AuthToken": "my-token",
            "Content-Type": "application/json",
         });

        return headers;
    }

    getCourseData(): Observable<Array<CoursesModel>> {
        let headers = this.createRequestHeader();
        let courseString = getString("timetable_id");

        return this._updateAvailable.pipe(flatMap((data) => {
            if (data.updatable) {
                return this.http
                    .get<Array<CoursesModel>>(this.coursesUrl + eventQuery + courseString, { headers: headers })
                    .pipe(finalize(() => {
                        localStorage.setItem(LSOBJECTS.LASTUPDATED, data.time);
                    }), map((finalData) => {
                        localStorage.setItemObject(LSOBJECTS.MODULEPLAN, finalData);
                        console.log('saved moduleplan to localStorage');
                        return finalData;
                    }));
            } else {
                console.log('moduleplan from localstorage');
                return of(this.localCourseData);             
            }
        }));
    }

    getSpecificCourseData(courseId: string): Observable<CoursesModel[]> {
        let headers = this.createRequestHeader();
        return this.http.get<Array<CoursesModel>>(this.coursesUrl + eventQuery + courseId, { headers: headers });
    }

}