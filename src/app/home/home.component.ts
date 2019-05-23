import { Component, AfterViewInit, ViewChild, ChangeDetectorRef } from "@angular/core";

import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer, DrawerTransitionBase, PushTransition } from 'nativescript-ui-sidedrawer';
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

registerElement('CardView', () => CardView);

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
	styleUrls: ['./home.component.css'],
    providers: [CoursesService, CanteensService]
})
export class HomeComponent implements AfterViewInit {
    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;
    private _sideDrawerTransition: DrawerTransitionBase;
    public _courses: Array<CoursesDayModel> = [];
    public _isLoadingCourses: boolean = false;
    public _canteens: Array<CanteensModel[]> = [];
    public _isLoadingCanteens: boolean = false;


    public today: string = formatDate(new Date(), 'EE, dd.MM.yyyy', 'en');
    public todayDate: Date = new Date();
    public drawerLocation: string = "Left";
    public currentTransition: string;
    public isAndroid = isAndroid;
    public isIos = isIOS;
    public status = "not scrolling";

    constructor(private page: Page, 
        private _changeDetectionRef: ChangeDetectorRef,
        private _coursesService: CoursesService,
        private _canteensService: CanteensService) {
    }

    ngOnInit(): void {
        this.extractCoursesData();
        this.extractCanteensData();
        this.page.actionBarHidden = true;
        setString("activatedUrl", "/home");
    }

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._sideDrawerTransition = new PushTransition();
        this._changeDetectionRef.detectChanges();
    }

    extractCoursesData(): void {
        this._isLoadingCourses = true;

        this._coursesService.getCourseData()
            .pipe(finalize(() => this._isLoadingCourses = false))
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
    
    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    set sideDrawerTransition(value: DrawerTransitionBase) {
        this._sideDrawerTransition = value;
    }

    openDrawer(position) {
        this.drawerLocation = position;
        setTimeout(() => this.drawer.showDrawer(), 5);
    }

    closeDrawer() {
        this.drawer.closeDrawer();
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
