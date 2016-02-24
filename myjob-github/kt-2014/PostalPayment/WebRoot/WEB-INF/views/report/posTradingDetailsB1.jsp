<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>  
<script type="text/javascript">
	var b1_url_params = "";
	var b1_setParamsWhenSubmit = function(){
		var siteCode=$("#b1_siteCode").val(),
		    beginDate = $("#b1_beginDate").val(),
		    endDate = $("#b1_endDate").val(),
		    transId	=  $("#b1_transId").val();
		
		if(siteCode==null||siteCode==""){
			alertMsg.info("请选择网点！");
			return false;
		} 
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
		}else if(parseInt(gapDay)>31){
			alertMsg.info("最大时间跨度不能超过一个月，请重新选择！");
			return false;
		}
		b1_url_params="";
		//如果机构属性,交易类型,结算状态.其中有不为空的
		if(transId!=null && transId!='' ){
			b1_url_params = b1_url_params + "&transId="+transId  ;
		}
		b1_url_params =  b1_url_params + "&beginDate="+beginDate
			+"&endDate="+endDate
			+"&siteCode="+siteCode;
		return true;
	}
	$(document).ready(function(){
		$("#b1_exportPdf").click(function(){
			b1_setParamsWhenSubmit();
			if('${page.totalCount }'>0){
				var url = "${contextPath }/report/posTradingDetailsReportB1?format=pdf&organization.code=${siteCode}&transMoney=${transMoney }&rate=${rate }&clearMoney=${clearMoney }";
				url = url + b1_url_params;
				window.open(url);
			}else{
				alertMsg.info("请先查询出数据再导出！");	
			}
		});
		$("#b1_exportExcel").click(function(){
			b1_setParamsWhenSubmit();
			if('${page.totalCount }'>0){
				var url = "${contextPath }/report/posTradingDetailsReportB1?format=xls&organization.code=${siteCode}&transMoney=${transMoney }&rate=${rate }&clearMoney=${clearMoney }";
				url = url + b1_url_params;
				window.open(url);
			}else{
				alertMsg.info("请先查询出数据再导出！");	
			}
		}); 
		//网点输入自动补全
		$('#b1_siteName').autocomplete({
			serviceUrl: '${contextPath }/management/security/organization/getOrgName?onlySite=true',
	 		onSelect: function (suggestion) {
	        	var data = suggestion.data ;
	 			$("#b1_siteCode").val(data);
	     	},
	     	onSearchStart: function (query) {
			 	$("#b1_siteCode").val("");
 	 	 	},
	     	onSearchComplete: function (query) {
		 		$("#b1_siteCode").val("");
	 	  	}
		});
		//如果自动填充(网点补全)时没有选择查询结果,查看范围的输入框将会清空内容
		$('#b1_siteName').blur(function(){
			var code =$("#b1_siteCode").val() ;
			if(!code){
				$('#b1_siteName').val("");
			}
		});
	});
	$(function(){
		lookup_cleanbtn("reportB1_form");
		if($("#reportB1_form [name='organization.name']").val()==''){
			$("#reportB1_form .h-cleanBtn").css("display","none");
		}
	});
</script>
<dwz:paginationForm action="${contextPath }/report/posTradingDetailsB1" page="${page }">
	<input name="organization.code" type="hidden" value="${siteCode}"/>
	<input type="hidden" name="organization.name"  value="${siteName}"/>
	<input type="hidden" name="transId" value="${param.transId }"/>
	<input type="hidden" name="beginDate" value="${b1_beginDate}"/>
	<input type="hidden" name="endDate" value="${b1_endDate}"/>
	<input name="isFirst" type="hidden" value="1"/>
	<input name="transMoney" type="hidden" value="${transMoney }"/>
	<input name="rate" type="hidden" value="${rate }"/>
	<input name="clearMoney" type="hidden" value="${clearMoney }"/>
