package com.masget.controller.base;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.masget.entity.RetStruct;
import com.masget.util.CommomUtil;
import com.masget.util.ExcelUtil;
import com.masget.util.FileUpload;
import com.masget.util.FileUtil;

@Controller
@RequestMapping("base/contractorinfo")
public class ContractorInfoController {

	@RequestMapping(value="/add",method={RequestMethod.POST,RequestMethod.GET})
	public void add(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request,HttpServletResponse response){
		JSONObject obj = JSONObject.fromObject(data);
		
		String method="masget.base.com.contractorinfo.add";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
        
		CommomUtil.writeResultBack(request, response, result);
		System.out.print(result);
	}
	
	@RequestMapping(value="/modify",method={RequestMethod.POST,RequestMethod.GET})
	public void modify(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request,HttpServletResponse response){
		JSONObject obj = JSONObject.fromObject(data);
		
		String method="masget.base.com.contractorinfo.modify";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
        
		CommomUtil.writeResultBack(request, response, result);
		System.out.print(result);
	}
	
	@RequestMapping(value="/delete",method={RequestMethod.POST,RequestMethod.GET})
	public void delete(
			@RequestParam(value="contractorinfoid",required=true) String contractorinfoid,
			HttpServletRequest request,HttpServletResponse response){
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("contractorinfoid", contractorinfoid);
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.contractorinfo.delete";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		CommomUtil.writeResultBack(request, response, result);
		System.out.print(result);
	}
	
	//导入人脉
	@RequestMapping(value="/contactsImport",method={RequestMethod.POST,RequestMethod.GET})
	public void contactsImport(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request,HttpServletResponse response){
		
		JSONObject obj = JSONObject.fromObject(data);
		
		String method="masget.base.com.contractorinfo.import";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
        
		CommomUtil.writeResultBack(request, response, result);
		System.out.print(result);
	}
	
	@RequestMapping(value="/getcustomer",method={RequestMethod.POST,RequestMethod.GET})
	public void getcustomer(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request,HttpServletResponse response){
		
		JSONObject obj = JSONObject.fromObject(data);
		
		String method="masget.base.com.contractorinfo.getcustomer";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
        
		CommomUtil.writeResultBack(request, response, result);
		System.out.print(result);
	}
	
	@RequestMapping(value="/get",method={RequestMethod.POST,RequestMethod.GET})
	public void get(
			@RequestParam(value="keyword",required=true) String keyword,
			@RequestParam(value="pagenum",required=false) String pagenum,
			@RequestParam(value="pagesize" ,required=false) String pagesize,
			HttpServletRequest request,HttpServletResponse response){
		JSONObject obj = new JSONObject();
		obj.put("companyname", keyword);
		obj.put("contactname", keyword);
		obj.put("mobilephone", keyword);
		obj.put("scenetypeid", 3);
		
		obj.put("pagenum", pagenum);
		obj.put("pagesize", pagesize);
		
		String method="masget.base.com.contractorinfo.find";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
        
		CommomUtil.writeResultBack(request, response, result);
		System.out.print(result);
	}
	
	/**
	 * 关键字查询公司信息
	 * @param request
	 * @param response
	 * @kekeywords  "{scenetypeid,pagesize,pagenum,companyname,mobilephone,addressgroupid,companytypeid}"
	 *  前面三个参数必填
	 */
	@RequestMapping(value="/getByKesys",method={RequestMethod.POST,RequestMethod.GET})
	public void getByKesys(
			@RequestParam(value="keywords",required=true) String keywords,
			HttpServletRequest request,HttpServletResponse response){
	
		
		String method="masget.base.com.contractorinfo.find";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, keywords);
        
