<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>  
<script type="text/javascript">
	var c4_url_params = "";
	var c4_setParamsWhenSubmit = function(){
		var siteCode=$("#c4_siteCode").val(),
		    beginDate = $("#c4_beginDate").val(),
		    endDate = $("#c4_endDate").val() ,
		    terminalCod = $("#c4_terminalCode").val();
		
		c4_url_params="";
		if(siteCode==null||siteCode==""){
			alertMsg.info("请选择网点！");
			return false;
		}
		
		if(beginDate ||  endDate  ){
			var gapDay = daysBetween(beginDate, endDate);
			if(parseInt(gapDay)<0){
				alertMsg.info("开始日期不能大于结束日期，请重新选择！");
				return false;
			}
		}
		
		if(terminalCod!=null&&terminalCod!=""){
			c4_url_params = c4_url_params +"&terminalCod="+terminalCod;
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
		}*/
		
		
		c4_url_params = "&beginDate="+beginDate
			+"&endDate="+endDate
			+"&siteCode="+siteCode;
		return true;
		
	}
	$(document).ready(function(){
		$("#c4_exportPdf").click(function(){
			c4_setParamsWhenSubmit();
			if(${page.totalCount }>0){
				var url = "${contextPath }/report/tradingDetailsReportC4?format=pdf&organization.code=${siteCode}&transMoney=${transMoney }&rate=${rate }&clearMoney=${clearMoney }";
				url = url + c4_url_params;
				window.open(url);
			}else{
				alertMsg.info("请先查询出数据再导出！");	
			}
		});
		$("#c4_exportExcel").click(function(){
			c4_setParamsWhenSubmit();
			if(${page.totalCount }>0){
				var url = "${contextPath }/report/tradingDetailsReportC4?format=xls&organization.code=${siteCode}&transMoney=${transMoney }&rate=${rate }&clearMoney=${clearMoney }";
				url = url + c4_url_params;
				window.open(url);
			}else{
				alertMsg.info("请先查询出数据再导出！");	
			}
		}); 
		//c4_terminalCode 内部终端号自动补全
		$("#c4_terminalCode").autocomplete({
			serviceUrl: '${contextPath }/management/system/internalTerminalno/getInternal_terminal'
		});
		
		//网点输入自动补全
		$('#c4_siteName').autocomplete({
			serviceUrl: '${contextPath }/management/security/organization/getOrgName?onlySite=true',
	 		onSelect: function (suggestion) {
	        	var data = suggestion.data ;
	 			$("#c4_siteCode").val(data);
	     	},
	     	onSearchStart: function (query) {
			 	$("#c4_siteCode").val("");
 	 	 	},
	     	onSearchComplete: function (query) {
		 		$("#c4_siteCode").val("");
	 	  	}
		});
		//如果自动填充(网点补全)时没有选择查询结果,查看范围的输入框将会清空内容
		$('#c4_siteName').blur(function(){
			var code =$("#c4_siteCode").val() ;
			if(!code){
				$('#c4_siteName').val("");
			}
		});
	});
	$(function(){
		lookup_cleanbtn("reportC4_form");
		if($("#reportC4_form [name='organization.name']").val()==''){
			$("#reportC4_form .h-cleanBtn").css("display","none");
		}
	});
</script>
  <dwz:paginationForm action="${contextPath }/report/tradingDetailsIndexC4" page="${page }">
	<input type="hidden" name="organization.code"  value="${siteCode}"/>
	<input type="hidden" name="organization.name"  value="${siteName}"/>
	<input type="hidden" name="organization.orgLevel"  value="${orgLevel}"/>
	<input type="hidden" name="beginDate" value="${c4_beginDate}"/>
	<input type="hidden" name="endDate" value="${c4_endDate}"/>
	<input type="hidden" name="terminalCode" value="${param.terminalCode}"/>
	<input type="hidden" name="isFirst"  value="1"/>
