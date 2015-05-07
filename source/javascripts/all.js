var urls, count;

function start(){
	var url = "http://sports.yahoo.com/nba/teams/lac/rss.xml";
	var links = new Array();
	if(url.match('^http')){

		$.getJSON("http://query.yahooapis.com/v1/public/yql?"+
            "q=select%20*%20from%20html%20where%20url%3D%22"+
            encodeURIComponent(url)+
            "%22&format=xml'&callback=?", 
			function(data){
				if(data.results[0]){						
					var data = filterData(data.results[0]);
					urls = parseLinks(data);
					var divs = $('.content div');
					var j = 0;
					for(count = 0; count < 3; count++){
						doAjax(urls[count], divs.eq(j));
						j++;
					}				
				} else{
					var errormessage = '<p>Error: could not load the page.</p>';
					target.html(errormessage);
				}
				
				}
		);
	}else {
		target.load(url);
	}
}

/* Perform .getJSON on the specific links from the RSS Feed, and filters the data returned.
*/
function doAjax(url, container){
	$.getJSON("http://query.yahooapis.com/v1/public/yql?"+
            "q=select%20*%20from%20html%20where%20url%3D%22"+
            encodeURIComponent(url)+
            "%22&format=xml'&callback=?", 
			function(data){
				if(data.results[0]){
					var data = filterSite(data.results[0]);
					container.html(data);
				} else{
					container.remove();
					console.log(url);
					createDivs();
					var divs = $('.content div');
					doAjax(urls[count], divs.eq(divs.length - 1));
					count++;
				}
			}
	);
}

/* Create 2 more divs */
function createDivs(){
	$('.content').append('<div class="target"></div>');
}

/*
This function filters the remaining data for content inside <p> and the <h1>
*/
function filterSite(data){
	data = filterData(data);
	var headline = data.match(/<h1\ class=\"headline">(.*?)\/h1>/g);
	data = data.replace(/<h1\ class=\"headline">(.*?)>/g, '');
	//data = data.replace(/^.*?(?=<p\ class="first">)/g, '');
	data = data.replace(/^.*?(?=<!--\ google_ad_section_start\ -->)/g, '');
	data = data.match(/^.*(?=<!--\ google_ad_section_end\ -->)/g);
	data = data[0];
	
	headline += data;
	return headline;
}

/*
This function returns the cleaned data from the getJSON request.
*/
function filterData(data){
	data = data.replace(/<?\/body[^>]*>/g,'');
	data = data.replace(/[\r|\n]+/g,'');
	data = data.replace(/<noscript[^>]*>[\S\s]*?<\/noscript>/g,'');
	data = data.replace(/<script[^>]*>[\S\s]*?<\/script>/g,'');
	data = data.replace(/<script.*\/>/,'');
	return data;
}

/*
This function returns all the links with sports.yahoo.com prefixed
*/
function parseLinks(data){
	//Does not handle sports.yahoo.com/blogs
	var links = data.match(/sports\.yahoo\.com\/news\b\S+/g);
	return links;
}

$(document).ready(function(){
	var target = $('.target');
	start();
});
=======
//= require_tree .
>>>>>>> master
