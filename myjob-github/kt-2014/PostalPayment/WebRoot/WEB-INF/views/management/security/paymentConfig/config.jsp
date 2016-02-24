<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">

	var setting = {
		check: {
			enable: true
		},
		view: {
			selectedMulti: false
		},
		data: {
			simpleData: {
				enable:true,
				idKey: "id",
				pIdKey: "pId",
				rootPId: ""
			}
		},
		async: {
			enable: true,
			url:"/PostalPayment/management/security/organization/getAsyncTreeData",
			autoParam: ["id"]
		},
	};
	
	$(document).ready(function(){
		var station_ids = ""
		var data = {};
		$("#testBtn").click(function(){
			var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
			var nodes = treeObj.getNodesByParam("orgLevel", 6, null);
			
			for (var i = 0; i < nodes.length; i++) {
				if(nodes[i].checked){
					station_ids = station_ids + nodes[i].id + ",";
				}
			}
			if($.trim(station_ids)==""){
				alert("请最少勾选一个需要配置的网点！");
				return false;
			}
			data.stations = station_ids;
			var config_infos = [];
			var cboxs =  $("input:checkbox[name=systems]:checked");
			if(cboxs.length<=0){
				alert("请选择业务系统！");
				return false;
			}
			for (var j = 0; j < cboxs.length; j++) {
				var code = $(cboxs[j]).attr("code");
				var relation_trs = $("#"+code).find("tr");
				for (var k = 0; k < relation_trs.length; k++) {
					var card_info = {},
						card_ids = "";;
					var relation_id = $(relation_trs[k]).attr("relation_id");
					var cardboxs =  $("input:checkbox[name='"+relation_id+"']:checked");
					if(cardboxs.length<=0){
						var system_nick = $("#"+code).attr("nick");
						var business_nick = $(relation_trs[k]).attr("nick");
						alert('请最少勾选一个('+system_nick+'-'+business_nick+')的可刷卡类型!');
						return false;
					}
					
					for (var l = 0; l < cardboxs.length; l++) {
						card_ids = card_ids + $(cardboxs[l]).attr("value") + ",";
					}
					card_info.relation_id = relation_id;
					card_info.card_ids = card_ids;
					config_infos.push(card_info);
				}
			}
			data.config_infos = config_infos;
			$.ajax({
				type:"post",
				url:"/PostalPayment/management/security/paymentConfig/saveConfigInfo",
				data:{"datas":JSON.stringify(data)},
				success:function(msg){
					alert(msg);
				},
				error:function(msg){
					alert("error:"+msg);
				}
			});
		});
		
		$(".systems").click(function(){
			var code = $(this).attr("code");
			if(this.checked){
				if($("#business_card_select").css("display")=="none"){
					$("#business_card_select").show();
				}
				$("#"+code).show();
			}else{
				$("#"+code).hide();
			}		
		});
		$.ajax({
			   type: "POST",
			   url: "/PostalPayment/management/security/paymentConfig/getTreeData",
			   dataType : 'json', 
			   success: function(msg){
			   		$.fn.zTree.init($("#treeDemo"), setting, msg);
			   },
			   error: function(msg){
			     alert( "error: " + msg );
			   }
		});
	 });
</script>
 
