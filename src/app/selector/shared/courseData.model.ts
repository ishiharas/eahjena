import { Course } from "./course.model";

export class CourseData {
    courseOfStudies: Array<Course>;
    title: string;
    modified: string;

    constructor(options: any) {
        this.courseOfStudies = options.courseOfStudies;
        this.title = options.title;
        this.modified = options.modified;
    }
}
