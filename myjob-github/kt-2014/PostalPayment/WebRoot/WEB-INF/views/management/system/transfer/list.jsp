<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%@page import="java.util.Date"%>

<script type="text/javascript">
transferExport = function(type){
	$("#selectType").val(type);
	$("#selectForm").submit();
}


$("#transferSubmit").click(function(){
   var  startTime =	$("#startTime").val();
   var  endTime = $("#endTime").val();
 	//开始时间和结束时间 选择范围只能是3个月 
	   var order_gapDay = daysBetween(startTime, endTime);
	   if(parseInt(order_gapDay)<0){
			alertMsg.info("开始日期不能大于结束日期，请重新选择！");
			return false;
		}else if(parseInt(order_gapDay)>=93){
			alertMsg.info("最大时间跨度不能超过三个月，请重新选择！");
			return false;
		}
});
$("#business").chained("#supportSystem");
</script>
<dwz:paginationForm action="${contextPath }/management/system/transfer/list" page="${page }">
	<input type="hidden" name="search_LIKE_provinceOrg.code" value="${prvinceCode}"/>
	<input type="hidden" name="search_EQ_supportSystem.id" value="${supportSystemId}"/>
	<input type="hidden" name="search_EQ_business.id" value="${businessId}"/>
	<input type="hidden" name="search_LIKE_transferStatus" value="${transferStatus}"/>
	<input type="hidden" name="startTime" value="${startTime}"/>
	<input type="hidden" name="endTime" value="${endTime}"/>
</dwz:paginationForm>     
<form id="selectForm" action="${contextPath}/management/system/transfer/list">
	<input type="hidden" name="selectType" id="selectType"/>
	<input type="hidden" name="search_LIKE_provinceOrg.code" value="${prvinceCode}"/>
	<input type="hidden" name="search_EQ_supportSystem.id" value="${supportSystemId}"/>
	<input type="hidden" name="search_EQ_business.id" value="${businessId}"/>
	<input type="hidden" name="search_LIKE_transferStatus" value="${transferStatus}"/>
	<input type="hidden" name="startTime" value="${startTime}"/>
	<input type="hidden" name="endTime" value="${endTime}"/>
</form>    
<form method="post" action="${contextPath}/management/system/transfer/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
        <div class="searchBar">
            <div class="searchContent"  style="height:auto; width:90%; position:relative;">
            <table class="h-table">
            	<tr>
                <td width="110" align="right">所属省公司：</td>
                <td>
                <dwz:organization paramName="search_LIKE_provinceOrg.code" style="width:98%; height:22px;" selectedValue="${param['search_LIKE_provinceOrg.code']}" level="10"/>
                <td width="110" align="right">业务系统：</td>
                <td><dwz:system id="supportSystem" paramName="search_EQ_supportSystem.id" style="width:98%; height:22px;" selectedValue="${param['search_EQ_supportSystem.id']}"/></td>
                <td width="110" align="right">业务种类：</td>
                <td id="business_td"><dwz:business id="business"  paramName="search_EQ_business.id" style="width:98%; height:22px;" selectedValue="${param['search_EQ_business.id']}"/></td>
                
                </tr>
                <tr>
                <td width="110" align="right">开始划账日期：</td>
                <td>
                	<div style="width:98%; position:relative;">
					<input type="text" name="startTime" id="startTime" maxDate="${limitSelectTime }"  class="date required" readonly="readonly" style="float:left; width:95%;" value="${startTime}"/>
					<a class="inputDateButton" href="javascript:;" style=" position:absolute; right:-1px; top:0;">选择</a>
					</div>
				</td>			
				<td width="110" align="right">结束划账日期：</td>
				<td>
					<div style="width:98%; position:relative;">
					<input type="text" name="endTime" id="endTime" class="date required" maxDate="${limitSelectTime }" readonly="readonly" style="float:left; width:95%;" value="${endTime}"/>
					<a class="inputDateButton" href="javascript:;" style=" position:absolute; right:-1px; top:0;">选择</a>
					</div>
				</td>
				<td width="110" align="right">划账状态：</td>
                <td>
                	<select name="search_LIKE_transferStatus" style="width:98%; height:22px;">
                		<option value="">--全部--</option>
                		<option value="0" ${transferStatus eq 0 ? "selected='selected'":"" }>未划账</option>
                		<option value="1" ${transferStatus eq 1 ? "selected='selected'":"" }>已划账</option>
                	</select>
                </td>
				</tr>
			</table>	
            </div>
            <div class="subBar">
                <ul>
                    <li><div class="button">
                            <div class="buttonContent">
                                <button type="submit" id="transferSubmit">搜索</button>
                            </div>
                        </div></li>
                </ul>
            </div>
        </div>
    </div>
