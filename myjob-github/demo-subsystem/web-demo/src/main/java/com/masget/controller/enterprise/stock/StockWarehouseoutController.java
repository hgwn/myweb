package com.masget.controller.enterprise.stock;

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
import com.masget.util.CommomUtil;
import com.masget.util.ObjectParser;
import com.masget.utils.MgException;

@Controller
@RequestMapping("/enterprise/stock/warehouseout")
public class StockWarehouseoutController {
	private static Logger logger = Logger.getLogger(StockWarehouseoutController.class);
	
	@RequestMapping(value = "/getWarehouseout", method = { RequestMethod.POST, RequestMethod.GET })
	public void getWarehouseout(
			@RequestParam(value="warehouseoutnum",required=false) String warehouseoutnum,
			@RequestParam(value="warehouseoutid",required=false) Long warehouseoutid,
			@RequestParam(value="sourceflag",required=false) Integer sourceflag,
			@RequestParam(value="relationnum",required=false) String relationnum,
			@RequestParam(value="state",required=false) Integer state,
			@RequestParam(value="begincreatedtime",required=false) String begincreatedtime,
			@RequestParam(value="endcreatedtime",required=false) String endcreatedtime,
			@RequestParam(value="pagesize",required=false) Integer pagesize,
			@RequestParam(value="pagenum",required=false) Integer pagenum,
			@RequestParam(value="orders",required=false) String orders,
			@RequestParam(value="orderkey",required=false) String orderkey,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		
		HttpSession httpSession = request.getSession(false);
		if(httpSession == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession.getAttribute("user_login_data");
		JSONObject jsonObject=JSONObject.fromObject(login_data);
		String companyid=jsonObject.get("companyid").toString();
		String warehouseid=jsonObject.get("stationid").toString();
		
		dataMap.put("companyid", companyid);
		dataMap.put("warehouseid", warehouseid);
		dataMap.put("warehouseoutnum", warehouseoutnum);
		dataMap.put("warehouseoutid", warehouseoutid);
		dataMap.put("sourceflag", sourceflag);
		dataMap.put("relationnum", relationnum);
		dataMap.put("state", state);
		dataMap.put("begincreatedtime", begincreatedtime);
		dataMap.put("endcreatedtime", endcreatedtime);
		dataMap.put("pagesize", pagesize);
		dataMap.put("pagenum", pagenum);
		dataMap.put("orderkey", orderkey);
		List<String> ordersList = new ArrayList<String>();
		ordersList.add(orders);
		dataMap.put("orders", ordersList);
		
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, "masget.enterprise.baseline.warehouseout.get", new Gson().toJson(dataMap));
			
		}catch(Exception e){
			throw new MgException(20095, "查询出库单异常", e);
		}
		
		CommomUtil.writeResultBack(request, response, result);
		
	}
	
	/**
	 * 添加出库单
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/add",method={RequestMethod.GET,RequestMethod.POST})
	public void add(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		JSONObject  jasonObject = JSONObject.fromObject(data);
		
		Map<String,Object> dataMap=(Map<String,Object>)jasonObject;
		
		JSONObject jsonObject = JSONObject.fromObject(login_data);
		String companyid=jsonObject.get("companyid").toString();
		String stationid = jsonObject.get("stationid").toString();

		dataMap.put("companyid", companyid);
		dataMap.put("warehouseid", stationid);
		dataMap.put("sourceflag", ObjectParser.toInteger(dataMap.get("sourceflag")));
		
		String serviceName=CommomUtil.ENTERPRISE_SERVICE;
		
		String method="masget.enterprise.baseline.warehouseout.add";
		
        String result = CommomUtil.CallApi(request,serviceName, method, new Gson().toJson(dataMap));
        
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 查询当前站点库存商品表
	 */
	@RequestMapping(value = "/getStockGoods", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void getStockGoods(
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "categoryid", required = false) String categoryid,
			@RequestParam(value = "keywords", required = false) String keywords,
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
		if (keywords != null && !keywords.equals("")) {
			//dataMap.put("keywords", keywords);
		}
		
		JSONObject jsonObject = JSONObject.fromObject(login_data);
		String companyid=jsonObject.get("companyid").toString();
		String stationid = jsonObject.get("stationid").toString();

		dataMap.put("companyid", companyid);
		dataMap.put("warehouseid", stationid);
		
		Gson gson = new Gson();
		
		String data = gson.toJson(dataMap);
		String method = "masget.enterprise.baseline.goodsstock.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 查询库存商品的序列号
	 */
	@RequestMapping(value = "/getGoodsSerial", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void getGoodsSerial(
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "serialnum", required = false) String serialnum,
			@RequestParam(value = "batchcode", required = false) String batchcode,
			@RequestParam(value = "goodsstockid", required = false) String goodsstockid,
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
		
		if (serialnum != null && !serialnum.equals("")) {
			dataMap.put("serialnum", serialnum);
		}
		if (batchcode != null && !batchcode.equals("")) {
			dataMap.put("batchcode", batchcode);
		}

		dataMap.put("goodsstockid", goodsstockid);
		
		JSONObject jsonObject = JSONObject.fromObject(login_data);
		String companyid=jsonObject.get("companyid").toString();
		String stationid = jsonObject.get("stationid").toString();

		dataMap.put("companyid", companyid);
		dataMap.put("warehouseid", stationid);
		
		Gson gson = new Gson();
		
		String data = gson.toJson(dataMap);
		String method = "masget.enterprise.stock.goodsstockserial.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 查询库存商品的批次
	 */
	@RequestMapping(value = "/getGoodsBatchcode", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void getGoodsBatchcode(
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "serialnum", required = false) String serialnum,
			@RequestParam(value = "batchcode", required = false) String batchcode,
			@RequestParam(value = "goodsstockid", required = false) String goodsstockid,
			
			@RequestParam(value = "goodssn", required = false) String goodssn,
			//@RequestParam(value = "companyid", required = false) String companyid,
			//@RequestParam(value = "warehouseid", required = false) String warehouseid,
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
		
		if (serialnum != null && !serialnum.equals("")) {
			dataMap.put("serialnum", serialnum);
		}
		if (batchcode != null && !batchcode.equals("")) {
			dataMap.put("batchcode", batchcode);
		}

		dataMap.put("goodsstockid", goodsstockid);
		
		JSONObject jsonObject = JSONObject.fromObject(login_data);
		String companyid=jsonObject.get("companyid").toString();
		String stationid = jsonObject.get("stationid").toString();

		dataMap.put("companyid", companyid);
		dataMap.put("warehouseid", stationid);
		
		dataMap.put("goodssn", goodssn);
		
		Gson gson = new Gson();
		
		String data = gson.toJson(dataMap);
		String method = "masget.enterprise.stock.goodsstocklist.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
}