import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { imprint } from "~/app/shared/config";

@Injectable()
export class ImprintService {
    private imprintUrl: string = imprint;
    // private _imprintData: Observable<Array<ImprintModel>>;

    constructor(private http: HttpClient) { }

    // getImprintData(): Observable<Array<ImprintModel>> {
    //     let headers = this.createRequestHeader();
        
    //     this._imprintData = this.http
    //         .get<Array<ImprintModel>>(this.imprintUrl, { headers: headers });
            
    //     // this._imprintData.subscribe((data) => console.log(data));
    //     return this._imprintData;
    // }

    // getImprintData(): Observable<ImprintModel[]> {
    //     let headers = this.createRequestHeader();
    //     return this.http.get<Array<ImprintModel>>(this.imprintUrl, { headers: headers });
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