var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var api = require('../api');


var QuickMessage = React.createClass({
	
	getInitialState: function() {
		return {accepted : this.props.checked};
	},
	
	termsCheckboxChanged: function(e) {
		var newValue = !this.state.accepted;
		var self = this;
		api.setSSCTems(newValue).end(function(err, resultJson) {
			if(err == null) {
				self.setState({accepted: newValue});
			} 
		});	
	},
	
	renderCheckbox: function() {
		var labels = this.props.labels;
		var checkbox = !this.state.accepted
		? <div className="form-grp"> 
			<input id="termsAndConditions" type="checkbox" className="radio" onClick={this.termsCheckboxChanged}/>
			<label htmlFor="termsAndConditions" className="checkbox-label">{labels.checkboxLabel}</label> 
		</div>
		: undefined;

		return(<div>{checkbox}</div>)
	},
	
	renderLink: function() {
		var labels = this.props.labels;
		if(this.state.accepted) {
			return(<div><a target="_blank" className="active" href="/sealconfigurator/UserConsumer" title={labels.linkLabel}>{labels.linkLabel}</a></div>)
		} else {
			return(<div><label className="inactive" title={this.props.labels.linkLabel}>{labels.linkLabel}</label></div>)
		}
	},
	
	render: function () {
		return <div className="sscTerms">
					{this.renderCheckbox()}
					{this.renderLink()}
			   </div>;
	}
});

module.exports = {
	QuickMessage: QuickMessage,
	display: function (app, element) {
		api.getSSCTerms().end(function(err, resultJson) {
			if(err == null) {
				var result = JSON.parse(resultJson.text);
				ReactDOM.render( <QuickMessage labels={app.labels.sscTerms} checked={result}/>, element);
			} 
		});	
	}	
}

