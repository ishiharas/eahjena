import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";
import { CanteensService } from "../shared/service/canteens.service";
import { setString } from "tns-core-modules/application-settings/application-settings";
import { RouterExtensions } from "nativescript-angular/router";


@Component({
    selector: "MenuEdit",
    moduleId: module.id,
    styleUrls: ['./menu-edit.component.css'],
    templateUrl: "./menu-edit.component.html",
    providers: [CanteensService]
})
export class MenuEditComponent implements OnInit {
    public canteenArr: Array<string> = [];

    constructor(private page: Page,
        private _router: RouterExtensions,
        private _canteensService: CanteensService) {
    }

    onBackTap(): void {
        this.page.frame.goBack();
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    onSaveSelectionTap(): void {
        this.canteenArr.forEach((canteen, index) => {
            setString("canteen_" + index, canteen);
        });

        this._router.navigate(['/menu'], {
            clearHistory: true,
            animated: true,
            transition: {
                name: "slideRight",
                duration: 300,
                curve: "easeIn"
            }
        });
    }
}
