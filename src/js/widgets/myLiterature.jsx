var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var Transition = require ('libs').ReactCSSTransitionGroup;
var api = require('../api');


var MyLiteratureEntry = React.createClass({
	getInitialState: function() {
		return {hover: false}
	},
	
	onMouseLeave: function() {
		this.setState({hover: false});
	},
	
	onMouseEnter: function() {
		this.setState({hover: true});
	},
	
	render: function () {
		var deleteIcon = this.state.hover ? 
		<div className="remove" title="Clear" onClick={this.props.removeAppFromUser}>
			<input type="submit" value=""/>
		</div>
		: null;
		
		var entry = !this.props.data.deleted ?
			<div className="mylit1"  onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
				<div className="mylit1-content"> 
					<div className="text">
						<p>{this.props.data.title}</p>
						<span className="language">({this.props.data.language})</span>
						<a className="arrow" target="_blank" href={this.props.data.url}>
							{this.props.data.documentType} {this.props.data.documentSize}
						</a>
					</div>
					<div className="icon">
						<a href={this.props.data.url} target="_blank">
						<img src="http://tss-static.com/remotemedia/media/_technik/layout/icon/icon_pdf.gif"/></a>
					</div>
					{deleteIcon}		
				</div> 
			</div>
		: null;
		
		return <div>{entry}</div>;
	}
});


var MyLiterature = React.createClass({
	getInitialState: function() {
		return {data: [], expanded: true}
	},

	componentDidMount: function() {
		var self = this;
		api.getUserLiterature().end(function(err, resJson) {
			if (err == null) {
				var userLiterature = JSON.parse(resJson.text);
				self.setState({data: userLiterature});
			}
		});
	},

	handleClick: function(e) {
		this.setState({expanded: !this.state.expanded});
	},
	render: function() {
		var self = this;
		var entries = this.state.data.map(function (data) {
			var removeAppFromUser = function() {
				api.removeLiteratureFromUser(data.id).end(removeLiteratureFromUserCallback(data.id));
				function removeLiteratureFromUserCallback(deletedId) {
					self.state.data.map(function(data) {
						if(data.id == deletedId) {
							data.deleted = true;
						}
					});
					self.setState({data: self.state.data});
				}
			};
			return <MyLiteratureEntry key={data.id} data={data} removeAppFromUser={removeAppFromUser}/>;
		});
		var header = <div className={this.state.expanded ? "mylit-top" : "mylit-top off"} onClick={this.handleClick}>
						<span>{this.props.labels.title}</span>
					</div>;
		var body = this.state.expanded
			? <div className="mylit-content">
				{entries}
			  </div>
			: null;
		
		return <div className="widget">
				<div className="mylit">
					{header}			
					<Transition transitionName="wfade" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
						{body}
					</Transition>
					<div className="clearBoth"></div>
				<div className="mylit-footer" />
			</div>
		</div>;
	}
});

 
module.exports = {
	MyLiterature: MyLiterature,
	display: function (app, element) {
		ReactDOM.render( <MyLiterature labels={app.labels.literature}/>, element);
	}
}
