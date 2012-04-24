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

Problems = new Meteor.Collection("problems");
Ideas = new Meteor.Collection("ideas");
Pros = new Meteor.Collection("pros");
Cons = new Meteor.Collection("cons");
Solutions = new Meteor.Collection("solutions");

UserIdeaSearch = new Meteor.Collection("user_idea_search");


// Session /////////////////////////////////////////////////////////////////////

Session.set('unit_test', false); // don't test by default
Session.set('user_id', null);
Session.set('problem_id', null);
Session.set('idea_id', null);




// Subscriptions ///////////////////////////////////////////////////////////////

Meteor.subscribe('problems', function () {
	if (!Session.get('problem_id')) {
		var problem = Problems.findOne({}, {sort: {name: 1}});
		if (problem)
			Router.setProblem(problem._id);
	}
});


Meteor.autosubscribe(function () {
	var user_id = Session.get('user_id');
	if (user_id) {
		Meteor.subscribe('users', user_id);
		Meteor.subscribe('problems', user_id);
		Meteor.subscribe('user_idea_search', user_id);
	}

	var problem_id = Session.get('problem_id');
	if (problem_id) {
		Meteor.subscribe('ideas', problem_id);
	}
});




////////////////////////////////////////////////////////////////////////////////
// Templates ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


Template.body_content.unit_test = function () {
	return Session.get('unit_test');
}


Template.body_content.user_id = function () {
	return Session.get('user_id');
}


