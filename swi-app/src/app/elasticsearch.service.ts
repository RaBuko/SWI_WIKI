import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch-browser';
import * as elasticsearch from 'elasticsearch-browser';
import { AppComponent } from './app.component';
 
@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {
 
  private client: Client;
 
  constructor() {
    if (!this.client) {
      this._connect();
    }
  }
 
  private connect() {
    this.client = new Client({
      host: 'http://localhost:9200',
      log: 'trace'
    });
  }
 
  private _connect() {
    this.client = new elasticsearch.Client({
      host: 'localhost:9200',
      log: 'trace'
    });
  }
 
  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'hello!'
    });
  }

  sendRequest(query) : any {
    console.log("SendRequest:" + query);    
    return this.client.search({
      q: query,
      index: "enwikiquote",
    })
  }

  sendRequestByTitle(query): any {
    console.log("Send request by title: " + query);
    return this.client.search({
      body: {
        "query": {
          "match": {
            "title": query
          }
        }
      }
    })
  }
}
