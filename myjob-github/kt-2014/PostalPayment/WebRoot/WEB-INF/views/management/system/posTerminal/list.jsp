<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%@page import="java.util.Date"%>
<script type="text/javascript">
$("#modeladd").remoteChained("#brandNo_list_id", "${contextPath }/management/system/posTerminal/getModelNo");

posTerminalExport = function(type){
alertMsg.confirm("确认导出吗？", {okCall: function(){
	$("#posTerminal_selectType").val(type);
	$("#posTerminal_selectForm").submit();
		return true;
		}
	});
}

function empty_code(name){
	if(name==""){
		$("#search_pos_org_code").val("");
		$("#org_subordinate").attr("disabled",true);
	}else{
		$("#org_subordinate").attr("disabled",false);
	}
}
function empty_site_code(name){
	if(name==""){
		$("#search_pos_site_code").val("");
	}
}

$(document).ready(function(){
	$('#search_pos_org_name').autocomplete({
		serviceUrl: '${contextPath }/management/system/posTerminal/getPos_org_name',
		 onSelect: function (suggestion) {
	         var data = suggestion.data;
	         var name = suggestion.name;
	     	 $("#search_pos_org_code").val(data);
	     	 $("#search_pos_org_name").val(name);
	      },
	      onSearchStart: function (query) {
	 		 $("#search_pos_org_code").val("");
	  	  },
	      onSearchComplete: function (query) {
	 		 $("#search_pos_org_code").val("");
	  	  }
	});
	$("#search_pos_site_name").autocomplete({
			serviceUrl: '${contextPath }/management/system/posTerminal/getPos_site_name',
			 onSelect: function (suggestion) {
		         var data = suggestion.data ;
		         var name = suggestion.name;
		     	 $("#search_pos_site_code").val(data);
		     	 $("#search_pos_site_name").val(name);
		     		
		      },
		      onSearchStart: function (query) {
		 		 $("#search_pos_site_code").val("");
		  	  },
		      onSearchComplete: function (query) {
		 		 $("#search_pos_site_code").val("");
		  	  }
		});
	//$('#search_pos_code').autocomplete({
	//	serviceUrl: '${contextPath }/management/system/posTerminal/getPos_code'
	//});
	$('#search_pos_internalTerminalno').autocomplete({
		serviceUrl: '${contextPath }/management/system/internalTerminalno/getInternal_terminal'
	});
	$('#search_pos_internalMerno').autocomplete({
		serviceUrl: '${contextPath }/management/system/internalMerno/getInternal_merno'
	});
	
	if($("#search_pos_org_name").val()==""){
			$("#org_subordinate").attr("disabled",true);
		}else{
			$("#org_subordinate").attr("disabled",false);
		}
	
	//如果自动填充(网点补全)时没有选择查询结果,查看范围的输入框将会清空内容
	//$('#search_pos_org_name').blur(function(){
	//	if($("#search_pos_org_code").val()==""){
	//		$('#search_pos_org_name').val("");
	//	}
	//});
	//$('#search_pos_site_name').blur(function(){
	//	if($("#search_pos_site_code").val()==""){
	//		$('#search_pos_site_name').val("");
	//	}
	//});
});

 var assign_submit=function(){
		/*var str_ids="";
		ids= document.getElementsByName("list_ids");
		var array= new Array(); //定义一数组 
        for (i=0; i<ids.length; i++){  
        
                if (ids[i].type=="checkbox" && ids[i].checked){ 
                	alert(i);
                	array=(ids[i].value).split(",");  
                	str_ids += i==0 ? array[0] : ","+array[0];
                	if(array[1]!=null && array[1]!=""){
                		alertMsg.warn("已经绑定网点的pos不能指定管理机构");
                		return false;
                	}            
                }  
        }*/
        var str_ids="";
        var org_ids="";
        var array= new Array(); //定义一数组 
        var $box = navTab.getCurrentPanel();
		$box.find("input:checked").filter("[name='list_ids']").each(function(i){
			var list_id = $(this).val();
			str_ids += i==0 ? list_id : ","+list_id;
			//var array = ($(this).attr("id_org")).split("_");
			//str_ids += i==0 ? array[0] : ","+array[0];
           	//if(array[1]!=null && array[1]!=""){
           	//	org_ids=array[1];
           	//	return false;
           //	} 
		});
		//if(org_ids!=""){
		//	alertMsg.warn("已经绑定网点的pos不能指定管理机构");
        //  	return false;
		//}
	    if(str_ids!=""){   
		    var url=$("#assignLink").attr("url")+str_ids;
	        $.pdialog.open(url,"assign_org","指定管理机构",{mask:true,width:650,height:450});
        }else{
        	alertMsg.warn("请选择信息");
        	return false;
        }
        
}
</script>

