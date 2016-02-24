<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<div class="pageContent">
<form method="post" action="${contextPath }/management/system/dictionary/updateDictionaryItem" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<input type="hidden" name="id" value="${dictionaryItem.id}"/>
	<input type="hidden" name="userId" value="${dictionaryItem.createdBy.id}"/>
	<div class="pageFormContent" layoutH="58">
	<p ${empty dictionaryTitle.keyItemName?"style='display: none;'":"" }>
		<label>${dictionaryTitle.keyItemName }:</label>
		<input class="w190 input-medium" type="text" name="keyItem" maxlength="200" value="${dictionaryItem.keyItem }" readonly class="w190 input-medium required validate[required]"/>
	</p>	
	<p ${empty dictionaryTitle.item1Name?"style='display: none;'":"" }>
		<label>${dictionaryTitle.item1Name }:</label>
		<input type="text" name="item1" maxlength="200" value="${dictionaryItem.item1 }" class="w190 input-medium"/>
	</p>	
	<p ${empty dictionaryTitle.item2Name?"style='display: none;'":"" }>
		<label>${dictionaryTitle.item2Name }：</label>
		<input type="text" name="item2" maxlength="200" value="${dictionaryItem.item2 }" class="w190 input-medium"/>
	</p>	
	<p ${empty dictionaryTitle.item3Name?"style='display: none;'":"" }>
		<label>${dictionaryTitle.item3Name }：</label>
		<input type="text" name="item3" maxlength="200" value="${dictionaryItem.item3 }" class="w190 input-medium"/>
	</p>	
    <p ${empty dictionaryTitle.parentDictionary.name?"style='display: none;'":"" }>
        <label>${dictionaryTitle.parentDictionary.name }：</label>
        <select id="parentId" name="parentId" class="re_select196 input-medium">
            <c:forEach var="dictionaryItem" items="${dictionaryItemList }">
                <option value="${dictionaryItem.id }" ${dictionaryItem.parentDictionaryItem.id eq dictionaryItem.id?"selected='selected'":""}>${dictionaryItem.keyItem }</option>
            </c:forEach>
        </select>
    </p>
    <p>
        <label>排列顺序：</label>
        <input type="text" name="displayOrder" value="${dictionaryItem.displayOrder }" maxlength="3" class="w190 input-medium validate[custom[integer],min[1],max[9999]]"/>
    </p>
    <input type="hidden" name="dictionaryId" value="${dictionaryTitle.id }"/> 
    <input type="hidden" name="createTime" value="${dictionaryItem.createdTime }">
    <input type="hidden" name="status" value="${dictionaryItem.status }">
	</div>
	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>