<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<style type="text/css">
.searchBar label{ width:100px;}
</style>
<script type="text/javascript">
var id = "";
var status = "";
function getStatus(tzStatus,tzid){
	id = tzid;
	status = tzStatus;
}
function checkSystem(){
	var supportSystem = $("#supportSystem").val();
	var transId = $("#transId").val();
	var bankTransTime = $("#bankTransTime").val();
	var tzCompleteDate = $("#tzCompleteDate").val();
	var tzStatus = "2";
	
	if(supportSystem == ''){
		alertMsg.error('请选择相应的业务系统');
		return;
	}
	if(tzCompleteDate == ''){
		alertMsg.error('请选择需要查询的调账完成日期');
		return;
	}
	$("#exprotButton").attr('href','${contextPath }/management/order/paymentError/exprot?supportSystem='+supportSystem+'&transId='+transId+'&bankTransTime='+bankTransTime+'&tzCompleteDate='+tzCompleteDate);

}
$("#tzButton").click(function(){
	if(status==2){
		alertMsg.info("调账已经完成，不能继续操作！");
	}else if((status=="1"||status=="0")&&id!=""){
		$.pdialog.open("${contextPath }/management/order/paymentError/update/"+id,"lookup2organization_edit","调账",{mask:true,width:700,height:450});
	}else{
		alertMsg.info("请选择信息！");
	}
	
});
$(function(){
	$("#form_paymentError_serch .h-cleanBtn").click(function(){
		$("#form_paymentError_serch  input[name='organization.code']").val("");
		$("#form_paymentError_serch  input[name='organization.orgLevel']").val("");
		$("#form_paymentError_serch  input[name='organization.name']").val("");
		$("#form_paymentError_serch .h-cleanBtn").css("display","none");
	});
	
	if($("#form_paymentError_serch [name='organization.name']").val()==''){
			$("#form_paymentError_serch .h-cleanBtn").css("display","none");
	}
});
function empty_code(name){
	if(name==""){
		$("#orgCode").val("");
	}
}

