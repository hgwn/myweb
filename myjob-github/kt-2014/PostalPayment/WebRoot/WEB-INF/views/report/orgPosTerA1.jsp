<%@ page language="java" contentType="text/html; charset=UTF-8"
	trimDirectiveWhitespaces="true" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
	var a1_url_params="";
	var setParamsWhenSubmitA1 = function(){
			
		var orgId_a1 = $("#orgId_a1").val(),
			category_a1 = $("#category_a1").val(),
			year_a1=$("#year_a1").val(),
			season_a1 = $("#season_a1").val(),
			month_a1 = $("#month_a1").val(),
			monthOrseason_a1 = $("#monthOrseason_a1").val();
		//全局变量 a1_url_params
		a1_url_params="";
		
		a1_url_params = a1_url_params+"&orgId_a1=" + orgId_a1 + "&category_a1=" + category_a1 + "&year_a1=" + year_a1 + "&season_a1=" + season_a1 + "&month_a1=" + month_a1 + "&monthOrseason_a1=" + monthOrseason_a1;
		//alert("orgId_a1:"+orgId_a1+"--------category_a1:"+category_a1+"------season_a1:"+season_a1+"-------month_a1:"+month_a1+"-------monthOrseason_a1:"+monthOrseason_a1+"-------year_a1:"+year_a1);
		return true;
	}
	$(document).ready(function() {

		//用于搜索后回先时间搜索条件
		var key_a1 = $("#monthOrseason_a1").val();
		if (key_a1 == 1) {
		$("#month_a1").show();
		  $("#season_a1").hide();
		}
		if (key_a1 == 2) {
		  $("#season_a1").show();
		  $("#month_a1").hide();
		}
						
		$("#a1_exportPdf").click(function(){
			setParamsWhenSubmitA1();
			
			//导出前先判断是否有点击'搜索'查出出数据
			var haveSerch =${isFirst != null} ;
			if(!haveSerch){
				alertMsg.info("请选择搜索条件,点击'搜索'按钮查询数据");
				return false ;
		    }
			var text = $("#orgPosTerReportA1").text();
			if(text.indexOf("没有符合条件的信息")>=0){
				alertMsg.info("请查询出数据再导出");
				return false;
			}
			
			var url = "${contextPath }/report/orgPosTerReportA1?format=pdf";
			url = url + a1_url_params;
			window.open(url);
		});
		
		$("#a1_exportExcel").click(function() {
			setParamsWhenSubmitA1();
			
			//导出前先判断是否有点击'搜索'查出出数据
			var haveSerch =${isFirst != null} ;
			if(!haveSerch){
			   alertMsg.info("请选择搜索条件,点击'搜索'按钮查询数据");
			   return false ;
			}
			var text = $("#orgPosTerReportA1").text();
			if(text.indexOf("没有符合条件的信息")>=0){
				alertMsg.info("请查询出数据再导出");
				return false;
			}
			
			
			var url = "${contextPath }/report/orgPosTerReportA1?format=xls";
			url = url + a1_url_params;
			window.open(url);
		});
		
		$("#monthOrseason_a1").change(function() {
			var key_a1 = $("#monthOrseason_a1").val();
			if (key_a1 == 1) {
				$("#month_a1").show();
				$("#season_a1").hide();
			}
			if (key_a1 == 2) {
				$("#season_a1").show();
				$("#month_a1").hide();
			}
		});
  });
