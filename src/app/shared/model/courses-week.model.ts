import { CoursesDayModel } from "./courses-day.model";

export class CoursesWeekModel {
    dayInWeek: number;
    name: string;
    events: Array<CoursesDayModel>;

    constructor(options: any) {
        this.dayInWeek = options.dayInWeek;
        this.name = options.name;
        this.events = options.events;
    }
}
