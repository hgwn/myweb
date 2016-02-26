package com.masget.controller.enterprise;

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
import com.masget.util.CommomUtil;

@Controller
@RequestMapping("enterprise/orders")
public class OrdersController {
//masget.base.com.contractorinfo.add
	@RequestMapping(value="/list",method={RequestMethod.POST,RequestMethod.GET})
	public void list(
			@RequestParam(value="pageSize",required=true) Integer pagesize,
			@RequestParam(value="pageNum",required=true) Integer pagenum,
			@RequestParam(value="goodsname",required=false) String goodsname,
			@RequestParam(value="barcode",required=false) String barcode,
			
			HttpServletRequest request,HttpServletResponse response){
	}
	
	
	/**
	 * 查询销售订单
	 * @param warehouseid 仓库（站点）id
	 * @param ordernum
	 * @param orderstate
	 * @param begincreatedtime
	 * @param endcreatedtime
	 * @param pagesize
	 * @param pagenum
	 * @param orderkey
	 * @param orders
	 * @param request
	 * @param response
	 */
	@RequestMapping(value="/getsupplier_orders",method ={RequestMethod.POST,RequestMethod.GET})
	public void getsupplier_orders(
			@RequestParam(value = "warehouseid", required = false) String  warehouseid,
			@RequestParam(value = "ordernum", required = false) String  ordernum,
			@RequestParam(value = "buyerid", required = false) String  buyerid,
			@RequestParam(value = "orderstate", required = false) Integer  orderstate,
			@RequestParam(value = "begincreatedtime", required = false) String  begincreatedtime,
			@RequestParam(value = "endcreatedtime", required = false) String  endcreatedtime,	
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			@RequestParam(value = "orders", required = false) String orders,
			@RequestParam(value = "datatype", required = false) Integer  datatype,
			HttpServletRequest request, HttpServletResponse response) {
		
		String login_data = (String) request.getSession().getAttribute("user_login_data");
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
			dataMap.put("supplierstationid", Long.valueOf(warehouseid));
		}
		if (ordernum != null && !ordernum.equals("")) {
			dataMap.put("ordernum", ordernum);
		}
		if(buyerid != null && !buyerid.equals("")){
			dataMap.put("buyerid", buyerid);
		}

		if (orderstate != null && !orderstate.equals("")) {
			dataMap.put("orderstate", orderstate);
		}
		if (datatype != null && !datatype.equals("")) {
			dataMap.put("datatype", datatype);
		}
		if (begincreatedtime != null && !begincreatedtime.equals("") &&endcreatedtime != null&&!endcreatedtime.equals("") ) {
			dataMap.put("begincreatedtime", begincreatedtime);
			dataMap.put("endcreatedtime", endcreatedtime);
		}
		
		if (orders != null && orderkey != null) {
			List<String> orderslist = new ArrayList<String>();
			orderslist.add(orders);
			dataMap.put("orders", orderslist);
			dataMap.put("orderkey", orderkey);
		}

		if (pagesize != null && pagenum != null) {
			dataMap.put("pagesize", pagesize);
			dataMap.put("pagenum", pagenum);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.com.orders.getsupplier";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 查询采购订单
	 * @param ordernum
	 * @param orderstate
	 * @param begincreatedtime
	 * @param endcreatedtime
	 * @param pagesize
	 * @param pagenum
	 * @param orderkey
	 * @param orders
	 * @param request
	 * @param response
	 */
	@RequestMapping(value="/getbuyer_orders",method ={RequestMethod.POST,RequestMethod.GET})
	public void getbuyer_orders(
			@RequestParam(value = "ordernum", required = false) String  ordernum,
			@RequestParam(value = "orderstate", required = false) Integer  orderstate,
			@RequestParam(value = "begincreatedtime", required = false) String  begincreatedtime,
			@RequestParam(value = "endcreatedtime", required = false) String  endcreatedtime,	
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			@RequestParam(value = "orders", required = false) String orders,
			HttpServletRequest request, HttpServletResponse response) {
		
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		
		JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);

		if (ordernum != null && !ordernum.equals("")) {
			dataMap.put("ordernum", ordernum);
		}

		if (orderstate != null && !orderstate.equals("")) {
			dataMap.put("orderstate", orderstate);
		}
		
		if (begincreatedtime != null &&endcreatedtime != null ) {
			dataMap.put("begincreatedtime", begincreatedtime);
			dataMap.put("endcreatedtime", endcreatedtime);
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
		String method = "masget.enterprise.com.orders.getbuyer";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 取消售货单
	 */
	@RequestMapping(value="/cancel",method ={RequestMethod.POST,RequestMethod.GET})
	public void cancel(HttpServletRequest request, HttpServletResponse response) {
		
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String orderid = request.getParameter("orderid");
		String ordernum = request.getParameter("ordernum");
		JSONObject obj = new JSONObject();
		obj.put("orderid", orderid);
		obj.put("ordernum", ordernum);
		String data = obj.toString();

		String method = "masget.enterprise.com.orders.cancel";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 审核售货单
	 */
	@RequestMapping(value="/audit",method ={RequestMethod.POST,RequestMethod.GET})
	public void audit(HttpServletRequest request, HttpServletResponse response) {
		
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String orderid = request.getParameter("orderid");
		String ordernum = request.getParameter("ordernum");
		JSONObject obj = new JSONObject();
		obj.put("orderid", orderid);
		obj.put("ordernum", ordernum);
		String data = obj.toString();

		String method = "masget.enterprise.com.orders.audit";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 结束售货单
	 */
	@RequestMapping(value="/ended",method ={RequestMethod.POST,RequestMethod.GET})
	public void ended(HttpServletRequest request, HttpServletResponse response) {
		
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String orderid = request.getParameter("orderid");
		String ordernum = request.getParameter("ordernum");
		JSONObject obj = new JSONObject();
		obj.put("orderid", orderid);
		obj.put("ordernum", ordernum);
		String data = obj.toString();

		String method = "masget.enterprise.com.orders.ended";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
}