<body>
<div class="pageContent">
	<div class="tabs">
		<div class="tabsContent">
			<div>
				<div layoutH="5" id="jbsxBox2organizationTree" style="float:left; display:block; overflow:auto; width:300px; border:solid 1px #CCC; line-height:21px; background:#fff;">
					<ul id="treeDemo" class="ztree"></ul>
				</div>
				
				<div layoutH="0" id="jbsxBox2organizationList" class="unitBox" style="margin-left:306px; background:#fff">
					
		<ul class="config-info">
			<li class="config-title"><h2>1、请选择配置的业务系统</h2>
				<input type="checkbox" code="501"  class="systems" name="systems" value="邮政营业系统" />
					<label>邮政营业系统</label>
				<input type="checkbox" code="502"  class="systems" name="systems" value="报刊业务系统" /><label>报刊业务系统</label>
				<input type="checkbox" code="503"  class="systems" name="systems" value="电子商务信息平台" /><label>电子商务信息平台</label>
				<input type="checkbox" code="504"  class="systems" name="systems" value="便民服务站" /><label>便民服务站</label>
			</li>
			<li	class="config-title" id="business_card_select" style="display:none;">
			<h2>2、请配置业务可刷卡种</h2>
				<div class="config-business" id="501" nick="邮政营业系统">
					<span>邮政营业系统</span>
					<div >
						<table>
							<tr relation_id="4_1" nick="业务一">
								<td>
									<label>业务一：</label>
								</td>
								<td>
									<input type="checkbox" name="4_1" value="1" />邮乐卡
									<input type="checkbox" name="4_1" value="2" />银联卡
									<input type="checkbox" name="4_1" value="3" />借记卡
								</td>
							</tr>
							<tr relation_id="4_2" nick="业务二">
								<td>
									<label>业务二：</label>
								</td>
								<td>
									<input type="checkbox" name="4_2" value="1" />邮乐卡
									<input type="checkbox" name="4_2" value="2" />银联卡
									<input type="checkbox" name="4_2" value="3" />借记卡
								</td>
							</tr>
							<tr relation_id="4_3" nick="业务三">
								<td>
									<label>业务三：</label>
								</td>
								<td>
									<input type="checkbox" name="4_3" value="1" />邮乐卡
									<input type="checkbox" name="4_3" value="2" />银联卡
									<input type="checkbox" name="4_3" value="3" />借记卡
								</td>
							</tr>
						</table>
					</div>
				</div>
				<div class="config-business" id="502" nick="报刊业务系统">
					<span>报刊业务系统</span>
					<div >
						<table>
							<tr relation_id="1_1" nick="业务一">
								<td>
									<label>业务一：</label>
								</td>
								<td>
									<input type="checkbox" name="1_1" value="1" />邮乐卡
									<input type="checkbox" name="1_1" value="2" />银联卡
									<input type="checkbox" name="1_1" value="3" />借记卡
								</td>
							</tr>
							<tr relation_id="1_2" nick="业务二">
								<td>
									<label>业务二：</label>
								</td>
								<td>
									<input type="checkbox" name="1_2" value="1" />邮乐卡
									<input type="checkbox" name="1_2" value="2" />银联卡
									<input type="checkbox" name="1_2" value="3" />借记卡
								</td>
							</tr>
							<tr relation_id="1_3" nick="业务三">
								<td>
									<label>业务三：</label>
								</td>
								<td>
									<input type="checkbox" name="1_3" value="1" />邮乐卡
									<input type="checkbox" name="1_3" value="2" />银联卡
									<input type="checkbox" name="1_3" value="3" />借记卡
								</td>
							</tr>
							<tr relation_id="1_4" nick="业务四">
								<td>
									<label>业务四：</label>
								</td>
								<td>
									<input type="checkbox" name="1_4" value="1" />邮乐卡
									<input type="checkbox" name="1_4" value="2" />银联卡
									<input type="checkbox" name="1_4" value="3" />借记卡
								</td>
							</tr>
						</table>
					</div>
				</div>
				<div class="config-business" id="503" nick="电子商务信息平台">
					
					<span>电子商务信息平台</span>
					<div >
					<table >
							<tr relation_id="2_1" nick="业务一">
								<td>
									<label>业务一：</label>
								</td>
								<td>
									<input type="checkbox" name="2_1" value="1" />邮乐卡
									<input type="checkbox" name="2_1" value="2" />银联卡
									<input type="checkbox" name="2_1" value="3" />借记卡
								</td>
							</tr>
							<tr relation_id="2_2" nick="业务二">
								<td>
									<label>业务二：</label>
								</td>
								<td>
									<input type="checkbox" name="2_2" value="1" />邮乐卡
									<input type="checkbox" name="2_2" value="2" />银联卡
									<input type="checkbox" name="2_2" value="3" />借记卡
								</td>
							</tr>
							
						</table>
						</div>
				</div>
				<div class="config-business" id="504" nick="便民服务站">
					
					<span>便民服务站 </span>
					<div >
					<table>
							<tr relation_id="3_1" nick="业务一">
								<td>
									<label>业务一：</label>
								</td>
								<td>
									<input type="checkbox" name="3_1" value="1" />邮乐卡
									<input type="checkbox" name="3_1" value="2" />银联卡
									<input type="checkbox" name="3_1" value="3" />借记卡
								</td>
							</tr>
							<tr relation_id="3_2" nick="业务二">
								<td>
									<label>业务二：</label>
								</td>
								<td>
									<input type="checkbox" name="3_2" value="1" />邮乐卡
									<input type="checkbox" name="3_2" value="2" />银联卡
									<input type="checkbox" name="3_2" value="3" />借记卡
								</td>
							</tr>
							<tr relation_id="3_3" nick="业务三">
								<td>
									<label>业务三：</label>
								</td>
								<td>
									<input type="checkbox" name="3_3" value="1" />邮乐卡
									<input type="checkbox" name="3_3" value="2" />银联卡
									<input type="checkbox" name="3_3" value="3" />借记卡
								</td>
							</tr>
						</table>
						</div>
				</div>
			
			</li>
		</ul>
	<div class="config-btn">
		<input type="button" name="submitBtn" value="确认提交" />
		<input type="button" name="testBtn" id="testBtn" value="测试" />
	</div>
				</div>
			</div>
		</div>
	</div>
</div>
</body>