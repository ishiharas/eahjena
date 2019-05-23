export class Group {
    title: string;
    timetableId: string;
    semesterGroup: boolean;

    constructor(options: any) {
        this.title = options.title;
        this.timetableId = options.timetableId;
        this.semesterGroup = options.semesterGroup;
    }
}
