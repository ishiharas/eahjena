import { Component, OnInit } from "@angular/core";
import { Page, EventData } from "tns-core-modules/ui/page/page";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { NewsService } from "../shared/service/news.service";
import { NewsItemModel } from "../shared/model/news.model";
import { ItemEventData, ListView } from "tns-core-modules/ui/list-view";
import { isIOS } from 'tns-core-modules/platform';
import * as app from "tns-core-modules/application";
import { RouterExtensions } from "nativescript-angular/router";
import { ExtendedNavigationExtras } from "nativescript-angular/router/router-extensions";

declare var UITableViewCellSelectionStyle;

@Component({
    selector: "News",
    moduleId: module.id,
    templateUrl: "./news.component.html",
	styleUrls: ['./news.component.css'],
    providers: [NewsService]
})
export class NewsComponent implements OnInit {
    public newsItems: NewsItemModel[];
    public requestFinished: boolean = false;

    constructor(private page: Page,
        private _newsService: NewsService,
        private _router: RouterExtensions) {
            this.page.actionBarHidden = true;
    }

    ngOnInit(): void {
        this.extractNewsData();
    }

    extractNewsData(): void {
        this._newsService.getNewsData()
            .subscribe((result: NewsItemModel[]) => {
                this.newsItems = result;
                this.requestFinished = true;
            });
    }

    openDrawer(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onItemLoading(args: ItemEventData) {
        if (isIOS) {
          const iosCell = args.ios;
          iosCell.selectionStyle = UITableViewCellSelectionStyle.None;
        }
    }

    onItemTap(args: ItemEventData) {
        let navigationExtras: ExtendedNavigationExtras = {
            animated: true,
            transition: {
                name: 'slideLeft'
            },
            queryParams: {
                "title": this.newsItems[args.index].title,
                "content": this.newsItems[args.index].encoded,
                "author": this.newsItems[args.index].author,
                "date": this.newsItems[args.index].pubDate,
            }
        };
        this._router.navigate(['news-detail'], navigationExtras);
    }

}
