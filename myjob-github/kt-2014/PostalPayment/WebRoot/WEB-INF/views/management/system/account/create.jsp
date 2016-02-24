<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>   

<script type="text/javascript">
	$("#bank_1").remoteChained("#bankTypeId_1", "${contextPath }/management/system/account/getBank");
	$("#bus_1").remoteChained("#supportSystem_1", "${contextPath }/management/system/account/getBusiness");
	$(document).ready(function(){
		$("#create_accountNoVO").blur(function() {
			if($(this).val() != $("#create_accountNo").val()){
				$("#create_accountNoVO_text").text("确认账号和账号不一致");
			}else{
				$("#create_accountNoVO_text").text("");
			}
		
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
<form id="accourtCreate_form" method="post" action="${contextPath }/management/system/account/create" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
		<input type="hidden" name="createdBy" value = "${login_user.id} " />
		<input type="hidden" name="updatedBy" value = "${login_user.id} " />
		<input type="hidden" name="orgLevel" />
	<%--	 bank_id  关联 ,  所属机构ID organization_id , 业务系统ID business_system_id 页面暂时不写--%>
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>账号：</label>
			<input type="text" name="accountNo"  id="create_accountNo" maxlength="30" class="w190 input-medium required validate[required] custom[number]"/>
		</p>
	
		<p>
			<label>确认账号：</label>
			<input type="text" name="accountNoVO" id="create_accountNoVO" maxlength="64" class="w190 input-medium required validate[required] custom[number]"/>
			<span id="create_accountNoVO_text" style="color: red"></span>
		</p>
	
		<p>
			<label>账户名称：</label>
			<input type="text" name="accountName" maxlength="50"  class="w190 input-medium required validate[required]"/>
		</p>
		
		<p class="re_select">
			<label>银行类型：</label>
			<select  id="bankTypeId_1" name="bankType" class="required" style="width:199px;">
				<option value="0">--请选择银行类型--</option>
					<c:forEach items="${bankTypes}" var="btype">
				      	<option value="${btype.id}">${btype.name }</option>
					</c:forEach>
			</select>
		</p>		
		<p class="re_select">		
				<label>银行网点：</label>
				<select   id="bank_1"  name="bank.id"  class="required" style="width:199px;">
					<option value="0">--请选择银行网点--</option>
				</select>
		</p>
		
		<p>
			<label>所属机构：</label>
			<input name="organization.code" type="hidden" />
			<input class="w190 required validate[required] textInput readonly " type="text" readonly="readonly" name="organization.name" data-prompt-position="centerRight:22,0" />
			<a class="btnLook" lookupgroup="organization" href="${contextPath }/management/system/account/lookup2org/create" mask="true" target="dialog" close="closeDialog" width="550" height="400">选择组织机构</a><br/>
		</p> 
		
		<p class="re_select">
			<label>业务系统：</label>
			<select     id="supportSystem_1" name="supportSystem.id" class="required" style="width:199px;">
			    <option value="0">--请选择系统--</option>
			  	<c:forEach items="${supportSystem}" var="supp">
								   <option value="${supp.id}">${supp.systemName}</option>
				</c:forEach>
			</select>
		</p>
		<p class="re_select">			  
			<label>业务种类：</label>
			<select  id="bus_1" name="business.id"  class="required" style="width:199px;">
				<option value="0">--请选择业务--</option>
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