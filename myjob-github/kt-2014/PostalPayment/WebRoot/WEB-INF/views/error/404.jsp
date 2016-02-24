<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%response.setStatus(200);%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>404 - 页面不存在</title>
</head>

<body>
<div class="errorcontent">
	<img src="${contextPath}/PostalPayment/styles/dwz/themes/default/images/yz/error.png" alt="404"/>
	<h1>您找的页面不存在！</h1>
    <a href="<c:url value="/management/index"/>" target="_top">返回首页</a>
</div>
</body>
</html>