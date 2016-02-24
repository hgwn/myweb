<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
<!--
jQuery(document).ready(function(){
	$("#captcha").attr("src", "${contextPath }/Captcha.jpg?time=" + new Date());
	$("#captcha").click(function(){
		$(this).attr("src", "${contextPath }/Captcha.jpg?time=" + new Date());
		return false;
	});
	function keydown(e)
	{
	    var currKey=0,e=e||event;
	     if(e.keyCode==13)
	     {
	         $("#submitBtn").trigger("click");
	     }
	}
	document.onkeydown=keydown;
	$("#submitBtn").click(function(){
		
		if($("#username").val()==''){
			alertMsg.warn("请输入用户名");
			return false;
		}
		if($("#password").val()==''){
			alertMsg.warn("请输入密码");
			return false;
		}
		if($("#captcha_key").val()==''){
			alertMsg.warn("请输入验证码");
			return false;
		}
		
		$.ajax({
			type:"post",
			url:"${contextPath }/login",
			data:"username="+$("#username").val()+"&password="+$("#password").val()
				+"&captcha_key="+$("#captcha_key").val()+"&ajax=true",
			success:function(msg){
				var json = jQuery.parseJSON(msg);
				if(json.statusCode!=200){//登陆失败，刷新验证码
					$("#captcha_key").val("");
					$("#captcha").attr("src", "${contextPath }/Captcha.jpg?time=" + new Date());
				}
				dialogAjaxDone(json);
			},
			error:function(msg){
				var json = jQuery.parseJSON(msg);
				navTabAjaxDone(msg);
				$("#captcha_key").val("");
				$("#captcha").attr("src", "${contextPath }/Captcha.jpg?time=" + new Date());
			}
		});
	});
});

//-->
</script>
<div class="pageContent">
	<form method="post" id="loginDialogForm" action="${contextPath }/login" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogAjaxDone)">
		<%-- 指定为ajax请求 --%>
		<input type="hidden" name="ajax" value="true"/>
		<div class="pageFormContent" layoutH="58">
			<p>
				<label>用户名:</label>
				<input type="text" name="username" id="username" maxlength="32" class="w190 input-medium"/>
			</p>
			<p>
				<label>密&nbsp;&nbsp;&nbsp;&nbsp;码:</label>
				<input type="password" name="password" id="password" maxlength="32" class="w190 input-medium"/>
			</p>
			<p>
				<label>验证码:</label>
				<input type="text" id="captcha_key" name="captcha_key" maxlength="4"  style="width: 85px;"/>&nbsp;&nbsp;
				<span><img src="${contextPath }/Captcha.jpg" alt="点击刷新验证码" title="点击刷新验证码" width="75" height="24" id="captcha"/></span>
			</p>			
		</div>
		<div class="formBar">
			<ul>
				<li><div class="button"><div class="buttonContent"><button type="button" id="submitBtn">登录</button></div></div></li>
				<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
			</ul>
		</div>
	</form>
	
</div>
