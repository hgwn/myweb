<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%@page import="java.util.Date"%>
<script type="text/javascript">
$("#search_Assigned_modeladd").remoteChained("#search_Assigned_brandNoId", "${contextPath }/management/system/posTerminal/getModelNo");
	function unAssigned_save(id){
		alertMsg.confirm("确认要分配吗？", {
			okCall: function(){
				$.ajax({
					type:"post",
					url:"${contextPath }/management/system/posTerminal/org_relevance/${code}",
					data:{"ids_terminalno":id},
					success:function(msg){
						var json = jQuery.parseJSON(msg);
						navTabAjaxDone(json);
						//$("#terminalnoForm").submit();
						//$("#terminalno_list").loadUrl("${contextPath }/management/system/posTerminal/terminalno_list/${code }");
					},
					error:function(msg){
						var json = jQuery.parseJSON(msg);
						navTabAjaxDone(json);
					}
				}); 
			}
		});
	}
	function Assigned_save(id){
		alertMsg.confirm("确认要取消分配吗？", {
			okCall: function(){
				$.ajax({
					type:"post",
					url:"${contextPath }/management/system/posTerminal/org_canel/${code}",
					data:{"ids_terminalno":id},
					success:function(msg){
						var json = jQuery.parseJSON(msg);
						navTabAjaxDone(json);
					//	$("#terminalnoForm").submit();
					//$("#terminalno_list").loadUrl("${contextPath }/management/system/posTerminal/terminalno_list/${code }");
					},
					error:function(msg){
						var json = jQuery.parseJSON(msg);
						navTabAjaxDone(json);
					}
				}); 
			}
		});
	}
	$(function(){
		$("#Hterminalno-list-search").toggle(function(){
			$("#Hterminalno-list-searchBox").show();
		},function(){
			$("#Hterminalno-list-searchBox").hide();
		});
		$("#Hterminalno-list-searchBox_sub").click(function(){
			$("#Hterminalno-list-search").trigger("click");
		});
	});
	$(document).ready(function(){
		$('#search_Assigned_internalTerminalno').autocomplete({
			serviceUrl: '${contextPath }/management/system/internalTerminalno/getInternal_terminal'
		});
	});
	function open_assignTerminal(){
		var assign_site_code=$("#assign_site_code").val();
		if(assign_site_code==null || assign_site_code=='' || assign_site_code=='0'){
		alertMsg.warn("请先选择网点");
		}else{
			//$.pdialog.open("${contextPath }/management/system/posTerminal/assignTerminal/"+site_code,"assignTerminal_jsp","快速绑定",{mask:true,width:700,height:450});
			$("#assingTerminal_dialog").click();
		}
	}
</script>
<dwz:paginationForm
	action="${contextPath }/management/system/posTerminal/terminalno_list/${code }"
	page="${terminalno_list_page }"
	onsubmit="return divSearch(this, 'jbsxBox2TerminalnoList2');">
	<input type="hidden" name="Assigned_code" value="${Assigned_code }"/>
	<input type="hidden" name="Assigned_internalTerminalno" value="${Assigned_internalTerminalno }"/>
	<input type="hidden" name="modelNoid" value="${modelNoid }"/>
	<input type="hidden" name="brandNoid" value="${brandNoid }"/>
</dwz:paginationForm>
<div class="pageHeader" style="padding:0; position:relative;" id="terminalno_list_pageHeader">
	<input type="hidden" id="assign_site_code" name="assign_site_code" value="${code }"/>
	<a style="display:none;" id="assingTerminal_dialog" target="dialog" rel="assignTerminal_jsp" title="快速分配" mask="true" width="400" height="500" href="${contextPath }/management/system/posTerminal/assignTerminal/${code }"></a>
	<table class="table" layoutH="308" width="902" rel="jbsxBox2TerminalnoList2">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="100" class="red" align="center">可分配终端</th>			
				<th width="100">pos机身号</th>
				<th width="100">内部终端编号</th>
				<th width="120">所属商户编号</th>
				<th width="120">所属商户名称</th>
				<th width="160">商户所属地区代码(名称)</th>	
				<th width="140">品牌</th>	
				<th width="140">终端类型</th>
			</tr>
		</thead>
		<tbody id="unAssigned">
			<c:forEach var="item" items="${unAssigneds}" varStatus="var">
			<tr id="${item.id}">
				<td align="center">${var.count}</td>
				<td align="center"><input type="button" style="height:21px; margin-left:10px; cursor:pointer;" value="分配" onclick="unAssigned_save(${item.id});"></td>
				<td>${item.code}</td>
				<td>${item.internalTerminalno.terminalno}</td>
				<td>${item.internalTerminalno.internalMerno.merno}</td>
				<td>${item.internalTerminalno.internalMerno.merName}</td>
				<td>${item.internalTerminalno.internalMerno.areaCode.keyItem}(${item.internalTerminalno.internalMerno.areaCode.item1})</td>
				<td>${item.brandNo.keyItem }</td>
				<td>${item.modelNo.keyItem }</td>
			</tr>			
			</c:forEach>
		</tbody>
	</table>
	
	<!-- 分页 -->
	<dwz:pagination page="${terminalno_list_page}" rel="jbsxBox2TerminalnoList2" onchange="navTabPageBreak({numPerPage:this.value}, 'jbsxBox2TerminalnoList2')"/>
