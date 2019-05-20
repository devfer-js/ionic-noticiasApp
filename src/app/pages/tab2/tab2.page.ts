import { NoticiasService } from './../../services/noticias.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { Article } from '../../interfaces/interfaces';

@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: [ 'tab2.page.scss' ]
})
export class Tab2Page implements OnInit {
	@ViewChild(IonSegment) segment: IonSegment;
	categorias = [ 'general', 'health', 'science', 'sports', 'technology' ];
	noticias: Article[] = [];

	constructor(private noticiasService: NoticiasService) {}

	ngOnInit() {
		this.segment.value = this.categorias[0];
		this.cargarNoticias(this.segment.value);
	}

	cambioCategoria(ev) {
		this.noticias = [];
		this.cargarNoticias(ev.detail.value);
	}

	cargarNoticias(categoria: string, ev?) {
		this.noticiasService.getTopHeadlinesCategoria(categoria).subscribe((resp) => {
			this.noticias.push(...resp.articles);
			if (ev) {
				ev.target.complete();
			}
		});
	}

	loadData(ev) {
		this.cargarNoticias(this.segment.value, ev);
	}
}
