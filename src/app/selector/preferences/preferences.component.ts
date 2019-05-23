import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectorService } from '../shared/selector.service';

@Component({
	selector: 'preferences',
	templateUrl: './preferences.component.html',
	styleUrls: ['../selector.component.css'],
	moduleId: module.id,
	providers: [SelectorService]
})
export class PreferencesComponent implements OnInit {
	@Output() selected = new EventEmitter<boolean>();

	constructor(private _selectorService: SelectorService) {
	}

	ngOnInit() {
	}
	
	userInteraction(): void {
		this.selected.emit(true);
	}

    
}
