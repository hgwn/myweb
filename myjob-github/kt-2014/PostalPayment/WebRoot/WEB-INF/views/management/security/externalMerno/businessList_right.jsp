<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@page import="java.util.Date"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<link href="${contextPath}/styles/jquery/css/autoComplete.css" rel="stylesheet" type="text/css" />
<script type="text/javascript">
function getbusinessList_right(){
	$("#businessListRight_jsp").loadUrl("${contextPath }/management/security/externalMerno/rightChange", {},function(){
		$("#businessListRight_jsp .gridScroller").css({"height":"210px"});
	});
	$("#business_table_right .gridScroller").css("height","210px");
}
</script>
<div id="businessListRight_jsp">
	<p style="margin:5px auto 0; border-bottom:1px solid #ddd; padding-left:8px; color:#666;">提示：黑色为已生效的选择；灰色为未生效的选择
</p>
	<table class="table" layoutH="301" width="360">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="ids2" class="checkboxCtrl"></th>			
				<th width="200">业务系统</th>
				<th width="100">业务种类</th>
				<th width="80">业务代码</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${bList_right1}" varStatus="var">
				<tr target="slt_uid" rel="${item.id}">
						<td align="center">${var.count}</td>
						<td><input name="ids2" value="${item.id}" type="checkbox"></td>
						<td>${item.supportSystem.systemName}</td>
						<td>${item.businessName}</td>
						<td>${item.businessCode}</td>
				</tr>			
			</c:forEach>
			<c:forEach var="item" items="${bList_right2}"  varStatus="var">
				<tr target="slt_uid" rel="${item.id}" class="businessList-right-tipcolor">
						<td align="center">${var.count+right1Size}</td>
						<td><input name="ids2" value="${item.id}" type="checkbox"></td>
						<td>${item.supportSystem.systemName}</td>
						<td>${item.businessName}</td>
						<td>${item.businessCode}</td>
				</tr>			
			</c:forEach>
		</tbody>
	</table>
</div>