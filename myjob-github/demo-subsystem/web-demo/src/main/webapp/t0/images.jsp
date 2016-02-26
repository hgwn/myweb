<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%
	String sFilepath = request.getParameter("filename");
	String sType = request.getParameter("filetype");
	if (sType == null) sType = "0";
	if (sType == "") sType = "0";
%> 
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>查看资料(邮件点击，选择“另存为”即可下载文件)</title>

		<meta name="description" content="" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<script src="../static/js/base/jquery/jquery.min.js"></script>
	</head>

	<body>
	
	<script language="JavaScript" type="text/javascript">  

document.onselectstart =function() {return   false;}           // 防选择    
document.oncopy        =function() {return   false;}          // 防复制
document.oncut         =function() {return   false;}          // 防剪贴
document.onbeforecopy =function() {return   false;} 
document.ondragstart   =function() {return   false;}          //防拖动
document.oncontextmenu =function() {return   false;}          //防右键
document.onmouseup     =function() {document.selection.empty();} 
document.onselect      =function() {document.selection.empty();}
document.oncopy        =function() {document.selection.empty();} 

</script>
	
		<!-- /section:basics/navbar.layout -->
		
		<img src="" width = "100%" height="100%" id="pic" />

		<input type="hidden" id="filepath" value="<%= sFilepath %>" />
		<input type="hidden" id="file_type" value="<%= sType %>" />
		<!-- basic scripts -->

		<script type="text/javascript">
			window.jQuery || document.write("<script src='./assets/js/jquery.min.js'>"+"<"+"/script>");
		</script>

		<!-- inline scripts related to this page -->
		<script type="text/javascript">
		window.onload=function()
		{
			open_file();
		}
		
		function open_file()
		{
			var sPath = document.getElementById("filepath").value;
			var sType = document.getElementById("file_type").value;

			$.ajax({
		        url : './ctrl_get_file.do',
		        type : "post",
		        dataType: 'json',
		        cache : false,  
		        data : {
		        	"file_path":sPath,
		        	"file_type":Number(sType)
		        },
		        success : function(oJson)
		        {
		            try
		            {
		                if (oJson.ext == 'pdf')
		                {
		                    //window.open('data:application/pdf;base64,' + oJson.data.content,'查看文件','left=20,top=20,width=500,height=500,toolbar=1,resizable=0');
		                    window.location = 'data:application/pdf;base64,' + oJson.content;
		                }
		                else
		                {
		                    //window.open('data:image/bmp;base64,' + oJson.data.content,'查看文件信息','left=20,top=20,width=500,height=500,toolbar=1,resizable=0');
		                    var pic = document.getElementById("pic");
		                    pic.src = 'data:image/bmp;base64,' + oJson.content;
		                }
		            }
		            catch(e)
		            {

		            }
		        },
		        error:function(xhr, optons, thrownError)
		        {
		        }
		    });
		}
		</script>
	</body>
</html>
