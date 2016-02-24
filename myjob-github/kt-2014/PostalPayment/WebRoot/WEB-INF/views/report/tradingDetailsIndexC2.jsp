<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>  
<script type="text/javascript">
	var c2_url_params = "";
	var c2_setParamsWhenSubmit = function(){
		
		var siteCode=$("#c2_siteCode").val(),
		    beginDate = $("#c2_beginDate").val(),
		    endDate = $("#c2_endDate").val();
		
		if(siteCode==null||siteCode==""){
			alertMsg.info("请选择网点！");
			return false;
		} 
		
		if(beginDate || endDate){
			var gapDay = daysBetween(beginDate, endDate);
			if(parseInt(gapDay)<0){
				alertMsg.info("开始日期不能大于结束日期，请重新选择！");
				return false;
			}
		}
		
		
		/*
		if(beginDate==null||beginDate==""){
			alertMsg.info("请输入开始日期！");
			return false;
		} 
		if(endDate==null||endDate==""){
			alertMsg.info("请输入结束日期！");
			return false;
		} 
		
		var gapDay = daysBetween(beginDate, endDate);
		if(parseInt(gapDay)<0){
			alertMsg.info("开始日期不能大于结束日期，请重新选择！");
			return false;
		}else if(parseInt(gapDay)>=93){
			alertMsg.info("最大时间跨度不能超过三个月，请重新选择！");
			return false;
		}
		*/
		c2_url_params="";
		c2_url_params = "&beginDate="+beginDate
					+"&endDate="+endDate
					+"&siteCode="+siteCode;
		return true;
		
	}
	$(document).ready(function(){
		$("#c2_exportPdf").click(function(){
			c2_setParamsWhenSubmit();
			if(${page.totalCount }>0){
				var url = "${contextPath }/report/tradingDetailsReportC2?format=pdf&organization.code=${siteCode}&transMoney=${transMoney }&rate=${rate }&clearMoney=${clearMoney }&tradeNum=${tradeNum }";
				url = url + c2_url_params;
				window.open(url);
			}else{
				alertMsg.info("请先查询出数据再导出！");	
			}
		});
		$("#c2_exportExcel").click(function(){
			c2_setParamsWhenSubmit();
			if(${page.totalCount }>0){
				var url = "${contextPath }/report/tradingDetailsReportC2?format=xls&organization.code=${siteCode}&transMoney=${transMoney }&rate=${rate }&clearMoney=${clearMoney }&tradeNum=${tradeNum }";
				url = url + c2_url_params;
				window.open(url);
			}else{
				alertMsg.info("请先查询出数据再导出！");	
			}
		}); 
		
		//网点输入自动补全
		$('#c2_siteName').autocomplete({
			serviceUrl: '${contextPath }/management/security/organization/getOrgName?onlySite=true',
	 		onSelect: function (suggestion) {
	        	var data = suggestion.data ;
	 			$("#c2_siteCode").val(data);
	     	},
	     	onSearchStart: function (query) {
			 	$("#c2_siteCode").val("");
 	 	 	},
	     	onSearchComplete: function (query) {
		 		$("#c2_siteCode").val("");
	 	  	}
		});
		//如果自动填充(网点补全)时没有选择查询结果,查看范围的输入框将会清空内容
		$('#c2_siteName').blur(function(){
			var code =$("#c2_siteCode").val() ;
			if(!code){
				$('#c2_siteName').val("");
			}
		});
	});
	$(function(){
		lookup_cleanbtn("reportC2_form");
		if($("#reportC2_form [name='organization.name']").val()==''){
			$("#reportC2_form .h-cleanBtn").css("display","none");
		}
	});
</script>
<dwz:paginationForm action="${contextPath }/report/tradingDetailsIndexC2" page="${page }">
	<input name="organization.code" type="hidden" value="${siteCode}"/>
	<input type="hidden" name="organization.name"  value="${siteName}"/>
	<input name="organization.orgLevel" type="hidden" value="${orgLevel}"/>
	<input type="hidden" name="beginDate" value="${c2_beginDate}"/>
	<input type="hidden" name="endDate" value="${c2_endDate}"/>
	<input name="isFirst" type="hidden" value="1"/>
</dwz:paginationForm>   
<div class="pageContent">
	<div class="tabs">
		<div class="tabsContent" style="padding:0";>
			<div >
				<form method="post" id="reportC2_form" action="${contextPath }/report/tradingDetailsIndexC2" class="required-validate pageForm"
					 onsubmit="return c2_setParamsWhenSubmit() && navTabSearch(this);">
				 <input name="isFirst" type="hidden" value="1"/>
				<div class="pageHeader">
					<div class="searchBar repeat_searchBar">
						<div class="searchContent repeat_searchContent">
							<table class="h-table" style="width:90%;">
								<tr>
								<td width="90" align="right">网点：</td>
								<td style="position:relative;">
								<a class="h-cleanBtn" title="清空" style="right:16px;">X</a>
								<input id="c2_siteCode" name="organization.code" type="hidden" value="${siteCode}"/>
								<input style="width:95%;" class="validate[required] required textInput" type="text" name="organization.name" id="c2_siteName" value="${siteName}"/>
								
							</td>
							<td width="30"><a class="btnLook" lookupgroup="organization" href="${contextPath }/management/security/organization/lookup2org/reportC2_form?selectAll=false&permissionKey=<%=com.rongbang.utils.PlatformConstants.PERMISSION_REPORT_C2 %>" width="400">选择组织机构</a></td>
							<td width="90" align="right">开始日期：</td>
							<td>
							<div style="width:98%; position:relative;">
								<input type="text" name="beginDate" id="c2_beginDate" value="${c2_beginDate }" style="float:left; width:95%;" maxDate="${limSelectDate}" class="date required" readonly="true"/>
								<a class="inputDateButton" href="javascript:;" style=" position:absolute; right:-1px; top:0;">选择</a>
							</div>	
							</td>
							<td width="90" align="right">结束日期：</td>
							<td>
							<div style="width:98%; position:relative;">
								<input type="text" name="endDate" id="c2_endDate" value="${c2_endDate }" style="float:left; width:95%;" maxDate="${limSelectDate}" class="date required" readonly="true"/>
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
			<shiro:hasPermission name="TradingDetailsC2:show">
				<li><a iconClass="report" id="c2_exportPdf"><span>导出PDF</span></a></li>
				<li><a iconClass="page_white_excel" id="c2_exportExcel"><span>导出Excel</span></a></li>
				 
			</shiro:hasPermission>
		</ul>
	</div>
				<c:if test="${isFirst==null||isFisrt=='' }">
					<div layoutH="100" id="tradingDetailsReportC2Content" class="unitBox" >
						<br>
						<p style="color:#999; padding:10px; text-align:center; font-size:14px;">温馨提示：请先选择网点！</p>
					</div>
				</c:if>	
				<c:if test="${isFirst!=null}">
					<div layoutH="98" id="tradingDetailsReportC2Content" class="unitBox" >
						<c:import url="/report/tradingDetailsReportC2?pageNum=${page.pageNum }&numPerPage=${page.numPerPage }&transMoney=${transMoney }&rate=${rate }&clearMoney=${clearMoney }&tradeNum=${tradeNum }&totalPage=${page.totalPage }" charEncoding="UTF-8" />
					</div>
					<dwz:pagination page="${page }"/>
				</c:if>
			</div>
		</div>
	</div>
</div>