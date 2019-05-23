import { CoursesWeekModel } from "./courses-week.model";

export class CoursesModel {
    weekInYear: number;
    year: number;
    weekdays: Array<CoursesWeekModel>;

    constructor(options: any) {
        this.weekInYear = options.weekInYear;
        this.year = options.year;
        this.weekdays = options.weekdays;
    }
}

