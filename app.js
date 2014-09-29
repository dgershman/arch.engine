/**
 * Created by danny on 9/28/14.
 */
var Crawler = require("crawler").Crawler;
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client();
var host = "www.passaicarea.org";

var c = new Crawler({
    "maxConnections":10,
    "callback":function(error,result,$) {
        console.log(result.uri);

        client.index({
            index: 'arch',
            type: 'page',
            id: result.uri,
            body: {
                title: 'JavaScript Everywhere!',
                content: result.body,
                date: '2013-12-17'
            }
        });

        $("a").each(function(index,a) {
            if (a.href.indexOf(host) > 0)
            c.queue(a.href);
        });
    }
});

c.queue("http://" + host);