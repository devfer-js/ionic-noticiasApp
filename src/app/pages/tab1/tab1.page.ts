import { Article } from './../../interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { NoticiasService } from 'src/app/services/noticias.service';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: [ 'tab1.page.scss' ]
})
export class Tab1Page implements OnInit {
	noticias: Article[] = [];

	constructor(private noticiasService: NoticiasService) {}

	ngOnInit() {
		this.cargarNoticias();
	}

	loadData(ev) {
		this.cargarNoticias(ev);
	}

	cargarNoticias(ev?) {
		this.noticiasService.getTopHeadlines().subscribe((data) => {
			if (data.articles.length === 0) {
				ev.target.disabled = true;
				ev.target.complete();
				return;
			}
			this.noticias.push(...data.articles);
			ev ? ev.target.complete() : null;
		});
	}
}
