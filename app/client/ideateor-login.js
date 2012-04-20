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
			//usersModel.signinUser($('#signin-username-input').val(), $('#signin-password-input').val());
		}
	}
};


Template.sign_up.events = {
	'click #sign_up_text' : function () {
		$('#sign_in_form').slideUp(); 
		$('#sign_in_error').fadeOut();
		$('#sign_up_form').slideDown();		
	},
	
	'click #sign_up_continue_button' : function () {
		//usersModel.createUser( $('#signup-username-input').val(), $('#signup-password-input').val() );
	}
};
