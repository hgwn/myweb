<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@page import="java.util.Date"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
	/*
	*/
$(document).ready(function(){
	$("#cpsOrderId_orderList").autocomplete({
		serviceUrl: '${contextPath }/management/order/getCpsOrderId',
		params : {isToday : function() {
			if(	$("#order_isToday").attr("checked")=="checked"){ 
				return 	$("#order_isToday").val();
			}else{
				return '2';
			}
		}}
	});
	$("#bizOrderId_orderList").autocomplete({
		serviceUrl: '${contextPath }/management/order/getBizOrderId',
		params : {isToday : function() {
			if(	$("#order_isToday").attr("checked")=="checked"){ 
				return 	$("#order_isToday").val();
				}
			else{return '2';}
		}}
	});
	
	//网点输入自动补全22222
	$('#orgName_orderList').autocomplete({
		serviceUrl: '${contextPath }/management/security/organization/getOrgName?onlySite=true',
 		onSelect: function (suggestion) {
        	var data = suggestion.data ;
 			$("#orgCode_orderList").val(data);
     	},
     	onSearchStart: function (query) {
		 	$("#orgCode_orderList").val("");
	 	 	},
     	onSearchComplete: function (query) {
	 		$("#orgCode_orderList").val("");
 	  	}
	});
});

	
	$("#businessId_2").remoteChained("#systemId_2", "${contextPath }/management/order/getBusiness");
	
 	exportOrderExcel = function(cp){
		$("#currentPage").val(cp);
		$("#exportForm").submit();
	}
	
	$("#order_sub").click(function(){
	   var  order_begin_time =	$("#order_begin_time").val();
	   var  order_end_time 	=	$("#order_end_time").val();
	
	   if(parseInt(order_gapDay)<0){
			alertMsg.info("开始日期不能大于结束日期，请重新选择！");
			return false;
		}
	});
			
	var order_begin_time ;
	var order_end_time ;
	$("#order_isToday").click(function(){
		if($(this).attr("checked")=="checked"){
			order_begin_time  = $("#order_begin_time").val() ;
			order_end_time =	$("#order_end_time").val();
			$("#order_begin_time").attr("value","");
			$("#order_end_time").attr("value","");
			$("#order_begin_time").attr("disabled","disabled");	
			$("#order_end_time").attr("disabled","disabled");
		}else{
			$("#order_begin_time").attr("value",order_begin_time);
			$("#order_end_time").attr("value",order_end_time);
			$("#order_begin_time").removeAttr("disabled");	
			$("#order_end_time").removeAttr("disabled");	
		}
	});
	$(function(){
		lookup_cleanbtn("form_order_serch");
		if($("#form_order_serch [name='organization.name']").val()==''){
			$("#form_order_serch .h-cleanBtn").css("display","none");
		}
	});
	
	if($("#order_isToday").attr("checked")=="checked"){
		order_begin_time  = $("#order_begin_time").val() ;
		order_end_time =	$("#order_end_time").val();
		$("#order_begin_time").attr("value","");
		$("#order_end_time").attr("value","");
		$("#order_begin_time").attr("disabled","disabled");	
		$("#order_end_time").attr("disabled","disabled");
	}
	
</script>

<dwz:paginationForm action="${contextPath }/management/order/orderList" page="${page }">
	<input type="hidden" name="search_EQ_cpsOrderId" value="${param.search_EQ_cpsOrderId }"/>
	<input type="hidden" name="systemId" value="${param.systemId}"/>
	<input type="hidden" name="businessId" value="${param.businessId}"/>
	<input type="hidden" name="search_EQ_bizOrderId" value="${param.search_EQ_bizOrderId}"/>
	<input type="hidden" name="search_EQ_status" value="${param.search_EQ_status}"/>
	<input type="hidden" name="search_EQ_orderType" value="${param.search_EQ_orderType }"/>
	<input type="hidden" name="gteSubmitTime" value="${gteSubmitTime}"/>
	<input type="hidden" name="lteSubmitTime" value="${lteSubmitTime}"/>
	<input name="organization.code" type="hidden" value="${orgCode}"/>
	<input name="organization.name" type="hidden" value="${orgName}"/>
	<input name="organization.orgLevel" type="hidden" value="${orgLevel}"/>
	<input type="hidden" name="onlySubstation" value="${param.onlySubstation}"/>
	<input type="hidden" name="order_isToday" value="${order_isToday}"/>
	<input type="hidden" name="order_isBegin" value="${order_isBegin}" />
</dwz:paginationForm>

