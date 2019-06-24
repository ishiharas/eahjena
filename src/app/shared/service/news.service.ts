import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { news } from "~/app/shared/config";

@Injectable()
export class NewsService {
    private newsUrl: string = news;
    // private _newsData: Observable<Array<NewsModel>>;

    constructor(private http: HttpClient) { }

    // getNewsData(): Observable<Array<NewsModel>> {
    //     let headers = this.createRequestHeader();
        
    //     this._newsData = this.http
    //         .get<Array<NewsModel>>(this.newsUrl, { headers: headers });
            
    //     // this._newsData.subscribe((data) => console.log(data));
    //     return this._newsData;
    // }

    // getNewsData(): Observable<NewsModel[]> {
    //     let headers = this.createRequestHeader();
    //     return this.http.get<Array<NewsModel>>(this.newsUrl, { headers: headers });
    // }

    private createRequestHeader() {
        let headers = new HttpHeaders({
            "AuthKey": "my-key",
            "AuthToken": "my-token",
            "Content-Type": "application/json",
         });

        return headers;
    }
}