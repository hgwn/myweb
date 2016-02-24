<%@page import="com.rongbang.utils.PlatformConstants"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@page import="java.util.Date"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
    /*
paymentWater_refNo
paymentWater_batchNo
paymentWater_transNo
paymentWater_cpsOrderId
    */
	$(document).ready(function(){
		var isToday = $("#paymentWater_isToday").val();
		/*
		//参考号自动填充
		$("#paymentWater_refNo").autocomplete({
			serviceUrl: '${contextPath }/management/order/paymentWater/getRefNo',
				params : {isToday : function() {
					if(	$("#paymentWater_isToday").attr("checked")=="checked"){ 
						return 	$("#paymentWater_isToday").val();
						}
					else{return '2';}
				}}
		});
		*/
		$("#paymentWater_batchNo").autocomplete({
			serviceUrl: '${contextPath }/management/order/paymentWater/getBatchNo',
				params : {isToday : function() {
					if(	$("#paymentWater_isToday").attr("checked")=="checked"){ 
						return 	$("#paymentWater_isToday").val();
						}
					else{return '2';}
				}}
		});
		$("#paymentWater_transNo").autocomplete({
			serviceUrl: '${contextPath }/management/order/paymentWater/getTransNo',
				params : {isToday : function() {
					if(	$("#paymentWater_isToday").attr("checked")=="checked"){ 
						return 	$("#paymentWater_isToday").val();
						}
					else{return '2';}
				}}
		});
		$("#paymentWater_cpsOrderId").autocomplete({
			serviceUrl: '${contextPath }/management/order/paymentWater/getCpsOrderId',
				params : {isToday : function() {
					if(	$("#paymentWater_isToday").attr("checked")=="checked"){ 
						return 	$("#paymentWater_isToday").val();
						}
					else{return '2';}
				}}
		});
		
	});
	
	$("#businessId_payment").remoteChained("#systemId_3", "${contextPath}/management/order/getBusiness");
	
	exportPaymentExcel = function(cp){
		$("#currentPage_pay").val(cp);
		$("#exportForm_pay").submit();
	}
	
	$("#payment_water_sub").click(function(){
	   var  serch_begin_time =	$("#paymentWater_begin_time").val();
	   var  serch_end_time =	$("#paymentWater_end_time").val();
	 
	// var payment_gapDay = daysBetween(serch_begin_time, serch_end_time); 计算时间跨度
	 if(parseInt(payment_gapDay)<0){
			alertMsg.info("开始日期不能大于结束日期，请重新选择！");
			return false;
		}
	});
	
	
	var paymentWater_begin_time ;
	var paymentWater_end_time ;
	$("#paymentWater_isToday").click(function(){
		if($(this).attr("checked")=="checked"){
			$(this).val(1);
			paymentWater_begin_time  = $("#paymentWater_begin_time").val() ;
			paymentWater_end_time =	$("#paymentWater_end_time").val();
			$("#paymentWater_begin_time").attr("value","");
			$("#paymentWater_end_time").attr("value","");
			$("#paymentWater_begin_time").attr("disabled","disabled");	
			$("#paymentWater_end_time").attr("disabled","disabled");
		}else{
			$(this).val(2);
			$("#paymentWater_begin_time").attr("value",paymentWater_begin_time);
			$("#paymentWater_end_time").attr("value",paymentWater_end_time);
			$("#paymentWater_begin_time").removeAttr("disabled");	
			$("#paymentWater_end_time").removeAttr("disabled");	
		}
	});
	
	$(function(){
		lookup_cleanbtn("form_paymentWater_serch");
		if($("#form_paymentWater_serch [name='organization.name']").val()==''){
			$("#form_paymentWater_serch .h-cleanBtn").css("display","none");
		}
	});
	
	if($("#paymentWater_isToday").attr("checked")=="checked"){
			$(this).val(1);
			paymentWater_begin_time  = $("#paymentWater_begin_time").val() ;
			paymentWater_end_time =	$("#paymentWater_end_time").val();
			$("#paymentWater_begin_time").attr("value","");
			$("#paymentWater_end_time").attr("value","");
			$("#paymentWater_begin_time").attr("disabled","disabled");	
			$("#paymentWater_end_time").attr("disabled","disabled");
	}
	
	
