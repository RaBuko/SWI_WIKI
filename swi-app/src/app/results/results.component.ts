import { Component, OnInit, ChangeDetectorRef, NgModule } from '@angular/core';
import { ElasticsearchService } from '../elasticsearch.service';
import { Entry } from '../app.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  title = 'SWI - Wikiquotes';
  description = 'SWI - Wikiquotes';
  isConnected = false;
  status: string;
  searchPhrase: string;
  output: string;
  responses: Entry[];

  constructor(private es: ElasticsearchService, private cd: ChangeDetectorRef) {
    this.isConnected = false;
    this.responses = [];
  }

  private convertResponse(response) {
    this.responses = [];
    response.forEach(element => {
      let entry = new Entry(
        element._source.title,
        element._source.text,
        element._source.opening_text,
        element._source.create_timestamp,
        new Date(element._source.timestamp));
      this.responses.push(entry);
    });
  }

  getDocuments(query) {
    console.log(query);
    this.es.sendRequest(query).then(response => {
      this.output = response.hits.hits[0]._source.title;
      this.convertResponse(response.hits.hits);
      console.log(response);
    }, error => {
      console.error(error);
    });
    //this.output = this.es.sendRequest(query).toString();
  }

  ngOnInit(): void {
  }

}
