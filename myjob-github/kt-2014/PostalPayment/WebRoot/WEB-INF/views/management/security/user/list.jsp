<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"
	trimDirectiveWhitespaces="true"%>
<%@page import="java.util.Date"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<style>
@media screen and (max-width:1024px){
	table#h-userlist-table.table{ min-width: 1162px!important; overflow-x: scroll; }
	table#h-userlist-table.table .h-userlist-th {width: 340px!important;}
}
@media screen and (min-width:1360px){
	table#h-userlist-table.table{ width: 100%!important;}
	table#h-userlist-table.table .h-userlist-th {width:auto;}
}
</style>
<script type="text/javascript">
$(function(){
	lookup_cleanbtn("userForm");
	if($("#userForm [name='organization.name']").val()==''){
		$("#userForm .h-cleanBtn").css("display","none");
	}
});
$(document).ready(function(){
	$('#orgName').autocomplete({
		serviceUrl: '${contextPath }/management/security/organization/getOrgName',
		onSelect: function (suggestion) {
        	var data = suggestion.data ;
 			$("#orgCode").val(data);
     	},
     	onSearchStart: function (query) {
		 	$("#orgCode").val("");
 	 	},
     	onSearchComplete: function (query) {
	 		$("#orgCode").val("");
 	  	}
	});
});
</script>
<dwz:paginationForm
	action="${contextPath }/management/security/user/list" page="${page }">
	<input type="hidden" name="search_LIKE_username"
		value="${param.search_LIKE_username }" />
	<input type="hidden" name="search_LIKE_realname"
		value="${param.search_LIKE_realname }" />
	<input name="organization.code" type="hidden" value="${orgCode}"/>
	<input name="organization.name" type="hidden" value="${orgName}"/>
	<input name="organization.orgLevel" type="hidden" value="${orgLevel}"/>
	<input name="search_EQ_status" type="hidden" value="${search_EQ_status}"/>
</dwz:paginationForm>

