<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%@page import="java.util.Date"%>
<script type="text/javascript">
$("#MernoBizlist_BusinessId").remoteChained("#MernoBizlist_SystemId", "${contextPath }/management/system/business/select");

$(document).ready(function(){
		$('#serch_MernoBiz_merno').autocomplete({
			serviceUrl: '${contextPath }/management/security/externalMerno/getExternal_merno'
		});
		$('#serch_MernoBiz_mername').autocomplete({
			serviceUrl: '${contextPath }/management/security/externalMerno/getExternal_merName',
		});
});
</script>
<dwz:paginationForm
	action="${contextPath }/management/security/externalMernoBiz/list" page="${page }">
	<input type="hidden" name="MernoBiz_merno" value="${MernoBiz_merno }"/>
	<input type="hidden" name="MernoBiz_mername" value="${MernoBiz_mername }"/>
	<input type="hidden" name="MernoBizlist_OrgCode" value="${MernoBizlist_OrgCode }"/>
	<input type="hidden" name="systemId" value="${system_Id }"/>
	<input type="hidden" name="MernoBizlist_BusinessId" value="${MernoBizlist_BusinessId }"/>
</dwz:paginationForm>

<form method="post" id="externalMernoBiz_form" action="${contextPath }/management/security/externalMernoBiz/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style="height:auto; width:90%; position:relative;">
			<table class="h-table">
				<tr>
					<td width="110" align="right">业务系统：</td>
					<td> 
						<select id="MernoBizlist_SystemId"  name="systemId"  style="width:98%;"  class="re_select"     >
							<option value="0" selected="selected">--请选择系统--</option>
							<c:forEach items="${supportSystems}" var="supp">
								<option value="${supp.id}" <c:if test="${MernoBizlist_SystemId eq supp.id }">selected</c:if>
								>${supp.systemName }</option>
							</c:forEach>
						</select>
					</td>
					<td width="110" align="right">业务种类：</td>
					<td>
						<select style="width:98%;"  class="re_select " name="MernoBizlist_BusinessId"  id="MernoBizlist_BusinessId"  >
							<option value="0">--请选择业务--</option>
							<c:forEach items="${businessInfos}" var="bus">
								<option value="${bus.id}" <c:if test="${MernoBizlist_BusinessId eq bus.id}">selected="selected"</c:if>
								>${bus.businessName }</option>
							</c:forEach>
						</select>
					</td>
					<td width="110" align="right">机构组织：</td>
					<td>
						<select class="re_select" name="MernoBizlist_OrgCode"  >
						<option value="0" selected="selected">--请选择机构--</option>
							<c:forEach var="item" items="${organizations}">
								<option value="${item.code }"
								<c:if test="${MernoBizlist_OrgCode eq item.code}">
									selected="selected" 
								</c:if>
								>${item.name }</option>
							</c:forEach>
						</select>
					</td>
				</tr>
				<tr>
					<td width="110" align="right">外部商户编号：</td>
					<td>
						<input id="serch_MernoBiz_merno" style="width:95.5%;" type="text" name="MernoBiz_merno" maxlength="15" data-prompt-position="buttomRight" value="${MernoBiz_merno}"/>
					</td>
					<td width="110" align="right">外部商户名称：</td>
					<td>
						<input id="serch_MernoBiz_mername" style="width:95.5%;" type="text" name="MernoBiz_mername" maxlength="200" data-prompt-position="buttomRight" value="${MernoBiz_mername}"/>
					</td>
					<td colspan="2"></td>
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
			<shiro:hasPermission name="ExternalTerminalno:save">
				<li><a iconClass="book_add" target="dialog"  mask="true" width="700" height="600" href="${contextPath }/management/security/externalMernoBiz/getExternalMernoList"><span>业务商户关联管理</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>

	<table class="table" layoutH="145" width="100%">
		<thead>
			<tr>
				<th width="10">序号</th>
				<th width="100">业务种类</th>
				<th width="100">外部商户号</th>
				<th width="100">外部商户名称</th>
				<th width="100">组织机构</th>
				<th width="100">创建时间</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${ExternalMernoBizs}" varStatus="var">
				 <tr target="slt_uid" rel="${item.id}">
					<td align="center">${var.count}</td>
					 <td>${item.businessId.businessName}</td>
					<td>${item.externalMernoId.merno}</td>
					<td>${item.externalMernoId.merName}</td>
					<td>${item.externalMernoId.organization.name}</td>
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