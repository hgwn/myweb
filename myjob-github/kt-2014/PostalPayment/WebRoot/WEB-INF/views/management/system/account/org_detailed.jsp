<%@page import="java.util.Date"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<div class="pageContent">     
	<div class="pageFormContent" layoutH="58">
		<p>
				<label>组织机构名字：</label>
				<input type="text" name="name"  maxlength="64" value="${orgInfo.name}" readonly="readonly"/>
		</p>
		
		<p>
				<label>级别：</label>
				<input type="text" name="name"  maxlength="64" value="${orgInfo.orgLevel}" readonly="readonly"/>
		</p>
		
		<p>
				<label>联系人</label>
				<input type="text" name="description"  value="${orgInfo.contactPerson}" readonly="true"/>	
		</p>
			
		<p>
				<label>联系电话</label>
				<input type="text" name="description"  value="${orgInfo.contactPhone}" readonly="true"/>	
		</p>
		
		<p>
				<label>描述</label>
				<input type="text" name="description"  value="${orgInfo.description}" readonly="true"/>
		</p>
	</div>
	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>

</div>