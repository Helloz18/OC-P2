import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScaleType } from '@swimlane/ngx-charts';
import { MyLineData, Serie } from 'src/app/core/models/MyLineData';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  countryData: MyLineData[] = [];
  series : Serie[] = [];
  totalMedals: number = 0;
  totalAthletes: number = 0;
 
  // options for line chart
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Dates';
  showYAxisLabel = true;
  yAxisLabel = 'Number of medals';
  yScaleMin: number = 0;
  yScaleMax: number = 0;
  colorScheme = {   
    domain: ['#007b80'], 
    group: ScaleType.Ordinal, 
    selectable: true, 
    name: 'Customer Usage', 
  };

  constructor( private olympicService: OlympicService, private route: ActivatedRoute) {
   }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const countryName = (params['countryName']);
      this.olympicService.getOlympicsByCountry(countryName);

      //format values to match series object and get total medals and athletes
      this.olympicService.countryData.participations.forEach((p:Participation)=> {
        this.series.push({name:p.year.toString(), value:p.medalsCount});
        this.totalMedals = this.totalMedals + p.medalsCount;
        this.totalAthletes = this.totalAthletes + p.athleteCount;
      })
      //format values to match MyLineData object
      this.countryData.push({name: countryName, series:this.series});

      //adjust y scale according to number of medals
      let scaleMaxMin: number[] = [];
      this.series.forEach(s => {
        scaleMaxMin.push(s.value);
      })
      this.yScaleMax = (Math.max(...scaleMaxMin) + 10);
      this.yScaleMin = (Math.min(...scaleMaxMin) -10);
    });
  }

}
