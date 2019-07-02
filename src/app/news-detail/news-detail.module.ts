import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NewsDetailRoutingModule } from "./news-detail-routing.module";
import { NewsDetailComponent } from "./news-detail.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NewsDetailRoutingModule
    ],
    declarations: [
        NewsDetailComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class NewsDetailModule { }