Template.body_content.problem_id = function() {
	return Session.get('problem_id');
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
		Session.keys = {};
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


Template.problems.user_id = function () {
	return Session.get('user_id');
};


Template.problems.no_problems = function () {
	return (Problems.find().count() === 0)
};



Template.problems.problems = function () {
	return Problems.find({}, {sort: {rank: -1}});
};

Template.problems.unsolved_problems = function () {
	var user_id = Session.get('user_id');
	return Problems.find({solution_id: null, user_id: user_id}, {sort: {rank: -1}});
};

Template.problems.is_unsolved_problems = function () {
	return Template.problems.unsolved_problems().count() > 0;
}

Template.problems.other_problems = function () {
	var user_id = Session.get('user_id');
	return Problems.find({solution_id: null, user_id: {$ne: user_id}}, {sort: {rank: -1}});
};

Template.problems.is_other_problems = function () {
	return Template.problems.other_problems().count() > 0;
}

Template.problems.solved_problems = function () {
	return Problems.find({solution_id: {$ne: null}}, {sort: {rank: -1}});
};

Template.problems.is_solved_problems = function () {
	return Template.problems.solved_problems().count() > 0;
}



Template.problems_controls.events = {
	'click #new_problem_input_submit' : function () {
		
		var i = $('#new_problem_input');
		var val=i.val();
		
		if (!val) {
			$('#new_problem_input_submit_help').fadeIn();
			return;
		}
		
		i.val(null);
		userModel.createProblem(val);
	}
};


Template.problem.events = {
	'click .problem-text' : function () {
		Router.gotoProblem(this.user_id, this._id);	
	},
	
	'click .increase-problem-rank-button': function () {
		userModel.increaseProblemRank(this._id);
	},
	
	'click .decrease-problem-rank-button' : function () {
		userModel.decreaseProblemRank(this._id);			
	},
	
	'click .delete-problem-button' : function () {
		userModel.deleteProblem(this._id)
	}
};


Template.active_problem.problems = function () {
	return Problems.find(Session.get('problem_id'));
};

Template.active_problem.owner = function () {
	var problem_id = Session.get('problem_id');	
	
	var problem = Problems.findOne(problem_id);
	
	var owner = Users.findOne(problem.user_id);
	
	return owner.name;
};


Template.active_problem.text = function () {
	var problem_id = Session.get('problem_id');
	
	var problem = Problems.findOne({_id: problem_id});
	
	if (problem)
		return problem.text;
	else
		return '';
};


Template.active_problem.status = function () {
	var problem_id = Session.get('problem_id');

	if (!problem_id)
		return 'unknown';
	else {
		var problem = Problems.findOne({_id: problem_id});
		
		if (!problem)
			return 'unknown';
		else {
			if (problem.solution_id)
				return 'solved';
			else
				return 'unsolved';
		}
			
	}
};


Template.active_problem.ideas = function () {
	var problem_id = Session.get('problem_id');
	
	if (problem_id)
		return Ideas.find({problem_id: problem_id});
	else
		return null;
};




Template.ideas.no_ideas = function () {
	return (Ideas.find().count() === 0);
}


Template.ideas.ideas = function () {
	var problem_id = Session.get('problem_id');
	
	if (!problem_id)
		return {};

	return Ideas.find({problem_id: problem_id});
};


Template.ideas.events = {
	'click .select': function () {
		Session.set('idea_id', this._id);
	}
};


Template.google_ideas.ideas = function () {
	
};


Template.bing_ideas.bing_ideas = function () {
	
	var user_id = Session.get('user_id');
	var problem_id = Session.get('problem_id');
	
	var problem = Problems.findOne(problem_id);
	
	console.log(problem);
	
	if (!problem) {
		return;
	}
	
	var search = UserIdeaSearch.findOne({user_id: user_id});
	
	if (search) {
		console.log(search.result.join(''));
		
		var data = JSON.parse(search.result.join(''));
		
		console.log('JSON parse results');
		console.log(data.SearchResponse.Web.Results);
		
		return data.SearchResponse.Web.Results;
	}
	else {
		return [{text: ''}];
	}
};


Template.new_idea_form.events = {
	'click #new_idea_add_button': function () {	
		var i = $('#new_idea_input');
		userModel.createIdea(i.val());
		i.val(null);
	}
};


Template.idea.events = {
	'hover': function () {
		$('.idea_controls').fadeIn();
	},
	
	'mouseout' : function () {
//		$('.idea_controls').fadeOut();		
	}
};


Template.pros.pros = function () {
	var idea_id = Session.get('idea_id');
	if (!idea_id)
		return {};

	var sel = {idea_id: idea_id};
	return Pros.find(sel);
};

Template.pros.events = {};


Template.cons.cons = function () {
	var idea_id = Session.get('idea_id');
	if (!idea_id)
		return {};

	var sel = {idea_id: idea_id};
	return Cons.find(sel);
};

Template.cons.events = {};




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
	
	createUser: function (options, callback) {
		console.log(options.name);
		console.log(options.pwd);
		
		if (options.name && options.pwd) {
						
			console.log('Creating user: ' + options.name);			
			
			Meteor.apply	('createUser'
							, [Crypto.SHA256(options.name), Crypto.SHA256(options.pwd)]
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




var UserModel = Backbone.Model.extend({
	
	isValidSession: function () {
		var user_pwd = Session.get('user_pwd');
		
		console.log(user_pwd);
		
		return user_pwd;
	},
	
	createProblem: function (text) {
		if (!text)
			return null;
			
		var user_id = Session.get('user_id');
		if (!user_id)
			return null;
		
		var problem = Problems.findOne({text: text});
		
		if (problem) {
			return problem._id;
		}		
		else {
			var timestamp = new Date();
		
			return Problems.insert({	text: text,
										user_id: user_id,
										rank: 1,
										solvers: [],
										solution_id: null,
										created: timestamp	});										
		}					
	},
	
	deleteProblem: function (problem_id) {
		
		if (!problem_id)
			return;
		
		Ideas.remove({problem_id: problem_id});
		
		Problems.remove(problem_id, function () {
			Session.set('problem_id', null);
		});
		
	},
	
	increaseProblemRank: function (problem_id) {
		if (!problem_id)
			return;		

		var problem = Problems.findOne({_id: problem_id});
		
		if (!problem)
			return;
		if (problem.rank < 10)
			Problems.update({_id: problem_id}, {$set : {rank:  problem.rank + 1}});
	},
	
	decreaseProblemRank: function (problem_id) {
				
		if (!problem_id)
			return;
		
		var problem = Problems.findOne({_id: problem_id});
		
		if (!problem)
			return;
		
		if (problem.rank > 1)
			Problems.update({_id: problem_id}, {$set : {rank:  problem.rank - 1}});
	},
	
	createIdea: function (text) {
		if (!text)
			return null;
		
		var user_id = Session.get('user_id');
		var problem_id = Session.get('problem_id');
		
		if (!user_id || !problem_id)
			return null;
			
		var idea = Ideas.findOne({text: text});
		
		if (idea)
			return idea._id;
		else {
			var timestamp = new Date();
			
			var idea_id = Ideas.insert({	text: text,
											user_id: user_id,
											problem_id: problem_id,
											created: timestamp	});
											
			Session.set('idea_id');
			
			return idea_id;
		}
		
	},
	
	searchBing: function (text, callback_after_apply) {
		if (!text)
			return null;
		
		console.log('searching bing for ' + escape(text));
		
		var user_id = Session.get('user_id');
		
		Meteor.apply('searchBing', [user_id, escape(text)], callback_after_apply);	
		return {text: 'searching...'};
	}
});


var userModel = new UserModel;



////////////////////////////////////////////////////////////////////////////////
// Router //////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var IdeateorRouter = Backbone.Router.extend({
	routes: {
		"": "urlHome",
		"login/": "urlLogin",
		"user/:user_id": "urlUser",
		"problem/:user_id/:problem_id": "urlProblem",
		"idea/:idea_id": "urlIdea",		
		"test/": "urlTest"
	},
	
	urlHome: function () {
			console.log("at home");
			//$('#header_title_bang').fadeOut();
			Session.keys = {};
			Router.gotoLogin();
	},
	
	urlTest: function () {
		Session.set('unit_test', true);
	},
	
	gotoLogin: function () {
		console.log('going to login');
		this.navigate('login/', true);
	},
	
	urlLogin: function () {
		console.log('at login');
		Session.keys = {};
		$('#login_block').slideDown();
	},
	
	gotoUser: function (user_id) {
		console.log('going to user ' + user_id);
		this.navigate('user/' + user_id, true);
	},
	
	urlUser: function (user_id) {
		if (!userModel.isValidSession()) {	
			Router.gotoLogin();
		}
		
		console.log('checking for user ' + user_id);
		usersModel.isUser(user_id, function (error, result) {
			if (error || !result) {
				console.log(user_id + " is not user");
				Router.gotoLogin();
			}
			else {
				console.log(user_id + " is user");
				Session.set("user_id", user_id);
				
				if (Problems.find().count() === 0) {
					console.log('no problems');
					console.log($('#no_problems_text'));
					$('#no_problems_text').fadeIn();
					console.log('faded in');
				}
			}
		});
	},
	
	urlProblem: function (user_id, problem_id) {
		if (!userModel.isValidSession())
			Router.gotoLogin();
		
		console.log('checking for problem ' + problem_id)
		Meteor.apply('isProblem', [problem_id], function (error, result) {

			if (error) {
				console.log('Error checking for problem.' + error)
				Router.setProblem(null);
				Router.gotoLogin();
			}
			else if (result) {
				console.log(problem_id + 'is problem')
				Router.setProblem(result.problem_id);
				
				var problem = Problems.findOne(result.problem_id);
				
				// start search
				userModel.searchBing(problem.text);
			}
			else {
				console.log("no problem " + problem_id);
				Router.setProblem(null);
				Router.gotoLogin();				
			}
		});
	
	},
	
	gotoProblem: function (user_id, problem_id) {
		this.navigate("problem/" + user_id + '/' + problem_id, true);
	},
	
	gotoUserProblems: function (user_id) {
		Session.set('problem_id', null);
		Router.gotoUser(user_id);
	},
	
	setProblem: function (problem_id) {
		Session.set("problem_id", problem_id);
	},
	
	urlIdea: function (idea_id) {
		Session.set("idea_id", idea_id);
	},
	
	setIdea: function (idea_id) {
		this.navigate("idea/" + idea_id, true);
	}	
});


Router = new IdeateorRouter;




////////////////////////////////////////////////////////////////////////////////
// Start up ////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


if (Meteor.is_client) {

}


Meteor.startup(function () {
	Backbone.history.start({pushState: true});	
});


