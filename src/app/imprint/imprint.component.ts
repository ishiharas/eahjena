import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { imprint } from "../shared/config";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Page } from "tns-core-modules/ui/page/page";
import { LoadEventData } from "tns-core-modules/ui/web-view";
import * as app from "tns-core-modules/application";


@Component({
    selector: "Imprint",
    moduleId: module.id,
    templateUrl: "./imprint.component.html",
	styleUrls: ['./imprint.component.css']
})
export class ImprintComponent implements OnInit {
    @ViewChild("webview") webViewElement: ElementRef;
    public webViewSrc = imprint;
    public requestFinished: boolean = false;
        
    constructor(private page: Page) {
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    openDrawer(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    public onLoadFinished(args: LoadEventData) {
        if (!args.error) {
            this.requestFinished = true;
        } else {
            this.requestFinished = false;
        }
    }

}
