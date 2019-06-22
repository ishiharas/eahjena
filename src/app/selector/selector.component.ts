import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";
import { SelectorService } from "./shared/selector.service";
import { RouterExtensions } from "nativescript-angular/router";
import { setString, setBoolean, clear, getString, remove } from "tns-core-modules/application-settings";
import * as localStorage from 'nativescript-localstorage';


@Component({
    selector: "Selector",
    moduleId: module.id,
    templateUrl: "./selector.component.html",
    styleUrls: ['./selector.component.css'],
    providers: [SelectorService]
})
export class SelectorComponent implements OnInit {
    public opening: boolean = true;
    public selectionFinishedCourse: boolean = false;
    public selectionFinishedCanteen: boolean = false;
    public selectionFinishedSettings: boolean = false;
    public previousButton: boolean = false;
    public currentStep: number = 1;
    public canteenArr: Array<string> = [];

    constructor(private page: Page, 
                private router: RouterExtensions) {
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;

        // clean application-settings and local-storage
        localStorage.clear();
        clear();
        console.log('LocalStorage + Appsettings cleared');
    }

    onPreviousButton(): void {
            this.opening = !this.opening;
            setTimeout(() => {
                this.currentStep--;
                this.opening = !this.opening;
            }, 300);

            if(this.currentStep == 3) {
                    let i: number = 0;
                    while (getString("canteen_" + i)) {
                        remove("canteen_" + i)
                        i++;
                    }	
                
            }
    }

    onNextButton(): void {
        if (this.currentStep !== 3) {
            this.opening = !this.opening;
            setTimeout(() => {
                this.currentStep++;
                this.opening = !this.opening;
            }, 300);
        }

        if ( this.currentStep == 2 ) {
            this.selectionFinishedCanteen = true;
            
            this.canteenArr.forEach((canteen, index) => {
                setString("canteen_" + index, canteen);
                // console.log("selection log: " + "canteen_" + index + ": " + canteen);
            });
        } 

        if ( this.currentStep == 3 ) {
            this.selectionFinishedSettings = true;
            setBoolean("selection_finished", true);
            setTimeout(() => {
                this.router.navigate(['/home'], {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: "slide",
                        duration: 500,
                        curve: "linear"
                    }
                })
            }, 250);
        }

    }

    nextButtonEnabled(): boolean {
        return this.selectionFinishedCourse;
    }

    canteenHeaderEnabled(): boolean {
        return this.selectionFinishedCanteen;
    }

    settingsHeaderEnabled(): boolean {
        return this.selectionFinishedSettings;
    }

    previousButtonEnabled(): boolean {
        if (this.currentStep > 1) {
            return this.previousButton = true;
        } else {
            return this.previousButton = false;
        }
    }

}
