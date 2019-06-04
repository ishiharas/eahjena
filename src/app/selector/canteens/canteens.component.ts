import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SelectorService } from '../shared/selector.service';
import { finalize } from 'rxjs/operators';
import { CanteenData } from '../shared/canteenData.model';
import { action } from 'tns-core-modules/ui/dialogs/dialogs';
import { Selection } from '../shared/selection.model';
import { getString, remove } from 'tns-core-modules/application-settings/application-settings';

@Component({
	selector: 'canteens',
	templateUrl: './canteens.component.html',
	styleUrls: ['../selector.component.css'],
	moduleId: module.id,
	providers: [SelectorService]
})
export class CanteensComponent implements OnInit {
	@Output() selected = new EventEmitter<boolean>();
	@Output() canteenCollection = new EventEmitter<Array<String>>();
	public canteenArr: Array<String> = [];

	public _isLoading: boolean = false;
	public _canteenData: Array<CanteenData> = [];
	public selection: Selection = {};
    public actionOptions: Array<string> = [];

    public options = {
        title: "",
        message: "Du hast die Auswahl aus folgenden Optionen.",
        cancelButtonText: "Abbrechen",
        actions: this.actionOptions
	};
	
	constructor(private _selectorService: SelectorService) {
	}

	ngOnInit() {
		this.extractData();
		this.selected.emit(false);
		this.removeApplicationSettings();		
	}

	extractData(): void {
		this._isLoading = true;

        this._selectorService.getCanteenData()
            .pipe(finalize(() => this._isLoading = false))
            .subscribe((result: Array<CanteenData>) => {
				result.forEach((singleCanteen) => {
					this._canteenData.push(singleCanteen);
				})

				this.selection.canteens = [];
				this.selection.canteens.push(result[0]);

				this.canteenArr.push(result[0].id);
				this.canteenCollection.emit(this.canteenArr);

                this._isLoading = false;
            }, (error) => console.log(error));
	}

	getCanteens(): Array<CanteenData> {
		return this._canteenData;
	}
	
	getCanteenByName(name: string): CanteenData {
		return this._canteenData.find((e) => e.name === name);
	}
	
	showDialogCanteen(listIndex: number): void {
        this.options.title = "Wähle eine Mensa";
		this.actionOptions.length = 0;

        this.getCanteens().forEach((canteen) => {
			if (!this.selection.canteens.find(e => e.name == canteen.name)) {
				this.actionOptions.push(canteen.name);
			};
		});
        this.actionOptions.sort();

        action(this.options).then((result) => {
            if (result !== this.options.cancelButtonText) {
				this.selection.canteens[listIndex] = this.getCanteenByName(result);
				if (this.canteenArr[listIndex]) {
					this.canteenArr[listIndex] = this.selection.canteens[listIndex].id;
					this.canteenCollection.emit(this.canteenArr);
				} else {
					this.canteenArr.push(this.selection.canteens[listIndex].id);
					this.canteenCollection.emit(this.canteenArr);
				}
            };
        });
    }

	userInteraction(): void {
		this.selected.emit(true);
	}

	addCanteen(canteen: CanteenData, i: number): void {
		// this.selection.canteens.push(canteen);
		this.selection.canteens.push({});
	}

	deleteCanteen(listIndex: number): void {
		this.selection.canteens.splice(listIndex, 1);

		this.canteenArr.splice(listIndex, 1);
		this.canteenCollection.emit(this.canteenArr);
	}	
	
	removeApplicationSettings(): void {
		let i: number = 0;
		while (getString("canteen_" + i)) {
			remove("canteen_" + i)
			i++;
		}	
	}
}
