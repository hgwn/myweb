<%@page import="com.rongbang.pps.entity.main.Permission"%>
<%@page import="com.rongbang.pps.entity.main.Module"%>
<%@page import="com.rongbang.pps.entity.main.PermissionData"%>
<%@page import="java.util.List"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%!
    public String role_tree(Module module){
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
	        builder.append("{id:\"p_"+p.getId()+"\", pId:\"m_"+module.getId()+"\",name:\""+p.getPermissionName().getKeyItem()+"\",permissionId:"+p.getId()+",permission_data:\""+permissionData+"\"},");
	    }
	    }
		for(Module o : module.getChildren()) {
			builder.append(role_tree(o));				
		}
		return builder.toString();
    }
 %>
<% 
    StringBuilder builder = new StringBuilder();
	Module module2 = (Module)request.getAttribute("module");
	String cPermissonTree = role_tree(module2);
	cPermissonTree = cPermissonTree.substring(0, cPermissonTree.length()-1);
%>
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
			     for(var i=1;i<arr.length;i++){
			        str=str+"<option value='"+arr[i]+"'>"+json[arr[i]]+"</option>";
			     }
			     str = str+"<input type='hidden' name='rolePermissions[" + Count + "].permission.id' value='" +permissionId+ "'/>"
			     var editStr = "<select class='selDemo' id='diyBtn_" +treeNode.id+ "'name='rolePermissions[" + Count + "].accessScope'>"+str+"</select>";
			    }
			    Count = Count+1;
				aObj.after(editStr);
			}
		}
$(document).ready(function(){
	var zNodes =[<%=cPermissonTree%>];
	var t = $("#cpermissonTree");
	t = $.fn.zTree.init(t, setting, zNodes);
	t.expandAll(true); 
});
</script>

<div class="pageContent">
<form method="post" action="${contextPath }/management/security/role/create" class="required-validate pageForm" onsubmit="return validateCallback(this, navTabReloadParent);">
	<div layouth="56" class="pageFormContent">
	<div class="fl h-roleName-width h-clearFloat">
	<dl class="h-dl">
		<dt>角色名称：</dt>
		<dd>
			<input type="text" name="name" class="input-medium validate[required,maxSize[64]] required" maxlength="64" data-prompt-position="bottomRight:-55,-10" style="width:190px;"/>
		</dd>
	</dl>
	<dl class="h-dl">
		<dt>级别：</dt>
		<dd>
			<select name="levels" class="re_select196 validate[required] required">
				<c:forEach items="${roleLevels }" var="item">
					<option value="${item.item1 }">${item.keyItem }</option>
				</c:forEach>
			</select>
		</dd>
	</dl>
	<dl class="h-dl">
		<dt>描述：</dt>
		<dd>
		    <textarea name="description" rows="4" cols="24" class="w190" style="resize:none;" maxlength="256"></textarea>
			<!-- <input type="text" name="description" class="input-medium validate[maxSize[256]" maxlength="256"/> -->
		</dd>
	</dl>
	</div>
	<div class="fl h-roleItem-width">
	<dl class="h-dl h-set">
	    <fieldset>
		<legend>自定义互斥角色</legend>
		<div class="h-set-box">
			<c:forEach var="item" items="${roles}" varStatus="status">
				<label class="h-row-item h-ell"><input name="mutexRole" value="${item.id}" type="checkbox" >${item.name}</label>
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
	<div style="border:1px solid #ddd; border-top:none;"><ul id="cpermissonTree" class="ztree"></ul></div>
	<script type="text/javascript">
	  $(function(){
		  HTree_select("#cpermissonTree_1_ul");
	  });
	</script>
	
	</div>
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button class="close" type="button">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>