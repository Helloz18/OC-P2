import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, toArray } from 'rxjs';
import { MyPieData } from 'src/app/core/models/MyPieData';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null> = of(null);
  pie: MyPieData[] | undefined = [];
  title:string =  "Medals per country";
  numberOfJOs: number = 0;
  numberOfCountries: number = 0;


  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe({
      next: data => {
        this.pie = data?.map(d => {
          return {
            name: d.country,
            value: d.participations.reduce((acc, nbOfParticiations) => acc + nbOfParticiations.medalsCount, 0)
          }
        })
        
         // calculate number of JOs according to dates
         let jos: number[] = [];
         data!.forEach(c => {
           c.participations.forEach(jo =>
             jos.push(jo.year))
         })
         this.numberOfJOs = Array.from(new Set(jos)).length;

        // calculate number of countries where took place JO
        let countries: string[] = [];
        data!.forEach(c => {
          c.participations.forEach(city =>
            countries.push(city.city))
        })
        this.numberOfCountries = Array.from(new Set(countries)).length;
        
       
        
      }, error: () => {

      }, complete: () => {

      }
    });
    
  }

  onCountrySelected(event : HttpEventType) {
    this.router.navigateByUrl('country/?countryName='+JSON.parse(JSON.stringify(event)).name);
  }
}
