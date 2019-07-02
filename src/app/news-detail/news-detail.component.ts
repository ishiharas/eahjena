import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Page } from "tns-core-modules/ui/page/page";
import * as app from "tns-core-modules/application";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";


@Component({
    selector: "NewsDetail",
    moduleId: module.id,
    templateUrl: "./news-detail.component.html"
})
export class NewsDetailComponent implements OnInit {
    public title: string;
    public content: string;
    public author: string;
    public date: string;
    public test: string;

    constructor(private page: Page,
        private route: ActivatedRoute,
        private _router: RouterExtensions) {
            this.route.queryParams.subscribe(params => {
                this.title = params["title"];
                this.content = params["content"];
                this.author = params["author"];
                this.date = params["date"]
            });
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    openDrawer(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onBackTap(): void {
        this._router.navigate(['news'], {
            animated: true,
            transition: {
                name: 'slideRight'
            },
            clearHistory: true
        })
    }
}
