<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>  
<script type="text/javascript">
	var url_params = "";
	var setParamsWhenSubmit = function(){
		var bizId=$("#business").val(),
		    beginDate = $("#beginDate").val(),
		    endDate = $("#endDate").val();
		
		var gapDay = daysBetween(beginDate, endDate);
		if(parseInt(gapDay)<0){
			alertMsg.info("开始日期不能大于结束日期，请重新选择！");
			return false;
		}else if(parseInt(gapDay)>31){
			alertMsg.info("最大时间跨度不能超过一个月，请重新选择！");
			return false;
		}
		
		url_params = "&beginDate="+beginDate+"&endDate="+endDate+"&bizId="+bizId;
		return true;
		
	};
	
	$(document).ready(function(){
		$("#exportPdf").click(function(){
			if("${page.totalCount}">0){
				setParamsWhenSubmit();
				var url = "${contextPath }/report/bizPaySumReportD2?format=pdf&organization.code=${siteCode}";
				url = url + url_params;
				window.open(url);
			}else{
				alertMsg.info("请先查询出数据再导出！");	
			}
		});
		$("#exportExcel").click(function(){
			if("${page.totalCount}">0){
				setParamsWhenSubmit();
				var url = "${contextPath }/report/bizPaySumReportD2?format=xls&organization.code=${siteCode}";
				url = url + url_params;
				window.open(url);
			}else{
				alertMsg.info("请先查询出数据再导出！");	
			}
		}); 
		
	});
	$(function(){
		lookup_cleanbtn("reportB2_form");
		if($("#reportB2_form [name='organization.name']").val()==''){
			$("#reportB2_form .h-cleanBtn").css("display","none");
		}
	});
</script>
<dwz:paginationForm action="${contextPath }/report/bizPaySumD2" page="${page }">
	<input name="bizId" type="hidden" value="${bizId}"/>
	<input type="hidden" name="bizName"  value="${bizName}"/>
	<input name="organization.orgLevel" type="hidden" value="${orgLevel}"/>
	<input type="hidden" name="beginDate" value="${beginDate}"/>
	<input type="hidden" name="endDate" value="${endDate}"/>
	<input name="isFirst" type="hidden" value="1"/>
</dwz:paginationForm> 
<div class="pageContent">
	<div class="tabs">
		<div class="tabsContent re_tabsContent">
			<div >
				<form method="post" id="reportB2_form" action="${contextPath }/report/bizPaySumD2" onsubmit="return setParamsWhenSubmit() && navTabSearch(this);">
				<input name="isFirst" type="hidden" value="1"/>
				<div class="pageHeader">
					<div class="searchBar repeat_searchBar">
						<div class="searchContent repeat_searchContent">
							<table class="h-table" style="width:90%;">
							<tr>
								<td width="90px" align="right">业务种类：</td>
								<td style="position:relative;">
									<dwz:business id="business"  paramName="bizId" style="width:98%; height:22px;" selectedValue="${bizId}"/>
								</td>
								<td width="90px" align="right">开始日期：</td>
								<td>
								<div style="width:98%; position:relative;">
									<input type="text" name="beginDate" id="beginDate" maxDate="${limSelectDate}" value="${beginDate }"  style="float:left; width:95%;" class="date required" readonly="true"/>
									<a class="inputDateButton" href="javascript:;" style=" position:absolute; right:-1px; top:0;">选择</a>
								</div>	
								</td>
								<td width="90px" align="right">结束日期：</td>
								<td>
								<div style="width:98%; position:relative;">
									<input type="text" name="endDate" id="endDate" value="${endDate }" maxDate="${limSelectDate}" style="float:left; width:95%;" class="date required" readonly="true"/>
									<a class="inputDateButton" href="javascript:;" style=" position:absolute; right:-1px; top:0;">选择</a>
								</div>	
								</td>
							</tr>
							</table>
						</div>
						<div class="subBar repeat_subBar">
							<ul>						
								<li>
									<div class="button">
										<div class="buttonContent">
										<button type="submit">搜索</button>
									
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</form>
	<div class="panelBar">
		<ul class="toolBar">
			<li><a iconClass="report" id="exportPdf"><span>导出PDF</span></a></li>
			<li><a iconClass="page_white_excel" id="exportExcel"><span>导出Excel</span></a></li>
			 
		</ul>
	</div>
			<c:if test="${isFirst==null||isFisrt=='' }">
				<div layoutH="95" id="bizPaySumReportD2Content" class="unitBox" >
					<br>
					<p style="color:#999; padding:10px; text-align:center; font-size:14px;">温馨提示：请先选择机构！</p>
				</div>
			</c:if>	
			<c:if test="${isFirst!=null}">
				<div layoutH="95" id="bizPaySumReportD2Content" class="unitBox" >
					<c:import url="/report/bizPaySumReportD2?pageNum=${page.pageNum }&numPerPage=${page.numPerPage }" charEncoding="UTF-8" />
				</div>
				<dwz:pagination page="${page }"/>
			</c:if>
			</div>
		</div>
	</div>
</div>