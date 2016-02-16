var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var api = require('../api');

var ContactForm = React.createClass({
	getInitialState: function() {
		return {
			status: {
				usaStatesVisible : false,
				registrationActive : false,
				logedin : this.props.data.logedin
			},
			formData: this.props.data,
			additionalRegModel : this.props.data.additionalRegModel,
			errors : undefined,
			success : undefined
		}
	},
	
	filterObject : function(obj, keys)  {	
		 var dup = {};
		 for (var key in obj) {
		        if (keys.indexOf(key) == -1) {
		            dup[key] = obj[key];
		        }
		   }
		   return dup;
	},
	
	handleSubmit: function(e) {
		e.preventDefault();
		var self = this;
		var objToStringify = this.filterObject(this.state.formData, ['countries','usastates','locales']);
		var contactFormModel = JSON.stringify(objToStringify);
		var additionalRegModel = JSON.stringify(this.state.additionalRegModel);
		var statusJson = JSON.stringify(this.state.status);
	    api.saveContactFormModel(contactFormModel, additionalRegModel, statusJson).end(function(err, errorJson) {
	    	if(err == null) {
	    		self.setState({errors:  undefined});
	    		self.setState({success:  true});
	    		if(self.state.status.registrationActive) {
	    			location.reload();
	    		}
	    	} else {
	    		var errors = JSON.parse(errorJson.text);
	    		self.setState({errors:  errors});
	    	}
	    });   
	  },
	
	  dataChanged: function(field, e) {
		 var value = e.target.value;
		 if(this.state.additionalRegModel[field] === undefined) {
			 this.state.formData[field] = value;			 
		 } else {
			 this.state.additionalRegModel[field] = value;
		 }
	},
	
	checkboxChanged: function(field, e) {
		if(e.target.checked) {
			this.state.additionalRegModel[field] = "true";
		} else {
			this.state.additionalRegModel[field] = "false";
		}
	},
	
	handleCategoryChange: function(field, e) {
		this.state.formData[field] = e.target.value;
		var newStatus = this.state.status;
		if(e.target.value == 2520) {
			newStatus.usaStatesVisible = true;
		} else {
			newStatus.usaStatesVisible = false;
		}
		this.setState({status : newStatus}); 
	},
	
	handleRegToggle: function(e) {
		this.setState({status : {registrationActive: !this.state.status.registrationActive}});
		this.setState({errors:  undefined});
	},
	
	validateField: function(id) {
		return (this.state.errors != undefined && this.state.errors[id] != undefined);
	},
	
	renderInput: function(id, label, value, length, mandatory, visible) {
	   	var errorCssClass = this.validateField(id) ? 'longversion form-error' : 'longversion';
	   	var mandatoryStar = mandatory || this.state.status.registrationActive ? '*'	: undefined;
	   	var cssHide = visible ? 'form-grp' : 'form-grp invisible';
	   	var labelForId = this.props.componentName + id;
		return (<div className={cssHide}>
	       			<label htmlFor={labelForId}>{label}<sup>{mandatoryStar}</sup></label> 
	       			<input id={labelForId} name={id} maxLength={length} defaultValue={value} className={errorCssClass} 
	       				onChange={this.dataChanged.bind(this, id)}/>
	       		</div>)
	},
	
	renderShortInput: function(id, label, value, length, mandatory) {
	   	var errorCssClass = this.validateField(id) ? 'shortversion form-error' : 'shortversion';
	   	var mandatoryStar = mandatory || this.state.status.registrationActive ? '*'	: undefined;
	   	var labelForId = this.props.componentName + id;
		return (<div className="form-grp-halfsize">
	       			<label htmlFor={labelForId}>{label}{mandatoryStar}</label> 
	       			<input id={labelForId} name={id} maxLength={length} defaultValue={value} className={errorCssClass} 
	       				onChange={this.dataChanged.bind(this, id)}/>
	       		</div>)
	},
	
	renderPasswordInput: function(id, label, visible) {
		var cssHide = visible ? 'form-grp' : 'form-grp invisible';
	   	var errorCssClass = this.validateField(id) ? 'longversion form-error' : 'longversion';
	   	var labelForId = this.props.componentName + id;
		return (<div className={cssHide}>
	       			<label htmlFor={labelForId}>{label}<sup>*</sup></label> 
	       			<input id={labelForId} type='password' maxLength='75' className={errorCssClass} onChange={this.dataChanged.bind(this, id)}/>
	       		</div>)
	},
	
	handleResetCaptcha: function(field, e) {
		api.resetCaptcha().end(function() {
			// Reload image
			var img = document.getElementById("captchaImage");
			var newSrc = "/w/api/stickyImg?" + Math.random();
			img.src = newSrc
	    });
	},
	
	renderCaptcha: function(id) {
		var errorCssClass = this.validateField(id) ? 'shortversion form-error' : 'shortversion';
		var capthcaImageSrc = "/w/api/stickyImg?" + Math.random();
		return(<div>
				<div className="form-grp-halfsize"> 
					<label>Captcha<sup>*</sup></label> 
					<img src={capthcaImageSrc} className="captchaImage" id="captchaImage"/> 
				</div>
				<div className="form-grp-halfsize"> 
					<label htmlFor={id}>Code<sup>*</sup></label> 
					<input id={id} type="text" className={errorCssClass} size="10" defaultValue="" autoComplete="off" onChange={this.dataChanged.bind(this, id)}/> 
					<div className="form-grp-buttons"> 
						<input type="button" defaultValue="New Code" className="captcha-regenerate" name="generate" onClick={this.handleResetCaptcha.bind(this, id)}/> 
					</div> 
				</div>
			</div>) 
	},
	
	renderCountryCombo: function(id, label, options, value) {
		 var labels = this.props.labels;
		 var cssClass = this.validateField(id) ? 'form-error longversion' : 'longversion';
		 return (<div className='form-grp'> 
					<label htmlFor={id}>{label}<sup>*</sup></label> 
					<select id={id} name={id} onChange={this.handleCategoryChange.bind(this, id)} className={cssClass} defaultValue={value}> 
						<option value="0">{labels.pleaseSelect}</option>  
						{options}
					</select> 
				</div>)
	},
	 
	renderCombo: function(id, label, options, visible) {
		 var labels = this.props.labels;
		 var cssClass = this.validateField(id) ? 'form-error longversion' : 'longversion';
		 var cssHide = visible ? 'form-grp' : 'form-grp invisible';
		 return (<div className={cssHide}> 
					<label htmlFor={id}>{label}<sup>*</sup></label> 
					<select id={id} name={id} onChange={this.dataChanged.bind(this, id)} className={cssClass} defaultValue='0'> 
						<option value="0">{labels.pleaseSelect}</option>  
						{options}
					</select> 
				</div>)
	},
	
	renderTextArea: function(cssWrapper, id, label, cssComp) {
		var cssClass = this.validateField(id) ? 'textarea form-error' : 'textarea';
		return(<div className={cssWrapper}> 
				<label htmlFor={id}>{label}<sup>*</sup></label> 
				<textarea id={id} className={cssClass} name={id} onChange={this.dataChanged.bind(this, id)}/> 
			</div>)
	},
	
	renderFormOfAddress: function(visible) {
		var id = 'male';
		var maleForId = this.props.componentName + "male";
		var femaleForId = this.props.componentName + "female";
		var labels = this.props.labels;
		var cssClass = this.validateField(id) ? 'form-error radio-div' : 'radio-div';
		var cssHide = visible ? 'form-grp' : 'form-grp invisible';
		return(<div className={cssHide}> 
				<div><label>{labels.formOfAddress}<sup>*</sup></label></div> 
				<div className={cssClass}>
					<input id={maleForId} type="radio" value="true" className="radio" name={id} onChange={this.dataChanged.bind(this, id)}/>
				</div> 
				<div><label htmlFor={maleForId} className="radio-label">Mr.</label></div> 
				<div className={cssClass}>
					<input id={femaleForId} type="radio" value="false" className="radio" name={id} onChange={this.dataChanged.bind(this, id)}/>
				</div> 
				<label htmlFor={femaleForId} className="radio-label">Ms.</label> 
			</div>)
	},
	
	renderNewsletter: function(id, visible) {
		var cssHide = visible ? 'form-grp' : 'form-grp invisible';
		var labels = this.props.labels;
		return(<div className={cssHide}> 
				<label>{labels.consent}</label> 
				<input id={id} type="checkbox" value="true" className="radio" defaultChecked="checked" onChange={this.checkboxChanged.bind(this, id)}/>
				<label htmlFor={id} className="wide-label">{labels.newsletter}</label> 
			</div>);
	},
	 
	renderTermsOfUse: function(id) {
		var cssClass = this.validateField(id) ? 'form-error checkbox-div' : 'checkbox-div';
		var labels = this.props.labels;
		return (<div className="form-grp">
				<label>&nbsp;</label>
				<div className={cssClass}>
					<input type="checkbox" className="radio" name={id} id={id} onChange={this.checkboxChanged.bind(this, id)}/>
				</div>
				<label htmlFor={id} className="wide-label" dangerouslySetInnerHTML={{__html: labels.aggrement}} />
			</div>)
	},
 	
	render: function() {
		var labels = this.props.labels;
		var data = this.state.formData;
		var self = this;
		var registrationActive = this.state.status.registrationActive;
		var countriesVar = this.props.data.countries.map(function (current) {
			return (<option value={current.countryId} key={current.countryId}>{current.countryName}</option>); 
		});
		
		var loclesVar = this.props.data.locales.map(function(current) {
			var label = "self.props.languages.language" + current;
			var currentLang = eval(label);
			return (<option key={currentLang} value={current}>{currentLang}</option>)
		});
		
		var requestTypeVar = this.props.data.requestTypes.map(function(current) {
			var label = "labels.requestType" + current;
			var currentText = eval(label);
			return (<option key={label} value={current}>{currentText}</option>)
		});
		
		var statesVar = this.props.data.usastates.map(function (current) {
			return (<option value={current.countryId} key={current.countryId}>{current.countryName}</option>); 
		});
		
		var stateCombo = this.state.status.usaStatesVisible
		? this.renderCombo("stateId", labels.state, statesVar)
		: undefined;
		
		var toggleMessage = registrationActive
		? labels.clickHereAction2
		: labels.clickHereAction1;
		
		var regTermOfUse = registrationActive
		? this.renderTermsOfUse('termsOfUse')
		: undefined;
		
		var captcha = !this.state.status.logedin
		? this.renderCaptcha("captchaText")
		: undefined;
		
		var footerMessage = !this.state.status.logedin
		? (<div className="contact-msg"> 
				<a href="javascript://" onClick={self.handleRegToggle}>{labels.clickHere}&nbsp;</a>
				{toggleMessage}
				<p><sup>*</sup>{labels.infoMessage1}</p> 
				<p>{labels.infoMessage2}</p> 
			</div>)
		:  (<div className="contact-msg">
				<p><sup>*</sup>{labels.infoMessage1}</p> 
				<p>{labels.infoMessage2}</p>
			</div>)
		 
		var formData = this.state.formData;
		
		var errorMessage = this.state.errors != undefined
		? (<div className="portlet-msg-error">{labels.error}</div>)		
		: undefined;
		
		var emailUsedErrorMessage = this.state.errors != undefined && this.state.errors.email == 'Email used'
		? (<div className="portlet-msg-error">{labels.errorEmailUsed}</div>)
		: undefined;
		
		var form = this.state.success
		? (<form id="contact"><div className="portlet-msg-success">{labels.successSent}</div></form>)
		: (<form onSubmit={this.handleSubmit} id="contact"> 
			<div className="contact-msg"> 
				<p>{labels.headerNote}</p> 
			</div>
			{errorMessage}
			{emailUsedErrorMessage}
			{this.renderFormOfAddress(registrationActive)}
			{this.renderShortInput('firstName', labels.firstName, data.firstName, 50, true)}
			{this.renderShortInput('lastName', labels.lastName, data.lastName, 50, true)} 
			{this.renderInput('company', labels.company, data.company, 100, true, true)}
			{this.renderInput('cfunction', labels.jobTitle, data.cfunction, 50, false, true)}
			{this.renderCountryCombo('countryId', labels.country, countriesVar, data.countryId)}
			{stateCombo}
			{this.renderCombo('languageId', labels.language, loclesVar, registrationActive)}
			{this.renderInput('address', labels.address, data.address, 75, false, true)}
			{this.renderShortInput('city', labels.city, data.city, 75, false)}
			{this.renderShortInput('postalcode', labels.plz, data.postalcode, 20, true)}
			{this.renderInput('email', labels.email, data.email, 75, true, true)}
			{this.renderInput('repeatEmail', labels.repeteEmail, "", 75, false, registrationActive)}
			{this.renderInput('phone', labels.phone, data.phone, 30, true, true)}
			{this.renderCombo('requestType', labels.requestType, requestTypeVar, true)}
			{this.renderPasswordInput('password', labels.password, registrationActive)}
			{this.renderPasswordInput('repeatPassword', labels.repeatPassword, registrationActive)}
			{this.renderNewsletter('newsletter', registrationActive)}
			{regTermOfUse}
			{this.renderTextArea('form-grp', 'message', labels.message, 'textarea')}
			{captcha}
			{footerMessage}
			<div className="form-grp-buttons"> 
				<input id="submit" name="submit" type="submit" value={labels.send} className="submit-button"/> 
			</div>
		</form>);
		
		return (<div className="widget">{form}</div>)
	} 
});

module.exports = {
	ContactForm: ContactForm,
	display: function (app, element) {
		api.getContactFormModel().end(function(err, resJson) {
			if(err == null) {
				var componentName = element.getAttribute('data-wwidget-type');
				var model = JSON.parse(resJson.text);
				ReactDOM.render( <ContactForm data={model} labels={app.labels.contact_form} languages={app.labels.languages} componentName={componentName}/>, element);
			} else {
				ReactDOM.render( <ContactForm labels={app.labels.contact_form}/>, element);
			}
		});	
	},
}
