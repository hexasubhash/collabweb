var Reflux = require('libs').Reflux;

var loginForm = require("./loginForm.jsx");

var toolbox = require("./toolbox.jsx");
var quickmessage = require("./quickmessage.jsx");
var myLiterature = require("./myLiterature.jsx");
var messages = require("./messages.jsx");
var myTools = require("./myTools.jsx");
var toolboxAndMyToolbox = require("./toolboxAndMyToolbox.jsx");
var myProjects = require("./myProjects.jsx");
var messageList = require("./messagesList.jsx");
var contactForm = require("./contactForm.jsx");
var userProfileForm = require("./userProfileForm.jsx");

var registrationWizard = require("./registrationWizard.jsx");

var resetPassword = require("./passwordForgot.jsx");
var sscTerms = require("./sscTerms.jsx");
var earForm = require("./earForm.jsx");
var passwordUpdate = require("./passwordUpdate.jsx")
var testTable = require("./testTable.jsx")


var App = function (labels, selector) {
	window.app = this;
	var self = this;

	self.labels = labels;

	self.elements = document.querySelectorAll(selector);

	//self.actions = Reflux.createActions([
//		"changeMyTools"
//	]);

//No use till i know the usablility--Subhash
//	self.store = Reflux.createStore({
	//	listenables: self.actions,
		//onChangeMyTools: function () {
		//	this.trigger();
	//	}
//	});
}


App.prototype.display = function () {
	var self = this;
	for (var i = 0; i < self.elements.length; i++) {

		var element = self.elements[i];
		var type = element.getAttribute('data-wwidget-type');

		switch(type) {
			case 'toolbox':
				toolbox.display(self, element);
				break;
			case 'myTools':
				myTools.display(self, element);
				break;
			case 'quickMessage':
				quickmessage.display(self, element);
				break;
			case 'myLiterature':
				myLiterature.display(self, element);
				break;
			case 'messages':
				messages.display(self, element);
				break;
			case 'myProjects':
				myProjects.display(self, element);
				break;
			case 'messageList':
				messageList.display(self, element);
				break;
			case 'contactForm':
				contactForm.display(self, element);
				break;
			case 'userProfileForm':
				userProfileForm.display(self, element);
				break;
			case 'registrationWizard':
				registrationWizard.display(self, element);
				break;
			case 'loginForm':
				loginForm.display(self, element);
				break;
			case 'sscTerms':
				sscTerms.display(self, element);
				break;
			case 'earForm':
				earForm.display(self, element);
				break;
			case 'passwordForgot':
				resetPassword.display(self, element);
				break;
			case 'testTable':
				testTable.display(self, element);
				break;
			default:
				console.warn('Invalid wwidget element specified', element);
	        }
	    }
	}

	module.exports = {
	    App: App,
	}
