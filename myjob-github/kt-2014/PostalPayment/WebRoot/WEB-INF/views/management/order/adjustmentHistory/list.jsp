<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<style>
li#list_history.hover2 span{ color:#02837e; font-weight:bold;}
</style>
<div class="pageContent">
<div class="panelBar">
		<ul class="toolBar" >
			<shiro:hasPermission name="PaymentError:adjust">
				<li>
					<a iconClass="zoom" target="dialog" rel="lookup2organization_edit" mask="true" width="530" height="350" href="${contextPath }/management/order/paymentError/view/${paymentErrorId}"><span style="color:#999;">查看详情</span></a>
				</li>
				<li id="list_history" class="hover2">
					<a iconClass="zoom_out" target="dialog" rel="lookup2organization_edit" mask="true" width="530" height="350" href="${contextPath }/management/order/adjustmentHistory/list/${paymentErrorId}"><span>调账历史</span></a>
				</li>
		</shiro:hasPermission>
		</ul>
	</div>
<table class="table" layoutH="85" width="620">
		<thead>
			<tr>
				<th width="100">调账状态</th>
				<th width="120">标识是否需要清分</th>
				<th width="80">调账人</th>
				<th width="200">调帐备注</th>
				<th width="150">调账时间</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="adjustmentHistory" items="${list}">
			<tr target="adjustmentHistory_id" rel="${adjustmentHistory.id}">
				<td>
					<dwz:dicItem themeName="tzStatus" selectedValue="${adjustmentHistory.tzStatus}" displayOnly="true"/>
				</td>
				<td>${adjustmentHistory.tzClearing eq "Y" ? "是":"否"}</td>
				<td>${adjustmentHistory.tzUser}</td>
				<td>${adjustmentHistory.tzRemark}</td>
				<td><fmt:formatDate value='${adjustmentHistory.tzTime}' pattern='yyyy-MM-dd HH:mm:ss' /></td>
			</tr>			
			</c:forEach>
		</tbody>
	</table>
	<c:if test="${empty list}">
		    	<div class="re_tips">没有搜到符合您条件的数据！</div>
   	</c:if>
</div>
