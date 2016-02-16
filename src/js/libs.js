require("babel-polyfill/dist/polyfill.min.js");

module.exports = {
	React: require("react"),
	//React: require('react/dist/react.min.js'),
	ReactDOM: require("react-dom"),
	//ReactDOM: require("react-dom/dist/react-dom.min.js"),
	ReactCSSTransitionGroup: require('react-addons-css-transition-group'),
	Reflux: require("reflux"),

	// http://visionmedia.github.io/superagent/
	// request: require("superagent")
	request: require('superagent-promise')(require('superagent'), Promise)
}