<dwz:paginationForm action="${contextPath }/management/system/posTerminal/list" page="${page }">
	<input type="hidden" name="code" value="${code }"/>
	<input type="hidden" name="brandNoid" value="${brandNoid }"/>
	<input type="hidden" name="modelNoid" value="${modelNoid }"/>
	<input type="hidden" name="internalTerminal_no" value="${internalTerminal_no }"/>
	<input type="hidden" name="internalMerno_no" value="${internalMerno_no }"/>
	<input type="hidden" name="status" value="${status }"/>
	<input type="hidden" name="pos_org_code" value="${pos_org_code }"/>
	<input type="hidden" name="pos_org_name" value="${pos_org_name }"/>
	<input type="hidden" name="pos_site_code" value="${pos_site_code }"/>
	<input type="hidden" name="pos_site_name" value="${pos_site_name }"/>
	<input type="hidden" name="gteSubmitTime" value="${gteSubmitTime }"/>
	<input type="hidden" name="lteSubmitTime" value="${lteSubmitTime }"/>
	<input type="hidden" name="org_subordinate" value="${org_subordinate }"/>
</dwz:paginationForm>

<form id="posTerminal_selectForm" action="${contextPath }/management/system/posTerminal/export">
	<input type="hidden" name="selectType" id="posTerminal_selectType"/>
	<input type="hidden" name="code" value="${code }"/>
	<input type="hidden" name="brandNoid" value="${brandNoid }"/>
	<input type="hidden" name="modelNoid" value="${modelNoid }"/>
	<input type="hidden" name="internalTerminal_no" value="${internalTerminal_no }"/>
	<input type="hidden" name="internalMerno_no" value="${internalMerno_no }"/>
	<input type="hidden" name="status" value="${status }"/>
	<input type="hidden" name="pos_org_code" value="${pos_org_code }"/>
	<input type="hidden" name="pos_org_name" value="${pos_org_name }"/>
	<input type="hidden" name="pos_site_code" value="${pos_site_code }"/>
	<input type="hidden" name="pos_site_name" value="${pos_site_name }"/>
	<input type="hidden" name="gteSubmitTime" value="${gteSubmitTime }"/>
	<input type="hidden" name="lteSubmitTime" value="${lteSubmitTime }"/>
	<input type="hidden" name="org_subordinate" value="${org_subordinate }"/>
	<input type="hidden" name="plainPageNum" value="${page.plainPageNum }"/>
	<input type="hidden" name="pageNum" value="${page.pageNum }"/>
	<input type="hidden" name="numPerPage" value="${page.numPerPage }"/>
	<input type="hidden" name="orderField" value="${page.orderField }"/>
	<input type="hidden" name="orderDirection" value="${page.orderDirection }"/>
	<input type="hidden" name="totalPage" value="${page.totalPage }"/>
	<input type="hidden" name="prePage" value="${page.prePage }"/>
	<input type="hidden" name="nextPage" value="${page.nextPage }"/>
	<input type="hidden" name="totalCount" value="${page.totalCount }"/>
</form>

