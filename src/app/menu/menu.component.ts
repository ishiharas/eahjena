import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { CanteensService } from "../shared/service/canteens.service";
import { Page, isAndroid, isIOS } from "tns-core-modules/ui/page/page";
import { screen } from "tns-core-modules/platform";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { ScrollView, ScrollEventData } from "tns-core-modules/ui/scroll-view/scroll-view";
import { SwipeGestureEventData, SwipeDirection } from "tns-core-modules/ui/gestures/gestures";
import { CanteensModel } from "../shared/model/canteens.model";
import { INGREDIENTS } from "../shared/ingredients";
import { RouterExtensions } from "nativescript-angular/router";
import * as app from "tns-core-modules/application";


@Component({
    selector: "Menu",
    moduleId: module.id,
    templateUrl: "./menu.component.html",
	styleUrls: ['./menu.component.css'],
    providers: [CanteensService]
})
export class MenuComponent implements OnInit {
    public screenWidth: number = screen.mainScreen.widthDIPs;

    public _canteens = [];
    public _isLoadingCanteens: boolean = true;
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

    public renderView = false;
    public isBusy = true;
    public renderViewTimeout: any;

    constructor(private page: Page,
        private _canteensService: CanteensService,
        private _router: RouterExtensions) {
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.extractCanteensData();
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
        if (!this.renderView && this._isLoadingCanteens) {
            return true;
        }
        return false;
    }

    openDrawer(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    tabbarTapped(args): void {
        console.log("tabbar was tapped: " + args);
        this.tabbarSelected = args;
    }

    onSwipe(event: SwipeGestureEventData) {
        this.pageScrollview = this.psc.nativeElement;
        if (event.direction === SwipeDirection.left) {
            console.log("swipe to the left triggered");
            if (this.tabbarSelected < this._canteens.length - 1 && !this.swipeLeft && !this.swipeRight) {
                this.swipeLeft = true;
                setTimeout(() => {
                    this.swipeLeft = false;
                }, 500);
                setTimeout(() => {
                    this.pageScrollview.scrollToVerticalOffset(0, false);
                    this.tabbarSelected = this.tabbarSelected + 1;
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
                    this.pageScrollview.scrollToVerticalOffset(0, false);
                    this.tabbarSelected = this.tabbarSelected - 1;
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

    extractCanteensData(): void {
        this._canteensService.getCanteensData()
        .subscribe((result: Array<Array<CanteensModel>>) => {
            let days = [];
            result.forEach((canteen, index) => {

                canteen.forEach((food) => {
                    if (!days.find(k => k.date === food.date)) {
                        days.push({
                            date: food.date,
                            dateString: food.dateAsString,
                            dayString: food.dateAsString.split(',')[0],
                            dateShort: food.dateAsString.split(' ')[1] + ' ' + food.dateAsString.split(' ')[2],
                            canteens: []
                        });
                    }
                    let actualIndex = days.findIndex(k => k.date === food.date);

                    if (!days[actualIndex].canteens.find(
                            k => k.canteenName === food.mensaName)) {
                                days[actualIndex].canteens.push({
                                    canteenName: food.mensaName,
                                    food: []
                                });
                    }
                    days[actualIndex].canteens[days[actualIndex].canteens.findIndex(
                        k => k.canteenName === food.mensaName)].food.push(food);
                });
            });
            this._canteens = days;
            this._isLoadingCanteens = false;
            
        }, (error) => {console.log(error); this._isLoadingCanteens = true});
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

    openPlannerEdit(): void {
        this._router.navigate(['menu-edit'], {
            animated: true,
            transition: {
                name: 'slideLeft'
            }
        })
    }
}
