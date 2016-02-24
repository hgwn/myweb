<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<style>
<!--
.priority_input {
	border:none;border-bottom:1px solid gray;background:none;width:50px;height:22px;padding: 0px;float: left;margin-right: 6px;
}
-->
</style>
<script type="text/javascript">
<!--
// top
jQuery(document).ready(function(){
     
    $(".assignRole").click(function(){
    	var roleId = $(this).attr("id").split("submit_")[1];
    	var $roleRow = $("#userRoleRow_" + roleId);
    	var priority = parseInt($("#priority_" + roleId).val());
    	
    	if (isNaN(priority) || priority > 999 || priority < 1) {
			alert("请输入1-999的数字!");
			return false;
    	} 
    
    	jQuery.ajax({
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            url: '${contextPath}/management/security/user/create/userRole?user.id=${userId}&role.id=' + roleId + '&priority=' + priority,
            dataType:"text",
            error: function() { 
            	 alertMsg.error('分配角色失败！');
            },
            success: function(result) { 
            	if(result==null||result==""){
	            	// 删除已分配
					var $remove = $roleRow.remove();
		        	var roleName = $remove.find("td").eq(0).text();
			    	// 添加分配
					$("#hasRoles").append("<tr><td>" + roleName + "</td><td>" + priority + "</td></tr>");
					$('tr[class="selected2"]', getCurrentNavtabRel()).find("td").eq(7).find("div").append(roleName + "  ");
    			}else{
    				alertMsg.warn("所选角色与用户现有角色冲突，请重新选择");
    			}
    		}		
        });	
    });
    
});
//-->
</script>
<div class="pageContent" layoutH="0" >

	<fieldset style="border:none;">
		<legend>用户已分配角色</legend>
		<table class="list" width="100%">
			<thead>
				<tr>
					<th width="40%">角色名称</th>
					<th width="60%">排序（数值越小越靠前）</th>
				</tr>
			</thead>
			<tbody id="hasRoles">
				<c:forEach var="item" items="${userRoles}">
				<tr>
					<td>${item.role.name}<c:if test="${item.role.status=='D' }"><font color="red">（已停用）</fon></c:if></td>
					<td>${item.priority}</td>
				</tr>
				</c:forEach>
			</tbody>
		</table>
	</fieldset>
	<fieldset style="border:none;">
		<legend>用户可分配角色</legend>
		<table class="list" width="100%">
			<thead>
				<tr>
					<th width="40%">角色名称</th>
					<th width="60%">排序（数值越小越靠前）</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="item" items="${roles}">
				<tr id="userRoleRow_${item.id}">
					<td>${item.name}</td>
					<td>
						<input type="text" id="priority_${item.id}" name="priority" value="999" maxlength="3" class="priority_input">
						<div class="button" style="float:right;"><div class="buttonContent mt1"><button id="submit_${item.id}" class="assignRole">分配</button></div></div>
					</td>
				</tr>	
				</c:forEach>
			</tbody>
		</table>
	</fieldset>
</div>