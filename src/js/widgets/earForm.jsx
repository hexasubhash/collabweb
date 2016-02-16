var React = require ('libs').React;
var ReactDOM = require ('libs').ReactDOM;
var api = require('../api');

var EarForm = React.createClass({
	
	getInitialState: function() {
		return {
			formData: undefined,
			errors : undefined,
			success : undefined
		}
	},
	
	dataChanged: function(field, e) {
		 this.state.formData[field] = e.target.value;
	},
	
	checkboxChanged: function(field, e) {
		if(e.target.checked) {
			this.state.formData[field] = "true";
		} else {
			this.state.formData[field] = "false";
		}
	},
	
	componentDidMount: function() {
		var self = this;
		api.getEarFormModel().end(function(err, resJson) {
			if(err == null) {
				var model = JSON.parse(resJson.text);
				self.setState({formData: model});
			}
		});
	},
	
	handleSubmit: function(e) {
		e.preventDefault();
		var self = this;
		var earModel = JSON.stringify(this.state.formData);
	    api.saveEarModel(earModel).end(function(err, errorJson) {
	    	if(err == null) {
	    		self.setState({errors:  undefined});
	    		self.setState({success:  true});
	    	} else {
	    		var errors = JSON.parse(errorJson.text);
	    		self.setState({errors:  errors});
	    		self.setState({success:  false});
	    	}
	    });   
	  },
	
	validateField: function(id) {
		return (this.state.errors != undefined && this.state.errors[id] != undefined);
	},
	
	renderInput: function(id, containerCssClass, inputCssClass, label, length, mandatory) {
	   	var errorCssClass = this.validateField(id) ? inputCssClass + ' form-error' : inputCssClass;
	   	var mandatoryStar = mandatory  ? '*' : undefined;
	   	var labelForId = this.props.componentName + "_" + id;
		return (<div className={containerCssClass}>
	       			<label htmlFor={labelForId}>{label}<sup>{mandatoryStar}</sup></label> 
	       			<input id={labelForId} name={id} maxLength={length}  className={errorCssClass} onChange={this.dataChanged.bind(this, id)}/>
	       		</div>)
	},
	
	renderTextArea: function(id, containerCssClass, areaCssClass, label) {
		return(<div className={containerCssClass}> 
				<label forHtml={id}>{label}</label> 
				<textarea id={id} className={areaCssClass} onChange={this.dataChanged.bind(this, id)}></textarea> 
			</div>)
	},
	
	renderCheckbox: function(id, containerCssClass, checkboxClass, label) {	
		return(<div className={containerCssClass}> 
				<label forHtml={id}>{label}</label> 
				<input id={id} type="checkbox" className={checkboxClass} onChange={this.checkboxChanged.bind(this, id)}/> 
			</div>);
	},
	
	renderRadioButton: function(id, containerCssClass, radioGroup, label) {
		return(<div className={containerCssClass}> 
					<label forHtml={id}>{label}</label> 
					<input type="radio" className="check" id={id} name={radioGroup}/> 
				</div>);
	},
	
	handleResetCaptcha: function(field, e) {
		api.resetCaptcha().end(function() {
			// Reload image
			var img = document.getElementById("captchaImage");
			var newSrc = "/w/api/stickyImg?" + Math.random();
			img.src = newSrc
	    });
	},
	
	renderTitle: function(label) {
		return(<h3>{label}</h3>);
	},
	
	renderCaptcha: function(id) {
		var errorCssClass = this.validateField(id) ? 'shortversion form-error' : 'shortversion';
		var capthcaImageSrc = "/w/api/stickyImg?" + Math.random();
		return(<div>
				<div className="form-grp-halfsize"> 
					<img src={capthcaImageSrc} className="captchaImage" id="captchaImage"/> 
				</div>
				<div className="form-grp-halfsize"> 
					<input id={id} type="text" className={errorCssClass} size="10" defaultValue="" autoComplete="off" onChange={this.dataChanged.bind(this, id)}/> 
				</div>
				 <div className="form-grp-halfsize"> </div>
				 <div className="form-grp-halfsize">
				 <input type="button" defaultValue="New Code" className="captcha-regenerate" name="generate" onClick={this.handleResetCaptcha.bind(this, id)}/> 
				</div>
		</div>);
	},
	
	render: function() {
		var errorMessage = this.state.errors != undefined
		? (<div className="portlet-msg-error">全ての必須フィールドに入力してください。</div>)		
		: undefined;
		
		var form = this.state.success
		? (<form id="contact"><div className="portlet-msg-success">お客様のリクエストは正しく送られました。.</div></form>)
		: (<form className="earForm" onSubmit={this.handleSubmit}>
				{errorMessage}
				{this.renderInput('date', 'form-grp-halfsize', 'shortversion', '受付日', 100, false)}
				{this.renderInput('company', 'form-grp-halfsize', 'shortversion', '貴社名', 100, true)}
				{this.renderInput('address', 'form-grp-halfsize', 'shortversion', '住所', 100, false)}
				{this.renderInput('department', 'form-grp-halfsize', 'shortversion', '部署名・役職', 100, false)}
				{this.renderInput('name', 'form-grp-halfsize', 'shortversion', '氏名', 50, true)}
				{this.renderInput('email', 'form-grp-halfsize', 'shortversion', 'E-Mail', 100, true)}
				{this.renderInput('phone', 'form-grp-halfsize', 'shortversion', 'TEL', 30, true)}
				{this.renderInput('fax', 'form-grp-halfsize', 'shortversion', 'FAX', 30, false)}
				{this.renderInput('products', 'form-grp-halfsize', 'shortversion', '製品名', 30, false)}
				{this.renderInput('application', 'form-grp-halfsize', 'shortversion', '当社を知ったきっかけ', 50, false)}
				
				{this.renderTitle('用途')}
				{this.renderInput('currentSeal', 'form-grp-halfsize', 'shortversion', '現在ご使用のｼｰﾙ ', 50, false)}
				{this.renderInput('partNumber', 'form-grp-halfsize', 'shortversion', '部品番号', 50, false)}
				
				{this.renderTextArea('problem', 'form-grp', 'textarea', '用途')}
				{this.renderInput('quoteQty', 'form-grp', 'longversion', '生じている問題', 50, false)}
				
				{this.renderTitle('使用条件')}
				<div className="form-grp-wrapper">
					<label>温度</label> 
					{this.renderInput('tempMin', 'form-grp-xs', 'xsversion', '最低', 50, false)}
					{this.renderInput('tempOperating', 'form-grp-xs', 'xsversion', '常用', 50, false)}
					{this.renderInput('tempMax', 'form-grp-xs', 'xsversion', '最高', 50, false)} 
				</div>
				
				<div className="form-grp-wrapper">
					<label>システム圧</label> 
					{this.renderInput('pressureMin', 'form-grp-xs', 'xsversion', ' 最低', 50, false)}
					{this.renderInput('pressureOperating', 'form-grp-xs', 'xsversion', '常用', 50, false)}
					{this.renderInput('pressureMax', 'form-grp-xs', 'xsversion', '最高', 50, false)} 
				</div>
				
				<div className="form-grp-wrapper">
					<label>ストローク</label> 
					{this.renderInput('strokeMin', 'form-grp-xs', 'xsversion', ' 最低', 50, false)}
					{this.renderInput('strokeOperating', 'form-grp-xs', 'xsversion', '常用', 50, false)}
					{this.renderInput('strokeMax', 'form-grp-xs', 'xsversion', '最高', 50, false)} 
				</div>
				
				<div className="form-grp-wrapper">
					<label>回転角</label> 
					{this.renderInput('rotationMin', 'form-grp-xs', 'xsversion', ' 最低', 50, false)}
					{this.renderInput('rotationOperating', 'form-grp-xs', 'xsversion', '常用', 50, false)}
					{this.renderInput('rotationMax', 'form-grp-xs', 'xsversion', '最高', 50, false)} 
				</div>
				
				<div className="form-grp-wrapper">
					<label>表面速度</label> 
					{this.renderInput('rpmMs', 'form-grp-xs', 'xsversion', ' m/s', 50, false)}
					{this.renderInput('rpm', 'form-grp-xs', 'xsversion', 'rpm', 50, false)}
				</div>
				
				<div className="form-grp-wrapper">
					<label>サイクル数</label> 
					{this.renderInput('cyclerateBez1', 'form-grp-xs', 'xsversion', ' 毎秒', 50, false)}
					{this.renderInput('cyclerateBez2', 'form-grp-xs', 'xsversion', '毎分', 50, false)}
				</div>
				
				{this.renderInput('media', 'form-grp', 'longversion', 'シール流体', 50, false)}
				
				
				{this.renderTitle('製品の用途')}
				<div className="form-grp-wrapper"> 
					<div className="form-grp-check">
						{this.renderCheckbox('isStatic', 'check-wrapper', 'check', '固定')}
						{this.renderCheckbox('isRotary', 'check-wrapper', 'check', '回転')}
						{this.renderCheckbox('isPiston', 'check-wrapper', 'check', 'ピストン')}
						{this.renderCheckbox('isFace', 'check-wrapper', 'check', 'フェイス')}
						{this.renderCheckbox('isReciprocating', 'check-wrapper', 'check', '往復')}
						{this.renderCheckbox('isOscillatory', 'check-wrapper', 'check', '揺動')}
						{this.renderCheckbox('isRod', 'check-wrapper', 'check', 'ロッド')}
						{this.renderCheckbox('isOther', 'check-wrapper', 'check', 'その他')}
					</div>
				</div>
				
				{this.renderTitle('適用部品の諸元')}
				<div className="form-grp-wrapper">
				 	<label>内径</label>
				 	{this.renderInput('idA', 'form-grp-xxs', 'xxsversion', 'A', 50, false)}
				 	{this.renderInput('idTolerance', 'form-grp-xxs', 'xxsversion', '公差', 50, false)}
				 	{this.renderInput('idHardness', 'form-grp-xxs', 'xxsversion', '硬度', 50, false)}
				 	{this.renderInput('idFinish', 'form-grp-xxs', 'xxsversion', '面粗さ', 50, false)}
				 	{this.renderInput('idMaterial', 'form-grp-xxs', 'xxsversion', '材質', 50, false)}
				</div>
				<div className="form-grp-wrapper">
				 	<label>ロッド径</label>
				 	{this.renderInput('bareB', 'form-grp-xxs', 'xxsversion', 'B', 50, false)}
				 	{this.renderInput('bareHardness', 'form-grp-xxs', 'xxsversion', '硬度', 50, false)}
				 	{this.renderInput('bareFinish', 'form-grp-xxs', 'xxsversion', '面粗さ', 50, false)}
				 	{this.renderInput('bareMaterial', 'form-grp-xxs', 'xxsversion', '材質', 50, false)}
				</div>
				
				{this.renderInput('pistonBore', 'form-grp-halfsize', 'shortversion', 'ピストン径', 50, false)}
				{this.renderInput('glandDepth', 'form-grp-halfsize', 'shortversion', '溝幅', 50, false)}
				
				<div className="form-grp-wrapper">
					<label>&nbsp;</label> 	
					{this.renderInput('glandWidth', 'form-grp-xxs', 'xxsversion', '溝径', 50, false)}
				 	{this.renderInput('glandHardness', 'form-grp-xxs', 'xxsversion', '硬度', 50, false)}
				 	{this.renderInput('glandFinish', 'form-grp-xxs', 'xxsversion', '面粗さ', 50, false)}
				 	{this.renderInput('glandMaterial', 'form-grp-xxs', 'xxsversion', '材質', 50, false)}
				</div>
				
				{this.renderTitle('グランド設計様式')}
				<div className="form-grp-wrapper"> 
					<div className="form-grp-check">
						{this.renderRadioButton('id_static', 'check-wrapper', 'group1', '分離可能')}
						{this.renderRadioButton('id_rotary', 'check-wrapper', 'group1', '一体')}
					</div> 
				</div>
				
				{this.renderTitle('設計変更可能ですか？')}
				<div className="form-grp-wrapper"> 
					<div className="form-grp-check">
						{this.renderRadioButton('id_possible', 'check-wrapper', 'group2', '可能')}
						{this.renderRadioButton('id_prospects', 'check-wrapper', 'group2', '見込みあり')}
						{this.renderRadioButton('id_impossible', 'check-wrapper', 'group2', '不可能')}
					</div> 
				</div>
				
				{this.renderInput('hardwareBez1', 'form-grp-halfsize', 'shortversion', '1/2直径のｸﾘｱﾗﾝｽ', 50, false)}
				{this.renderInput('hardwareBez2', 'form-grp-halfsize', 'shortversion', '同芯度', 50, false)}
				{this.renderInput('hardwareBez3', 'form-grp', 'longversion', 'ﾍﾞｱﾘﾝｸﾞのｷﾞｬｯﾌﾟ', 50, false)}
				
				{this.renderTitle('性能')}
				<div className="form-grp-wrapper">
					<label>摩擦</label> 
					{this.renderInput('currentFriction', 'form-grp-halfsize', 'xsversion', '現在の摩擦(トルク)', 50, false)}
					{this.renderInput('expectedFriction', 'form-grp-halfsize', 'xsversion', '希望の摩擦', 50, false)}
				</div>
				<div className="form-grp-wrapper">
					<label>有効寿命</label> 
					{this.renderInput('currentLife', 'form-grp-halfsize', 'xsversion', '現在の有効寿命(km)', 50, false)}
					{this.renderInput('expectedLife', 'form-grp-halfsize', 'xsversion', '希望の有効寿命(km)', 50, false)}
				</div>
				<div className="form-grp-wrapper">
					<label>漏れ</label> 
					{this.renderInput('currentLeakage', 'form-grp-halfsize', 'xsversion', '現在の漏れの程度:', 50, false)}
					{this.renderInput('expectedLeakage', 'form-grp-halfsize', 'xsversion', '希望の漏れ程度', 50, false)}
				</div>
				 <div className="form-grp-wrapper"> 
					 <div className="label-wrapper"> 
						<label className="halfsize">必要なアクション </label>
						<label className="halfsize">コメント</label> 
					 </div> 
					 
					 <label>1</label>
					 {this.renderInput('oneRequired', 'form-grp-halfsize', 'shortversion', '', 50, false)}
					 {this.renderInput('oneComment', 'form-grp-halfsize', 'shortversion', '', 50, false)}
					 
					 <label>2</label>
					 {this.renderInput('twoRequired', 'form-grp-halfsize', 'shortversion', '', 50, false)}
					 {this.renderInput('twoComment', 'form-grp-halfsize', 'shortversion', '', 50, false)}
					 
					 <label>3</label>
					 {this.renderInput('threeRequired', 'form-grp-halfsize', 'shortversion', '', 50, false)}
					 {this.renderInput('threeComment', 'form-grp-halfsize', 'shortversion', '', 50, false)}
					 
					 <label>4</label>
					 {this.renderInput('fourRequired', 'form-grp-halfsize', 'shortversion', '', 50, false)}
					 {this.renderInput('fourComment', 'form-grp-halfsize', 'shortversion', '', 50, false)}
					 
					 <label>5</label>
					 {this.renderInput('fiveRequired', 'form-grp-halfsize', 'shortversion', '', 50, false)}
					 {this.renderInput('fiveComment', 'form-grp-halfsize', 'shortversion', '', 50, false)}
					 
					 <label>6</label>
					 {this.renderInput('sixRequired', 'form-grp-halfsize', 'shortversion', '', 50, false)}
					 {this.renderInput('sixComment', 'form-grp-halfsize', 'shortversion', '', 50, false)}
					 
					 <div className="label-wrapper"> 
						<label className="halfsize">キャプチャ文字<sup>*</sup></label> 		 
						<label className="halfsize">表示のキャプチャ文字<sup>*</sup></label> 
					</div>
					
					<label>&nbsp;</label>
					{this.renderCaptcha("captchaText")}
					
					
				</div>
				 <div className="form-grp-buttons"> 
					<input type="submit" id="Submit" name="Submit" value="Send"/>
					<input type="reset" value="Clear"/> 
					</div> 
				</form>);
		return (<div className="widget">{form}</div>)
		}
	});

module.exports = {
	EarForm: EarForm,
	display: function (app, element) {
		var componentName = element.getAttribute('data-wwidget-type');
		ReactDOM.render( <EarForm componentName={componentName}/>, element); 
	},
}
