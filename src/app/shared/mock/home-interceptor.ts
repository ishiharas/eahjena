import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import * as localStorage from 'nativescript-localstorage';

import { coursesDetail } from "./courses-detail";
import { LSOBJECTS } from "../ls-objects";

@Injectable()
export class HomeInterceptor implements HttpInterceptor {
  public local: { courseID: string; moduleID: string[], courseShortString?: string }[] = localStorage.getItem(LSOBJECTS.ADDITIONALMODULES);

  constructor() { }
  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (request.urlWithParams.includes("event")) {
        return of(new HttpResponse({body: coursesDetail}));
    }

    this.local.forEach((res) => {
      if (request.urlWithParams.includes(res.courseID)) {
        return of(new HttpResponse({body: coursesDetail}));
      }    
    })

    return next.handle(request);
  }
}