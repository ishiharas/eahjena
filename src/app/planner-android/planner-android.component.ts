import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { Page, EventData } from "tns-core-modules/ui/page/page";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { CoursesService } from "../shared/service/courses.service";
import { CoursesModel } from "../shared/model/courses.model";
import { formatDate } from "@angular/common";
import { SwipeDirection, SwipeGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { ScrollView, ScrollEventData } from "tns-core-modules/ui/scroll-view/scroll-view";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { TabView } from "tns-core-modules/ui/tab-view/tab-view";
import { isAndroid, isIOS, screen } from "tns-core-modules/platform";
import * as dialogs from "tns-core-modules/ui/dialogs"
import { RouterExtensions } from "nativescript-angular/router";
import * as app from "tns-core-modules/application";
import { timer } from "rxjs";
import { PanGestureEventData } from "tns-core-modules/ui/gestures";


@Component({
    selector: "PlannerAndroid",
    moduleId: module.id,
    templateUrl: "./planner-android.component.html",
	styleUrls: ['./planner-android.component.css'],
    providers: [CoursesService]
})
export class PlannerAndroidComponent implements OnInit  {
    public screenWidth: number = screen.mainScreen.widthDIPs;

    public _coursesAllweeks: Array<CoursesModel> = [];
    public _coursesWeekList: any[] = [];

    public _isLoadingCourses: boolean = true;
    public today: string = formatDate(new Date(), 'EE, dd.MM.yyyy', 'en');
    public todayDate: Date = new Date();
    public swipeLeft = false;
    public swipeRight = false;
    public isAndroid = isAndroid;
    public isIos = isIOS;
    
    @ViewChild("tabbarScroll", { static: false }) sv: ElementRef;
    @ViewChild("tabbarStack", { static: false }) stc: ElementRef;
    @ViewChild("pageScroll", { static: false }) psc: ElementRef;
    @ViewChild("tabviewSelector", { static: false }) tvs: ElementRef;
    public tabbarStackview: StackLayout;
    public tabbarScrollview: ScrollView;
    public pageScrollview: ScrollView;
    public tabview: TabView;

    public tabbarSelected: number = 0;
    public tabbarSelectedKW: number = 1;
    public tabbarHidden: boolean = false;
    public lastScrollPosition: number = 0;

    public renderView = false;
    public renderViewTimeout: any;

    public deltaX: number;
    public deltaY: number;
    public state: number;

    constructor(private page: Page,
        private _router: RouterExtensions,
        private _coursesService: CoursesService) {
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.tabbarHidden = false;
        this.extractCoursesData();
    }


    ngAfterContentInit() {
        if (isAndroid) {
            this.renderViewTimeout = setTimeout(() => {
                this.renderView = true;
            }, 500);
        } else {
            this.renderViewTimeout = setTimeout(() => {
                this.renderView = true;
            }, 200);
        }
    }

    ngOnDestroy() {
        clearTimeout(this.renderViewTimeout);
    }

    get loadingAndUi(): boolean {
        if (this.renderView) {
            if (!this._isLoadingCourses) {
                return false;
            }
            return true;
        }
        return true;
    }

    openDrawer(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    tabbarTapped(args, kw: number): void {
        this.tabbarSelected = args;
        this.tabbarSelectedKW = kw;
    }

    hideMoreButtonTabview(): void {
        this.tabview = this.tvs.nativeElement;
        const nativeIosTabview = this.tabview.ios as UITabBarController;
        nativeIosTabview.moreNavigationController.navigationBarHidden = true;
    }

    onSwipe(event: SwipeGestureEventData) {
        if (this.isIos) {
            let swipeEnabled = !this.swipeLeft && !this.swipeRight;
            let courseSize = this._coursesAllweeks.length - 1;
            
            if (event.direction === SwipeDirection.left) {
                if (this.tabbarSelected < courseSize && swipeEnabled) {
                    this.tabbarSelected++;

                    this.swipeLeft = true;
                    setTimeout(() => { this.swipeLeft = false; }, 500);

                    let selectedKW = this._coursesAllweeks[this.tabbarSelected].weekInYear;
                    setTimeout(() => { this.tabbarSelectedKW = selectedKW; }, 125);
                }
            } else if (event.direction === SwipeDirection.right) {
                if (this.tabbarSelected > 0 && swipeEnabled) {
                    this.tabbarSelected--;
    
                    this.swipeRight = true;
                    setTimeout(() => { this.swipeRight = false; }, 500);

                    let selectedKW = this._coursesAllweeks[this.tabbarSelected].weekInYear;
                    setTimeout(() => { this.tabbarSelectedKW = selectedKW; }, 125);
                }
            } 
        }
    }

    onScroll(args: ScrollEventData) {
        this.pageScrollview = this.psc.nativeElement;
        if ((args.scrollY - this.lastScrollPosition) > 10 || (args.scrollY - this.lastScrollPosition) < -10) {
            if (this.lastScrollPosition > args.scrollY || this.lastScrollPosition <= 0) {
                if (this.pageScrollview.scrollableHeight == 0) {
                    this.tabbarHidden = false;
                } else if (this.pageScrollview.scrollableHeight <= args.scrollY) {
                    this.tabbarHidden = true;
                } else {
                    this.tabbarHidden = false;
                }
                this.lastScrollPosition = args.scrollY;
            } else if (this.lastScrollPosition < args.scrollY) {
                this.tabbarHidden = true;
                this.lastScrollPosition = args.scrollY;
            }
        }
    }

    tabbarIndexScroll() {
        this.tabbarScrollview = this.sv.nativeElement;
        this.tabbarStackview = this.stc.nativeElement;

        this.tabbarScrollview.scrollToHorizontalOffset(
            this.tabbarStackview.getActualSize().width * (this.tabbarSelected - 1), true);
    }

    extractCoursesData(): void {
        this._coursesService.getCourseData()
            .subscribe((result: Array<CoursesModel>) => {
                this._coursesAllweeks = result;
                this.tabbarSelectedKW = result[0].weekInYear;
                this._isLoadingCourses = false;
            }, (error) => console.log(error));
    }

    onTabViewLoaded(event: EventData) {
        const tabView = <TabView>event.object;

        if (isIOS) {
          tabView.viewController.tabBar.hidden = true;
        }

        if (isAndroid) {
            tabView.android.removeViewAt(1);
        }
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        this.tabbarSelected = args.newIndex;
        this.tabbarSelectedKW = this._coursesAllweeks[this.tabbarSelected].weekInYear;

        if (this.isIos && (this.tabbarSelected > 3)) {
            this.hideMoreButtonTabview();
        }

        if (this.tabbarSelected > 0) {
            this.tabbarIndexScroll();
        }
    }
    

    // showLessonsDialog(weekday: number, course: number, coursecontent: any): void {
    //     let singleEvent = "Nur dieses Ereignis";
    //     let allEvents = "Alle Ereignisse in der Reihe";
    //     let eventUid = this._coursesWeekList[weekday].events[course].uid;
    //     let eventUidAll = this._coursesWeekList[weekday].events[course].uid.split('-')[0];
    //     console.log(coursecontent)
    //     dialogs.action({
    //         message: "Ereignis löschen",
    //         cancelButtonText: "Abbrechen",
    //         actions: [singleEvent, allEvents]
    //     }).then(result => {
    //         console.log("Dialog result: " + result);
    //         if(result == singleEvent){
    //             this._coursesAllweeks.forEach((week) => {
    //                 week.weekdays.forEach((day, daysIndex, daysArr) => {
    //                     day.events.forEach((event, eventsIndex, eventsArr) => {
    //                         if (event.uid == eventUid) {
    //                             if (daysArr.length == 1 && eventsArr.length == 1) {
    //                                 this._coursesAllweeks.splice(daysIndex, 1);
    //                             }else if (eventsArr.length == 1) {
    //                                 this._coursesAllweeks[this.tabbarSelected].weekdays.splice(weekday, 1);
    //                             } else {
    //                                 this._coursesAllweeks[this.tabbarSelected].weekdays[weekday].events.splice(course, 1);
    //                             }
    //                         }
    //                     });
    //                 });
    //             })
    //         }else if(result == allEvents){
    //             let intro: string = " wird von den folgenden Daten gelöscht: \n";
    //             let content: string = "";
    //             let contentCollected: Array<string> = [];

    //             this._coursesAllweeks.forEach((week) => {
    //                 week.weekdays.forEach((day) => {
    //                     day.events.forEach((event) => {
    //                         if (event.uid.startsWith(eventUidAll)) {
    //                             content = event.shortTitle;
    //                             contentCollected.push('\n' + event.date);
    //                         }
    //                     });
    //                 });
    //             })

    //             dialogs.confirm({
    //                 title: "Bestätigen",
    //                 message: content + intro + contentCollected,
    //                 okButtonText: "Ok",
    //                 cancelButtonText: "Abbrechen"
    //             }).then(result => {
    //                 if (result) {
    //                     this._coursesAllweeks.forEach((week, weekIndex) => {
    //                         week.weekdays.forEach((day, dayIndex, daysArr) => {
    //                             day.events.forEach((event, eventIndex, eventsArr) => {
    //                                 if (event.uid.startsWith(eventUidAll)) {
    //                                     if (daysArr.length == 1 && eventsArr.length == 1) {
    //                                         this._coursesAllweeks.splice(dayIndex, 1);
    //                                     }else if (eventsArr.length == 1) {
    //                                         this._coursesAllweeks[weekIndex].weekdays.splice(dayIndex, 1)
    //                                     } else {
    //                                         this._coursesAllweeks[weekIndex].weekdays[dayIndex].events.splice(eventIndex, 1);
    //                                     }
    //                                 }
    //                             });
    //                         });
    //                     })
    //                 }

    //             });
    //         }
    //     });
    // }

    openPlannerEdit(): void {
        this._router.navigate(['planner-edit'], {
            animated: true,
            transition: {
                name: 'slideLeft'
            }
        })
    }
    
}
