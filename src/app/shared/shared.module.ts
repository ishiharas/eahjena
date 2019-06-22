import { NgModule, NO_ERRORS_SCHEMA }       from '@angular/core';
import { LeftDrawerComponent } from '../drawers/left/left';
import { CoursesComponent } from '../selector/courses/courses.component';
import { CanteensComponent } from '../selector/canteens/canteens.component';
import { CommonModule } from '@angular/common';


@NgModule({
    imports: [CommonModule],
    declarations: [
        LeftDrawerComponent,
        CoursesComponent,
        CanteensComponent
    ],
    providers: [
    ],
    exports: [
        LeftDrawerComponent,
        CoursesComponent,
        CanteensComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SharedModule {}