<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
//<!--
var CurrentAccessScope = <%=request.getAttribute("CurrentAccessScope")%>;
var lCurrentOrgCode = <%=request.getAttribute("lCurrentOrgCode")%>;
var setting = {
	view: {
		selectedMulti: false,
		showIcon: false
	},
	data: {
		simpleData: {
			enable:true,
			idKey: "code",
			pIdKey: "pId",
			rootPId: ""
		}

	},
	async: {
		enable: true,
		url:"${contextPath }/management/security/organization/getAsyncTreeData",
		autoParam: ["code"],
		otherParam:{"CurrentAccessScope":CurrentAccessScope,"lCurrentOrgCode":lCurrentOrgCode}
	},
	callback: {
		onClick: function(event, treeId, treeNode) {
			$.bringBack({code: treeNode.code ,name: treeNode.name});
			event.preventDefault();
		}
	}
};
$(document).ready(function(){
	var t = $("#parentOrg");
	t = $.fn.zTree.init(t, setting);
});
//-->
</script>

<div class="pageContent">
	<div class="pageFormContent" layoutH="58">

		<ul id="parentOrg" class="ztree" style="display: block;"></ul>

	</div>
	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button class="close" type="button">关闭</button></div></div></li>
		</ul>
	</div>
</div>