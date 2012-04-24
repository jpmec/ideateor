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




Users = new Meteor.Collection("users");

Meteor.publish('users', function (user_id) {
  return Users.find(user_id);
});


Problems = new Meteor.Collection("problems");

Meteor.publish('problems', function (user_id) {
  return Problems.find({user_id: user_id}, {sort: {rank: -1}});
});


Ideas = new Meteor.Collection("ideas");

Meteor.publish('ideas', function (problem_id) {
  return Ideas.find({problem_id: problem_id}, {sort: {rank: 1}});
});


Pros = new Meteor.Collection("pros");

Meteor.publish('pros', function (idea_id) {
  return Pros.find({idea_id: idea_id});
});


Cons = new Meteor.Collection("cons");

Meteor.publish('cons', function (idea_id) {
  return Pros.find({idea_id: idea_id});
});

UserIdeaSearch = new Meteor.Collection("user_idea_search");

Meteor.publish('user_idea_search', function (user_id) {
    return UserIdeaSearch.find({user_id: user_id});
});
