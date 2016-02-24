<%@page import="com.rongbang.utils.PlatformConstants"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
	var org_bus_CurrentAccessScope = <%=request.getAttribute("CurrentAccessScope")%>;
	var org_bus_lCurrentOrgCode = <%=request.getAttribute("lCurrentOrgCode")%>;
	var setting = {
		check: {
			enable: true,
			chkboxType:{"Y":"s", "N":"s"}
		},
		view: {
			selectedMulti: false,
			showIcon: true
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
			autoParam: ["code","checked"],
			otherParam:{"CurrentAccessScope":org_bus_CurrentAccessScope,"lCurrentOrgCode":org_bus_lCurrentOrgCode,"cancelClick":true,"showAll":false}
		}
	};
	
	
	$(document).ready(function(){
		
		var treeObj1=$.fn.zTree.init($("#treeOrg"), setting);
	
		$("#submitBtn").click(function(){
			//获取选中的机构code，半选的支局也要保存，半选的县级以上机构不保存
			var station_codes = ""
			var data = {};
			var treeObj = $.fn.zTree.getZTreeObj("treeOrg");
			//var nodes = treeObj.getNodesByParam("orgLevel", 6, null);
			var nodes = treeObj.getCheckedNodes(true);
			var flag=false;
			for (var i = 0; i < nodes.length; i++) {
				var halfCheck = nodes[i].getCheckStatus();
				//全选的机构
				if (!halfCheck.half){
					station_codes = station_codes + nodes[i].code + ",";
					if(nodes[i].orgLevel==<%=PlatformConstants.ORG_LEVEL_GROUP%>
						||nodes[i].orgLevel==<%=PlatformConstants.ORG_LEVEL_PROVINCE%>
						||nodes[i].orgLevel==<%=PlatformConstants.ORG_LEVEL_CITY%>){
						flag=true;
					}
				}else{
					//半选的机构，如果是支局，则也要保存
					if(nodes[i].orgLevel==<%=PlatformConstants.ORG_LEVEL_SUBSTATION%>){
						station_codes = station_codes + nodes[i].code + ",";
					}
				}
			}
			
			if($.trim(station_codes)==""){
				alertMsg.info("请最少勾选一个需要配置的网点！");
				return false;
			}
			data.stations = station_codes;
			
			//获取选中的业务种类id
			var config_infos = "";
			var cboxs =  $("input:checkbox[name=business]:checked");
			for (var j = 0; j < cboxs.length; j++) {
				config_infos = config_infos + cboxs[j].value + ",";
			}
			if($.trim(config_infos)==""){
				alertMsg.info("请最少勾选一个业务！");
				return false;
			}
			data.config_infos = config_infos;
			/* $.ajax({
				type:"post",
				url:"${contextPath }/management/risk/organizationBusiness/create",
				data:{"datas":JSON.stringify(data)},
				success:function(msg){
					//alert(msg);
					var json = jQuery.parseJSON(msg);
					var pTabid = navTab.getCurrentNavTab().attr("pTabid");
					navTab.reload( {navTabId: pTabid});
					json.navTabId = pTabid;
					//alert(navTabReloadParent);
					//var f = $("#pagerForm", navTab.getPanel(pTabid));
					//navTab.reload("${contextPath }/management/risk/organizationBusiness/list",{data:f.serializeArray(),navTabId: pTabid});
					navTabAjaxDone(json);
					//navTabSearch(f);
					//$(pTabid).loadUrl("${contextPath }/management/risk/organizationBusiness/list",f.serializeArray());
				},
				error:function(msg){
					var json = jQuery.parseJSON(msg);
					navTabAjaxDone(json);
				}
			});  */
			alertMsg.confirm("确认要提交吗？", {okCall: function(){
					orgBusinessform.action="${contextPath }/management/risk/organizationBusiness/create?datas="+JSON.stringify(data);
					if(flag){
						alertMsg.confirm("您选择了集团、省或者市级的机构，会产生大量数据，是否确认要提交？", {okCall: function(){
								return validateCallback($("#orgBusinessform"), navTabReloadParent);
							}
						});	
					}else{
						return validateCallback($("#orgBusinessform"), navTabReloadParent);
					}
				}
			});	
		});
		
	 });
</script>
 
<body>
<form id="orgBusinessform" method="post" action="${contextPath }/management/risk/organizationBusiness/create" class="required-validate pageForm" >
<div class="pageContent">
	<div class="tabs">
		<div class="tabsContent">
			<div>
				<div layoutH="5" id="jbsxBox2BusinessOrgTree" style="float:left; display:block; overflow:auto; width:300px; border:solid 1px #CCC; line-height:21px; background:#fff;">
					<ul id="treeOrg" class="ztree"></ul>
				</div>
				
				<div layoutH="0" id="businessList" class="unitBox" style="margin-left:306px; background:#fff">
					
		<div class="config-info">
			<h2>请选择需要禁用的业务种类</h2><br/>
					<div class="organizationBusiness_box">
						<ul class="organizationBusiness_list">
							<c:forEach var="item" items="${businessList}">
								<li target="slt_uid">
									<input id="${item.id }" type="checkbox" name="business" value="${item.id }" /><label for="${item.id }">${item.businessName }</label>
								</li>
							</c:forEach>
						</ul>
					</div>
		</div>
	<div class="config-btn">
		<button  type="button" id="submitBtn" class="submitBtn">提交</button>
	</div>
				</div>
			</div>
		</div>
	</div>
</div>
</form>
</body>