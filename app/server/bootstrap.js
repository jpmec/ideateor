/*
Copyright (c) 2012 Joshua Petitt

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH 
THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/


var require = __meteor_bootstrap__.require;
var crypto = require('crypto');
var http = require("http");

Meteor.startup(function () {
    
    var server_pwd = "TODO CHANGE THIS TO RANDOM PASSWORD";
    
    Meteor.methods({
        
    	isUser: function (user_id) {
            
            var cipher = crypto.createCipher('aes256', server_pwd);
            
            var ciph = cipher.update(user_id, 'utf8', 'hex');
            ciph += cipher.final('hex');
            
            console.log('ciph = ' + ciph);
            
			var user = Users.findOne(user_id);
			
			if (user) {
                console.log(user_id + ' is user');
				return true;
			}
			else {
                console.log(user_id + ' is not user');
				return false;
			}
		},
        
		createUser: function (username, password) {
            console.log('creating user')
            
            // check for existing user
			if (Users.findOne({name: username}))
				throw new Meteor.Error(1, "User name already exists.");
		
			var user = Users.findOne({private: {name: username, cred: password}});

			if (user)
				return user._id;
			else {
				var timestamp = new Date();
				return Users.insert({created: timestamp, private: {name: username, cred: password}, public:{name: ''}});
			}
		},
        
        signinUser: function (username, password) {
            console.log('signing in ' + username + ' ' + password);
            
//            var cipher = crypto.createCipher('aes256', server_pwd);
            
//            var ciph = cipher.update(username + password, 'utf8', 'hex');
//            ciph += cipher.final('hex');
            
//          console.log('ciph = ' + ciph);            
            
			var user = Users.findOne({private: {name: username, cred: password}});

			if (user) {
                console.log('signinUser ' + username + ' ' + password);                
				return user._id;
            }
			else {
                console.log('signinUser error ' + username + ' ' + password);
				return null;
			}
		},
        
        deleteUser: function (user_id, password) {
            console.log('deleting user ' + user_id + ' ' + password);
            
            var user = Users.findOne({_id: user_id, private: {cred: password}});
            
			if (user) {
                console.log('deleteUser ' + username + ' ' + password);                
				Users.remove(user);
                return true;
            }
			else {
                console.log('deleteUser error ' + username + ' ' + password);
				return false;
			}            
        },
        
        
		isProblem: function (problem_id) {
					
			var problem = Problems.findOne(problem_id);
			
			console.log(problem);
			
			if (problem) {
                console.log(problem_id + " is a problem");
				return {user_id: problem.user_id, problem_id: problem_id};
			}
			else {
                console.log(problem_id + " is not a problem");
				return false;
			}
		},
        
        
        searchBing: function (user_id, text) {
            Fiber(function(){
                console.log('searching Bing for "' + text + '"');
                  
                var options = {
                  host: 'api.search.live.net',
                  port: 80,
                  path: "/json.aspx?AppId=8A4F5D41C743520611B5366C4CB5E9113ADBE9E8&Query='" + text + "'&sources=web",
                  cache: true
                };
                                
                console.log('http://' + options.host + options.path);

                // clear old search results
                UserIdeaSearch.remove({user_id: user_id, host: options.host});
                UserIdeaSearch.insert({user_id: user_id, host: options.host, text: text, result: []});

                // request and cache data here
                http.get(options, function(res) {
                  Fiber( function() {
                    console.log("Got response: " + res.statusCode);
                
                    res.setEncoding('UTF8');
                  
                    res.on('data', function(chunk) {
                        Fiber(function() {
                          UserIdeaSearch.update({user_id: user_id}, {$push: {result: chunk}});
                        }).run();
                    });
                 
//                  res.on('end', function () {
//                    console.log('reached end');
//                    console.log(data);
                //    UserIdeaSearch.insert({user_id: user_id, text: text, result: data});
//                  });
                  
                //}).on('error', function(e) {
                //  console.log("Got error: " + e.message);
                  }).run();
                });
            }).run();
        }
    });
});
