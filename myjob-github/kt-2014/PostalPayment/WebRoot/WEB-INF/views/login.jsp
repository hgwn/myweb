<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>        
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="pragma" content="no-cache" />
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<title>邮政业务卡支付后台管理系统</title>
<link href="${contextPath}/styles/dwz/themes/css/login.css" rel="stylesheet" type="text/css" />
<!-- 自动补全 -->
<link href="${contextPath}/styles/jquery/css/autoComplete.css" rel="stylesheet" type="text/css" />
<!-- form验证 -->
<link rel="stylesheet" href="${contextPath}/styles/validationEngine/css/validationEngine.jquery.css" type="text/css"/>
<script src="${contextPath}/styles/jquery/jquery-1.7.2.min.js" type="text/javascript"></script>
<script src="${contextPath}/styles/jquery/jquery.autocomplete.js" type="text/javascript"></script>
<script src="${contextPath}/styles/validationEngine/js/languages/jquery.validationEngine-zh_CN.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${contextPath}/styles/validationEngine/js/jquery.validationEngine-2.6.4.min.js" type="text/javascript" charset="utf-8"></script>
<!--[if IE 6]>
<script src="${contextPath}/styles/jquery/png.js" type="text/javascript"></script>
<script>
  /* EXAMPLE */
  DD_belatedPNG.fix('img,#login_content');
  
  /* string argument can be any CSS selector */
  /* .png_bg example is unnecessary */
  /* change it to what suits you! */
</script>
<![endif]--> 
<script>
    jQuery(document).ready(function(){
    	jQuery("#formID").validationEngine(); 
    });
    jQuery(document).ready(function(){
    	$("#captcha").click(function(){
    		$(this).attr("src", "${contextPath}/Captcha.jpg?time=" + new Date());
    		return false;
    	});	
    	
    	$("#login_sub").click(function(){
    		var a  = jQuery("#formID").validationEngine("validate"); 
    		if(!a){
    			return false ; 
    		}
    	});
    	
    	$(".login_bar .sub").hover(function(){
    		$(this).css("background-position","0 -91px");
    	},function(){
    		$(this).css("background-position","0 0");
    	});
    });
  
</script>
</head>
<body>
	<div id="login">
		<div id="login_content">
			<div class="login_logo"><img src="${contextPath}/styles/dwz/themes/default/images/login/logo.png" alt="邮政业务卡支付系统"></div>
			<div class="loginForm">
				<form method="post" action="${contextPath}/login" id="formID" >
					<c:if test="${msg!=null }">
						<p style="color: red; margin-left: 10px;">${msg }</p>
					</c:if>
					<p>
						<label>用户名:</label>
						<input type="text" name="username" style="width: 150px;" class="validate[required]  login_input" id="username" value="${username }"/>
					</p>
					<p>
						<label>密&nbsp;&nbsp;&nbsp;&nbsp;码:</label>
						<input type="password" name="password" style="width: 150px;" class="validate[required] login_input" id="password"/>
					</p>
					<p>
						<label>验证码:</label>
						<input type="text" id="captcha_key" style="width: 70px;float:left;" name="captcha_key" class="login_input validate[required,maxSize[4]] required" maxLength="4" data-prompt-position="bottomLeft" />
						<span class="login_captcha"><img src="${contextPath}/Captcha.jpg" alt="点击刷新验证码" title="点击刷新验证码" width="75" height="24" id="captcha"/></span>
					</p>					
					<div class="login_bar">
						<input class="sub" type="submit" id="login_sub" value=""/>
					</div>
				</form>
			</div>
		</div>
		<div id="login_footer">
			2014中国邮政集团&nbsp;&nbsp;Copyright &copy;&nbsp;2014&nbsp;All Rights Reserve.
		</div>
	</div>
</body>
</html>