var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var Transition = require ('libs').ReactCSSTransitionGroup;
var api = require('../api');

var MessageEntry = React.createClass({
	getInitialState: function() {
		var isExpanded = (location.search.split('messageId=')[1] == this.props.data.internalMessageId)
		return {expanded: isExpanded}
	},
	
	handleClick: function(e) {
		this.setState({expanded: !this.state.expanded});
	},
	
	render: function() {
		var self = this;
		var msgCont = this.props.data.messageContent;
		var messageDetail = this.state.expanded
		? <div className="messageList-content" dangerouslySetInnerHTML={{__html: msgCont}}/>
		: undefined;
		
		var deleteIconMessageList = <div className="removeList" title='Clear' onClick={this.props.removeThisMessage}/>;
		var entry =  !this.props.data.deleted
		? 	<div className="msgRow" name={this.props.data.internalMessageId}>										
					<div className={this.state.expanded ? 'header blue' : 'header borderDown'}>
						<div className="colContainer">{this.props.data.dateCreatedStr}</div>					
						<div className={this.state.expanded ? 'colContainer arrowDown' : 'colContainer arrowUp'} onClick={this.handleClick}>	
							<div className={this.state.expanded ? 'head3 open' : 'head3'} >
								<div>{this.props.data.messageTitle}</div>
							</div>
						</div>											
						<div className="colContainer1">
							{deleteIconMessageList}	
						</div>		
					</div>
					<Transition transitionName="accordionmessage" transitionEnterTimeout={300} transitionLeaveTimeout={300}>{messageDetail}</Transition>
			</div>
				
		: undefined;
		
		return (<div>{entry}</div>);
		
	}
});

var MessagesList = React.createClass({
	getInitialState: function() {
		return {data: [],  prepared: false, totalMessagesNumber: undefined}		
	},
	
	deleteAll: function() {
		var self = this;
		var result = confirm(this.props.labels.deleteConfirmation);
		if (result == true) {
			api.deleteAllUserMessages().end(function(err, resJson) {
				if(err == null) {
					self.refreshDataFromServer();
				}
			});
		}
	},
	
	componentDidMount: function() {
		this.refreshDataFromServer();
	},
	
	refreshDataFromServer: function() {
		var self = this;	
		api.getAllUserMessages().end(function (err, resJson) {
			if(err == null) {
				var messagesJson = JSON.parse(resJson.text);												
				self.setState({data: messagesJson.messages, totalMessagesNumber : messagesJson.totalMessagesNumber});
			}
		});
	},
	
	renderDeleteButton: function() {
		return(<div className="messgListspacer">
					<input name="Submit" onClick={this.deleteAll} type="button" value={this.props.labels.deleteAll}/>
			  </div>)
	},
	
	render: function() {	
		var self = this;
		var items = this.state.data.map(function(data) {
			var removeThisMessage = function() {	
				var result = confirm(self.props.labels.deleteConfirmation);
				if(result == true) {
					var messageIds = data.internalMessageId;
					api.removeMessageById(messageIds).end(function(err, resJson) {
						if(err == null) {
							self.refreshDataFromServer();
						}
					});
				}
			};								
			return <MessageEntry data={data} key={data.internalMessageId} removeThisMessage={removeThisMessage}/>;
		});
		
		var deleteButton = this.state.totalMessagesNumber > 0 
		? this.renderDeleteButton()
		: undefined;
		
		var emtyMessageLabel = this.state.totalMessagesNumber == 0
		? (<label>{this.props.labels.noMessages}</label>)
		: undefined;
				
		return(<div className="widget">	
				<div className="widgetList">					
						<div  className="messageList"> 
							<div className="messageList-title-text" >   
								<h1 className="h1List">{this.props.labels.title}</h1> 
								<div className="messagesList-header">
									<span>{this.props.labels.date}</span>
									<span className="paddingLeft30">{this.props.labels.subject}</span>
								</div>
								{items}
							</div> 
						</div>
						{emtyMessageLabel}
						
				</div>{deleteButton}</div>);
	}
});

module.exports = {
	MessagesList: MessagesList,
	display: function (app, element) {
		ReactDOM.render( <MessagesList labels={app.labels.messagesList}/>, element);
	}
	
}
