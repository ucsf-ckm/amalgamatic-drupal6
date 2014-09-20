/*jshint expr: true*/

var drupal6 = require('../index.js');

var nock = require('nock');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var expect = Lab.expect;
var describe = lab.experiment;
var it = lab.test;
var afterEach = lab.afterEach;

describe('exports', function () {

	afterEach(function (done) {
		nock.cleanAll();
		done();
	});

	it('returns an empty result if no search term provided', function (done) {
		drupal6.search('', function (result) {
			expect(result).to.deep.equal({data:[]});
			done();
		});
	});

	it('returns results if a non-ridiculous search term is provided', function (done) {
		nock('http://www.library.ucsf.edu')
			.get('/search/node/medicine')
			.reply('200', '<dl class="search-results node-results"><dt class="title"><a href="http://example.com/1">Medicine 1</a></dt><dt class="title"><a href="http://example.com/2">Medicine 2</a></dt></dl>');

		drupal6.search('medicine', function (result) {
			expect(result.data.length).to.equal(2);
			done();
		});
	});

	it('returns an empty result if ridiculous search term is provided', function (done) {
		nock('http://www.library.ucsf.edu')
			.get('/search/node/fhqwhgads')
			.reply('200', '<dl class="search-results node-results"></dl>');

		drupal6.search('fhqwhgads', function (result) {
			expect(result.data.length).to.equal(0);
			done();
		});
	});

	it('returns an error object if there was an HTTP error', function (done) {
		nock.disableNetConnect();
		drupal6.search('medicine', function (result) {
			nock.enableNetConnect();
			expect(result.data).to.be.undefined;
			expect(result.error).to.equal('Nock: Not allow net connect for "www.library.ucsf.edu:80"');
			done();
		});
	});
});