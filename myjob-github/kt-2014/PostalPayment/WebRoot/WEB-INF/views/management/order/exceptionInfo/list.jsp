<%@page import="com.rongbang.utils.PlatformConstants"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@page import="java.util.Date"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
	$("#exceptionInfo_sub").click(function(){
		var  startTime =$("#startTime").val();
	    var  endTime =	$("#endTime").val();
	 
		var order_gapDay = daysBetween(startTime, endTime);
	    if(parseInt(order_gapDay)<0){
			alertMsg.info("开始日期不能大于结束日期，请重新选择！");
			return false;
		}else if(parseInt(order_gapDay)>=93){
			alertMsg.info("最大时间跨度不能超过三个月，请重新选择！");
			return false;
		}
	});
	
	function solve(exceptionId){
		alertMsg.confirm("确认解决吗？", {okCall: function(){
				$.ajax({
					type:"post",
					url:"${contextPath }/management/order/exceptionInfo/solveException",
					data:"exceptionId="+exceptionId,
					success:function(msg){
						//alert(msg);
						var json = jQuery.parseJSON(msg);
						//var pTabid = navTab.getCurrentNavTab().attr("pTabid");
					    //navTab.reload( {navTabId: pTabid});
					   // json.navTabId = pTabid;
						navTabAjaxDone(json);
					},
					error:function(msg){
						var json = jQuery.parseJSON(msg);
						navTabAjaxDone(json);
					}
				});
			}
		});
	}
</script>
<dwz:paginationForm action="${contextPath }/management/order/exceptionInfo/list" page="${page }">
	<input type="hidden" name="refNo" value="${param.refNo }"/>
	<input type="hidden" name="search_EQ_cpsorderId" value="${param.search_EQ_cpsorderId }"/>
	<input type="hidden" name="search_EQ_solveState" value="${param.search_EQ_solveState }"/>
	<input type="hidden" name="search_EQ_module" value="${param.search_EQ_module }"/>
	<input type="hidden" name="startTime" value="${startTime }"/>
	<input type="hidden" name="endTime" value="${endTime }"/>
	<input type="hidden" name="isFirst" value="1"/>
</dwz:paginationForm>
<form id="form_exceptionInfo_serch" method="post" action="${contextPath }/management/order/exceptionInfo/list" onsubmit="return navTabSearch(this)">
	<input type="hidden" name="isFirst" value="1"/>
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style="height:auto; width:90%; position:relative;">
			<table class="h-table">
				<tr>
				<td width="110" align="right">参考号：</td>
				<td>
					<input type="text" name="refNo" style="width:93%;" value="${param.refNo }"/>
				</td>
				<td width="110" align="right">卡支付系统订单号：</td>
				<td>
					<input type="text" name="search_EQ_cpsorderId" style="width:93%;" value="${param.search_EQ_cpsorderId}"/>
				</td>
				<td width="110" align="right">解决状态：</td>
				<td>
					<select name="search_EQ_solveState" style="width:98%; height:22px;">
						<option selected="selected" value="">--全部--</option>
						<option value="Y" <c:if test="${param.search_EQ_solveState eq 'Y'}">selected</c:if>>已解决</option>
						<option value="N" <c:if test="${param.search_EQ_solveState eq 'N'}">selected</c:if>>未解决</option>
					</select>
				</td>
				</tr>
				<tr>
				<td width="110" align="right">创建开始时间：</td>
				<td>
				<div style="width:95%; position:relative;">
					<input type="text" name="startTime" id="startTime" value="${startTime }"  maxDate="${limitSelectTime}" class="date" readonly="readonly" style="float:left; width:95%;"/>
					<a  class="inputDateButton" href="javascript:;" style="position:absolute; right:-1px; top:0;">选择</a>
				</div>	
				</td>
				<td width="110" align="right">创建结束时间：</td>
				<td>
				<div style="width:95%; position:relative;">
					<input type="text" name="endTime" id="endTime" value="${endTime }" maxDate="${limitSelectTime}" class="date" readonly="readonly" style="float:left; width:95%;"/>
					<a class="inputDateButton" href="javascript:;" style="position:absolute; right:-1px; top:0;">选择</a>
				</div>	
				</td>
				<td width="110" align="right">来源：</td>
				<td>
					<select name="search_EQ_module" style="width:98%; height:22px;">
						<option selected="selected" value="">--全部--</option>
						<option value="interface" <c:if test="${param.search_EQ_module eq 'interface'}">selected</c:if>>接口</option>
						<option value="dz" <c:if test="${param.search_EQ_module eq 'dz'}">selected</c:if>>对账</option>
						<option value="clear" <c:if test="${param.search_EQ_module eq 'clear'}">selected</c:if>>清分</option>
						<option value="dzfile" <c:if test="${param.search_EQ_module eq 'dzfile'}">selected</c:if>>生成业务系统对账文件</option>
						<option value="other" <c:if test="${param.search_EQ_module eq 'other'}">selected</c:if>>其他</option>
					</select>
				</td>
				</tr>
			</table>	
			</div>
			<div class="subBar">
				<ul>						
					<li><div class="button"><div class="buttonContent"><button type="submit" id="exceptionInfo_sub">搜索</button></div></div></li>
				</ul>
			</div>
		</div>
	</div>
