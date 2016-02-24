<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">

$("#bank_2").remoteChained("#bankTypeId_2", "${contextPath }/management/system/account/getBank");
$("#bus_2").remoteChained("#supportSystem_2", "${contextPath }/management/system/account/getBusiness");


	//var bankType = $("# bankType_2");
	//var bank = $("# bank_2");
		
	
	$(document).ready(function(){
		
		$("#accountName_2").keyup(function(){
			clearTimeout(nameValidFlag);
			codeValidFlag = setTimeout(isAccountNameExist,800);
		});
		
	});
	
	function closeDialog(){
		    $.pdialog._current.data("close",'');
		    $.pdialog.closeCurrent();
		    $("#dialogBackground").show();
	    	return false;
		}
</script>


<div class="pageContent">     
<form method="post" action="${contextPath }/management/system/account/update" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<input type="hidden"  name="id" value="${account.id}" />
	<input type="hidden"  name="createdBy" value="${account.createdBy}" />
	<input type="hidden"  name="updatedBy" value="${login_user.id}" />
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>账号：</label>
			<input type="text" name="accountNo"  maxlength="30" value="${account.accountNo}" class="w190 input-medium " readonly="readonly"/>
		</p>
	
		<p>
			<label>账户名称：</label>
			<input type="text" name="accountName"  maxlength="50" value="${account.accountName}" class="w190 input-medium required validate[required]"/>
			&nbsp;&nbsp;<span id="acc_nameMsg"></span>
		</p>
		
		<p class="re_combox">
			<label>银行类型：</label>
					<select id="bankTypeId_2"  name="bankType" style="width:199px;">
						<option value="0">--请选择银行类型--</option>
						<c:forEach items="${bankType}" var="btype">
					      	<option value="${btype.id}"  <c:if test='${selectBankType eq btype.id}'>selected</c:if> >${btype.name }</option>
						</c:forEach>
					</select>
		</p>
		<p class="re_combox">	
					<label>银行网点：</label>		
					<select name="bank.id" id="bank_2" style="width:199px;">
						<option value="0">--请选择银行网点--</option>
						<c:forEach items="${selectBanks}" var="sbank">
					      	<option value="${sbank.id}"  <c:if test='${sbank.id eq account.bank.id}'>selected</c:if> >${sbank.bankName }</option>
						</c:forEach>
					</select><br/>
		</p>
			
		<p>
					<label>所属机构：</label>
					<input name="organization.code" type="hidden" value="${account.organization.code}"/>	
					<input name="organization.orgLevel" type="hidden" value="${account.organization.orgLevel}"/>	  
					<input class="w190 required textInput readonly validate[required]" type="text" readonly="readonly" value="${account.organization.name}" name="organization.name">
					<a class="btnLook" lookupgroup="organization" href="${contextPath }/management/system/account/lookup2org/update" mask="true" target="dialog" close="closeDialog" width="550" height="400">选择组织机构</a><br/>
		</p> 
			
		<p class="re_combox">
					<label>业务系统：</label>
					<select  id="supportSystem_2"  name="supportSystem.id" ref=" bus_2" style="width:199px;">
								 <option value="0">--请选择系统--</option>
								<c:forEach items="${supportSystem}" var="supp">
								   <option value="${supp.id}"  <c:if test='${selectSupportSystem eq supp.id}'>selected</c:if> >${supp.systemName}</option>
								</c:forEach>
					  </select>
		</p>
			
		<p class="re_combox">
					<label>业务种类：</label>			 
					  <select  id="bus_2" name="business.id" style="width:199px;" >
					 	<option value="0">--请选择业务--</option>
					 	 <c:forEach items="${selectBusinesses}" var="sbus">
					      	<option value="${sbus.id}"  <c:if test='${sbus.id eq account.business.id}'>selected</c:if> >${sbus.businessName }</option>
						</c:forEach>
					  </select>
		</p>
	</div>
	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>





</form>
</div>