<form rel="form_list" id="form_list" method="post" action="${contextPath }/management/system/posTerminal/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style="height:auto; width:90%; position:relative;">
			<table class="h-table">
			<input type="hidden" id="str_ids" rel="str_ids" value="${str_ids}"/>
				<tr>
				<td width="110" align="right">机身号：</td>
				<td>
					<input id="search_pos_code" style="width:98%;" type="text" name="code" maxlength="20" value="${code}"/>
				</td>
			 	<td width="110" align="right">品牌：</td>
			 	<td>
					<select name="brandNoid" style="width:98%;" id="brandNo_list_id" class="re_select ">
						<option value="0">--请选择--</option>
						<c:forEach var="item" items="${brandNos}">
							<option value="${item.id}" 
								<c:if test="${item.id eq brandNoid}">
									selected="selected"
								</c:if>
							>${item.keyItem }</option>
						</c:forEach>
					</select>
				</td>
				<td width="110" align="right">终端型号：</td>
				<td>
					<select name="modelNoid" id="modeladd" style="width:98%;" class="re_select ">
						<option value="">--请选择--</option>
						<c:forEach var="item" items="${modelNos}">
							<option value="${item.id}" 
								<c:if test="${item.id eq modelNoid}">
									selected="selected"
								</c:if>
							>${item.keyItem }</option>
						</c:forEach>
					</select>
				</td>
				</tr>
				<tr>
				<td width="110" align="right">内部终端编号：</td>
				<td>
					<input id="search_pos_internalTerminalno" name="internalTerminal_no" value="${internalTerminal_no}" style="width:98%;" maxlength="8" type="text"/>
				</td>
				<td width="110" align="right">内部商户编号：</td>
				<td>
					<input id="search_pos_internalMerno" name="internalMerno_no" type="text" value="${internalMerno_no}" style="width:95.5%;" maxlength="15"/>
				</td>
				<td width="110" align="right">状态：</td>
				<td>
					<select style="width:98%;" name="status" class="re_select ">
						<option selected="selected" value="">--请选择--</option>
						<option value="E" <c:if test="${status eq 'E'}">selected</c:if>>正常</option>
						<option value="D" <c:if test="${status eq 'D'}">selected</c:if>>故障</option>
					</select>
				</td>
				</tr>
				<tr>
					<td width="110" align="right">所属网点：</td>
					<input name="pos_site_code" id="search_pos_site_code" type="hidden" value="${pos_site_code}"/>
					<td><input name="pos_site_name" id="search_pos_site_name" onblur="empty_site_code(value);" onchange="empty_site_code(value);" style="width:98%;" type="text" value="${pos_site_name}"/></td>
					<td width="110" align="right">创建开始时间：</td>
					<td>
					<div style="width:98%; position:relative;">
					    <input type="text" name="gteSubmitTime" id="pos_begin_time" class="date"  dateFmt="yyyy-MM-dd HH:mm:ss" readonly="readonly" style="float:left; width:95%;" value="${gteSubmitTime}" maxDate="${limitSelectTime}"/>
						<a class="inputDateButton" href="javascript:;" style=" position:absolute; right:-1px; top:0;">选择</a>
					</div>	
					</td>
					<td width="110" align="right">创建结束时间：</td>
					<td>
						<div style="width:98%; position:relative;">
						<input type="text" name="lteSubmitTime" id="pos_end_time" class="date" dateFmt="yyyy-MM-dd HH:mm:ss" readonly="readonly" style="float:left; width:95%;" value="${lteSubmitTime}" maxDate="${limitSelectTime}" />
							<a class="inputDateButton" href="javascript:;" style="position:absolute; right:-1px; top:0;">选择</a>		
						</div>
					</td>
				</tr>
				<tr>
					<td width="110" align="right">管理机构：</td>
					<input name="pos_org_code" id="search_pos_org_code" type="hidden" value="${pos_org_code}"/>
					<td><input name="pos_org_name" id="search_pos_org_name" onblur="empty_code(value);" onchange="empty_code(value);" style="width:98%;" type="text" value="${pos_org_name}"/></td>
					<td><input type="checkbox" name="org_subordinate" id="org_subordinate" value="1" <c:if test='${org_subordinate eq 1 }'>checked</c:if>/>查询下属</td>
					<td colspan="3"></td>
				</tr>
			</table>
			</div>
			<div class="subBar">
				<ul>						
					<li><div class="button"><div class="buttonContent"><button type="submit">搜索</button></div></div></li>
				</ul>
			</div>
		</div>
	</div>
</form>

