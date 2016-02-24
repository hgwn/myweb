<%@page import="java.util.Date"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<div class="pageContent">     
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>业务系统名字：</label>
			<input type="text" name="businessName"  maxlength="64" value="${businessSystem.businessName}" readonly="readonly"/>
		</p>
	
		<p>
				<label>生效日期</label>
     			<input type="text" name="activeDateVo"  value="${businessSystem.activeDate}" readonly="true" />
		</p>
		
		<p>
				<label>失效日期</label>
				<input type="text" name="expiryDateVo"  value="${businessSystem.expiryDate}" readonly="true"/>
		</p>
		
		<p>
				<label>状态</label>
						<c:choose>
						   <c:when test="${businessSystem.status eq '1'}">启用</c:when>
						  	 <c:otherwise>停用
						   </c:otherwise>
						</c:choose>
		</p>	
		
	</div>
	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>

</div>