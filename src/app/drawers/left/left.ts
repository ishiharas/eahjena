import { Component, ViewChild } from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { filter } from "rxjs/operators";
import { RouterExtensions } from "nativescript-angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";
import { setString, getString } from "tns-core-modules/application-settings/application-settings";


@Component({
    moduleId: module.id,
    selector: "left-drawer",
    templateUrl: "left.html",
	styleUrls: ['left.css']
})
export class LeftDrawerComponent {
    private _activatedUrl: string;

    constructor(private router: Router, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject services.
    }

    ngOnInit(): void {
        this._activatedUrl = getString("activatedUrl");

        this.router.events
        .pipe(filter((event: any) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
            setString("activatedUrl", event.url);
        });
    }


    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {

        this.routerExtensions.navigate([navItemRoute], {

        });

    }
}