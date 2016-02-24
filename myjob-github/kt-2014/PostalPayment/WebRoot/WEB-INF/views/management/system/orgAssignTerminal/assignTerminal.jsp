<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
function assign_add(){
	var assign_add_code=$("#assign_code").val();
	var assign_org_code=$("#assign_org_code").val();
		if(assign_add_code.trim()=="" || assign_add_code==null){
			alertMsg.warn("请输入机身号！");
			return false;
		}
		$.ajax({
			global:false,
			type:"post",
			url:"${contextPath }/management/system/posTerminal/assign_add",
			data:{"Assigned_code":assign_add_code,"assign_org_code":assign_org_code},
			success:function(msg){
				if(msg=="success"){
					getTerminalList();
				}else if(msg=="repeat"){
					alertMsg.error("请不要重复加入");
				}else{
					alertMsg.error("该机身号不属于网点可分配的pos终端！");
				}
			},
			error:function(msg){
				alertMsg.error("操作失败");
			}
		});
	//$("#assignTerminal_jsp").loadUrl("${contextPath }/management/system/posTerminal/assignTerminal/${code}", {"code":assign_add_code});
}
function assign_del(assign_del_code){
		$.ajax({
			global:false,
			type:"post",
			url:"${contextPath }/management/system/posTerminal/assign_del",
			data:{"code":assign_del_code},
			success:function(msg){
				getTerminalList();
			},
			error:function(msg){
				alertMsg.error("操作失败");
			}
		});
	//$("#assignTerminal_jsp").loadUrl("${contextPath }/management/system/posTerminal/assign_del", {"code":assign_del_code});
}
function getTerminalList(){
	var add_code=$("#assign_code").val();
	$("#terminalTable").loadUrl("${contextPath }/management/system/posTerminal/getTerminals", {"assign_code":add_code},function(){
		//$("#businessList_jsp .gridScroller").css({"height":"210px"});
	});
}

function assign_save(){
	var assign_org_code=$("#assign_org_code").val();
	var ids="";
	$("#terminalTable").find("input").filter("[name='assgin_ids']").each(function(i){
		var val = $(this).val();
		ids += i==0 ? val : ","+val; 
	});
	if(ids==""){
		alertMsg.warn("请先添加机身号！");
		return false;
	}
	$.ajax({
			type:"post",
			url:"${contextPath }/management/system/posTerminal/org_relevance/"+assign_org_code,
			data:{"ids_terminalno":ids},
			success:function(msg){
				var json = jQuery.parseJSON(msg);
				navTabAjaxDone(json);
				$("#assign_close").click();
			},
			error:function(msg){
				var json = jQuery.parseJSON(msg);
				avTabAjaxDone(json);
			}
		});
}
</script>
<div class="pageContent">
	<div class="pageFormContent" layoutH="58">
		<div class="assign_main">
			<div>
				<form>
				  <fieldset>
				    <legend>网点信息</legend>
				    <input type="hidden" id="assign_org_code" value="${organization.code}"/>
				    <table style="width:98%; margin:10px auto;">
				    	<tr>
				    		<td width="78" align="right">网点名称：</td>
				    		<td >${organization.name}</td>
				    	</tr>
				    </table>
				  </fieldset>
				</form>
				
			</div>
			<div>
			<form>
				  <fieldset>
				    <legend>待分配pos终端</legend>
						<div id="terminalTable">
							<c:import url="/management/system/posTerminal/getTerminals" charEncoding="UTF-8" />
						</div>
				 </fieldset> 
			</form>	
			</div>
		</div>
	</div>	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="button" onclick="assign_save();">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" id="assign_close" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</div>
