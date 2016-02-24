<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@page import="java.util.Date"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<link href="${contextPath}/styles/jquery/css/autoComplete.css" rel="stylesheet" type="text/css" />
<style>
@media screen and (min-width:1360px){
	table#h-externalMerno-table.table{ width: 100%!important;}
	table#h-externalMerno-table.table .h-externalMerno-th {width:auto;}
}
</style>
<script type="text/javascript">
$("#business_Id_payment").remoteChained("#systemId_4", "${contextPath }/management/system/business/select");

externalMernoExport = function(type){
	alertMsg.confirm("确认导出吗？", {okCall: function(){
				$("#externalMerno_selectType").val(type);
				$("#externalMerno_selectForm").submit();
				return true;
			}
		});
}

var externalMerno_click=function(){
		var $box = navTab.getCurrentPanel();
		var ids=$box.find("input:checked").filter("[name='ids']");
		if(ids.length<1){
			alertMsg.warn("请选择信息");
			return false;
		}
		alertMsg.confirm("确认注销吗？注销后不能再启用", {okCall: function(){
				$("#cancel_externalMerno").click();
				return true;
			}
		});
		return true;
	};
var click_check=function(clickid){
	var $box = navTab.getCurrentPanel();
		var ids=$box.find("input:checked").filter("[name='ids']");
		if(ids.length<1){
			alertMsg.warn("请选择信息");
			return false;
		}
		if(ids.length>1){
			alertMsg.warn("只能选择一条数据进行操作！");
			return false;
		}
		$.post("${contextPath }/management/security/externalMerno/checkisUpdate",{"id":ids.val()},function(data){
					if(data.statusCode==200){
						$("#"+clickid).click();
					}else{
						alertMsg.error(data.message);
					}
				},"json");
}

$(document).ready(function(){
		//$('#serch_external_merno').autocomplete({
		//	serviceUrl: '${contextPath }/management/security/externalMerno/getExternal_merno'
		//});
		//$('#serch_external_name').autocomplete({
		//	serviceUrl: '${contextPath }/management/security/externalMerno/getExternal_merName',
		//});
	});
//function externalMerno_closeDialog(){
	//    $.pdialog._current.data("close",'');
	//    $.pdialog.closeCurrent();
	//    $("#exterMernoList_From").submit();
	// 	  return false;
	//}

</script>
<dwz:paginationForm action="${contextPath }/management/security/externalMerno/list" page="${page }">
	<input type="hidden" name="search_merno" value="${search_merno }"/>
	<input type="hidden" name="search_merName" value="${search_merName }"/>
	<input type="hidden" name="org_code" value="${org_code }"/>
	<input type="hidden" name="systemId" value="${system_Id }"/>
	<input type="hidden" name="business_Id" value="${business_Id }"/>
</dwz:paginationForm>

<form id="externalMerno_selectForm" action="${contextPath }/management/security/externalMerno/export">
	<input type="hidden" name="selectType" id="externalMerno_selectType"/>
	<input type="hidden" name="search_merno" value="${search_merno }"/>
	<input type="hidden" name="search_merName" value="${search_merName }"/>
	<input type="hidden" name="org_code" value="${org_code }"/>
	<input type="hidden" name="systemId" value="${system_Id }"/>
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

