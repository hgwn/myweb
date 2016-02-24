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
<form id="user_search_form" method="post" action="${contextPath }/management/security/user/create" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>登录名称：</label>
			<input type="text" name="username" class="w190 input-medium validate[required,maxSize[32]] required" maxlength="32"/>
		</p>
		<p>
			<label>姓名：</label>
			<input type="text" name="realname" class="w190 input-medium validate[required,maxSize[32]] required" maxlength="32"/>
		</p>		
		<p>
			<label>登录密码：</label>
			<input type="text" name="plainPassword" class="w190 input-medium validate[required,minSize[6],maxSize[32]] required" maxlength="32" value="123456" alt="字母、数字、下划线 6-32位"/>
		</p>
		<p>
			<label>电话：</label>
			<input type="text" name="phone" class="w190 input-medium validate[custom[phone],maxSize[32]]" maxlength="32"/>
		</p>
		<p>
			<label>身份证号：</label>
			<input type="text" name="idCardNo" class="w190 input-medium validate[custom[idcard],maxSize[18]]" maxlength="18"/>
		</p>	
		<p>
			<label>用户邮箱：</label>
			<input type="text" name="email" class="w190 input-medium validate[custom[email],maxSize[128]]" maxlength="128"/>
		</p>		
		<p>
			<label>用户状态：</label>
			<select name="status" class="re_select196">
				<option value="<%=PlatformConstants.USER_STATUS_ENABLE %>">可用</option>
				<option value="<%=PlatformConstants.USER_STATUS_DISABLE %>">停用</option>
			</select>
		</p>
		<p>
			<label>关联组织：</label>	
			<input name="organization.code" type="hidden"/>
			<input class="w190 validate[required] required" name="organization.name" type="text" readonly="readonly" data-prompt-position="centerRight:22,0"/>
			<a class="btnLook" href="${contextPath }/management/security/user/lookup2org/create" lookupGroup="organization" title="关联组织" mask="true" target="dialog" close="closeDialog" width="550" height="400">查找带回</a>	
		</p>
		<p>
			<label>角色：</label>	
			<select name="userRoles[0].role.id" class="re_select196 validate[required] required">
				<option value="">--请选择角色--</option>
				<c:forEach items="${roles }" var="item">
					<option value="${item.id }">${item.name }</option>
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