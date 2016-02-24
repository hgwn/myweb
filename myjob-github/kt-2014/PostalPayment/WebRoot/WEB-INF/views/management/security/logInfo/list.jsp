<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@page import="java.util.Date"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<dwz:paginationForm action="${contextPath }/management/security/logInfo/list" page="${page }">
	<input type="hidden" name="search_EQ_username" value="${param.search_EQ_username }"/>
	<input type="hidden" name="search_EQ_ipAddress" value="${param.search_EQ_ipAddress }"/>
	<input type="hidden" name="search_EQ_logLevel" value="${param.search_EQ_logLevel }"/>
	<input type="hidden" name="search_GTE_createTime" value="${param.search_GTE_createTime}"/>
	<input type="hidden" name="endTime" value="${param.endTime}"/>
</dwz:paginationForm>

<form method="post" action="${contextPath}/management/security/logInfo/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style="height:auto; width:90%; position:relative;">
			<table class="h-table">
				<tr>
				<td width="110" align="right">登录名称：</td>
				<td>
					<input style="width:95%;" type="text" name="search_EQ_username" value="${param.search_EQ_username }" maxlength="20"/>
				</td>	
				<td width="110" align="right">登录IP：</td>
				<td>
					<input style="width:95%;" type="text" name="search_EQ_ipAddress" value="${param.search_EQ_ipAddress }" maxlength="30"/>
				</td>
				<td width="110" align="right">日志等级：</td>
				<td>
					<select name="search_EQ_logLevel" style="width:95%; height:22px;">
						<option value="">所有</option>
						<option value="TRACE" ${param.search_EQ_logLevel == 'TRACE' ? 'selected="selected"':'' }>TRACE</option>
						<option value="DEBUG" ${param.search_EQ_logLevel == 'DEBUG' ? 'selected="selected"':'' }>DEBUG</option>
						<option value="INFO" ${param.search_EQ_logLevel == 'INFO' ? 'selected="selected"':'' }>INFO</option>
						<option value="WARN" ${param.search_EQ_logLevel == 'WARN' ? 'selected="selected"':'' }>WARN</option>
						<option value="ERROR" ${param.search_EQ_logLevel == 'ERROR' ? 'selected="selected"':'' }>ERROR</option>
					</select>
				</td>
				</tr>
				<tr>
				<td width="110" align="right">日志开始时间：</td>
				<td>
				<div style="width:98%; position:relative;">
					<input type="text" name="search_GTE_createTime" class="date" readonly="readonly" style="float:left; width:95%;" value="${param.search_GTE_createTime}"/>
					<a class="inputDateButton" href="javascript:;" style="position:absolute; right:-1px; top:0;">选择</a>
				</div>	
				</td>			
				<td width="110" align="right">日志结束时间：</td>
				<td>
				<div style="width:98%; position:relative;">
					<input type="text" name="endTime" class="date" readonly="readonly" style="float:left; width:95%;" value="${param.endTime}"/>
					<a class="inputDateButton" href="javascript:;" style="position:absolute; right:-1px; top:0;">选择</a>
				</div>	
				</td>
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
			<shiro:hasPermission name="LogInfo:delete">
				<li><a class="delete" target="selectedTodo" rel="ids" href="${contextPath}/management/security/logInfo/delete" title="确认要删除?"><span>删除日志</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>
	
	<table class="table" layoutH="146" width="100%">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="ids" class="checkboxCtrl"></th>
				<th width="100">登录名称</th>
				<th width="100">登录IP</th>
				<th width="100" orderField="logLevel" class="${page.orderField eq 'logLevel' ? page.orderDirection : ''}">日志等级</th>
				<th >日志内容</th>
				<th width="130" orderField="createTime" class="${page.orderField eq 'createTime' ? page.orderDirection : ''}">创建时间</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${logInfos}" varStatus="var">
			<tr target="slt_uid" rel="${item.id}">
				<td align="center">${var.count}</td>
				<td><input name="ids" value="${item.id}" type="checkbox"></td>
				<td>${item.username}</td>
				<td>${item.ipAddress}</td>
				<td>${item.logLevel}</td>
				<td>${item.message}</td>
				<td><fmt:formatDate value="${item.createTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
			</tr>			
			</c:forEach>
		</tbody>
	</table>
	<!-- 分页 -->
	<dwz:pagination page="${page }"/>
</div>