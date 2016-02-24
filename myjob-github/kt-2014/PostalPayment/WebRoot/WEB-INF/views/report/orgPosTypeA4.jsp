<%@ page language="java" contentType="text/html; charset=UTF-8"
	trimDirectiveWhitespaces="true" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
	var a4_url_params = "";
	var setParamsWhenSubmitA4 = function() {
		var orgId_a4 = $("#orgId_a4").val(), category_a4 = $("#category_a4").val(),year_a4=$("#year_a4").val(),season_a4 = $("#season_a4").val(),month_a4 = $("#month_a4").val(),monthOrseason_a4 = $("#monthOrseason_a4").val();
		a4_url_params = a4_url_params+"&orgId_a4=" + orgId_a4 + "&category_a4=" + category_a4 + "&year_a4=" + year_a4 + "&season_a4=" + season_a4 + "&month_a4=" + month_a4 + "&monthOrseason_a4=" + monthOrseason_a4;
		//alert("orgId_a4:"+orgId_a4+"--------category_a4:"+category_a4+"------season_a4:"+season_a4+"-------month_a4:"+month_a4+"-------monthOrseason_a4:"+monthOrseason_a4+"-------year_a4:"+year_a4);
		//alert(a4_url_params);
		
		return true;
	}
	$(document).ready(function() {
		//用于页面点击搜索后回显
		var key_a4 = $("#monthOrseason_a4").val();
		if (key_a4 == 1) {
			$("#month_a4").show();
			$("#season_a4").hide();
		}
		if (key_a4 == 2) {
			$("#season_a4").show();
			$("#month_a4").hide();
		}
		$("#a4_exportPdf").click(function() {
			setParamsWhenSubmitA4();
			
			//导出前先判断是否有点击'搜索'查出出数据
			var haveSerch =${isFirst != null} ;
			if(!haveSerch){
				alertMsg.info("请选择搜索条件,点击'搜索'按钮查询数据");
				return false ;
			}
			var text = $("#orgPosTerReportA4").text();
			if(text.indexOf("没有符合条件的信息")>=0){
				alertMsg.info("请查询出数据再导出");
				return false;
			}
			
			var url = "${contextPath }/report/orgPosTypeReportA4?format=pdf";
			url = url + a4_url_params;
			window.open(url);
		});
		$("#a4_exportExcel").click(function() {
			setParamsWhenSubmitA4();
			
			//导出前先判断是否有点击'搜索'查出出数据
			var haveSerch =${isFirst != null} ;
			if(!haveSerch){
				alertMsg.info("请选择搜索条件,点击'搜索'按钮查询数据");
				return false ;
			}
			var text = $("#orgPosTerReportA4").text();
			if(text.indexOf("没有符合条件的信息")>=0){
				alertMsg.info("请查询出数据再导出");
				return false;
			}
			
			var url = "${contextPath }/report/orgPosTypeReportA4?format=xls";
			url = url + a4_url_params;
			window.open(url);
		});
		$("#monthOrseason_a4").change(function() {
			var key_a4 = $("#monthOrseason_a4").val();
			if (key_a4 == 1) {
				$("#month_a4").show();
				$("#season_a4").hide();
			}
			if (key_a4 == 2) {
				$("#season_a4").show();
				$("#month_a4").hide();
			}
		});
	});
</script>

<div class="pageContent">
	<div class="tabs">
		<div class="tabsContent re_tabsContent">
			<div>
				<form method="post" action="${contextPath }/report/orgPosTypeIndexA4"
					class="required-validate pageForm"
					onsubmit="return setParamsWhenSubmitA4() && navTabSearch(this);">
					<input type="hidden"  name="isFirst_a4" value="1" />
					<div class="pageHeader re_pageHeader">
						<div class="searchBar repeat_searchBar">
							<input  type="hidden" name="isFrist_a4" value="1" />
							<input  type="hidden" id="init_a4" value="" />
							<div class="searchContent repeat_searchContent">
								<table class="h-table" style="width:90%;">
								<tr>
								<td width="90px" align="right">选择机构：</td> 
								<td><select id="orgId_a4" name="orgId_a4" style="width:98%;">
										<option value="${sameOrg.code }" <c:if test="${org_id eq sameOrg.code}">selected</c:if> >本级机构</option>
										<c:forEach var="lowerOrg" items="${lowerOrgs}">
											<option value="${lowerOrg.code }" <c:if test="${org_id eq lowerOrg.code}">selected</c:if> >${lowerOrg.name}</option>
										</c:forEach>
								</select>
								</td>
								<td width="90px" align="right">机构属性：</td> 
								<td><select id="category_a4"
									name="category_a4" style="width:98%;">
										<option value="0" <c:if test="${category eq 0}">selected</c:if>>全部</option>
										<option value="1" <c:if test="${category eq 1}">selected</c:if>>邮政网点</option>
										<option value="2" <c:if test="${category eq 2}">selected</c:if>>便民服务站</option>
								</select>
								</td>
								<td width="90px" align="right">统计周期：</td> 
								<td><select
									name="year_a4" id="year_a4">
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
								</select> <select id="monthOrseason_a4" name="monthOrseason_a4">
										<option value="1" <c:if test="${monthOrSeason eq '1'}">selected</c:if>>月份</option>
										<option value="2" <c:if test="${monthOrSeason eq '2'}">selected</c:if>>季度</option>
								</select> <select id="month_a4" name="month_a4">
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
								</select> <select id="season_a4" name="season_a4" style="display:none;">
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
							<li><a iconClass="report" id="a4_exportPdf"><span>导出PDF</span>
							</a>
							</li>
							<li><a iconClass="page_white_excel" id="a4_exportExcel"><span>导出Excel</span>
							</a>
							</li>
							
					</ul>
				</div>
					<c:if test="${isFirst==null||isFisrt=='' }">
						<div layoutH="100" id="orgPostTerA4Content" class="unitBox">
							<br>	
							<p style="color:#999; padding:10px; text-align:center; font-size:14px;">温馨提示：请先输入查询条件！</p>
						</div>
					</c:if>
					
					<c:if test="${isFirst != null}">
						<div layoutH="70" id="orgPosTerReportA4" class="unitBox" >
							<c:import url="/report/orgPosTypeReportA4" charEncoding="UTF-8" />
						</div>
					</c:if>	
				
			</div>
		</div>
	</div>
</div>