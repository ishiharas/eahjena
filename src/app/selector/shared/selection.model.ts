import { CanteenData } from "./canteenData.model";

export class Selection {
    course?: string;
    course_index?: number;
    term?: string;
    term_index?: number;
    group?: string;
    group_index?: number;
    timetableId?: string;
    canteens?: Array<CanteenData>;
    saveSelection?: boolean;

    constructor(options: any) {
        this.course = options.course;
        this.course_index = Number(options.course_index);
        this.term = options.term;
        this.term_index = options.term_index;
        this.group = options.group;
        this.group = options.group_index;
        this.timetableId = options.timetableId;
    }
}