<form method="post" id="exportForm" action="${contextPath }/management/order/export">
	<input type="hidden" name="search_EQ_cpsOrderId" value="${param.search_EQ_cpsOrderId }"/>
	<input type="hidden" name="systemId" value="${param.systemId}"/>
	<input type="hidden" name="businessId" value="${param.businessId}"/>
	<input type="hidden" name="search_EQ_bizOrderId" value="${param.search_EQ_bizOrderId }"/>
	<input type="hidden" name="search_EQ_orderType" value="${param.search_EQ_orderType }"/>
	<input type="hidden" name="gteSubmitTime" value="${gteSubmitTime}"/>
	<input type="hidden" name="lteSubmitTime" value="${lteSubmitTime}"/>
	<input name="organization.code" type="hidden" value="${orgCode}"/>
	<input name="organization.orgLevel" type="hidden" value="${orgLevel}"/>
	<input type="hidden" name="pageNum" value="${page.pageNum }"/>
	<input type="hidden" name="numPerPage" value="${page.numPerPage }"/>
	<input type="hidden" name="orderField" value="${page.orderField }"/>
	<input type="hidden" name="orderDirection" value="${page.orderDirection }"/>
	<input type="hidden" name="currentPage" id="currentPage" value=""/>
	<input type="hidden" name="onlySubstation" value="${param.onlySubstation }"/>
	<input type="hidden" name="order_isBegin" value="${order_isBegin}" />
	<input type="hidden" name="order_isToday" value="${order_isToday}"/>
</form>

<form id="form_order_serch" method="post" action="${contextPath }/management/order/orderList" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style="height:auto; width:100%; position:relative;">
				<table class="h-table">
				<input type="hidden" name="order_isBegin" value="${order_isBegin}" style="width:95%;" />
		<tr>
			<td width="110" align="right">卡支付系统订单号：</td>
			<td><input type="text" id="cpsOrderId_orderList" name="search_EQ_cpsOrderId" value="${param.search_EQ_cpsOrderId }" style="width:98%;" /></td>
			<td width="100">&nbsp;</td>
			<td width="90" align="right">业务系统：</td>
			<td>
				<div  style="width:98%;">
					<select  id="systemId_2" name="systemId" class="re_select">
						<option value="0">--请选择系统--</option>
						<c:forEach items="${supportSystems}" var="supp">
								<option value="${supp.id}" <c:if test="${param.systemId eq supp.id }">selected</c:if>
								>${supp.systemName }</option>
						</c:forEach>
					</select>
				</div>	
			</td>
			<td width="90" align="right">订单类型：</td>
			<td>
				<div  style="width:98%;">													  
					<dwz:dicItem  paramName="search_EQ_orderType"  className="re_select" themeName="order_type"   selectedValue="${param.search_EQ_orderType}"   valueMember="keyItem"  displayMember="item1" />
				</div>
			</td>
			<td width="100">&nbsp;</td>
		</tr>
		<tr>
			<td width="110" align="right">业务订单号：</td>
			<td><input type="text"  id="bizOrderId_orderList" name="search_EQ_bizOrderId" value="${param.search_EQ_bizOrderId}" style="width:98%;"/></td>
			<td width="100">&nbsp;</td>
			<td width="90" align="right">业务种类：</td>
			<td>
			  <div  style="width:98%;">	         
				<select id="businessId_2"  name="businessId" class="re_select">
						<option value="0">--请选择业务--</option>
						<c:forEach items="${businesses}" var="bus">
							<option value="${bus.id}" <c:if test="${param.businessId eq bus.id}">selected="selected"</c:if>
							>${bus.businessName }</option>
						</c:forEach>
				</select>
			  </div>	
			</td>
			<td width="90" align="right">订单状态：</td>
			<td>
				<div style="width:98%;">
					<dwz:dicItem   className="re_select" paramName="search_EQ_status" themeName="order_status" selectedValue="${param.search_EQ_status}"   valueMember="keyItem"   displayMember="item1" />
				</div>
			</td>
			<td width="100">&nbsp;</td>
		</tr>
		<tr>
			<td width="110" align="right">查看范围：</td>
			<td style="position:relative;">
				<a class="h-cleanBtn" title="清空">X</a>
				<input id="orgCode_orderList" name="organization.code" type="hidden" value="${orgCode}"/>
					<input name="organization.orgLevel" type="hidden" value="${orgLevel}"/>
					<input id="orgName_orderList" style="width:98%;" class=" textInput readonly" type="text" readonly="readonly" name="organization.name"  value="${orgName}"/>
			</td>
			<td width="100">
				<a class="btnLook" lookupgroup="organization" href="${contextPath }/management/security/organization/lookup2org/form_order_serch?selectAll=true&permissionKey=<%=com.rongbang.utils.PlatformConstants.PERMISSION_ORDERLIST_SHOW %>" width="400">选择组织机构</a>
					&nbsp;<input style="vertical-align:middle;" name="onlySubstation" id="onlySubstation" type="checkbox" value="1" <c:if test="${orgLevel!=40}">disabled</c:if><c:if test="${param.onlySubstation==1}">checked</c:if> >只查支局
			</td>
			<td width="90" align="right">创建开始时间：</td>
			<td>
			<div style="width:95.5%; position:relative;">
			    <input type="text" name="gteSubmitTime" id="order_begin_time" class="date" readonly="readonly" style="float:left; width:95%;" value="${gteSubmitTime}" maxDate="${limitSelectTime}"/>
				<a class="inputDateButton" href="javascript:;" style=" position:absolute; right:-1px; top:0;">选择</a>
			</div>	
			</td>
			<td width="90" align="right">创建结束时间：</td>
			<td>
				<div style="width:95%; position:relative;">
				<input type="text" name="lteSubmitTime" id="order_end_time" class="date" readonly="readonly" style="float:left; width:95%;" value="${lteSubmitTime}" maxDate="${limitSelectTime}" />
					<a class="inputDateButton" href="javascript:;" style="position:absolute; right:-1px; top:0;">选择</a>		
				</div>
			</td>
			<td width="100">
				<input style="vertical-align:middle;" type="checkbox"  id="order_isToday" name="order_isToday" value="1" <c:if test='${order_isToday eq 1 }'>checked</c:if> />查询今天
			</td>
		</tr>
	</table>
			</div>	
			
			<div class="subBar">
				<ul>						
					<li><div class="button"><div class="buttonContent"><button type="submit" id="order_sub">搜索</button></div></div></li>
				</ul>
			</div>
		</div>
	</div>
