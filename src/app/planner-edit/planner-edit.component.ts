import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";
import { CoursesService } from "../shared/service/courses.service";
import { finalize } from "rxjs/operators";
import { CoursesModel } from "../shared/model/courses.model";
import * as localStorage from 'nativescript-localstorage';
import { LSOBJECTS } from "../shared/ls-objects";
import { RouterExtensions } from "nativescript-angular/router";


@Component({
    selector: "PlannerEdit",
    moduleId: module.id,
	styleUrls: ['./planner-edit.component.css'],
    templateUrl: "./planner-edit.component.html",
    providers: [CoursesService]
})
export class PlannerEditComponent implements OnInit {
    public courseSelected: boolean;
    public checkSelection: boolean = false;
    public overlay: boolean = true;
    public emittedID: string;
    public lastEmittedId: string;
    public emittedIdString: string;
    public actuallyTapped: string;
    public markedIDs: Array<string> = [];

    public _courses = [];
    public _isLoadingCourses: boolean = false;

    public additionalModule: { courseID: string, moduleId: string[], courseShortString: string}[];

    constructor(private page: Page,
        private _coursesService: CoursesService,
        private _router: RouterExtensions) {
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.additionalModule = localStorage.getItem(LSOBJECTS.ADDITIONALMODULES);
    }

    onBackTap(): void {
        this.page.frame.goBack();
    }

    onSearchTap(): void {
        if (this.emittedID) {
            this.checkSelection = !this.checkSelection;
   
            if (this.overlay) {
                if (this.emittedID !== this.lastEmittedId) {
                    this.lastEmittedId = this.emittedID;
                    this.markedIDs = [];
                    this.extractCoursesData();

                    if (this.additionalModule) {
                        this.additionalModule.map((obj) => {
                            console.log('logs: \t', obj.courseID, '\t', this.emittedID);
                            if (obj.courseID == this.emittedID) {
                               this.markedIDs = obj.moduleId;
                            };
                        });
                    };

                }
                setTimeout(() => {
                    this.overlay = false;
                }, 500);
            } else {
                    this.overlay = !this.overlay;
            }

        } else {
            alert({
                title: "Hinweis",
                message: "Wähle einen Studiengang, der das gesuchte Modul beinhaltet.",
                okButtonText: "Ok"});
        }
    }

    extractCoursesData(): void {
        this._isLoadingCourses = true;

        this._coursesService.getSpecificCourseData(this.emittedID)
            .pipe(finalize(() => this._isLoadingCourses = false))
            .subscribe((result: Array<CoursesModel>) => {
                let listCollection = [];
                result.forEach((event) => {
                    event.weekdays.forEach(weekday => {
                        weekday.events.forEach((event) => {
                            console.log(event.title)
                            let titleManipulation = event.title.split('/');
                            let lastMan = titleManipulation.pop();
                            let restVar = titleManipulation.join('/');

                            if (!listCollection.find(k => k.categoryTitle == restVar)) {
                                let restShortVar;

                                if (event.shortTitle) {
                                    let titleShortManipulation = event.shortTitle.split('/');
                                    let lastShortMan = titleShortManipulation.pop();
                                    restShortVar = titleShortManipulation.join('/');
                                } else {
                                    restShortVar = event.title;
                                }

                                listCollection.push({
                                    uid: event.uid.split('-')[0],
                                    categoryTitle: restVar,
                                    categoryShortTitle: restShortVar,
                                    collectedEvents: []
                                })
                                console.log(event.uid, '', restVar, ' ', restShortVar, ' ')
                            }
                            let preIndex = listCollection.findIndex(k => k.categoryTitle == restVar);

                            if (!listCollection[preIndex].collectedEvents.find(k => k.uid == event.uid.split('-')[0])) {
                                listCollection[preIndex].collectedEvents.push({
                                    uid: event.uid.split('-')[0],
                                    title: event.title,
                                    shortTitle: event.shortTitle,
                                    dates: []
                                })
                            }

                            let actualIndex = listCollection[preIndex].collectedEvents.findIndex(k => k.uid == event.uid.split('-')[0]);
                            if (event.uid.startsWith(listCollection[preIndex].collectedEvents[actualIndex].uid)) {
                                listCollection[preIndex].collectedEvents[actualIndex].dates.push({
                                    date: event.date,
                                    day: event.dayOfWeek.slice(0, 2),
                                    startTime: event.startTime,
                                    endTime: event.endTime
                                })
                            }
                        });
                    })
                })
                listCollection.sort(function(a,b){
                    return a.categoryTitle.localeCompare(b.categoryTitle);
                })
                setTimeout(() => {
                    this._courses = listCollection;
                    this._isLoadingCourses = false;
                }, 1);
            }, (error) => console.log(error));
    }

