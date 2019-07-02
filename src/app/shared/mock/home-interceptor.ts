import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from "@angular/common/http";
import { Observable, of } from "rxjs";

import { coursesDetail } from "./courses-detail";
import { canteensDetail } from "./canteens-detail";

@Injectable()
export class HomeInterceptor implements HttpInterceptor {
  constructor() { }
  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // if (request.urlWithParams.includes("timetable")) {
    //     return of(new HttpResponse({body: coursesDetail}));
    //     return next.handle(request);
    // }

    // return of(new HttpResponse({body: coursesDetail}));
    return next.handle(request);
  }
}