</script>
<dwz:paginationForm action="${contextPath }/management/order/paymentWater/list" page="${page }">
	<input type="hidden" name="search_LIKE_refNo" value="${param.search_LIKE_refNo }"/>
	<input type="hidden" name="search_EQ_batchNo" value="${param.search_EQ_batchNo }"/>
	<input type="hidden" name="search_EQ_transNo" value="${param.search_EQ_transNo }"/>
	<input type="hidden" name="search_EQ_cardType" value="${param.search_EQ_cardType }"/>
	<input type="hidden" name="GTEtransTime" value="${GTEtransTime }"/>
	<input type="hidden" name="LTEtransTime" value="${LTEtransTime }"/>
	<input type="hidden" name="systemId" value="${param.systemId}"/>
	<input type="hidden" name="businessId" value="${param.businessId}"/>
	<input type="hidden" name="cpsorderId" value="${cpsorderId }"/>
	<input type="hidden" name="organization.orgLevel" value="${orgLevel}"/>
	<input type="hidden" name="organization.code" value="${orgCode}"/>
	<input type="hidden" name="organization.name" value="${orgName}"/>
	<input type="hidden" name="onlySubstation"  value="${param.onlySubstation}"/>
	<input type="hidden" name="paymentWater_isToday" value="${payment_isToday}"/>
	<input type="hidden" name="payment_isBegin" value="${payment_isBegin}" />
	<input type="hidden" name="search_EQ_transId"  value="${param.search_EQ_transId}"/>
	<input type="hidden" name="search_EQ_transCode"  value="${param.search_EQ_transCode}"/>
	<input type="hidden" name="search_EQ_transStatus"  value="${param.search_EQ_transStatus}"/>
	<input type="hidden" name="search_EQ_bankBatchNo" value="${param.search_EQ_bankBatchNo }"/>
	<input type="hidden" name="search_EQ_bankTransNo" value="${param.search_EQ_bankTransNo }"/>
</dwz:paginationForm>

<form method="post" id="exportForm_pay" action="${contextPath }/management/order/paymentWater/export">
	<input type="hidden" name="search_LIKE_refNo" value="${param.search_LIKE_refNo }"/>
	<input type="hidden" name="search_EQ_batchNo" value="${param.search_EQ_batchNo }"/>
	<input type="hidden" name="search_EQ_transNo" value="${param.search_EQ_transNo }"/>
	<input type="hidden" name="search_EQ_cardType" value="${param.search_EQ_cardType }"/>
	<input type="hidden" name="GTEtransTime" value="${GTEtransTime }"/>
	<input type="hidden" name="LTEtransTime" value="${LTEtransTime }"/>
	<input type="hidden" name="systemId" value="${param.systemId}"/>
	<input type="hidden" name="businessId" value="${param.businessId}"/>
	<input type="hidden" name="cpsorderId" value="${cpsorderId }"/>
	<input type="hidden" name="organization.orgLevel" value="${orgLevel}"/>
	<input type="hidden" name="organization.code" value="${orgCode}"/>
	<input type="hidden" name="organization.name" value="${orgName}"/>
	<input type="hidden" name="onlySubstation"  value="${param.onlySubstation}"/>
	<input type="hidden" name="pageNum" value="${page.pageNum }"/>
	<input type="hidden" name="numPerPage" value="${page.numPerPage }"/>
	<input type="hidden" name="orderField" value="${page.orderField }"/>
	<input type="hidden" name="orderDirection" value="${page.orderDirection }"/>
	<input type="hidden" name="currentPage" id="currentPage_pay" value=""/>
	<input type="hidden" name="payment_isBegin" value="${payment_isBegin}" />
	<input type="hidden" name="paymentWater_isToday" value="${payment_isToday}"/>
	<input type="hidden" name="search_EQ_transId"  value="${param.search_EQ_transId}"/>
	<input type="hidden" name="search_EQ_transCode"  value="${param.search_EQ_transCode}"/>
	<input type="hidden" name="search_EQ_transStatus"  value="${param.search_EQ_transStatus}"/>
	<input type="hidden" name="search_EQ_bankBatchNo" value="${param.search_EQ_bankBatchNo }"/>
	<input type="hidden" name="search_EQ_bankTransNo" value="${param.search_EQ_bankTransNo }"/>
</form>

