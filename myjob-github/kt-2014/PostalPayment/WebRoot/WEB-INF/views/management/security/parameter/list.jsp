<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@page import="java.util.Date"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<dwz:paginationForm action="${contextPath }/management/security/parameter" page="${page }">
	<input type="hidden" name="search_LIKE_parameterName" value="${param.search_LIKE_parameterName }"/>
</dwz:paginationForm>

<form method="post" action="${contextPath }/management/security/parameter" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent">
			<table class="h-table">
				<tr>
				<td width="110" align="right">参数名称：</td>
				<td>
					<input style="width:98%;"  type="text" name="search_LIKE_parameterName" value="${param.search_LIKE_parameterName }"/>
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
			<shiro:hasPermission name="Parameter:save">
				<li><a iconClass="tag_blue_add" target="dialog" rel="lookup2organization_add" mask="true" width="550" height="330" href="${contextPath }/management/security/parameter/create"><span>添加参数</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="Parameter:edit">
				<li><a iconClass="tag_blue_edit" target="selectedOne" rel="ids" mask="true" width="550" height="330" href="${contextPath }/management/security/parameter/update"><span>编辑参数</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="Parameter:delete">
				<li><a iconClass="tag_blue_delete" target="selectedTodo" rel="ids" href="${contextPath }/management/security/parameter/delete" title="确认要删除?"><span>删除参数</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>
	
	<table class="table" layoutH="125" width="100%">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="ids" class="checkboxCtrl"></th>			
				<th>参数名称</th>
				<th>值</th>
				<th>KEY</th>
				<th width="150" orderField="updateTiem"
					class="${page.orderField eq 'updateTiem' ? page.orderDirection : ''}">更新日期</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${listparameter}" varStatus="var">
			<tr target="slt_uid" rel="${item.id}">
				<td align="center">${var.count}</td>
				<td><input name="ids" value="${item.id}" type="checkbox"></td>
				<td>${item.parameterName}</td>
				<td>${item.parameterValue}</td>
				<td>${item.parameterKey}</td>
				<td><fmt:formatDate value="${item.updateTiem}" pattern="yyyy-MM-dd"/></td>
			</tr>			
			</c:forEach>
		</tbody>
	</table>
	<!-- 分页 -->
	<dwz:pagination page="${page }"/>
</div>