var querystring = require('querystring');
var cheerio = require('cheerio');
var http = require('http');

exports.search = function (query, callback) {
    'use strict';

    if (! query || ! query.searchTerm) {
        callback({data: []});
        return;
    }

    var options = {
        host: 'www.library.ucsf.edu',
        path: '/search/node/' + querystring.escape(query.searchTerm)
    };

    http.get(options, function (res) {
        var rawData = '';

        res.on('data', function (chunk) {
            rawData += chunk;
        });

        res.on('end', function () {
            var $ = cheerio.load(rawData);
            var result = [];

            var rawResults = $('.search-results .title a');

            rawResults.each(function () {
                result.push({
                    name: $(this).text(),
                    url: $(this).attr('href')
                });
            });
            

            callback({data: result});
        });
    }).on('error', function (e) {
        callback({error: e.message});
    });
};