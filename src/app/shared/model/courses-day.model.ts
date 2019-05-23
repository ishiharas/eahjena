export class CoursesDayModel {
    startDate: number;
    title: string;
    shortTitle: string;
    date: string;
    dayOfWeek: string;
    weekOfYear: number;
    startTime: string;
    endTime: string;
    lecturer: string;
    room: string;
    uid: string;

    constructor(options: any) {
        this.startDate = options.startDate;
        this.title = options.title;
        this.shortTitle = options.shortTitle;
        this.date = options.date;
        this.dayOfWeek = options.dayOfWeek;
        this.weekOfYear = options.weekOfYear;
        this.startTime = options.startTime;
        this.endTime = options.endTime;
        this.lecturer = options.lecturer;
        this.room = options.room;
        this.uid = options.uid;
    }
}
