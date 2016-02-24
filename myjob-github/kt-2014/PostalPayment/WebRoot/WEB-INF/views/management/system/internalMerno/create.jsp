<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<div class="pageContent">
<form method="post" action="${contextPath }/management/system/internalMerno/create" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>商户名称：</label>
			<input  name="merName" type="text" class="w190 validate[required] required" maxlength="200"/>
		</p>
		<p>
			<label>收单行代码：</label>
			<select name="acquirer.id" class="re_select196">
				<c:forEach var="acquirer" items="${acquirers }">
					<option value="${acquirer.id }">(${acquirer.keyItem })${acquirer.item1 }</option>
				</c:forEach>
			</select>
		</p>		
		<p>
			<label>地区码：</label>
			<select name="areaCode.id" class="re_select196">
				<c:forEach var="province" items="${provinces }">
					<option value="${province.id }">(${province.keyItem })${province.item1 }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>MCC：</label>
			<select name="mcc.id" class="re_select196">
				<c:forEach var="mcc" items="${mccs }">
					<option value="${mcc.id }">(${mcc.keyItem })${mcc.item1 }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>所属POSP：</label>
			<select name="pospId" class="re_select196">
				<option value="1">邮储</option>
				<option value="2">银联</option>
			</select>
		</p>
	</div>
			
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit" id="submBtn">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>