<form id="form_paymentWater_serch" method="post" action="${contextPath }/management/order/paymentWater/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style="height:auto; width:90%; position:relative;">
			<table class="h-table">
			<input type="hidden" name="payment_isBegin" value="${payment_isBegin}" />
			<tr>
				<td width="110" align="right">参考号：</td>
				<td>
					<input type="text" id="paymentWater_refNo" name="search_LIKE_refNo" value="${param.search_LIKE_refNo}" style="width:95%;"/>
				</td>
				<td width="120" align="right">内部批次号：</td>
				<td>
					<input type="text" id="paymentWater_batchNo" name="search_EQ_batchNo" value="${param.search_EQ_batchNo }" style="width:95%;"/>
				</td>
				<td width="100">&nbsp;</td>
				<td width="100" align="right">内部流水号：</td>
				<td>
					<input type="text" id="paymentWater_transNo" name="search_EQ_transNo" value="${param.search_EQ_transNo }" style="width:95%;"/>
				</td>
			</tr>
			<tr>
				<td width="110" align="right">卡类型：</td>
				<td>
					<dwz:dicItem className="re_select" paramName="search_EQ_cardType" themeName="card_type" selectedValue="${param.search_EQ_cardType}"   valueMember="keyItem"   displayMember="item1" />			
				</td>
				<td width="120" align="right">卡支付系统订单号：</td>
				<td>
					<input type="text" id="paymentWater_cpsOrderId" name="cpsOrderId" value="${cpsOrderId}" style="width:95%;"/>
				</td>
				<td width="100">&nbsp;</td>
				<td width="100" align="right">业务系统：</td>
				<td> 
					<select   id="systemId_3"  name="systemId"  style="width:98%;"  class="re_select"     >
						<option value="0" selected="selected">--请选择系统--</option>
						<c:forEach items="${supportSystems}" var="supp">
							<option value="${supp.id}" <c:if test="${param.systemId eq supp.id }">selected</c:if>
							>${supp.systemName }</option>
						</c:forEach>
					</select>
				</td>
			</tr>
			<tr>	
				<td width="110" align="right">交易状态：</td>
				<td>
					<dwz:dicItem className="re_select" paramName="search_EQ_transStatus" themeName="payment_transStatus" selectedValue="${param.search_EQ_transStatus}"   valueMember="keyItem"   displayMember="item1" />			
				</td>
				<td width="120" align="right">查看范围：</td>
				<td style="position:relative;">
					<a class="cleanButt_org h-cleanBtn" title="清空" style="right:8px;">X</a>
					<input name="organization.code" type="hidden" value="${orgCode}"/>
					<input name="organization.orgLevel" type="hidden" value="${orgLevel}"/>
					<input style="width:95%;" class=" textInput readonly" type="text" readonly="readonly" name="organization.name"  value="${orgName}"/>
				</td>
				<td width="100">
					<a class="btnLook" lookupgroup="organization" href="${contextPath }/management/security/organization/lookup2org/form_paymentWater_serch?selectAll=true&permissionKey=<%=com.rongbang.utils.PlatformConstants.PERMISSION_PAYMENTWATER_SHOW %>" width="400">选择组织机构</a>
					&nbsp;<input style="vertical-align:middle;" name="onlySubstation" id="onlySubstation" type="checkbox" value="1" <c:if test="${orgLevel!=40}">disabled</c:if><c:if test="${param.onlySubstation==1}">checked</c:if> >只查支局</td>
				<td width="100" align="right">业务种类：</td>
				<td>
					<select style="width:98%;"  class="re_select " name="businessId"  id="businessId_payment"  >
						<option value="0">--请选择业务--</option>
						<c:forEach items="${businesses}" var="bus">
							<option value="${bus.id}" <c:if test="${param.businessId eq bus.id}">selected="selected"</c:if>
							>${bus.businessName }</option>
						</c:forEach>
					</select>
				</td>
			</tr>
			<tr>	
				<td width="110" align="right">创建开始时间：</td>
				<td>
				<div style="width:98%; position:relative;">
					<input type="text" name="GTEtransTime" id="paymentWater_begin_time" value="${GTEtransTime }"  maxDate="${limitSelectTime}" class="date" readonly="readonly" style="float:left; width:95%;"/>
					<a  class="inputDateButton" href="javascript:;" style="position:absolute; right:-1px; top:0;">选择</a>
				</div>	
				</td>
				<td width="120" align="right">创建结束时间：</td>
				<td>
				<div style="width:98%; position:relative;">
					<input type="text" name="LTEtransTime" id="paymentWater_end_time" value="${LTEtransTime }" maxDate="${limitSelectTime}" class="date" readonly="readonly" style="float:left; width:95%;"/>
					<a class="inputDateButton" href="javascript:;" style="position:absolute; right:-1px; top:0;">选择</a>
					&nbsp;&nbsp;<input style="vertical-align:middle;" type="checkbox"  <c:if test='${payment_isToday eq 1 }'>checked</c:if>  id="paymentWater_isToday" name="paymentWater_isToday" value="1"  />查询今天
				</div>
				</td>
				<td width="100">&nbsp;</td>
				<td width="100" align="right">交易类型：</td>
				<td>
					<dwz:dicItem className="re_select" paramName="search_EQ_transId" themeName="payment_transId" selectedValue="${param.search_EQ_transId}"   valueMember="keyItem"   displayMember="item1" />			
				</td>
			</tr>
			<tr>
				<td width="100" align="right">成功标识：</td>
				<td>
					<dwz:dicItem className="re_select" paramName="search_EQ_transCode" themeName="payment_transCode" selectedValue="${param.search_EQ_transCode}"   valueMember="keyItem"   displayMember="item1" />			
				</td>
				<td width="120" align="right">外部批次号：</td>
				<td>
					<input type="text" id="bankBatchNo" name="search_EQ_bankBatchNo" value="${param.search_EQ_bankBatchNo }" style="width:95%;"/>
				</td>
				<td width="100">&nbsp;</td>
				<td width="100" align="right">外部流水号：</td>
				<td>
					<input type="text" id="bankTransNo" name="search_EQ_bankTransNo" value="${param.search_EQ_bankTransNo }" style="width:95%;"/>
				</td>
			</tr>	
			</table>	
			</div>
			<div class="subBar">
				<ul>						
					<li><div class="button"><div class="buttonContent"><button type="submit" id="payment_water_sub">搜索</button></div></div></li>
				</ul>
			</div>
		</div>
	</div>
