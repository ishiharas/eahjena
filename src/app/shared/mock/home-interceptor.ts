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
import { coursesDetailAdded } from "./courses-detail-add";
import { getString } from "tns-core-modules/application-settings/application-settings";
import { LSOBJECTS } from "../ls-objects";
import { courses } from "./courses";


@Injectable()
export class HomeInterceptor implements HttpInterceptor {

  constructor() { }
  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {


    // if (!getString(LSOBJECTS.MODULEIDS)) {
    //   console.log('lololol')
    //   return of(new HttpResponse({ body: courses}))
    // }

    // if (request.urlWithParams.includes('tim')) {
    //   return of(new HttpResponse({ body: coursesDetail }));
    // } 

    return next.handle(request);
  }
}