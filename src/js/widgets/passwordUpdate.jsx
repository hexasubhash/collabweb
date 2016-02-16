var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var api = require('../api');

var UpdatePasswordForm = React.createClass({
	getInitialState: function() {
		return {
			formData: {"password": null, "repeatPassword": null, "redirectUrl": this.props.labels.redirectUrl, resetPasswordKey: location.search.split('resetPasswordKey=')[1]}, 
			errors : undefined,
			}
	},
	
	dataChanged: function(field, e) {
		 this.state.formData[field] = e.target.value;			 
	},
	
    handleSubmit: function(e) {
		e.preventDefault();
		var self = this;
		
		var model = JSON.stringify(this.state.formData);
		api.updatePassword(model).end(function (err, resJson) {
			if(!err) {
				window.location.href=self.props.labels.successfullRedirectUrl;
			} else {
				var errors = JSON.parse(resJson.text);
	    		self.setState({errors:  errors});
			}
		});
    },
	
	renderInput: function(label, id, maxLength, mandatory, inputCssClass, value) {
	 	var mandatoryStar = mandatory ?  '*': undefined;
	 	var errorCssClass = inputCssClass + ' form-error';
	 	var labelForId = this.props.componentName + "_" + id;
	  	var cssClass = this.validateField(id) ? errorCssClass : inputCssClass;
		return(<div className="form-grp"> 
					<label htmlFor={labelForId}>{label}<sup>{mandatoryStar}</sup></label> 
					<input id={labelForId} name={id} defaultValue={value} className={cssClass} type="password"
						maxLength={maxLength} onChange={this.dataChanged.bind(this, id)}/> 
				</div>)
	},
	
	validateField: function(id) {
		return (this.state.errors != undefined && this.state.errors[id] != undefined);
	},
	
	renderNewPasswordForm: function() {
		var labels = this.props.labels;
		return(<div>
				<div className="header"  dangerouslySetInnerHTML={{__html: labels.passwordHeader}}/>
				
				<form onSubmit={this.handleSubmit}>
					{this.renderInput(labels.password, 'password', 25, true, 'shortversion','')}
					{this.renderInput(labels.passwordRepeat, 'repeatPassword', 25, true, 'shortversion','')}
		            <input className="aui-button-input aui-button-input-submit" type="submit" value="Save"/>
		         </form>
         </div>)
	},

	render: function() {
		var self = this;
		var labels = this.props.labels;
				
		var newPasswordForm = this.state.formData.resetPasswordKey
			? this.renderNewPasswordForm()
			: undefined;
		
		var errorFieldMessage = this.state.errors != undefined
			? (<div className="portlet-msg-error">{labels.errorMessage}</div>)		
			: undefined;
		
		var expiredError = this.state.errors != undefined && this.state.errors.password == 'Expired'
			? (<div className="portlet-msg-error">{labels.keyExpired}</div>)
			: undefined;
			
		var existsError = this.state.errors != undefined && this.state.errors.passwordExists == 'Exists'
				? (<div className="portlet-msg-error">{labels.keyExists}</div>)
				: undefined;
			
		var errorMessage = expiredError != undefined 
			?  this.expiredError
			:  this.errorFieldMessage
		
		
		return(<div className="widget" id="passwordUpdate">        			
    				<h1>{labels.title}</h1>
    				{expiredError}
    				{newPasswordForm}
    				{existsError}
    			</div>	
    		)
	}
});

module.exports = {
	UpdatePasswordForm: UpdatePasswordForm,
	display: function (app, element) {
		var componentName = element.getAttribute('data-wwidget-type');
		ReactDOM.render(  <UpdatePasswordForm labels={app.labels.passwordUpdate} componentName={componentName}/>, element);
	}
	
}
