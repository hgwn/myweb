<%@page import="com.rongbang.utils.PlatformConstants"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@page import="java.util.Date"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<div class="pageContent">
	
	<table class="table tabletest" layoutH="45" width="3180" targetType="dialog">
		<thead>
			<tr>
				<th width="120">参考号</th>
				<th width="70">交易类型</th>
				<th width="100">交易金额(元)</th>
				<th width="80">交易状态</th>
				<th width="80">成功标识</th>
				<th width="130">交易日期</th>
				<th width="80">对账状态</th>
				<th width="70">卡类型</th>
				<th width="160">卡号</th>	
				<th width="125">内部商户编号</th>			
				<th width="125">内部终端编号</th>	
				<th width="80">内部批次号</th>
				<th width="80">内部流水号</th>	
				<th width="80">外部批次号</th>
				<th width="80">外部流水号</th>	
				<th width="80">原内部批次号</th>
				<th width="100">原内部流水号</th>
				<th width="70">授权码</th>
				<th width="140">业务系统</th>
				<th width="110">业务种类</th>
				<th width="100">业务系统订单号</th>
				<th width="160">卡支付系统订单号</th>
				<th width="150">省公司</th>
				<th width="180">市公司</th>
				<th width="180">区县公司</th>
				<th width="220">网点</th>
				<th width="150" orderField="insertTime" class="${page.orderField eq 'insertTime' ? page.orderDirection : ''}" >创建时间</th>
			</tr>
		</thead>
		<tbody>
		<c:choose>
		<c:when test="${isHistory eq 'no'}"><%--今天数据 --%>
			<c:forEach var="pay" items="${paymentWaters}">
			<tr target="pay_id" rel="${pay.id}">
				<td>${pay.refNo }</td>
				<td><dwz:dicItem displayOnly="true" themeName="payment_transId" selectedValue="${pay.transId }"  /> </td>
				<td><fmt:formatNumber value="${pay.money }" pattern="##,###,##0.00"/></td>
				<td><dwz:dicItem displayOnly="true" themeName="payment_transStatus" selectedValue="${pay.transStatus }"  /> </td>
				<td><dwz:dicItem displayOnly="true" themeName="payment_transCode" selectedValue="${pay.transCode }"  /> </td>
				<td><fmt:formatDate value="${pay.transTime }" pattern="yyyy-MM-dd"/></td>
				<td><dwz:dataConvert  name="convertDzFlag"  dataValue="${pay.dzFlag}" /></td>
				<td><dwz:dicItem themeName="card_type" displayOnly="true" selectedValue="${pay.cardType}" /> </td>
				<td>${pay.cardNo }</td>	
				<td>${pay.merchNo}</td>			
				<td>${pay.termNo}</td>
				<td>${pay.batchNo }</td>
				<td>${pay.transNo }</td>
				<td>${pay.bankBatchNo }</td>
				<td>${pay.bankTransNo }</td>
				<td>${pay.oldbatchNo }</td>
				<td>${pay.oldtransNo }</td>
				<td>${pay.authId }</td>
				<td>${pay.order.supportSystem.systemName}</td>
				<td>${pay.order.business.businessName}</td>
				<td>${pay.bizOrderId}</td>
				<td>${pay.order.cpsOrderId }</td>
				<td>${pay.order.orgFull.provinceOrg.name}</td>
				<td>${pay.order.orgFull.cityOrg.name}</td>
				<td>${pay.order.orgFull.countryOrg.name}</td>
				<td>${pay.order.orgFull.siteOrg.name}</td>
				<td><fmt:formatDate value="${pay.insertTime }" pattern="yyyy-MM-dd HH:mm:ss"/></td>
			</tr>			
			</c:forEach>
			</c:when>
			<c:otherwise><%--历史数据 --%>
				<c:forEach var="pay" items="${paymentWaterHistorys}">
				<tr target="pay_id" rel="${pay.id}">
					<td>${pay.refNo }</td>
					<td><dwz:dicItem displayOnly="true" themeName="payment_transId" selectedValue="${pay.transId }"  /> </td>
					<td><fmt:formatNumber value="${pay.money }" pattern="##,###,##0.00"/></td>
					<td><dwz:dicItem displayOnly="true" themeName="payment_transStatus" selectedValue="${pay.transStatus }"  /> </td>
					<td><dwz:dicItem displayOnly="true" themeName="payment_transCode" selectedValue="${pay.transCode }"  /> </td>
					<td><fmt:formatDate value="${pay.transTime }" pattern="yyyy-MM-dd"/></td>
					<td><dwz:dataConvert  name="convertDzFlag"  dataValue="${pay.dzFlag}" /></td>
					<td><dwz:dicItem themeName="card_type" displayOnly="true" selectedValue="${pay.cardType}" /> </td>
					<td>${pay.cardNo }</td>
					<td>${pay.merchNo}</td>			
					<td>${pay.termNo}</td>
					<td>${pay.batchNo }</td>
					<td>${pay.transNo }</td>
					<td>${pay.bankBatchNo }</td>
					<td>${pay.bankTransNo }</td>
					<td>${pay.oldbatchNo }</td>
					<td>${pay.oldtransNo }</td>
					<td>${pay.authId }</td>
					<td>${pay.order.supportSystem.systemName}</td>
					<td>${pay.order.business.businessName}</td>
					<td>${pay.bizOrderId}</td>
					<td>${pay.order.cpsOrderId }</td>
					<td>${pay.order.orgFull.provinceOrg.name}</td>
					<td>${pay.order.orgFull.cityOrg.name}</td>
					<td>${pay.order.orgFull.countryOrg.name}</td>
					<td>${pay.order.orgFull.siteOrg.name}</td>
					<td><fmt:formatDate value="${pay.insertTime }" pattern="yyyy-MM-dd HH:mm:ss"/></td>
				</tr>			
				</c:forEach>
			</c:otherwise>
		</c:choose>
		</tbody>
	</table>
	<c:if test="${empty paymentWaterHistorys && empty paymentWaters}">
			  <div class="re_tips">没有搜到符合您条件的数据！</div>
	</c:if>
	<!-- 分页 -->
	<%--<dwz:pagination targetType="dialog" page="${payment_page }" onchange="dialogPageBreak({numPerPage:this.value})"/>
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button class="close" type="button">关闭</button></div></div></li>
		</ul>
	</div>	
	--%>
</div>
