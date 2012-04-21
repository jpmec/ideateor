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




Template.sign_in.events = {
	'click #sign_in_button' : function () {
		if ($('#sign_in_form').css('display') == 'none') {
			$('#sign_in_form').slideDown(); 
			$('#sign_up_form').slideUp();}
		else {
			console.log('calling signinUser')
			
			var name = $('#signin_username_input').val();
			var pwd = Crypto.SHA256($('#signin_password_input').val());
			$('#signin_password_input').val('')
						
			Session.set('user_name', name);
		    Session.set('user_pwd', pwd);
			
			usersModel.signinUser	( name, pwd
									, function (error, result) {
										console.log('callback');
										
										if (error || !result) {
											console.log(error);
											$('#sign_in_error').slideDown();
											$('#sign_in_error_sign_up').slideDown();
										}
										else if (result) {
											Router.gotoUser(result);
										}
									});
		}
	},
	
	'click #sign_in_error_sign_up' : function () {
		$('#sign_in_form').slideUp(); 
		$('#sign_in_error').fadeOut();
		$('#sign_in_error_sign_up').fadeOut();		
		$('#sign_up_form').slideDown();
	}
};


Template.sign_up.events = {
	
	// show the sign up form
	'click #sign_up_text' : function () {
		$('#sign_in_form').slideUp(); 
		$('#sign_in_error').fadeOut();
		$('#sign_in_error_sign_up').fadeOut();		
		$('#sign_up_form').slideDown();		
	},
	
	'click #sign_up_continue_button' : function () {
		var name = $('#signup_username_input').val();
		var pwd = Crypto.SHA256($('#signup_password_input').val());
		$('#signup_password_input').val('');
			
		Session.set('user_name', name);
		Session.set('user_pwd', pwd);
		
		var user = usersModel.createUser	( name, pwd
											, function(error, result) {
												if (error) {
													console.log('error creating user');
												}
												else if (result) {
													console.log('created user ' + result)
													Session.set('user_id', result);
													Router.gotoUser(result);
												}
												else {
													console.log('did not create user for ' + username + ' ' + password);
												}
											});
	}
};
