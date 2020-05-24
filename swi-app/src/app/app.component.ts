import { Component, OnInit, ChangeDetectorRef, NgModule } from '@angular/core';
import { ElasticsearchService } from './elasticsearch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'SWI - Wikiquotes';
  description = 'SWI - Wikiquotes';
  isConnected = false;
  status: string;
  searchPhrase : string;
  output : string;

  constructor(private es: ElasticsearchService, private cd: ChangeDetectorRef) {
    this.isConnected = false;
  }
 
  ngOnInit() {
    this.es.isAvailable().then(() => {
      this.status = 'OK';
      this.isConnected = true;
    }, (error: any) => {
      this.status = 'ERROR';
      this.isConnected = false;
      console.error('Server is down', error);
    }).then(() => {
      this.cd.detectChanges();
    });
  }

  getDocuments(query) {
    console.log(query);    
    this.output = this.es.sendRequest(query).toString();
  }
}