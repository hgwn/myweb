package com.masget.controller.rboperationsmanager;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.masget.util.CommomUtil;
import com.masget.util.ExcelUtil;
import com.masget.util.FileUpload;
import com.masget.util.FileUtil;

@Controller
@RequestMapping("/rboperationsmanager/base")
public class OperationsBaseController {
	Gson gson;
	@SuppressWarnings("unused")
	private static Logger logger =Logger.getLogger(OperationsBaseController.class);
	public OperationsBaseController() {
		gson = new GsonBuilder().serializeNulls()
				.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
	}
	
	/**
	 * 公共接口--获取系统环境类型数据
	 */
	@RequestMapping(value = "/osenvinrment_get", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void osenvinrment_get(
			HttpServletRequest request, HttpServletResponse response) {
		String serviceName = "baseService";
		String method = "masget.base.com.osenvinrment.get";
		
		// 无具体参数，给接口传一个空的json对象{}
		String result = CommomUtil.CallApi(request, serviceName, method, "{}");
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 公共接口--获取公司类型数据 
	 */
	@RequestMapping(value = "/companytype_get", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void companytype_get(
			HttpServletRequest request, HttpServletResponse response) {
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.companytype.get";
		
		// 无具体参数，给接口传一个空的json对象{}
		String result = CommomUtil.CallApi(request, serviceName, method, "{}");
		CommomUtil.writeResultBack(request, response, result);
	}

	

	@RequestMapping("/resource.do")
	public void resource(String type,HttpServletRequest request, HttpServletResponse response)
	{JSONObject json = new JSONObject();
	String data = null;
	String result = "服务异常";
	if(type.equals("get")){
		//获取基础资源
		json.put("resourcename", request.getParameter("resourcename"));
		json.put("pagesize", request.getParameter("pagesize"));
		json.put("pagenum", request.getParameter("pagenum"));
		data = json.toString();
		result = CommomUtil.CallApi(request, "rboperationsmanagerService", "masget. rboperationsmanager.com.resource.query", data);
	}else if(type.equals("count")){
		//查询基础资源条数
		json.put("resourcename", request.getParameter("resourcename"));
		result = CommomUtil.CallApi(request, "baseService", "masget.base.com.resource.count", data);
	}else if(type.equals("add")){
		//增加基础资源
		result = CommomUtil.CallApi(request, "baseService", "masget.base.com.resource.add", request.getParameter("formData"));  
	}else if(type.equals("modify")){
		//修改基础资源
		result = CommomUtil.CallApi(request, "baseService", "masget.base.com.resource.modify", request.getParameter("formData"));  
	}else if(type.equals("delete")){
		json.put("resourceid", request.getParameter("resourceid"));
		json.put("enforce", request.getParameter("enforce"));
		//删除基础资源
		data = json.toString();
		result = CommomUtil.CallApi(request, "rboperationsmanagerService", "masget.rboperationsmanager.com.resource.delete", data);  
	}else if(type.equals("roleGet")){
		//获取角色菜单资源
		json.put("osenvirnmentid", request.getParameter("osenvirnmentid"));
		json.put("companytypeid", request.getParameter("companytypeid"));
		json.put("roletypeid", request.getParameter("roletypeid"));
		data = json.toString();
		result = CommomUtil.CallApi(request, "baseService", "masget.rboperationsmanager.com.osroleresource.query", data);
	}else if(type.equals("roleSet")){
		//设置角色菜单资源
		result = CommomUtil.CallApi(request, "baseService", "masget.rboperationsmanager.com.osroleresource.set", request.getParameter("formData"));
	}
	CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 公共接口--获取角色类型数据
	 */
	@RequestMapping(value = "/roletype_get", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void roletype_get(
			HttpServletRequest request, HttpServletResponse response) {
		String serviceName = "baseService";
		String method = "masget.base.com.roletype.get";
		
		// 无具体参数，给接口传一个空的json对象{}
		String result = CommomUtil.CallApi(request, serviceName, method, "{}");
		CommomUtil.writeResultBack(request, response, result);
	}

	
	/**
	 * 获取划账目标公司接口
	 * @param companyid
	 * @param companyname
	 * @param pagesize
	 * @param pagenum
	 */
	@RequestMapping(value = "/companyinfo_find", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void companyinfo_find(
			@RequestParam(value = "companyid", required = false) Long companyid,
			@RequestParam(value = "companyname", required = false) String companyname,
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		Map<String, Object> dataMap = new HashMap<String, Object>();

		if (companyid != null && !companyid.equals("")) {
			dataMap.put("companyid", companyid);
		}

		if (companyname != null && !companyname.equals("")) {
			dataMap.put("companyname", companyname);
		}

		if (pagesize != null && pagenum != null) {
			dataMap.put("pagesize", pagesize);
			dataMap.put("pagenum", pagenum);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "baseService";
		String method = "masget.base.com.companyinfo.find";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	
	//上传资源图标文件
	@RequestMapping(value = "/upload")
	public void upload(HttpServletRequest request,
			HttpServletResponse response) {
		String fileuploadResult = CommomUtil.FileUpLoadAndGetParam(request,
				response, FileUpload.resourceIconFileSavePath);
		CommomUtil.writeResultBack(request, response, gson.toJson(fileuploadResult));
	}
	
	// 导入
		@RequestMapping(value = "/import")
		public void fileUpload(HttpServletRequest request,
				HttpServletResponse response) {
			String fileuploadResult = CommomUtil.FileUpLoadAndGetParam(request,
					response, FileUpload.importDir);
			JSONObject fileuploadResultJson = JSONObject
					.fromObject(fileuploadResult);
			if (fileuploadResultJson.getInt("ret") != 0) {// 上传失败
				return;
			}
			String contextPath = request.getSession().getServletContext().getRealPath("");
			String fileUploadSavePath = FileUpload.fileUploadSavePath;
			String fileUploadDir = FileUpload.importDir;
			JSONObject data = fileuploadResultJson.getJSONObject("data");
			String url = data.getString("file");
			int index = url.lastIndexOf("/");
			String path = fileUploadSavePath + fileUploadDir
					+ url.substring(index + 1);

			File file = new File(path);

			String filetype = FileUtil.getFileByFile(file);

			if (!filetype.equals("xls")) {
				return;
			}
			List<Map<String, Object>> result = null;
			List<String> headList = new ArrayList<String>();
			List<String> keyList = new ArrayList<String>();
			headList.add("服务商名称");
			headList.add("商户名称");
			headList.add("手续费名称");
			headList.add("通道名称");
			headList.add("法人姓名");
			headList.add("法人身份证");
			headList.add("法人电话");
			headList.add("负责人姓名");
			headList.add("负责人电话");
			headList.add("省名称");
			headList.add("市名称");
			headList.add("公司详细地址");
			headList.add("开户名（私账）");
			headList.add("银行账户（私账）");
			headList.add("开户行（私账）");
			headList.add("联行号（私账）");
			headList.add("开户名（公账）");
			headList.add("银行账户（公账）");
			headList.add("开户行（公账）");
			headList.add("联行号（公账）");
			headList.add("划账手续费");
			headList.add("法人入账差异");
			headList.add("差异确认");

			keyList.add("pmembername");//服务商名称
			keyList.add("membername");//商户名称
			keyList.add("basesettlementrate");//手续费名称
			keyList.add("agentsettlementchannel");//通道名称
			keyList.add("legalperson");//法人姓名
			keyList.add("legalpersonidcard");//法人身份证
			keyList.add("legalpersonphone");//法人电话
			keyList.add("companyleander");//负责人姓名
			keyList.add("companyleanderphone");//负责人电话
			keyList.add("provincename");//省名称
			keyList.add("cityname");//市名称
			keyList.add("address");//公司详细地址
			keyList.add("accountname");//开户名（私账）
			keyList.add("bankaccount");//银行账户（私账）
			keyList.add("bank");//开户行（私账）
			keyList.add("bankcode");//联行号（私账）
			keyList.add("accountnamepublic");//开户名（公账）
			keyList.add("bankaccountpublic");//银行账户（公账）
			keyList.add("bankpublic");//开户行（公账）
			keyList.add("bankcodepublic");//联行号（公账）
			keyList.add("transferexpenses");//划账手续费
			keyList.add("difference");//法人入账差异
			keyList.add("differenceConfirm");//差异确认

			try {
				result = ExcelUtil.readExcelData(file, 3, keyList);
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			
			
			Gson gson = new Gson();
			Map<String, Object> dataInsert = new HashMap<String, Object>();
			dataInsert.put("arrData",result);
			String insertResult = CommomUtil.CallApi(request, "rboperationsmanagerService", "masget.rboperationsmanager.com.members.import",gson.toJson(dataInsert));
			
			JSONObject a = JSONObject.fromObject(insertResult);
			
			if(a.getInt("ret")!= 0){
				CommomUtil.writeResultBack(request, response, gson.toJson(a));
				return;
			}
			JSONArray fails = a.getJSONArray("fails");
			String message = a.getString("message");
			
			List<Map<String, Object>> failList = new ArrayList<Map<String, Object>>();
			
			for(int i =0;i<fails.size();i++){
				Map<String, Object> item = new HashMap<String, Object>();
				JSONObject failItem = fails.getJSONObject(i);
				Iterator it = failItem.keys();
				
				while(it.hasNext()){
					String key = (String) it.next();
					item.put(key, failItem.get(key));
				}
				failList.add(item);
			}
			
			
			String fileName = "Excel导入失败结果收集";
			try {  
				SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
				String dateStr = format.format(new Date());
				fileName += dateStr + ".xls";
	            File f = new File(contextPath+"\\upload\\"+FileUpload.importDir+fileName);  
	            if (f.exists()) {  
	            } else {  
	                f.createNewFile();// 不存在则创建  
	            }  
				
				if(failList.size()>0){
					ExcelUtil.writeDataToExcel(failList, headList, keyList, fileUploadSavePath+fileName, "1234");	
				}
				
	           
	        } catch (Exception e) {  
	            e.printStackTrace();  
	        }
			
			Map<String, Object> dataResult = new HashMap<String, Object>();
			dataResult.put("ret", 0);
			dataResult.put("message", message);
			dataResult.put("excelPath", "\\upload\\"+fileName);
			dataResult.put("fails", failList);
			CommomUtil.writeResultBack(request, response, gson.toJson(dataResult));
		}
		
		@RequestMapping("/downloadExcel")
		public void downloadExcel(HttpServletRequest request,
				HttpServletResponse response,String path){
			String contextPath = request.getSession().getServletContext().getRealPath("");
			String downFilename = path.substring(path.lastIndexOf("\\")+1,path.length());
			String filepath = contextPath+path.substring(0,path.lastIndexOf("\\")+1);
			FileUtil.writeFileToClient(response, downFilename, filepath);
		}


}
