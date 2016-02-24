<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
	var validCodeAndName = function(){
		//var reg =/^[0]+(\.[0-9]+){0,1}$/;
		var reg=$("#feeRateID").val();
		var digitReg = /^\d{15}$/;
		
		if(!digitReg.test($(".update_merno").val())){
			alertMsg.warn("请输入合法的商户编号(15位数字)");
			return false;
		}
		if(reg>10 || reg<0){
			alertMsg.warn("请输入0到10的费率值！");
			return false;
		}
		var hidden_business_size=$("#hidden_business_size").val();
		var hidden_code=$("#hidden_code").val().trim();
		var update_orgCode=$("#update_orgCode").val().trim();
		if(hidden_business_size>0){
			if(hidden_code!=update_orgCode){
				alertMsg.warn("该商户已关联有业务，不能修改省份！");
				return false;
			}
		}
	}
	$(document).ready(function(){
		
		$("#merno_update_submBtn").click(function(){
			return validCodeAndName();
		});
	});
</script>
<div class="pageContent">
<form method="post" action="${contextPath }/management/security/externalMerno/update" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<input type="hidden" name="id" value="${externalMerno.id }" />
	<input type="hidden" name="status" value="${externalMerno.status }" />
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>外部商户编号：</label>
			<input type="text" name="merno" readOnly value="${externalMerno.merno}" class="w190 update_merno  validate[required,maxSize[32]] required" data-prompt-position="bottomRight"  minlength="15" maxlength="15"/>
		</p>
		<p>
			<label>外部商户名称：</label>
			<input  name="merName" type="text" value="${externalMerno.merName}" class="w190 validate[required] required" maxlength="200"/>
		</p>
		<p>
			<label>关联机构：</label>	
			<input type="hidden" id="hidden_business_size" value="${businessSize}"/>
			<input type="hidden" id="hidden_code" value="${externalMerno.organization.code}"/>
			<select class="re_select196 " id="update_orgCode" name="organization.code"  >
				<c:forEach var="item" items="${organizations}">
					<option value="${item.code }"
					<c:if test="${externalMerno.organization.code eq item.code}">
						selected="selected" 
					</c:if>
					>${item.name }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>支付方式：</label>
			<select  class="re_select196" name="bankingNo.id">
				<c:forEach var="banking" items="${bankingNo}">
					<option value="${banking.id }" 
					<c:if test="${externalMerno.bankingNo.id == banking.id }">
						selected="selected" 
					</c:if>>
					${banking.item1 }</option>
				</c:forEach>
			</select>
			<span style="color:#999; line-height:25px; padding-left:5px;">请选择支付方式</span>
		</p>
		<p>
			<label>手续费率(%)：</label>
			<input type="text" id="feeRateID" name="feeRate" value="${feeRate}" class="w190 update_feeRate  validate[required] required" data-prompt-position="bottomRight" maxlength="4"/>
			<span style="color:#999; line-height:25px; padding-left:5px;">费率范围0~10</span>
		</p>	
	</div>
			
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button id="merno_update_submBtn" type="submit">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>