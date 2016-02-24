<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>   
<div class="pageContent">
<form method="post" action="${contextPath }/management/system/dictionary/createDictionary" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	
	<div class="pageFormContent" layoutH="58">
    <p ${empty dictionaryTitle.keyItemName?"style='display: none;'":"" }>
        <label>${dictionaryTitle.keyItemName }:</label>
        <input type="text" name="keyItem" maxlength="30" class="w190 input-medium required validate[required]"/>
    </p>
	<p>
		<label>字典key：</label>
		<input type="text" name="dictKey" maxlength="50" class="w190 input-medium required validate[required]"/>
	</p>	
	<p>
		<label>字典名称：</label>
		<input type="text" name="name" maxlength="50" class="w190 input-medium required validate[required]"/>
	</p>	
	<p>
		<label>字典值名称：</label>
		<input type="text" name="keyItemName" maxlength="30" class="w190 input-medium  required validate[required]"/>
	</p>	
	<p>
		<label>备用值1：</label>
		<input type="text" name="item1Name" maxlength="30" class="w190 input-medium"/>
	</p>	
	<p>
		<label>备用值2：</label>
		<input type="text" name="item2Name" maxlength="30" class="w190 input-medium"/>
	</p>	
	<p>
		<label>备用值3：</label>
		<input type="text" name="item3Name" maxlength="30" class="w190 input-medium"/>
	</p>	
	<p>
		<label>关联字典类型：</label>
        <select name="parentId" class="re_select196 input-medium">
            <option value="">--请选择--</option>
            <c:forEach var="dictionary" items="${dictionaryList }">
                <option value="${dictionary.id }">${dictionary.name }</option>
            </c:forEach>
        </select>
	</p>
	<p>
		<label>是否可维护：</label>
		<input type="radio" name="canAdmin" value="true" checked="checked"> 是
        &nbsp;&nbsp;
		<input type="radio" name="canAdmin" value="false"> 否
	</p>
	<p>
		<label>字典项值是否唯一：</label>
		<input type="radio" name="isUnique" value="Y"> 是
        &nbsp;&nbsp;
		<input type="radio" name="isUnique" value="N" checked="checked"> 否
	</p>
	<input type="hidden" name="canDisplay" value="true">
	<!-- <p>
		<label>是否显示：</label>
        <input type="radio" name="canDisplay" value="true" checked="checked"> 是
        &nbsp;&nbsp;
        <input type="radio" name="canDisplay" value="false"> 否
	</p> -->
	</div>
	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>