function test() {
    document.write("TEST TEST")
}

function httpGet(searchPhrase) {
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:2137/" + searchPhrase;
    xhr.open("GET", url);    
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
        }
    };
    xhr.send();
}