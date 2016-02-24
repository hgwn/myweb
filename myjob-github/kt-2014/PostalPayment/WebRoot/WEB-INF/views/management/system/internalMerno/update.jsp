<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<div class="pageContent">
<form method="post" action="${contextPath }/management/system/internalMerno/update" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<input type="hidden" name="id" value="${ internalMerno.id}"/>
	<input type="hidden" name="merno" value="${internalMerno.merno }" />
	<input type="hidden" name="status" value="${internalMerno.status }"	/>
	<div class="pageFormContent" layoutH="58">
		
		<p>
			<label>商户名称：</label>
			<input  name="merName" type="text" value="${internalMerno.merName }" class="w190 validate[required] required" maxlength="200"/>
		</p>
		<p>
			<label>收单行代码：</label>
			<select name="acquirer.id" class="re_select196">
				<c:forEach var="acquirer" items="${acquirers }">
					<option value="${acquirer.id }" 
						<c:if test="${acquirer.id eq internalMerno.acquirer.id }">
							selected="selected"
						</c:if>
					>(${acquirer.keyItem })${acquirer.item1 }
					</option>
				</c:forEach>
			</select>
		</p>		
		<p>
			<label>地区码：</label>
			<select name="areaCode.id" class="re_select196">
				<c:forEach var="province" items="${provinces }">
					<option value="${province.id }"
						<c:if test="${province.id eq internalMerno.areaCode.id }">
							selected="selected"
						</c:if>
					>(${province.keyItem })${province.item1 }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>MCC：</label>
			<select name="mcc.id" class="re_select196">
				<c:forEach var="mcc" items="${mccs }">
					<option value="${mcc.id }"
						<c:if test="${mcc.id eq internalMerno.mcc.id }">
							selected="selected"
						</c:if>
					>(${mcc.keyItem })${mcc.item1 }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>所属POSP：</label>
			<select name="pospId" class="re_select196">
				<option value="1" ${internalMerno.pospId eq 1? "selected":"" }>邮储</option>
				<option value="2" ${internalMerno.pospId eq 2? "selected":"" }>银联</option>
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