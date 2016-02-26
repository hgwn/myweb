package com.masget.controller.settlement;

import com.google.gson.Gson; 
import com.masget.util.CommomUtil;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;  

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;  
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class upload_file_controller 
{
	private String upload_file_pre_path = "";
	private String upload_file_back_path = "";
	private String upload_file_path = "";
	
	public static String get_datetime_14()
	{
	    String temp_str="";
	    Date dt = new Date();
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");	    
	    temp_str=sdf.format(dt);
	    
	    return temp_str;
	}
	
	public static String get_extension_name(String sFilename) {   
        if ((sFilename != null) && (sFilename.length() > 0)) {   
            int dot = sFilename.lastIndexOf('.');   
            if ((dot >-1) && (dot < (sFilename.length() - 1))) {   
                return sFilename.substring(dot + 1);   
            }   
        }   
        return "";   
    }
	
	public String get_upload_path()
	{
		if (upload_file_path.compareTo("") != 0) return upload_file_path;
		try
		{
			Properties oProperties = new Properties();
			InputStream oInputStream = t0.class.getResourceAsStream("/config.properties");
			oProperties.load(oInputStream);
			this.upload_file_pre_path = oProperties.getProperty("companycertificates_path");
			this.upload_file_back_path = oProperties.getProperty("db_companycertificates_path");
			this.upload_file_path = this.upload_file_pre_path + this.upload_file_back_path;
			oInputStream.close();
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		
		return this.upload_file_path;
	}
	
	/** 
     * 描述 : <将文件保存到指定路径>. <br> 
     *<p> 
     * 
     * @param multifile 
     * @param path 
     * @return 
     * @throws IOException 
     */  
    public static FuncResult saveFileToServer(FileItem oFile, String sSaveFile, String sExt)  
            throws IOException {  
        boolean bOk = false;
        FuncResult oRet = new FuncResult();
        
        try
        {
	        // 读取文件流并保持在指定路径
        	File oDest = new File(sSaveFile);
        	oFile.write(oDest);
	        
	        if (sExt.compareToIgnoreCase("jpg") == 0 || sExt.compareToIgnoreCase("bmp") == 0 || sExt.compareToIgnoreCase("png") == 0)
	        {
		        BufferedImage oBuffer = ImageIO.read(new File(sSaveFile));
		        if (oBuffer.getWidth() > 100 || oBuffer.getHeight() > 100)
		        {
		        	Graphics2D g = oBuffer.createGraphics();
		        	//g.drawImage(oBuffer, 0, 0, 100, 100, null);
		        	g.dispose();
		        	
		        	File outputfile = new File(sSaveFile);
	                ImageIO.write(oBuffer, sExt, outputfile);	                
		        }
	        }
	        
	        oRet.set_data(1, "");
        }
        catch (Exception ex)
        {
        	oRet.set_data(-1, ex.toString());
        }
  
        return oRet;  
    }
    
	@RequestMapping(value = "/t0/upload_files.do", method={RequestMethod.POST, RequestMethod.GET})
    public @ResponseBody String handle_upload(
    		//@RequestParam(value="uploadtype", required=true) Integer nUploadtype,			// 为了处理同相同工程的上传冲突，改成手动获取表单参数
           // @RequestParam(value = "upfile", required = false) MultipartFile oFile,            
            HttpServletRequest request, 
            HttpServletResponse response) throws IOException {
		
        FileModel fileModel = new FileModel();
        String sSaveFile = "";
        Gson gs = new Gson();
        FileItem oFileItem = null;
        String sUploadtypename = "";
        
        get_upload_path();
        
        String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null || login_data.compareTo("") == 0)
		{
			fileModel.setDes("连接已经断开");
			fileModel.setResult(404);
	        return gs.toJson(fileModel);
		}

		Integer nUploadtype = 0;
		try {
			FileItemFactory factory = new DiskFileItemFactory();
			ServletFileUpload upload = new ServletFileUpload(factory);
			upload.setHeaderEncoding("utf-8");
		
			List<FileItem> items = (List<FileItem>) upload.parseRequest(request);
			Iterator<FileItem> iter = items.iterator();
			while (iter.hasNext()) {
			    FileItem item = (FileItem) iter.next();
			    if (item.isFormField()) {
			    	String name = item.getFieldName();
			        String value = item.getString();
			        
			        if (name.compareToIgnoreCase("uploadtype") == 0)
			        {
			        	nUploadtype = Integer.parseInt(value);
			        }
			    }
			    else
			    {
			    	oFileItem = item;
			    }
			}
		} catch (FileUploadException e) {
			e.printStackTrace();
		}
		
		if (nUploadtype == 1) sUploadtypename = "身份证";
		else if (nUploadtype == 2) sUploadtypename = "营业执照";
		else if (nUploadtype == 3) sUploadtypename = "税务登记证";
		else if (nUploadtype == 4) sUploadtypename = "特约客户调查表";
		else if (nUploadtype == 101) sUploadtypename = "主合同";
		else if (nUploadtype == 102) sUploadtypename = "附加合同";

		if (oFileItem == null)
		{
			fileModel.setResult(0);
    		fileModel.setDes("请选择文件");
		}
		else
		{
	        {
	        	String sSavePath = "";
	        	
	            fileModel.setName(oFileItem.getName());  
	            fileModel.setSize(oFileItem.getSize());
				
	            // 名称构成规则：
				// 上传公司ID_员工_证件所属公司ID_证件类型_WEB服务端接收的时间.原始扩展名
	            Random random1 = new Random(10000000);
	            Random random2 = new Random(20000000);
	            
				String sUploadpath =
						Integer.toString(nUploadtype) + "_" +
						random1.hashCode() + "_" +
						get_datetime_14() + "_" +
						random2.hashCode();
				
				String sExtension = get_extension_name(oFileItem.getName());
				if (sExtension.compareTo("") != 0) sUploadpath = sUploadpath + "." + sExtension;
				fileModel.setPath(sUploadpath);
				
				// 写入数据库中的目录
				sSaveFile = upload_file_back_path + sUploadpath;
				
				// 实际的存储目录
				sUploadpath = this.upload_file_path + sUploadpath;
				FuncResult oRet = saveFileToServer(oFileItem, sUploadpath, sExtension);
	        	if (oRet.get_ret() > 0)
	        	{
	        		String serviceName = "settlementService";
	        		String method = "masget.settlement.t0.companycertificates.add";
	        		
	        		//调用接口
	        		Map<String, Object> dataMap = new HashMap<String, Object>();        		
	        		dataMap.put("certificatetypeid", String.valueOf(nUploadtype));
	        		dataMap.put("certificatetypename", sUploadtypename);
	        		dataMap.put("certificatepath", sSaveFile);
	        		
	        		String data = gs.toJson(dataMap);
	        		String result = CommomUtil.CallApi(request, serviceName, method, data);
	        		if (result.compareTo("") != 0)
	        		{
	        			fileModel.setResult(1);
	        		}
	        		else
	        		{
	        			fileModel.setResult(0);
	            		fileModel.setDes("文件存储失败:" + oRet.get_error());
	        		}
	        	}
	        	else
	    		{
	        		fileModel.setResult(0);
	        		fileModel.setDes("文件存储失败:" + oRet.get_error());
	    		}
	        }
		}

        return gs.toJson(fileModel);
    }	
}
