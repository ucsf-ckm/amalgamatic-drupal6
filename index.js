var cheerio = require('cheerio');
var http = require('http');
var extend = require('util-extend');

var options = {
    host: 'www.library.ucsf.edu',
    path: '/search/node'
};

exports.setOptions = function (newOptions) {
    options = extend(options, newOptions);
    if (newOptions.host) {
        options.hostname = newOptions.host;
    }
};

exports.search = function (query, callback) {
    'use strict';

    if (! query || ! query.searchTerm) {
        callback(null, {data: []});
        return;
    }

    var myOptions = options;

    myOptions.path = myOptions.path + '/' + encodeURIComponent(query.searchTerm);

    http.get(myOptions, function (res) {
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
            

            callback(null, {data: result});
        });
    }).on('error', function (e) {
        callback(e);
    });
};