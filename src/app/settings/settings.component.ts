import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { confirm } from "tns-core-modules/ui/dialogs/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
// import { setString, setBoolean, clear, getString, remove } from "tns-core-modules/application-settings";
import * as localStorage from 'nativescript-localstorage';
import * as appSettings from "tns-core-modules/application-settings";

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
                // clean application-settings and local-storage
                localStorage.clear();
                appSettings.clear();
                console.log('settings: LocalStorage + Appsettings cleared');
                this._router.navigate(['/selector'], {
                    clearHistory: true
                });
            };
        });
    }
}