</script>
<div class="pageContent">
	<div class="tabs">
		<div class="tabsContent re_tabsContent">
			<div>
				<form method="post" action="${contextPath }/report/orgPosTerIndexA1"
					class="required-validate pageForm"
					onsubmit="return setParamsWhenSubmitA1() && navTabSearch(this);">
					<input type="hidden"  name="isFirst_a1" value="1" />
					<div class="pageHeader re_pageHeader">
						<div class="searchBar repeat_searchBar">
							<input type="hidden" id="isFrist_a1" name="isFrist_a1" value="1" />
							<div class="searchContent repeat_searchContent">
							<table class="h-table" style="width:90%;">
								<tr>
								<td width="90" align="right">选择机构：</td>
								<td style="white-space:nowrap;" noWrap="noWrap">
								 <select id="orgId_a1" name="orgId_a1" style="width:98%;">
										<option value="${sameOrg.code }" <c:if test="${org_id eq sameOrg.code}">selected</c:if> >本级机构</option>
										<c:forEach var="lowerOrg" items="${lowerOrgs}">
											<option value="${lowerOrg.code }" <c:if test="${org_id eq lowerOrg.code}">selected</c:if> >${lowerOrg.name}</option>
										</c:forEach>
								</select>
								</td>
								<td width="90" align="right">机构属性：</td>
								<td>
								<select id="category_a1"
									name="category_a1" style="width:98%;">
										<option value="0" <c:if test="${category eq 0}">selected</c:if>>全部</option>
										<option value="1" <c:if test="${category eq 1}">selected</c:if>>邮政网点</option>
										<option value="2" <c:if test="${category eq 2}">selected</c:if>>便民服务站</option>
								</select>
								</td>
								<td width="90" align="right">统计周期：</td>
								<td>
								 <select
									name="year_a1" id="year_a1">
										<option value="2014" <c:if test="${year eq 2014}">selected</c:if>>2014</option>
										<option value="2015" <c:if test="${year eq 2015}">selected</c:if>>2015</option>
										<option value="2016" <c:if test="${year eq 2016}">selected</c:if>>2016</option>
										<option value="2017" <c:if test="${year eq 2017}">selected</c:if>>2017</option>
										<option value="2018" <c:if test="${year eq 2018}">selected</c:if>>2018</option>
										<option value="2019" <c:if test="${year eq 2019}">selected</c:if>>2019</option>
										<option value="2020" <c:if test="${year eq 2020}">selected</c:if>>2020</option>
										<option value="2021" <c:if test="${year eq 2021}">selected</c:if>>2021</option>
										<option value="2022" <c:if test="${year eq 2022}">selected</c:if>>2022</option>
										<option value="2023" <c:if test="${year eq 2023}">selected</c:if>>2023</option>
										<option value="2024" <c:if test="${year eq 2024}">selected</c:if>>2024</option>
								</select> 
								
								<select id="monthOrseason_a1" name="monthOrseason_a1">
										<option value="1" <c:if test="${monthOrSeason eq '1'}">selected</c:if>>月份</option>
										<option value="2" <c:if test="${monthOrSeason eq '2'}">selected</c:if>>季度</option>
								</select> <select id="month_a1" name="month_a1">
										<option value="01" <c:if test="${month eq '01'}">selected</c:if>>1月</option>
										<option value="02" <c:if test="${month eq '02'}">selected</c:if>>2月</option>
										<option value="03" <c:if test="${month eq '03'}">selected</c:if>>3月</option>
										<option value="04" <c:if test="${month eq '04'}">selected</c:if>>4月</option>
										<option value="05" <c:if test="${month eq '05'}">selected</c:if>>5月</option>
										<option value="06" <c:if test="${month eq '06'}">selected</c:if>>6月</option>
										<option value="07" <c:if test="${month eq '07'}">selected</c:if>>7月</option>
										<option value="08" <c:if test="${month eq '08'}">selected</c:if>>8月</option>
										<option value="09" <c:if test="${month eq '09'}">selected</c:if>>9月</option>
										<option value="10" <c:if test="${month eq '10'}">selected</c:if>>10月</option>
										<option value="11" <c:if test="${month eq '11'}">selected</c:if>>11月</option>
										<option value="12" <c:if test="${month eq '12'}">selected</c:if>>12月</option>
								</select> <select id="season_a1" name="season_a1" style="display:none;">
										<option value="01" <c:if test="${season eq '01'}">selected</c:if>>第一季</option>
										<option value="04" <c:if test="${season eq '04'}">selected</c:if>>第二季</option>
										<option value="07" <c:if test="${season eq '07'}">selected</c:if>>第三季</option>
										<option value="10" <c:if test="${season eq '10'}">selected</c:if>>第四季</option>
								</select>
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
										</div></li>
								</ul>
							</div>
						</div>
					</div>
				</form>
				<div class="panelBar">
					<ul class="toolBar">		   
							<li><a iconClass="report" id="a1_exportPdf"><span>导出PDF</span>
							</a>
							</li>
							<li><a iconClass="page_white_excel" id="a1_exportExcel"><span>导出Excel</span>
							</a>
							</li>
					</ul>
				</div>
				
					<c:if test="${isFirst==null||isFisrt=='' }">
						<div layoutH="90" id="orgPostTerA1Content" class="unitBox">
							<br>	
							<p style="color:#999; padding:10px; text-align:center; font-size:14px;">温馨提示：请先输入查询条件！</p>
						</div>
					</c:if>
					
					<c:if test="${isFirst != null}">
						<div layoutH="80" id="orgPosTerReportA1" class="unitBox" >
							<c:import url="/report/orgPosTerReportA1" charEncoding="UTF-8" />
						</div>
					</c:if>	
				</div>
			</div>
		</div>
</div>