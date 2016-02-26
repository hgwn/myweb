<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%
	String server_uploadtype = request.getParameter("uploadtype");
	String server_result = request.getParameter("result");
	if (server_result == null) server_result = "等候上传";
%>
<!DOCTYPE html>
<html lang="cn">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>自动上传单个文件</title>

		<meta name="description" content="" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

		<link rel="stylesheet" href="jQuery-File-Upload-master/css/jquery.fileupload-ui.css">
        <link rel="stylesheet" href="jQuery-File-Upload-master/css/style.css">

		<style>
			.progress[data-percent]:after {
				display: inline-block;
				content: attr(data-percent);
				color: #FFFFFF;
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				line-height: 26px;
				text-align: center;
				font-size: 12px
			}
		</style>
	</head>

	<body style="margin:0px;padding:0px">
		<div class="col-sm-12" style="padding:0px">
			<form action="./upload_files.do" method="POST" enctype="multipart/form-data" class="form-horizontal" style="padding:0px" >
				<input type="hidden" name="uploadtype" id="uploadtype" value="<%= server_uploadtype %>"></input>
				<input type="file" name="upfile" id="upfile" accept="application/pdf,image/jpeg,image/x-ms-bmp,image/x-png,application/vnd.ms-excel" multiple="" />
			</form>
		</div>

		<!-- 自定义css -->
	    <script src="../static/js/base/jquery/jquery.min.js"></script>
	    <!-- Include angular.js, angular-animate.js and angular-ui-router.js-->
	    
	    <!-- 基础框架，不能移动 -->
	    <script src="../static/js/base/angularjs/v.1.3.15/angular.js"></script>
	    <script src="../static/js/base/angularjs/v.1.3.15/angular-animate.js"></script>
	    <script src="../static/js/base/angular-ui.router/angular-ui-router.js"></script>
	    <script src="../static/js/base/angularjs/v.1.3.15/angular-messages.js"></script>

	    <!--boostrap插件整合-->
	    <script src="../static/js/base/angularstrap/angular-strap.js"></script>
	    <script src="../static/js/base/angularstrap/angular-strap.tpl.js"></script>
	    <script src="../static/js/base/bootstrap/v3.3.4/js/bootstrap.js"></script>
	    
	    <!--自定义js文件-->
	    <script src="static/js/publict0.js"></script>
	    <script src="static/js/applyt0.js"></script>

		<script src="jQuery-File-Upload-master/js/vendor/jquery.ui.widget.js"></script>
		<script src="jQuery-File-Upload-master/js/jquery.iframe-transport.js"></script>
		<script src="jQuery-File-Upload-master/js/jquery.fileupload.js"></script>
		<script src="jQuery-File-Upload-master/js/jquery.iframe-transport.js"></script>
		<script src="jQuery-File-Upload-master/js/cors/jquery.xdr-transport.js"></script>

		<!-- inline scripts related to this page -->
		<script type="text/javascript">
			jQuery(function($) {

				init_upload_file(1);

				function init_upload_file(nType)
				{
					var nUploadtype = get_value("uploadtype");

					$('#upfile').fileupload({
					    dataType:'text', //文件上传地址，当然也可以直接写在input的data-url属性内
					    maxNumberOfFiles:5,
		                add: function (e, data) 
		                {
		                	data.formData = {"uploadtype":nUploadtype};
					        data.submit();
					    },
					    progressall: function (e, data) 
					    {
					        var progress = parseInt(data.loaded / data.total * 100, 10);
					        if(progress == 100) parent.set_upload_statue(nUploadtype, "上传成功");
					        else parent.set_upload_statue(nUploadtype, "正在上传，进度：" + progress + "%");
					    },
					    fail: function(e, data)
					    {
					    	parent.set_upload_statue(nUploadtype, "上传失败");
					    	window.location = "uploaditem.jsp?uploadtype=" + get_value("uploadtype") + "&result=上传失败";
					    },
					    done: function (e, data) {
					    	var json_data = $.parseJSON(data.result); 
					    	var oInfo = document.getElementById("progress_text");
					    	if (json_data.result == 1)
					    	{
					    		parent.set_upload_statue(nUploadtype, "上传成功");
					    		parent.search_pic(nUploadtype);
					    		window.location = "uploaditem.jsp?uploadtype=" + get_value("uploadtype") + "&result=上传成功";
					    	}
		                    else if (json_data.result == 404) 
		                    {
		                        parent.set_upload_statue(nUploadtype, "上传失败");
		                        window.location = "uploaditem.jsp?uploadtype=" + get_value("uploadtype") + "&result=上传失败";
		                    }
					    	else
					    	{
					    		parent.set_upload_statue(nUploadtype, "上传失败");
					    		window.location = "uploaditem.jsp?uploadtype=" + get_value("uploadtype") + "&result=上传失败";
					    	}
					    }
					});
				}

			});

		</script>
	</body>
</html>
