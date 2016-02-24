<%@page import="com.rongbang.utils.PlatformConstants"%>
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
<form method="post" action="${contextPath}/management/security/user/update" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<input type="hidden" name="id" value="${user.id}"/>
	<%-- <input type="hidden" name="createdBy" value="${user.createdBy}"/> --%>
	<%-- <input type="hidden" name="createTime" value="${user.createdTime}"/> --%>
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>登录名称：</label>
			<input type="text" name="username" class="w190 input-medium validate[required,maxSize[32]] required" maxlength="32" readonly="readonly" value="${user.username }"/>
		</p>
		<p>
			<label>姓名：</label>
			<input type="text" name="realname" class="w190 input-medium validate[required,maxSize[32]] required" maxlength="32" value="${user.realname }"/>
		</p>
		<p>
			<label>电话：</label>
			<input type="text" name="phone" class="w190 input-medium validate[custom[phone],maxSize[32]]" maxlength="32" value="${user.phone }"/>
		</p>
		<p>
			<label>身份证号：</label>
			<input type="text" name="idCardNo" class="w190 input-medium validate[custom[idcard],maxSize[18]]" maxlength="18" value="${user.idCardNo }"/>
		</p>
		<p>
			<label>用户邮箱：</label>
			<input type="text" name="email" class="w190 input-medium validate[custom[email],maxSize[128]]" maxlength="128" value="${user.email }"/>
		</p>		
		<p>
			<label>用户状态：</label>
			<select name="status" class="re_select196">
				<option value="<%=PlatformConstants.USER_STATUS_ENABLE %>" ${user.status == "E" ? 'selected="selected"' : ''}>可用</option>
				<option value="<%=PlatformConstants.USER_STATUS_DISABLE %>" ${user.status == "D" ? 'selected="selected"' : ''}>停用</option>
			</select>
		</p>
		<p>
			<label>关联组织：</label>
			<input name="organization.code" value="${user.organization.code }" type="hidden"/>
			<input class="w190 validate[required] required" name="organization.name" type="text" readonly="readonly" value="${user.organization.name }" data-prompt-position="centerRight:22,0"/>
			<a class="btnLook" href="${contextPath}/management/security/user/lookup2org/edit" lookupGroup="organization" title="关联组织" mask="true" target="dialog" close="closeDialog" width="550" height="400">查找带回</a>	
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