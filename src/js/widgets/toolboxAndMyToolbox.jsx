var api = require('../api');
var React = require ('libs').React;
var toolbox = require("./toolbox.jsx");
var myTools = require("./myTools.jsx");

module.exports = {
	render: function (myToolboxId, toolboxId, data) {
		api.prepareUserApplication().end(function(err, resJson) {
			if(err == null) {
				var appResponse = JSON.parse(resJson.text);
				React.render( <toolbox.Toolbox data={appResponse.applications} labels={data.toolbox} logedIn={appResponse.userLogedIn}/>, document.getElementById(toolboxId));
				if(appResponse.userLogedIn) {
					React.render( <myTools.MyTools data={appResponse.applications} labels={widgetsJson.my_toolbox} />, document.getElementById(myToolboxId));
				} else {
					React.render( <myTools.MyToolsHeader/>, document.getElementById(id));	
				}
			} 
		});
	}
}
