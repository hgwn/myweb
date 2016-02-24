<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
function all_save(){
	var ids="";
	$("#businessList_jsp").find("input").filter("[name='ids1']").each(function(i){
		var val = $(this).val();
		ids += i==0 ? val : ","+val; 
	});
	bussiness_create(ids,"right_add");
}
function single_save(){
	var ids="";
	$("#businessList_jsp").find("input:checked").filter("[name='ids1']").each(function(i){
		var val = $(this).val();
		ids += i==0 ? val : ","+val; 
	});
	bussiness_create(ids,"right_add");
}
function bussiness_create(ids,flag){
	var lookup_business_mernoId=$("#lookup_business_MernoId").val();
	if(ids==''||ids==null){
			alertMsg.warn("请选择业务！");
			return;
		}
	$.ajax({
		type:"post",
		url:"${contextPath }/management/security/externalMerno/bListChange",
		async:false,
		data:{"ids":ids,"flag":flag},
		dataType:"text",
		success:function(msg){
			getbusinessList();
			getbusinessList_right();
		},
		error:function(data){
			alertWarn("调用失败");
		}
	}); 
}
function single_delete(){
	var ids="";
	$("#business_table_right").find("input:checked").filter("[name='ids2']").each(function(i){
		var val = $(this).val();
		ids += i==0 ? val : ","+val; 
	});
	bussiness_create(ids,"left_add");
}
function all_delete(){
	var ids="";
	$("#business_table_right").find("input").filter("[name='ids2']").each(function(i){
		var val = $(this).val();
		ids += i==0 ? val : ","+val; 
	});
	bussiness_create(ids,"left_add");
}
function merno_bus_save(){
	var ids="";
	var lookup_MernoId =$("#lookup_business_MernoId").val();
	$("#business_table_right").find("input").filter("[name='ids2']").each(function(i){
		var val = $(this).val();
		ids += i==0 ? val : ","+val; 
	});
	$.ajax({
		type:"post",
		url:"${contextPath }/management/security/externalMernoBiz/create",
		async:false,
		data:{"ids":ids,"externalMernoId":lookup_MernoId},
		dataType:"text",
		success:function(msg){
		var json = jQuery.parseJSON(msg);
		navTabAjaxDone(json);
			$("#button_close").click();
		},
		error:function(data){
			alertWarn("调用失败");
		}
	});
}
</script>
<div class="pageContent">
	<div class="pageFormContent" layoutH="58">
		<div class="lookup_business_main" style=" padding:10px; position:relative; overflow:hidden;">
			<div class="lookup_business_info" style="">
				<form>
				  <fieldset>
				    <legend>外部商户信息</legend>
				    <input type="hidden" id="lookup_business_MernoId" value="${externalMerno.id}"/>
				    <input type="hidden" id="lookup_business_orgCode" value="${externalMerno.organization.code}"/>
				    <table style="width:98%; margin:10px auto;">
				    	<tr>
				    		<td width="40" align="right">商户号：</td>
				    		<td width="100">${externalMerno.merno}</td>
				    		<td width="50" align="right">商户名称：</td>
				    		<td width="150">${externalMerno.merName}</td>
				    		<td width="50" align="right">所属机构：</td>
				    		<td width="150">${externalMerno.organization.name}</td>
				    	</tr>
				    </table>
				  </fieldset>
				</form>
				
			</div>
			<div class="lookup_business_showList" style="height:360px;position:relative;">
			<form>
				  <fieldset>
				    <legend>业务种类信息</legend>
				<div  style="height:330px;position:relative; overflow:hidden; clear:both;">    
				<div class="fl" id="business_table" style="margin-left:10px;position:relative; width:390px; border:1px solid #ddd; height:300px; margin-top:10px;">
						<h3 style="background:#f5f5f5; border-bottom:1px solid #ddd; height:22px; color:#333;"><span style="padding-left:8px; line-height:22px; ">未关联的业务种类</span></h3>
						<c:import url="/management/security/externalMerno/businessList/${externalMerno.id}" charEncoding="UTF-8" />
				</div>
				<div class="fl" style="width:45px; margin:50px 0 0 5px;">
					
						<p><input type="button" style="height:21px; width:40px; cursor:pointer;" title="左边列表信息移到右边" value=">>" onclick="all_save();"/></p>
						
						<p><input type="button" style="height:21px; width:40px;cursor:pointer;" title="左边选中信息移到右边" value=">" onclick="single_save();"/></p>
						
						<p><input type="button" style="height:21px; width:40px;cursor:pointer;" title="右边选中信息移到左边"  onclick="single_delete();" value="<"/></p>
						
						<p><input type="button" style="height:21px; width:40px;cursor:pointer;" title="右边信息全部移到左边" onclick="all_delete();"  value="<<"/></p>
					
				</div>
				<div class="fl" id="business_table_right" style="position:relative; width:390px; border:1px solid #ddd; height:300px; margin-top:10px;">
					<h3 style="background:#f5f5f5; border-bottom:1px solid #ddd; height:22px; color:#333;"><span style="padding-left:8px;  line-height:22px;">已关联的业务种类</span></h3>
					<c:import url="/management/security/externalMerno/businessList_right/${externalMerno.id}" charEncoding="UTF-8" />
				</div>
				</div>
				 </fieldset> 
			</form>	
			</div>
		</div>
	</div>	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="button" onclick="merno_bus_save();">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" id="button_close" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</div>
