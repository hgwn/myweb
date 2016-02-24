<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>


<script type="text/javascript">
//<!--
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
			alertMsg.confirm("确认指定到【"+treeNode.name+"】吗？", {
				okCall: function(){
					var pos_ids=$("#pos_ids").val();
					$.ajax({
						type:"post",
						url:"${contextPath }/management/system/posTerminal/assignOrg",
						data:{"org.code":treeNode.code,"pos_ids":pos_ids},
						success:function(msg){
							var json = jQuery.parseJSON(msg);
							dialogReloadRel(json);
							$("#close_assignOrg").click();
						},
						error:function(msg){
							var json = jQuery.parseJSON(msg);
							dialogReloadRel(json);
						}
					}); 
				}
			})
			event.preventDefault();
		}
	}
};
$(document).ready(function(){
	var t = $("#assign_org");
	t = $.fn.zTree.init(t, setting);
});

//-->
</script>
<div class="pageContent">
	<div class="pageFormContent" layoutH="58">
		<ul id="assign_org" class="ztree" style="display: block;"></ul>
	</div>
	<input type="hidden" value="${pos_ids}" id="pos_ids">
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button class="close" id="close_assignOrg" type="button">关闭</button></div></div></li>
		</ul>
	</div>
</div>