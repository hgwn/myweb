<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@page import="java.util.Date"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<link href="${contextPath}/styles/jquery/css/autoComplete.css" rel="stylesheet" type="text/css" />
<script type="text/javascript">
function getbusinessList(){
	var lookup_systemId=$("#lookup_business_SystemId").val();
	$("#businessList_jsp").loadUrl("${contextPath }/management/security/externalMerno/leftChange", {"systemId":lookup_systemId},function(){
		$("#businessList_jsp .gridScroller").css({"height":"210px"});
	});
}
</script>
<div id="businessList_jsp">
	<p style="margin:5px auto 0; border-bottom:1px solid #ddd; padding-left:10px;">
	<span class="fl" style="line-height:23px; padding:0 5px;">业务系统：</span>
	<select id="lookup_business_SystemId"  name="systemId"  style="width:240px;" onchange="getbusinessList();">
					<option value="0" selected="selected">--请选择系统--</option>
					<c:forEach items="${supportSystems}" var="supp">
						<option value="${supp.id}" <c:if test="${MernoBizlist_SystemId eq supp.id }">selected</c:if>
						>${supp.systemName }</option>
					</c:forEach>
	</select>
	</p>
	<table class="table" layoutH="301" width="360">
			<thead>
				<tr>
					<th width="30">序号</th>
					<th width="22"><input type="checkbox" group="ids1" class="checkboxCtrl"></th>			
					<th width="140">业务系统</th>
					<th width="100">业务种类</th>
					<th width="80">业务代码</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="item" items="${bList_left}" varStatus="var">
					<tr target="slt_uid" rel="${item.id}">
						<td align="center">${var.count}</td>
						<td><input name="ids1" value="${item.id}" type="checkbox"></td>
						<td>${item.supportSystem.systemName}</td>
						<td>${item.businessName}</td>
						<td>${item.businessCode}</td>
						
					</tr>		
				</c:forEach>
			</tbody>
	</table>	
</div>