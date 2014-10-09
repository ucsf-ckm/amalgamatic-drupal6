/*jshint expr: true*/

var rewire = require('rewire');

var drupal6 = rewire('../index.js');

var nock = require('nock');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var expect = Lab.expect;
var describe = lab.experiment;
var it = lab.test;

var before = lab.before;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;

describe('exports', function () {

	var originalOptions = {};

	before(function (done) {
		var options = drupal6.__get__('options');

		for (var property in options) {
			originalOptions[property] = options[property];
		}
		Object.freeze(originalOptions);
		done();
	});

	beforeEach(function (done) {
		nock.disableNetConnect();

		var restoredOptions = {};

		for (var property in originalOptions) {
			restoredOptions[property] = originalOptions[property];
		}

		drupal6.__set__('options', restoredOptions);
		done();
	});

	afterEach(function (done) {
		nock.cleanAll();
		done();
	});

	it('returns an empty result if no query object provided', function (done) {
		drupal6.search(null, function (err, result) {
			expect(err).to.be.not.ok;
			expect(result).to.deep.equal({data:[]});
			done();
		});
	});

	it('returns an empty result if no search term provided', function (done) {
		drupal6.search({searchTerm: ''}, function (err, result) {
			expect(err).to.be.not.ok;
			expect(result).to.deep.equal({data:[]});
			done();
		});
	});

	it('returns results if a non-ridiculous search term is provided', function (done) {
		nock('http://www.library.ucsf.edu')
			.get('/search/node/medicine')
			.reply(200, '<dl class="search-results node-results"><dt class="title"><a href="http://example.com/1">Medicine 1</a></dt><dt class="title"><a href="http://example.com/2">Medicine 2</a></dt></dl>');

		drupal6.search({searchTerm: 'medicine'}, function (err, result) {
			expect(err).to.be.not.ok;
			expect(result.data.length).to.equal(2);
			done();
		});
	});

	it('returns an empty result if ridiculous search term is provided', function (done) {
		nock('http://www.library.ucsf.edu')
			.get('/search/node/fhqwhgads')
			.reply(200, '<dl class="search-results node-results"></dl>');

		drupal6.search({searchTerm: 'fhqwhgads'}, function (err, result) {
			expect(err).to.be.not.ok;
			expect(result.data.length).to.equal(0);
			done();
		});
	});

	it('returns an error object if there was an HTTP error', function (done) {
		nock.disableNetConnect();
		drupal6.search({searchTerm: 'medicine'}, function (err, result) {
			nock.enableNetConnect();
			expect(result).to.be.not.ok;
			expect(err.message).to.equal('Nock: Not allow net connect for "www.library.ucsf.edu:80"');
			done();
		});
	});

	it('should use host,port, and path options if they are passed', function (done) {
		nock('http://example.com:8000')
			.get('/path/medicine')
			.reply(200, '<dl class="search-results node-results"><dt class="title"><a href="http://example.com/path/result">Medicine</a></dt></dl>');

		drupal6.setOptions({host: 'example.com', port: 8000, path: '/path'});
		drupal6.search({searchTerm: 'medicine'}, function (err, result) {
			expect(err).to.be.not.ok;
			expect(result.data).to.deep.equal([{name: 'Medicine', url: 'http://example.com/path/result'}]);
			done();
		});
	});

	it('should accept hostname as an option', function (done) {
		nock('http://example.com')
			.get('/path/medicine')
			.reply(200, '<dl class="search-results node-results"><dt class="title"><a href="http://example.com/path/result">Medicine</a></dt></dl>');

		drupal6.setOptions({hostname: 'example.com', path: '/path'});
		drupal6.search({searchTerm: 'medicine'}, function (err, result) {
			expect(err).to.be.not.ok;
			expect(result.data).to.deep.equal([{name: 'Medicine', url: 'http://example.com/path/result'}]);
			done();
		});
	});
});
