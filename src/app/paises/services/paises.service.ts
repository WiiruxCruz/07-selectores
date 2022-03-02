import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaisSmall } from '../interfaces/paises.interface';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

	private baseUrl: string = 'https://restcountries.com/v2';
	private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania',];

	get regiones(): string[] {
		return [ ...this._regiones ]
	}

	constructor( private http: HttpClient ) { }

	getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {
		const url: string = `${ this.baseUrl }/region/${ region }?fields=alpha3Code,name`
		return this.http.get<PaisSmall[]>( url );
	}
}
