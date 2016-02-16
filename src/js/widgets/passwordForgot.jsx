var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var api = require('../api');

var PasswordResetForm = React.createClass({
	getInitialState: function() {
		return {formData: {"email": null, "captchaText": null, "redirectUrl": this.props.labels.redirectUrl},
				errors : undefined,
				resetPasswordKey: location.search.split('resetPasswordKey=')[1],
				success : undefined
				}
	},
	
	dataChanged: function(field, e) {		
		this.state.formData[field] = e.target.value;
		// FIXME - refactor this code to use setState.
		// maybe using formData[field] is not a good idea
		this.forceUpdate();
	},
		
    handleSubmit: function(e) {
		e.preventDefault();
		var self = this;
		var model = JSON.stringify(this.state.formData);
		api.resetPassword(model).end(function (err, resJson) {
			if(err) {
				var errors = JSON.parse(resJson.text);
				self.setState({errors:  errors});				
			} else {
				self.setState({success: true, errors:  undefined});
			}
		});
	},
	
	validateField: function(id) {
		return (this.state.errors != undefined && this.state.errors[id] != undefined);
	},
	
	renderInput: function(id, label, value, length, mandatory, visible) {
	   	var errorCssClass = this.validateField(id) ? 'longversion form-error' : 'longversion';
	   	var mandatoryStar = mandatory || this.state.status.registrationActive ? '*'	: undefined;
	   	var cssHide = visible ? 'form-grp' : 'form-grp invisible';
	   	var labelForId = this.props.componentName + "_" + id;
		return (<div className={cssHide}>
	       			<label htmlFor={labelForId}>{label}<sup>{mandatoryStar}</sup></label> 
	       			<input id={labelForId} name={id} maxLength={length} defaultValue={value} className={errorCssClass} 
	       				onChange={this.dataChanged.bind(this, id)}/>
	       		</div>)
	},
	
	renderRestPasswordForm: function() {
		var labels = this.props.labels;
		var capthcaImageSrc = "/w/api/stickyImg?" + Math.random();
		return (<div>
    				<form onSubmit={this.handleSubmit}>
    					{this.renderInput('email', labels.emailLabel, '', 75, true, true)}
    					<div className="form-grp-halfsize">					
	    					<img  className="captchaImage" src={capthcaImageSrc}/> 
	    				</div>
				        {this.renderInput('captchaText', labels.capthcaLabel, '', 75, true, true)}
		              	<input className="submitButton" value="Send new password" type="submit" id="login-button" name="submit"/>
    				</form>
    			</div>)
	},

	render: function() {
		var self = this;
		var labels = this.props.labels;
		
		var errorMessage = this.state.errors != undefined
			? (<div className="portlet-msg-error">{labels.errorMessage}</div>)		
			: undefined;
		
		var emailUsedErrorMessage = this.state.errors != undefined && this.state.errors.email == 'Email do not exists'
			? (<div className="portlet-msg-error">{labels.emailNotExists}</div>)
			: undefined;
		
		
		var resetPasswordForm = this.state.resetPasswordKey || this.state.success
			? (<div className="portlet-msg-success">{labels.successMessage}</div>)
			: this.renderRestPasswordForm();

		return(<div className="widget" id="resetPassword">
    				{errorMessage}
    				{emailUsedErrorMessage}
    				{resetPasswordForm}
    			</div>
    			)
	}
});

module.exports = {
	PasswordResetForm: PasswordResetForm,
	display: function (app, element) {
		var componentName = element.getAttribute('data-wwidget-type');
		ReactDOM.render(  <PasswordResetForm labels={app.labels.resetPassword} componentName={componentName}/>, element);
	}
	
}
