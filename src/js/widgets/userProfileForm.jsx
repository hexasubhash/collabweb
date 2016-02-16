var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var api = require('../api');

var UserProfileForm = React.createClass({
	getInitialState: function() {
		return {
			formData: this.props.data,
			changePasswordVisible : false,
			errors : undefined,
			success : undefined
		}
	},
	handleChangePasswordClick: function(e) {
		var changePasswordVisible = !this.state.changePasswordVisible;
		this.state.formData['changePassword'] = changePasswordVisible;
		this.setState({changePasswordVisible: changePasswordVisible});
	},
	validateField: function(id) {
		return (this.state.errors != undefined && this.state.errors[id] != undefined);
	},
	renderChangePasswordLink: function() {
		return(<span className="arrow" onClick={this.handleChangePasswordClick}>Change Password?</span>)
	},
	
	renderChangePassword: function() {
		var labels = this.props.labels;
		return (<div id="newpw">
					<div className="doubleform"> 
						{this.renderPasswordInput(labels.password, 'password', 'shortversion')}
					</div>
					<p>{labels.passwordNote2}</p> 
					<p>({labels.passwordNote})</p> 
					<div className="doubleform"> 
						{this.renderPasswordInput(labels.newPassword, 'newPassword', 'shortversion')}
					</div>
					<div className="doubleform">
						{this.renderPasswordInput(labels.confirmPassword, 'confirmPassword', 'shortversion')}
					</div>								
				</div>)
	},
	
	renderPasswordInput: function(label, id, inputCssClass) {
	 	var errorCssClass = inputCssClass + ' form-error';
	  	var cssClass = this.validateField(id) ? errorCssClass : inputCssClass;
	  	var labelForId = this.props.componentName + id;
		return(<div className="form-grp"> 
					<label htmlFor={labelForId}>{label}<sup>*</sup></label> 
					<input id={labelForId} autoComplete="off" type='password' className={cssClass}
						maxLength='50' onChange={this.dataChanged.bind(this, id)}/> 
				</div>)
	}, 
	
	renderInput: function(label, id, maxLength, mandatory, inputCssClass, value) {
	 	var mandatoryStar = mandatory ?  '*': undefined;
	 	var errorCssClass = inputCssClass + ' form-error';
	 	var labelForId = this.props.componentName + id;
	  	var cssClass = this.validateField(id) ? errorCssClass : inputCssClass;
		return(<div className="form-grp"> 
					<label htmlFor={labelForId}>{label}<sup>{mandatoryStar}</sup></label> 
					<input id={labelForId} name={id} defaultValue={value} className={cssClass}
						maxLength={maxLength} onChange={this.dataChanged.bind(this, id)}/> 
				</div>)
	},
	
	
	renderCheckbox: function(label, id) {
		var labelForId = this.props.componentName + id;
		return(<div className="form-grp"> 
					<input id={labelForId} type="checkbox" className="radio" defaultChecked={this.state.formData[id]} onChange={this.checkboxChanged.bind(this, id)}/>
					<label htmlFor={labelForId} className="radio-label">{label}</label> 
				</div>)
	},
	checkboxChanged: function(field, e) {
		this.state.formData[field] = e.target.checked;
	},
	renderLanguageCombo: function(options, value) {
		var labelForId = this.props.componentName + "language";
		 return (<div className="form-grp"> 
					<label htmlFor={labelForId}>Your preferred language:<sup>*</sup></label>
					<select className="longversion" id={labelForId} defaultValue={value} onChange={this.dataChanged.bind(this, 'language')}> 
						{options}
					</select> 
				</div>)
	},
	renderTextArea: function(value, id) {
		return(<textarea cols="50" rows="10" className="textarea" name={id} id={id} defaultValue={value} onChange={this.dataChanged.bind(this, id)}></textarea>)
	},
	
	renderSeparator: function() {
		return (<div className="sepblue"></div>);
	},
	
	dataChanged: function(field, e) {
		this.state.formData[field] = e.target.value;
	},
	handleSave: function(e) {
		var self = this;
		var formModel = JSON.stringify(this.state.formData);
	    api.saveUserProfileModel(formModel).end(function(err, resJson) {
	    	if(err == null) {
	    		if(window.location.href.indexOf(JSON.parse(resJson.text)) != -1) {
	    			self.setState({errors:  undefined});
	    			self.setState({success:  true}); 
	    			self.setState({changePasswordVisible : false});
	    			window.scrollTo(0, 0);
	    		} else {
	    			window.location.href = JSON.parse(resJson.text) + "member_area/my_profile.html";	
	    		}
	    	} else {
	    		var errors = JSON.parse(resJson.text);
	    		self.setState({success:  false});
	    		self.setState({errors:  errors});
	    		window.scrollTo(0, 0);
	    	}
	    });   
	  }, 
	  
	 handleDelete: function(e) {
		 if(confirm(this.props.labels.confirmDelete)) {
			 var formModel = JSON.stringify(this.state.formData);
			 api.deleteUserProfile(formModel).end(function(err, resJson) {
				if(err == null) {
					window.location.href = JSON.parse(resJson.text) + "homepage/homepage.html?logout=true";
				} else {
					window.location.href = "/global/en/homepage/homepage.html?logout=true";
				}
			 });
	 	}
	 },
		
	render: function() {
		var self = this;
		var labels = this.props.labels;
		var data = this.state.formData;
		var passwordArea = this.state.changePasswordVisible
		? this.renderChangePassword()
		: undefined;
		
		var loclesVar = this.props.data.locales.map(function(current) {
			var label = "self.props.languages.language" + current;
			var currentLang = eval(label);
			return (<option key={label} value={current}>{currentLang}</option>)
		});
		
		var errorMessage = this.state.errors != undefined
		? (<div className="portlet-msg-error">{labels.error}</div>)		
		: undefined;
		
		var emailUsedErrorMessage = this.state.errors != undefined && this.state.errors.email == 'Email used'
		? (<div className="portlet-msg-error">{labels.errorEmailUsed}</div>)
		: undefined;
		
		var successMessage = this.state.success
		? (<div className="portlet-msg-success">{labels.successMessage}</div>)
		: undefined;		
		
		return (<div id="user-profile" className="widget">
					{errorMessage}
					{emailUsedErrorMessage}
					{successMessage}
					<div className="portlet-body"> 
						<h1>{labels.title}</h1> 
						<h2>Account information for {data.firstName} {data.lastName}</h2>
					</div>
					
					<div className="doubleform"> 
						{this.renderInput(labels.firstName, 'firstName', 25, true, 'shortversion', data.firstName)}
						<div className="separator"></div>
						{this.renderInput(labels.lastName, 'lastName', 25, true, 'shortversion', data.lastName)}
					</div>
					{this.renderInput(labels.email, 'email', 50, true, 'longversion', data.email)}
					
					<div className="change-pw">
						{self.renderChangePasswordLink()}
						{passwordArea}
					</div> 
					
					<div className="account-info">
						{self.renderSeparator()}
						 
						<p className="label2">{labels.yourCountry}</p>
						<p className="country">{data.countryName}</p>
						{self.renderLanguageCombo(loclesVar, data.language)}
						<p className="label2"> {labels.responsibleMC}</p> 
						<p className="company">{data.mcName}</p> 
						<p className="mandatory">{labels.changeCountryInfo}</p> 
						{self.renderSeparator()}
						
						<h3>{labels.contactDetailsTitle}</h3>
						{this.renderInput(labels.company, 'company', 50, true, 'longversion', data.company)}
						{this.renderInput(labels.jobTitle, 'cfunction', 50, true, 'longversion', data.cfunction)}
						{this.renderInput(labels.address, 'address', 75, true, 'longversion', data.address)}
						<div className="doubleform"> 
							{this.renderInput(labels.postalCode, 'postalcode', 10, true, 'shortversion', data.postalcode)}
							<div className="separator"></div> 
							{this.renderInput(labels.city, 'city', 75, true, 'shortversion', data.city)}
						</div> 
						<div className="doubleform"> 
							{this.renderInput(labels.phone, 'phone', 30, true, 'shortversion', data.phone)}
							<div className="separator"></div> 			
							{this.renderInput(labels.fax, 'fax', 30, false, 'shortversion', data.fax)}
						</div> 
						<div clays="mandatory"> <sup>*</sup>{labels.requiredFields}</div> 
						{self.renderSeparator()}
				
						<div className="newsletter"> 
							<h3>{labels.newsletterText}</h3> 
							{this.renderCheckbox(labels.subscribe, 'subscribed')}
						</div>
						<h3>{labels.skillsSectionTitle}</h3> 
						<div> 
							<label>{labels.describeYourself}</label> 
							{this.renderTextArea(data.comments, 'comments')} 
						</div> 
						{self.renderSeparator()}
				
						<div className="email"> 
							<h3>{labels.memberMessageNoification}</h3> 
							{this.renderCheckbox(labels.memberMessageNotification, 'memberareaAlert')}
						</div>
						{self.renderSeparator()}
						 
						<div className="doubleform"> 
							<div className="form-grp extra-text"> 
								<p className="label2">{labels.saveData}</p> 
								<p className="nopad">{labels.saveDataText}</p> 
							</div> 
							<div className="form-grp extra-text"> 
								<p className="label2">{labels.deleteAccount}</p> 
								<p className="nopad">{labels.deleteAccountText}</p> 
							</div> 
						</div> 
						<div className="doubleform"> 
							<div className="form-grp"><input type="button" value="Save" name="Submit" onClick={this.handleSave}/></div> 
							<div className="form-grp"><input type="button" onclick="" name="Delete" value="Delete" onClick={this.handleDelete}/> 
							</div> 
						</div> 
					</div> 
				</div>)
	} 
});

module.exports = {
	UserProfileForm: UserProfileForm,
	display: function (app, element) {
		api.getUserProfile().end(function(err, resJson) {
			if(err == null) {
				var componentName = element.getAttribute('data-wwidget-type');
				var model = JSON.parse(resJson.text);
				ReactDOM.render( <UserProfileForm data={model} labels={app.labels.user_profile_form} languages={app.labels.languages} componentName={componentName}/>, element);
			} else {
				ReactDOM.render( <UserProfileForm labels={app.labels.user_profile_form} languages={app.labels.languages}/>, element);
			}
		});	
	},
}
