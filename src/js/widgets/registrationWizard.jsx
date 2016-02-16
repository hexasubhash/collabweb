var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var api = require('../api');

var RegistrationWizard = React.createClass({

	getInitialState: function() {
		return {
			formData: undefined,
			formData1: undefined,
			errors : undefined,
			success : undefined,
			usaStatesVisible : false,
			initialized : false,
			step: 1
		}
	},

	componentDidMount: function() {
		var self = this;
		api.fetchCities().end(function(err, resJson) {
		var model = JSON.parse(resJson.text);
			self.setState({formData : model, initialized: true});
		});
	},

	filterObject : function(obj, keys) {
		 var dup = {};
		 for (var key in obj) {
		        if (keys.indexOf(key) == -1) {
		            dup[key] = obj[key];
		        }
		   }
		   return dup;
	},

	handleNextClick: function(e) {
		e.preventDefault();
		var self = this;
		console.log('sdsdsd'+this.state.step);
		console.log('sdsdsd'+this.state.formData);
		this.state.formData['step'] = this.state.step;
		var objToStringify = this.filterObject(this.state.formData, ['cities']);
		console.log('SUBHASHHASHASHASHASH'+objToStringify);
		var registrationModel = JSON.stringify(objToStringify);
		console.log('SUBHASHHASHASHASHASH'+registrationModel);
	    api.saveRegistrationFormModel(registrationModel).end(function(err, resJson) {
	    	if(err == null) {
	    		var newStep = self.state.step + 1;
	    		if(newStep < 4) {
		    		self.setState({step : newStep, errors: undefined, success: true});
	    		} else {
	    			window.location.href = 	JSON.parse(resJson.text) + "member_area/help.html";
	    		}
	    	} else {
	    		var errors = JSON.parse(resJson.text);
	    		self.setState({errors:  errors});
	    	}
	    });
	},

	handlePrevClick: function(e) {
		var newStep = this.state.step - 1;
		this.setState({step : newStep});
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

	renderPasswordInput: function(id, label) {
	   	var errorCssClass = this.validateField(id) ? 'shortversion form-error' : 'shortversion';
	   	var labelForId = this.props.componentName + id;
		return (<div className='form-grp'>
	       			<label htmlFor={labelForId}>{label}<sup>*</sup></label>
	       			<input id={labelForId} type='password' maxLength='50' className={errorCssClass} onChange={this.dataChanged.bind(this, id)}/>
	       		</div>)
	},

	validateField: function(id) {
		return (this.state.errors != undefined && this.state.errors[id] != undefined);
	},

	dataChanged: function(field, e) {
	console.log('field'+field);
	console.log('target'+e.target.value);
		this.state.formData[field] = e.target.value;
	},

	renderCombo: function(cssWrapper, id, label, cssComp, options, countryCombo) {
		 var labels = this.props.labels;
		 var cssClass = this.validateField(id) ? 'form-error ' + cssComp : cssComp;
		 return (<div className={cssWrapper}>
					<label>{label}<sup>*</sup></label>
					<select id={id} name={id} onChange={this.dataChanged.bind(this, id)} className={cssClass} defaultValue="0">
						<option value="0">{labels.pleaseSelect}</option>
						{options}
					</select>
				</div>)
	},

	renderFormOfAddress: function(id) {
		var labels = this.props.labels;
		var cssClass = this.validateField(id) ? 'form-error radio-div' : 'radio-div';
		var maleForId = this.props.componentName + "male";
		var femaleForId = this.props.componentName + "female";
		return(<div className="form-grp">
				<div className="radio-label-long"><label>{labels.formOfAddress}<sup>*</sup></label></div>
				<div className={cssClass}><input id={maleForId} type="radio" value="true" name={id} onChange={this.dataChanged.bind(this, id)}/></div>
				<div className="radio-label-short"><label htmlFor={maleForId}>Mr.</label></div>
				<div className={cssClass}><input id={femaleForId} type="radio" value="false" name={id} onChange={this.dataChanged.bind(this, id)}/></div>
				<div className="radio-label-short"><label htmlFor={femaleForId}>Ms.</label></div>
			</div>)
	},

	renderHeader: function() {
		var labels = this.props.labels;
		var errorMessage = this.state.errors != undefined
		? (<div className="portlet-msg-error">{labels.error}</div>)
		: undefined;
		var emailUsedErrorMessage = this.state.errors != undefined && this.state.errors.email == 'Email used'
			? (<div className="portlet-msg-error">{labels.errorEmailUsed}</div>)
			: undefined;
		return(<div>
					<div id="steps">
					 	<div id="step1" className={this.state.step == 1 ? 'active' : ''}>{labels.step1}</div>
					 	<div id="step2" className={this.state.step == 2 ? 'active' : ''}>{labels.step2}</div>
					 	<div id="step3" className={this.state.step == 3 ? 'active' : ''}>{labels.step3}</div>
					</div>

					{errorMessage}
					{emailUsedErrorMessage}
				</div>)
	},

	renderFooter: function() {
		var labels = this.props.labels;

		var backButton = this.state.step != 1 ?
				(<input type="submit" value={labels.backButton} onClick={this.handlePrevClick}/>)
				: undefined;
		return(<div className="form-grp">
						{backButton}
						<input type="submit" value={this.state.step == 3 ? labels.completeButton : labels.continueButton} className="defaultSubmitButton" onClick={this.handleNextClick}/>
					</div>)
	},

	renderPageOne: function() {
		var labels = this.props.labels;
		var self = this;

		var citiesVar = this.state.initialized ?
					this.state.formData.cities.map(function (current) {
					return (<option value={current.cityId} key={current.cityId}>{current.cityName}</option>);
				})
		: undefined;


		var containerClass = this.state.step == 1 ? '' : 'hidden';
		var content =
			<div id="page1" className = {containerClass}>

				{this.renderHeader()}
				{this.renderFormOfAddress('male')}

				 <div className="doubleform">
				 	{this.renderInput(labels.firstName, 'firstName', 50, true, 'shortversion', '')}
					<div className="separator"></div>
					{this.renderInput(labels.lastName, 'lastName', 50, true, 'shortversion', '')}
				 </div>
				{this.renderInput(labels.address, 'address', 75, true, 'longversion', '')}

				<div className="doubleform">
					{this.renderInput(labels.plz, 'postalcode', 10, true, 'shortversion', '')}
					<div className="separator"></div>
					{this.renderCombo('form-grp', 'city', labels.city, "longversion", citiesVar, null)}

				</div>


				<div className="doubleform">
					{this.renderInput(labels.phone, 'phone', 30, true, 'shortversion', '')}
					<div className="separator"></div>
					{this.renderInput(labels.fax, 'fax', 30, false, 'shortversion', '')}
				</div>

				{this.renderInput(labels.email, 'email', 50, true, 'longversion', '')}
				{this.renderInput(labels.repeteEmail, 'repeatEmail', 50, true, 'longversion', '')}

				<p className="mandatory"><sup>*</sup>{labels.infoMessage1}</p>
				<p className="form-paragraph">{labels.infoMessage2}</p>
				{this.renderFooter()}
			</div>

			return content;
	},

	checkboxChanged: function(field, e) {
		this.state.formData[field] = e.target.checked;
	},

	renderTermsOfUse: function(id) {
		var cssClass = this.validateField(id) ? 'form-error checkbox-div' : 'checkbox-div';
		var labels = this.props.labels;
		var labelForId = this.props.componentName + id;
		return (<div className="form-grp">
				<div className={cssClass}>
					<input type="checkbox" className="radio" id={labelForId} onChange={this.checkboxChanged.bind(this, id)}/>
				</div>
				<label htmlFor={labelForId} className="radio-label" dangerouslySetInnerHTML={{__html: labels.aggrement}} />
			</div>)
	},

	renderNewsletterCheckbox: function(id) {
		var cssClass = this.validateField(id) ? 'form-error checkbox-div' : 'checkbox-div';
		var labels = this.props.labels;
		var labelForId = this.props.componentName + id;
		return (<div className="form-grp">
				<div className={cssClass}>
					<input type="checkbox" id={labelForId} defaultChecked="checked" className="radio" onChange={this.checkboxChanged.bind(this, id)}/>
				</div>
				<label htmlFor={labelForId} className="radio-label">{labels.newsletterText}</label>
			</div>)
	},

	renderPageTwo: function() {
		var labels = this.props.labels;
		var containerClass = this.state.step == 2 ? '' : 'hidden';
		var content = (<div id="page2" className={containerClass}>
						<a id="p_registration_WAR_userportlet"></a>
						{this.renderHeader()}
						<div>
							{this.renderNewsletterCheckbox("newsletter")}
							{this.renderTermsOfUse("termsOfUse")}
							{this.renderFooter()}
						</div>
					</div>);
		return content;
	},

	handleResetCaptcha: function(field, e) {
		api.resetCaptcha().end(function() {
			// Reload image
			var img = document.getElementById("regCaptchaImage");
			var newSrc = "/w/api/stickyImg?" + Math.random();
			img.src = newSrc
	    });
	},

	renderCaptcha: function(id) {
		var errorCssClass = this.validateField(id) ? 'shortversion form-error' : 'shortversion';
		var capthcaImageSrc = "/w/api/stickyImg?" + Math.random();
		var labelForId = this.props.componentName + id;
		return(<div>
				<div className="form-grp-halfsize">
					<label>Captcha<sup>*</sup></label>
					<img src={capthcaImageSrc} className="regaptchaImage" id="regCaptchaImage"/>
				</div>
				<div className="form-grp-halfsize">
					<label htmlFor={labelForId}>Code<sup>*</sup></label>
					<input id={labelForId} type="text" className={errorCssClass} size="10" defaultValue="" autoComplete="off" onChange={this.dataChanged.bind(this, id)}/>
					<div className="form-grp-buttons">
						<input type="button" defaultValue="New Code" className="captcha-regenerate" name="generate" onClick={this.handleResetCaptcha.bind(this, id)}/>
					</div>
				</div>
			</div>)
	},

	renderPageThree: function() {
		var labels = this.props.labels;
		var containerClass = this.state.step == 3 ? '' : 'hidden';
		var content =
			(<div className={containerClass}>
				{this.renderHeader()}
				<div className="consent">
					<p>{labels.passwordNote1}</p> <p>({labels.passwordNote2})</p>
				</div>
				<div className="doubleform">
					{this.renderPasswordInput('password', labels.password)}
				</div>
				<div className="doubleform">
					{this.renderPasswordInput('repeatPassword', labels.repeatPassword)}
				</div>

				<p className="mandatory"><sup>*</sup>{labels.infoMessage1}</p>
				{this.renderFooter()}
			 </div>);

		return content;
	},

	render: function() {
		return (
				<div id="wizard" className="widget">
					{this.renderPageOne()}
					{this.renderPageTwo()}
					{this.renderPageThree()}
				 </div>)
	}
});

module.exports = {
	RegistrationWizard: RegistrationWizard,
	display: function(app, element) {
		var componentName = element.getAttribute('data-wwidget-type');
		ReactDOM.render( <RegistrationWizard labels={app.labels.registration_wizard} languages={app.labels.languages} componentName={componentName}/>, element);
	},
}
