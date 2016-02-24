<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
   $(document).ready(function(){
   	$("#sub_create").on("click",function(){
   		var parameterValue =  $("#parameterValue").val();
   		var parameterKey =  $("#parameterKey").val();
   		if(parameterKey == "CHECK_IS_NEXT_DAY_CLEAN" || parameterKey == "PRODUCE_IS_NEXT_DAY_CLEAN" || parameterKey=="CLEAN_IS_NEXT_DAY_CLEAN" || parameterKey=="TRANSFER_IS_NEXT_DAY_CLEAN" ){
   		    if(!(parameterValue == "1" || parameterValue == "0")){
   		      alertMsg.error(parameterKey+"的值填写有误，只能是1或者0,请认真检查以后在填写！");
   		      $("#parameterValue").focus();
   		      return false;
   		    }
   		}
   	});
   });
</script>
<div class="pageContent">
<form method="post" action="${contextPath }/management/security/parameter/create" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>参数名称：</label>
			<input type="text" id="parameterName" name="parameterName" class="w190 input-medium validate[required,maxSize[50]] required" maxlength="50"/>
		</p>
		<p>
			<label>值：</label>
			<input type="text" id="parameterValue" name="parameterValue" class="w190 input-medium validate[required,maxSize[100]] required" maxlength="100"/>
		</p>
		<p>
			<label>参数KEY：</label>
			<input type="text" id="parameterKey" name="parameterKey" class="w190 input-medium validate[required,maxSize[50]] required" maxlength="50"/>
		</p>
	</div>
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button id="sub_create" type="submit">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>