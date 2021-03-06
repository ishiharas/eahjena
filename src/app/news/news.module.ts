import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NewsRoutingModule } from "./news-routing.module";
import { NewsComponent } from "./news.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NewsRoutingModule
    ],
    declarations: [
        NewsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class NewsModule { }
