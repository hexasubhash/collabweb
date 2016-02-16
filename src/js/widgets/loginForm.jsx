var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var api = require('../api');


var LoginForm = React.createClass({
	getInitialState: function() {
		return {logedIn: false, 
				defaultEmailMessage: true, 
				defaultPasswordMessage: true, 
				username: undefined, 
				password: undefined,
				loginErrorMessage: false,
				justLogedOut: location.search.split('logout=')[1]
			}
	},
	
	
	onFocusEmail: function(e) {
		this.setState({defaultEmailMessage: false});
		document.getElementById("login-name").focus();
	},
	
	onBlurEmail: function(e) {
		var value = e.target.value;
		if(value == '') {
			this.setState({defaultEmailMessage: true});
		}
	},
	
	onFocusPassword: function(e) {
		this.setState({defaultPasswordMessage: false});
		document.getElementById("password").focus();
	},
	
	onBlurPassword: function(e) {
		var value = e.target.value;
		if(value == '') {
			this.setState({defaultPasswordMessage: true});
		}
	},
	
	renderPasswordSpan: function(e) {
		var defaulMessage = this.state.defaultPasswordMessage ?
				this.props.labels.passwordField
				: undefined;
		return (<span className="inlineStyle" onClick={this.onFocusPassword} onBlur={this.onBlurPassword}>{defaulMessage}</span>);
	},
	
	renderEmailSpan: function(e) {
		var defaulMessage = this.state.defaultEmailMessage ?
				this.props.labels.emailField
				: undefined;
		return (<span className="inlineStyle" onClick={this.onFocusEmail} onBlur={this.onBlurEmail}>{defaulMessage}</span>);
	},
	
	 usernameChanged: function(e) {
		 this.state.username = e.target.value;
	},
	
	 passwordChanged: function(e) {
		 this.setState({defaultPasswordMessage: false});
		 this.state.password = e.target.value;
	},
	
	login: function(e) {
		e.preventDefault();
		var self = this;
		api.login(this.state.username, this.state.password).end(function (err, resJson) {
			if(!err) {
				if(window.location.href.indexOf("homepage") != -1) {
					window.location.href = JSON.parse(resJson.text) + "member_area/member_area.html";					
				} else {
					location.reload();
				}
			} else {
				self.setState({loginErrorMessage: true});
				self.setState({justLogedOut : false});
			}
		});
	},
	
	render: function() {
		var self = this;
		
		var loginErrorMessage = self.state.loginErrorMessage
		? <div className="severity2">{this.props.labels.loginFaildMessage}</div>
		: undefined;
		
		var justLogOut = self.state.justLogedOut
		? <div className="severity0">{this.props.labels.logoutMessage}</div>
		: undefined;
		
		return(<div id="loginWidget">
				<div id="logintab">Login</div>
						<div id="login" >
						{loginErrorMessage}
						{justLogOut}
						<form onSubmit={this.login}>		
							<div className="input-wrapper">
							   {this.renderEmailSpan()}
								<input type="text" name="username" id="login-name" className="loginfield" onFocus={this.onFocusEmail}
									onBlur={this.onBlurEmail} onChange={this.usernameChanged} defaultValue={this.state.username}/>
							</div>
							<div className="input-wrapper">									
							 	{this.renderPasswordSpan()}						
								<input type="password" name="password" id="password" className="loginfield" onFocus={this.onFocusPassword} 
									onBlur={this.onBlurPassword} onChange={this.passwordChanged}/>
							</div>																						
							
							<div className="submit">
								<input value="Login" type="submit" className="submit white" id="login-button" name="submit"/>
							</div>
							<a target="_self" title={this.props.labels.forgotPassword} href="/global/en/forgotten-password.html" className="white">{this.props.labels.forgotPassword}</a>
							<div className="whiteLine"/>
							<a target="_self" title={this.props.labels.register} href={this.props.labels.registerLink} className="white">{this.props.labels.register}</a>
						</form>
					</div>
				</div>)
	}
});

var LogedInForm = React.createClass({
	getInitialState: function() {
		return {memberAreaPage: window.location.href.indexOf('/member_area') > -1}
	},
	
	logout: function(e) {
		e.preventDefault();
		var self = this;
		api.logout().end(function (err, resJson) {
			var url = location.href.split('?')[0] + "?logout=true";
			if(err) {
				url = "/global/en/homepage/homepage.html?logout=true";
			} else 	if(self.state.memberAreaPage) {
				url = JSON.parse(resJson.text) + "homepage/homepage.html?logout=true";
			} 
			window.location.href = url;
		});
	},
	
	renderComponentInMemberArea: function(e) {
		var labels = this.props.labels;
		return (<div id="loginWidget">
					<div id="welcometab">
						<p className="name bold">Member Area</p>
					</div>
					<div id="loggedin" className="memberArea">
						<div className="memberArea">
							<p className="name bold">{labels.loggedIn}</p>
							<p className="name maring-bottom8">{this.props.data.firstName} {this.props.data.lastName}</p>
							<a href={this.props.labels.memberAreaLink} className="white">{labels.memberArea}</a>
							<div className="whiteLine"/>
							<a target="_self" title="Logout" onClick={this.logout} className="white">{labels.logout}</a>
						</div>
					</div> 
				</div>)
	},
	
	renderComponent: function(e) {
		return (<div id="loginWidget">
					<div id="welcometab">
						<p className="name">{this.props.data.firstName} {this.props.data.lastName}</p>
					</div>
					<div id="loggedin">
						<div className="otherPages">
							<a href={this.props.labels.memberAreaLink} className="white">{this.props.labels.memberArea}</a>
							<div className="whiteLine"/>
							<a target="_self" title="Logout" onClick={this.logout} className="white">{this.props.labels.logout}</a>
						</div>
					</div> 
				</div>)
	},
	
	render: function() {
		var loginComponent = this.state.memberAreaPage 
			? this.renderComponentInMemberArea()
			: this.renderComponent();
		
		return(<div>{loginComponent}</div>)
	 }
});

module.exports = {
	LoginForm: LoginForm,
	display: function (app, element) {
		api.getUserInfo().end(function(err, resJson) {
			ReactDOM.render( <LoginForm labels={app.labels.login_form} data={model}/>, element);
			if(err == null) {
				var model = JSON.parse(resJson.text);
				if(model.loggedIn) {
					ReactDOM.render( <LogedInForm labels={app.labels.login_form} data={model}/>, element);
				} 
			} 
		});
		
	}
	
}
