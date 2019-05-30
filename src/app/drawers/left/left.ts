import { Component } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { RouterExtensions } from "nativescript-angular/router";
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