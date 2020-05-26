import { Component, OnInit, ChangeDetectorRef, NgModule } from '@angular/core';
import { ElasticsearchService } from '../elasticsearch.service';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  title = 'SWI - Wikiquotes';
  description = 'SWI - Wikiquotes';
  isConnected = false;
  status: string;
  searchPhrase: string;
  responses: Entry[];
  showAdvanced = false;
  sortByCreationDate = false;
  sortByLastEditDate = false;
  selectedSortCreationDate: string;
  selectedSortLastEditDate: string;
  shouldSearchByTitle = false;
  shouldSearchByText = false;
  searchTitle: string;
  searchText: string;

  sortCreationDateOptions = [
    { name: "Malejąco", value: SortType.creationDateDesc },
    { name: "Rosnąco", value: SortType.creationDateAsc }
  ]

  sortLastEditDateOptions = [
    { name: "Malejąco", value: SortType.lastEditDateDesc },
    { name: "Rosnąco", value: SortType.lastEditDateAsc }
  ]

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

  changeShowAdvanced() {
    this.showAdvanced = !this.showAdvanced;
  }

  getDocuments(query) {
    console.log(query);

    let sortType = SortType.noSort;
    if (this.sortByCreationDate) {
      sortType = this.convertCreationDateSort(this.selectedSortCreationDate);
      console.log("Sort: CreationDate");
    }
    else if (this.sortByLastEditDate) {
      sortType = this.convertLastEditDateSort(this.selectedSortLastEditDate);
      console.log("Sort: LastEditDate");
    }

    if (this.shouldSearchByText) {
      console.log("Text: " + this.searchText);
    }
    if (this.shouldSearchByTitle) {
      console.log("Title: " + this.searchTitle);
    }

    this.es.sendRequest(query).then(response => {
      //this.es.sendRequestByTitle(query).then(response => {
      //this.es.sendRequestCombined(query).then(response => {
      //this.es.sendRequestByText(query).then(response => {
      this.convertResponse(response.hits.hits);
      this.sortResponses(sortType);
      console.log(response);
    }, error => {
      console.error(error);
    });
  }

  private convertLastEditDateSort(selection: string) {
    switch (selection) {
      case "Malejąco": {
        return SortType.lastEditDateDesc;
      }
      case "Rosnąco": {
        return SortType.lastEditDateAsc;
      }
    }
  }

  private convertCreationDateSort(selection: string) {
    switch (selection) {
      case "Malejąco": {
        return SortType.creationDateDesc;
      }
      case "Rosnąco": {
        return SortType.creationDateAsc;
      }
    }
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
    this.responses.sort(function (lhs: Entry, rhs: Entry) {
      return rhs.lastEditDate.getTime() - lhs.lastEditDate.getTime();
    })
  }

  private sortResponsesByCreationDateDesc() {
    this.responses.sort(function (lhs: Entry, rhs: Entry) {
      return rhs.creationDate.getTime() - lhs.creationDate.getTime();
    })
  }

  private sortResponsesByLastEditDateAsc() {
    this.responses.sort(function (lhs: Entry, rhs: Entry) {
      return lhs.lastEditDate.getTime() - rhs.lastEditDate.getTime();
    })
  }

  private sortResponsesByCreationDateAsc() {
    this.responses.sort(function (lhs: Entry, rhs: Entry) {
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