</form>

<div class="pageContent">

	<div class="panelBar">
		<ul class="toolBar">
			<shiro:hasPermission name="OrderList:export">
			<li><a iconClass="page_excel" href="javascript:exportOrderExcel('1');"><span>导出当前页</span></a></li>
			<li><a iconClass="page" href="javascript:exportOrderExcel('0');"><span>导出所有页</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>
	<table class="table" layoutH="170" width="2870">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="160">卡支付系统订单号</th>		
				<th width="130">业务订单号</th>
				<th width="140">业务系统</th>
				<th width="110">业务种类</th>
				<th width="100">订单类型</th>	
				<th width="90">订单状态</th>
				<th width="135" id="item_bizMoney">业务订单总金额(元)</th>	
				<th width="110" id="item_money">订单金额(元)</th>
				<th width="115">实际刷卡金额(元)</th>
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
				<th width="130" orderField="submitTime" class="${page.orderField eq 'submitTime' ? page.orderDirection : ''}">创建时间</th>
				<div id="item_bizMoney_tip">业务订单总金额  是业务系统生成的订单的要支付的总金额  其中可能是部分现金部分刷卡支付。</div>
				<div id="item_money_tip">而订单金额是业务系统把生成的订单提交到卡支付系统后， 把需要刷卡支付的那部分称为订单金额。</div>
			</tr>
		</thead>
		<tbody>
		<c:choose>
			<c:when test="${order_isToday eq '1'}">
			<c:forEach var="item" items="${orders}" varStatus="var"><%--今天数据 --%>
			<tr target="slt_uid" rel="${item.cpsOrderId}">
				<td align="center">${var.count}</td>
				<td>${item.cpsOrderId}</td>
				<td>${item.bizOrderId}</td>
				<td>${item.supportSystem.systemName}</td>
				<td>${item.business.businessName}</td>
				<td>
					<font color="<c:if test="${item.orderType=='R' }">red</c:if><c:if test="${item.orderType=='C' }">blue</c:if>">
						<dwz:dicItem displayOnly="true" themeName="order_type" selectedValue="${item.orderType}"   /></td>
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
			<c:forEach var="item" items="${orderHistorys}" varStatus="var">
			<tr target="slt_uid" rel="${item.cpsOrderId}">
				<td align="center">${var.count}</td>
				<td>${item.cpsOrderId}</td>
				<td>${item.bizOrderId}</td>
				<td>${item.supportSystem.systemName}</td>
				<td>${item.business.businessName}</td>
				<td>
					<font color="<c:if test="${item.orderType=='R' }">red</c:if><c:if test="${item.orderType=='C' }">blue</c:if>">
					<dwz:dicItem displayOnly="true" themeName="order_type" selectedValue="${item.orderType}"  /> 
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
	<!-- 分页 -->
	<dwz:pagination page="${page }"/>
</div>