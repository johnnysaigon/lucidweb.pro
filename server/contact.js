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
var sendmail         = require('sendmail')(),
	striptags        = require('striptags'),
	htmlspecialchars = require('htmlspecialchars');

exports.contact = function(app){
	app.post('/contact', function(req, res){
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var data = req.body;

		if(data.name === undefined      ||
		   data.email === undefined     ||
		   data.message === undefined   ||
		   !re.test(data.email))
		{
			console.log("No correct argument provided for message", req.body);
			res.end("false");
	   	}
	   	else{
			var name          = striptags(htmlspecialchars(data.name));
			var email_address = striptags(htmlspecialchars(data.email));
			var phone         = striptags(htmlspecialchars(data.phone));
			var message       = striptags(htmlspecialchars(data.message));
			   
			// Create the email and send the message
			var to            = 'contact@lucidweb.io'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
			var email_subject = "Website Contact: " + data.name;
			var email_body    = "You have received a new message from your website contact form.<BR> Here are the details:<BR><u>Name</u>: "+name+"<BR><u>Email</u>: "+email_address+"<BR><u>Message</u>:"+message;  
			sendmail({
				from   : 'no-reply@lucidweb.io',
				to     : to,
				subject: email_subject,
				html   : email_body,
			}, function(err, reply) {
				if(err){
					console.log(err && err.stack);
				}
			});
			res.end("true");
	   	}   
	});
};