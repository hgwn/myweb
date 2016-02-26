package com.masget.controller.enterprise;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
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
import com.masget.utils.MgException;

@Controller
@RequestMapping("/enterprise/goods")
public class GoodsController {
	private static Logger logger = Logger.getLogger(GoodsController.class);
	// @RequestMapping(method = RequestMethod.GET)
	// public String show(HttpServletRequest request) {
	// return "enterprise/goods/goods";
	// }
	// @RequestMapping("/addgoods")
	// public String showAddGoods(HttpServletRequest request) {
	// return "enterprise/goods/goodsAdd";
	// }

	/**
	 * 查询商品
	 * 
	 * @param goodsname
	 *            :商品名
	 * @param goodsid
	 *            :商品ID
	 * @param pagesize
	 *            :每页记录数
	 * @param pagenum
	 *            :第几页
	 * @param orderkeys
	 *            :desc/asc
	 * @param orders
	 *            :shopprice/timetomarket
	 * @param request
	 *            :
	 * @param response
	 *            :
	 */
	@RequestMapping("/list")
	public void list(
			@RequestParam(value = "goodsname", required = false) String goodsname,
			@RequestParam(value = "goodsid", required = false) Long goodsid,
			@RequestParam(value = "companygoodsclassifyid", required = false) Long companygoodsclassifyid,
			@RequestParam(value = "pagesize", required = true) Integer pagesize,
			@RequestParam(value = "pagenum", required = true) Integer pagenum,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			@RequestParam(value = "orders", required = false) String orders,
			@RequestParam(value = "barcode", required = false) String barcode,
			HttpServletRequest request, HttpServletResponse response) {
		HttpSession httpSession = request.getSession(false);
		if (httpSession == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession
				.getAttribute("user_login_data");
		JSONObject jsonObject = JSONObject.fromObject(login_data);
		@SuppressWarnings("unused")
		String logisticid = jsonObject.get("companyid").toString();
		JSONObject jsonObject1 = new JSONObject();
		if (goodsname != null && !goodsname.equals("")) {
			jsonObject1.put("goodsname", goodsname);
		}
		if (goodsid != null && !goodsid.equals("")) {
			jsonObject1.put("goodsid", goodsid);
		}
		if (companygoodsclassifyid != null
				&& !companygoodsclassifyid.equals("")) {
			jsonObject1.put("companygoodsclassifyid", companygoodsclassifyid);
		}
		if (barcode != null && !barcode.equals("")) {
			jsonObject1.put("barcode", barcode);
		}
		if (orders != null && orderkey != null) {
			jsonObject1.put("orders", orders);
			jsonObject1.put("orderkey", orderkey);
		}
		jsonObject1.put("pagesize", pagesize);
		jsonObject1.put("pagenum", pagenum);

		String serviceName = "enterpriseService";

		String method = "masget.enterprise.com.goods.get";

		String result = CommomUtil.CallApi(request, serviceName, method,
				jsonObject1.toString());

		CommomUtil.writeResultBack(request, response, result);
	}

	/***
	 * 删除商品
	 * 
	 * @param goodsid
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/del_goods", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void del_changewarehouse(
			@RequestParam(value = "goods", required = true) String goods,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		@SuppressWarnings("unused")
		String logisticid = jsonObject.get("companyid").toString();
		JSONObject jsonObject1 = new JSONObject();
		if (goods != null && !goods.equals("")) {
			jsonObject1.put("goods", goods);
		}
		// Map<String, Object> dataMap = new HashMap<String, Object>();
		// dataMap.put("companyid", logisticid);
		//
		// if (goods != null && !goods.equals("")) {
		// dataMap.put("goods", goods);
		// }
		//
		// Gson gson = new Gson();
		// String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.goods.delete";
		String result = CommomUtil.CallApi(request, serviceName, method,
				jsonObject1.toString());
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 根据类目查询
	 */
	@RequestMapping("/sku")
	public void get(
			@RequestParam(value = "categoryid", required = true) Long categoryid,
			@RequestParam(value = "attribid", required = false) String attribid,
			/*
			 * @RequestParam(value="pagesize",required=true) Integer pagesize,
			 * 
			 * @RequestParam(value="pagenum",required=true) Integer pagenum,
			 */
			HttpServletRequest request, HttpServletResponse response) {
		HttpSession httpSession = request.getSession(false);
		if (httpSession == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession
				.getAttribute("user_login_data");
		JSONObject jsonObject = JSONObject.fromObject(login_data);
		@SuppressWarnings("unused")
		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);
		if (attribid != null && !attribid.equals("")) {
			dataMap.put("attribid", attribid);
		}
		dataMap.put("pagesize", 2);
		dataMap.put("pagenum", 1);
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);

		String serviceName = "enterpriseService";

		String method = "masget.enterprise.com.companyattribs.get";

		String result = CommomUtil.CallApi(request, serviceName, method, data);

		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 查询商品类目
	 * 
	 * @param parentid
	 * @param request
	 * @param response
	 */
	@RequestMapping("/categoryattrib")
	public void getCategoryAttrib(
			@RequestParam(value = "categoryid", required = true) Long categoryid,
			HttpServletRequest request, HttpServletResponse response) {

		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("categoryid", categoryid);
		String params = new Gson().toJson(dataMap);
		String method = "masget.enterprise.com.attribs.get";

		String result = CommomUtil.CallApiWithoutEncrypt(request,
				CommomUtil.ENTERPRISE_SERVICE, method, params);

		CommomUtil.writeResultBack(request, response, result);
	}

	@RequestMapping("/category")
	public void getCategory(
			@RequestParam(value = "parentid", required = true) Long parentid,
			HttpServletRequest request, HttpServletResponse response) {

		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("parentid", parentid);
		// String serviceName = "enterpriseService";
		String params = new Gson().toJson(dataMap);
		String method = "masget.enterprise.com.category.get";

		String result = CommomUtil.CallApiWithoutEncrypt(request,
				CommomUtil.ENTERPRISE_SERVICE, method, params);

		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 查询商品分类
	 * 
	 * @param parentid
	 * @param request
	 * @param response
	 */
	@RequestMapping("/searchclass")
	public void searchclass(
			@RequestParam(value = "companyid", required = true) Long companyid,
			@RequestParam(value = "parentid", required = false) Long parentid,
			HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> dataMap = new HashMap<String, Object>();
		if (parentid != null) {
			dataMap.put("parentid", parentid);
		}
		dataMap.put("companyid", companyid);

		// String serviceName = "enterpriseService";
		String params = new Gson().toJson(dataMap);
		String method = "masget.enterprise.com.companygoodsclassify.get";

		String result = CommomUtil.CallApiWithoutEncrypt(request,
				CommomUtil.ENTERPRISE_SERVICE, method, params);

		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 添加商品分类
	 * 
	 * @param goodsname
	 * @param goodsid
	 * @param pagesize
	 * @param pagenum
	 * @param orderkeys
	 * @param orders
	 * @param request
	 * @param response
	 */
	@RequestMapping("/goodsClassAdd")
	public void add(
			@RequestParam(value = "companygoodsclassifyname", required = true) String companygoodsclassifyname,
			@RequestParam(value = "description", required = false) String description,
			@RequestParam(value = "parentid", required = true) Long parentid,
			@RequestParam(value = "keywords", required = false) String keywords,
			@RequestParam(value = "showorders", required = false) String showorders,
			HttpServletRequest request, HttpServletResponse response) {
		HttpSession httpSession = request.getSession(false);
		if (httpSession == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		if (companygoodsclassifyname != null
				&& !"".equals(companygoodsclassifyname)) {
			try {
				companygoodsclassifyname = new String(
						companygoodsclassifyname.getBytes("ISO-8859-1"),
						"UTF-8");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("parentid", parentid);
		jsonObject.put("companygoodsclassifyname", companygoodsclassifyname);
		jsonObject.put("keywords", keywords);
		jsonObject.put("description", description);
		jsonObject.put("showorders", showorders);

		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.companygoodsclassify.add";

		String result = CommomUtil.CallApi(request, serviceName, method,
				jsonObject.toString());

		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 添加商品
	 */
	@RequestMapping("/goodsFormData")
	public void goodsFormData(HttpServletRequest request,
			HttpServletResponse response) {
		String data = request.getParameter("data");
		HttpSession httpSession = request.getSession(false);
		if (httpSession == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.goods.add";

		String result = CommomUtil.CallApi(request, serviceName, method, data);

		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 根据商品分类级联查询商品
	 */
	@RequestMapping("/getgoods_by_classify")
	public void getgoods_by_classify(
			@RequestParam(value = "goodsname", required = false) String goodsname,
			@RequestParam(value = "companygoodsclassifyid", required = false) Long companygoodsclassifyid,
			@RequestParam(value = "barcode", required = false) String barcode,
			@RequestParam(value = "goodsspec", required = false) String goodsspec,
			@RequestParam(value = "pagesize", required = true) String pagesize,
			@RequestParam(value = "pagenum", required = true) String pagenum,
			@RequestParam(value = "orders", required = false) List<String> orders,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			HttpServletRequest request, HttpServletResponse response) {
		HttpSession httpSession = request.getSession(false);
		if (httpSession == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject obj = new JSONObject();
		obj.put("goodsname", goodsname);
		obj.put("companygoodsclassifyid", companygoodsclassifyid);
		obj.put("barcode", barcode);
		obj.put("pagesize", pagesize);
		obj.put("pagenum", pagenum);
		obj.put("goodsspec", goodsspec);
		obj.put("orders", orders);
		obj.put("orderkey", orderkey);

		String method = "masget.enterprise.com.goods.getgoods_by_classify";

		String result = CommomUtil.CallApi(request,
				CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());

		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 导出
	 */
	@RequestMapping("/export")
	public void export(
			@RequestParam(value = "goodsname", required = false) String goodsname,
			@RequestParam(value = "companygoodsclassifyid", required = false) Long companygoodsclassifyid,
			@RequestParam(value = "barcode", required = false) String barcode,
			@RequestParam(value = "goodsspec", required = false) String goodsspec,
			@RequestParam(value = "orders", required = false) List<String> orders,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			HttpServletRequest request, HttpServletResponse response) {
		List<String> headList = new ArrayList<String>();
		List<String> keyList = new ArrayList<String>();

		JSONObject obj = new JSONObject();
		obj.put("goodsname", goodsname);
		obj.put("companygoodsclassifyid", companygoodsclassifyid);
		obj.put("barcode", barcode);
		obj.put("goodsspec", goodsspec);
		obj.put("orders", orders);
		obj.put("orderkey", orderkey);

		String method = "masget.enterprise.com.goods.getgoods_by_classify";

		String result = CommomUtil.CallApi(request,
				CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		logger.info("商品导出masget.enterprise.com.goods.getgoods_by_classify:" + result);
		Gson gson2 = new Gson();

		RetStruct struct = gson2.fromJson(result, RetStruct.class);

		result = gson2.toJson(struct.getData().getRows());
		Gson gson = new Gson();
		List<Map<String, Object>> dataMap = null;

		dataMap = gson.fromJson(result,
				new TypeToken<List<Map<String, Object>>>() {
				}.getType());

		headList.add("商品编码");
		headList.add("商品条码");
		headList.add("商品名称");
		headList.add("规格");
		headList.add("商品分类");
		headList.add("销售价");
		headList.add("单位");
		headList.add("产地");
		headList.add("重量");
		headList.add("备注");

		keyList.add("goodssn");
		keyList.add("barcode");
		keyList.add("goodsname");
		keyList.add("goodsspec");
		keyList.add("companygoodsclassifyname");
		keyList.add("shopprice");
		keyList.add("goodsunitname");
		keyList.add("origin");
		keyList.add("weight");
		keyList.add("description");
		String fileName = System.currentTimeMillis() + ".xls";
		String path = FileUpload
				.getFilePath(FileUpload.emFileType.GOODS_EXPORT);
		logger.info("商品导出path:" + path);
		File filePath = new File(path);
		if (!filePath.exists())
			filePath.mkdir();
		try {
			ExcelUtil.writeDataToExcel(dataMap, headList, keyList, path
					+ fileName, "商品导出");
		} catch (Exception e) {
			e.printStackTrace();
		}
		logger.info("商品导出:"+fileName);
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
		keyList.add("barcode");
		keyList.add("goodsname");
		keyList.add("goodsspec");
		keyList.add("companygoodsclassifyname");
		keyList.add("shopprice");
		keyList.add("goodsunitname");
		keyList.add("origin");
		keyList.add("weight");
		keyList.add("description");

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
	 * 编辑商品 lihongwen 2015-06-25
	 */

	@RequestMapping("/edit_modifygoods")
	public void edit_modifygoods(HttpServletRequest request,
			HttpServletResponse response) {
		String data = request.getParameter("data");
		HttpSession httpSession = request.getSession(false);
		if (httpSession == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.goods.modify";

		String result = CommomUtil.CallApi(request, serviceName, method, data);

		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 根据
	 */
	@RequestMapping("/addgoods")
	public void addgoods(
			@RequestParam(value = "goodsname", required = true) String goodsname,
			@RequestParam(value = "goodssn", required = true) String goodssn,
			@RequestParam(value = "companygoodsclassifyid", required = false) Long companygoodsclassifyid,
			@RequestParam(value = "companygoodsclassifyname", required = false) String companygoodsclassifyname,
			@RequestParam(value = "barcode", required = false) String barcode,
			@RequestParam(value = "goodsspec", required = false) String goodsspec,
			@RequestParam(value = "shopprice", required = true) Double shopprice,
			@RequestParam(value = "weight", required = false) Double weight,
			@RequestParam(value = "goodsunitid", required = false) Long goodsunitid,
			@RequestParam(value = "goodsunitname", required = false) String goodsunitname,
			@RequestParam(value = "origin", required = false) String origin,
			@RequestParam(value = "description", required = false) String description,

			HttpServletRequest request, HttpServletResponse response) {
		HttpSession httpSession = request.getSession(false);
		if (httpSession == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject obj = new JSONObject();
		obj.put("goodsname", goodsname);
		obj.put("goodssn", goodssn);
		obj.put("companygoodsclassifyid", companygoodsclassifyid);
		obj.put("companygoodsclassifyname", companygoodsclassifyname);
		obj.put("goodsunitname", goodsunitname);
		obj.put("barcode", barcode);
		obj.put("goodsspec", goodsspec);
		obj.put("shopprice", shopprice);
		obj.put("weight", weight);
		obj.put("goodsunitid", goodsunitid);
		obj.put("origin", origin);
		obj.put("description", description);

		String method = "masget.enterprise.com.goods.addgoods";

		String result = CommomUtil.CallApi(request,
				CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());

		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping("/addBatch")
	public void addBatch(HttpServletRequest request, HttpServletResponse response) {
		HttpSession httpSession = request.getSession(false);
		if (httpSession == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		String data = request.getParameter("data");
		String method = "masget.enterprise.com.goods.batch.add";

		String result = CommomUtil.CallApi(request,
				CommomUtil.ENTERPRISE_SERVICE, method, data);

		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 根据
	 */
	@RequestMapping("/modifygoods")
	public void modifygoods(
			@RequestParam(value = "goodsid", required = true) Long goodsid,
			@RequestParam(value = "goodsname", required = true) String goodsname,
			@RequestParam(value = "companygoodsclassifyid", required = true) Long companygoodsclassifyid,
			@RequestParam(value = "barcode", required = false) String barcode,
			@RequestParam(value = "goodssn", required = false) String goodssn,
			@RequestParam(value = "goodsspec", required = false) String goodsspec,
			@RequestParam(value = "shopprice", required = true) Double shopprice,
			@RequestParam(value = "weight", required = false) Double weight,
			@RequestParam(value = "goodsunitid", required = false) Long goodsunitid,
			@RequestParam(value = "origin", required = false) String origin,
			@RequestParam(value = "description", required = false) String description,

			HttpServletRequest request, HttpServletResponse response) {
		HttpSession httpSession = request.getSession(false);
		if (httpSession == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject obj = new JSONObject();
		obj.put("goodsid", goodsid);
		obj.put("goodsname", goodsname);
		obj.put("companygoodsclassifyid", companygoodsclassifyid);
		obj.put("barcode", barcode);
		obj.put("goodssn", goodssn);
		obj.put("goodsspec", goodsspec);
		obj.put("shopprice", shopprice);
		obj.put("weight", weight);
		obj.put("goodsunitid", goodsunitid);
		obj.put("origin", origin);
		obj.put("description", description);

		String method = "masget.enterprise.com.goods.modifygoods";

		String result = CommomUtil.CallApi(request,
				CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());

		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 根据
	 */
	@RequestMapping("/deletegoods")
	public void deltegoods(
			@RequestParam(value = "goodsid", required = true) Long goodsid,
			HttpServletRequest request, HttpServletResponse response) {
		HttpSession httpSession = request.getSession(false);
		if (httpSession == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject obj = new JSONObject();
		obj.put("goodsid", goodsid);

		String method = "masget.enterprise.com.goods.deletegoods";

		String result = CommomUtil.CallApi(request,
				CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());

		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 根据
	 */
	@RequestMapping("/deleteSelectedGoods")
	public void deleteSelectedGoods(
			@RequestParam(value = "goods", required = true) String goods,
			HttpServletRequest request, HttpServletResponse response) {

		JSONObject obj = new JSONObject();
		obj.put("goods", goods);

		String method = "masget.enterprise.com.goods.delete";

		String result = CommomUtil.CallApi(request,
				CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());

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
		String path = FileUpload
				.getFilePath(FileUpload.emFileType.DOCUMENT_TEMPLATE);
		String downFilename = "goods_templates.xls";
		String filepath = path;
		boolean writeFileFlag = FileUtil.writeFileToClient(response, downFilename, filepath);
	}
	/**
	 * 查询商品
	 * @param companyid 商家id
	 * @param pagesize 页数
	 * @param pagenum 每页记录数
	 * @param goodsname 商品名字
	 * @param orders 排序条件
	 * @param orderkey 排序规则,降序或升序
	 * @param request
	 * @param response
	 * @author chenjinxing 
	 * @since 2015-8-31
	 */
	@RequestMapping("/goodsList")
	public void goodsList(
			@RequestParam(value="companyid",required=true) String companyid,
			@RequestParam(value="pagesize",required=true) String pagesize,
			@RequestParam(value="pagenum",required=true) String pagenum,
			@RequestParam(value="goodsname",required=false) String goodsname,
			@RequestParam(value="onlineflag",required=false) String onlineflag,
			@RequestParam(value="orders",required=false) String orders,
			@RequestParam(value="orderkey",required=false) String orderkey,
			HttpServletRequest request,HttpServletResponse response){
		
		Map<String,Object> dataMap = new HashMap<String,Object>();
		ArrayList<String> ordersList = new ArrayList<String>();

		//如果companyId不为null表示的是用户点击查询的操作获取所有商品，为null则表示是用户第一次访问页面获取所有商品信息
		if(companyid!=null&&!"".equals(companyid.trim())){
			dataMap.put("companyid",Long.parseLong(companyid));
		}
		dataMap.put("pagesize",Integer.parseInt(pagesize));
		dataMap.put("pagenum",Integer.parseInt(pagenum));
		//根据商品名
		if(goodsname!=null&&!"".equals(goodsname.trim())){
			dataMap.put("goodsname", goodsname);
		}
		if(onlineflag !=null && !"".equals(onlineflag.trim())){
			dataMap.put("onlineflag", Integer.parseInt(onlineflag));
		}
		
		//排序条件
		if(orders!=null&&!"".equals(orders.trim())&&!"undefined".equals(orders.trim())){
			ordersList.add(orders); 
			dataMap.put("orders", ordersList);
			dataMap.put("orderkey", orderkey);
		}		
		String params = new Gson().toJson(dataMap);	
		String TAG = "/masgetweb/enterprise/goods/goodsList";
		String goodsList = "";
		try{
			goodsList = CommomUtil.CallApiWithoutEncrypt(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goods.getstoresgoods",params);
		}catch(Exception e){
			logger.info(TAG+ ":查询实时库存发生异常:" + dataMap.toString(), e); 
			new MgException(20060,"查询实时库存失败",e);
		}
		
		CommomUtil.writeResultBack(request, response, goodsList);
	}	

}
