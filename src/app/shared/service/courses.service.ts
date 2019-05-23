import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { CoursesModel } from "../model/courses.model";
import { TimestampService } from "./timestamp.service";
import { LSOBJECTS } from "../ls-objects";
import { flatMap, finalize } from "rxjs/operators";
import { courses, eventQuery } from "../../selector/shared/config";
import { getString } from "tns-core-modules/application-settings/application-settings";
import * as localStorage from 'nativescript-localstorage';

@Injectable()
export class CoursesService {
    private coursesUrl: string = courses;
    private _courseData: Observable<Array<CoursesModel>>;
    private _localCourseData: Observable<Array<CoursesModel>> = localStorage.getItem(LSOBJECTS.MODULEPLAN);
    private _updateAvailable: Observable<{ updatable: boolean, time: Date }>;

    constructor(
        private http: HttpClient,
        private _timestampService: TimestampService) { 
            this._updateAvailable = _timestampService._updateAvailable;
    } 

    getCourseData(courseId?: string): Observable<Array<CoursesModel>> {
        let headers = this.createRequestHeader();
        let courseString = !courseId ? getString("timetable_id") : courseId;
        let localCourseData: Observable<Array<CoursesModel>> = localStorage.getItem(LSOBJECTS.MODULEPLAN);

        return this._updateAvailable.pipe(flatMap((data) => {
            if (data.updatable) {

                this._courseData = this.http
                    .get<Array<CoursesModel>>(this.coursesUrl + eventQuery + courseString, { headers: headers })
                    .pipe(finalize(() => {
                        localStorage.setItem(LSOBJECTS.LASTUPDATED, data.time);
                    }));

                localStorage.setItemObject(LSOBJECTS.MODULEPLAN, this._courseData);
                console.log('passed local data with refresh');

                this._localCourseData = localStorage.getItem(LSOBJECTS.MODULEPLAN);
                return this._localCourseData;
            } else {
                console.log('passed local data without refresh');
                let localCourseData: Observable<Array<CoursesModel>> = localStorage.getItem(LSOBJECTS.MODULEPLAN);
                return localCourseData;             
            }
        }))
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