$(document).ready(function(){
	$('#orgName').autocomplete({
		serviceUrl: '${contextPath }/management/system/posTerminal/getPos_org_name',
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
	
	//如果自动填充(网点补全)时没有选择查询结果,查看范围的输入框将会清空内容
	$('#orgName').blur(function(){
		if($("#orgCode").val()==""){
			$('#orgName').val("");
		}
	});
	
<%--	if($("#cardTransTime").val()==""){--%>
<%--		$("#cardTransTime").val("${afterSelectTime}");--%>
<%--	}--%>
	
});
</script>

<dwz:paginationForm action="${contextPath }/management/order/paymentError/list" page="${page }">
	
	<input type="hidden" name="search_LIKE_refNo" value="${param.search_LIKE_refNo }"/>
	<input type="hidden" name="search_LIKE_bankRefNo" value="${param.search_LIKE_bankRefNo }"/>
	<input type="hidden" name="search_LIKE_transNo" value="${param.search_LIKE_transNo }"/>
	<input type="hidden" name="search_LIKE_waterNo" value="${param.search_LIKE_waterNo }"/>
	<input type="hidden" name="search_EQ_dzErrType" value="${param.search_EQ_dzErrType }"/>
	<input type="hidden" name="search_LIKE_externalTermno" value="${param.search_LIKE_externalTermno }"/>
	<input type="hidden" name="search_LIKE_bankTerminalNo" value="${param.search_LIKE_bankTerminalNo }"/>
	<input type="hidden" name="cardTransTime" value="${param.cardTransTime }"/>
	<input type="hidden" name="bankTransTime" value="${param.bankTransTime }"/>
	<input type="hidden" name="cardTzDate" value="${param.cardTzDate }"/>
	<input type="hidden" name="orgCode" value="${param.orgCode }"/>
	<input type="hidden" name="orgName" value="${param.orgName }"/>
	<input type="hidden" name="search_EQ_tzClearing" value="${param.search_EQ_tzClearing }"/>
	<input type="hidden" name="search_EQ_tzStatus" value="${param.search_EQ_tzStatus }"/>
	<input type="hidden" name="search_EQ_order.supportSystem.id" value="${param['search_EQ_order.supportSystem.id']}"/>
	<input type="hidden" name="search_EQ_transId" value="${param['search_EQ_transId']}"/>
	<input type="hidden" name="tzCompleteDate" value="${param.tzCompleteDate}"/>
</dwz:paginationForm>

<form id="form_paymentError_serch" method="post" action="${contextPath }/management/order/paymentError/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style="height:auto; width:95%; position:relative;">
			<table class="h-table">
			<tr>
				<td width="130" align="right">卡支付---参考号：</td>
				<td>
					<input style="width:98%;" type="text" name="search_LIKE_refNo" value="${param.search_LIKE_refNo }"/>
				</td>
				<td width="130" align="right">邮储---参考号：</td>
				<td>
					<input style="width:98%;" type="text" name="search_LIKE_bankRefNo" value="${param.search_LIKE_bankRefNo }"/>
				</td>
				<td width="80" align="right">所属机构：</td>
					<td>
						<input name="orgCode" id="orgCode" type="hidden" value="${param.orgCode}"/>
						<input name="orgName" id="orgName" onblur="empty_code(value);" style="width:98%;" type="text" value="${param.orgName}"/>
					</td>	
				</tr>
				<tr>
					<td width="130" align="right">卡支付---流水号：</td>				
					<td><input style="width:98%;" type="text" name="search_LIKE_transNo" value="${param.search_LIKE_transNo }"/></td>				
					<td width="130" align="right">邮储---流水号：</td>				
					<td><input style="width:98%;" type="text" name="search_LIKE_waterNo" value="${param.search_LIKE_waterNo }"/></td>	
					<td width="80" align="right">错误类型：</td>
					<td>
						<dwz:dicItem themeName="dzErrType" paramName="search_EQ_dzErrType"  style="width:100%; height:22px;"  selectedValue="${param.search_EQ_dzErrType }"/>
					</td>
				</tr>
				
				<tr>
					<td width="130" align="right">卡支付---外部终端编号：</td>				
					<td><input style="width:98%;" type="text" name="search_LIKE_externalTermno" value="${param.search_LIKE_externalTermno }"/></td>				
					<td width="130" align="right">邮储---外部终端编号：</td>				
					<td><input style="width:98%;" type="text" name="search_LIKE_bankTerminalNo" value="${param.search_LIKE_bankTerminalNo }"/></td>				
					<td width="80" align="right">调账状态：</td>
					<td>
						<select name="search_EQ_tzStatus" style="width:100%; height:22px;">
							<option value="">--请选择--</option>
							<option value="0" ${param.search_EQ_tzStatus eq 0 ? "selected='selected'":"" }>未调账</option>
							<option value="1" ${param.search_EQ_tzStatus eq 1 ? "selected='selected'":"" }>调账中</option>
							<option value="2" ${param.search_EQ_tzStatus eq 2 ? "selected='selected'":"" }>调账完成</option>
						</select>
					</td>
				</tr>
				
				<tr>
					<td width="130" align="right">卡支付---交易日期：</td>				
					<td style="position:relative;">
						<input type="text" id="cardTransTime" name="cardTransTime" maxDate="${limitSelectTime }" class="date" dateFmt="yyyy-MM-dd"  maxlength="19"  readonly="readonly" style="float:left; width:92%;" value="${param.cardTransTime }"/>
						<a class="inputDateButton" href="javascript:;" style=" position:absolute; top:2px; right:2px;">选择</a>
					</td>				
					<td width="130" align="right">邮储---交易日期：</td>				
					<td style="position:relative;">
						<input type="text" id="bankTransTime" name="bankTransTime" maxDate="${limitSelectTime }" class="date" dateFmt="yyyy-MM-dd"  maxlength="19"  readonly="readonly" style="float:left; width:92%;" value="${param.bankTransTime }"/>
						<a class="inputDateButton" href="javascript:;" style=" position:absolute; top:2px; right:2px;">选择</a>
					</td>
					<td width="130" align="right">调账日期：</td>				
					<td style="position:relative;">
						<input type="text" name="cardTzDate" class="date" dateFmt="yyyy-MM-dd" maxDate="${limitSelectTime }" maxlength="19"  readonly="readonly" style="float:left; width:92%;" value="${param.cardTzDate }"/>
						<a class="inputDateButton" href="javascript:;" style=" position:absolute; top:2px; right:2px;">选择</a>
					</td>
				</tr>
				<tr>
					<td width="130" align="right">是否清分：</td>				
					<td>
						<select name="search_EQ_tzClearing" style="width:100%; height:22px;">
							<option value="">--请选择--</option>
							<option value="Y" ${param.search_EQ_tzClearing eq "Y" ? "selected='selected'":"" }>是</option>
							<option value="N" ${param.search_EQ_tzClearing eq "N" ? "selected='selected'":"" }>否</option>
						</select>
					</td>
					<td width="130" align="right">业务系统：</td>
					<td>
						<dwz:system id="supportSystem" paramName="search_EQ_order.supportSystem.id" style="width:100%; height:22px;" selectedValue="${param['search_EQ_order.supportSystem.id']}"/>
					</td>
					<td width="130" align="right">交易类型：</td>
					<td>
						<select style="width:100%; height:22px;" name="search_EQ_transId" id="transId">
							<option value="">--请选择--</option>
							<option value="200022" ${param['search_EQ_transId'] eq "200022" ? "selected='selected'":"" } >消费</option>
							<option value="200023" ${param['search_EQ_transId'] eq "200023" ? "selected='selected'":"" }>消费撤销</option>
							<option value="200024" ${param['search_EQ_transId'] eq "200024" ? "selected='selected'":"" }>联机退货</option>
						</select>
					</td>
				</tr>
				<tr>
					<td width="130" align="right">调账完成日期：</td>
					<td style="position:relative;">
						<input type="text" id="tzCompleteDate" name="tzCompleteDate"  maxDate="${limitSelectTime }" class="date" dateFmt="yyyy-MM-dd" readonly="readonly" style="float:left; width:92%;" value="${param.tzCompleteDate}"/>
						<a class="inputDateButton" href="javascript:;" style=" position:absolute; top:2px; right:2px;">选择</a></td>
						<td></td>
				</tr>
			</table>	
			</div>
			<div class="subBar">
				<ul>						
					<li><div class="button"><div class="buttonContent"><button type="submit" id="payment_error_sub">搜索</button></div></div></li>
				</ul>
			</div>
		</div>
	</div>
</form>

<div class="pageContent">

<div class="panelBar">
		<ul class="toolBar">
			<shiro:hasPermission name="PaymentError:view">
				<li>
				<a iconClass="zoom" target="dialog" rel="lookup2organization_edit" mask="true" width="634" height="400" href="${contextPath }/management/order/paymentError/view/{paymentErrors_id}"><span>查看详情</span></a>
				</li>
			</shiro:hasPermission>
			<shiro:hasPermission name="PaymentError:adjust">
				<li>
				<a iconClass="zoom_out" target="dialog" rel="lookup2organization_edit" mask="true" width="634" height="400" href="${contextPath }/management/order/adjustmentHistory/list/{paymentErrors_id}"><span>调账历史</span></a>
				</li>
			</shiro:hasPermission>
			<shiro:hasPermission name="PaymentError:adjust">
				<li>
				<a iconClass="text_signature" id="tzButton" ><span>调账</span></a>
				</li>
			</shiro:hasPermission>
			<shiro:hasPermission name="PaymentError:exportTxt">
				<li>
				<a iconClass="page" id="exprotButton" onclick="checkSystem();"><span>导出调账完成的数据</span></a>
				</li>
			</shiro:hasPermission>
			<li style="background:none; line-height:22px; float:right;">【备注：下面数据字段用颜色区分：蓝色表示卡支付；绿色表示邮储；】</li>
		</ul>
	</div>

<table class="table" layoutH="250" width="7000">
		<thead>
			<tr>
			<%--
				<th width="22"><input type="checkbox" group="ids" class="checkboxCtrl"></th>
			--%>
			<%--
				//class="blue"区分为卡支付； class="green"区分为邮储
			--%>
				<th width="30">序号</th>
				<th width="350">对账错误类型</th>
				<th width="80">调账状态</th>
				<th width="200">业务系统</th>
				<th width="200">所属机构</th>
				
				<th width="200" class="blue">内部商户编号</th>
				<th width="200" class="blue">内部终端编号</th>
				<th width="200" class="blue">外部商户编号</th>
				<th width="200" class="blue">外部终端编号</th>
				<th width="200" class="blue">业务订单号</th>
				<th width="200" class="blue">卡支付系统订单号</th>
				<th width="80" class="blue">交易类型</th>			
				<th width="80" class="blue">内部批次号</th>
				<th width="100" class="blue">内部流水号</th>
				<th width="80" class="blue">外部批次号</th>
				<th width="100" class="blue">外部流水号</th>
				<th width="130" class="blue">交易时间</th>
				<th width="130" class="blue">清算日期</th>
				<th width="200" class="blue">卡号</th>	
				<th width="200" class="blue">卡类型</th>
				<th width="120" class="blue">交易金额(元)</th>
				<th width="120" class="blue">手续费(元)</th>
				<th width="200" class="blue">卡支付-参考号</th>
				<th width="200" class="blue">授权码</th>
				<th width="200" class="blue">原内部批次号</th>	
				<th width="200" class="blue">原内部流水号</th>	
				<th width="60" class="blue">成功标识</th>
				<th width="100" class="blue">交易状态</th>	
				<th width="130" orderField="insertTime" class="blue ${page.orderField eq 'insertTime' ? page.orderDirection : ''}">插入时间</th>	
				
				<th width="100" class="green">外部流水号</th>
				<th width="200" class="green">邮储-参考号</th>
				<th width="200" class="green">主账号/卡号</th>
				<th width="120" class="green">交易金额(元)</th>
				<th width="80" class="green">手续费(元)</th>
				<th width="130" class="green">交易时间</th>
				<th width="100" class="green">清算日期</th>
				<th width="200" class="green">外部商户编号</th>
				<th width="200" class="green">外部终端编号</th>
				<th width="60" class="green">成功标识</th>
				<th width="60" class="green">交易状态</th>
				<th width="60" class="green">交易类型</th>
				<th width="130" class="green">插入时间</th>
				<th width="130" class="green">终端上送的流水号</th>
				<th width="130" class="green">平台号</th>
				<th width="100" class="green">交易日期</th>
				<th width="130" class="green">交易码</th>
				
				<th width="130">调账时间</th>
				<th width="130">调账完成日期</th>
				<th width="80">调账人</th>
				<th width="200">调账备注</th>
				<th width="60">是否清分</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="paymentErrors" items="${paymentErrors}" varStatus="var">
			<tr target="paymentErrors_id" rel="${paymentErrors.id}" onclick="getStatus(${paymentErrors.tzStatus },${paymentErrors.id})">
				<td align="center">${var.count}</td>
<%--				<td align="center">${paymentErrors.id}</td>--%>
				<td >
					<dwz:dicItem themeName="dzErrType" style="text-align:center;line-height:21px;" selectedValue="${paymentErrors.dzErrType}" displayOnly="true"/>
				</td>
				<td ><dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.PAYMENTERROR_STATUS %>" dataValue="${paymentErrors.tzStatus }"/></td>
				<td >${empty paymentErrors.order ? " ":(paymentErrors.order.supportSystem.systemName)}</td>				
				<td >${paymentErrors.order.organization.name}</td>				
				<td >${paymentErrors.merchNo}</td>				
				<td >${paymentErrors.termNo}</td>
				<td >${paymentErrors.externalMerchno}</td>			
				<td >${paymentErrors.externalTermno}</td>
				<td >${paymentErrors.bizorderId}</td>
				<td >${paymentErrors.order.cpsOrderId }</td>
				<td>
					<dwz:dicItem themeName="payment_transId" style="text-align:center;line-height:21px;" selectedValue="${paymentErrors.transId}" displayOnly="true"/>
				</td>
				<td >${paymentErrors.batchNo }</td>
				<td >${paymentErrors.transNo }</td>
				<td >${paymentErrors.bankBatchNo }</td>
				<td >${paymentErrors.bankTransNo }</td>
				<td ><fmt:formatDate value="${paymentErrors.transTime }" pattern="yyyy-MM-dd HH:mm:ss"/></td>
				<td ><fmt:formatDate value="${paymentErrors.clearDate }" pattern="yyyy-MM-dd"/></td>
				<td >${paymentErrors.cardNo }</td>
					<td ><dwz:dicItem themeName="card_type" selectedValue="${paymentErrors.cardType}" displayOnly="true"/></td>
				<td align="right"><fmt:formatNumber value="${paymentErrors.money }" pattern="##,##,##0.00"/></td>
				<td align="right"><fmt:formatNumber value="${paymentErrors.fee }" pattern="##,##,##0.00"/></td>
				<td >${paymentErrors.refNo }</td>
				<td >${paymentErrors.authId }</td>
				<td >${paymentErrors.oldbatchNo }</td>
				<td >${paymentErrors.oldtransNo }</td>
				<td >${paymentErrors.transCode eq "F0"? "成功":"失败"}</td>
				<td ><dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.BANK_STATUS %>" dataValue="${paymentErrors.transStatus }"/></td>
				<td ><fmt:formatDate value="${paymentErrors.insertTime }" pattern="yyyy-MM-dd HH:mm:ss"/></td>
				
				<td >${paymentErrors.waterNo }</td>
				<td >${paymentErrors.bankRefNo }</td>
				<td >${paymentErrors.accountNo }</td>
				<td align="right"><fmt:formatNumber value="${paymentErrors.bankMoney}" pattern="##,##,##0.00"/></td>
				<td >${paymentErrors.bankFee }</td>
				<td >
					<fmt:parseDate value="${paymentErrors.currentDate}${paymentErrors.currentTime }" pattern="yyyyMMddHHmmss" var="currentDateAndTime"/>   
					<fmt:formatDate value="${currentDateAndTime}" pattern="yyyy-MM-dd HH:mm:ss"/> 
				</td>
				<td >
					<fmt:parseDate value="${paymentErrors.bankClearDate }" pattern="yyyyMMdd" var="bankClearDate"/>
					<fmt:formatDate value="${bankClearDate}" pattern="yyyy-MM-dd"/> 
				</td>			
				<td >${paymentErrors.skfId }</td>
				<td >${paymentErrors.bankTerminalNo }</td>
				<td ><dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.BANK_FLAG %>" dataValue="${paymentErrors.bankFlag }"/></td>
				<td ><dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.BANK_STATUS %>" dataValue="${paymentErrors.bankStatus }"/></td>
				<td >${paymentErrors.bankTransType eq "1021"? "消费" : paymentErrors.bankTransType eq "2021" ?"消费冲正" : paymentErrors.bankTransType eq "3021"? "消费撤销" : paymentErrors.bankTransType eq "4021" ? "消费撤销冲正" : paymentErrors.bankTransType eq "1061"? "退货" : ""}</td>
				<td ><fmt:formatDate value="${paymentErrors.bankInsertTime }" pattern="yyyy-MM-dd HH:mm:ss"/></td>
				<td>${paymentErrors.bankTermWaterNo }</td>
				<td>${paymentErrors.bankPlatformNo }</td>
				<td><fmt:formatDate value="${paymentErrors.bankTransTime }" pattern="yyyy-MM-dd"/></td>
				<td>${paymentErrors.bankTransCode }</td>
				
				<td ><fmt:formatDate value="${paymentErrors.tzTime }" pattern="yyyy-MM-dd HH:mm:ss"/></td>
				<td ><fmt:formatDate value="${paymentErrors.tzCompleteDate }" pattern="yyyy-MM-dd"/></td>
				<td >${paymentErrors.tzUser }</td>
				<td >${paymentErrors.tzRemark}</td>
				<td >${paymentErrors.tzClearing eq "Y"?"是":"否"}</td>
			</tr>			
			</c:forEach>
		</tbody>
	</table>
	<c:if test="${empty paymentErrors}">
		    	<div class="re_tips">没有搜到符合您条件的数据！</div>
   	</c:if>
	<!-- 分页 -->
	<dwz:pagination page="${page }"/>
</div>
