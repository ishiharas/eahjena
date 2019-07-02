import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { news } from "~/app/shared/config";
import { NewsItemModel, NewsModel } from "../model/news.model";
import { map } from "rxjs/operators";

@Injectable()
export class NewsService {
    private newsUrl: string = news;

    constructor(private http: HttpClient) { }

    getNewsData(): Observable<NewsItemModel[]> {
        let headers = this.createRequestHeader();
        return this.http.get<NewsModel>(this.newsUrl, { headers: headers })
            .pipe(map((news) => {
                news.channel.item.map((newsItem) => {
                    // create new description from encoded text, since the provided description isn't usable
                    newsItem.description = newsItem.encoded.split(") ")[1].slice(0, 100);
                    newsItem.description = newsItem.description.replace('&#58;', ':');
                    newsItem.description = newsItem.description + '...';

                    // transform string timestamp to just a single date to show below the title in listview
                    let container = newsItem.pubDate.split(" ");
                    newsItem.shortDate = container[1] + '. ' + container[2] + '. ' + container[3];

                    // transforms html-string, deletes first part (TEXTKÖRPER: ), adds font-size, color, family
                    let htmlContainer = newsItem.encoded.split(") ");
                    let firstItem = htmlContainer.shift();
                    newsItem.encoded = htmlContainer.join();
                    newsItem.encoded = "<font size='3' color='#000000' face='Arial,Helvetica'>" + newsItem.encoded + "</font>";
                    newsItem.encoded = newsItem.encoded.replace(/<p/g, "<p style='color:black'");
                })
                return news.channel.item;
            }));
    }

    private createRequestHeader() {
        let headers = new HttpHeaders({
            "AuthKey": "my-key",
            "AuthToken": "my-token",
            "Content-Type": "application/json",
         });

        return headers;
    }
}