<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
<!--
function jumpBussiness() {
	var tabid = navTab.getCurrentNavTab().attr("tabid");
	navTab.reloadFlag(tabid);
}

function back() {
	var url = "${contextPath }/management/system/business/listBussiness";
	navTab.getCurrentNavTab().attr("url", url);
	navTab.reload(url);
}
//-->
</script>
<dwz:paginationForm action="${contextPath}/management/system/business/listBusiness" page="${page }">
	<input type="hidden" name="businessName" value="${param.businessName}"/>
	<input type="hidden" name="supportSystemId" value="${supID}"/>
</dwz:paginationForm>


<form method="post" action="${contextPath}/management/system/business/listBusiness" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent">
				<table class="h-table">
				<tr>
				<td width="110" align="right">业务名称：</td>
				<td>
					<input type="text" style="width:98%;" name="businessName" value="${param.businessName }"/>
					<input type="hidden" name="supportSystemId" value="${supID}"/>
				</td>
				<td width="110" align="right">&nbsp;</td>
				<td>&nbsp;</td>
				<td width="110" align="right">&nbsp;</td>
				<td>&nbsp;</td>
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
<div class="pageContent">
	<div class="panelBar">
		<ul class="toolBar">
			<shiro:hasPermission name="SupportSystem:save">
				<li><a iconClass="page_add" target="dialog" mask="true" width="530" height="300" rel="businessSystem_save" href="${contextPath }/management/system/business/createBusiness/${supID}"><span>添加业务信息</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="SupportSystem:edit">
				<li><a iconClass="page_edit" target="dialog" mask="true" width="530" height="300" rel="businessSystem_edit" href="${contextPath }/management/system/business/updateBusiness/{bus_id}"><span>编辑业务信息</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="SupportSystem:edit">
				<li><a iconClass="page_go" target="selectedTodo" rel="ids" href="${contextPath }/management/system/business/enable" title="确认更新状态为启用?"><span>业务启用</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="SupportSystem:edit">
				<li><a iconClass="page_error" target="selectedTodo" rel="ids" href="${contextPath }/management/system/business/disable" title="确认更新状态为停用?"><span>业务停用</span></a></li>
			</shiro:hasPermission>
			<%--<shiro:hasPermission name="SupportSystem:delete">
				<li><a iconClass="page_delete" target="selectedTodo" rel="ids" href="${contextPath }/management/system/businessSystem/delete" title="确认要删除选定数据字典词条?"><span>删除账户</span></a></li>
			</shiro:hasPermission>--%>
			
		</ul>
	</div>

	
	<table class="table" layoutH="125" width="100%">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="ids" class="checkboxCtrl"></th>
				<th>业务种类</th>
				<th>所属业务系统</th>
				<th width="100">业务代码</th>
				<th width="80">状态</th>
				<th width="130" orderField="createdTime" class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}">创建时间</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach  items="${businessInfos}"  var="bus" varStatus="var">
				<tr target="bus_id" rel="${bus.id}">
					<td align="center">${var.count}</td>
					<td><input type="checkbox"  name="ids" value="${bus.id}" ></td>
					<td>${bus.businessName}</td>
					<td>${bus.supportSystem.systemName}</td>
					<td>${bus.businessCode}</td>
					<td><dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.CONVERT_BUSSINESS_STATUS %>" dataValue="${bus.status}"/></td>
					<td><fmt:formatDate value="${bus.createdTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	<c:if test="${empty businessInfos}">
		    	<div class="re_tips">没有搜到符合您条件的数据！</div>
 	  	</c:if>
	<!-- 分页 -->
	<dwz:pagination page="${page }"/>
</div>
