import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, forkJoin } from "rxjs";
import { single } from "rxjs/operators";

import { getString } from "tns-core-modules/application-settings/application-settings";
import { canteens } from "~/app/selector/shared/config";
import { CanteensModel } from "../model/canteens.model";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

// TODO: check if content of canteen id is null

@Injectable()
export class CanteensService {
    private canteensUrl: string = canteens;
    private _canteenData: Observable<Array<CanteensModel>>;

    constructor(private http: HttpClient) { }

    getCanteenData(): Observable<Array<CanteensModel>> {
        let headers = this.createRequestHeader();
        
        this._canteenData = this.http
            .get<Array<CanteensModel>>(this.canteensUrl + getString("canteen_0"), { headers: headers });
            
        // this._canteenData.subscribe((data) => console.log(data));
        return this._canteenData;
    }

    getCanteensData(): Observable<Array<Array<CanteensModel>>> {
        let headers = this.createRequestHeader();
        let allSelected: Array<Observable<CanteensModel[]>> = [];
        let i = 0;
        while (getString("canteen_" + i)) {
            allSelected.push(this.http
                .get<Array<CanteensModel>>(
                    this.canteensUrl + getString("canteen_" + i), 
                    { headers: headers }));
            i++;
        };
    
        // this._canteenData.subscribe((data) => console.log(data));
        return forkJoin(allSelected);
    };

    private createRequestHeader() {
        let headers = new HttpHeaders({
            "AuthKey": "my-key",
            "AuthToken": "my-token",
            "Content-Type": "application/json",
         });

        return headers;
    }
}