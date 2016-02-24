<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<style>
.h-fieldest{ border:1px solid #ddd;}
.h-fieldest legend{ color:#000; background:none;}
.h-formcntent-table td{ height:25px; color:#999}
.h-formcntent-table span{ color:#000;}
</style>
<script>
$(document).ready(function() {
	//打开页面初始化
	var bankClearDate = $("#bankClearDate").text().trim();
	var transTime_postal = $("#transTime_postal").text().trim();
	var bankFlag = $("#bankFlag").text().trim();
	var bankTransType = $("#bankTransType").text().trim();
	var bankTerminalNo = $("#bankTerminalNo").text().trim();
	var bankRefNo = $("#bankRefNo").text().trim();
	var accountNo = $("#accountNo").text().trim();
	var waterNo = $("#waterNo").text().trim();
	var bankMoney = $("#bankMoney").text().trim();
	var bankFee = $("#bankFee").text().trim();
	var skfId = $("#skfId").text().trim();
	var bankStatus = $("#bankStatus").text().trim();
	var dzErrType = $("#dzErrType").val().trim();
	var update_status_filter = "${updateStatusCompleteCode}";//调账完成必须修改成功标识
	var inClearing = "${inClearingCode}";//参与清分
	var mybankTransTypeCode;//拼接交易类型码
	if(bankTransType == '消费'){
		mybankTransTypeCode = 'X';
	}else if(bankTransType == '消费撤销'){
		mybankTransTypeCode = 'C';
	}else if(bankTransType == '退货'){
		mybankTransTypeCode = 'T';
	}
	var mybankFlag;//拼接验证成功标识码
	if(bankFlag == '成功'){
		mybankFlag = '0';
	}else{
		mybankFlag = '1';
	}
	var mybankStatus;//拼接交易状态码
	if(bankStatus == '初始'){
		mybankStatus = '0';
	}else if(bankStatus == '被撤销'){
		mybankStatus = '1';
	}else if(bankStatus == '被冲正'){
		mybankStatus = '2';
	}else if(bankStatus == '被完成'){
		mybankStatus = '3';
	}else if(bankStatus == '被退货'){
		mybankStatus = '4';
	}else if(bankStatus == '被退单'){
		mybankStatus = '5';
	}
	var verificationCode = mybankTransTypeCode+dzErrType+mybankFlag+mybankStatus;
	
	if(inClearing.indexOf(verificationCode) >= 0){
		$("#tzClearing").val('Y');
		$("#isTzClearing").text('是');
	}
	if(update_status_filter.indexOf(dzErrType) >= 0){
		$("#synchronousButton").css("display","none");
	}
	var transCode = $("#transCode option:selected").text().trim();
	if(transCode != bankFlag) {
		$("#transCode").css("color","red");
		$("#transCode_label").css("color","red");
	}else{
		$("#transCode").css("color","black");
		$("#transCode_label").css("color","black");
		$("#transCode").css({"background": "#EEEEEE"});
		$("#transCode").attr("disabled",true);
	}
	var transId_update = $("#transId_update option:selected").text().trim();
	if(transId_update != bankTransType) {
		$("#transId_update").css("color","red");
		$("#transId_label").css("color","red");
	}else{
		$("#transId_update").css("color","black");
		$("#transId_label").css("color","black");
		$("#transId_update").css({"background": "#EEEEEE"});
		$("#transId_update").attr("disabled",true);
	}
	var transTime = $("#transTime").val().trim();
	if(transTime != transTime_postal) {
		$("#transTime").css("color","red");
		$("#transTime_label").css("color","red");
	}else{
		$("#transTime").css("color","black");
		$("#transTime_label").css("color","black");
		$("#transTime").css({"background": "#EEEEEE"});
		$("#transTime").attr("disabled",true);
	}
	var clearDate = $("#clearDate").val().trim();
	if(clearDate != bankClearDate) {
		$("#clearDate").css("color","red");
		$("#clearDate_label").css("color","red");
	}else{
		$("#clearDate").css("color","black");
		$("#clearDate_label").css("color","black");
		$("#clearDate").css({"background": "#EEEEEE"});
		$("#clearDate").attr("disabled",true);
	}
	var cardType = $("#cardType option:selected").val().trim();
	if(cardType != ""){
		$("#cardType").css({"background": "#EEEEEE"});
		$("#cardType").attr("disabled",true);
	}
	$("#isTzClearing").click(function(){
		if($("input[type='checkbox']").is(':checked')){
			$("#tzClearing").val("Y");
		}else{
			$("#tzClearing").val("N");
		}
	});
	var transStatus = $("#transStatus option:selected").text().trim();
	if(transStatus=='--请选择--'){
		transStatus = '未知';
	}
	if(transStatus != bankStatus){
		$("#transStatus").css("color","red");
		$("#transStatus_label").css("color","red");
	}else{
		$("#transStatus").css("color","black");
		$("#transStatus_label").css("color","black");
		$("#transStatus").css({"background": "#EEEEEE"});
		$("#transStatus").attr("disabled",true);
	}
	//提交时校验
	$("button[name='submit']").click(function() {
		if(update_status_filter.indexOf(dzErrType) >= 0){
			var transCode = $("#transCode  option:selected").text().trim();
			if(transCode != '失败') {
				alertMsg.error('由于邮储没有相对应的数据，请将交易流水的【成功标识】修改为‘失败’后重新提交！');
				return;
			}
		}else{
			var refNo = $("#refNo").val().trim();
			var bankRefNo = $("#bankRefNo").text().trim();
			if(refNo != bankRefNo) {
				alertMsg.error('您提交的参考号不一致，请检查后重新提交！');
				return;
			}
			var cardNo = $("#cardNo").val().trim();
			var accountNo = $("#accountNo").text().trim();
			if(cardNo != accountNo) {
				alertMsg.error('您提交的卡号不一致，请检查后重新提交！');
				return;
			}
			var bankTransNo = $("#bankTransNo").val().trim();
			var waterNo = $("#waterNo").text().trim();
			if(bankTransNo != waterNo) {
				alertMsg.error('您提交的外部流水号不一致，请检查后重新提交！');
				return;
			}
			var money = $("#money").val().trim();
			var bankMoney = $("#bankMoney").text().trim();
			if(money != bankMoney) {
				alertMsg.error('您提交的交易金额不一致，请检查后重新提交！');
				return;
			}
			var fee = $("#fee").val().trim();
			var bankFee = $("#bankFee").text().trim();
			if(fee != bankFee) {
				alertMsg.error('您提交的手续费不一致，请检查后重新提交！');
				return;
			}
			var externalMerchno = $("#externalMerchno").val().trim();
			var skfId = $("#skfId").text().trim();
			if(externalMerchno != skfId) {
				alertMsg.error('您提交的外部商户编号不一致，请检查后重新提交！');
				return;
			}
			var externalTermno = $("#externalTermno").val().trim();
			
			if(externalTermno != bankTerminalNo) {
				alertMsg.error('您提交的外部终端编号不一致，请检查后重新提交！');
				return;
			}
			var transCode = $("#transCode option:selected").text().trim();
			if(transCode != bankFlag) {
				alertMsg.error('您提交的交易流水状态不一致，请检查后重新提交！');
				return;
			}
			var transId_update = $("#transId_update  option:selected").text().trim();
			if(transId_update != bankTransType) {
				alertMsg.error('您提交的交易类型不一致，请检查后重新提交！');
				return;
			}
			var transTime = $("#transTime").val().trim();
			$("#transTime_card").val(transTime);
			if(transTime != transTime_postal) {
				alertMsg.error('您提交的交易时间不一致，请检查后重新提交！');
				return;
			}
			var clearDate = $("#clearDate").val().trim();
			$("#clearDate_card").val(clearDate);
			if(clearDate != bankClearDate) {
				alertMsg.error('您提交的清算日期不一致，请检查后重新提交！');
				return;
			}
			var transStatus = $("#transStatus option:selected").text().trim();
			if(transStatus != bankStatus){
				alertMsg.error('您提交的交易状态不一致，请检查后重新提交！');
				return;
			}
			var tzComplete = $('#tzComplete').val();
			if(tzComplete == 'tzComplete'){
				var cpsOrderId = $("#cpsOrderId").val().trim();
				if(cpsOrderId == ''){
					alertMsg.error('卡支付系统订单号不能为空！');
					return;
				}
				var bizorderId = $("#bizorderId").val().trim();
				if(bizorderId == ''){
					alertMsg.error('业务订单号不能为空！');
					return;
				}
			}
		}
		var tzComplete = $('#tzComplete').val();
		if(tzComplete == 'tzComplete'){
			alertMsg.confirm("确认要调账完成吗?调账完成后不能再调该条数据。", {
				okCall: function(){
					$("#updateForm").submit();
					return true;
				}
			});
		}else{
			$("#updateForm").submit();
			return true;
		}
	});
	//文本框里的值被修改时校验
	$("#refNo").change(function() {
		var refNo = $("#refNo").val().trim();
		if(refNo != bankRefNo) {
			$("#refNo").css("color","red");
		}else{
			$("#refNo").css("color","black");
		}
	});
	$("#cardNo").change(function() {
		var cardNo = $("#cardNo").val().trim();
		if(cardNo != accountNo) {
			$("#cardNo").css("color","red");
		}else{
			$("#cardNo").css("color","black");
		}
	});
	$("#bankTransNo").change(function() {
		var bankTransNo = $("#bankTransNo").val().trim();
		if(bankTransNo != waterNo) {
			$("#bankTransNo").css("color","red");
		}else{
			$("#bankTransNo").css("color","black");
		}
	});
	$("#money").change(function() {
		var money = $("#money").val().trim();
		if(money != bankMoney) {
			$("#money").css("color","red");
		}else{
			$("#money").css("color","black");
		}
	});
	$("#fee").change(function() {
		var money = $("#fee").val().trim();
		if(money != bankMoney) {
			$("#fee").css("color","red");
		}else{
			$("#fee").css("color","black");
		}
	});
	$("#externalMerchno").change(function() {
		var externalMerchno = $("#externalMerchno").val().trim();
		if(externalMerchno != skfId) {
			$("#externalMerchno").css("color","red");
		}else{
			$("#externalMerchno").css("color","black");
		}
	});
	$("#externalTermno").change(function() {
		var externalTermno = $("#externalTermno").val().trim();
		if(externalTermno != bankTerminalNo) {
			$("#externalTermno").css("color","red");
		}else{
			$("#externalTermno").css("color","black");
		}
	});	
	$("#transCode").change(function() {
		var transCode = $("#transCode  option:selected").text().trim();
		if(transCode != bankFlag) {
			$("#transCode").css("color","red");
		}else{
			$("#transCode").css("color","black");
		}
	});
	$("#transId_update").change(function() {
		var transId = $("#transId_update  option:selected").text().trim();
		if(transId != bankTransType) {
			$("#transId_update").css("color","red");
		}else{
			$("#transId_update").css("color","black");
		}
	});
	$("#transTime").change(function() {
		var transTime = $("#transTime").val().trim();
		if(transTime != transTime_postal) {
			$("#transTime").css("color","red");
		}else{
			$("#transTime").css("color","black");
		}
	});	
	$("#transStatus").change(function() {
		var transStatus = $("#transStatus option:selected").text().trim();
		if(transStatus=='--请选择--'){
			transStatus = '未知';
		}
		if(transStatus != bankStatus){
			$("#transStatus").css("color","red");
		}else{
			$("#transStatus").css("color","black");
		}
	});	
	//同步数据
	$("#synchronous").click(function(){
		var refNo = $("#refNo").val();
		var cardNo = $("#cardNo").val();
		var bankTransNo = $("#bankTransNo").val();
		var money = $("#money").val();
		var fee = $("#fee").val();
		var externalMerchno = $("#externalMerchno").val();
		var externalTermno = $("#externalTermno").val();
		var transCode = $("#transCode  option:selected").text().trim();
		var transId_update = $("#transId_update  option:selected").text().trim();
		var transTime = $("#transTime").val().trim();
		var clearDate = $("#clearDate").val().trim();
		var transStatus = $("#transStatus option:selected").text().trim(); 
		$("#transTime_card").val(transTime);
		$("#clearDate_card").val(clearDate);
		if(refNo==bankRefNo
		 &&cardNo==accountNo
		 &&bankTransNo==waterNo
		 &&money==bankMoney
		 &&externalMerchno==skfId
		 &&externalTermno==bankTerminalNo
		 &&transCode==bankFlag
		 &&transId_update==bankTransType
		 &&transTime==transTime_postal
		 &&clearDate==bankClearDate
		 &&fee==bankFee
		 &&transStatus==bankStatus){
			alertMsg.correct("数据已同步！");
			return;
		}
		alertMsg.confirm("确定将邮储的数据同步到卡支付系统吗？", { 
			okCall: function(){   
				$("#refNo").val(bankRefNo);
				$("#cardNo").val(accountNo);
				$("#bankTransNo").val(waterNo);
				$("#money").val(bankMoney);
				$("#fee").val(bankFee);
				$("#externalMerchno").val(skfId);
				$("#externalTermno").val(bankTerminalNo);
				$("#transCode option").each(function(){
					if(bankFlag==''){
						bankFlag='失败';
					}
					if($(this).text()==bankFlag){
						$(this).attr("selected",true);
					}
				});
				$("#transId_update option").each(function(){
					if(bankTransType==''){
						bankTransType = '未知';
					}
					if($(this).text()==bankTransType){
						$(this).attr("selected",true);
					}
				});
				$("#transTime").val(transTime_postal);
				$("#transTime_card").val(transTime_postal);
				$("#clearDate").val(bankClearDate);
				$("#clearDate_card").val(clearDate);
				$("#transStatus option").each(function(){
					if($(this).text()==bankStatus){
						$(this).attr("selected",true);
					}
				});
				var refNo = $("#refNo").val().trim();
				if(refNo != bankRefNo) {
					$("#refNo").css("color","red");
				}else{
					$("#refNo").css("color","black");
				}
				var cardNo = $("#cardNo").val().trim();
				if(cardNo != accountNo) {
					$("#cardNo").css("color","red");
				}else{
					$("#cardNo").css("color","black");
				}
				var bankTransNo = $("#bankTransNo").val().trim();
				if(bankTransNo != waterNo) {
					$("#bankTransNo").css("color","red");
				}else{
					$("#bankTransNo").css("color","black");
				}
				var money = $("#money").val().trim();
				if(money != bankMoney) {
					$("#money").css("color","red");
				}else{
					$("#money").css("color","black");
				}
				var fee = $("#fee").val().trim();
				if(money != bankMoney) {
					$("#fee").css("color","red");
				}else{
					$("#fee").css("color","black");
				}
				var externalMerchno = $("#externalMerchno").val().trim();
				if(externalMerchno != skfId) {
					$("#externalMerchno").css("color","red");
				}else{
					$("#externalMerchno").css("color","black");
				}
				var externalTermno = $("#externalTermno").val().trim();
				if(externalTermno != bankTerminalNo) {
					$("#externalTermno").css("color","red");
				}else{
					$("#externalTermno").css("color","black");
				}
				var transCode = $("#transCode  option:selected").text().trim();
				if(transCode != bankFlag) {
					$("#transCode").css("color","red");
				}else{
					$("#transCode").css("color","black");
				}
				var transId_update = $("#transId_update  option:selected").text().trim();
				if(transId_update != bankTransType) {
					$("#transId_update").css("color","red");
				}else{
					$("#transId_update").css("color","black");
				}
				var transTime = $("#transTime").val().trim();
				if(transTime != transTime_postal) {
					$("#transTime").css("color","red");
				}else{
					$("#transTime").css("color","black");
				}
				var clearDate = $("#clearDate").val().trim();
				if(clearDate != bankClearDate) {
					$("#clearDate").css("color","red");
				}else{
					$("#clearDate").css("color","black");
				}
				var transStatus = $("#transStatus  option:selected").text().trim();
				if(transStatus != bankStatus) {
					$("#transStatus").css("color","red");
				}else{
					$("#transStatus").css("color","black");
				}
				
				alertMsg.correct("同步成功！");
			 }  
		});
	});
	//鼠标悬浮在参与清分问号图片上出现清分描述
	$("#HErrorTip_img").mouseover(function(){
		$("#whatTip").show();
	}).mouseout(function(){
		$("#whatTip").hide();
	});
});
</script>
<div class="pageContent">
<form method="post" id="updateForm" action="${contextPath }/management/order/paymentError/update" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<input type="hidden" id="id" name="id" value="${paymentError.id}"/>
	<input type="hidden" id="tzComplete" name="tzComplete"/>
	<div class="panelBar">
	</div>
	<div class="pageFormContent" layoutH="88">
		<div style="width:95%; margin:0 auto; position:relative;">	
		<fieldset class="h-fieldest">
            <legend>对账结果</legend>
            <table class="h-formcntent-table" style="width:100%;">
                <tr>
					<td  width="90" align="right">
						<span>对账时间：</span>
					</td>
					<td>
						<input type="text" readonly="readonly" style="width:190px;" value="<fmt:formatDate value='${paymentError.dzTime }' pattern='yyyy-MM-dd HH:mm:ss'/>"/>
					</td>
					<td width="90" align="right">
						<span>对账错误类型：</span>
					</td>
					<td>
						<dwz:dicItem themeName="dzErrType" paramName="dzErrType" style="font-size:12px;font-family: Arial, sans-serif; color: #999" selectedValue="${paymentError.dzErrType}"  displayOnly="true"/>
						<input type="hidden" id="dzErrType" value="${paymentError.dzErrType}"/>
					</td>
				</tr>
			</table>
        </fieldset>
		<fieldset class="h-fieldest">
            <legend>调账结果</legend>
            <table class="h-formcntent-table" style="width:100%;">
                <tr>
					<td width="90" align="right">
						<span>调账时间：</span>
					</td>
					<td>
						<input type="text" readonly="readonly" style="width:190px;" value="<fmt:formatDate value='${paymentError.tzTime }' pattern='yyyy-MM-dd HH:mm:ss'/>"/>
					</td>
					<td width="90" align="right">
						<span>调账状态：</span>
					</td>
					<td>
						<input type="text" readonly="readonly" style="width:190px;" value="<dwz:dataConvert name='<%=com.rongbang.utils.PlatformConstants.PAYMENTERROR_STATUS %>' dataValue='${paymentError.tzStatus }'/>"/>
					</td>
				</tr>
				<tr>
					<td align="right" width="90">
						<span>调账备注：</span>
					</td>
					<td>
						<textarea id="tzRemark" name="tzRemark" maxlength="2000" style="width:98%; border:1px solid #eee; height:40px; resize:none; overflow:auto; font-size:12px;">${paymentError.tzRemark}</textarea>
					</td>
					<td align="right" width="90">
						<span>是否参与清分：</span>
					</td>
					<td style="position:relative;">
						<span id="isTzClearing" style="line-height:25px;">否</span>
						<input type="hidden" id="tzClearing" name="tzClearing" value="N"/> 
						<img id="HErrorTip_img" alt="参与" src="${contextPath }/styles/dwz/themes/default/images/yz/Information.png"/>
						<div id="whatTip">邮储无数据（或已撤销、失败等），无需清分；反之则需清分，若需清分，则被调账的流水将会在调账完成的第二天参与清分。</div>	 
						
					</td>
				</tr>
			</table>
        </fieldset>
        </div>
		<table class="paymentError_view">
			<tr align="center">
				<th width="55%"><strong>卡支付系统</strong></th>	
				<th width="45%"><strong>邮储</strong></th>
			</tr>
			<tr>
				<td>
					<label ${paymentError.refNo eq paymentError.bankRefNo ? "":"style='color:red;' "}>参考号 ：</label>
					<input type="text" id="refNo" name="refNo" class="w190" maxlength="19" value="${paymentError.refNo}" ${paymentError.refNo eq paymentError.bankRefNo ? "":"style='color:red;'"} ${empty paymentError.refNo?"" : (paymentError.refNo eq paymentError.bankRefNo ?"readonly='readonly'":"")}/>
				</td>
				<td>
					<label>参考号：</label>
					<span id="bankRefNo" style="text-align:center;line-height:21px;">${paymentError.bankRefNo}</span>
				</td>
			</tr>
			<tr>
				<td>
					<label ${paymentError.cardNo eq paymentError.accountNo ? "":"style='color:red;' "} >主账号/卡号 ：</label>
					<input type="text" id="cardNo" name="cardNo" class="w190" maxlength="19" value="${paymentError.cardNo}" ${paymentError.cardNo eq paymentError.accountNo ? "":"style='color:red;'"} ${empty paymentError.cardNo?"" : (paymentError.cardNo eq paymentError.accountNo ?"readonly='readonly'":"")}/>
				</td>	
				<td>
					<label>主账号/卡号 ：</label>
					<span id="accountNo" style="text-align:center;line-height:21px;">${paymentError.accountNo}</span>
				</td>
			</tr>
			<tr>
				<td>
					<label ${paymentError.bankTransNo eq paymentError.waterNo ? "":"style='color:red;'"}>外部流水号 ：</label>
					<input type="text" id="bankTransNo" name="bankTransNo" class="w190" maxlength="8" value="${paymentError.bankTransNo}" ${paymentError.bankTransNo eq paymentError.waterNo ? "":"style='color:red;'"} ${empty paymentError.bankTransNo?"":(paymentError.bankTransNo eq paymentError.waterNo ?"readonly='readonly'":"")}/>
				</td>	
				<td>
					<label>外部流水号 ：</label>
					<span id="waterNo" style="text-align:center;line-height:21px;">${paymentError.waterNo }</span>
				</td>
			</tr>
			<tr>
				<td>
					<label ${paymentError.money eq paymentError.bankMoney ? "":"style='color:red;'"}>交易金额(元)：</label>
					<input type="text" name="money" id="money" class="w190" maxlength="12" value="${paymentError.money }" ${paymentError.money eq paymentError.bankMoney ? "":"style='color:red;'"} ${empty paymentError.money?"":(paymentError.money eq paymentError.bankMoney ? "readonly='readonly'":"")}/>
				</td>
				<td>
					<label>交易金额(元)：</label>
					<span id="bankMoney" style="text-align:center;line-height:21px;">
						${paymentError.bankMoney}
					</span>
				</td>
			</tr>
			<tr>
				<td>
					<label ${paymentError.fee eq paymentError.bankFee ? "":"style='color:red;'"}>手续费 (元)：</label>
					<input type="text" name="fee" id="fee" class="w190" maxlength="12" value="${paymentError.fee }" ${paymentError.fee eq paymentError.bankFee ? "":"style='color:red;'"} ${empty paymentError.fee?"":(paymentError.fee eq paymentError.bankFee ? "readonly='readonly'":"")}/>
				</td>
				<td>
					<label>手续费 (元)：</label>
					<span id="bankFee" style="text-align:center;line-height:21px;">${paymentError.bankFee }</span>
				</td>	
			</tr>
			<tr>
				<td>
					<label ${paymentError.externalMerchno eq paymentError.skfId ? "":"style='color:red;'"}>外部商户编号：</label>
					<input type="text" id="externalMerchno" name="externalMerchno" class="w190" maxlength="15" value="${paymentError.externalMerchno}" ${paymentError.externalMerchno eq paymentError.skfId ? "":"style='color:red;'"} ${empty paymentError.externalMerchno?"":(paymentError.externalMerchno eq paymentError.skfId ? "readonly='readonly'":"")}/>
				</td>
				<td>
					<label title="邮政的数据称之为'受卡方标识号'">外部商户编号：</label>
					<span id="skfId" style="text-align:center;line-height:21px;">${paymentError.skfId }</span>
				</td>
			</tr>
			<tr>
				<td>
					<label  ${paymentError.externalTermno eq paymentError.bankTerminalNo ? "":"style='color:red;'"}>外部终端编号：</label>
					<input type="text" id="externalTermno" name="externalTermno" class="w190" maxlength="8" value="${paymentError.externalTermno}" ${paymentError.externalTermno eq paymentError.bankTerminalNo ? "":"style='color:red;'"} ${empty paymentError.externalTermno?"":(paymentError.externalTermno eq paymentError.bankTerminalNo ? "readonly='readonly'":"")}/>
				</td>	
				<td>
					<label title="邮政的数据称之为'终端标识码' ">外部终端编号：</label>
					<span id="bankTerminalNo" style="text-align:center;line-height:21px;">${paymentError.bankTerminalNo}</span>
				</td>
			</tr>
			<tr>
				<td>
					<label id="transCode_label">成功标识 ：</label>
					<select id="transCode" name="transCode" class="re_select196" >
							<option value="">--请选择--</option>
							<option value="F0" ${paymentError.transCode eq "F0"?"selected":""}>成功</option>
							<option value="FZ" ${paymentError.transCode eq "FZ"?"selected":""}>失败</option>
					</select>
				</td>
				<td>
					<label>成功标识 ：</label>
					<span id="bankFlag" style="text-align:center;line-height:21px;">
						<c:if test="${!empty paymentError.bankFlag }">
							<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.BANK_FLAG %>" dataValue="${paymentError.bankFlag }"/>
						</c:if>
					</span>
				</td>
			</tr>
			<tr>
				<td>
					<label id="transId_label">交易类型：</label>
					<select id="transId_update" name="transId"  class="re_select196"> 
						<option value="">--请选择--</option>
						<option value="200022" ${paymentError.transId eq "200022"?"selected":""}>消费</option>
						<option value="200023" ${paymentError.transId eq "200023"?"selected":""}>消费撤销</option>
						<option value="200024" ${paymentError.transId eq "200024"?"selected":""}>退货</option>
					</select>
				</td>
				<td>
					<label>交易类型：</label>
					<span id="bankTransType" style="text-align:center;line-height:21px;">
					${paymentError.bankTransType eq "1021"? "消费" : 
					  paymentError.bankTransType eq "2021" ?"消费冲正" : 
					  paymentError.bankTransType eq "3021"? "消费撤销" : 
					  paymentError.bankTransType eq "4021" ? "消费撤销冲正" : 
					  paymentError.bankTransType eq "1061"? "退货" : ""}</span>
				</td>
			</tr>		
			<tr>
				<td>
					<label id="transTime_label">交易时间：</label>
					<c:if test="${!empty paymentError.transTime}">
						<input type="text" id="transTime" name="transTime_cards" class="w190" maxlength="19" value="<fmt:formatDate value='${paymentError.transTime}' pattern='yyyy-MM-dd HH:mm:ss' />"/>
						<input type="hidden" id="transTime_card"  name="transTime_card" value="${paymentError.transTime}"/>
					</c:if>
					<c:if test="${empty paymentError.transTime}">
						<div style="width:336px; position:relative;">
							<input type="text" id="transTime" name="transTime_card" maxDate="${limitSelectTime }" class="date required" dateFmt="yyyy-MM-dd HH:mm:ss"  maxlength="19"  readonly="readonly" style="float:left; width:175px;" value="${paymentError.transTime }"/>
							<a class="inputDateButton" href="javascript:;" style=" position:absolute; right:10px; top:0;">选择</a>
						</div>
					</c:if>
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
					<c:if test="${!empty paymentError.clearDate}">
						<input type="text" id="clearDate" name="clearDate_cards" class="w190" maxlength="19" value="<fmt:formatDate value='${paymentError.clearDate }' pattern='yyyy-MM-dd'/>" readonly="readonly"/>
						<input type="hidden" id="clearDate_card" name="clearDate_card" value="${paymentError.clearDate }"/>
					</c:if>
					<c:if test="${empty paymentError.clearDate}">
						<div style="width:336px; position:relative;">
							<input type="text" id="clearDate" name="clearDate_card" class="date required" maxDate="${limitSelectTime }" dateFmt="yyyy-MM-dd"  maxlength="19"  readonly="readonly" style="float:left; width:175px;" value="${paymentError.clearDate }"/>
							<a class="inputDateButton" href="javascript:;" style=" position:absolute; right:10px; top:0;">选择</a>
						</div>
					</c:if>
				</td>
				<td>
					<label>清算日期：</label>
					<span id="bankClearDate"  style="text-align:center;line-height:21px;">
						<fmt:parseDate value="${paymentError.bankClearDate }" pattern="yyyyMMdd" var="bankClearDate"/>   
						<fmt:formatDate value="${bankClearDate}" pattern="yyyy-MM-dd"/> 
					</span>
				</td>	
			</tr>
			<tr>
				<td>
					<label id="transStatus_label">交易状态：</label>
					<dwz:dicItem themeName="payment_transStatus" id="transStatus" paramName="transStatus" className="re_select196" selectedValue="${paymentError.transStatus }"/>
				</td>
				<td>
					<label>交易状态：</label>
					<span id="bankStatus" style="line-height: 20px;">
						<c:if test="${!empty paymentError.bankStatus }">
							<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.BANK_STATUS %>" dataValue="${paymentError.bankStatus }"/>
						</c:if>
					</span>
				</td>
			</tr>
			<tr>
				<td>
					<label>卡支付系统订单号：</label>
					<input type="text" id="cpsOrderId" name="cpsOrderId" class="w190 required" maxlength="20" value="${paymentError.order.cpsOrderId}"/>
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>业务订单号：</label>
					<input type="text" id="bizorderId" name="bizorderId" class="w190 required" maxlength="100" value="${paymentError.bizorderId}"/>
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>内部批次号：</label>
					<input type="text" name="batchNo" class="w190" maxlength="6" value="${paymentError.batchNo}" ${empty paymentError.batchNo?"":"readonly='readonly'"}/>
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>内部流水号：</label>
					<input type="text" name="transNo" class="w190" maxlength="6" value="${paymentError.transNo}" ${empty paymentError.transNo?"":"readonly='readonly'"}/>
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>原内部批次号：</label>
					<input type="text" name="oldbatchNo" class="w190" maxlength="6" value="${paymentError.oldbatchNo}"${empty paymentError.oldbatchNo?"":"readonly='readonly'"}/>
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>原内部流水号：</label>
					<input type="text" name="oldtransNo" class="w190" maxlength="6" value="${paymentError.oldtransNo}" ${empty paymentError.oldtransNo?"":"readonly='readonly'"} />
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>内部终端编号：</label>
					<input type="text" name="termNo" class="w190" maxlength="8" value="${paymentError.termNo}"${empty paymentError.termNo?"":"readonly='readonly'"}/>
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>内部商户编号：</label>
					<input type="text" name="merchNo" class="w190 " maxlength="15" value="${paymentError.merchNo}" ${empty paymentError.merchNo?"":"readonly='readonly'"}/>
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>卡类型 ：</label>
						<dwz:dicItem themeName="card_type" id="cardType" paramName="cardType" className="re_select196" selectedValue="${paymentError.cardType}"/>
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td>
					<label>授权码：</label>
					<input type="text" name="authId" class="w190" maxlength="6" value="${paymentError.authId}"${empty paymentError.authId?"":"readonly='readonly'"}/>
				</td>
				<td>
				</td>
			</tr>
		</table>
	</div>			
	<div class="formBar">
		<ul>
			<li id="synchronousButton"><div class="button"><div class="buttonContent"><button id="synchronous" title="同步邮储系统数据到卡支付系统" type="button">同步</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button name="submit" type="button" onclick="$('#tzComplete').val('')">暂存</button></div></div></li>
			<li>
				<div class="button4"><div class="buttonContent"><button id="tzOver" name="submit" type="button" title="调账完成后不能再调该条数据。" onclick="$('#tzComplete').val('tzComplete')">调账完成</button></div></div>
			</li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>