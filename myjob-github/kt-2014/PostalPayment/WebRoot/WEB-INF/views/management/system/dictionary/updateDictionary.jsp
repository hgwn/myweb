<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<div class="pageContent">
<form method="post" action="${contextPath }/management/system/dictionary/updateDictionary" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<input type="hidden" name="id" value="${dictionary.id}"/>
	<input type="hidden" name="dictionaryOldName" value="${dictionary.name}"/>
	<div class="pageFormContent" layoutH="58">
    <p>
        <label>字典key：</label>
        <input type="text" name="dictKey" maxlength="50" value="${dictionary.dictKey}" class="w190 input-medium" readonly="readonly"/>
    </p>
	<p>
		<label>字典名称：</label>
		<input type="text" name="name" maxlength="50" value="${dictionary.name}" class="w190 input-medium required validate[required]"/>
	</p>	
	<p>
		<label>字典值名称：</label>
		<input type="text" name="keyItemName" maxlength="30" value="${dictionary.keyItemName}" class="w190 input-medium required validate[required]"/>
	</p>	
	<p>
		<label>备用值1：</label>
		<input type="text" name="item1Name" maxlength="30" value="${dictionary.item1Name}" class="w190 input-medium"/>
	</p>	
	<p>
		<label>备用值2：</label>
		<input type="text" name="item2Name" maxlength="30" value="${dictionary.item2Name}" class="w190 input-medium"/>
	</p>	
	<p>
		<label>备用值3：</label>
		<input type="text" name="item3Name" maxlength="30" value="${dictionary.item3Name}" class="w190 input-medium"/>
	</p>	
	<p>
		<label>关联字典类型：</label>
        <select name="parentId" class="re_select196 input-medium">
            <option value="">--请选择--</option>
            <c:forEach var="dictionarys" items="${dictionaryList }">
                <option value="${dictionarys.id }" ${dictionary.parentDictionary.id eq dictionarys.id?"selected='selected'":""}>${dictionarys.name }</option>
            </c:forEach>
        </select>
	</p>
	<p>
		<label>是否可维护：</label>
		<input type="radio" name="canAdmin" value="true" ${dictionary.canAdmin?"checked='checked'":""}> 是
        &nbsp;&nbsp;
		<input type="radio" name="canAdmin" value="false" ${!dictionary.canAdmin?"checked='checked'":""}> 否
	</p>
	<p>
		<label>字典项值是否唯一：</label>
		<input type="radio" name="isUnique" value="Y" ${dictionary.isUnique eq "Y"?"checked='checked'":""}> 是
        &nbsp;&nbsp;
		<input type="radio" name="isUnique" value="N" ${dictionary.isUnique eq "N" ?"checked='checked'":""}> 否
	</p>
	<!-- <p>
		<label>是否显示：</label>
        <input type="radio" name="canDisplay" value="true" ${dictionary.canDisplay?"checked='checked'":""}> 是
        &nbsp;&nbsp;
        <input type="radio" name="canDisplay" value="false" ${!dictionary.canDisplay?"checked='checked'":""}> 否
	</p> -->
	<input type="hidden" name="canDisplay" value="${dictionary.canDisplay }">
    <input type="hidden" name="createTime" value="${dictionary.createdTime }">
	</div>
	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>