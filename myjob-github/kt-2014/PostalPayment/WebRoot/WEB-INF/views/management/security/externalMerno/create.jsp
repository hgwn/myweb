<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
//<!--
	$("#w_combox_business").remoteChained("#combox_system", "${contextPath }/management/system/business/select");
	var validFlag ;
	var repeatValid = function(){
		var validObj = $("#create_externalMernoId");
		var remote_url = validObj.attr("remote_url");
		var validAttrName = validObj.attr("name");
		var validAttrValue = encodeURI($.trim(validObj.attr("value")));
		var msgTip = validObj.attr("msgTip");
		if(validAttrValue!=""){
			var params = {};
			$.ajax({
				type:"post",
				url:remote_url,
				async:false,
				data:{"validWord":validAttrValue},
				dataType:"text",
				success:function(data){
						if(data=="yes"){
							$("#"+validAttrName+"Msg").attr("class","invalid");
							msg = "<font color='red'>"+msgTip+"已存在</font>";
						}else if(data=="no"){
							$("#"+validAttrName+"Msg").attr("class","");
							msg = "<font color='green'>"+msgTip+"可用</font>";
						}else{
							$("#"+validAttrName+"Msg").attr("class","invalid");
							msg = "<font color='red'>"+msgTip+"长度不够</font>";
						}
						$("#"+validAttrName+"Msg").html(msg);
					},
				error:function(data){
					alertMsg.error("调用失败");
				}});
		}
	}
	
	var validCodeAndName = function(){
		//var reg =/^[0]+(\.[0-9]+){0,1}$/;
		repeatValid();
		if($(".invalid").length>0){
			return false;
		}else{
			return true;
		}
		var reg=$("#feeRateID").val();
		var digitReg = /^\d{15}$/;
		if($(".invalid").length>0){
			return false;
		}
		if(!digitReg.test($(".merno").val())){
			alertMsg.warn("请输入合法的商户编号(15位数字)");
			return false;
		}
		if(reg>10 || reg<0){
			alertMsg.warn("请输入0到10的费率值！");
			return false;
		}
	}
	$(document).ready(function(){
	$(".repeatValid").keyup(function(){
			var v = $(this);
			clearTimeout(validFlag);
			validFlag = setTimeout(function(){
				repeatValid();
			},500);
		});
		$("#submBtn").click(function(){
			return validCodeAndName();
		});
	});
//-->
</script>
<div class="pageContent">
<form method="post" action="${contextPath }/management/security/externalMerno/create" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>外部商户编号：</label>
			<input type="text" remote_url="${contextPath }/management/security/externalMerno/isMernoExists" msgTip="商户编号" id="create_externalMernoId"
				name="merno" class="w190 repeatValid merno   validate[required] required"  minlength="15" maxlength="15"/>
				&nbsp;&nbsp;<span id="mernoMsg"></span>
		</p>
		<p>
			<label>外部商户名称：</label>
			<input  name="merName" type="text" class="w190 validate[required] required" maxlength="200"/>
		</p>
		<p>
			<label>关联机构：</label>	
			<select class="re_select196 " name="organization.code"  >
				<c:forEach var="item" items="${organizations}">
					<option value="${item.code }">${item.name }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>支付方式：</label>
			<select  class="re_select196" name="bankingNo.id">
				<c:forEach var="banking" items="${bankingNo}">
					<option value="${banking.id }">${banking.item1 }</option>
				</c:forEach>
			</select>
			<span style="color:#999; line-height:25px; padding-left:5px;">请选择支付方式</span>
		</p>
		<p>
			<label>手续费率(%)：</label>
			<input type="text" id="feeRateID" name="feeRate" class=" w190 feeRate  validate[required] required" data-prompt-position="bottomRight" maxlength="4"/>
			<span style="color:#999; line-height:25px; padding-left:5px;">费率范围0~10</span>
		</p>	
	</div>
			
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit" id="submBtn">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>