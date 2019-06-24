import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { NewsRoutingModule } from "./news-routing.module";
import { NewsComponent } from "./news.component";

@NgModule({
    imports: [
        NativeScriptModule,
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
