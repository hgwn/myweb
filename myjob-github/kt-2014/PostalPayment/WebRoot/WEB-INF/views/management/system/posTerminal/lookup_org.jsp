<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>


<script type="text/javascript">
//<!--
var formId = $("#formId").val();
var internalMernoId=$("#internalTerminalnoId").val();
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
			if(treeNode.orgLevel==LevelSite || treeNode.orgLevel==LevelSubstation){  // 只能添加支局和网点
				if(internalMernoId==""){
					alertMsg.warn("请先选择内部终端编号！");
					$.bringBack({code: '' ,name: ''});
				}else{
					$.bringBack({code: treeNode.code ,name: treeNode.name});
					$("#"+formId+" .h-cleanBtn-wd").css("display","block");
				}
			}else{
				alertMsg.warn("只能选择支局和网点！");
				
			}
			event.preventDefault();
		}
	}
};
$(document).ready(function(){
	var t = $("#internal_create_lookup_org");
	t = $.fn.zTree.init(t, setting);
});

//-->
</script>

<div class="pageContent">
	<div class="pageFormContent" layoutH="58">
		<ul id="internal_create_lookup_org" class="ztree" style="display: block;"></ul>
	</div>
	<input type="hidden" value="${formId}" id="formId">
	<div class="formBar">
		<ul>
<%--		<li><div class="button"><div class="buttonContent"><button id="cleanData" type="button">清空</button></div></div></li>--%>
			<li><div class="button"><div class="buttonContent"><button class="close" id="closeOrg" type="button">关闭</button></div></div></li>
		</ul>
	</div>
</div>