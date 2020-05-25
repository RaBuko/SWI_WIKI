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
  searchPhrase: string;
  responses: Entry[];

  constructor(private es: ElasticsearchService, private cd: ChangeDetectorRef) {
    this.isConnected = false;
    this.responses = [];
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
    this.es.sendRequest(query).then(response => {
      this.convertResponse(response.hits.hits);
      console.log(response);
    }, error => {
      console.error(error);
    });
  }

  private convertResponse(response) {
    this.responses = [];
    response.forEach(element => {
      let entry = new Entry(
        element._source.title,
        element._source.text,
        element._source.opening_text,
        new Date(element._source.create_timestamp),
        new Date(element._source.timestamp));
      this.responses.push(entry);
    });
  }
}

export class Entry {
  title: string;
  fullText: string;
  abstract: string;
  creationDate: Date;
  lastEditDate: Date;

  constructor(title: string, fullText: string, abstract: string, creationDate: Date, lastEditDate: Date) {
    this.title = title;
    this.fullText = fullText;
    this.abstract = abstract;
    this.creationDate = creationDate;
    this.lastEditDate = lastEditDate;
  }
}
