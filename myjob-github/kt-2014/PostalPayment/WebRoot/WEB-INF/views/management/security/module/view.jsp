<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<div class="pageContent">
	<div class="pageFormContent" layoutH="58">
		<fieldset>
		<legend>模块信息</legend>	
		<p>
			<label>名称：</label>
			<input type="text" name="name" class="w190 input-medium required" value="${module.name }" readonly="readonly"/>
		</p>	
		<p>
			<label>排序：</label>
			<input type="text" name="priority" class="w190 required" value="${module.priority }" readonly="readonly"/>
			<span class="info">（数值越小越靠前）</span>
		</p>		
		<p>
			<label>URL：</label>
			<input type="text" name="url" class="w190 input-medium required" value="${module.url }" readonly="readonly"/>
		</p>		
		<p>
			<label>授权名称：</label>
			<input type="text" name="sn" class="w190 input-medium required" value="${module.sn }" readonly="readonly"/>
		</p>
		<p class="nowrap">
			<label>描述：</label>
			<textarea name="description" cols="29" rows="3" maxlength="256" class="w190 input-medium textarea-scroll" readonly="readonly">${module.description }</textarea>
		</p>				
		</fieldset>
		<fieldset>
		<legend>自定义授权</legend>
			<c:forEach var="p" items="${module.permissions }" varStatus="s">
				<fieldset>
				<legend>${s.count }.${p.permissionName.keyItem }</legend>
					<p>
						<label>名称：</label>
						<input type="text" name="_name" class="w190 input-medium required" value="${p.permissionName.keyItem }" readonly="readonly"/>
					</p>
					<p>
						<label>操作名称：</label>
						<input type="text" name="_sn" class="w190 input-medium required" value="${p.permissionName.keyItem }" readonly="readonly"/>
					</p>
					<%-- <p>
						<label>描述：</label>
						<input type="text" name="_description" class="w190 input-medium" value="${p.description }" readonly="readonly"/>
					</p> --%>
				</fieldset>			
			</c:forEach>		
		</fieldset>
	</div>
			
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</div>