</div>			
<div class="pageContent"  id="terminalno_list" style="position:relative; height:240px;  overflow:auto; padding:0;">
	<table class="table" style="height:240px; overflow:auto;" width="902" id="terminalno_list_ctable">
	<thead>
			<tr>
				<th width="30">序号</th>
				<th width="100" class="blue" align="center">已分配终端</th>			
				<th width="100">pos机身号</th>
				<th width="100">内部终端编号</th>
				<th width="120">所属商户编号</th>
				<th width="120">所属商户名称</th>
				<th width="160">商户所属地区代码(名称)</th>	
				<th width="140">品牌</th>	
				<th width="140">终端类型</th>	
			</tr>
	</thead>
	<tbody id="Assigned">
			<c:forEach var="item" items="${Assigneds}" varStatus="var">
			<tr id="${item.id}">
				<td align="center">${var.count}</td>
				<td align="center"><input type="button" style="height:21px; margin-left:10px; cursor:pointer;" value="取消分配" onclick="Assigned_save(${item.id});"></td>
				<td>${item.code}</td>
				<td>${item.internalTerminalno.terminalno}</td>
				<td>${item.internalTerminalno.internalMerno.merno}</td>
				<td>${item.internalTerminalno.internalMerno.merName}</td>
				<td>${item.internalTerminalno.internalMerno.areaCode.keyItem}(${item.internalTerminalno.internalMerno.areaCode.item1})</td>	
				<td>${item.brandNo.keyItem }</td>
				<td>${item.modelNo.keyItem }</td>
			</tr>			
			</c:forEach>
	</tbody>
	</table>
</div>
<!--start 查询 -->
	<div id="Hterminalno-list-search" style="position:absolute; top:32px; right:2px; background:#f5f5f5; line-height:20px; width:20px; margin:0 auto; text-align:center; border:1px solid #98d5bf; padding:3px; cursor:pointer;">快速查询</div>
	<div id="Hterminalno-list-searchBox" style="display:none;background-color:#fff; position:absolute; top:32px; right:29px;width:300px; height:150px;  border:1px solid #98d5bf; padding:5px;">
		<form method="post" action="${contextPath }/management/system/posTerminal/terminalno_list/${code }" onsubmit="return divSearch(this, 'jbsxBox2TerminalnoList2');">
			<p><label>pos机身号：</label><input id="search_Assigned_code" type="text" name="Assigned_code" maxlength="20" value="${Assigned_code}"/></p>
			<p><label>内部终端编号：</label><input id="search_Assigned_internalTerminalno" name="Assigned_internalTerminalno" value="${Assigned_internalTerminalno}"  maxlength="8" type="text"/></p>					
			<p><label>品牌：</label>
				<select name="brandNoid" id="search_Assigned_brandNoId">
						<option value="0">--请选择--</option>
						<c:forEach var="item" items="${brandNos}">
							<option value="${item.id}" 
								<c:if test="${item.id eq brandNoid}">
									selected="selected"
								</c:if>
							>${item.keyItem }</option>
						</c:forEach>
				</select>
			</p>					
			<p><label>终端型号：</label>
			<select name="modelNoid" id="search_Assigned_modeladd">
						<option value="">--请选择--</option>
						<c:forEach var="item" items="${modelNos}">
							<option value="${item.id}" 
								<c:if test="${item.id eq modelNoid}">
									selected="selected"
								</c:if>
							>${item.keyItem }</option>
						</c:forEach>
					</select>
			</p>					
			<div class="button" style="margin-left:82px;"><div class="buttonContent"><button type="submit" id="Hterminalno-list-searchBox_sub">搜索</button></div></div>		
					
		</form>
	</div>
	<!--end 查询 -->