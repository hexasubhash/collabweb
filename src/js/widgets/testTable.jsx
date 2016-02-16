var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var DataTable = require('react-data-components').DataTable;

var columns = [
  { title: 'Name', prop: 'name'  },
  { title: 'City', prop: 'city' },
  { title: 'Address', prop: 'address' },
  { title: 'Phone', prop: 'phone' }
];

var data = [
  { name: 'name value', city: 'city value', address: 'address value', phone: 'phone value' }
];


var testTable = React.createClass({


tableData: function() {
<DataTable
	 className="container"
	 keys={[ 'name', 'address' ]}
	 columns={columns}
	 initialData={data}
	 initialPageLength={5}
	 initialSortBy={{ prop: 'city', order: 'descending' }}
	 pageLengthOptions={[ 5, 20, 50 ]}
 />
},

	render: function() {
		var self = this;
		return(<div className="widget" >
			<p><h1>SINJASJJASJASJ</h1></p>
			console.log('SUBHASH123');
				{this.tableData}
    			</div>
    			)
	}
});

module.exports = {
	testTable: testTable,
	display: function (app, element) {
		var componentName = element.getAttribute('data-wwidget-type');
		ReactDOM.render(  <testTable labels={app.labels.resetPassword} componentName={componentName}/>, element);
	}

}