    checkSelected(shortTitle: string): boolean {
        return this.actuallyTapped === shortTitle;
    }

    checkMarked(uid: string): boolean {
        return this.markedIDs.find(k => k === uid) ? true : false;
    }

    checkSaveState(): boolean {
        // return this.markedIDs[0] ? true : false;
        return this.overlay ? false : true;
    }

    markTapped(uid: string, empty: boolean, i: number): void {
        if (empty) {
            this._courses[i].collectedEvents.forEach(element => {
                this.markedIDs.push(element.uid);
            });
        } else {
            this._courses[i].collectedEvents.forEach(element => {
                this.markedIDs.splice(this.markedIDs.findIndex(k => k === element.uid), 1);
            });
        }
    }

    shortTitleTapped(shortTitle: string): void {
        if (this.actuallyTapped !== shortTitle) {
            this.actuallyTapped = shortTitle;
        } else {
            this.actuallyTapped = "";
        }
    }

    onSaveSelectionTap(): void {
        if (!this.additionalModule) {
            this.additionalModule = [];
            if (this.markedIDs && this.markedIDs.length) {
                this.additionalModule.push({
                    courseID: this.emittedID,
                    moduleId: this.markedIDs,
                    courseShortString: this.emittedIdString
                });
            }
            localStorage.setItemObject(LSOBJECTS.ADDITIONALMODULES, this.additionalModule);
            localStorage.removeItem(LSOBJECTS.LASTUPDATED);
        } else {
            let found: boolean = false;
            this.additionalModule.map((obj, index) => {
                if (obj.courseID == this.emittedID) {
                    obj.moduleId = this.markedIDs;
                    found = true;
                    if (!obj.moduleId || !obj.moduleId.length) {
                        this.additionalModule.splice(index, 1);
                    };
                    return obj;
                } else {
                    return obj;
                }
            });
            if (!found) {
                if (this.markedIDs && this.markedIDs.length) {
                    this.additionalModule.push({
                        courseID: this.emittedID,
                        moduleId: this.markedIDs,
                        courseShortString: this.emittedIdString
                    });
                }
            };
            localStorage.setItemObject(LSOBJECTS.ADDITIONALMODULES, this.additionalModule);
            localStorage.removeItem(LSOBJECTS.LASTUPDATED);
            if (!this.additionalModule[0]) {
                console.log('additionalModule is empty and gets deleted');
                localStorage.removeItem(LSOBJECTS.ADDITIONALMODULES);
            };
        }

        this._router.navigate(['/planner'], {
            clearHistory: true,
            animated: true,
            transition: {
                name: "slideRight",
                duration: 300,
                curve: "easeIn"
            }
        });
        // -- Beginning of Logging Method
        // Method for printing out content of saveState Button
        // Useful for debugging different Savestates of Localstorage
        this.additionalModule.forEach(obj => {
            console.log('Storage Content of LSOBJECTS.ADDITIONALMODULES');
            console.log(obj.courseID);
            obj.moduleId.forEach(ob => {
                console.log('---\t' + ob);
            })
        });
        // -- End of Method
    }

}
