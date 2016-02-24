<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%@page import="java.util.Date"%>

<script type="text/javascript">
<!--
function jumpAccount() {
	var tabid = navTab.getCurrentNavTab().attr("tabid");
	navTab.reloadFlag(tabid);
}

function back() {
	var url = "${contextPath }/management/system/account/list";
	navTab.getCurrentNavTab().attr("url", url);
	navTab.reload(url);
}

$(document).ready(function(){
	$('#search_account_no').autocomplete({
		serviceUrl: '${contextPath }/management/system/account/getAccount_no'	 
	});
	/*
		$('#search_account_name').autocomplete({
		serviceUrl: '${contextPath }/management/system/account/getAccount_name'	
		});
	*/
});
//-->
</script>
<dwz:paginationForm action="${contextPath }/management/system/account/list" page="${page }">
	<input type="hidden" name="accountNo" value="${param.accountNo}"/>
	<input type="hidden" name="accountName" value="${param.accountName}"/>
</dwz:paginationForm>
                                           
<form method="post" action="${contextPath}/management/system/account/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style="height:auto; width:90%; position:relative;">
			<table class="h-table">
				<tr>
				<td width="110" align="right">账号：</td>
				<td>
					<input id="search_account_no" style="width:98%;" type="text" name="accountNo" value="${param.accountNo}"/>
				</td>
				<td width="110" align="right">账户名称：</td>
				<td>
					<input  style="width:98%;" type="text" name="accountName" value="${param.accountName}"/>
				</td>
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
			<shiro:hasPermission name="Account:save">
				<li><a iconClass="page_add" target="dialog" mask="true" width="550" height="350" rel="Account_save" href="${contextPath }/management/system/account/create"><span>添加账户</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="Account:edit">
				<li><a iconClass="page_edit" target="selectedOne" mask="true" width="550" height="350"  rel="ids" href="${contextPath }/management/system/account/update"><span>编辑账户信息</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="Account:delete">
				<li><a iconClass="page_delete" target="selectedTodo" rel="ids" href="${contextPath }/management/system/account/delete" title="确认要删除选中账户?"><span>删除账户</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>
	<table class="table" layoutH="125" width="100%">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="ids" class="checkboxCtrl"></th>
				<th width="150">账号</th>
				<th width="150">账户名称</th>
				<th>银行</th>
				<th>所属机构</th>
				<th width="150">业务系统</th>
				<th width="150">关联业务</th>
				<th width="130" orderField="createdTime" class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}"   >创建时间</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${accounts}" varStatus="var">
			<tr target="slt_accountid" rel="${item.id}">
				<td align="center">${var.count}</td>
				<td><input type="checkbox"  name="ids" value="${item.id}" ></td>
				<td>${item.accountNo}</td>
				<td>${item.accountName}</td>
				<td>${item.bank.bankName}</td>
				<td>${item.organization.name}</td>
				<td>${item.business.supportSystem.systemName}</td>	
				<td>${item.business.businessName}</td>	
				<td><fmt:formatDate value="${item.createdTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
			</tr>
			</c:forEach>
		</tbody>
	</table>
	<!-- 分页 -->
	<dwz:pagination page="${page }"/>
</div>
