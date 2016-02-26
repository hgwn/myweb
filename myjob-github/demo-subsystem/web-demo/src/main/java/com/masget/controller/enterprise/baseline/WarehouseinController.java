package com.masget.controller.enterprise.baseline;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.masget.util.CommomUtil;
import com.masget.utils.MgException;

@Controller
@RequestMapping("/enterprise/baseline/warehousein")
public class WarehouseinController {
	private static Logger logger = Logger.getLogger(WarehouseinController.class);
	/**
	 * 查询出库记录
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/get", method = { RequestMethod.POST, RequestMethod.GET })
	public void get(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.baseline.warehousein.get";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			throw new MgException(20095, "查询出库单异常", e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 查询入库商品序列号
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getGgoodsStockSerial", method = { RequestMethod.POST, RequestMethod.GET })
	public void getGgoodsStockSerial(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.baseline.goodsstockserial.get";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			throw new MgException(20095, "查询出库单异常", e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 新增入库单
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/addWarehousein", method = { RequestMethod.POST, RequestMethod.GET })
	public void addWarehousein(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.baseline.warehousein.add";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			throw new MgException(20095, "新增出入单异常", e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 审核入库单
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/auditWarehousein", method = { RequestMethod.POST, RequestMethod.GET })
	public void auditWarehousein(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.baseline.warehousein.audit";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			throw new MgException(20095, "审核入库单异常", e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 反审核入库单
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/auditReverseWarehousein", method = { RequestMethod.POST, RequestMethod.GET })
	public void auditReverseWarehousein(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.baseline.warehousein.reverse.audit";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			throw new MgException(20095, "审核入库单异常", e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 经销商查询采购明细商品库存配置
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getWarehouseinOrders", method = { RequestMethod.POST, RequestMethod.GET })
	public void getWarehouseinOrders(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.headquarters.orders.warehousein.get";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			throw new MgException(20095, "查询明细商品库存配置异常", e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 经销商采购入库
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/auditWarehouseinOrders", method = { RequestMethod.POST, RequestMethod.GET })
	public void auditWarehouseinOrders(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.headquarters.orders.warehousein.audit";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			throw new MgException(20095, "经销商采购入库失败", e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}	
}
