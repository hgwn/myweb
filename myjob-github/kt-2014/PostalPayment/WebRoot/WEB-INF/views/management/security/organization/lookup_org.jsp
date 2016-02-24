<%@page import="com.rongbang.utils.PlatformConstants"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
//<!--
var formId = $("#formId").val();
var CurrentAccessScope = <%=request.getAttribute("CurrentAccessScope")%>;
var lCurrentOrgId = <%=request.getAttribute("lCurrentOrgCode")%>;
var selectAll = <%=request.getAttribute("selectAll")%>;
var LevelSubstation=<%=com.rongbang.utils.PlatformConstants.ORG_LEVEL_SUBSTATION %>;
var LevelSite=<%=com.rongbang.utils.PlatformConstants.ORG_LEVEL_SITE %>;

var setting = {
	view: {
		selectedMulti: false,
		showIcon: true
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
		url:"${contextPath }/management/security/organization/getAsyncTreeData",
		//autoParam: ["id"],
		autoParam: ["code"],
		//otherParam:{"CurrentAccessScope":paymentWater_CurrentAccessScope,"lCurrentOrgId":paymentWater_lCurrentOrgId}
		  otherParam:{"CurrentAccessScope":CurrentAccessScope,"lCurrentOrgCode":lCurrentOrgId}
	},
	callback: {
		onClick: function(event, treeId, treeNode) {
			if(treeNode.level!=0 || (treeNode.level ==0 && treeNode.rootClick)){
				//selectAll==false则只能选择支局和网点
				if(selectAll==false&&treeNode.orgLevel!=LevelSite && treeNode.orgLevel!=LevelSubstation){ 
					alertMsg.warn("只能选择支局和网点！");
				}else{
					//选择支局的时候，需要让“只查支局”可以勾选，其他则不能
					if(treeNode.orgLevel==<%=PlatformConstants.ORG_LEVEL_SUBSTATION%>){
						$("#onlySubstation", navTab.getCurrentPanel()).removeAttr("disabled");
					}else{
						$("#onlySubstation", navTab.getCurrentPanel()).removeAttr("checked");
						$("#onlySubstation", navTab.getCurrentPanel()).attr("disabled","disabled");
					}
					//带回选择的值
					$.bringBack({code: treeNode.code ,name: treeNode.name,orgLevel:treeNode.orgLevel});
					//在查询条件的输入框显示清空按钮“X”
					$("#"+formId+" .h-cleanBtn").css("display","block");
				}
			}
			event.preventDefault();
			
		}
	}
};
$(document).ready(function(){
	var t = $("#orgArea_paymentWater");
	t = $.fn.zTree.init(t, setting);
	//lookup_org("#formId_order");
});
//-->
</script>

<div class="pageContent">
	<div class="pageFormContent" layoutH="58">
		<ul id="orgArea_paymentWater" class="ztree" style="display: block;"></ul>
	</div>
	
	<div class="formBar">
		<ul>
			<input type="hidden" value="${formId}" id="formId">
			<li><div class="button"><div class="buttonContent"><button class="close" type="button">关闭</button></div></div></li>
		</ul>
	</div>
</div>