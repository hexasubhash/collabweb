var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var Transition = require ('libs').ReactCSSTransitionGroup;
var api = require('../api');
var Reflux = require('libs').Reflux;


var MyProjectsEntry = React.createClass({
	getInitialState: function() {
		return {expanded: false};
	},
	handleClick: function(e) {
		this.setState({expanded: !this.state.expanded});
	},
	render: function() {
		var self = this;
		var body = this.state.expanded
		? <div className="body"> 
				<p>Project remarks</p> 
				<div className="remarks">
					<p>test</p>
				</div> 
				<a target="tss_project_app" href={self.props.data.pdfURL} className="arrow">
					Show PDF
				</a> 
				<a target="tss_project_app" href={self.props.data.solutionURL} className="arrow">
					Go to solution
				</a> 
			</div>
		: undefined;
		return (
			<div className="myproj1"> 
				<div className="myproj1-content"> 
					<div className={this.state.expanded ? 'head open' : 'head'}> 
						<p onClick={this.handleClick}>{this.props.data.projectName}</p> 
						<span className="language">{this.props.data.projectCreationDateStr}</span> 
					</div>
					{body}
					<div className="clearBoth">
					</div>
				</div>
			</div>
		
		);
	}
});


var MyProjects = React.createClass({
	getInitialState: function() {
		return {data: [], expanded: true}
	},
	componentDidMount: function() {
		var self = this;
		api.getUserProjects().end(function(err, resJson) {
			if(err == null) {
				var userProjects = JSON.parse(resJson.text);
				self.setState({data: userProjects});
			}
		});
	},
	handleClick: function(e) {
		this.setState({expanded: !this.state.expanded});
	},
	render: function() {
		var self = this;
		
		var entries = Object.keys(this.state.data).length > 0 ?
			this.state.data.map(function (data) {
				return <MyProjectsEntry key={data.projectID} data={data}/>;
			})
			:
			<div className="myproj1">
				<div className="myproj1-content">
					<span>{self.props.labels.info}</span>
				</div>
			</div>;

		var header = <div className={self.state.expanded? "myproj-top" : "myproj-top off"} onClick={this.handleClick}>
						<span>{self.props.labels.title}</span>
			  		</div>;
		var body = this.state.expanded
			? <div className="myproj-content">
				{entries}
			  </div>
			: undefined;
		
		return (
			<div className="widget">
				<div className="myproj">
					{header}
					<Transition transitionName="wfade" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
						{body}
					</Transition>
					<div className="clearBoth"></div>
					<div className="myproj-footer" />
				</div>
			</div>
		);
	}
});

module.exports = {
	MyProjects: MyProjects,
	display: function(app, element) {
		ReactDOM.render( <MyProjects labels={app.labels.my_projects}/>, element);
	}	
}
