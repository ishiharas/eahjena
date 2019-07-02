import { NgModule, NO_ERRORS_SCHEMA }       from '@angular/core';
import { CoursesComponent } from '../selector/courses/courses.component';
import { CanteensComponent } from '../selector/canteens/canteens.component';
import { CommonModule } from '@angular/common';
import { PreferencesComponent } from '../selector/preferences/preferences.component';


@NgModule({
    imports: [CommonModule],
    declarations: [
        CoursesComponent,
        CanteensComponent,
        PreferencesComponent
    ],
    providers: [
    ],
    exports: [
        CoursesComponent,
        CanteensComponent,
        PreferencesComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SharedModule {}