from flask import Flask, jsonify
from elasticsearch import Elasticsearch

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
app = Flask(__name__)

body = {
    "query": {
        "match": {
            "text": 'star'
        }
    }
}


@app.route('/')
def search():
    res = es.search(index="enwikiquote", body=body)
    return jsonify(res['hits']['hits'])
