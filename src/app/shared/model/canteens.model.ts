export class CanteensModel {
    title: string;
    description: string;
    ingredients: string;
    price: string;
    date: number;
    dateAsString: string;
    mensaName: string;
    mensaId: string;

    constructor(options: any) {
        this.title = options.title;
        this.description = options.description;
        this.ingredients = options.ingredients;
        this.price = options.price;
        this.date = options.date;
        this.dateAsString = options.dateAsString;
        this.mensaName = options.mensaName;
        this.mensaId = options.mensaId;
    }
}
