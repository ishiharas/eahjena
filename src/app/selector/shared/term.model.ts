import { Group } from "./group.model";

export class Term {
    title: string;
    id: string;
    studyGroups: Array<Group>;

    constructor(options: any) {
        this.title = options.title;
        this.id = options.id;
        this.studyGroups = options.studyGroups;
    }
}