<div class="pageContent">

	<div class="panelBar">
		<ul class="toolBar">
			<shiro:hasPermission name="PosTerminal:save">
				<li><a iconClass="book_add" target="dialog" rel="externalMerno_add" mask="true" width="520" height="450" href="${contextPath }/management/system/posTerminal/create"><span>添加</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="PosTerminal:edit">
				<li><a iconClass="book_edit" target="selectedOne" rel="list_ids" mask="true" width="520" height="450" href="${contextPath }/management/system/posTerminal/update"><span>编辑</span></a></li>
			</shiro:hasPermission>
			<!--<shiro:hasPermission name="PosTerminal:distribute">
				<li><a iconClass="book_key" target="dialog" rel="externalMerno_tree" mask="true" width="900" height="450" href="${contextPath }/management/system/posTerminal/tree_list"><span>分配终端到网点</span></a></li>
			</shiro:hasPermission>-->
			<shiro:hasPermission name="PosTerminal:export">
				<li><a iconClass="page_white_excel" rel="externalMerno_export" href="${contextPath }/template/terminal-number-template.xls"><span>下载模板</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="PosTerminal:import">
				<li><a iconClass="basket_put" target="dialog" rel="externalMerno_import" mask="true"  width="480" height="320" href="${contextPath }/management/system/posTerminal/upload"><span>批量导入终端</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="PosTerminal:assignorg">
				<li><a iconClass="book_key" id="assignLink" url="${contextPath }/management/system/posTerminal/preassignOrg/" onclick="assign_submit()"><span>指定管理机构</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="PosTerminal:export">
				<li><a iconClass="page_excel" href="javascript:posTerminalExport('1');"><span>导出当前页</span></a></li>
				<li><a iconClass="page" href="javascript:posTerminalExport('0');"><span>导出所有页</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>
	
	<table class="table" layoutH="197" width="2555">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="list_ids" class="checkboxCtrl"></th>
				<th width="200">管理机构</th>			
				<th width="150">机身号</th>
				<th width="100">内部终端编号</th>
				<th width="150">内部商户编号</th>
				<th width="150">内部商户所在地区</th>
				<th width="250">所属网点</th>
				<th width="100">品牌</th>
				<th width="150">机型号</th>
				<th width="100">软件版本</th>
				<th width="100">终端类型</th>
				<th width="150">财产编号</th>
				<th width="150">供应商名称</th>
				<th width="250">备注</th>
				<th width="60" orderField="status" class="${page.orderField eq 'status' ? page.orderDirection : ''}">状态</th>
				<th width="130" orderField="createdTime" class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}">创建时间</th>
				<th width="80">创建人</th>
				<th width="130" orderField="updatedTime" class="${page.orderField eq 'updatedTime' ? page.orderDirection : ''}">修改时间</th>
				<th width="80">修改人</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${posTerminals}" varStatus="var">
			<tr target="slt_uid" rel="${item.id}">
				<td align="center">${var.count}</td>
				<td><input name="list_ids" value="${item.id}" type="checkbox"></td>
				<td>${item.createdOrgCode.name }</td>
				<td>${item.code }</td>
				<td>${item.internalTerminalno.terminalno }</td>
				<td>${item.internalTerminalno.internalMerno.merno }</td>
				<td>${item.internalTerminalno.internalMerno.areaCode.item1 }</td>
				<td>${item.site.name}</td>
				<td>${item.brandNo.keyItem }</td>
				<td>${item.modelNo.keyItem }</td>
				<td>${item.softVersion.keyItem }</td>
				<td>${item.posType.item1 }</td>
				<td>${item.propertyNo }</td>
				<td >${item.provider }</td>
				<td >${item.remark }</td>
				<td>
					<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.POS_STATUS %>" dataValue="${fn:trim(item.status)}"/>
				</td>
				<td><fmt:formatDate value="${item.createdTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
				<td>${item.createdBy.realname}</td>
				<td><fmt:formatDate value="${item.updatedTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
				<td>${item.updatedBy.realname}</td>
			</tr>			
			</c:forEach>
		</tbody>
	</table>
	<!-- 分页 -->
	<c:if test="${page.totalCount eq 0}">
		    	<div class="re_tips">没有搜到符合您条件的数据！</div>
   	</c:if>
	<dwz:pagination page="${page }" />
</div>