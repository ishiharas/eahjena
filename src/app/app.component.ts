import { Component } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { getString, setString } from "tns-core-modules/application-settings/application-settings";
import { filter } from "rxjs/operators";
import { DrawerTransitionBase, RadSideDrawer, PushTransition } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
// import { PerformanceMonitor, PerformanceMonitorSample } from "nativescript-performance-monitor";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent { 
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;

    constructor(private router: Router, 
        private routerExtensions: RouterExtensions) {

    }

    ngOnInit(): void {
        this._activatedUrl = "/home";
        this._sideDrawerTransition = new PushTransition();

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);

        // Activate, if you want to see a frame-per-second count in the console
        // 
        // new PerformanceMonitor().start({
        //     hide: false,
        //     onSample: (sample: PerformanceMonitorSample) => {
        //       console.log("FPS: " + sample.fps);
        //     }            });
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {});

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

}
