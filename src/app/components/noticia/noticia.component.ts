import { Article } from './../../interfaces/interfaces';
import { Component, OnInit, Input } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, ToastController, Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
	selector: 'app-noticia',
	templateUrl: './noticia.component.html',
	styleUrls: [ './noticia.component.scss' ]
})
export class NoticiaComponent implements OnInit {
	@Input() noticia: Article;
	@Input() i: number;
	@Input() enFavoritos: boolean;
	constructor(
		private iab: InAppBrowser,
		private actionSheetCtrl: ActionSheetController,
		private socialSharing: SocialSharing,
		private dataLocalService: DataLocalService,
		public toastController: ToastController,
		private platform: Platform
	) {}

	ngOnInit() {}

	abrirNoticia() {
		console.log('Noticia', this.noticia.url);
		const browser = this.iab.create(this.noticia.url, '_system');
	}

	async lanzarMenu() {
		let guardarBorrarBtn;
		if (this.enFavoritos) {
			//borrar de favoritos
			guardarBorrarBtn = {
				text: 'Borrar Favorito',
				icon: 'trash',
				cssClass: 'action-dark',
				handler: () => {
					this.dataLocalService.borrarNotcia(this.noticia);
					this.presentToast('Se Borro Exitosamente tu noticia 😉');
				}
			};
		} else {
			guardarBorrarBtn = {
				text: 'Favorito',
				icon: 'heart',
				cssClass: 'action-dark',
				handler: () => {
					this.dataLocalService.guardarNoticia(this.noticia);
					this.presentToast('Se agrego a Favoritos ❤');
				}
			};
		}
		const actionSheet = await this.actionSheetCtrl.create({
			buttons: [
				{
					text: 'Compartir',
					icon: 'share',
					cssClass: 'action-dark',
					handler: () => {
						this.compartirNoticia();
					}
				},
				guardarBorrarBtn,
				{
					text: 'Cancel',
					icon: 'close',
					cssClass: 'action-dark',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
		});
		await actionSheet.present();
	}
	async presentToast(message: string) {
		const toast = await this.toastController.create({
			message,
			duration: 3000
		});
		toast.present();
	}
	compartirNoticia() {
		if (this.platform.is('cordova')) {
			this.socialSharing.share(this.noticia.title, this.noticia.source.name, '', this.noticia.url);
		} else {
			let newVariable: any;
			newVariable = window.navigator;
			if (newVariable && newVariable.share) {
				newVariable
					.share({
						title: this.noticia.title,
						text: this.noticia.description,
						url: this.noticia.url
					})
					.then(() => console.log('Successful share'))
					.catch((error) => console.log('Error sharing', error));
			} else {
				this.presentToast('Lo siento tu dispositivo no es compatible para compartir la noticia 😔');
			}
		}
	}
}
