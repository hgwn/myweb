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
import com.masget.util.ObjectParser;


@Controller
@RequestMapping("/enterprise/com")
public class StockController {

	private static Logger logger =Logger.getLogger(StockController.class);
	/**
	 * 查询实时库存信息
	 * 
	 * @param goodsid
	 * @param goodssn
	 * @param barcode
	 * @param skuid
	 * @param pagesize
	 * @param pagenum
	 * @param orderkeys
	 * @param orders
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/get_goodsstock", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void get_goodsstock(
			@RequestParam(value = "goodsname", required = false) String goodsname,
			
			@RequestParam(value = "skuname", required = false) String skuname,
			@RequestParam(value = "goodsid", required = false) Long goodsid,
			@RequestParam(value = "warehouseid", required = false) Long warehouseid,
			@RequestParam(value = "goodssn", required = false) String goodssn,
			@RequestParam(value = "barcode", required = false) String barcode,
			@RequestParam(value = "skuid", required = false) Long skuid,
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			@RequestParam(value = "orders", required = false) String orders,
			@RequestParam(value = "goodsunitprice", required = false) Double goodsunitprice,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (skuname != null && !skuname.equals("")) {
			dataMap.put("skuname", skuname);
		}

		if (goodsname != null && !goodsname.equals("")) {
			dataMap.put("goodsname", goodsname);
		}

		if (goodsid != null && !goodsid.equals("")) {
			dataMap.put("goodsid", goodsid);
		}

		if (warehouseid != null && !warehouseid.equals("")) {
			dataMap.put("warehouseid", warehouseid);
		}

		if (barcode != null && !barcode.equals("")) {
			dataMap.put("barcode", barcode);
		}

		if (goodssn != null && !goodssn.equals("")) {
			dataMap.put("goodssn", barcode);
		}

		if (goodsunitprice != null && !goodsunitprice.equals("")) {
			dataMap.put("goodsunitprice", goodsunitprice);
		}
		
		if (skuid != null && !skuid.equals("")) {
			dataMap.put("skuid", skuid);
		}

		if (orders != null && orderkey != null) {
			dataMap.put("orders", orders);
			dataMap.put("orderkey", orderkey);
		}

		if (pagesize != null && pagenum != null) {
			dataMap.put("pagesize", pagesize);
			dataMap.put("pagenum", pagenum);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.goodsstock.get";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 查询站点下所有仓库
	 * 
	 * @param goodssn
	 * @param barcode
	 * @param warehouseid 
	 * @param skuname
	 * @param goodsname
	 * @param pagesize
	 * @param pagenum
	 * @param companyid
	 * @param response
	 */
	@RequestMapping(value = "/query_goodsstock", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void query_goodsstock(
			@RequestParam(value = "companyid", required = false) Long companyid,
			@RequestParam(value = "warehouseid", required = false) Long warehouseid,
			@RequestParam(value = "goodsname", required = false) String goodsname,
			@RequestParam(value = "skuname", required = false) String skuname,
			@RequestParam(value = "goodssn", required = false) String goodssn,
			@RequestParam(value = "barcode", required = false) String barcode,
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

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);
		
		if (companyid != null && !companyid.equals("")) {
			dataMap.put("companyid", companyid);
		}
		
		if (warehouseid != null && !warehouseid.equals("")) {
			dataMap.put("warehouseid", warehouseid);
		}
		
		if (skuname != null && !skuname.equals("")) {
			dataMap.put("skuname", skuname);
		}

		if (goodsname != null && !goodsname.equals("")) {
			dataMap.put("goodsname", goodsname);
		}

		if (barcode != null && !barcode.equals("")) {
			dataMap.put("barcode", barcode);
		}

		if (goodssn != null && !goodssn.equals("")) {
			dataMap.put("goodssn", goodssn);
		}

		if (pagesize != null && pagenum != null) {
			dataMap.put("pagesize", pagesize);
			dataMap.put("pagenum", pagenum);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.goodsstock.query";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	

	/**
	 * 增加库存信息
	 * 
	 * @param goodsid
	 * @param goodssn
	 * @param skuid
	 * @param goodqty
	 * @param damageqty
	 * @param weight
	 * @param purchaseprice
	 * @param remark
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/add_goodsstock", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void add_goodsstock(
			@RequestParam(value = "goodsid", required = true) Long goodsid,
			@RequestParam(value = "goodssn", required = false) String goodssn,
			@RequestParam(value = "skuid", required = true) Long skuid,
			@RequestParam(value = "goodqty", required = false) Long goodqty,
			@RequestParam(value = "damageqty", required = false) Long damageqty,
			@RequestParam(value = "weight", required = false) Double weight,
			@RequestParam(value = "purchaseprice", required = false) Double purchaseprice,
			@RequestParam(value = "remark", required = false) String remark,
			HttpServletRequest request, HttpServletResponse response) {
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (goodsid != null && !goodsid.equals("")) {
			dataMap.put("goodsid", goodsid);
		}

		if (goodssn != null && !goodssn.equals("")) {
			dataMap.put("goodssn", goodssn);
		}

		if (goodssn != null && !goodssn.equals("")) {
			dataMap.put("goodssn", goodssn);
		}

		if (skuid != null && !skuid.equals("")) {
			dataMap.put("skuid", skuid);
		}

		if (goodqty != null && goodqty != null) {
			dataMap.put("goodqty", goodqty);
		}

		if (damageqty != null) {
			dataMap.put("damageqty", damageqty);
		}

		if (weight != null) {
			dataMap.put("weight", weight);
		}

		if (purchaseprice != null) {
			dataMap.put("purchaseprice", purchaseprice);
		}

		if (remark != null) {
			dataMap.put("remark", remark);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.goodsstock.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 修改库存信息
	 * 
	 * @param goodsid
	 * @param skuid
	 * @param goodqty
	 * @param damageqty
	 * @param weight
	 * @param purchaseprice
	 * @param remark
	 * @param enableflag
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/modify_goodsstock", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void modify_goodsstock(
			@RequestParam(value = "goodsstockid", required = true) Long goodsstockid,
			@RequestParam(value = "goodsid", required = true) Long goodsid,
			@RequestParam(value = "skuid", required = true) Long skuid,
			@RequestParam(value = "goodqty", required = false) Long goodqty,
			@RequestParam(value = "damageqty", required = false) Long damageqty,
			@RequestParam(value = "weight", required = false) Double weight,
			@RequestParam(value = "purchaseprice", required = false) Double purchaseprice,
			@RequestParam(value = "remark", required = false) String remark,
			@RequestParam(value = "enableflag", required = false) Integer enableflag,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (goodsstockid != null && !goodsstockid.equals("")) {
			dataMap.put("goodsstockid", goodsstockid);
		}

		if (goodsid != null && !goodsid.equals("")) {
			dataMap.put("goodsid", goodsid);
		}

		if (skuid != null && !skuid.equals("")) {
			dataMap.put("skuid", skuid);
		}

		if (goodqty != null && goodqty != null) {
			dataMap.put("goodqty", goodqty);
		}

		if (damageqty != null) {
			dataMap.put("damageqty", damageqty);
		}

		if (weight != null) {
			dataMap.put("weight", weight);
		}

		if (purchaseprice != null) {
			dataMap.put("purchaseprice", purchaseprice);
		}

		if (remark != null) {
			dataMap.put("remark", remark);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.goodsstock.modify";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 查询入库单
	 * 
	 * @param warehouseinnum
	 * @param sourceflag
	 * @param state
	 * @param auditflag
	 * @param pagesize
	 * @param pagenum
	 * @param orders
	 * @param orderkey
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/get_warehousein", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void get_warehousein(
			@RequestParam(value = "warehouseinnum", required = false) String warehouseinnum,
			@RequestParam(value = "sourceflag", required = false) Integer sourceflag,
			@RequestParam(value = "state", required = false) Integer state,
			@RequestParam(value = "auditflag", required = false) Integer auditflag,
			@RequestParam(value="begincreatedtime",required = false) String begincreatedtime,
			@RequestParam(value="endcreatedtime",required = false) String endcreatedtime,
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "orders", required = false) String orders,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			@RequestParam(value = "warehouseid", required = false) String warehouseid,
			@RequestParam(value = "stationid", required = false) String stationid,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (warehouseinnum != null && !warehouseinnum.equals("")) {
			dataMap.put("warehouseinnum", warehouseinnum);
		}

		if (sourceflag != null && !sourceflag.equals("")) {
			dataMap.put("sourceflag", sourceflag);
		}

		if (state != null && state != null) {
			dataMap.put("state", state);
		}

		if (auditflag != null) {
			dataMap.put("auditflag", auditflag);
		}

		if (orders != null && orderkey != null) {
			dataMap.put("orders", orders);
			dataMap.put("orderkey", orderkey);
		}

		if (pagesize != null && pagenum != null) {
			dataMap.put("pagesize", pagesize);
			dataMap.put("pagenum", pagenum);
		}
		
		if(begincreatedtime!=null&&endcreatedtime!=null&&!begincreatedtime.equals("")&&!endcreatedtime.equals("")){
			dataMap.put("begincreatedtime", begincreatedtime);
			dataMap.put("endcreatedtime", endcreatedtime);
		}
		if (warehouseid != null && !warehouseid.equals("")) {
			dataMap.put("warehouseid", warehouseid);
		}
		if (stationid != null && !stationid.equals("")) {
			dataMap.put("stationid", stationid);
		}
		
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.warehousein.get";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 查询入库明细单
	 * 
	 * @param warehouseinnum
	 * @param relationnum
	 * @param state
	 * @param pagesize
	 * @param pagenum
	 * @param orders
	 * @param orderkey
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/get_warehouseinlist", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void get_warehouseinlist(
			@RequestParam(value = "warehouseinid", required = false) Long warehouseinid,
			@RequestParam(value = "warehouseinnum", required = false) String warehouseinnum,
			@RequestParam(value = "relationnum", required = false) String relationnum,
			@RequestParam(value = "state", required = false) Integer state,
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "orders", required = false) String orders,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (warehouseinid != null && !warehouseinid.equals("")) {
			dataMap.put("warehouseinid", warehouseinid);
		}

		if (warehouseinnum != null && !warehouseinnum.equals("")) {
			dataMap.put("warehouseinnum", warehouseinnum);
		}

		if (relationnum != null && !relationnum.equals("")) {
			dataMap.put("relationnum", relationnum);
		}

		if (state != null && state != null) {
			dataMap.put("state", state);
		}

		if (orders != null && orderkey != null) {
			dataMap.put("orders", orders);
			dataMap.put("orderkey", orderkey);
		}

		if (pagesize != null && pagenum != null) {
			dataMap.put("pagesize", pagesize);
			dataMap.put("pagenum", pagenum);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.warehouseinlist.get";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 增加入库单
	 * 
	 * @param warehouseinnum
	 * @param relationnum
	 * @param state
	 * @param pagesize
	 * @param pagenum
	 * @param orders
	 * @param orderkey
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/add_warehousein", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void add_warehousein(
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
		String method = "masget.enterprise.com.warehousein.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 审核入库单
	 * 
	 * @param warehouseinid
	 * @param remark
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/audit_warehousein", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void audit_warehousein(
			@RequestParam(value = "warehouseinid", required = true) Long warehouseinid,
			@RequestParam(value = "state", required = true) Integer state,
			@RequestParam(value = "auditflag", required = true) Integer auditflag,
			@RequestParam(value = "remark", required = false) String remark,
			@RequestParam(value = "warehouseid", required = false) String warehouseid,
			
			@RequestParam(value = "supplierid", required = false) String supplierid,
			@RequestParam(value = "imeicode", required = false) String imeicode,
			@RequestParam(value = "batchcode", required = false) String batchcode,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (warehouseinid != null && !warehouseinid.equals("")) {
			dataMap.put("warehouseinid", warehouseinid);
		}

		if (remark != null && !remark.equals("")) {
			dataMap.put("remark", remark);
		}

		if (state != null && !state.equals("")) {
			dataMap.put("state", state);
		}

		if (auditflag != null && !auditflag.equals("")) {
			dataMap.put("auditflag", auditflag);
		}
		if (warehouseid != null && !warehouseid.equals("")) {
			dataMap.put("warehouseid", warehouseid);
		}
		
		if (supplierid != null && !supplierid.equals("")) {
			dataMap.put("supplierid", supplierid);
		}
		if (imeicode != null && !imeicode.equals("")) {
			dataMap.put("imeicode", imeicode);
		}
		if (batchcode != null && !batchcode.equals("")) {
			dataMap.put("batchcode", batchcode);
		}
		
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.warehousein.audit";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 删除入库单
	 * 
	 * @param warehouseinid
	 * @param remark
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/del_warehousein", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void del_warehousein(
			@RequestParam(value = "warehouseinid", required = true) Long warehouseinid,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (warehouseinid != null && !warehouseinid.equals("")) {
			dataMap.put("warehouseinid", warehouseinid);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.warehousein.del";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 查询出库单
	 * 
	 * @param warehouseoutnum
	 * @param sourceflag
	 * @param state
	 * @param auditflag
	 * @param pagesize
	 * @param pagenum
	 * @param orderkey
	 * @param orders
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/get_warehouseout", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void get_warehouseout(
			@RequestParam(value = "warehouseid", required = false) String warehouseid,
			@RequestParam(value = "warehouseoutnum", required = false) String warehouseoutnum,
			@RequestParam(value = "sourceflag", required = false) Integer sourceflag,
			@RequestParam(value = "state", required = false) Integer state,
			@RequestParam(value = "auditflag", required = false) Integer auditflag,
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			@RequestParam(value = "orders", required = false) String orders,
			@RequestParam(value="begincreatedtime",required = false) String begincreatedtime,
			@RequestParam(value="endcreatedtime",required = false) String endcreatedtime,
			HttpServletRequest request, HttpServletResponse response) {
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);
		if (warehouseid != null && !"".equals(warehouseid)) {
			dataMap.put("warehouseid", Long.valueOf(warehouseid));
		}
		if (warehouseoutnum != null && !warehouseoutnum.equals("")) {
			dataMap.put("warehouseoutnum", warehouseoutnum);
		}

		if (sourceflag != null && !sourceflag.equals("")) {
			dataMap.put("sourceflag", sourceflag);
		}

		if (state != null && !state.equals("")) {
			dataMap.put("state", state);
		}

		if (auditflag != null && !auditflag.equals("")) {
			dataMap.put("auditflag", auditflag);
		}
		if (orders != null && orderkey != null) {
			dataMap.put("orders", orders);
			dataMap.put("orderkey", orderkey);
		}

		if (pagesize != null && pagenum != null) {
			dataMap.put("pagesize", pagesize);
			dataMap.put("pagenum", pagenum);
		}
		
		if(begincreatedtime!=null&&endcreatedtime!=null&&!begincreatedtime.equals("")&&!endcreatedtime.equals("")){
			dataMap.put("begincreatedtime", begincreatedtime);
			dataMap.put("endcreatedtime", endcreatedtime);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.warehouseout.get";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 查询出库明细单
	 * 
	 * @param warehouseoutnum
	 * @param relationnum
	 * @param state
	 * @param auditflag
	 * @param pagesize
	 * @param pagenum
	 * @param orderkey
	 * @param orders
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/get_warehouseoutlist", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void get_warehouseoutlist(
			@RequestParam(value = "warehouseoutid", required = false) Long warehouseoutid,
			@RequestParam(value = "warehouseoutnum", required = false) String warehouseoutnum,
			@RequestParam(value = "relationnum", required = false) String relationnum,
			@RequestParam(value = "state", required = false) Integer state,
			@RequestParam(value = "auditflag", required = false) Integer auditflag,
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			@RequestParam(value = "orders", required = false) String orders,
			HttpServletRequest request, HttpServletResponse response) {
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (warehouseoutnum != null && !warehouseoutnum.equals("")) {
			dataMap.put("warehouseoutnum", warehouseoutnum);
		}

		if (warehouseoutid != null && !warehouseoutid.equals("")) {
			dataMap.put("warehouseoutid", warehouseoutid);
		}

		if (relationnum != null && !relationnum.equals("")) {
			dataMap.put("relationnum", relationnum);
		}

		if (state != null && !state.equals("")) {
			dataMap.put("state", state);
		}

		if (auditflag != null && !auditflag.equals("")) {
			dataMap.put("auditflag", auditflag);
		}

		if (orders != null && orderkey != null) {
			dataMap.put("orders", orders);
			dataMap.put("orderkey", orderkey);
		}

		if (pagesize != null && pagenum != null) {
			dataMap.put("pagesize", pagesize);
			dataMap.put("pagenum", pagenum);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.warehouseoutlist.get";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 增加出库单
	 * 
	 * @param data
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/add_warehouseout", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void add_warehouseout(
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
		String method = "masget.enterprise.com.warehouseout.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 审核出库单
	 * 
	 * @param warehouseoutid
	 * @param remark
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/audit_warehouseout", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void audit_warehouseout(
			@RequestParam(value = "warehouseoutid", required = true) Long warehouseoutid,
			@RequestParam(value = "remark", required = false) String remark,
			@RequestParam(value = "state", required = true) Integer state,
			@RequestParam(value = "auditflag", required = true) Integer auditflag,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (warehouseoutid != null && !warehouseoutid.equals("")) {
			dataMap.put("warehouseoutid", warehouseoutid);
		}

		if (state != null && !state.equals("")) {
			dataMap.put("state", state);
		}

		if (auditflag != null && !auditflag.equals("")) {
			dataMap.put("auditflag", auditflag);
		}

		if (remark != null && !remark.equals("")) {
			dataMap.put("remark", remark);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.warehouseout.audit";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 删除出库单
	 * 
	 * @param warehouseoutid
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/del_warehouseout", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void del_warehouseout(
			@RequestParam(value = "warehouseoutid", required = true) Long warehouseoutid,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (warehouseoutid != null && !warehouseoutid.equals("")) {
			dataMap.put("warehouseoutid", warehouseoutid);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.warehouseout.del";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 查询移库单
	 * 
	 * @param changewarehousenum
	 * @param targetwarehouseid
	 * @param changetype
	 * @param state
	 * @param auditflag
	 * @param pagesize
	 * @param pagenum
	 * @param orderkey
	 * @param orders
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/get_changewarehouse", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void get_changewarehouse(
			@RequestParam(value = "changewarehousenum", required = false) String changewarehousenum,
			@RequestParam(value = "sourcepstationname", required = false) String sourcepstationname,
			@RequestParam(value = "sourcewarehousename", required = false) String sourcewarehousename,
			@RequestParam(value = "targetpstationname", required = false) String targetpstationname,
			@RequestParam(value = "targetwarehousename", required = false) String targetwarehousename,
			@RequestParam(value = "targetwarehouseid", required = false) Long targetwarehouseid,  
			@RequestParam(value = "totgoodsweight", required = false) Long totgoodsweight,
			@RequestParam(value = "changetype", required = false) Integer changetype,
			@RequestParam(value = "state", required = false) Integer state,
			@RequestParam(value = "auditflag", required = false) Integer auditflag,
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			@RequestParam(value = "orders", required = false) String orders,
			@RequestParam(value="begincreatedtime",required = false) String begincreatedtime,
			@RequestParam(value="endcreatedtime",required = false) String endcreatedtime,
			HttpServletRequest request, HttpServletResponse response) {
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (changewarehousenum != null && !changewarehousenum.equals("")) {
			dataMap.put("changewarehousenum", changewarehousenum);
		}

		if (sourcepstationname != null && !sourcepstationname.equals("")) {
			dataMap.put("sourcepstationname", sourcepstationname);
		}
		
		if (sourcewarehousename != null && !sourcewarehousename.equals("")) {
			dataMap.put("sourcewarehousename", sourcewarehousename);
		}
		
		if (targetpstationname != null && !targetpstationname.equals("")) {
			dataMap.put("targetpstationname", targetpstationname);
		}
		
		if (targetwarehousename != null && !targetwarehousename.equals("")) {
			dataMap.put("targetwarehousename", targetwarehousename);
		}
		
		if (totgoodsweight != null && !totgoodsweight.equals("")) {
			dataMap.put("totgoodsweight", totgoodsweight);
		}
		
		if (targetwarehouseid != null && !targetwarehouseid.equals("")) {
			dataMap.put("targetwarehouseid", targetwarehouseid);
		}

		if (changetype != null && !changetype.equals("")) {
			dataMap.put("changetype", changetype);
		}

		if (state != null && !state.equals("")) {
			dataMap.put("state", state);
		}

		if (auditflag != null && !auditflag.equals("")) {
			dataMap.put("auditflag", auditflag);
		}

		if (orders != null && orderkey != null) {
			dataMap.put("orders", orders);
			dataMap.put("orderkey", orderkey);
		}

		if (pagesize != null && pagenum != null) {
			dataMap.put("pagesize", pagesize);
			dataMap.put("pagenum", pagenum);
		}
		
		if(begincreatedtime!=null&&endcreatedtime!=null&&!begincreatedtime.equals("")&&!endcreatedtime.equals("")){
			dataMap.put("begincreatedtime", begincreatedtime);
			dataMap.put("endcreatedtime", endcreatedtime);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.changewarehouse.get";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 查询移库明细单
	 * 
	 * @param changewarehousenum
	 * @param targetwarehouseid
	 * @param goodsname
	 * @param barcode
	 * @param pagesize
	 * @param pagenum
	 * @param orderkey
	 * @param orders
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/get_changewarehouselist", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void get_changewarehouselist(
			@RequestParam(value = "changewarehouseid", required = true) Long changewarehouseid,
			@RequestParam(value = "changewarehousenum", required = false) String changewarehousenum,
			@RequestParam(value = "targetwarehouseid", required = false) Long targetwarehouseid,
			@RequestParam(value = "goodsname", required = false) String goodsname,
			@RequestParam(value = "barcode", required = false) String barcode,
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			@RequestParam(value = "orders", required = false) String orders,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (changewarehouseid != null && !changewarehouseid.equals("")) {
			dataMap.put("changewarehouseid", changewarehouseid);
		}

		if (changewarehousenum != null && !changewarehousenum.equals("")) {
			dataMap.put("changewarehousenum", changewarehousenum);
		}

		if (targetwarehouseid != null && !targetwarehouseid.equals("")) {
			dataMap.put("targetwarehouseid", targetwarehouseid);
		}

		if (goodsname != null && !goodsname.equals("")) {
			dataMap.put("goodsname", goodsname);
		}

		if (barcode != null && !barcode.equals("")) {
			dataMap.put("barcode", barcode);
		}

		if (orders != null && orderkey != null) {
			dataMap.put("orders", orders);
			dataMap.put("orderkey", orderkey);
		}

		if (pagesize != null && pagenum != null) {
			dataMap.put("pagesize", pagesize);
			dataMap.put("pagenum", pagenum);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.changewarehouselist.get";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 查询目标仓库
	 * 
	 * @param companyid
	 * @param parentid
	 * @param request
	 * @param response
	 */

	@RequestMapping("/check_changewarehouse")
	public void searchclass(
			// @RequestParam(value = "targetwarehouseid", required = false) Long
			// targetwarehouseid,
			@RequestParam(value = "targetwarehousename", required = false) Long targetwarehousename,
			HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> dataMap = new HashMap<String, Object>();
		if (targetwarehousename != null) {
			dataMap.put("targetwarehousename", targetwarehousename);
		}
		// dataMap.put("targetwarehouseid", targetwarehouseid);

		String params = new Gson().toJson(dataMap);
		String method = "masget.base.com.companystations.get";
		String result = CommomUtil.CallApi(request,
				CommomUtil.ENTERPRISE_SERVICE, method, params);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 增加移库单
	 * 
	 * @param data
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/add_changewarehouse", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void add_changewarehouse(
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
		String method = "masget.enterprise.com.changewarehouse.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 审核移库单
	 * 
	 * @param changewarehouseid
	 * @param remark
	 * @param request
	 * @param response
	 * @param state
	 */
	@RequestMapping(value = "/audit_changewarehouse", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void audit_changewarehouse(
			@RequestParam(value = "changewarehouseid", required = true) Long changewarehouseid,
			@RequestParam(value = "remark", required = false) String remark,
			@RequestParam(value = "state", required = true) Integer state,
			@RequestParam(value = "auditflag", required = true) Integer auditflag,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (changewarehouseid != null && !changewarehouseid.equals("")) {
			dataMap.put("changewarehouseid", changewarehouseid);
		}

		if (remark != null && !remark.equals("")) {
			dataMap.put("remark", remark);
		}
		if (state != null && !state.equals("")) {
			dataMap.put("state", state);
		}
		if (auditflag != null && !auditflag.equals("")) {
			dataMap.put("auditflag", auditflag);
		}
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.changewarehouse.audit";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/***
	 * 删除移库单
	 * 
	 * @param changewarehouseid
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/del_changewarehouse", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void del_changewarehouse(
			@RequestParam(value = "changewarehouseid", required = true) Long changewarehouseid,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (changewarehouseid != null && !changewarehouseid.equals("")) {
			dataMap.put("changewarehouseid", changewarehouseid);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.changewarehouse.del";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 库存盘点
	 * 
	 * @param checkbatch
	 * @param goodsid
	 * @param skuid
	 * @param goodqty
	 * @param damageqty
	 * @param weight
	 * @param remark
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/add_goodsstockcheck", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void add_goodsstockcheck(
			@RequestParam(value = "checkbatch", required = false) String checkbatch,
			@RequestParam(value = "goodsid", required = false) Long goodsid,
			@RequestParam(value = "skuid", required = false) Long skuid,
			@RequestParam(value = "goodqty", required = false) Integer goodqty,
			@RequestParam(value = "damageqty", required = false) Integer damageqty,
			@RequestParam(value = "weight", required = false) Double weight,
			@RequestParam(value = "remark", required = false) String remark,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (checkbatch != null && !checkbatch.equals("")) {
			dataMap.put("checkbatch", checkbatch);
		}

		if (goodsid != null && !goodsid.equals("")) {
			dataMap.put("goodsid", goodsid);
		}

		if (skuid != null && !skuid.equals("")) {
			dataMap.put("skuid", skuid);
		}

		if (goodqty != null && !goodqty.equals("")) {
			dataMap.put("goodqty", goodqty);
		}

		if (damageqty != null && !damageqty.equals("")) {
			dataMap.put("damageqty", damageqty);
		}

		if (weight != null && !weight.equals("")) {
			dataMap.put("weight", weight);
		}

		if (remark != null && !remark.equals("")) {
			dataMap.put("remark", remark);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.goodsstockcheck.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 获取商品信息
	 * 
	 * @param goodsname
	 * @param skuname
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getbycompany_goodssku", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void getbycompany_goodssku(
			@RequestParam(value = "goodsname", required = false) String goodsname,
			@RequestParam(value = "skuname", required = false) String skuname,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (goodsname != null && !goodsname.equals("")) {
			dataMap.put("goodsname", goodsname);
		}

		if (skuname != null && !skuname.equals("")) {
			dataMap.put("skuname", skuname);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.goodssku.getbycompany";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 按订单出库
	 * 
	 * @param warehouseoutnum
	 * @param remark
	 * @param orderid
	 * @param ordernum
	 * @param autoaduitflag
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/addbyorders_warehouseout", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void addbyorders_warehouseout(
			@RequestParam(value = "data", required = false) String data,
			/*@RequestParam(value = "orderid", required = false) String orderid,
			@RequestParam(value = "ordernum", required = false) String ordernum,
			@RequestParam(value = "warehouseid", required = false) String warehouseid,
			@RequestParam(value = "warehouseoutnum", required = false) String warehouseoutnum,
			@RequestParam(value = "remark", required = false) String remark,
			@RequestParam(value = "sourceflag", required = false) String sourceflag,
			@RequestParam(value = "outnumtype", required = false) String outnumtype,
			@RequestParam(value = "warehouseoutlist", required = false) String warehouseoutlist,*/
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.warehouseout.addbyorders";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	@RequestMapping(value = "/addbyorders_warehousein", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void addbyorders_warehousein(
			@RequestParam(value = "warehouseinnum", required = false) String warehouseinnum,
			@RequestParam(value = "remark", required = false) String remark,
			@RequestParam(value = "orderid", required = false) Long orderid,
			@RequestParam(value = "ordernum", required = false) String ordernum,
			@RequestParam(value = "autoaduitflag", required = false) Integer autoaduitflag,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (warehouseinnum != null && !warehouseinnum.equals("")) {
			dataMap.put("warehouseinnum", warehouseinnum);
		}

		if (remark != null && !remark.equals("")) {
			dataMap.put("remark", remark);
		}

		if (orderid != null && !orderid.equals("")) {
			dataMap.put("orderid", orderid);
		}

		if (ordernum != null && !ordernum.equals("")) {
			dataMap.put("ordernum", ordernum);
		}

		if (autoaduitflag != null && !autoaduitflag.equals("")) {
			dataMap.put("autoaduitflag", autoaduitflag);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.warehousein.addbyorders";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/*@RequestMapping(value = "/fileUpload_warehousecheck")
	public void fileUpload(HttpServletRequest request,
			HttpServletResponse response) {
		String fileuploadResult = CommomUtil.FileUpLoadAndGetParam(request,
				response);
		JSONObject fileuploadResultJson = JSONObject
				.fromObject(fileuploadResult);
		if (fileuploadResultJson.getInt("ret") != 0) {// 上传失败
			logger.error("文件上传失败");
			return;
		}
		String fileUploadSavePath = FileUpload.fileUploadSavePath;
		String fileUploadDir = FileUpload.fileUploadDir;
		JSONObject data = fileuploadResultJson.getJSONObject("data");
		String url = data.getString("upfile");
		int index = url.lastIndexOf("/");
		String path = fileUploadSavePath + fileUploadDir + "\\"
				+ url.substring(index + 1);
		
		File file = new File(path);
		
		String filetype = FileUtil.getFileByFile(file);
		
		if(!filetype.equals("xls"))
		{
			return ;
		}
		List<Map<String, Object>> result = null;
		List<String> keyList = new ArrayList<String>();
		keyList.add("id");
		keyList.add("name");
		keyList.add("age");
		keyList.add("birth");
		
		try {
			result = ExcelUtil.readExcelData(file, 1, keyList);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		Gson gson = new Gson();
		System.out.print(gson.toJson(result));
	}

	public static void main(String[] args) {
		
//		// 第五步，写入实体数据 实际应用中这些数据从数据库得到，
//		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
//		Map<String, Object> dataMap = new HashMap<String, Object>();
//		dataMap.put("id", "1000");
//		dataMap.put("name", "海风");
//		dataMap.put("age", "16");
//		dataMap.put("birth", "1992-12-11");
//		list.add(dataMap);
//		list.add(dataMap);
//		list.add(dataMap);
//		list.add(dataMap);
//
//		list.add(dataMap);
//		list.add(dataMap);
//		list.add(dataMap);
//		list.add(dataMap);
//		list.add(dataMap);
//		list.add(dataMap);
//
//		List<String> headList = new ArrayList<String>();
//		List<String> keyList = new ArrayList<String>();
//		headList.add("学号");
//		headList.add("姓名");
//		headList.add("年龄");
//		headList.add("生日");
//		keyList.add("id");
//		keyList.add("name");
//		keyList.add("age");
//		keyList.add("birth");
//		ExcelUtil.writeDataToExcel(list, headList, keyList, "E://test.xls",  "sheet1");
		
		
		File file = new File("E://test.xls");

		List<Map<String, Object>> result = null;
		List<String> keyList = new ArrayList<String>();
		keyList.add("id");
		keyList.add("name");
		keyList.add("age");
		keyList.add("birth");
		
		try {
			result = ExcelUtil.readExcelData(file, 1, keyList);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		Gson gson = new Gson();
		System.out.print(gson.toJson(result));
	}*/

	/**
	 * 导出
	 */
	@RequestMapping("/export")
	public void export(
			@RequestParam(value = "goodsname", required = false) String goodsname,
			@RequestParam(value = "skuname", required = false) String skuname,
			@RequestParam(value = "goodsid", required = false) Long goodsid,
			@RequestParam(value = "warehouseid", required = false) Long warehouseid,
			@RequestParam(value = "goodssn", required = false) String goodssn,
			@RequestParam(value = "barcode", required = false) String barcode,
			@RequestParam(value = "skuid", required = false) Long skuid,
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			@RequestParam(value = "orders", required = false) String orders,
			@RequestParam(value = "goodsunitprice", required = false) Double goodsunitprice,
			HttpServletRequest request, HttpServletResponse response) {
		List<String> headList = new ArrayList<String>();
		List<String> keyList = new ArrayList<String>();
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (skuname != null && !skuname.equals("")) {
			dataMap.put("skuname", skuname);
		}

		if (goodsname != null && !goodsname.equals("")) {
			dataMap.put("goodsname", goodsname);
		}

		if (goodsid != null && !goodsid.equals("")) {
			dataMap.put("goodsid", goodsid);
		}

		if (warehouseid != null && !warehouseid.equals("")) {
			dataMap.put("warehouseid", warehouseid);
		}

		if (barcode != null && !barcode.equals("")) {
			dataMap.put("barcode", barcode);
		}

		if (goodssn != null && !goodssn.equals("")) {
			dataMap.put("goodssn", barcode);
		}

		if (goodsunitprice != null && !goodsunitprice.equals("")) {
			dataMap.put("goodsunitprice", goodsunitprice);
		}
		
		if (skuid != null && !skuid.equals("")) {
			dataMap.put("skuid", skuid);
		}

		if (orders != null && orderkey != null) {
			dataMap.put("orders", orders);
			dataMap.put("orderkey", orderkey);
		}

		if (pagesize != null && pagenum != null) {
			dataMap.put("pagesize", pagesize);
			dataMap.put("pagenum", pagenum);
		}

		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.goodsstock.get";
		String result = CommomUtil.CallApi(request, serviceName, method, dataMap.toString());
			
		Gson gson2 = new Gson();

		RetStruct struct = gson2.fromJson(result, RetStruct.class);

		result = gson2.toJson(struct.getData().getRows());
		Gson gson = new Gson();
		List<Map<String, Object>> dataMaplist = null;

		dataMaplist = gson.fromJson(result,new TypeToken<List<Map<String, Object>>>() {}.getType());

		headList.add("仓库名称");
		headList.add("商品名称");
		headList.add("商品SKU");
		headList.add("商品货号");
		headList.add("进货价");
		headList.add("商品重量");
		headList.add("完好库存");
		headList.add("损坏库存");
		headList.add("盘点完好库存");
		headList.add("盘点损坏库存");

		keyList.add("warehousename");
		keyList.add("goodsname");
		keyList.add("skuid");
		keyList.add("barcode");
		keyList.add("purchaseprice");
		keyList.add("weight");
		keyList.add("goodqty");
		keyList.add("damageqty");
		keyList.add("inventory");
		keyList.add("damageinventory");
		
		String fileName = System.currentTimeMillis() + ".xls";
		String path = FileUpload
				.getFilePath(FileUpload.emFileType.GOODS_EXPORT);
		File filePath = new File(path);
		if (!filePath.exists())
			filePath.mkdir();
		try {
			ExcelUtil.writeDataToExcel(dataMaplist, headList, keyList, path
					+ fileName, "1");
		} catch (Exception e) {
			e.printStackTrace();
		}

		boolean writeFileFlag = FileUtil.writeFileToClient(response, fileName, path);
		
		/*String fileName = System.currentTimeMillis() + ".xls";
		String path = "e://goodstock.xls";
		try {
		    ExcelUtil.writeDataToExcel(dataMaplist, headList, keyList, path, "1111");
		   
		   response.reset();// 可以加也可以不加
		   response.setContentType("application/x-download");
		   int status = 0;
		   byte b[] = new byte[1024];
		   FileInputStream in = null;
		   ServletOutputStream out2 = null;
		   try {
		    response.setHeader("content-disposition","attachment; filename=goodstock.xls");
		    in = new FileInputStream(path);
		    out2 = response.getOutputStream();
		    while (status != -1) {
		     status = in.read(b);
		     out2.write(b);
		    }
		    out2.flush();
		   } catch (Exception e) {
		    System.out.println(e);

		   } finally {
		    if (in != null)
		     in.close();
		    if (out2 != null)
		     out2.close();
		   }

		   
		  } catch (Exception e) {
		   // TODO: handle exception
		  }*/
		
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
			keyList.add("warehousename");
			keyList.add("goodsname");
			keyList.add("skuid");
			keyList.add("barcode");
			keyList.add("goodsunitprice");
			keyList.add("weight");
			keyList.add("goodqty");
			keyList.add("damageqty");
			keyList.add("inventory");
			keyList.add("damageinventory");

			try {
				result = ExcelUtil.readExcelData(file, 1, keyList);
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			List<Map<String, Object>> surplusList = new ArrayList<Map<String,Object>>();
			List<Map<String, Object>> lossList = new ArrayList<Map<String,Object>>();
			
			for(Map<String,Object> row : result){
				
				row.put("skuid", ObjectParser.toInteger(row.get("skuid")));
				
				Map<String,Object> row1 = new HashMap<String, Object>();
				Map<String,Object> row2 = new HashMap<String, Object>();
				
				row1.putAll(row);
				row2.putAll(row);
				
				int goodssoundqty = ObjectParser.toInteger(row.get("goodqty"));//完好库存
				int inventory = ObjectParser.toInteger(row.get("inventory")); //盘点完好库存
				int goodsdamageqty = ObjectParser.toInteger(row.get("damageqty")); //损坏库存
				int damageinventory = ObjectParser.toInteger(row.get("damageinventory")); //盘点损坏库存
				
				if(goodssoundqty > inventory){
					row1.put("goodssoundqty", goodssoundqty-inventory);
					row1.put("goodsdamageqty", 0);
					lossList.add(row1);
				}
				
				if(goodssoundqty < inventory){
					row1.put("goodssoundqty", inventory-goodssoundqty);
					row1.put("goodsdamageqty", 0);
					surplusList.add(row1);
				}
				
				
				if(goodsdamageqty < damageinventory){
					row2.put("goodssoundqty", 0);
					row2.put("goodsdamageqty", damageinventory-goodsdamageqty);
					surplusList.add(row2);
				}
				if(goodsdamageqty > damageinventory){
					row2.put("goodssoundqty", 0);
					row2.put("goodsdamageqty", goodsdamageqty-damageinventory);
					lossList.add(row2);
				}
			}
			
			Gson gson = new Gson();
			//System.out.print(gson.toJson(result));
			Map<String, Object> dataResult = new HashMap<String, Object>();
			dataResult.put("lossList",lossList);
			dataResult.put("surplusList",surplusList);
			CommomUtil.writeResultBack(request, response, gson.toJson(dataResult));
		}
	
		/**
		 * 盘点增加入库单
		 * 
		 */
		@RequestMapping(value = "/add_stockin", method = { RequestMethod.POST,
				RequestMethod.GET })
		public void add_goodstockin(
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
			String method = "masget.enterprise.com.warehousein.insert";
			String result = CommomUtil.CallApi(request, serviceName, method, data);
			CommomUtil.writeResultBack(request, response, result);
		}
		
		/**
		 * 盘点增加出库单
		 * 
		 */
		@RequestMapping(value = "/add_stockout", method = { RequestMethod.POST,
				RequestMethod.GET })
		public void add_goodstockout(
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
			String method = "masget.enterprise.com.warehouseout.insert";
			String result = CommomUtil.CallApi(request, serviceName, method, data);
			CommomUtil.writeResultBack(request, response, result);
		}
		
		
}
