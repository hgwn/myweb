<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
<!--
function forbidden() {
	dialogAjaxDone('{"statusCode":"403", "message":"用户权限不足。", "navTabId":"", "forwardUrl":"", "callbackType":"closeCurrent"}');
} 
//-->

function selectBox(){
	if(box.checked){
		createType.disabled="";
		areaId.disabled="";
		mernoId.disabled="";
	}else{
		createType.disabled="disabled";
		areaId.disabled="disabled";
		mernoId.disabled="disabled";
		$("#msg").css("display","none"); 
		
		$("#areaId").val("");
		while(mernoId.options.length>1){
			mernoId.removeChild(mernoId.options[1]);
		}
	}
}
$("#mernoId").remoteChained("#areaId", "${contextPath }/management/system/internalMerno/getMernoByArea");

function getTerminalCount(){
	var merno=$("#mernoId").val();
	var createType=$("#createType").val();
	if(merno==""||merno==null||merno=="0"||createType==2){
		$("#msg").css("display","none"); 
	}else{
		if($("#createType").val()==1){
			$.ajax({
				type:"post",
				url:"${contextPath }/management/system/posTerminal/getTerminalCount",
				data:{"merno":merno},
				dataType:"text",
				success:function(data){
					var msg="";
					if(data>0){
						msg = "<font color='green'>该商户编号下有"+data+"个可用终端号</font>";
					}else{
						msg = "<font color='red'>该商户编号下没有可用终端号</font>";
					}
					$("#msg").html(msg);
					$("#msg").css("display","block"); 
				},
				error:function(data){
					alertMsg.error("调用失败");
				}
			});
		}
	}
}
function checkForm(){
	if(box.checked){
		if($("#areaId").val()==''){
	  		alertMsg.warn('请选择商户编号地区');
	  		return false;
	  	}
	   	if($("#mernoId").val()==''||$("#mernoId").val()=='0'){
	   		alertMsg.warn('请选择商户编号');
	   		return false;
	   	}
   	}
   	alertMsg.confirm("确认上传并导入吗？", {okCall: function(){
			$('#file_upload').uploadify('upload', '*');
			$('.uploadify-progress').show(); 
			return true;
		}
	});
}
</script>
<style type="text/css" media="screen">
.my-uploadify-button {
	background:none;
	border: none;
	text-shadow: none;
	border-radius:0;
}

.uploadify:hover .my-uploadify-button {
	background:none;
	border: none;
}

.fileQueue {
	width: 400px;
	height: auto;
	overflow: auto;
}
</style>

<div class="pageContent">
<div class="pageFormContent" layoutH="52">
<input id="file_upload" type="file"
	uploaderOption="{
        'auto':false,
        'successTimeout':300,
        'swf':'${contextPath}/styles/uploadify/scripts/uploadify.swf',
        'overrideEvents' : ['onDialogClose'],
        'queueID':'fileQueue',
        'fileObjName':'files',
        'uploader':'${contextPath}/management/system/posTerminal/improtTerminal;jsessionid=<%=session.getId()%>',
        'buttonImage':'${contextPath}/styles/uploadify/img/add.jpg',
		'buttonClass':'my-uploadify-button',
        'width':'89',
        'height':'28',
        'removeComplete': false,
        'fileTypeDesc':'支持的格式：xls,xlsx',
        'fileTypeExts':'*.xls;*.xlsx',
        'queueSizeLimit' : 1,
        'onSelect': function () { 
        	$('.uploadify-progress').hide(); 
        },
        'onUploadStart' : function(file) {  
            var createType='';
            var areaId='';
            var mernoId='';
            if(box.checked){
            	createType=$('#createType').val();
            	areaId=$('#areaId').val();
            	mernoId=$('#mernoId').val();
            }
            $('#file_upload').uploadify('settings', 'formData', {'createType':createType,'areaId':areaId,'mernoId':mernoId});
            var ajaxbg = $('#background2,#progressBar2');
			ajaxbg.show();
         },
        'onUploadSuccess' : function(file, data, response) {
        	var ajaxbg = $('#background2,#progressBar2');
            ajaxbg.hide();
        	var json = jQuery.parseJSON(data);
            navTabAjaxDone(json);
            if(json.statusCode==200){
            	$('#closeButton').click();
            }
         } ,
        'onSelectError':function(file, errorCode, errorMsg){
            switch(errorCode) {
                case -100:
                    alertMsg.info('上传的文件数量已经超出系统限制的'+$('#file_upload').uploadify('settings','queueSizeLimit')+'个文件！');
                    break;
                case -120:
                    alertMsg.info('文件 ['+file.name+'] 大小异常！');
                    break;
                case -130:
                    alertMsg.info('文件 ['+file.name+'] 类型不正确！');
                    break;
            }
            
        },
        'onFallback':function(){
            alertMsg.info('您未安装FLASH控件，无法上传图片！请安装FLASH控件后再试。');
        },
        'onUploadError' : function(file, errorCode, errorMsg, errorString) {
        	if (errorCode == 403) {
        		forbidden();
        	}
        	if(errorCode == -280){
        		return false;
        	}
        	var ajaxbg = $('#background2,#progressBar2');
            ajaxbg.hide();
            alertMsg.info(file.name + '上传失败: ' + errorMsg);
        }
	}"
/>
<div id="fileQueue" class="fileQueue"></div>
<p>
	<input type="checkbox" name="box" id="box" style="vertical-align:middle;" onclick="selectBox()"><label for="box" style="float:none; padding:0;">是否自动分配终端编号</label>
</p>
<p>
	<label>分配终端编号方式：</label>
	<select name="createType" id="createType" class="re_select196" disabled="disabled" onchange="getTerminalCount()">
		<option value="1">优先使用已有终端编号</option>
		<option value="2">全部生成终端编号</option>
	</select>
</p>
<p>
	<label>商户编号地区：</label>
	<select name="area" id="areaId" class="re_select196" disabled="disabled">
		<option value="">--请选择--</option>
		<c:forEach var="province" items="${provinces }">
			<option value="${province.id }">${province.item1 }</option>
		</c:forEach>
	</select>
</p>
<p>
	<label>商户编号：</label>
	<select name="merno" id="mernoId" class="re_select196" disabled="disabled" onchange="getTerminalCount()">
		<option value="">--请选择--</option>
	</select>
</p>
<div id="msg" style="display: none; margin-left:127px;" ></div>
</div>
<div class="formBar">
	<ul style="margin-top:-3px;">
		<li><div class="button8"><div class="buttonContent"><button type="button" onclick="checkForm()">确认上传并导入</button></div></div></li>
		<li><div class="button"><div class="buttonContent"><button type="button" id="closeButton" class="close">关闭</button></div></div></li>
	</ul>
</div>
</div>
