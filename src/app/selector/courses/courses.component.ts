import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectorService } from '../shared/selector.service';
import { finalize } from 'rxjs/operators';
import { Selection } from '../shared/selection.model';
import { CourseData } from '../shared/courseData.model';
import { Course } from '../shared/course.model';
import { Term } from '../shared/term.model';
import { Group } from '../shared/group.model';
import { action } from 'tns-core-modules/ui/dialogs/dialogs';
import { setString } from "tns-core-modules/application-settings";


@Component({
	selector: 'courses',
	templateUrl: './courses.component.html',
	styleUrls: ['../selector.component.css'],
	moduleId: module.id,
	providers: [SelectorService]
})
export class CoursesComponent implements OnInit {
    @Output() selectedID = new EventEmitter<string>();
    @Output() selected = new EventEmitter<boolean>();
    public didSelect: boolean = false;

    public actionOptions: Array<string> = [];
    public selection: Selection = {};

    public _isLoading: boolean = false;
    public _courseData: CourseData;

    public options = {
        title: "",
        message: "Du hast die Auswahl aus folgenden Optionen.",
        cancelButtonText: "Abbrechen",
        actions: this.actionOptions
    };
    
	constructor(private _selectorService: SelectorService) {
	}

	ngOnInit() {
        this.extractData();
        this.selected.emit(false);
    }

    extractData(): void {
        this._isLoading = true;

        this._selectorService.getCourseData()
            .pipe(finalize(() => this._isLoading = false))
            .subscribe((result: CourseData) => {
                this._courseData = result;
                this._isLoading = false;
            }, (error) => console.log(error));
    }

    getCourses(): Array<Course> {
        const _courses: Array<Course> = [];

        this._courseData.courseOfStudies.forEach((element) => {
            _courses.push(element);
        });
        return _courses;
    }

    getTerms(courseIndex: number): Array<Term> {
        const _terms: Array<Term> = [];

        this.getCourses()[courseIndex].terms.forEach((element) => {
            _terms.push(element);
        });
        return _terms;
    }

    getGroups(courseIndex: number, termIndex: number): Array<Group> {
        const _groups: Array<Group> = [];
        
        this.getTerms(courseIndex)[termIndex].studyGroups.forEach((element) => {
            _groups.push(element);
        })
        return _groups;
    }

    getCourseID(courseIndex: number, termIndex: number, groupIndex: number): string {
        const _courseID: string = 
            this.getGroups(courseIndex, termIndex)[groupIndex].timetableId
        return _courseID;
    }

    showDialogCourses(): void {
        this.options.title = "Wähle deinen Studiengang";
        
        this.selection = {};
        this.selectedID.emit(null);
        this.selected.emit(false);
        this.actionOptions.length = 0;
        this.getCourses().forEach(course => {
            this.actionOptions.push(course.title);
        });
        this.actionOptions.sort();

        action(this.options).then((result) => {
            if (result !== this.options.cancelButtonText) {

                this.selection.course = result;
                this.selection.course_index =
                    this.getCourses().map((element) => {
                        return element.title
                    }).indexOf(result);  
            };
        });
    }

    showDialogTerms(): void {
        this.options.title = "Wähle dein Semester";

        this.actionOptions.length = 0;
        this.selection.term = null;
        this.selection.group = null;
        this.selection.saveSelection = false;
        this.selectedID.emit(null);
        this.selected.emit(false);


        if (this.selection.course) {

            this.getTerms(this.selection.course_index).forEach((element) => {
                this.actionOptions.push(element.title);
            })
            action(this.options).then((result) => {
                if (result !== this.options.cancelButtonText) {
                    this.selection.term = result;
                    this.selection.term_index =
                        this.getTerms(this.selection.course_index)
                            .map((element) => {
                                return element.title
                            }).indexOf(result);  
                };
            });
        } else {
            alert({
                title: "Hinweis",
                message: "Um fortfahren zu können, muss zuerst ein Studiengang ausgewählt werden.",
                okButtonText: "Ok"});
        }
    }

    showDialogGroups(): void {
        this.options.title = "Wähle deine Setgruppe";

        this.actionOptions.length = 0;
        this.selection.group = null;
        this.selectedID.emit(null);
        this.selected.emit(false);

        if (this.selection.term) {
            this.getGroups(this.selection.course_index, this.selection.term_index).forEach((element) => {
                this.actionOptions.push(element.title);
            })
    
            action(this.options).then((result) => {
                if (result !== this.options.cancelButtonText) {
                    this.selection.group = result;
                    this.selection.group_index =
                        this.getGroups(this.selection.course_index, this.selection.term_index)
                            .map((element) => {
                                return element.title
                            }).indexOf(result);  
                    this.selection.timetableId =
                        this.getCourseID(this.selection.course_index, this.selection.term_index, this.selection.group_index);
                    
                    this.selected.emit(true);
                    this.selectedID.emit(this.selection.timetableId)
                    setString("timetable_id", this.selection.timetableId);
                };
            });
        } else {
            alert({
                title: "Hinweis",
                message: "Um fortfahren zu können, muss zuerst ein Semester ausgewählt werden.",
                okButtonText: "Ok"});
        }

    }

}
