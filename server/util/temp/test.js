// var cwl=require('./crawlerSefaz');
// cwl('25150945543915044120650030000349439704806380', function(err, data){console.log(data)})
// cwl('25150945543915044120650030000349439704806380', function(err, data){})

var cheerio = require('cheerio')
var page = require('fs').readFileSync('./page.html');
$ = cheerio.load(page.toString());
$('.toggable').eq(index).find('span').eq(0).text();
