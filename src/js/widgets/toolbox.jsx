var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var Transition = require ('libs').ReactCSSTransitionGroup;
var api = require('../api');
var Reflux = require('libs').Reflux;


var ToolboxEntry = React.createClass({
	render: function () {
		var plusIcon = this.props.plusVisible
			? <div className="add" title="Add item to workspace">
				<input  type="submit" value="" name="Submit" onClick={this.props.addAppToUser}/>
			  </div> 
			: undefined;
		var body = this.props.expanded
			? <div className="acc-body">
				<a href={this.props.data.url}>
					<img src={this.props.data.img} title={this.props.data.title} alt={this.props.data.title} />
				</a>
				{plusIcon}	
				<p>{this.props.data.description}</p>
			</div>
			: undefined;
		
		return <div>
			<div className={this.props.expanded? "acc-head" : "acc-head arrow2"} onClick={this.props.clickToExpand}>
				<p>{this.props.data.title}</p>
				<a href={this.props.data.url}>{this.props.data.title}</a>
			</div>
			<Transition transitionName="accordion" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
				{body}
			</Transition>
		</div>;
	}
});

var Toolbox = React.createClass({
	mixins: [Reflux.ListenerMixin],
	
	getInitialState: function() {
		return {data: [], loggedIn: false, expandedId: 1};
	},
	componentDidMount: function() {
		this.listenTo(this.props.app.store, this.changed);
		this.changed();
	},

	updateDataFromServer: function() {
		api.prepareUserApplication().end().then(resJson => {
			var appResponse = JSON.parse(resJson.text);
			var expandedId = 1;
			if(appResponse.applications.length > 0) {
				expandedId = appResponse.applications[0].id; 
			}	
			this.setState({data: appResponse.applications, loggedIn: appResponse.userLogedIn, expandedId: expandedId});

		}).catch(err => console.error(err));
	},
	changed: function() {
		this.updateDataFromServer();
	},
	addApp: function(addAppId) {
		api.addAppToUser(addAppId).end().then(resJson => {
			this.state.data.map(function(current) {
				if(current.id == addAppId) {
					current.userSelected = true;
				}
			});
			this.props.app.actions.changeMyTools();
		});
	},
	render: function() {
		var self = this;
		var entries = self.state.data.map(function (data) {
			var setExpandedId = function() {
				self.setState({expandedId: data.id});
			};
			var addAppToUser = function() {
				self.addApp(data.id);	
			};
			var expanded = data.id == self.state.expandedId;
			var plusVisible = false;
			if(self.state.loggedIn) {
				plusVisible = !data.userSelected;
			}
			return <ToolboxEntry key={data.id} data={data} expanded={expanded} clickToExpand={setExpandedId} addAppToUser={addAppToUser} plusVisible={plusVisible} />;
		});
		
		return <div className="widget">
				<div className="toolbox">
					<div className="toolbox-top"><h3>{this.props.app.labels.toolbox.title}</h3></div>
						<div className="toolbox-content">
							{entries}
						</div>
					<div className="toolbox-footer" />
				</div>
			  </div>;
	}
});

module.exports = {
	Toolbox: Toolbox,
	display: function (app, element) {
		ReactDOM.render( <Toolbox app={app} />, element);
	}
}
