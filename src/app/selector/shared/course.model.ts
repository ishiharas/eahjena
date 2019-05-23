import { Term } from "./term.model";

export class Course {
    title: string;
    id: string;
    terms: Array<Term>;

    constructor(options: any) {
        this.title = options.title;
        this.id = options.id;
        this.terms = options.terms;
    }
}
