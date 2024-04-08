import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { PieData } from 'src/app/core/models/PieData';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null> = of(null);
  pie: PieData[] | undefined = [];
  title:string =  "test";


  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe({
      next: data => {
        console.log(data);
        //utiliser map
        console.log(this.pie)
        this.pie = data?.map(d => {
          return {
            name: d.country,
            value: d.participations.reduce((acc, nbOfParticiations) => acc + nbOfParticiations.medalsCount, 0)
          }
        })
      }, error: () => {

      }, complete: () => {
        console.log(this.pie)

      }
    });
    
  }

}
