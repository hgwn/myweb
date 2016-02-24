<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>   

<script type="text/javascript">
//<!--
	var isUnique=$("#isUnique").val();
	var repeatValid = function(obj){
		var validObj = $("#keyItemcheck");
		var remote_url = validObj.attr("remote_url");
		var validAttrName = validObj.attr("name");
		var validAttrValue = encodeURI($.trim(validObj.attr("value")));
		var msgTip = validObj.attr("msgTip");
		var dictionaryId=$("#dictionaryId").val();
		if(validAttrValue!=""){
			var params = {};
			$.ajax({
				type:"post",
				async:false,
				url:remote_url,
				data:{"validWord":validAttrValue,"dictionaryId":dictionaryId},
				dataType:"text",
				success:function(data){
						if(data=="yes"){
							$("#"+validAttrName+"Msg").attr("class","invalid");
							msg = "<font color='red'>"+msgTip+"已存在</font>";
						}else if(data=="no"){
							$("#"+validAttrName+"Msg").attr("class","");
							msg = "<font color='green'>"+msgTip+"可用</font>";
						}
						$("#"+validAttrName+"Msg").html(msg);
					},
				error:function(data){
					alertMsg.error("调用失败");
				}});
		}
	}
	
	var validCodeAndName = function(){
		repeatValid();
		if($(".invalid").length>0){
			return false;
		}else{
			return true;
		}
	}
	$(document).ready(function(){
		$("#submBtn").click(function(){
			if(isUnique=="Y"){
				return validCodeAndName();
			}else{
				return true;
			}
		});
	});
//-->
</script>

<div class="pageContent">
<form method="post" action="${contextPath }/management/system/dictionary/createDictionaryItem" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<input type="hidden" id="isUnique" value="${dictionaryTitle.isUnique}"/>
	<input type="hidden" id="dictionaryId" value="${dictionaryTitle.id}"/>
	<div class="pageFormContent" layoutH="58">
	<p ${empty dictionaryTitle.keyItemName?"style='display: none;'":"" }>
		<label>${dictionaryTitle.keyItemName }:</label>
		<input class="w190 input-medium required validate[required]" type="text" name="keyItem" id="keyItemcheck" msgTip="${dictionaryTitle.keyItemName }" remote_url="${contextPath }/management/system/dictionary/isExists" maxlength="200" class="input-medium repeatValid required validate[required]"/>
		&nbsp;&nbsp;<span id="keyItemMsg"></span>
	</p>	
	<p ${empty dictionaryTitle.item1Name?"style='display: none;'":"" }>
		<label>${dictionaryTitle.item1Name }:</label>
		<input type="text" name="item1" maxlength="200" class="w190 input-medium"/>
	</p>	
	<p ${empty dictionaryTitle.item2Name?"style='display: none;'":"" }>
		<label>${dictionaryTitle.item2Name }：</label>
		<input type="text" name="item2" maxlength="200" class="w190 input-medium"/>
	</p>	
	<p ${empty dictionaryTitle.item3Name?"style='display: none;'":"" }>
		<label>${dictionaryTitle.item3Name }：</label>
		<input type="text" name="item3" maxlength="200" class="w190 input-medium"/>
	</p>	
    <p ${empty dictionaryTitle.parentDictionary.name?"style='display: none;'":"" }>
        <label>${dictionaryTitle.parentDictionary.name }：</label>
        <select id="parentId" name="parentId" class="re_select196 input-medium">
            <c:forEach var="dictionaryItem" items="${dictionaryItemList }">
                <option value="${dictionaryItem.id }">${dictionaryItem.keyItem }</option>
            </c:forEach>
        </select>
    </p>
    <p>
        <label>排列顺序：</label>
        <input type="text" name="displayOrder" value="${dictionaryItem.displayOrder }" maxlength="16" class="w190 input-medium required validate[required,custom[integer],min[1],max[9999]]"/>
    </p>
    <input type="hidden" name="dictionaryId" value="${dictionaryTitle.id }"/> 
	</div>
	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit" id="submBtn">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>