<%@page import="com.rongbang.utils.PlatformConstants"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<a id="refreshJbsxBox2organizationTree" rel="jbsxBox2organizationTree" target="ajax" href="${contextPath}/management/security/organization/tree" style="display:none;"></a>
<dwz:paginationForm action="${contextPath}/management/security/organization/list/${parentOrganizationCode}" page="${page }" onsubmit="return divSearch(this, 'jbsxBox2organizationList');">
	<input type="hidden" name="search_LIKE_code" value="${param.search_LIKE_code }"/>
	<input type="hidden" name="search_LIKE_name" value="${param.search_LIKE_name }" />
	<input type="hidden" name="selectAll" value="${param.selectAll }" />
</dwz:paginationForm>
<script type="text/javascript">
	/* $(document).ready(function(){
		$(".org_create").click(function(event){
			var treeObj = $.fn.zTree.getZTreeObj("orgTree");
			var nodes = treeObj.getSelectedNodes();
			if(nodes.length >0 && nodes[0].orgLevel==6){
				alertMsg.warn("网点不能再添加子机构，请重新选择!");
				event.preventDefault();
				return false;
			}
			$(".real_org_create_btn").click();
		});
	}); */
	
$(document).ready(function(){
	
	$('#search_LIKE_code').autocomplete({
		serviceUrl: '${contextPath }/management/security/organization/getOrgCode?parentOrgCode=${parentOrganizationCode}',
	});
	$('#search_LIKE_name').autocomplete({
		serviceUrl: '${contextPath }/management/security/organization/getOrgName?parentOrgCode=${parentOrganizationCode}'
	});
});	
function changeSelectValue(){
	if(selectAllBox.checked==true){
		$("#selectAll").val("1");
	}else{
		$("#selectAll").val("");
	}
	
	$('#search_LIKE_code').autocomplete({
		serviceUrl: '${contextPath }/management/security/organization/getOrgCode?parentOrgCode=${parentOrganizationCode}&selectAll='+$("#selectAll").val(),
	});
	$('#search_LIKE_name').autocomplete({
		serviceUrl: '${contextPath }/management/security/organization/getOrgName?parentOrgCode=${parentOrganizationCode}&selectAll='+$("#selectAll").val()
	});
}
</script>
<form method="post" action="${contextPath }/management/security/organization/list/${parentOrganizationCode}" onsubmit="return divSearch(this, 'jbsxBox2organizationList');">
	<input type="hidden" value="${parentOrganizationCode}" id="parentOrgId"/>
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent">
			<table class="h-table">
				<tr>
				<td width="110" align="right">机构代码：</td>
				<td>
					<input style="width:90%;" type="text" id="search_LIKE_code" name=search_LIKE_code value="${param.search_LIKE_code }" maxlength="20"/>
				</td>
				<td width="110" align="right">机构名称：</td>
				<td>
					<input style="width:90%;" type="text" id="search_LIKE_name" name=search_LIKE_name value="${param.search_LIKE_name }" maxlength="64"/>
				</td>
				<%-- <td>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<input type="hidden" id="selectAll" name="selectAll" value="${param.selectAll }">
					<input type="checkbox" style="vertical-align:middle;" onclick="changeSelectValue()"  id="selectAllBox" name="selectAllBox" <c:if test="${param.selectAll==1}">checked</c:if> />搜索所有机构
				</td> --%>
				</tr>
			</table>	
			</div>
			<div class="subBar">
				<ul>						
					<li><div class="button"><div class="buttonContent"><button type="submit">搜索</button></div></div></li>
				</ul>
			</div>
		</div>
	</div>
</form>

<div class="pageContent h-Organization">
	<div class="panelBar">
		<ul class="toolBar">
		<shiro:hasPermission name="Organization:save">
			<li><a target="dialog" iconClass="group_add" class="org_create_btn" rel="lookupParent2org_add" mask="true" width="600" height="410" href="${contextPath}/management/security/organization/create/${parentOrganizationCode}"><span>添加机构</span></a></li>
		</shiro:hasPermission>
		<shiro:hasPermission name="Organization:edit">
			<li><a iconClass="group_edit" target="dialog" mask="true" rel="lookupParent2org_edit" width="600" height="410" href="${contextPath}/management/security/organization/update/{slt_uid}"><span>编辑机构</span></a></li>
		</shiro:hasPermission>
		<%-- <shiro:hasPermission name="Organization:disable">
			<li><a iconClass="lock" target="ajaxTodo" callback="dialogReloadRel2Org" href="${contextPath}/management/security/organization/disable/{slt_uid}" title="确认要停用该机构以及该机构下的所有子机构和用户吗?"><span>停用机构</span></a></li>
		</shiro:hasPermission>
		<shiro:hasPermission name="Organization:enable">
			<li><a iconClass="lock" target="ajaxTodo" callback="dialogReloadRel2Org" href="${contextPath}/management/security/organization/enable/{slt_uid}" title="确认要启用该机构以及该机构下的所有子机构和用户吗?"><span>启用机构</span></a></li>
		</shiro:hasPermission> --%>
		<%-- <shiro:hasPermission name="Organization:delete">
			<li><a iconClass="lock" target="ajaxTodo" callback="dialogReloadRel2Org" href="${contextPath}/management/security/organization/delete/{slt_uid}" title="确认要禁用该机构?"><span>删除机构</span></a></li>
		</shiro:hasPermission> 
		<shiro:hasPermission name="Organization:assign">
			<li class="line">line</li>
			<li><a iconClass="shield_add" target="dialog" mask="true" width="400" height="500" href="${contextPath}/management/security/organization/lookup2create/organizationRole/{slt_uid}"><span>分配角色</span></a></li>
			<li><a iconClass="shield_delete" target="dialog" mask="true" width="400" height="500" href="${contextPath}/management/security/organization/lookup2delete/organizationRole/{slt_uid}"><span>撤销角色</span></a></li>
		</shiro:hasPermission>	
		--%>	
		</ul>
	</div>
	<table class="table" layoutH="130" width="1850" rel="jbsxBox2organizationList" >
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="160" orderField="code"
					class="${page.orderField eq 'code' ? page.orderDirection : ''}">机构代码</th>
				<th width="200">机构名称</th>
				<th width="70">机构简称</th>
				
				<th width="150">所属省机构</th>
				<th width="160">所属市机构</th>
				<th width="200">所属县机构</th>
				<th width="200">所属支局</th>
				
				<th width="300">机构地址</th>
