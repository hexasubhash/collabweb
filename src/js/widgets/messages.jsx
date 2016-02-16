var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var Transition = require ('libs').ReactCSSTransitionGroup;
var api = require('../api');

var MessageEntry = React.createClass({
	
	render: function() {
		return (
			<div className="short-message">
				<span>{this.props.data.dateCreated}</span> 
				<a className="message-name" target="_parent" onClick={this.props.clickToExpand}>
					{this.props.data.messageTitle}
				</a> 
			</div>	
		);
	}
});

var Messages = React.createClass({
	getInitialState: function() {
		return {data: [],  totalMessageNumber: 0}
	},
	
	componentDidMount: function() {
		var self = this;
		api.getUserMessages().end(function (err, resJson) {
			if(err == null) {
				var messagesJson = JSON.parse(resJson.text);
				self.setState({data: messagesJson.messages, totalMessageNumber: messagesJson.totalMessagesNumber});
			}
		});
	},
	
	render: function() {
		var self = this;
		var messages = this.state.data.map(function(message) {
							var setExpandedId = function() {
								api.markMessageAsViewed(message.internalMessageId).end(function(err, resJson) {
									if(!err) {
										var messageLink = self.props.labels.internalMessageLink + "?messageId="+message.internalMessageId;
										window.location = messageLink;
									}
							    });
							};
							return <MessageEntry data={message} clickToExpand={setExpandedId}/>;
						});
				
		var content = <div> 
						<div className="messages-nr"> <p>{this.state.totalMessageNumber}</p></div> 
						<div className="messages-nr-txt"><p>{this.props.labels.newMessages}</p></div>
						<div style={{clear: "both"}}></div>
						{messages}
						<a href={this.props.labels.inboxLink} className="arrow" target="_parent">{this.props.labels.inbox}</a> 
					  </div>
					  
		return <div className="messages">
					<div className="messages-top">
						<h3 className="message-title"> 
							<span className="message-title-text">{this.props.labels.title}</span> 
						</h3>
					</div>
					{content}
					<div className="messages-footer"></div>
				</div>	
	}
});

module.exports = {
	Messages: Messages,
	display: function (app, element) {
		ReactDOM.render( <Messages labels={app.labels.messages}/>, element);
	}
	
}
