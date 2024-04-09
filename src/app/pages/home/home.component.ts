import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
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
      }, error: () => {

      }, complete: () => {

      }
    });
    
  }

  onCountrySelected(event : HttpEventType) {
    this.router.navigateByUrl('country/?countryName='+JSON.parse(JSON.stringify(event)).name);
  }
}