</form>

<div class="pageContent">

<%-- 	<div class="panelBar">
		<ul class="toolBar">
			<shiro:hasPermission name="PaymentWater:export">
			<li><a iconClass="page_excel" href="javascript:exportPaymentCSV('1');"><span>导出当前页</span></a></li>
			<li><a iconClass="page" href="javascript:exportPaymentCSV('0');"><span>导出所有页</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>
 --%>
	<table class="table tabletest" layoutH="118" width="2980">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="300">异常描述</th>	
				<th width="100">来源</th>	
				<th width="80">解决状态</th>	
				<th width="160">卡支付系统订单号</th>
				<th width="100">业务订单号</th>
				<th width="80">参考号</th>
				<th width="80">批次号</th>
				<th width="80">受理流水号</th>
				<th width="125">商户编号(内部)</th>			
				<th width="100">终端编号(内部)</th>
				<th width="150">省公司</th>
				<th width="180">市公司</th>
				<th width="180">区县公司</th>
				<th width="220">网点</th>
				<th width="140">业务系统</th>
				<th width="110">业务种类</th>
				<th width="70">交易代码</th>
				<th width="130" orderField="paymentWater.transTime" class="${page.orderField eq 'paymentWater.transTime' ? page.orderDirection : ''}">交易日期</th>
				<th width="110">卡号</th>
				<th width="70">卡类型</th>				
				<th width="100">交易金额(元)</th>	
				<th width="130" orderField="insertTime" class="${page.orderField eq 'insertTime' ? page.orderDirection : ''}">插入时间</th>
				<th width="70">操作</th>		
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${listExceptionInfo}" varStatus="var">
			<tr target="pay_id" rel="${item.id}">
				<td align="center">${var.count}</td>
				<td class="exceptionInfo_td">${item.description }</td>	
				<td><dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.CONVERT_EXCEPTION_MODULE %>" dataValue="${item.module }"/></td>	
				<td>
					<c:if test="${item.solveState=='N' }">未解决</c:if>
					<c:if test="${item.solveState=='Y' }">已解决</c:if>
				</td>	
				<td>${item.cpsorderId }</td>
				<td>${item.bizorderId}</td>
				<td>${item.paymentWater.refNo }</td>
				<td>${item.paymentWater.batchNo }</td>
				<td>${item.paymentWater.transNo }</td>
				<td>${item.paymentWater.merchNo}</td>			
				<td>${item.paymentWater.termNo}</td>
				<td>${item.paymentWater.order.orgFull.provinceOrg.name}</td>
				<td>${item.paymentWater.order.orgFull.cityOrg.name}</td>
				<td>${item.paymentWater.order.orgFull.countryOrg.name}</td>
				<td>${item.paymentWater.order.orgFull.siteOrg.name}</td>
				<td>${item.paymentWater.order.supportSystem.systemName}</td>
				<td>${item.paymentWater.order.business.businessName}</td>
				<td>${item.paymentWater.transId }</td>
				<td><fmt:formatDate value="${item.paymentWater.transTime }" pattern="yyyy-MM-dd"/></td>
				<td>${item.paymentWater.cardNo }</td>
				<td>${item.paymentWater.cardTypeName }</td>				
				<td><fmt:formatNumber value="${item.paymentWater.money }" pattern="##,###,##0.00"/></td>
				<td><fmt:formatDate value="${item.insertTime }" pattern="yyyy-MM-dd HH:mm:ss"/></td>	
				<td align="center">
					<input type="button" style="height:21px; margin-top:0; cursor:pointer;" value="解决" onclick="solve(${item.id})"  <c:if test="${item.solveState=='Y' }">disabled</c:if>>
				</td>	
			</tr>			
			</c:forEach>	
		</tbody>
	</table>
	<c:if test="${page.totalCount eq 0}">
		    	<div class="re_tips">没有搜到符合您条件的数据！</div>
   	</c:if>
	<!-- 分页 -->
	<dwz:pagination page="${page }"/>
</div>