</dwz:paginationForm>
<div class="pageContent">
	<div class="tabs">
		<div class="tabsContent re_tabsContent">
			<div >
				<form method="post" id="reportC4_form" action="${contextPath }/report/tradingDetailsIndexC4" class="required-validate pageForm"
					onsubmit="return c4_setParamsWhenSubmit() && navTabSearch(this)">
				<input name="isFirst" type="hidden" value="1"/>
				<div class="pageHeader re_pageHeader">
					<div class="searchBar repeat_searchBar">
						<div class="searchContent repeat_searchContent">
							<table class="h-table" style="width:90%;">
								<tr>
								<td width="90" align="right">网点：</td>
								<td style="position:relative;">
								<a class="h-cleanBtn" title="清空" style=" right:16px;">X</a>
								<input id="c4_siteCode" name="organization.code" type="hidden" value="${siteCode}"/>
								<input style="width:95.5%;" class="validate[required] required textInput" type="text" name="organization.name" id="c4_siteName" value="${siteName}"/>
								
							</td>
							<td width="30"><a class="btnLook" lookupgroup="organization" href="${contextPath }/management/security/organization/lookup2org/reportC4_form?selectAll=false&permissionKey=<%=com.rongbang.utils.PlatformConstants.PERMISSION_REPORT_C4 %>" width="400">选择组织机构</a></td>
							<td width="90" align="right">终端编码：</td><%-- 内部终端号--%>
							<td>
								<input style="width:98%;" type="text" class="validate[maxSize[32]]" name="terminalCode" id="c4_terminalCode" value="${param.terminalCode }"/>
							</td>
							<td width="90" align="right">开始日期：</td>
							<td>
							<div style="width:98%; position:relative;">
								<input type="text" name="beginDate" id="c4_beginDate" value="${c4_beginDate}" style="float:left; width:95%;" maxDate="${limSelectDate}" class="date required" readonly="true"/>
								<a class="inputDateButton" href="javascript:;" style=" position:absolute; right:-1px; top:0;">选择</a>
							</div>	
							</td>
							</tr>
							<tr>
							<td width="90" align="right">结束日期：</td>
							<td>
							<div style="width:98%; position:relative;">
								<input type="text" name="endDate" id="c4_endDate" value="${c4_endDate}" style="float:left; width:95%;"  maxDate="${limSelectDate}" class="date required" readonly="true"/>
								<a class="inputDateButton" href="javascript:;" style=" position:absolute; right:-1px; top:0;">选择</a>
							</div>	
							</td>
							<td colspan="5">&nbsp;</td>
							</tr>
							</table>
						</div>
						<div class="subBar repeat_subBar">
							<ul>						
								<li>
									<div class="button">
										<div class="buttonContent"><button type="submit">搜索</button></div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</form>
	<div class="panelBar">
		<ul class="toolBar">
			<li><a iconClass="report" id="c4_exportPdf"><span>导出PDF</span></a></li>
			<li><a iconClass="page_white_excel" id="c4_exportExcel"><span>导出Excel</span></a></li>
			 
		</ul>
	</div>
			<c:if test="${isFirst==null||isFisrt=='' }">
				<div layoutH="95" id="tradingDetailsReportC4Content" class="unitBox" >
					<br>
					<p style="color:#999; padding:10px; text-align:center; font-size:14px;">温馨提示：请先输入网点编码！</p>
				</div>
			</c:if>
			<c:if test="${isFirst!=null}">
					<div layoutH="118" id="tradingDetailsReportC4Content" class="unitBox" >
						<c:import url="/report/tradingDetailsReportC4?pageNum=${page.pageNum }&numPerPage=${page.numPerPage }&transMoney=${transMoney }&rate=${rate }&clearMoney=${clearMoney }&totalPage=${page.totalPage }" charEncoding="UTF-8" />
					</div>
					<dwz:pagination page="${page }"/>
			</c:if>
			</div>
		</div>
	</div>
</div>