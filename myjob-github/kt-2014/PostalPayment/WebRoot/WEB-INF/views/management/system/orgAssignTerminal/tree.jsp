<%@page import="com.rongbang.utils.PlatformConstants"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
//<!--
var org_CurrentAccessScope = <%=request.getAttribute("CurrentAccessScope")%>;
var org_lCurrentOrgCode = <%=request.getAttribute("lCurrentOrgCode")%>;
var treeUrl = "terminalno_list";
var setting = {
	view: {
		selectedMulti: false
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
		otherParam:{"CurrentAccessScope":org_CurrentAccessScope,"lCurrentOrgCode":org_lCurrentOrgCode,showAll:false,"treeUrl":treeUrl}
	},
	callback: {
		onClick: function(event, treeId, treeNode) {
			
			if(treeNode.orgLevel==<%=PlatformConstants.ORG_LEVEL_SITE%>
				||treeNode.orgLevel==<%=PlatformConstants.ORG_LEVEL_SUBSTATION%>){
				
				var $rel = $("#jbsxBox2TerminalnoList2");
				$rel.loadUrl(treeNode.url, {}, function(){
					$rel.find("[layoutH]").layoutH();
				});		
				$("#orgAssina-treeBtn").attr("disabled",false).css({"background-position":"0 0","cursor":"pointer","color":"#fff"});
				$(".button .buttonContent #orgAssina-treeBtn").live({
					mouseover:function(){
						$(this).css("background-position","0 -144px");
					},
					mouseout:function(){
						$(this).css("background-position","0 0");
					}
				});	
			}else{
				$("#orgAssina-treeBtn").attr("disabled",true).css({"background-position":"0 -362px","cursor":"default","color":"#999"});
				$(".button .buttonContent #orgAssina-treeBtn").live({
					mouseover:function(){
						$(this).css("background-position","0 -362px");
					},
					mouseout:function(){
						$(this).css("background-position","0 -362px");
					}
				});	
			}
			event.preventDefault();
		}
	}
};

     	
$(document).ready(function(){
	var t = $("#orgTree2");
	t = $.fn.zTree.init(t, setting);
});
//-->
</script>
<style>
<!--
#orgTree li span {
	text-align:left;
	display: inline;
} 
-->
</style>
<ul id="orgTree2" layoutH="5"  class="ztree" style="display: block; overflow:auto; "></ul>