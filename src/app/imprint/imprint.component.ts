import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef } from "@angular/core";
import { imprint } from "../shared/config";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer, DrawerTransitionBase, PushTransition } from 'nativescript-ui-sidedrawer';
import { Page } from "tns-core-modules/ui/page/page";
import { WebView, LoadEventData } from "tns-core-modules/ui/web-view";


@Component({
    selector: "Imprint",
    moduleId: module.id,
    templateUrl: "./imprint.component.html",
	styleUrls: ['./imprint.component.css']
})
export class ImprintComponent implements AfterViewInit {
    @ViewChild("webview") webViewElement: ElementRef;

    public webViewSrc = imprint;
    public drawerLocation: string = "Left";
    
    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;
    private _sideDrawerTransition: DrawerTransitionBase;
    private requestFinished: boolean = false;
        
    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    set sideDrawerTransition(value: DrawerTransitionBase) {
        this._sideDrawerTransition = value;
    }
 
    constructor(private page: Page, 
        private _changeDetectionRef: ChangeDetectorRef) {

    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._sideDrawerTransition = new PushTransition();
        this._changeDetectionRef.detectChanges();
    }

    openDrawer(position) {
        this.drawerLocation = position;
        setTimeout(() => this.drawer.showDrawer(), 5);
    }

    closeDrawer() {
        this.drawer.closeDrawer();
    }   

    public onLoadFinished(args: LoadEventData) {
        if (!args.error) {
            this.requestFinished = true;
        } else {
            this.requestFinished = false;
        }
    }

}
