[![Build Status](https://travis-ci.org/ucsf-ckm/amalgamatic-drupal6.svg?branch=master)](https://travis-ci.org/ucsf-ckm/amalgamatic-drupal6)

amalgamatic-drupal6
===================

Plugin for [Amalgamatic](https://github.com/ucsf-ckm/amalgamatic) to search a Drupal 6 website

## Installation

Install amalgamatic and this plugin via `npm`:

`npm install amalgamatic amalgamatic-drupal6`

## Usage

````
var amalgamatic = require('amalgamatic'),
    drupal6 = require('amalgamatic-drupal6');

// Set the URL to point to your Drupal 6 search page
drupal6.setOptions({url: 'https://www.library.ucsf.edu/search/node'});

// Add this plugin to your Amalgamatic instance along with any other plugins you've configured.
amalgamatic.add('drupal6', drupal6);

//Use it!
var callback = function (err, results) {
    if (err) {
        console.dir(err);
    } else {
        results.forEach(function (result) {
            console.log(result.name);
            console.dir(result.data);
        });
    }
};

amalgamatic.search({searchTerm: 'medicine'}, callback);
````
