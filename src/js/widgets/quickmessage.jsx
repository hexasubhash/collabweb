var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var api = require('../api');


var QuickMessage = React.createClass({
	
	getInitialState: function() {
		return {
			message : this.props.labels.defaultMessage,
			defaultMessage : this.props.labels.defaultMessage,
			successMessage : this.props.labels.successMessage
		};
	},
	sendQuickMessage: function(e) {
		if (this.state.message == this.state.defaultMessage || this.state.message == '') {
			return;
		}
		var successMessage = this.props.labels.successMessage;
		var self = this;
		api.sendQuickMessage(this.state.message).end(function (err, res) {
			if (!err) {
				alert(successMessage);
				self.setState({message: self.state.defaultMessage});
			}
		});
	},
 
	updateMessage: function(e) {
		this.setState({message: React.findDOMNode(this.refs.message).value});
	},
	
	onFocusFunct: function(e) {
		if(this.state.defaultMessage == this.state.message) {
			this.setState({message: ''});
		}
	},
	
	onBlurFunct: function(e) {
		if(this.state.message == '') {
			this.setState({message: this.state.defaultMessage});
		}
	},
	
	render: function () {
		var textClass = this.state.defaultMessage == this.state.message
		? 'greyText'
		: undefined;
		
		return <div className="widget">
			<div className="quickmsg">
				<div className="quickmsg-top">
					<h3>{this.props.labels.title}</h3>
				</div>
				<div className="quickmsg-content">
					<div className={textClass}>
						<textarea ref="message" onFocus={this.onFocusFunct} onBlur={this.onBlurFunct} onChange={this.updateMessage} value={this.state.message}></textarea>
					</div>
					<div>
						<input name="send-message" value={this.props.labels.send} onClick={this.sendQuickMessage} type="button" />
					</div>
				</div> 
				<div className="quickmsg-footer">&nbsp;</div>
			</div>
			<div className="clearBoth"></div>
		</div>;
	}
});

module.exports = {
	QuickMessage: QuickMessage,
	display: function (app, element) {
		ReactDOM.render( <QuickMessage labels={app.labels.quick_message}/>, element);
	},
}
