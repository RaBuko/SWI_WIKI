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
      this.sortResponses(SortType.noSort);
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

  private sortResponses(sortingType: SortType) {
    switch (sortingType) {
      case SortType.noSort: return;
      case SortType.lastEditDateAsc: {
        this.sortResponsesByLastEditDateAsc();
        break;
      }
      case SortType.lastEditDateDesc: {
        this.sortResponsesByLastEditDateDesc();
        break;
      }
      case SortType.creationDateAsc: {
        this.sortResponsesByCreationDateAsc();
        break;
      }
      case SortType.creationDateDesc: {
        this.sortResponsesByCreationDateDesc();
        break;
      }
    }
  }

  private sortResponsesByLastEditDateDesc() {
    this.responses.sort(function(lhs: Entry, rhs: Entry) {
      return rhs.lastEditDate.getTime() - lhs.lastEditDate.getTime();
    })
  }

  private sortResponsesByCreationDateDesc() {
    this.responses.sort(function(lhs: Entry, rhs: Entry) {
      return rhs.creationDate.getTime() - lhs.creationDate.getTime();
    })
  }

  private sortResponsesByLastEditDateAsc() {
    this.responses.sort(function(lhs: Entry, rhs: Entry) {
      return lhs.lastEditDate.getTime() - rhs.lastEditDate.getTime();
    })
  }

  private sortResponsesByCreationDateAsc() {
    this.responses.sort(function(lhs: Entry, rhs: Entry) {
      return lhs.creationDate.getTime() - rhs.creationDate.getTime();
    })
  }
}

export enum SortType {
  noSort,
  creationDateAsc,
  creationDateDesc,
  lastEditDateAsc,
  lastEditDateDesc
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
