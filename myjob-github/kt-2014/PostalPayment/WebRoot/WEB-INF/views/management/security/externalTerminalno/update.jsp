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
	
//-->
</script>

<div class="pageContent">
<form id="externalTerminalno_search_update" method="post" action="${contextPath }/management/security/externalTerminalno/update" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<input type="hidden" name="id" value="${externalTerminalno.id }" />
	<input type="hidden" name="status" value="${externalTerminalno.status }" />
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>外部终端编号：</label>
			<input type="text" name="terminalno" readOnly value="${externalTerminalno.terminalno}" class="w190 validate[required,maxSize[32]] required" maxlength="32"/>
		</p>
		<p>
			<label>外部商户编号：</label>
			<input name="externalMerno.id" type="hidden" value="${externalTerminalno.externalMerno.id }"/>
			<input class="w190 validate[required] required" value="${externalTerminalno.externalMerno.merno }" name="externalMerno.merno" type="text" readonly="readonly" data-prompt-position="centerRight:22,0"/>
			<a class="btnLook" href="${contextPath }/management/security/externalTerminalno/lookup2merno" lookupGroup="externalMerno" title="外部商户编号" mask="true" target="dialog" close="closeDialog" width="900" height="450">选择商户编号</a>	
		</p>
		<p>
			<label>外部商户名称：</label>
			<input class="w190" name="externalMerno.merName" type="text" value="${externalTerminalno.externalMerno.merName }" readonly="readonly"/>
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