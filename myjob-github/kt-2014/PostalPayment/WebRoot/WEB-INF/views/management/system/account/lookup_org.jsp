<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
//<!--
var account_CurrentAccessScope = <%=request.getAttribute("CurrentAccessScope")%>;
var account_lCurrentOrgCode = <%=request.getAttribute("lCurrentOrgCode")%>;
var setting = {
	view: {
		selectedMulti: false,
		showIcon: false
	},
	data: {
		simpleData: {
			enable:true,
			//idKey: "id",
			idKey: "code",
			pIdKey: "pId",
			rootPId: ""
		}
	},
	async: {
		enable: true,
		url:"${contextPath}/management/security/organization/getAsyncTreeData",
		//autoParam: ["id"],
		autoParam: ["code"],
		otherParam:{"CurrentAccessScope":account_CurrentAccessScope,"lCurrentOrgCode":account_lCurrentOrgCode}
	},
	callback: {
		onClick: function(event, treeId, treeNode) {
			//$.bringBack({id: treeNode.id ,name: treeNode.name});
			if(treeNode.level!=0 || (treeNode.level ==0 && treeNode.rootClick)){
				$.bringBack({code: treeNode.code, name: treeNode.name,orgLevel:treeNode.orgLevel});
			}
			//触发验证
			$("#accourtCreate_form input[name='organization.name']").trigger("blur");
			event.preventDefault();
		}
	}
};
$(document).ready(function(){
	var t = $("#orgArea_payment");
	//alert(account_CurrentAccessScope);
	//alert(account_lCurrentOrgCode);
	t = $.fn.zTree.init(t, setting);
});
//-->
</script>

<div class="pageContent">
	<div class="pageFormContent" layoutH="58">
		<ul id="orgArea_payment" class="ztree" style="display: block;"></ul>
	</div>
	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button class="close" type="button">关闭</button></div></div></li>
		</ul>
	</div>
</div>