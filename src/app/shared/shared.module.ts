import { NgModule, NO_ERRORS_SCHEMA }       from '@angular/core';
import { LeftDrawerComponent } from '../drawers/left/left';
import { CoursesComponent } from '../selector/courses/courses.component';


@NgModule({
    imports: [
    ],
    declarations: [
        LeftDrawerComponent,
        CoursesComponent
    ],
    providers: [
    ],
    exports: [
        LeftDrawerComponent,
        CoursesComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SharedModule {}