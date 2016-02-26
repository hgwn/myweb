package com.masget.controller.enterprise.baseline;

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
@RequestMapping("enterprise/baseline/product")
public class ProductController {

	/**
	 * 查询指定供应商商品表
	 * @throws Exception 
	 */
	@RequestMapping(value = "/getgoodsEX_list", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void getgoodsEX_list(
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "companyid", required = false) String companyid,
			
			@RequestParam(value = "categoryid", required = false) String categoryid,
			@RequestParam(value = "brandname", required = false) String brandname,
			@RequestParam(value = "goodssn", required = false) String goodssn,
			@RequestParam(value = "barcode", required = false) String barcode,
			@RequestParam(value = "goodsspec", required = false) String goodsspec,
			@RequestParam(value = "beginpoint", required = false) String  beginpoint,
			@RequestParam(value = "endpoint", required = false) String  endpoint,
			
			@RequestParam(value = "keywords", required = false) String  keywords,
			
			HttpServletRequest request, HttpServletResponse response) throws Exception {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		Gson gson = new Gson();
		
		JSONObject jsonObject = JSONObject.fromObject(login_data);
		String companyidZH = jsonObject.get("companyid").toString();
		//String jsonObject = gson.fromJson(login_data);
		//String companyidZH = jsonObject.get("companyid").toString();
		
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		
		if (pagesize != null && !pagesize.equals("")) {
			dataMap.put("pagesize", pagesize);
		}
		if (pagenum != null && !pagenum.equals("")) {
			dataMap.put("pagenum", pagenum);
		}
		
		dataMap.put("companyid",companyidZH);
		
		if (categoryid != null && !categoryid.equals("")) {
			dataMap.put("categoryid", categoryid);
		}
		if (brandname != null && !brandname.equals("")) {
			dataMap.put("brandname", brandname);
		}
		if (goodssn != null && !goodssn.equals("")) {
			dataMap.put("goodssn", goodssn);
		}
		if (barcode != null && !barcode.equals("")) {
			dataMap.put("barcode", barcode);
		}
		if (goodsspec != null && !goodsspec.equals("")) {
			dataMap.put("goodsspec", goodsspec);
		}
		if (beginpoint != null && !beginpoint.equals("")) {
			dataMap.put("beginpoint", beginpoint);
		}
		if (endpoint != null && !endpoint.equals("")) {
			dataMap.put("endpoint", endpoint);
		}
		
		if (keywords != null && !keywords.equals("")) {
			dataMap.put("keywords", keywords);
		}
		String data = gson.toJson(dataMap);
		String method = "masget.enterprise.baseline.goods.external.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 查询商品子表
	 */
	@RequestMapping(value = "/getgoods_list", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void getgoods_list(
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			
			@RequestParam(value = "categoryid", required = false) String categoryid,
			@RequestParam(value = "brandname", required = false) String brandname,
			@RequestParam(value = "goodssn", required = false) String goodssn,
			@RequestParam(value = "barcode", required = false) String barcode,
			@RequestParam(value = "goodsspec", required = false) String goodsspec,
			@RequestParam(value = "beginpoint", required = false) String  beginpoint,
			@RequestParam(value = "endpoint", required = false) String  endpoint,
			
			@RequestParam(value = "keywords", required = false) String  keywords,
			
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		Map<String, Object> dataMap = new HashMap<String, Object>();
		
		if (pagesize != null && !pagesize.equals("")) {
			dataMap.put("pagesize", pagesize);
		}
		if (pagenum != null && !pagenum.equals("")) {
			dataMap.put("pagenum", pagenum);
		}
		
		if (categoryid != null && !categoryid.equals("")) {
			dataMap.put("categoryid", categoryid);
		}
		if (brandname != null && !brandname.equals("")) {
			dataMap.put("brandname", brandname);
		}
		if (goodssn != null && !goodssn.equals("")) {
			dataMap.put("goodssn", goodssn);
		}
		if (barcode != null && !barcode.equals("")) {
			dataMap.put("barcode", barcode);
		}
		if (goodsspec != null && !goodsspec.equals("")) {
			dataMap.put("goodsspec", goodsspec);
		}
		if (beginpoint != null && !beginpoint.equals("")) {
			dataMap.put("beginpoint", beginpoint);
		}
		if (endpoint != null && !endpoint.equals("")) {
			dataMap.put("endpoint", endpoint);
		}
		
		if (keywords != null && !keywords.equals("")) {
			dataMap.put("keywords", keywords);
		}
		
		Gson gson = new Gson();
		
		String data = gson.toJson(dataMap);
		String method = "masget.enterprise.baseline.goods.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 添加商品
	 */
	@RequestMapping(value = "/add_product", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void add_orders(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.baseline.product.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 修改商品
	 */
	@RequestMapping(value = "/modify_product", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void modify_orders(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		String serviceName = "enterpriseService";
		String method = "masget.enterprise.baseline.product.modify";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 删除商品
	 */
	@RequestMapping(value="/deleteProduct",method ={RequestMethod.POST,RequestMethod.GET})
	public void cancel(HttpServletRequest request, HttpServletResponse response) {
		
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String productid = request.getParameter("productid");
		JSONObject obj = new JSONObject();
		obj.put("productid", productid);
		String data = obj.toString();

		String method = "masget.enterprise.baseline.product.delete";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 删除商品子表
	 */
	@RequestMapping(value="/deleteGoods",method ={RequestMethod.POST,RequestMethod.GET})
	public void deleteGoods(HttpServletRequest request, HttpServletResponse response) {
		
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String productid = request.getParameter("productid");
		String goodsid = request.getParameter("goodsid");
		JSONObject obj = new JSONObject();
		obj.put("productid", productid);
		obj.put("goodsid", goodsid);
		
		String data = obj.toString();

		String method = "masget.enterprise.baseline.product.delete";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 查询计量单位
	 */
	@RequestMapping(value = "/find_goodsunit", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void find_brand(
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
		
		if (pagesize != null && !pagesize.equals("")) {
			dataMap.put("pagesize", pagesize);
		}
		if (pagenum != null && !pagenum.equals("")) {
			dataMap.put("pagenum", pagenum);
		}
		Gson gson = new Gson();
		
		String data = gson.toJson(dataMap);
		String method = "masget.enterprise.baseline.goodsunit.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 导出商品
	 */
	@RequestMapping("/export")
	public void export(
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			HttpServletRequest request, HttpServletResponse response) {
		List<String> headList = new ArrayList<String>();
		List<String> keyList = new ArrayList<String>();

		JSONObject obj = new JSONObject();
		obj.put("pagesize", pagesize);
		obj.put("pagenum", pagenum);

		String method = "masget.enterprise.baseline.goods.get";

		String result = CommomUtil.CallApi(request,
				CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		Gson gson2 = new Gson();

		RetStruct struct = gson2.fromJson(result, RetStruct.class);

		result = gson2.toJson(struct.getData().getRows());
		Gson gson = new Gson();
		List<Map<String, Object>> dataMap = null;

		dataMap = gson.fromJson(result,
				new TypeToken<List<Map<String, Object>>>() {
				}.getType());

		headList.add("商品编码");
		headList.add("商品名称");
		headList.add("商品条码");
		headList.add("单位");
		headList.add("商品分类");
		/*headList.add("市场价");*/
		headList.add("销售价");
		
		keyList.add("goodssn");
		keyList.add("productname");
		keyList.add("barcode");
		keyList.add("goodsunitname");
		keyList.add("categoryname");
		/*keyList.add("marketprice");*/
		keyList.add("shopprice");
		
		String fileName = System.currentTimeMillis() + ".xls";
		String path = FileUpload
				.getFilePath(FileUpload.emFileType.GOODS_EXPORT);
		File filePath = new File(path);
		if (!filePath.exists())
			filePath.mkdir();
		try {
			ExcelUtil.writeDataToExcel(dataMap, headList, keyList, path
					+ fileName, "商品表导出");
		} catch (Exception e) {
			e.printStackTrace();
		}
		boolean writeFileFlag = FileUtil.writeFileToClient(response, fileName, path);
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
		List<String> keyList = new ArrayList<String>();
		keyList.add("goodssn");
		keyList.add("goodsname");
		keyList.add("barcode");
		keyList.add("goodsspec");
		keyList.add("categoryname");
		keyList.add("shopprice");
		keyList.add("goodsunitname");
		keyList.add("isbatchcodeZh");

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
	 * 批量添加商品
	 */
	@RequestMapping(value = "/add_allProduct", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void add_allProduct(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.baseline.product.import";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
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
		
		/*String path = request.getSession().getServletContext().getRealPath("/");
		String downFilename = "model.xls";
		String filepath = path + "enterprise/baseline/product/xls/model.xls";*/
		
		String path = FileUpload
				.getFilePath(FileUpload.emFileType.DOCUMENT_TEMPLATE);
		String downFilename = "goodsbase_templates.xls";
		String filepath = path;
		boolean writeFileFlag = FileUtil.writeFileToClient(response, downFilename, filepath);
	}
	
}