</form>

<div class="pageContent">

	<div class="panelBar">
		<ul class="toolBar">
			<shiro:hasPermission name="transferManager:show">
			<li><a iconClass="page_excel" href="javascript:transferExport('1');"><span>导出当前页</span></a></li>
			<li><a iconClass="page" href="javascript:transferExport('0');"><span>导出所有页</span></a></li>
			<li><a iconClass="book_edit" target="selectedTodo" rel="ids" href="${contextPath }/management/system/transfer/updateTransfer" title="确认要修改该信息的划账状态吗?"><span>修改划账状态</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>

	
	<table class="table" layoutH="177" width="1515">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="25"><input type="checkbox" group="ids" class="checkboxCtrl"></th>
				<th width="130">所属省公司</th>
				<th width="140">业务系统</th>
				<th width="110">业务种类</th>
				<th width="120">刷卡总金额(元)</th>
				<th width="120">银联总手续费(元)</th>
				<th width="100">结算金额(元)</th>
				<th width="150">划账账号</th>
				<th width="150">帐户名</th>
				<th width="150">开户行</th>
				<th width="80">划账状态</th>
				<th width="130" orderField="transferTime" class="${page.orderField eq 'transferTime' ? page.orderDirection : ''}">划账时间</th>
				<th width="100">划账人</th>
<%--				<th width="30">操作</th>--%>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${transfers}" varStatus="var">
				<tr target="slt_transferId" rel="${item.id}">
					<td align="center">${var.count}</td>
					<td><input type="checkbox"  name="ids" value="${item.id}" ></td>
					<td>${item.provinceOrg.name}</td	>
					<td>${item.supportSystem.systemName}</td>
					<td>${item.business.businessName}</td>
					<td align="right"><fmt:formatNumber value="${item.money}" pattern="##,##,##0.00"/></td>
					<td align="right"><fmt:formatNumber value="${item.fee}" pattern="##,##,##0.00" /></td>
					<td align="right"><fmt:formatNumber value="${item.actualMoney}" pattern="##,##,##0.00"/></td>
					<td>${item.accountNo}</td>
					<td>${item.accountName}</td>
					<td>${item.bankName}</td>
					<td>${item.transferStatus eq 1 ? "已划账" : "未划账"}</td>
					<td>
					<fmt:formatDate value="${empty item.transferTime ? '' : item.transferTime}" pattern='yyyy-MM-dd HH:mm:ss' />
					</td>
					<td>${empty item.transferUser ? "" : item.transferUser}</td>
<%--					<td>--%>
<%--						<a href="javascript:if(confirm('确实要删除该内容吗?'))location='http://www.google.com'"><span>修改状态</span></a>--%>
<%--						<a onclick="changeStatus(${item.id})"><span>修改状态</span></a>--%>
<%--					</td>--%>
				</tr>
			</c:forEach>
		</tbody>
		<tfoot>
			<tr>
				<th colspan="13" height="30">
				<div style="padding-left:15px;">合计：总笔数:<strong style="font-size:14px;">${count}</strong>(笔)，结算总金额:<strong style="font-size:14px;"><fmt:formatNumber value="${countActualMoney}" pattern="##,##,##0.00"/></strong>(元)</div>
				</th>		
			</tr>
		</tfoot>
	</table>
	<c:if test="${empty transfers}">
		    	<div class="re_tips">没有搜到符合您条件的数据！</div>
   	</c:if>
	<!-- 分页 -->
	<dwz:pagination page="${page }"/>
</div>
