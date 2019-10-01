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


@Injectable()
export class HomeInterceptor implements HttpInterceptor {

  constructor() { }
  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {


    // if (request.urlWithParams.includes('SPLUSBB0201')) {
    //   return of(new HttpResponse({ body: coursesDetail }));
    // } 

    return next.handle(request);
  }
}