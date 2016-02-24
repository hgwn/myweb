<%@page import="com.rongbang.utils.PlatformConstants"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%--卡黑名单新建页面 --%>
<script type="text/javascript">
	var create_cardblack_CurrentAccessScope = <%=request.getAttribute("CurrentAccessScope")%>;
	var create_cardblack_lCurrentOrgCode = <%=request.getAttribute("lCurrentOrgCode")%>;
	var businessId = <%=request.getAttribute("businessId")%>;
	var setting = {
			check: {
					enable: true,
					chkDisabledInherit: true,
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
				otherParam:{
					"CurrentAccessScope":create_cardblack_CurrentAccessScope,
					"lCurrentOrgCode":create_cardblack_lCurrentOrgCode,
					"businessId":businessId,
					"cancelClick":true,
					"showAll":false
					}
			}
		};
	
	$(document).ready(function(){
		$.fn.zTree.init($("#card_black_tree"), setting);
		$("#card_submitBtn").click(function(){
			var business = $("#blackCard_businessID").val();
			//获取选中的机构code，半选的支局也要保存，半选的县级以上机构不保存
			var station_codes = "";
			var data = {};
			var treeObj = $.fn.zTree.getZTreeObj("card_black_tree");
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
			
			var card_infos = "";
			var cboxs =  $("input:checkbox[name=cardType]:checked");
			for (var j = 0; j < cboxs.length; j++) {
				card_infos = card_infos + cboxs[j].value + ",";
			}
			if($.trim(card_infos)==""){
				alertMsg.info("请最少勾选一个卡种类！");
				return false;
			}
			data.card_infos = card_infos;
			data.business = business ;
			/* $.ajax({
				type:"post",
				url:"${contextPath }/management/risk/organizationBusiness/create",
				data:{"datas":JSON.stringify(data)},
				success:function(msg){
					var json = jQuery.parseJSON(msg);
					navTabAjaxDone(json);
				},
				error:function(msg){
					var json = jQuery.parseJSON(msg);
					navTabAjaxDone(msg);
				}
			}); */
			alertMsg.confirm("确认要提交吗？", {okCall: function(){
					form3.action="${contextPath }/management/risk/cardBlackList/createcard?datas="+JSON.stringify(data);
					if(flag){
						alertMsg.confirm("您选择了集团、省或者市级的机构，会产生大量数据，是否确认要提交？", {okCall: function(){
								return validateCallback($("#form3"), navTabReloadParent);
							}
						});	
					}else{
						return validateCallback($("#form3"), navTabReloadParent);
					}
				}
			});		
		});
		$("#blackCard_businessCode").change(function(){
			var businessCode = $("#blackCard_businessCode").val();
			var forwardUrl = "${contextPath }/management/risk/cardBlackList/create?businessCode="+businessCode;
			navTab.reload(forwardUrl);  ;
		})
		
	 });
</script>
 
<body>
<form id="form3" method="post" action="${contextPath }/management/risk/cardBlackList/createcard" class="required-validate pageForm" >
<div class="pageContent">
	<div class="tabs">
		<div class="tabsContent">
			<div>
				<div layoutH="5" id="BusinessOrganizationCardTree" style="float:left; display:block; overflow:auto; width:300px; border:solid 1px #CCC; line-height:21px; background:#fff;">
					<ul class="ztree">
						<li>
						请先选择业务种类：
							<select name="business" id="blackCard_businessID" class="re_select">
								<c:forEach items="${businessList}" var="bus">
									<option value="${bus.id}"
										<c:if test="${bus.id eq businessId }">
											selected="selected" 
										</c:if>
									>${bus.businessName}</option>	
								</c:forEach>
							</select>
						</li>
					</ul>
					<ul id="card_black_tree" class="ztree"></ul>
				</div>
				
				<div layoutH="0" id="BusinessOrganizationCardList" class="unitBox" style="margin-left:306px; background:#fff">
					
		<ul class="config-info">
			<h2>请选择需要禁用的卡类型</h2></br>
					<div class="organizationBusiness_box">
						<ul class="organizationBusiness_list">
						<c:forEach var="item" items="${cardType}">
							<li>
								<input id="${item.id }" type="checkbox" name="cardType" style="vertical-align:middle;" value="${item.keyItem }" /><label for="${item.id }">${item.item1 }</label>
							</li>
						</c:forEach>
						</ul>
					</div>
		</ul>
		
		
	<div class="config-btn">
		<button  type="button" id="card_submitBtn" class="submitBtn">提交</button>
	</div>
				</div>
			</div>
		</div>
	</div>
</div>
</form>
</body>