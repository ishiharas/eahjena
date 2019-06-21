import { Component, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";
import { RadSideDrawer, DrawerTransitionBase, PushTransition } from "nativescript-ui-sidedrawer";
import { CoursesService } from "../shared/service/courses.service";
import { finalize } from "rxjs/operators";
import { CoursesModel } from "../shared/model/courses.model";
import { formatDate } from "@angular/common";
import { SwipeDirection, SwipeGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { ScrollView, ScrollEventData } from "tns-core-modules/ui/scroll-view/scroll-view";
import { isAndroid, isIOS, screen } from "tns-core-modules/platform";
import * as dialogs from "tns-core-modules/ui/dialogs"
import { RouterExtensions } from "nativescript-angular/router";
import { of, Observable } from "rxjs";
import { CoursesWeekModel } from "../shared/model/courses-week.model";
import { RadListViewComponent } from "nativescript-ui-listview/angular/";
import { ListViewItemSnapMode } from "nativescript-ui-listview";

@Component({
    selector: "Planner",
    moduleId: module.id,
    templateUrl: "./planner.component.html",
	styleUrls: ['./planner.component.css'],
    providers: [CoursesService]
})
export class PlannerComponent implements AfterViewInit  {
    @ViewChild("myListView") myListViewComponent: RadListViewComponent;
    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;
    private _sideDrawerTransition: DrawerTransitionBase;
    public drawerLocation: string = "Left";
    public currentTransition: string;
    public screenWidth: number = screen.mainScreen.widthDIPs;
    public screenHeight: number = screen.mainScreen.heightDIPs;


    public _coursesAllweeks: Array<CoursesModel> = [];
    public _coursesWeekList: Array<CoursesWeekModel> = [];
    public _isLoadingCourses: boolean = false;
    public today: string = formatDate(new Date(), 'EE, dd.MM.yyyy', 'en');
    public todayDate: Date = new Date();
    public swipeLeft = false;
    public swipeRight = false;
    public isAndroid = isAndroid;
    public isIos = isIOS;
    
    @ViewChild("tabbarScroll") sv: ElementRef;
    @ViewChild("tabbarStack") stc: ElementRef;
    @ViewChild("pageScroll") psc: ElementRef;
    public tabbarStackview: StackLayout;
    public tabbarScrollview: ScrollView;
    public pageScrollview: ScrollView;
    public tabbarSelected: number = 0;
    public tabbarHidden: boolean = false;
    public lastScrollPosition: number = 0;
    private _myFilteringFunc: (item: any) => any;

    constructor(private page: Page,
        private _router: RouterExtensions,
        private _changeDetectionRef: ChangeDetectorRef,
        private _coursesService: CoursesService) {

    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.tabbarHidden = false;
        this.extractCoursesData();
        this._myFilteringFunc = (item: CoursesWeekModel) => {
            return item && item.weekOfYear == this._coursesAllweeks[this.tabbarSelected].weekInYear;
        };
    }

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._sideDrawerTransition = new PushTransition();
        this._changeDetectionRef.detectChanges();
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    set sideDrawerTransition(value: DrawerTransitionBase) {
        this._sideDrawerTransition = value;
    }

    get weekItems(): CoursesWeekModel[] {
        return this._coursesWeekList;
    }

    get myFilteringFunc(): (item: any) => any {
        return this._myFilteringFunc;
    }

    set myFilteringFunc(value: (item: any) => any) {
        this._myFilteringFunc = value;
    }
    
    openDrawer(position) {
        this.drawerLocation = position;
        setTimeout(() => this.drawer.showDrawer(), 5);
    }

    tabbarTapped(args): void {
        console.log("tabbar was tapped: " + args);
        this.tabbarSelected = args;

        this._myFilteringFunc = (item: CoursesWeekModel) => {
            return item && item.weekOfYear == this._coursesAllweeks[this.tabbarSelected].weekInYear;
        };
        this.myListViewComponent.listView.scrollWithAmount(- this.myListViewComponent.listView.getScrollOffset(), true);

        this.tabbarIndexScroll();
    }

    onSwipe(event: SwipeGestureEventData) {
        // this.pageScrollview = this.psc.nativeElement;
        if (event.direction === SwipeDirection.left) {
            console.log("swipe to the left triggered");
            if (this.tabbarSelected < this._coursesAllweeks.length - 1 && !this.swipeLeft && !this.swipeRight) {
                this.swipeLeft = true;
                setTimeout(() => {
                    this.swipeLeft = false;
                }, 500);
                setTimeout(() => {
                    // this.pageScrollview.scrollToVerticalOffset(0, false);
                    this.tabbarSelected = this.tabbarSelected + 1;
                    this._myFilteringFunc = (item: CoursesWeekModel) => {
                        return item && item.weekOfYear == this._coursesAllweeks[this.tabbarSelected].weekInYear;
                    };

                    this.myListViewComponent.listView.scrollWithAmount(- this.myListViewComponent.listView.getScrollOffset(), true);

                    this.tabbarIndexScroll();
                }, 100);
            }
        } else if (event.direction === SwipeDirection.right) {
            console.log("swipe to the right triggered");
            if (this.tabbarSelected > 0 && !this.swipeLeft && !this.swipeRight) {
                this.swipeRight = true;
                setTimeout(() => {
                    this.swipeRight = false;
                }, 500);
                setTimeout(() => {
                    // this.pageScrollview.scrollToVerticalOffset(0, false);
                    this.tabbarSelected = this.tabbarSelected - 1;
                    this._myFilteringFunc = (item: CoursesWeekModel) => {
                        return item && item.weekOfYear == this._coursesAllweeks[this.tabbarSelected].weekInYear;
                    };

                    this.myListViewComponent.listView.scrollWithAmount(- this.myListViewComponent.listView.getScrollOffset(), true);

                    this.tabbarIndexScroll();
                }, 100);
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

        if (this.screenWidth < this.tabbarStackview.getActualSize().width * this.tabbarSelected + this.tabbarStackview.getActualSize().width/2 || this.swipeRight) {
                this.tabbarScrollview.scrollToHorizontalOffset(
                    this.tabbarStackview.getActualSize().width * (this.tabbarSelected - 1), true);
        }
    }

    extractCoursesData(): void {
        this._isLoadingCourses = true;

        this._coursesService.getCourseData()
            .pipe(finalize(() => this._isLoadingCourses = false))
            .subscribe((result: Array<CoursesModel>) => {
                let collection = [];
                let collectionDays = [];

                result.forEach((event) => {
                    collection.push(event);
                    event.weekdays.forEach((day) => {
                        collectionDays.push({
                            name: day.name,
                            events: day.events,
                            dayInWeek: day.dayInWeek,
                            weekOfYear: day.events[0].weekOfYear
                        });
                    })
                    
                })
                setTimeout(() => {
                    this._coursesAllweeks = collection;
                    this._coursesWeekList = collectionDays;

                    this._isLoadingCourses = false;
                }, 1);
            }, (error) => console.log(error));
    }

    showLessonsDialog(weekday: number, course: number, coursecontent: any): void {
        let singleEvent = "Nur dieses Ereignis";
        let allEvents = "Alle Ereignisse in der Reihe";
        let eventUid = this._coursesAllweeks[this.tabbarSelected].weekdays[weekday].events[course].uid;
        let eventUidAll = this._coursesAllweeks[this.tabbarSelected].weekdays[weekday].events[course].uid.split('-')[0];
        console.log(coursecontent)
        dialogs.action({
            message: "Ereignis löschen",
            cancelButtonText: "Abbrechen",
            actions: [singleEvent, allEvents]
        }).then(result => {
            console.log("Dialog result: " + result);
            if(result == singleEvent){
                this._coursesAllweeks.forEach((week) => {
                    week.weekdays.forEach((day, daysIndex, daysArr) => {
                        day.events.forEach((event, eventsIndex, eventsArr) => {
                            if (event.uid == eventUid) {
                                if (daysArr.length == 1 && eventsArr.length == 1) {
                                    this._coursesAllweeks.splice(daysIndex, 1);
                                }else if (eventsArr.length == 1) {
                                    this._coursesAllweeks[this.tabbarSelected].weekdays.splice(weekday, 1);
                                } else {
                                    this._coursesAllweeks[this.tabbarSelected].weekdays[weekday].events.splice(course, 1);
                                }
                            }
                        });
                    });
                })
            }else if(result == allEvents){
                let intro: string = " wird von den folgenden Daten gelöscht: \n";
                let content: string = "";
                let contentCollected: Array<string> = [];

                this._coursesAllweeks.forEach((week) => {
                    week.weekdays.forEach((day) => {
                        day.events.forEach((event) => {
                            if (event.uid.startsWith(eventUidAll)) {
                                content = event.shortTitle;
                                contentCollected.push('\n' + event.date);
                            }
                        });
                    });
                })

                dialogs.confirm({
                    title: "Bestätigen",
                    message: content + intro + contentCollected,
                    okButtonText: "Ok",
                    cancelButtonText: "Abbrechen"
                }).then(result => {
                    if (result) {
                        this._coursesAllweeks.forEach((week, weekIndex) => {
                            week.weekdays.forEach((day, dayIndex, daysArr) => {
                                day.events.forEach((event, eventIndex, eventsArr) => {
                                    if (event.uid.startsWith(eventUidAll)) {
                                        if (daysArr.length == 1 && eventsArr.length == 1) {
                                            this._coursesAllweeks.splice(dayIndex, 1);
                                        }else if (eventsArr.length == 1) {
                                            this._coursesAllweeks[weekIndex].weekdays.splice(dayIndex, 1)
                                        } else {
                                            this._coursesAllweeks[weekIndex].weekdays[dayIndex].events.splice(eventIndex, 1);
                                        }
                                    }
                                });
                            });
                        })
                    }

                });
            }
        });
    }

    openPlannerEdit(): void {
        this._router.navigate(['planner-edit'], {
            animated: true,
            transition: {
                name: 'slideLeft'
            }
        })
    }
    
}
