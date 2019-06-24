import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from "@angular/core";

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Page, isAndroid, isIOS } from "tns-core-modules/ui/page/page";
import { CoursesService } from "../shared/service/courses.service";
import { registerElement } from 'nativescript-angular/element-registry';
import { CardView } from 'nativescript-cardview';
import { finalize } from "rxjs/operators";
import { CoursesModel } from "../shared/model/courses.model";
import { CoursesDayModel } from "../shared/model/courses-day.model";
import { formatDate } from "@angular/common";
import { CanteensService } from "../shared/service/canteens.service";
import { CanteensModel } from "../shared/model/canteens.model";
import { INGREDIENTS } from "../shared/ingredients";
import { setString } from "tns-core-modules/application-settings/application-settings";
import { ScrollEventData } from "tns-core-modules/ui/scroll-view";
import * as app from "tns-core-modules/application";

registerElement('CardView', () => CardView);

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
	styleUrls: ['./home.component.css'],
    providers: [CoursesService, CanteensService]
})
export class HomeComponent implements OnInit {
    public _courses: Array<CoursesDayModel> = [];
    public _isLoadingCourses: boolean = true;
    public _canteens: Array<CanteensModel[]> = [];
    public _isLoadingCanteens: boolean = true;

    public today: string = formatDate(new Date(), 'EE, dd.MM.yyyy', 'en');
    public todayDate: Date = new Date();
    public isAndroid = isAndroid;
    public isIos = isIOS;
    public status = "not scrolling";

    public renderView = false;
    public isBusy = true;
    public renderViewTimeout: any;

    constructor(private page: Page,
        private _coursesService: CoursesService,
        private _canteensService: CanteensService) {
    }

    ngOnInit(): void {
        this.extractCoursesData();
        this.extractCanteensData();
        this.page.actionBarHidden = true;
        setString("activatedUrl", "/home");
    }

    ngAfterContentInit() {
            this.renderViewTimeout = setTimeout(() => {
                this.renderView = true;
            }, 300);
    }

    ngOnDestroy() {
        if (isAndroid) {
            clearTimeout(this.renderViewTimeout);
        }
    }
     
    get loadingAndUi(): boolean {
        if (!this.renderView && this._isLoadingCourses) {
            return true;
        }
        return false;
    }

    extractCoursesData(): void {
        this._coursesService.getCourseData()
            .subscribe((result: Array<CoursesModel>) => {
                result[0].weekdays[0].events.forEach((event) => {
                    this._courses.push(event);
                })
                this._isLoadingCourses = false;
            }, (error) => console.log(error));
    }

    extractCanteensData(): void {
        this._isLoadingCanteens = true;

        this._canteensService.getCanteensData()
        .pipe(finalize(() => this._isLoadingCanteens = false))
        .subscribe((result: Array<Array<CanteensModel>>) => {
            result.forEach((canteen, index) => {
                this._canteens.push([]);
                canteen.forEach((food) => {
                    if (canteen[0].date == food.date) {
                        this._canteens[index].push(food);
                    }
                });
            });
            this._isLoadingCanteens = false;
        }, (error) => console.log(error));
    }

    openDrawer(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    public onScroll(args: ScrollEventData) {
        this.status = "scrolling";

        setTimeout(() => {
            this.status = "not scrolling";
        }, 300);

        console.log("scrollX: " + args.scrollX);
        console.log("scrollY: " + args.scrollY);
    }

    hint(ingredients: string) {
        if (ingredients.trim()) {
            let transformed: Array<string> = [];
            if (ingredients.includes('/')) {
                ingredients.trim().split('/')
                    .forEach((str: string) => {
                        str.split(':')[1].split(',').forEach((ingredient) => {
                            transformed.push(ingredient);
                        });
                    })
            } else if (ingredients.includes(',')) {
                ingredients.trim().split(',')
                    .forEach((str: string) => {
                        transformed.push(str);
                    })
            };
    
            const newTransform = transformed.map((ingredient: string) => {
                const result = INGREDIENTS.find(abbrev => abbrev.id === ingredient);
                if (result) {
                    return result.description;
                } else {
                    return ingredient;
                }
            });

            let newMessage: string = ""; 
            newTransform.forEach((ingredient, index) => {
                if (index == 0) {
                    newMessage = "• " + ingredient;
                } else {
                    newMessage = newMessage + "\n" + "• " + ingredient
                }
            })

            let options = {
                title: "Inhalt",
                message: newMessage,
                okButtonText: "Ok"
            };
            alert(options);
        }

    }

}
