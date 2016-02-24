<%@page import="com.rongbang.pps.entity.main.RolePermission"%>
<%@page import="com.rongbang.pps.entity.main.Permission"%>
<%@page import="com.rongbang.pps.entity.main.Module"%>
<%@page import="com.rongbang.pps.entity.main.Role"%>
<%@page import="com.rongbang.pps.entity.main.PermissionData"%>
<%@page import="java.util.List"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%!
public String role_tree(Module module, Role role) {
	 StringBuilder builder = new StringBuilder();
   	long pid = module.getParent() == null ? 0:module.getParent().getId();
   	builder.append("{id:\"m_"+module.getId()+"\", pId:\"m_" +pid + 
				"\", name:\"" + module.getName() + "\"},");
	    if(!module.getPermissions().isEmpty()){
	      for(Permission p : module.getPermissions()){
	          String permissionData=" ";
	         for(PermissionData pd : p.getPermissionDatas() ){
	            permissionData = permissionData+"_"+pd.getDataValue();
	         }
	         for(RolePermission rolePermission : role.getRolePermissions()){
	             if(rolePermission.getPermission().getId().equals(p.getId())){
	                 builder.append("{id:\"p_"+p.getId()+"\", pId:\"m_"+module.getId()+"\",name:\""+p.getPermissionName().getKeyItem()+"\",permission_data:\""+permissionData+"\",isSelect :\""+rolePermission.getAccessScope()+"\" },");
	             }
	         }
	    }
	    }
		for(Module o : module.getChildren()) {
			builder.append(role_tree(o,role));				
		}
		return builder.toString();
}
%>
<%
	Module module2 = (Module)request.getAttribute("module");
	Role role2 = (Role)request.getAttribute("role");
	String vPermissonTree = role_tree(module2, role2);
	vPermissonTree = vPermissonTree.substring(0, vPermissonTree.length()-1);
%>
<script type="text/javascript">
var ajaxbg = $("#background,#progressBar");
ajaxbg.hide();
$(document).ajaxStart(function(){
ajaxbg.show();
}).ajaxStop(function(){
ajaxbg.hide();
});
</script>
<script type="text/javascript">
var IDMark_Switch = "_switch",
		IDMark_Icon = "_ico",
		IDMark_Span = "_span",
		IDMark_Input = "_input",
		IDMark_Check = "_check",
		IDMark_Edit = "_edit",
		IDMark_Remove = "_remove",
		IDMark_Ul = "_ul",
		IDMark_A = "_a";
		Count = 1;
var setting = {
  	view: {
		addDiyDom: addDiyDom
	},
	data: {
		simpleData: {
			enable:true,
			idKey: "id",
			pIdKey: "pId",
			rootPId: ""
		}
	}
};
 
function addDiyDom(treeId, treeNode) {
          
			var aObj = $("#" + treeNode.tId + IDMark_A);
			if(!treeNode.isParent && $("#diyBtn_" +treeNode.id).length<=0){
			    var rolePermissionsdata = treeNode.permission_data;
			    var permissionId = treeNode.permissionId;
			    if(rolePermissionsdata!=" " && typeof(rolePermissionsdata)!="undefined"){
			     var arr = rolePermissionsdata.split("_");
			     var str="";
			     var jsonStr = '${authorityScope}';
			     var json = eval('('+ jsonStr +')');
			     var isSelect = treeNode.isSelect;
			     for(var i=1;i<arr.length;i++){
			        if(isSelect==arr[i]){
			         str=str+"<option value='"+arr[i]+"' selected='selected' >"+json[arr[i]]+"</option>";
			        }else{
			          str=str+"<option value='"+arr[i]+"'>"+json[arr[i]]+"</option>";
			        }
			     }
			     var editStr = "<select disabled class='selDemo' id='diyBtn_" +treeNode.id+ "'name='rolePermissions[" + Count + "].accessScope'>"+str+"</select>";
			    }
			    Count = Count+1;
				aObj.after(editStr);
			}
		}
$(document).ready(function(){
var zNodes =[<%=vPermissonTree%>];
	var t = $("#VpermissonTree");
	t = $.fn.zTree.init(t, setting, zNodes);
	t.expandAll(true); 
	});
</script>
<div class="pageContent">
<form action="#">
	<div class="pageFormContent" layoutH="56">
	<div class="fl h-roleName-width h-clearFloat">
	<dl class="h-dl">
		<dt>名称：</dt>
		<dd>
			<input type="text" name="name" class="input-medium" data-prompt-position="bottomRight:-55,-10" value="${role.name }" readonly="readonly" style="width:190px;"/>
		</dd>
	</dl>
	<dl class="h-dl">
		<dt>级别：</dt>
		<dd>
			<input type="text" name="roleName" class="input-medium" data-prompt-position="bottomRight:-55,-10" value="${roleName }" readonly="readonly" style="width:190px;"/>
		</dd>
	</dl>
	<dl class="h-dl">
		<dt>描述：</dt>
		<dd>
			<!--<input type="text" name="description" class="input-medium" value="${role.description }" readonly="readonly"/>  -->
			<textarea rows="4" cols="24" style="resize:none; width:94%;" readonly="readonly">${role.description }</textarea>
		</dd>
	</dl>	
	</div>
	<div class="fl h-roleItem-width">
	<dl class="h-dl h-set">
	   <fieldset>
		<legend>自定义互斥角色</legend>
			<div class="h-set-box">
				<c:forEach var="item" items="${roles}" varStatus="status">
					<c:set var="ischeck" scope="page" value="0"/>
					<c:forEach var="item2" items="${mutexRole}" varStatus="status2">
						<c:if test="${item.id==item2.roleId||item.id==item2.mutexRoleId }">
							<c:set var="ischeck" scope="page" value="1"/>
						</c:if>
					</c:forEach>
					<label class="h-row-item h-ell"><input name="mutexRole" value="${item.id}" type="checkbox" <c:if test="${ischeck==1 }">checked</c:if> disabled="disabled">${item.name}</label>
				</c:forEach>
			</div>		
		</fieldset>
	</dl>
	</div>		
	<div class="divider"></div>
	<table class="treeTable list2" width="100%">
	    <tr>
	        <td>模块名称</td>
	        <td width="67%">操作权限</td>
	    </tr>
	</table>
	<div style="border:1px solid #ddd; border-top:none;"><ul id="VpermissonTree" class="ztree"></ul></div>
	<script type="text/javascript">
	  $(function(){	
			 HTree_select("#VpermissonTree_1_ul");	
	  });
	  
</script>
	</div>
	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>