//查询客户

$(function() {
	
	$('#buyername').combogrid({
		panelWidth : 300,
		url : '../../enterprise/billing/getcontactname.do',
		//data : data,
		idField : 'contactid',
		textField : 'contactname',
		mode : 'remote',
		fitColumns : true,
		columns : [ [

		{
			field : 'contactname',
			title : '客户名称',
			align : 'left',
			width : 300
		}, {
			field : 'contactcompanyname',
			title : '公司',
			align : 'left',
			width : 100,
			hidden: true
			
		}, {
			field : 'conmobilephone',
			title : '联系电话',
			align : 'left',
			width : 100,
			hidden: true
		}
		] ]
	});
	
});