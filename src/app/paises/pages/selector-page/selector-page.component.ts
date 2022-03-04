import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

	miFormulario: FormGroup = this.fb.group({
		region: [ '', Validators.required ],
		pais: [ '', Validators.required ],
		frontera: [ '', Validators.required ]
	})

	//lenar selectores
	regiones: string[] = [];
	paises: PaisSmall[] = [];
	//fronteras: string[] = [];
	fronteras: PaisSmall[] = [];

	//UI
	cargando: boolean = false;

	constructor(
	  private fb: FormBuilder,
	  private paisesService: PaisesService
	) { }

	ngOnInit(): void {
		this.regiones = this.paisesService.regiones;
		/*
		//cuando cambie la region
		this.miFormulario.get('region')?.valueChanges
		.subscribe(
			region => {
				console.log(region);

				this.paisesService.getPaisesPorRegion( region )
				.subscribe(
					paises => {
						console.log(paises);
						this.paises = paises;
					}
				)
			}
		);
		*/

		this.miFormulario.get('region')?.valueChanges
		.pipe(
			tap( ( _ ) => {
					this.miFormulario.get('pais')?.reset('');
					//this.miFormulario.get('frontera')?.disable();
					this.cargando = true;
				}
			),
			switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
		)
		.subscribe( paises => {
			//console.log(paises);
			this.paises = paises;
			this.cargando = false;
		});


		//Pais
		this.miFormulario.get('pais')?.valueChanges
		.pipe(

			tap( () => {
					this.fronteras = [];
					this.miFormulario.get('frontera')?.reset('');
					this.cargando = true;
				}
			),
			switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo ) ),
			switchMap( pais => this.paisesService.getPaisesPorCodigos( pais?.borders ) )
		)
		.subscribe( paises => {
			console.log(paises);
			//this.fronteras = pais?.borders || [];
			this.fronteras = paises;
			this.cargando = false;
		});



	}

	guardar() {
	  console.log( this.miFormulario.value );
	}

}
