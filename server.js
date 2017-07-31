/*
 * Copyright 2017 Thomas Balouet All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var express      	 = require('express'),
	app              = module.exports = express(),
	Config           = require('./config'),
	conf             = new Config(),
	bodyParser       = require('body-parser');

if(conf.error){
	console.log("Please define environment with NODE_ENV=dev/prod node server.js");
	return;
}

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//Setting different views and public directories
app.set("views", ["views"]);

app.use('/public/', express.static(__dirname + '/public', {maxAge : conf.maxAge}));
app.use(express.static(__dirname + '/public', {maxAge : conf.maxAge}));

/*=============HomePage=============*/
app.get('/', function(req, res){
	if(req.get("X-Forwarded-Proto") === "http"){
    	res.redirect("https://" + req.headers['host'] + req.url);
    }
    else{
		res.render('lucidweb_index.ejs', {mainFile : "/public/lucidweb" + conf.mainFile});
    }
});

/*=============Contact=============*/
var contact = require("./server/contact.js").contact;
contact(app);

app.get('/*', function(req, res){
	if(req.get("X-Forwarded-Proto") === "http"){
    	res.redirect("https://" + req.headers['host'] + req.url);
    }
    else{
		res.writeHead(404, {'content-type': 'text/plain'});
		res.end();
    }
});


app.listen(conf.port);
console.log('Listening on port ' + conf.port);