</form>

<div class="pageContent">

	<div class="panelBar">
		<ul class="toolBar">
			<shiro:hasPermission name="PaymentWater:export">
			<li><a iconClass="page_excel" href="javascript:exportPaymentExcel('1');"><span>导出当前页</span></a></li>
			<li><a iconClass="page" href="javascript:exportPaymentExcel('0');"><span>导出所有页</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>

	<table class="table tabletest" layoutH="222" width="3210">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="140">参考号</th>
				<th width="70">交易类型</th>
				<th width="100">交易金额(元)</th>
				<th width="100">交易状态</th>
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
				<th width="130" orderField="insertTime" class="${page.orderField eq 'insertTime' ? page.orderDirection : ''}" >创建时间</th>
			</tr>
		</thead>
		<tbody><c:choose>
		<c:when test="${payment_isToday ne '1' }"><%--历史数据 --%>
			<c:forEach var="pay" items="${paymentWaterHistorys}" varStatus="var">
			<tr target="pay_id" rel="${pay.id}">
				<td align="center">${var.count}</td>
				<td>${pay.refNo }</td>
				<td><dwz:dicItem displayOnly="true" themeName="payment_transId" selectedValue="${pay.transId }"  /> </td>
				<td align="right"><fmt:formatNumber value="${pay.money }" pattern="##,###,##0.00"/></td>
				<td><dwz:dicItem displayOnly="true" themeName="payment_transStatus"  selectedValue="${pay.transStatus }"  /> </td>
				<td><dwz:dicItem displayOnly="true" themeName="payment_transCode"  selectedValue="${pay.transCode }"  /> </td>
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
				<td align="center"><a href="${contextPath }/management/order/orderList/old/${pay.order.cpsOrderId }" target="dialog"  width="1025"  height="456"  rel="page_order" title="支付订单查询" fresh="false">${pay.order.cpsOrderId }</a></td>
				<td>${pay.order.orgFull.provinceOrg.name}</td>
				<td>${pay.order.orgFull.cityOrg.name}</td>
				<td>${pay.order.orgFull.countryOrg.name}</td>
				<td>${pay.order.orgFull.siteOrg.name}</td>
				<td ><fmt:formatDate value="${pay.insertTime }" pattern="yyyy-MM-dd HH:mm:ss"/></td>
			</tr>			
			</c:forEach>	
		</c:when>
		<c:otherwise><%--今天数据 --%>
			<c:forEach var="pay" items="${paymentWaters}" varStatus="var">
			<tr target="pay_id" rel="${pay.id}">
				<td align="center">${var.count}</td>
				<td>${pay.refNo }</td>
				<td><dwz:dicItem displayOnly="true" themeName="payment_transId" selectedValue="${pay.transId }"  /> </td>
				<td align="right"><fmt:formatNumber value="${pay.money }" pattern="##,###,##0.00"/></td>
				<td><dwz:dicItem displayOnly="true" themeName="payment_transStatus" selectedValue="${pay.transStatus }" /> </td>
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
				<td align="center"><a href="${contextPath }/management/order/orderList/today/${pay.order.cpsOrderId }" target="dialog" rel="page_order" width="1025"  height="456"  title="支付订单查询" fresh="false">${pay.order.cpsOrderId }</a></td>
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
	<c:if test="${page.totalCount eq 0}">
		    	<div class="re_tips">没有搜到符合您条件的数据！</div>
   	</c:if>
	<!-- 分页 -->
	<dwz:pagination page="${page }"/>
</div>