<!-- 				<th width="65">地域</th> -->
				<th width="70">机构级别</th>
				<th width="80">负责人姓名</th>
				<th width="90">机构属性</th>
				<th width="60">机构性质</th>
				<th width="60">机构状态</th>
			</tr>
		</thead>
		<tbody>
			<c:set var="substationLevel" scope="page" value="<%=PlatformConstants.ORG_LEVEL_SUBSTATION %>"/>
			<c:forEach var="item" items="${organizations}" varStatus="var">
				
				<!-- 根据机构的级别获取机构的所有上级机构 -->
				<c:if test="${item.orgLevel==10 }">
					<c:set var="provinceName" scope="page" value="${item.name }"/>
				</c:if>
				<c:if test="${item.orgLevel==20 }">
					<c:set var="provinceName" scope="page" value="${item.parent.name }"/>
					<c:set var="cityName" scope="page" value="${item.name }"/>
				</c:if>
				<c:if test="${item.orgLevel==30 }">
					<c:set var="provinceName" scope="page" value="${item.parent.parent.name }"/>
					<c:set var="cityName" scope="page" value="${item.parent.name }"/>
					<c:set var="countryName" scope="page" value="${item.name }"/>
				</c:if>
				<c:if test="${item.orgLevel==40 }">
					<c:set var="provinceName" scope="page" value="${item.parent.parent.parent.name }"/>
					<c:set var="cityName" scope="page" value="${item.parent.parent.name }"/>
					<c:set var="countryName" scope="page" value="${item.parent.name }"/>
					<c:set var="substationName" scope="page" value="${item.name }"/>
				</c:if>
				<c:if test="${item.orgLevel==50 }">
					<c:set var="provinceName" scope="page" value="${item.parent.parent.parent.parent.name }"/>
					<c:set var="cityName" scope="page" value="${item.parent.parent.parent.name }"/>
					<c:set var="countryName" scope="page" value="${item.parent.parent.name }"/>
					<c:set var="substationName" scope="page" value="${item.parent.name }"/>
				</c:if>
				
				<tr target="slt_uid" rel="${item.code}">
					<%-- <td>
						<c:forEach var="oRole" items="${item.organizationRoles }">
							${oRole.role.name}&nbsp;&nbsp;
						</c:forEach>
					</td>
					<td>${item.priority}</td> --%>
					<td align="center">${var.count}</td>
					<td>${item.code}</td>
					<td>
						<c:choose >
							<c:when test="${item.orgLevel<=substationLevel }">
								<a class="h-organizationName" 
									href="${contextPath}/management/security/organization/list/${item.code}" target="ajax" rel="jbsxBox2organizationList"
							 >${item.name}</a>
							</c:when>
							<c:otherwise>${item.name}</c:otherwise>						
						</c:choose>
					 </td>
					<td>${item.shortName }</td>
					
					<td>${provinceName }</td>
					<td>${cityName }</td>
					<td>${countryName }</td>
					<td>${substationName }</td>
					
					<td>${item.address }</td>
<%-- 					<td>
						<c:forEach var="area" items="${provinceList}">
							<c:if test="${area.keyItem==item.zoneNo }">${area.item1 }</c:if>
						</c:forEach>
					</td> --%>
					<td>
						<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.ORGANIZATION_LEVEL %>" dataValue="${item.orgLevel }"/>
					</td>
					<td>${item.leadName }</td>
					<td>
						<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.ORGANIZATION_CATEGORY %>" dataValue="${item.orgCategory }"/>
					</td>
					<td>
						<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.ORGANIZATION_WORK_TYPE %>" dataValue="${item.workType }"/>
					</td>
					<td>
						<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.ORGANIZATION_STATUS %>" dataValue="${item.status }"/>
					</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>

	<!-- 分页 -->
	<dwz:pagination page="${page }" rel="jbsxBox2organizationList" onchange="navTabPageBreak({numPerPage:this.value}, 'jbsxBox2organizationList')"/>
</div>