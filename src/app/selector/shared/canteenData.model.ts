export class CanteenData {
    id: string;
    name: string;
    city: string;
    urlPath: string;

    constructor(options: any) {
        this.id = options.id;
        this.name = options.name;
        this.city = options.city;
        this.urlPath = options.urlPath;
    }
}
