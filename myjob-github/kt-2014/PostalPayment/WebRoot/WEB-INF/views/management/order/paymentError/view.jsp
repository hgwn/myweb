<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<style>
.h-fieldest{ border:1px solid #ddd;}
.h-fieldest legend{ color:#000; background:none;}
.h-formcntent-table td{ height:25px; color:#999}
.h-formcntent-table span{ color:#000;}
li#view_details.hover2 span{ color:#02837e; font-weight:bold;}
</style>
<script type="text/javascript">
$(document).ready(function(){
	var transCode = $("#transCode").text().trim();
	var bankFlag = $("#bankFlag").text().trim();
	
	if(transCode != bankFlag) {
		$("#transCode").css("color","red");
		$("#transCode_label").css("color","red");
	}else{
		$("#transCode").css("color","#999");
		$("#transCode_label").css("color","black");
	}
	
	var transId_view = $("#transId_view").text().trim();
	var bankTransType = $("#bankTransType").text().trim();
	if(transId_view != bankTransType) {
		$("#transId_view").css("color","red");
		$("#transId_view_label").css("color","red");
	}else{
		$("#transId_view").css("color","#999");
		$("#transId_view_label").css("color","black");
	}
	
	var transTime = $("#transTime").text().trim();
	var transTime_postal = $("#transTime_postal").text().trim();
	if(transTime != transTime_postal) {
		$("#transTime").css("color","red");
		$("#transTime_label").css("color","red");
	}else{
		$("#transTime").css("color","#999");
		$("#transTime_label").css("color","black");
	}

	var clearDate = $("#clearDate").text().trim();
	var bankClearDate = $("#bankClearDate").text().trim();
	if(clearDate != bankClearDate) {
		$("#clearDate").css("color","red");
		$("#clearDate_label").css("color","red");
	}else{
		$("#bankClearDate").css("color","#999");
		$("#clearDate_label").css("color","black");
	}
	var transStatus_view = $("#transStatus_view").text().trim();
	var bankStatus_view = $("#bankStatus_view").text().trim();
	if(transStatus_view != bankStatus_view) {
		$("#transStatus_view").css("color","red");
		$("#transStatus_view_label").css("color","red");
	}else{
		$("#transStatus_view").css("color","#999");
		$("#transStatus_view_label").css("color","black");
	}
});
</script>

<div class="pageContent">
	<input type="hidden" id="id" name="id" value="${paymentError.id}"/>
	<div class="panelBar">
		<ul class="toolBar" >
			<shiro:hasPermission name="PaymentError:edit">
				<li id="view_details" class="hover2">
					<a iconClass="zoom"target="dialog" rel="lookup2organization_edit" mask="true" width="530" height="350" href="${contextPath }/management/order/paymentError/view/${paymentError.id}"><span>查看详情</span></a>
				</li>
				<li>
					<a iconClass="zoom_out" target="dialog" rel="lookup2organization_edit" mask="true" width="530" height="350" href="${contextPath }/management/order/adjustmentHistory/list/${paymentError.id}"><span style="color:#999;">调账历史</span></a>
				</li>
		</shiro:hasPermission>
		</ul>
	</div>
	<div class="pageFormContent" layoutH="58">
		<div style="width:95%; margin:0 auto; position:relative;">	
		<fieldset class="h-fieldest">
            <legend>对账结果</legend>
            <table class="h-formcntent-table">
                <tr>
					<td  width="90" align="right">
						<span>对账时间：</span>
					</td>
					<td width="130">
						<fmt:formatDate value="${paymentError.dzTime }" pattern="yyyy-MM-dd HH:mm:ss"/>
					</td>
					<td width="90" align="right">
						<span>对账错误类型：</span>
					</td>
					<td>
						<dwz:dicItem themeName="dzErrType" selectedValue="${paymentError.dzErrType}" displayOnly="true"/>
					</td>
				</tr>
			</table>
        </fieldset>
		<fieldset class="h-fieldest">
            <legend>调账结果</legend>
            <table class="h-formcntent-table">
                <tr>
					<td  width="90" align="right">
						<span>调账时间：</span>
					</td>
					<td width="130">
						<fmt:formatDate value="${paymentError.tzTime }" pattern="yyyy-MM-dd HH:mm:ss"/>
					</td>
					<td width="90" align="right">
						<span>调账状态：</span>
					</td>
					<td width="100">
						<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.PAYMENTERROR_STATUS %>" dataValue="${paymentError.tzStatus }"/>
					</td>
					<td width="90" align="right">
						<span>是否清分：</span>
					</td>
					<td>
						${paymentError.tzClearing eq "Y" ? "是":"否"}
					</td>
				</tr>
				<tr>
					<td align="right" width="90" style="vertical-align:top;">
						<span>调账备注：</span>
					</td>
					<td align="left" colspan="5" style="position:relative;">
					<textarea id="paymentError_viewT" readonly="readonly"  style="width:98%;border:none; background:none; height:auto; line-height:18px; text-align:top;resize:none; overflow:auto; font-size:12px; color:#999;">${paymentError.tzRemark}</textarea>
					</td>
				</tr>
			</table>
        </fieldset>
        
        </div>
		<table class="paymentError_view">
			<tr align="center">
				<th width="50%"><strong>卡支付系统</strong></th>	
				<th width="50%"><strong>邮储</strong></th>
			</tr>	
			<tr>
				<td>
					<label>参考号 ：</label>${paymentError.refNo}
				</td>
				<td>
					<label>参考号：</label>${paymentError.bankRefNo }
				</td>
			</tr>
			<tr>
				<td ${paymentError.cardNo eq paymentError.accountNo ? "":"style='color:red;'"}>
					<label ${paymentError.cardNo eq paymentError.accountNo ? "":"style='color:red;'"}>主账号/卡号：</label>${paymentError.cardNo}
				</td>	
				<td>
					<label>主账号/卡号 ：</label>${paymentError.accountNo }
				</td>
			</tr>
			<tr>
				<td ${paymentError.bankTransNo eq paymentError.waterNo ? "":"style='color:red;'"}>
					<label ${paymentError.bankTransNo eq paymentError.waterNo ? "":"style='color:red;'"}>外部流水号：</label>${paymentError.bankTransNo}
				</td>	
				<td>
					<label>外部流水号 ：</label>${paymentError.waterNo }
				</td>
			</tr>
			<tr>
				<td ${paymentError.money eq paymentError.bankMoney ? "":"style='color:red;'"}>
					<label ${paymentError.money eq paymentError.bankMoney ? "":"style='color:red;'"}>交易金额(元)：</label><fmt:formatNumber value="${paymentError.money }" pattern="##,##,##0.00"/>
				</td>
				<td>
					<label>交易金额(元)：</label><fmt:formatNumber value="${paymentError.bankMoney}" pattern="##,##,##0.00"/>
				</td>
			</tr>
			<tr>
				<td ${paymentError.fee eq paymentError.bankFee ? "":"style='color:red;'"}>
					<label ${paymentError.fee eq paymentError.bankFee ? "":"style='color:red;'"}>手续费 (元)：</label>
					<fmt:formatNumber value="${paymentError.fee }" pattern="##,##,##0.00"/>
				</td>
				<td>
					<label>手续费 (元)：</label><fmt:formatNumber value="${paymentError.bankFee }" pattern="##,##,##0.00"/>
				</td>	
			</tr>
			<tr>
				<td ${paymentError.externalMerchno eq paymentError.skfId ? "":"style='color:red;'"}>
					<label ${paymentError.externalMerchno eq paymentError.skfId ? "":"style='color:red;'"}>外部商户编号：</label>${paymentError.externalMerchno}
				</td>
				<td>
					<label>外部商户编号：</label>${paymentError.skfId }
				</td>
			</tr>
			<tr>
				<td ${paymentError.externalTermno eq paymentError.bankTerminalNo ? "":"style='color:red;'"}>
					<label ${paymentError.externalTermno eq paymentError.bankTerminalNo ? "":"style='color:red;'"}>外部终端编号：</label>${paymentError.externalTermno}
				</td>	
				<td>
					<label>外部终端编号：</label>${paymentError.bankTerminalNo}
				</td>
			</tr>
			<tr>
				<td>
					<label id="transCode_label">成功标识 ：</label>
					<span id="transCode" style="text-align:center;line-height:21px;">
						${paymentError.transCode eq "F0"? "成功":"失败"}
					</span>
				</td>
				<td>
					<label>成功标识  ：</label>
					<span id="bankFlag" style="text-align:center;line-height:21px;">
						<c:if test="${!empty paymentError.bankFlag}">
							<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.BANK_FLAG %>" dataValue="${paymentError.bankFlag }"/>
						</c:if>
					</span>
				</td>
			</tr>
			<tr>
				<td>
					<label id="transId_view_label">交易类型：</label>
					<span id="transId_view" style="text-align:center;line-height:21px;">
						${paymentError.transId eq "200022"?"消费":(paymentError.transId eq "200023"?"消费撤销":(paymentError.transId eq "200024"?"退货":"未知"))}
					</span>
					
				</td>
				<td>
					<label>交易类型：</label>
					<span id="bankTransType" style="text-align:center;line-height:21px;">${paymentError.bankTransType eq "1021"? "消费" : paymentError.bankTransType eq "2021" ?"消费冲正" : paymentError.bankTransType eq "3021"? "消费撤销" : paymentError.bankTransType eq "4021" ? "消费撤销冲正" : paymentError.bankTransType eq "1061"? "退货" : ""}</span>
				</td>
			</tr>
			<tr>
				<td>
					<label id="transTime_label">交易时间：</label>
					<span id="transTime" style="text-align:center;line-height:21px;"> <fmt:formatDate value="${paymentError.transTime }" pattern="yyyy-MM-dd HH:mm:ss"/> </span>
				</td>
				<td>
					<label>交易时间：</label>
					<span id="transTime_postal" style="text-align:center;line-height:21px;">
						<fmt:parseDate value="${paymentError.currentDate}${paymentError.currentTime }" pattern="yyyyMMddHHmmss" var="currentDateAndTime"/>   
						<fmt:formatDate value="${currentDateAndTime}" pattern="yyyy-MM-dd HH:mm:ss"/> 
					</span>
				</td>		
			</tr>
			<tr>
				<td>
					<label id="clearDate_label">清算日期：</label>
					<span id="clearDate" style="text-align:center;line-height:21px;">
						<fmt:formatDate value="${paymentError.clearDate }" pattern="yyyy-MM-dd"/>
					</span>
				</td>
				<td>
					<label>清算日期：</label>
					<span id="bankClearDate" style="text-align:center;line-height:21px;">
						<fmt:parseDate value="${paymentError.bankClearDate }" pattern="yyyyMMdd" var="bankClearDate"/>   
						<fmt:formatDate value="${bankClearDate}" pattern="yyyy-MM-dd"/>
					</span>
				</td>	
			</tr>
			<tr>
				<td>
					<label id="transStatus_view_label">交易状态：</label>
					<span id="transStatus_view">
						<dwz:dicItem themeName="payment_transStatus" id="transStatus" paramName="transStatus" style="text-align:center;line-height:21px;" selectedValue="${paymentError.transStatus }" displayOnly="true"/>
					</span>
				</td>
				<td>
					<label>交易状态：</label>
					<span id="bankStatus_view" style="text-align:center;line-height:21px;">
						<c:if test="${!empty paymentError.bankStatus }">
							<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.BANK_STATUS %>" dataValue="${paymentError.bankStatus }"/>
						</c:if>
					</span>
				</td>
			</tr>
			<tr>
				<td>
					<label>卡支付系统订单号：</label>${paymentError.order.cpsOrderId}
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>业务订单号：</label>${paymentError.bizorderId}
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>内部批次号：</label>${paymentError.batchNo}
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>内部流水号：</label>${paymentError.transNo}
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>原内部批次号：</label>${paymentError.oldbatchNo}
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>原内部流水号：</label> ${paymentError.oldtransNo}
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>内部终端编号：</label>${paymentError.termNo}
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>内部商户编号：</label>${paymentError.merchNo}
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>卡类型 ：</label>
					<dwz:dicItem themeName="card_type" style="text-align:center;line-height:21px;" selectedValue="${paymentError.cardType}" displayOnly="true"/>
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>授权码：</label>${paymentError.authId}
				</td>
				<td>
				</td>
			</tr>
		</table>
	</div>			
</div>