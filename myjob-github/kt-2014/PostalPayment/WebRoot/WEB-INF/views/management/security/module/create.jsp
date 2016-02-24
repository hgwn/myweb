<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
<!--
// top
jQuery(document).ready(function(){

	var $fieldset = $("#permissionFormContent");
    
    var $name = $("input[name=name]",$fieldset);
    var $sn = $("input[name=sn]",$fieldset);
    var $description = $("input[name=description]",$fieldset);
    
     $("#permissionForm").submit(function(event){
         event.preventDefault();
    	 event.stopPropagation();
		
    	 var _nameClass = $name.attr("class");
    	 var _snClass = $sn.attr("class");
    	 var _descriptionClass = $description.attr("class");
    	 
    	 $name.attr("class", "required");
    	 $sn.attr("class", "required");
    	 
     	 var result = validateCallback(this, dialogReloadRel2Module);
     	 
     	 if (!result) {
     		$name.attr("class", _nameClass);
     		$sn.attr("class", _snClass);
     		$description.attr("class", _descriptionClass);
     	 }
    	 return result;
     });
     
     initRolePage();
});

function initRolePage() {
	// 给全选加入事件
    $(".setAll").click(function(){
    	var isChecked = null;
    	
    	var chkClass = $(this).attr("class").split(" ")[2];
    	if (chkClass.indexOf("true") > -1) {
    		isChecked = false;
    		
    		$(this).attr("class", "button chk checkbox_false_full setAll");
    	} else {
    		isChecked = true;
    		
    		$(this).attr("class", "button chk checkbox_true_full setAll");
    	}
    	 
    	var $td = $(this).parent().nextAll("td");
    	var $inputSpan = $(".inputValueRole", $td);
		$("input[type=checkbox]", $inputSpan).each(function(){
			if (isChecked == true) {
				$(this).attr("checked", "checked");
				$(this).removeAttr("disabled");
			} else {
				$(this).removeAttr("checked");
				$(this).attr("disabled", "disabled");
			}
		});
    });
    
     //初始化checkbox_
    $("checkbox[class*='checkbox_']").each(function(){  	
    	$(this).mouseover(function(){
    		var chkClass = $(this).attr("class").split(" ")[2];
    		if(chkClass.indexOf("_focus") < 0) {
    			if ($(this).attr("class").indexOf("setAll") > -1) {
    				$(this).attr("class", "button chk " + chkClass + "_focus" + " setAll");    				
    			} else {
    				$(this).attr("class", "button chk " + chkClass + "_focus");
    			}
        	}
		});
    	
    	$(this).mouseout(function(){
    		var chkClass = $(this).attr("class").split(" ")[2];
    		if(chkClass.indexOf("_focus") > -1) {
    			if ($(this).attr("class").indexOf("setAll") > -1) {
    				$(this).attr("class", "button chk " + chkClass.substring(0, chkClass.length-6) + " setAll");    				
    			} else {
    				$(this).attr("class", "button chk " + chkClass.substring(0, chkClass.length-6));
    			}
        	}
		});

    });
}
//-->
</script>
<a id="refreshJbsxBox2moduleTree" rel="jbsxBox2moduleTree" target="ajax" href="${contextPath}/management/security/module/tree" style="display:none;"></a>
<div class="pageContent">
<form id="permissionForm" method="post" action="${contextPath }/management/security/module/create" class="required-validate pageForm" onsubmit="">
	<input type="hidden" name="parent.id" value="${parentModuleId }"/>
	<div id="permissionFormContent" class="pageFormContent" layoutH="58">
		<fieldset>
		<legend>模块信息</legend>	
		<p>
			<label>名称：</label>
			<input type="text" name="name" class="w190 input-medium validate[required,maxSize[64]] required" data-prompt-position="topRight" maxlength="64"/>
		</p>	
		<p>
			<label>排序：</label>
			<input type="text" name="priority" class="w190 validate[required,custom[integer],min[1],max[999]] required" data-prompt-position="topRight" value="999" maxlength="3" />
			<span class="info">（越小越靠前）</span>
		</p>		
		<p>
			<label>URL：</label>
			<input type="text" name="url" class="w190 input-medium validate[required,maxSize[256]] required" data-prompt-position="bottomRight" maxlength="256" alt="以#、/或者http开头"/>
		</p>		
		<p>
			<label>授权名称：</label>
			<input type="text" name="sn" class="w190 input-medium validate[required,maxSize[32]] required" data-prompt-position="bottomRight:-20,0" maxlength="32"/>
		</p>
		<p>
			<label>模块类名：</label>
			<input type="text" name="className" class="w190 input-medium" maxlength="256"/>
		</p>				
		<p class="nowrap">
			<label>描述：</label>
			<textarea name="description" cols="29" rows="3" maxlength="256" class="w190 input-medium textarea-scroll"></textarea>
		</p>		
		</fieldset>
		<fieldset>
		<legend>自定义授权</legend>
			 <div class="toNewPermission">
			<table class="treeTable h-moduleTable"  width="100%">
				<thead>
					<tr>
						<th width="120" height="30" align="center">可选操作权限</th>
						<th align="center">可选权限范围</th>
					</tr>
				</thead>
				<tbody>
					<c:forEach var="item" items="${authorityDictionary.dictionaryItems}" varStatus="status">
						<c:if test="${item.status }">
							<tr target="slt_uid" rel="${item.id}" height="20" id="${item.id}">
								<td>${item.keyItem}<input name="permissions[${status.index}].permissionName.id" value="${item.id}" type="checkbox" ref="allChk" class="button chk checkbox_false_full setAll" style="width:13px; height:13px; margin:2px 3px 1px 6px; cursor: auto;"></td>
								<td><span class='inputValueRole h-inputValueRole'>
									<c:forEach var="item2" items="${scopeDictionary.dictionaryItems}" varStatus="status2">
										<c:if test="${item2.status }">
											<label><input name="permissions[${status.index}].permissionDatas[${status2.index}].name" value="${item2.keyItem}" type="checkbox" disabled="disabled">${item2.keyItem}</label>
											<input name="permissions[${status.index}].permissionDatas[${status2.index}].dataValue" value="${item2.item1}" type="hidden">
										</c:if>
									</c:forEach>
									</span>
								</td>
							</tr>
						</c:if>
					</c:forEach>
				</tbody>
			</table>

			</div>		
		</fieldset>
	</div>
			
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>
<script type="text/javascript">
$(function(){
	var tr = $("table.treeTable.h-moduleTable > tbody > tr");
	$("table.treeTable.h-moduleTable > tbody > tr:even").css("background","#F8F8F8");
	tr.hover(function(){
		$(this).addClass("modeleHover");
	},function(){
		$(this).removeClass("modeleHover");
	});
	tr.click(function(){
		$(this).addClass("moduleSelected").siblings().removeClass("moduleSelected");
	});
});
</script>