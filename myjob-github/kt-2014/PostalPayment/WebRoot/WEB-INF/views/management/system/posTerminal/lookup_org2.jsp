<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>


<script type="text/javascript">
//<!--
var formId = $("#formId").val();
var CurrentAccessScope = <%=request.getAttribute("CurrentAccessScope")%>;
var lCurrentOrgCode = <%=request.getAttribute("lCurrentOrgCode")%>;
var LevelSite=<%=com.rongbang.utils.PlatformConstants.ORG_LEVEL_SITE %>;
var LevelSubstation=<%=com.rongbang.utils.PlatformConstants.ORG_LEVEL_SUBSTATION %>;
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
			$.bringBack({pos_org_code: treeNode.code ,pos_org_name: treeNode.name});
			$("#"+formId+" .h-cleanBtn-assignorg").css("display","block");
			event.preventDefault();
		}
	}
};
$(document).ready(function(){
	var t = $("#serch_org");
	t = $.fn.zTree.init(t, setting);
});

//-->
</script>

<div class="pageContent">
	<div class="pageFormContent" layoutH="58">
		<ul id="serch_org" class="ztree" style="display: block;"></ul>
	</div>
	<input type="hidden" value="${formId}" id="formId">
	<div class="formBar">
		<ul>
<%--		<li><div class="button"><div class="buttonContent"><button id="cleanData" type="button">清空</button></div></div></li>--%>
			<li><div class="button"><div class="buttonContent"><button class="close" id="closeOrg" type="button">关闭</button></div></div></li>
		</ul>
	</div>
</div>