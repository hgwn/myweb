<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@page import="java.util.Date"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>


<div class="pageContent">
	<table class="table" layoutH="55" width="2846">
		<thead>
			<tr>
				<th width="160">卡支付系统订单号</th>	
				<th width="131">业务订单号</th>
				<th width="140">业务系统</th>
				<th width="110">业务种类</th>
				<th width="100">订单类型</th>	
				<th width="90">订单状态</th>	
				<th width="135">业务订单总金额(元)</th>
				<th width="110">订单金额(元)</th>
				<th width="110">实际刷卡金额(元)</th>
				<th width="100">相关支付流水</th>
				<th width="110">相关撤销订单</th>	
				<th width="110">相关退货订单</th>
				<th width="125">外部商户编号</th>
				<th width="125">外部终端编号</th>
				<th width="125">内部商户编号</th>
				<th width="125">内部终端编号</th>			
				<th width="150">省公司</th>
				<th width="180">市公司</th>
				<th width="180">区县公司</th>
				<th width="220">网点</th>
				<th width="70">业务员</th>
				<th width="140" orderField="submitTime" class="${page.orderField eq 'submitTime' ? page.orderDirection : ''}">创建时间</th>
			</tr>
		</thead>
		<tbody>
		<c:choose>
			<c:when test="${order_isToday eq '1'}">
			<c:forEach var="item" items="${orders}"><%--今天数据 --%>
			<tr target="slt_uid" rel="${item.cpsOrderId}">
				<td>${item.cpsOrderId}</td>
				<td>${item.bizOrderId}</td>
				<td>${item.supportSystem.systemName}</td>
				<td>${item.business.businessName}</td>
				<td>
					<font color="<c:if test="${item.orderType=='R' }">red</c:if><c:if test="${item.orderType=='C' }">pink</c:if>">
						<dwz:dataConvert name="convertOrderType" dataValue="${item.orderType}"/>
					</font>
				</td>
				<td><dwz:dicItem displayOnly="true" themeName="order_status" selectedValue="${item.status}"  /> </td>
				<td align="right"><fmt:formatNumber value="${item.bizMoney}" pattern="##,###,##0.00"/></td>
				<td align="right"><fmt:formatNumber value="${item.money}" pattern="##,###,##0.00"/></td>
				<td align="right"><fmt:formatNumber value="${item.actuallyMoney}" pattern="##,###,##0.00"/></td>
				<td><c:if test="${item.haveLiuShui eq '1'}"><a iconClass="book_open" href="${contextPath }/management/order/paymentWater/findPaymentWater/today/${item.cpsOrderId}"  target="dialog"  mask="true"  width="1025"  height="456"   rel="window_paymentWater" title="查询相关支付流水" fresh="false">查询相关支付流水</a></c:if></td>
				<td><c:if test="${item.haveCeXiao eq '1'}"><a iconClass="book_open" href="${contextPath }/management/order/orderList/today/C/${item.cpsOrderId}" target="dialog"  mask="true"  width="1025"  height="456"   rel="order_cancel" title="查询相关撤销订单" fresh="false">查询相关撤销订单</a></c:if></td>
				<td><c:if test="${item.haveTuiHuo eq '1'}"><a iconClass="book_open" href="${contextPath }/management/order/orderList/today/R/${item.cpsOrderId}" target="dialog"  mask="true"  width="1025"  height="456"   rel="order_return" title="查询相关退货订单" fresh="false">查询相关退货订单</a></c:if></td>
				<td>${item.actualMerchno}</td>
				<td>${item.actualTermno}</td>
				<td>${item.internalMerchno}</td>
				<td>${item.internalTermno}</td>
				<td>${item.orgFull.provinceOrg.name}</td>
				<td>${item.orgFull.cityOrg.name}</td>
				<td>${item.orgFull.countryOrg.name}</td>
				<td>${item.orgFull.siteOrg.name}</td>
				<td>${item.clerkName}</td>
				<td><fmt:formatDate value="${item.submitTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
			</tr>			
			</c:forEach>
			</c:when>
			<c:otherwise><%--历史数据 --%>
			<c:forEach var="item" items="${orderHistorys}">
			<tr target="slt_uid" rel="${item.cpsOrderId}">
				<td>${item.cpsOrderId}</td>
				<td>${item.bizOrderId}</td>
				<td>${item.supportSystem.systemName}</td>
				<td>${item.business.businessName}</td>
				<td>
					<font color="<c:if test="${item.orderType=='R' }">red</c:if><c:if test="${item.orderType=='C' }">pink</c:if>">
						<dwz:dataConvert name="convertOrderType" dataValue="${item.orderType}"/>
					</font>
				</td>
				<td><dwz:dicItem displayOnly="true" themeName="order_status" selectedValue="${item.status}"  /> </td>
				<td align="right"><fmt:formatNumber value="${item.bizMoney}" pattern="##,###,##0.00"/></td>
				<td align="right"><fmt:formatNumber value="${item.money}" pattern="##,###,##0.00"/></td>
				<td align="right"><fmt:formatNumber value="${item.actuallyMoney}" pattern="##,###,##0.00"/></td>
				<td><c:if test="${item.haveLiuShui eq '1'}"><a iconClass="book_open" href="${contextPath }/management/order/paymentWater/findPaymentWater/old/${item.cpsOrderId}"  target="dialog"  mask="true"  width="1025"  height="456"   rel="window_paymentWater" title="查询相关支付流水" fresh="false">查询相关支付流水</a></c:if></td>
				<td><c:if test="${item.haveCeXiao eq '1'}"><a iconClass="book_open" href="${contextPath }/management/order/orderList/old/C/${item.cpsOrderId}" target="dialog"  mask="true"  width="1025"  height="456"   rel="order_cancel" title="查询相关撤销订单" fresh="false">查询相关撤销订单</a></c:if></td>
				<td><c:if test="${item.haveTuiHuo eq '1'}"><a iconClass="book_open" href="${contextPath }/management/order/orderList/old/R/${item.cpsOrderId}" target="dialog"  mask="true"  width="1025"  height="456"   rel="order_return" title="查询相关退货订单" fresh="false">查询相关退货订单</a></c:if></td>
				<td>${item.actualMerchno}</td>
				<td>${item.actualTermno}</td>
				<td>${item.internalMerchno}</td>
				<td>${item.internalTermno}</td>
				<td>${item.orgFull.provinceOrg.name}</td>
				<td>${item.orgFull.cityOrg.name}</td>
				<td>${item.orgFull.countryOrg.name}</td>
				<td>${item.orgFull.siteOrg.name}</td>
				<td>${item.clerkName}</td>
				<td><fmt:formatDate value="${item.submitTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
			</tr>			
			</c:forEach>
			</c:otherwise>
		</c:choose>
		</tbody>
	</table>
	<c:if test="${page.totalCount eq 0 }">
		    	<div class="re_tips">没有搜到符合您条件的数据！</div>
   	</c:if>
</div>