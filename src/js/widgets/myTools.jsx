var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var Transition = require ('libs').ReactCSSTransitionGroup;
var api = require('../api');
var Reflux = require('libs').Reflux;

var MyToolsEntry = React.createClass({
	getInitialState: function() {
		return {hover: false}
	},
	onMouseLeave: function() {
		this.setState({hover: false});
	},
	onMouseEnter: function() {
		this.setState({hover: true});
	},
	removeFromUser: function() {
		var self = this;
		api.removeAppFromUser(this.props.data.id).end(function (err, resJson) {
			self.props.app.actions.changeMyTools();
		});
	},

	render: function () {
		var deleteIcon = this.state.hover 
		? <div className="remove" title="Clear" onClick={this.removeFromUser}>
			<input type="submit" value=""/>
		</div>
		: undefined;
		
		var entry = this.props.data.userSelected
		?	<div className="my_tools1"  onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={this.onMouseEnter}>
				<div className="my_tools1-content"> 
				<div className="text bold"> 
					<a className="arrow" target="_blank" href={this.props.data.url}>
						{this.props.data.title}
						</a> 
					</div> 
				<div className="th"> 
					<a target="_blank" href={this.props.data.url}>
						<img src={this.props.data.img} alt={this.props.data.title} title={this.props.data.title}/>
					</a> 
				</div>
					{deleteIcon}
				<div className="clearBoth"/>
			</div> 
		</div> 
		: undefined;
		return (<div>{entry}</div>);
	}
});

var MyTools = React.createClass({
	mixins: [Reflux.ListenerMixin],
	
	getInitialState: function() {
		return {data: this.props.data, expanded: true}
	},
	handleClick: function(e) {
		this.setState({expanded: !this.state.expanded});
	},
	componentDidMount : function() {
		this.listenTo(this.props.app.store, this.changed);
	},
	changed: function() {
		this.updateDataFromServer();
	},
	updateDataFromServer: function() {
		var self = this;
		api.prepareUserApplication().end(function (err, resJson) {
			if(!err) {
				var userAppList = JSON.parse(resJson.text);
				self.setState({data: userAppList.applications});	
			}
		});	
	},
	render: function() {
		var self = this;
		var entries = this.state.data.map(function (data) {
			return <MyToolsEntry key={data.id} data={data} app={self.props.app} />;
		 });
		
		var header = this.state.expanded
			? <div className="my_tools-top" onClick={this.handleClick}>
				<span>{this.props.app.labels.my_toolbox.title}</span>
			  </div>
			 : <div className="my_tools-top off" onClick={this.handleClick}>
					<span>My Tools</span>
				</div>;
		var body = this.state.expanded
			? <div className="my_tools-content">
				{entries}
			  </div>
			: undefined;
		return (
			<div className="widget">
				<div className="my_tools">
					{header}
					<Transition transitionName="wfade" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
						{body}
					</Transition>
					<div className="my_tools-footer" />
				</div>
			</div>
		);
	}
});

var MyToolsHeader = React.createClass({
	render: function() {
	return (
			<div className="widget">
				<div className="mylit">
					<div className="mylit-top" onClick={this.handleClick}>
						<span>My Tools</span>
					</div>
					<div className="mylit-content"></div>
					<div className="mylit-footer" />
				</div>
			</div>
	 	)
	}
});

module.exports = {
	MyTools: MyTools,
	display: function(app, element) {
		api.prepareUserApplication().end(function(err, resJson) {
			if(err == null) {
				var userApps = JSON.parse(resJson.text);
				if(userApps.userLogedIn) {
					ReactDOM.render( <MyTools data={userApps.applications} app={app}/>, element);
				} else {
					ReactDOM.render( <MyToolsHeader/>, element);
				}
			}
		});
	}
}
