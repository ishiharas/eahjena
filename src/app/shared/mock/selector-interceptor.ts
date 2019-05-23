import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { CourseData } from "~/app/selector/shared/courseData.model";

import { courses } from "./courses";
import { canteens } from "./canteens";

@Injectable()
export class SelectorInterceptor implements HttpInterceptor {
  constructor() { }
  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    
    // if (request.urlWithParams.includes("canteens")) {
    //     return of(new HttpResponse({body: canteens}));
    //     return next.handle(request);
    // }

    // return of(new HttpResponse({body: courses}));
    return next.handle(request);
  }
}