<form id="userForm" method="post"
	action="${contextPath }/management/security/user/list"
	onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style="height:auto; width:90%; position:relative;">
			<table class="h-table">
				<tr>
					<td width="110" align="right">登录名称：</td> 
					<td><input style="width:95%;" type="text"
						name="search_LIKE_username" value="${param.search_LIKE_username }" maxlength="20"/>
					</td>
					<td width="110" align="right">姓名：</td> 
					<td><input style="width:95%;" type="text"
						name="search_LIKE_realname" value="${param.search_LIKE_realname }" maxlength="20" />
					</td>
					<td width="110" align="right">所在机构：</td>
					<td style="position:relative;">
						<a class="h-cleanBtn" title="清空" style="right:10px;">X</a>
						<input name="organization.code" id="orgCode" type="hidden" value="${orgCode}"/>
						<input style="width:95%;" class=" textInput" type="text" id="orgName" name="organization.name"  value="${orgName}"/>
					</td>
					<td width="50">
						<a class="btnLook" lookupgroup="organization" href="${contextPath }/management/security/organization/lookup2org/userForm?selectAll=true&permissionKey=<%=com.rongbang.utils.PlatformConstants.PERMISSION_USER_LIST %>" width="400">选择组织机构</a>
					</td>
				</tr>
				<tr>
					<td width="110" align="right">角色：</td> 
					<td>
						<select  id="roleId" name="roleId" class="re_select" style="width:98%;">
							<option value="">--请选择--</option>
							<c:forEach items="${listRole }" var="item">
								<option value="${item.id }" <c:if test="${param.roleId==item.id }">selected</c:if>>${item.name }</option>
							</c:forEach>
						</select>
					</td>
					<td width="110" align="right">用户状态：</td> 
					<td>
						<select  id="search_EQ_status" name="search_EQ_status" class="re_select">
							<option value="">--全部--</option>
							<option value="E" <c:if test="${param.search_EQ_status=='E' }">selected</c:if>>可用</option>
							<option value="D" <c:if test="${param.search_EQ_status=='D' }">selected</c:if>>停用</option>
						</select>
					</td>
					<td colspan="3"></td>
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
			<shiro:hasPermission name="User:save">
				<li><a iconClass="user_add" target="dialog"
					rel="lookup2organization_add" mask="true" width="550" height="380"
					href="${contextPath }/management/security/user/create"><span>添加用户</span>
				</a>
				</li>
			</shiro:hasPermission>
			<shiro:hasPermission name="User:edit">
				<li><a iconClass="user_edit" target="selectedOne"
					rel="ids" mask="true" width="550" height="350"
					href="${contextPath }/management/security/user/update"><span>编辑用户</span>
				</a>
				</li>
			</shiro:hasPermission>
			<shiro:hasPermission name="User:delete">
				<li><a iconClass="user_delete" target="selectedTodo" rel="ids"
					href="${contextPath }/management/security/user/delete"
					title="确认要删除?"><span>删除用户</span>
				</a>
				</li>
			</shiro:hasPermission>
			<shiro:hasPermission name="User:reset">
				<li class="line">line</li>
				<li><a iconClass="arrow_refresh" target="selectedAjax" rel="ids"
					href="${contextPath }/management/security/user/reset/password"
					title="确认重置密码为123456?"><span>重置密码</span>
				</a>
			</shiro:hasPermission>
			<shiro:hasPermission name="User:disable">
				<li><a iconClass="lock" target="selectedTodo" href="${contextPath }/management/security/user/disable" rel="ids" title="确认要停用吗?"><span>停用用户</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="User:enable">
				<li><a iconClass="lock_open" target="selectedTodo" href="${contextPath }/management/security/user/enable" rel="ids" title="确认要启用吗?"><span>启用用户</span></a></li>
			</shiro:hasPermission>	
			<shiro:hasPermission name="User:assign">
				<li class="line">line</li>
				<li><a iconClass="shield_add" rel="ids"  target="selectedOne" mask="true"
					width="400" height="500"
					href="${contextPath }/management/security/user/lookup2create/userRole"><span>分配角色</span>
				</a>
				</li>
				<li><a iconClass="shield_delete" rel="ids" target="selectedOne" mask="true"
					width="400" height="500"
					href="${contextPath }/management/security/user/lookup2delete/userRole"><span>撤销角色</span>
				</a>
				</li>
			</shiro:hasPermission>
		</ul>
	</div>

	<table id="h-userlist-table" class="table" layoutH="145" width="100%">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="ids"
					class="checkboxCtrl">
				</th>
				<th width="100" orderField="username"
					class="${page.orderField eq 'username' ? page.orderDirection : ''}">登录名称</th>
				<th width="100" orderField="realname"
					class="${page.orderField eq 'realname' ? page.orderDirection : ''}">姓名</th>
				<th width="160">身份证号</th>
				<th width="100">电话</th>
				<th width="150" orderField=organization.name
					class="${page.orderField eq 'organization.name' ? page.orderDirection : ''}">所在机构</th>
				<th class="h-userlist-th" orderField="userRoles"
					class="${page.orderField eq 'userRoles' ? page.orderDirection : ''}">角色</th>
				<th width="60" orderField="status"
					class="${page.orderField eq 'status' ? page.orderDirection : ''}">用户状态</th>
				<th width="130" orderField="createdTime"
					class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}">创建时间</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${users}" varStatus="var">
				<tr target="slt_uid" rel="${item.id}">
					<td align="center">${var.count}</td>
					<td><input name="ids" value="${item.id}" type="checkbox">
					</td>
					<td>${item.username}</td>
					<td>${item.realname}</td>
					<td>${item.idCardNo}</td>
					<td>${item.phone}</td>
					<td>${item.organization.name}</td>
					<td><c:forEach var="ur" items="${item.userRoles }">
						${ur.role.name }&nbsp;&nbsp;
					</c:forEach></td>
					<td>${item.status == "E" ? "可用":"停用"}</td>
					<td><fmt:formatDate value="${item.createdTime}"
							pattern="yyyy-MM-dd HH:mm:ss" />
					</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	<!-- 分页 -->
	<dwz:pagination page="${page }" />
</div>