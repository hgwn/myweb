<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<div class="pageContent">
<form method="post" action="${contextPath }/management/system/internalTerminalno/update" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<div class="pageFormContent" layoutH="58">
		<input type="hidden" name="id" value="${terminalno.id }" />	
		<input type="hidden" name="status" value="${terminalno.status }" />
		<p>
			<label>所属商户编号：</label>
			<input name="internalMerno.id" type="hidden" value="${terminalno.internalMerno.id }"/>
			<input class="w190 validate[required] required" value="${terminalno.internalMerno.merno }" name="internalMerno.merno" type="text" data-prompt-position="centerRight:22,0" readonly="readonly"/>
			<a class="btnLook" href="${contextPath }/management/system/internalTerminalno/lookup2merno" lookupGroup="internalMerno" title="所属商户编号" width="560">查找带回</a>	
		</p>
		<!--
		<p>
			<label>所属网点：</label>
			<input name="site.code" type="hidden" value="${terminalno.site.code }"/>
			<input class="w190 validate[required] required" value="${terminalno.site.name }" name="site.name" type="text" readonly="readonly" data-prompt-position="centerRight:22,0"/>
			<a class="btnLook" href="${contextPath }/management/system/internalTerminalno/lookup2org" lookupGroup="site" title="所属网点" width="560">查找带回</a>
		</p>
		-->
	</div>
			
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit" id="submBtn">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>