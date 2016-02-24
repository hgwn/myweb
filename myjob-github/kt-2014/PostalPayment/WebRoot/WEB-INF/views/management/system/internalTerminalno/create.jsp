<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
//<!--
	function closeDialog(param){
	    $.pdialog._current.data("close",'');
	    $.pdialog.closeCurrent();
	    $("#dialogBackground").show();
	    return false;
	}
	
	var sub_confirm=function(){
		var mernoid=$("#internalMerno_create_id").val();
		var merno=$("#internalMerno_create_merName").val();
		var count=$("#terminalCount_create_id").val();
		var reg1 =  /^\d+$/;
		if(!reg1.test(count) || count>1000){
			alertMsg.warn("请输入1到1000的整数");
			return false;
		}
		if(mernoid=="" || mernoid==null){
			alertMsg.warn("请选择内部商户");
			return false;	
		}
		alertMsg.confirm("内部商户:"+merno+"将创建"+count+"个终端号",{
			okCall:function(){
				$("#myForm").submit();
			}
		});
	}
//-->
</script>

<div class="pageContent">
<form method="post" id="myForm" action="${contextPath }/management/system/internalTerminalno/create" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<div class="pageFormContent" layoutH="58">
			
		<p>
			<label>所属商户编号：</label>
			<input name="internalMerno.id" type="hidden"/>
			<input class="w190 validate[required] required" id="internalMerno_create_id" name="internalMerno.merno" type="text" readonly="readonly" data-prompt-position="centerRight:22,0"/>
			<a class="btnLook" href="${contextPath }/management/system/internalTerminalno/lookup2merno" lookupGroup="internalMerno" title="所属商户编号" mask="true" target="dialog" close="closeDialog" width="900" height="450">选择商户编号</a>	
		</p>
		<p>
			<label>所属商户名称：</label>
			<input class="w190" readonly="readonly" id="internalMerno_create_merName" name="internalMerno.merName" type="text"/>
		</p>
		<p>
			<label>终端个数：</label>
			<input class="w190 digits validate[required] required" id="terminalCount_create_id" type="text" name="terminalCount" maxlength="4" value="1"/>
		</p>
		<p>
			<label>是否生成主密钥：</label>
			<input type="radio" name="isCreateKey" value="true" checked="checked"> 是
        	&nbsp;&nbsp;
			<input type="radio" name="isCreateKey" value="false"> 否
		</p>
	</div>
			
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="button" id="submBtn" onclick="sub_confirm()">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>