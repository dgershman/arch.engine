/**
 * Created by danny on 9/28/14.
 */
var Crawler = require("crawler").Crawler;
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client();
var urlMemory = [];
var sites = [ "bergenarea.org" ] //, "www.passaicarea.org" ];

var c = new Crawler({
    "maxConnections":10,
    "callback":function(error,result,$) {

        // TODO: At some point will need to index more than just HTML.
        if (result.headers["content-type"].indexOf("text/html") > -1) {
            client.index({
                index: 'arch',
                type: 'page',
                id: result.uri,
                body: {
                    title: $("title").text(),
                    content: $("body").text(),
                    url: result.uri
                }
            });

            $("a").each(function (index, a) {
                console.log(a.href);
                if (urlMemory.indexOf(a.href) == -1 && sites.indexOf(a.hostname) > -1) {
                    urlMemory.push(a.href);
                    c.queue(a.href);
                }
            });
        }
    }
});

for (var i = 0; i < sites.length; i++) {
    urlMemory.push(sites[i]);
    c.queue("http://" + sites[i]);
}