		CommomUtil.writeResultBack(request, response, result);
		System.out.print(result);
	}
	
	
	@RequestMapping(value="/getAddressGroup",method={RequestMethod.POST,RequestMethod.GET})
	public void getAddressGroup(HttpServletRequest request,HttpServletResponse response){
		String scenetypeid = request.getParameter("scenetypeid");
		String addressgroupname = request.getParameter("addressgroupname");
		JSONObject obj = new JSONObject();
		if(addressgroupname != null && !"".equals("addressgroupname"))
			obj.put("addressgroupname", addressgroupname);
		obj.put("scenetypeid", scenetypeid);
		
		String method="masget.base.com.addressgroup.getbyscenetype";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
        
		CommomUtil.writeResultBack(request, response, result);
		System.out.print(result);
	}
	
	// 导入
	@RequestMapping(value = "/import")
	public void fileUpload(HttpServletRequest request,HttpServletResponse response) {
		String fileuploadResult = CommomUtil.FileUpLoadAndGetParam(request,response, FileUpload.importDir);
		JSONObject fileuploadResultJson = JSONObject.fromObject(fileuploadResult);
		if (fileuploadResultJson.getInt("ret") != 0) {// 上传失败
			return;
		}
		String fileUploadSavePath = FileUpload.fileUploadSavePath;
		String fileUploadDir = FileUpload.importDir;
		JSONObject data = fileuploadResultJson.getJSONObject("data");
		String url = data.getString("file");
		int index = url.lastIndexOf("/");
		String path = fileUploadSavePath + fileUploadDir + url.substring(index + 1);

		File file = new File(path);

		String filetype = FileUtil.getFileByFile(file);

		if (!filetype.equals("xls")) {
			return;
		}
		List<Map<String, Object>> result = null;
		List<String> keyList = new ArrayList<String>();
		keyList.add("companyname");
		keyList.add("profile");
		keyList.add("contactname");
		keyList.add("mobilephone");
		keyList.add("faxnumber");
		keyList.add("provincename");
		keyList.add("cityname");
		keyList.add("areaname");
		keyList.add("address");
		keyList.add("scenetypename");
		keyList.add("saasgrouptypename");
		keyList.add("addressgroupname");
		keyList.add("remark1");
		keyList.add("remark2");
		keyList.add("remark3");

		try {
			result = ExcelUtil.readExcelData(file, 1, keyList);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		Gson gson = new Gson();
		System.out.print(gson.toJson(result));
		Map<String, Object> dataResult = new HashMap<String, Object>();
		dataResult.put("ret", 0);
		dataResult.put("message", "");
		dataResult.put("data", result);
		CommomUtil.writeResultBack(request, response, gson.toJson(dataResult));
	}
	
	/**
	 * 导出
	 */
	@RequestMapping("/export")
	public void export(
			@RequestParam(value="scenetypeid",required=false) String scenetypeid,
			@RequestParam(value="pagesize",required=false) String pagesize,
			@RequestParam(value="pagenum",required=false) String pagenum,
			HttpServletRequest request,HttpServletResponse response){

		Map<String, Object> dataMapData=new HashMap<String, Object>();
		List<String> Array = new ArrayList<String>();
		Array.add("companyname");
		dataMapData.put("scenetypeid", scenetypeid);
		dataMapData.put("orders", Array);
		dataMapData.put("orderkey", "asc");
		
		JSONObject data= JSONObject.fromObject(dataMapData);
		
		String method="masget.base.com.contractorinfo.getcustomer";

		String result = CommomUtil.CallApi(request,	CommomUtil.BASE_SERVICE, method, data.toString());
		
		List<String> headList = new ArrayList<String>();
		List<String> keyList = new ArrayList<String>();
		Gson gson2 = new Gson();

		RetStruct struct = gson2.fromJson(result, RetStruct.class);

		result = gson2.toJson(struct.getData().getRows());
		Gson gson = new Gson();
		
		List<Map<String, Object>> dataMap = null;

		dataMap = gson.fromJson(result,new TypeToken<List<Map<String, Object>>>() {}.getType());

		headList.add("公司名称(*)");
		headList.add("公司简介");
		headList.add("联系人(*)");
		headList.add("联系电话(*)");
		headList.add("传真号");
		headList.add("省（*）");
		headList.add("城市(xx市*)");
		headList.add("县区(*)");
		headList.add("街道(*)");
		headList.add("商户类型(*)");
		headList.add("分组类型");
		headList.add("分组名(*)");
		headList.add("自定义1");
		headList.add("自定义2");
		headList.add("自定义3");

		keyList.add("companyname");
		keyList.add("profile");
		keyList.add("contactname");
		keyList.add("mobilephone");
		keyList.add("faxnumber");
		keyList.add("provincename");
		keyList.add("cityname");
		keyList.add("areaname");
		keyList.add("address");
		keyList.add("scenetypename");
		keyList.add("saasgrouptypename");
		keyList.add("addressgroupname");
		keyList.add("remark1");
		keyList.add("remark2");
		keyList.add("remark3");
		
		String fileName = System.currentTimeMillis() + ".xls";
		String path = FileUpload.getFilePath(FileUpload.emFileType.GOODS_EXPORT);
		File filePath = new File(path);
		if (!filePath.exists())
			filePath.mkdir();
		try {
			ExcelUtil.writeDataToExcel(dataMap, headList, keyList, path	+ fileName, "人脉");
		} catch (Exception e) {
			e.printStackTrace();
		}

		boolean writeFileFlag = FileUtil.writeFileToClient(response, fileName, path);

	}
	
	/**
	 * 下载参考样例
	 */
	@RequestMapping("/downloadfile")
	public void downloadFile(HttpServletRequest request,
			HttpServletResponse response) {
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			try {
				response.sendRedirect("/");
			} catch (IOException e) {
				e.printStackTrace();
			}

			return;
		}
		String path = FileUpload.getFilePath(FileUpload.emFileType.DOCUMENT_TEMPLATE);
		String downFilename = "contactsImport_templates.xls";
		boolean writeFileFlag = FileUtil.writeFileToClient(response, downFilename, path);
	}
}
