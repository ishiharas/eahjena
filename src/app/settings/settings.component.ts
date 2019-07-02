import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { confirm } from "tns-core-modules/ui/dialogs/dialogs";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings.component.html"
})
export class SettingsComponent implements OnInit {
    constructor(private page: Page,
        private _router: RouterExtensions) {

    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
    }
    
    openDrawer(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    resetAppsettings(): void {
        let options = {
            title: "App-Einstellungen zurücksetzen",
            message: "Sollen sämtliche Daten unwiderruflich gelöscht werden?",
            okButtonText: "Ja",
            cancelButtonText: "Nein",
            neutralButtonText: "Abbrechen"
        };
        
        confirm(options).then((result: boolean) => {
            if (result) {
                this._router.navigate(['/selector'], {
                    clearHistory: true
                });
            };
        });
    }
}
