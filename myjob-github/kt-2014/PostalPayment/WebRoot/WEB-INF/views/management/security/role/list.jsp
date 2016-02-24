<%@page import="java.util.Date"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<dwz:paginationForm action="${contextPath }/management/security/role/list" page="${page }">
	<input type="hidden" name="search_LIKE_name" value="${param.search_LIKE_name}"/>
</dwz:paginationForm>

<form method="post" action="${contextPath }/management/security/role/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent">
			<table class="h-table">
				<tr>
				<td width="110" align="right">角色名称：</td>
				<td>
					<input style="width:98%;" type="text" name=search_LIKE_name value="${param.search_LIKE_name }" maxlength="20"/>
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
			<shiro:hasPermission name="Role:view">
				<li><a iconClass="magnifier" rel="ids" target="selectedTab" href="${contextPath }/management/security/role/view"><span>查看角色</span></a></li>
			</shiro:hasPermission>		
			<shiro:hasPermission name="Role:save">
				<li><a iconClass="shield_add" rel="Role_navTab" target="navTab" href="${contextPath }/management/security/role/create"><span>添加角色</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="Role:edit">
				<li><a iconClass="shield_go" rel="ids" target="selectedTab" href="${contextPath }/management/security/role/update"><span>编辑角色</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="Role:delete">
				<li><a iconClass="shield_delete" target="selectedTodo" href="${contextPath }/management/security/role/delete" rel="ids" title="确认要删除角色?"><span>删除角色</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="Role:disable">
				<li><a iconClass="lock" target="selectedTodo" href="${contextPath }/management/security/role/disable" rel="ids" title="确认要停用吗?"><span>停用角色</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="Role:enable">
				<li><a iconClass="lock_open" target="selectedTodo" href="${contextPath }/management/security/role/enable" rel="ids" title="确认要启用吗?"><span>启用角色</span></a></li>
			</shiro:hasPermission>	
		</ul>
	</div>
	
	<table class="table" layoutH="125" width="100%">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="ids"
					class="checkboxCtrl">
				<th width="200" orderField=name
					class="${page.orderField eq 'name' ? page.orderDirection : ''}">角色名称</th>
				<th>描述</th>
				<th orderField=status
					class="${page.orderField eq 'status' ? page.orderDirection : ''}">状态</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${roles}" varStatus="var">
			<tr target="slt_uid" rel="${item.id}">
				<td align="center">${var.count}</td>
				<td><input name="ids" value="${item.id}" type="checkbox"></td>
				<td>${item.name}</td>
			    <td>${item.description }</td>
			    <td>
			    	<c:choose>
			    		<c:when test="${item.status=='D' }">已停用</c:when>
			    		<c:otherwise>已启用</c:otherwise>
			    	</c:choose>
			    </td>
			</tr>
			</c:forEach>
		</tbody>
	</table>
	<!-- 分页 -->
	<dwz:pagination page="${page }"/>
</div>