<form method="post" id="exterMernoList_From" action="${contextPath }/management/security/externalMerno/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style="height:auto; width:90%; position:relative;">
			<table class="h-table">
				<tr>
				<td width="110" align="right">外部商户编号：</td>
				<td>
					<input id="serch_external_merno" style="width:95.5%;" type="text" name="search_merno" maxlength="15" data-prompt-position="buttomRight" value="${search_merno}"/>
				</td>
				<td width="110" align="right">外部商户名称：</td>
				<td>
					<input id="serch_external_name" style="width:95.5%;" type="text" name="search_merName" maxlength="200" data-prompt-position="buttomRight" value="${search_merName}"/>
				</td>
				<td width="110" align="right">机构组织：</td>
				<td>
					<select class="re_select" name="org_code"  >
					<option value="0" selected="selected">--请选择机构--</option>
						<c:forEach var="item" items="${organizations}">
							<option value="${item.code }"
							<c:if test="${org_code eq item.code}">
								selected="selected" 
							</c:if>
							>${item.name }</option>
						</c:forEach>
					</select>
				</td>
				</tr>
				<tr>
					<td width="110" align="right">业务系统：</td>
					<td> 
						<select id="systemId_4"  name="systemId"  style="width:98%;"  class="re_select"     >
							<option value="0" selected="selected">--请选择系统--</option>
							<c:forEach items="${supportSystems}" var="supp">
								<option value="${supp.id}" <c:if test="${system_Id eq supp.id }">selected</c:if>
								>${supp.systemName }</option>
							</c:forEach>
						</select>
					</td>
					<td width="110" align="right">业务种类：</td>
					<td>
						<select style="width:98%;"  class="re_select " name="business_Id"  id="business_Id_payment"  >
							<option value="0">--请选择业务--</option>
							<c:forEach items="${businesses}" var="bus">
								<option value="${bus.id}" <c:if test="${business_Id eq bus.id}">selected="selected"</c:if>
								>${bus.businessName }</option>
							</c:forEach>
						</select>
					</td>
					<td width="110" align="right">&nbsp;</td>
					<td>&nbsp;</td>
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
			<shiro:hasPermission name="ExternalMerno:save">
				<li><a iconClass="user_add" target="dialog" rel="externalMerno_add" mask="true" width="550" height="350" href="${contextPath }/management/security/externalMerno/create"><span>添加</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="ExternalMerno:edit">
				<a style="display:none;" id="externalMerno_update" target="selectedOne" rel="ids" mask="true" width="550" height="350" href="${contextPath }/management/security/externalMerno/update"></a>
				<li><a iconClass="user_edit" onclick="click_check('externalMerno_update');"><span>编辑</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="ExternalMerno:disable">
				<li><a iconClass="lock" target="selectedTodo" rel="ids" href="${contextPath }/management/security/externalMerno/disable" title="确认要停用吗?"><span>停用</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="ExternalMerno:enable">
				<li><a iconClass="lock_open" target="selectedTodo" rel="ids" href="${contextPath }/management/security/externalMerno/enable" title="确认要启用吗?"><span>启用</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="ExternalMerno:cancel">
				<a style="display:none;" id="cancel_externalMerno" target="selectedTodo" rel="ids" href="${contextPath }/management/security/externalMerno/cancel" title="确认要注销吗?"></a>
				<li><a iconClass="delete" onclick="externalMerno_click();"><span>注销</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="ExternalMerno:mernobiz">
				<a style="display:none;" id="externalMerno_mernobiz" target="selectedOne" rel="ids" mask="true" width="910" height="550" href="${contextPath }/management/security/externalMerno/lookup2business"></a>
				<li><a iconClass="image_link" onclick="click_check('externalMerno_mernobiz');"><span>关联业务种类</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="ExternalMerno:export">
				<li><a iconClass="page_excel" href="javascript:externalMernoExport('1');"><span>导出当前页</span></a></li>
				<li><a iconClass="page" href="javascript:externalMernoExport('0');"><span>导出所有页</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>
	
	<table class="table" layoutH="147" width="1502">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="ids" class="checkboxCtrl"></th>			
				<th width="150">外部商户编号</th>
				<th width="200" class="h-externalMerno-th">外部商户名称</th>
				<th width="200">所属机构</th>
				<th width="100">手续费率</th>
				<th width="150">业务种类</th>
				<th width="150">支付方式</th>
				<th width="80" orderField="status" class="${page.orderField eq 'status' ? page.orderDirection : ''}">状态</th>
				<th width="130" orderField="createdTime" class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}">创建时间</th>
				<th width="80">创建人</th>
				<th width="130" orderField="updatedTime" class="${page.orderField eq 'updatedTime' ? page.orderDirection : ''}">修改时间</th>
				<th width="80">修改人</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${externalMernos}" varStatus="var" >
			<tr target="slt_uid" rel="${item.id}">
				<td align="center">${var.count}</td>
				<td><input name="ids" value="${item.id}" type="checkbox"></td>
				<td>${item.merno}</td>
				<td>${item.merName}</td>
				<td>${item.organization.name}</td>
				<td><fmt:formatNumber value="${item.feeRate}" type="percent" minFractionDigits="2" /><br/></td>
				<td class="externalMerno-lookup-td">
					<c:forEach var="item2" items="${item.externalMernoBizs}" varStatus="var2">
						<c:if test="${var2.count eq 1}">${item2.businessId.businessName}</c:if>
						<c:if test="${var2.count ne 1}">,${item2.businessId.businessName}</c:if>
					</c:forEach>
				</td>
				<td>${item.bankingNo.item1}</td>
				<td>
					<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.COMMON_STATUS %>" dataValue="${item.status}"/>
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
	<dwz:pagination page="${page }"/>
</div>