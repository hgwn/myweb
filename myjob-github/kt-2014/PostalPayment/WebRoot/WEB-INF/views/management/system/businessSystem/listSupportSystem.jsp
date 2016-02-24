<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
<!--
function jumpSupportSystem() {
	var tabid = navTab.getCurrentNavTab().attr("tabid");
	navTab.reloadFlag(tabid);
}

function back() {
	var url = "${contextPath }/management/system/supportSystem/listSupportSystem";
	navTab.getCurrentNavTab().attr("url", url);
	navTab.reload(url);
}


//-->
</script>
<dwz:paginationForm action="${contextPath}/management/system/supportSystem/listSupportSystem" page="${page }">
	<input type="hidden" name="systemName" value="${param.systemName}"/>
</dwz:paginationForm>


<form method="post" action="${contextPath}/management/system/supportSystem/listSupportSystem" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent">
			<table class="h-table">
				<tr>
				<td width="110" align="right">系统名称：</td>
				<td>
					<input style="width:98%;" type="text" name="systemName" value="${param.systemName }"/>
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
				<li><a iconClass="page_add" target="dialog" mask="true" width="550" height="350" rel="businessSystem_save" href="${contextPath }/management/system/supportSystem/createSupportSystem"><span>添加系统信息</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="SupportSystem:edit">
				<li><a iconClass="page_edit" target="selectedOne" mask="true" width="550" height="350" rel="ids" href="${contextPath }/management/system/supportSystem/updateSupportSystem"><span>编辑系统信息</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="SupportSystem:edit">
				<li><a class="a" iconClass="computer_go" target="selectedTodo" rel="ids" href="${contextPath }/management/system/supportSystem/enable" title="确认更新状态为启用?"><span>系统启用</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="SupportSystem:edit">
				<li><a class="b" iconClass="computer_error" target="selectedTodo" rel="ids" href="${contextPath }/management/system/supportSystem/disable" title="确认更新状态为停用?"><span>系统停用</span></a></li>
			</shiro:hasPermission>
			<%--<shiro:hasPermission name="SupportSystem:delete">
				<li><a iconClass="page_delete" target="selectedTodo" rel="ids" href="${contextPath }/management/system/supportSystem/delete" title="确认要删除选定数据字典词条?"><span>删除账户</span></a></li>
			</shiro:hasPermission>--%>
			
		</ul>
	</div>

	
	<table class="table" layoutH="125" width="100%">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="ids" class="checkboxCtrl"></th>
				<th>业务系统</th>
				<th width="150">系统代码</th>
				<th width="130">生效时间</th>
				<%--<th width="150">过期时间</th>--%>
				<th width="80">状态</th>
				<th width="80">查看业务</th>
				<th width="130" orderField="createdTime" class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}">创建时间</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach  items="${supportSystem}"  var="sup" varStatus="var">
				<tr target="sup_id" rel="${sup.id}">
					<td align="center">${var.count}</td>
					<td><input type="checkbox"  name="ids" value="${sup.id}" ></td>
					<td>${sup.systemName}</td>
					<td>${sup.systemCode}</td>
					<td><fmt:formatDate value="${sup.activeDate}" pattern="yyyy-MM-dd "/></td>
					<%--
					<td><fmt:formatDate value="${sup.expiryDate}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
					--%>
					<td><dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.CONVERT_SUPPORTSYSTEM_STATUS %>" dataValue="${sup.status }"/></td>
					<td>
						<a title="业务管理" iconClass="book_open" href="${contextPath }/management/system/business/listBusiness?supportSystemId=${sup.id}" target="navTab"  >进入词条</a>
					</td>
					<td><fmt:formatDate value="${sup.createdTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	<c:if test="${empty supportSystem}">
		    	<div class="re_tips">没有搜到符合您条件的数据！</div>
 	</c:if>
	<!-- 分页 -->
	<dwz:pagination page="${page }"/>
</div>
