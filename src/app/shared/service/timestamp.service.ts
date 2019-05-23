import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { courses } from "../../selector/shared/config";
import { CourseData } from "~/app/selector/shared/courseData.model";
import { Observable, of } from "rxjs";
// import { MONTHS } from "../months";
import { map, catchError } from "rxjs/operators";
import { LSOBJECTS } from "../ls-objects";
import * as localStorage from 'nativescript-localstorage';

@Injectable()
export class TimestampService {
    // service gets last modified timestamp and returns boolean dependant on
    // a) if lastupdated already in localstorage AND different than last time
    // b) if no val in localstorage than >> true for available update

    private coursesUrl: string = courses;
    public _updateAvailable: Observable<{ updatable: boolean, time: string }>;

    constructor(private http: HttpClient) { 
        this._updateAvailable = this.getLastModifiedData();
    }

    getLastModifiedData(): Observable<{ updatable: boolean, time: string }> {
        let headers = this.createRequestHeader();

        return this.http
            .get<CourseData>(this.coursesUrl, { headers: headers })
            .pipe(map(
                (data: CourseData) => {
                    // let dateTemp: string[] = data.modified.split(' ')
                    // let day: number = Number(dateTemp[1]);
                    // let month = MONTHS.find(abbrev => abbrev.string === dateTemp[2]);
                    // let year: number = Number(dateTemp[3]);

                    // let timeTemp: string[] = dateTemp[4].split(':');
                    // let hours: number = Number(timeTemp[0]);
                    // let minutes: number = Number(timeTemp[1]);
                    // let seconds: number = Number(timeTemp[2]);

                    // let finalDate: Date = new Date(year, month.id, day, hours, minutes, seconds);

                    let ls = localStorage.getItem(LSOBJECTS.LASTUPDATED);
                    if (ls) {
                        return { updatable: (ls == data.modified) ? false : true, time: data.modified };
                    } else {
                        return { updatable: true, time: data.modified };
                    }
                }
            ))
            .pipe(catchError(
                (err: any) => {
                    console.log('update check failed: ' + err)
                    return of( { updatable: false, time: null } )
                }
            ));
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