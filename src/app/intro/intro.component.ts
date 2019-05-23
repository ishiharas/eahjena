import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from "nativescript-angular/router";
import { SelectorService } from "../selector/shared/selector.service";

@Component({
    selector: "Intro",
    moduleId: module.id,
    templateUrl: "./intro.component.html",
	styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {
	public opening = true;

    constructor(private page: Page,
                private router: RouterExtensions,
        ) {
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    selectModule(): void {
        this.opening = !this.opening;
        setTimeout(() => {
			this.router.navigate(['/selector'], {
				animated: false,
				clearHistory: true
			})
		}, 500);
    }
} 