</dwz:paginationForm> 
<div class="pageContent">
	<div class="tabs">
		<div class="tabsContent re_tabsContent">
			<div > 
				<form id="reportB1_form" name="reportB1_form" method="post" action="${contextPath }/report/posTradingDetailsB1"
					onsubmit="return b1_setParamsWhenSubmit() && navTabSearch(this);">
				<input name="isFirst" type="hidden" value="1"/>
				<div class="pageHeader re_pageHeader">
					<div class="searchBar repeat_searchBar">
						<div class="searchContent repeat_searchContent">
						<table class="h-table" style="width:90%;">
							<tr>
								<td width="90" align="right">网点：</td>
								<td style="position:relative;">
									<a class="h-cleanBtn" title="清空" style="right:16px;">X</a>
									<input id="b1_siteCode" name="organization.code" type="hidden" value="${siteCode}"/>
									<input style="width:95.5%;" class="validate[required] required textInput " type="text"  name="organization.name" id="b1_siteName" value="${siteName}"/>
								</td>
								
								<td width="30"><a class="btnLook" lookupgroup="organization" href="${contextPath }/management/security/organization/lookup2org/reportB1_form?selectAll=false&permissionKey=<%=com.rongbang.utils.PlatformConstants.PERMISSION_REPORT_B1 %>" width="400">选择组织机构</a></td>
								
								<td width="90" align="right">业务订单号：</td>
								<td>
									<input style="width:95.5%;" class="textInput " type="text"  name="bizorderId" id="bizorderId" value="${bizorderId}"/>
								</td>
								
								<td width="90" align="right">支付订单号：</td>
								<td>
									<input style="width:95.5%;" class="textInput " type="text"  name="CPSorderId" id="CPSorderId" value="${CPSorderId}"/>
								</td>
								
								<td width="90" align="right">交易类型：</td>
								<td>
									<dwz:dicItem themeName="payment_transId" id="b1_transId" style="width:98%;" paramName="transId" selectedValue="${param.transId}" />
								</td>
							</tr>
							
							<tr>
								<td width="90" align="right">流水号：</td>
								<td>
									<input style="width:95.5%;" class=" textInput " type="text"  name="transNo" id="transNo" value="${transNo}"/>
								</td>
								
								<td></td>
								
								<td width="90px" align="right">业务种类：</td>
								<td style="position:relative;">
									<dwz:business id="business"  paramName="bizId" style="width:98%; height:22px;" selectedValue="${bizId}"/>
								</td>
								
								<td width="90" align="right">开始日期：</td>
								<td>
									<div style="width:98%; position:relative;">
										<input type="text" name="beginDate" value="${b1_beginDate}" id="b1_beginDate" maxDate="${limSelectDate}" style="float:left; width:95%;" class="date required" readonly="true"/>
										<a class="inputDateButton" href="javascript:;" style=" position:absolute; right:-1px; top:0;">选择</a>
									</div>	
								</td>
								
								<td width="90" align="right">结束日期：</td>
								<td>
									<div style="width:98%; position:relative;">
										<input type="text" name="endDate" id="b1_endDate" value="${b1_endDate}" maxDate="${limSelectDate}" style="float:left; width:95%;" class="date required" readonly="true"/>
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
					<li><a iconClass="report" id="b1_exportPdf"><span>导出PDF</span></a></li>
					<li><a iconClass="page_white_excel" id="b1_exportExcel"><span>导出Excel</span></a></li>
					 
				</ul>
			</div>
			<c:if test="${isFirst==null||isFisrt=='' }">
				<div layoutH="115" id="tradingDetailsReportB1Content" class="unitBox" >
					<br>
					<p style="color:#999; padding:10px; text-align:center; font-size:14px;">温馨提示：请先选择网点！</p>
				</div>
			</c:if>	
			<c:if test="${isFirst!=null}">
				<div layoutH="115" id="tradingDetailsReportB1Content" class="unitBox" >
					<c:import url="/report/posTradingDetailsReportB1?pageNum=${page.pageNum }&numPerPage=${page.numPerPage }&transMoney=${transMoney }&rate=${rate }&clearMoney=${clearMoney }&totalPage=${page.totalPage }" charEncoding="UTF-8" />
				</div>
				<dwz:pagination page="${page }"/>
			</c:if>		
			</div>
		</div>
	</div>
</div>
