import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";
import { CoursesService } from "../shared/service/courses.service";
import { finalize } from "rxjs/operators";
import { CoursesModel } from "../shared/model/courses.model";


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
    public actuallyTapped: string;
    public markedIDs: Array<string> = [];

    public _courses = [];
    public _isLoadingCourses: boolean = false;

    constructor(private page: Page,
        private _coursesService: CoursesService) {

    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    onBackTap(): void {
        this.page.frame.goBack();
    }

    onSearchTap(): void {
        if (this.emittedID) {
            this.checkSelection = !this.checkSelection;
            this.markedIDs = [];
            if (this.overlay) {
                if (this.emittedID !== this.lastEmittedId) {
                    this.lastEmittedId = this.emittedID;
                    this.extractCoursesData();
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

        this._coursesService.getCourseData(this.emittedID)
            .pipe(finalize(() => this._isLoadingCourses = false))
            .subscribe((result: Array<CoursesModel>) => {
                let listCollection = [];
                result.forEach((event) => {
                    event.weekdays.forEach(weekday => {
                        weekday.events.forEach((event) => {
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
        return this.markedIDs[0] ? true : false;
    }

    markTapped(uid: string, empty: boolean): void {
        if (empty) {
            console.log('pushed id ' + uid)
            this.markedIDs.push(uid);
        } else {
            this.markedIDs.splice(this.markedIDs.findIndex(k => k === uid), 1);
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
        console.log('tapped on saveSelection');
    }
}
