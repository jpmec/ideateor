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




////////////////////////////////////////////////////////////////////////////////
// Collections /////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Users = new Meteor.Collection("users");




// Session /////////////////////////////////////////////////////////////////////

Session.set('test', false); // don't test by default
Session.set('user_id', null);

if (Meteor.is_client) {

}




////////////////////////////////////////////////////////////////////////////////
// Templates ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Template.body_content.test = function () {
	return Session.get('test');
}

Template.body_content.user_id = function () {
	return Session.get('user_id');
}

Template.user_widget.user_id = function () {
	return Session.get('user_id');	
}


Template.about.events = {
	'click #about_title': function () {
		$('#about_content').slideToggle();
	}
};



Template.user_widget.user_name = function () {
	return Session.get('user_name');
};


Template.user_widget.created = function () {
	var user_id = Session.get('user_id');
	
	if (!user_id)
		return '';
		
	var user = Users.findOne({_id: user_id});
		
	if (user)
		return new Date(user.created).toDateString();
	else
		return '';
};


Template.user_controls.user_id = function () {
	return Session.get('user_id');
};


Template.user_controls.events = {
	'click #user_control_home' : function () {
		var user_id = Session.get('user_id');

		Router.gotoUserProblems(user_id);
	},
	
	'click #user_control_logout' : function () {
		Session.keys = null;
		Router.gotoLogin();
	},
	
	'click #user_control_delete_user' : function () {
		var user_id = Session.get('user_id');
		var user_pwd = Session.get('user_pwd')
		usersModel.deleteUser	( user_id, user_pwd
								, function(error, result){
									Session.keys = null;
									Router.gotoLogin();
								});
	}	
};




////////////////////////////////////////////////////////////////////////////////
// Models //////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var UsersModel = Backbone.Model.extend({
		
	isUser: function (username, callback) {
		console.log(username);

		if (username) {
			Meteor.apply('isUser', [username], callback);
		}
	},
	
	createUser: function (username, password, callback) {
		console.log(username);
		console.log(password);
		
		if (username && password) {
			
			// TODO encrypt info
			
			console.log('Creating user: ' + username);
			console.log(Crypto.SHA256(username));
			
			
			Meteor.apply	('createUser'
							, [Crypto.SHA256(username), Crypto.SHA256(password)]
							, callback);
		}
	},
	
	signinUser: function (username, password, callback) {
		console.log('sign in user ' + username + ' ' + password);

		if (username && password) {
			Meteor.apply	('signinUser'
							, [Crypto.SHA256(username), Crypto.SHA256(password)]
							, callback);
		}		
	},
	
	deleteUser: function (user_id, password, callback) {
		console.log('deleting user ' + user_id + ' ' + password);
		
		if (user_id && password) {
			Meteor.apply	('deleteUser'
							, [user_id, Crypto.SHA256(password)]
							, callback);
		}
	}
	
});

var usersModel = new UsersModel;


////////////////////////////////////////////////////////////////////////////////
// Router //////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var IdeateorRouter = Backbone.Router.extend({
	routes: {
		"": "urlHome",
		"login/": "urlLogin",
		"user/:user_id": "urlUser",
		"test/": "urlTest"
	},
	
	urlHome: function () {
			console.log("at home");
			//$('#header_title_bang').fadeOut();
			Router.gotoLogin();
	},
	
	urlTest: function () {
		Session.set('test', true);
	},
	
	gotoLogin: function () {
		console.log('going to login');
		this.navigate('login/', true);
	},
	
	urlLogin: function () {
		console.log('at login');
		$('#login_block').slideDown();
	},
	
	gotoUser: function (user_id) {
		console.log('going to user ' + user_id);
		this.navigate('user/' + user_id, true);
	},
	
	urlUser: function (user_id) {
		console.log('checking for user ' + user_id);
		usersModel.isUser(user_id, function (error, result) {
			if (error || !result) {
				console.log(user_id + " is not user");
				Router.gotoLogin();
			}
			else {
				console.log(user_id + " is user");
				Session.set("user_id", user_id);
			}
		});
	}
});


Router = new IdeateorRouter;


Meteor.startup(function () {
	Backbone.history.start({pushState: true});	
});

