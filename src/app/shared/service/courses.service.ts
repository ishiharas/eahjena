import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of, forkJoin } from "rxjs";
import { CoursesModel } from "../model/courses.model";
import { TimestampService } from "./timestamp.service";
import { LSOBJECTS } from "../ls-objects";
import { flatMap, finalize, map, tap } from "rxjs/operators";
import { courses, eventQuery } from "../config";
import { getString } from "tns-core-modules/application-settings/application-settings";
import * as localStorage from 'nativescript-localstorage';

@Injectable()
export class CoursesService {
    private coursesUrl: string = courses;
    private localCourseData: CoursesModel[] = localStorage.getItem(LSOBJECTS.MODULEPLAN);

    private _additionalModule: { courseID: string, moduleId: string[], courseShortString?: string}[] = localStorage.getItem(LSOBJECTS.ADDITIONALMODULES);
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

    getCourseData(): Observable<CoursesModel[]> {
        let headers = this.createRequestHeader();
        let courseString = getString("timetable_id");

        return this._updateAvailable.pipe(flatMap((data) => {
            if (data.updatable) {
                let baseRequest = this.http
                    .get<Array<CoursesModel>>(this.coursesUrl + eventQuery + courseString, { headers: headers });
                if (this._additionalModule) {
                    let additionalForked: Observable<CoursesModel[]>[] = [];
                    additionalForked.push(baseRequest);
                    this._additionalModule.forEach((obj) => { 
                        additionalForked.push(this.getSpecificModules(obj.courseID, obj.moduleId));
                    });

                    return forkJoin(additionalForked)
                        .pipe(map(response => response
                                .reduce((a, b) => {
                                    b.forEach((item) => {
                                        let f = a.find((i) => i.weekInYear == item.weekInYear);
                                        let f_ind = a.findIndex((i) => i.weekInYear == item.weekInYear);
                                        if (f) {
                                            item.weekdays.forEach((week) => {
                                                let f2 = f.weekdays.find((i) => i.dayInWeek == week.dayInWeek);
                                                let f2_ind = f.weekdays.findIndex((i) => i.dayInWeek == week.dayInWeek);
                                                if (f2) {
                                                    if (week.events.length) {
                                                        a[f_ind].weekdays[f2_ind].events =
                                                            a[f_ind].weekdays[f2_ind].events.concat(week.events);
                                                        a[f_ind].weekdays[f2_ind].events =
                                                            this.sortByKey(a[f_ind].weekdays[f2_ind].events, 'startDate');
                                                    }
                                                } else {
                                                    a[f_ind].weekdays.push(week);
                                                    a[f_ind].weekdays = this.sortByKey(a[f_ind].weekdays, 'dayInWeek');
                                                }
                                            });
                                        } else {
                                            a.push(item);
                                            a = this.sortByKey(a, 'weekInYear');
                                        };
                                    });
                                    return a;
                                })))
                        .pipe(finalize(() => {
                                localStorage.setItem(LSOBJECTS.LASTUPDATED, data.time);
                            }), map((finalData) => {
                                localStorage.setItemObject(LSOBJECTS.MODULEPLAN, finalData);
                                console.log('saved moduleplan to localStorage');
                                return finalData;
                            }));
                } else {
                    return baseRequest.pipe(finalize(() => {
                        localStorage.setItem(LSOBJECTS.LASTUPDATED, data.time);
                    }), map((finalData) => {
                        localStorage.setItemObject(LSOBJECTS.MODULEPLAN, finalData);
                        console.log('saved moduleplan to localStorage');
                        return finalData;
                    }));
                }
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

    getSpecificModules(splusID: string, moduleIDs: string[]): Observable<CoursesModel[]> {
        let headers = this.createRequestHeader();

        return this.http.get<CoursesModel[]>(this.coursesUrl + eventQuery + splusID, { headers: headers })
            .pipe(map((mainModel) => {
                return mainModel.map((models) => {
                    models.weekdays.map((weeks) => {
                        weeks.events = weeks.events
                            .filter((events) => moduleIDs.some(obj => {
                                events.added = true;
                                return events.uid.startsWith(obj)
                            }));
                        return weeks;
                    });
                    models.weekdays =
                        models.weekdays.filter((filteredWeek) => filteredWeek.events.length ? true : false);
                    return models;
                }).filter((filteredModel) => filteredModel.weekdays.length ? true : false);
            }));
    }

    sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };

}