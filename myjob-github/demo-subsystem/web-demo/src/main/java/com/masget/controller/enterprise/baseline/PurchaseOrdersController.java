package com.masget.controller.enterprise.baseline;

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
import com.masget.util.CommomUtil;
import com.masget.utils.MgException;
/**
 * 采购单控制器
 * @author ChenJinxing
 * @since 2015-8-26
 */
@Controller
@RequestMapping("/enterprise/purchaseorders")
public class PurchaseOrdersController {
	private static Logger logger = Logger.getLogger(PurchaseOrdersController.class);
	
	private Map<String,Object> dataMap = null;
	private List<String> ordersList = null;
	private String params = null;

	/**
	 * 生成采购单
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/addPurchaseorders", method = { RequestMethod.POST,RequestMethod.GET })
	public void addPurchaseorders(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.baseline.purchaseorders.add";
        
        String TAG = "/masgetweb/enterprise/purchaseorders/addPurchaseorders.do";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":新增采购单时发生异常:" + dataMap.toString(), e); 
			new MgException(20993,"新增采购单发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 查询公司内部采购单
	 * @param pagesize 页记录数
	 * @param pagenum 页码
	 * @param supplierid 供应商id
	 * @param purchaseordernum 订单号
	 * @param orderstate 订单状态
	 * @param paystate 支付状态
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getInternalPurchaseorders")
	public void getInternalPurchaseorders(
			@RequestParam(value="pagesize",required=true) String pagesize,
			@RequestParam(value="pagenum",required=true) String pagenum,	
			@RequestParam(value="supplierid",required=false) String supplierid,
			@RequestParam(value="purchaseordernum",required=false) String purchaseordernum,
			@RequestParam(value="orderstate",required=false) String orderstate,
			@RequestParam(value="paystate",required=false) String paystate,
			HttpServletRequest request,HttpServletResponse response)throws Exception{
		dataMap = new HashMap<String, Object>();
		if(pagesize != null && !"".equals(pagesize)){
			dataMap.put("pagesize", Integer.parseInt(pagesize));
		}
		if(pagenum != null && !"".equals(pagenum)){
			dataMap.put("pagenum", Integer.parseInt(pagenum));
		}
		if(supplierid != null && !"".equals(supplierid)){
			dataMap.put("supplierid", Long.parseLong(supplierid));
		}
		if(purchaseordernum != null && !"".equals(purchaseordernum)){
			dataMap.put("purchaseordernum", purchaseordernum);
		}
		if(orderstate != null && !"".equals(orderstate)){
			dataMap.put("orderstate", Integer.parseInt(orderstate));
		}
		if(paystate != null && !"".equals(paystate)){
			dataMap.put("paystate", Integer.parseInt(paystate));
		}
		params = new Gson().toJson(dataMap);
		String TAG = "/masgetweb/enterprise/purchaseorders/getInternalPurchaseorders";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.purchaseorders.internal.get",params);
		}catch(Exception e){
			logger.info(TAG+ ":查询内部采购单异常:" + dataMap.toString(), e); 
			new MgException(20095,"查询内部采购单异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 修改公司内部采购单
	 * @param data 
	 * @param request
	 * @param response
	 */	
	@RequestMapping("/modifyPurchaseOrders")
	public void modifyPurchaseOrders(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request,HttpServletResponse response)throws Exception{
		
		params = new Gson().toJson(data);
		params = params.replace("\\", "").replace("\"[", "[").replace("]\"", "]").replace("\"{", "{").replace("}\"", "}");
		String TAG = "/masgetweb/enterprise/purchaseorders/getInternalPurchaseorders";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.purchaseorders.modify",params);
		}catch(Exception e){
			logger.info(TAG+ ":修改采购单异常:" + params.toString(), e); 
			new MgException(20140,"修改采购单发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 审核公司内部采购单
	 * @param purchaseordernum
	 * @param purchaseorderid
	 * @param orderstate 
	 * @param request
	 * @param response
	 */	
	@RequestMapping("/auditInternalPurchaseorders")	
	public void auditInternalPurchaseorders(
			@RequestParam(value="purchaseordernum",required=true) String purchaseordernum,
			@RequestParam(value="purchaseorderid",required=true) String purchaseorderid,
			@RequestParam(value="orderstate",required=true) String orderstate,
			HttpServletRequest request,HttpServletResponse response)throws Exception{
		dataMap = new HashMap<String, Object>();
		dataMap.put("purchaseordernum",purchaseordernum);
		dataMap.put("purchaseorderid",Long.parseLong(purchaseorderid));
		dataMap.put("orderstate",Integer.parseInt(orderstate));
		params = new Gson().toJson(dataMap);
		String TAG = "/masgetweb/enterprise/purchaseorders/auditInternalPurchaseorders";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.purchaseorders.internal.audit",params);
		}catch(Exception e){
			logger.info(TAG+ ":更新采购单审核状态时发生异常,审核失败:" + dataMap.toString(), e); 
			new MgException(20102,"更新采购单审核状态时发生异常,审核失败",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 取消公司内部采购单
	 * @param purchaseordernum
	 * @param purchaseorderid
	 * @param request
	 * @param response
	 */	
	@RequestMapping("/cancelPurchaseorders")	
	public void cancelPurchaseorders(
			@RequestParam(value="purchaseordernum",required=true) String purchaseordernum,
			@RequestParam(value="purchaseorderid",required=true) String purchaseorderid,
			HttpServletRequest request,HttpServletResponse response)throws Exception{
		dataMap = new HashMap<String, Object>();
		dataMap.put("purchaseordernum",purchaseordernum);
		dataMap.put("purchaseorderid",Long.parseLong(purchaseorderid));
		params = new Gson().toJson(dataMap);
		String TAG = "/masgetweb/enterprise/purchaseorders/auditInternalPurchaseorders";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.purchaseorders.cancel",params);
		}catch(Exception e){
			logger.info(TAG + ":取消采购单时发生异常" + dataMap.toString(), e); 
			new MgException(20168, "取消采购单时发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 供应商查询采购订单
	 * @param purchaseordernum
	 * @param purchaseorderid
	 * @param request
	 * @param response
	 */	
	@RequestMapping("/getExternalPurchaseorders")	
	public void getExternalPurchaseorders(
			@RequestParam(value="purchaseordernum",required=false) String purchaseordernum,
			@RequestParam(value="enterpriseid",required=false) String enterpriseid,
			@RequestParam(value="pagesize",required=true) String pagesize,
			@RequestParam(value="pagenum",required=true) String pagenum,
			HttpServletRequest request,HttpServletResponse response)throws Exception{
		dataMap = new HashMap<String, Object>();
		dataMap.put("purchaseordernum",purchaseordernum);
		if(pagesize != null && !"".equals(pagesize)){
			dataMap.put("pagesize", Integer.parseInt(pagesize));
		}
		if(pagenum != null && !"".equals(pagenum)){
			dataMap.put("pagenum", Integer.parseInt(pagenum));
		}
		if(purchaseordernum != null && !"".equals(purchaseordernum)){
			dataMap.put("purchaseordernum", purchaseordernum);
		}
		if(enterpriseid != null && !"".equals(enterpriseid)){
			dataMap.put("enterpriseid", Long.parseLong(enterpriseid));
		}		
		params = new Gson().toJson(dataMap);
		String TAG = "/masgetweb/enterprise/purchaseorders/auditInternalPurchaseorders";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.purchaseorders.external.get",params);
		}catch(Exception e){
			logger.info(TAG + ":取消采购单时发生异常" + dataMap.toString(), e); 
			new MgException(20168, "取消采购单时发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 供应商审核采购单
	 * @param purchaseordernum
	 * @param purchaseorderid
	 * @param enterpriseid
	 * @param orderstate 
	 * @param request
	 * @param response
	 */	
	@RequestMapping("/auditExternalPurchaseorders")	
	public void auditExternalPurchaseorders(
			@RequestParam(value="purchaseordernum",required=true) String purchaseordernum,
			@RequestParam(value="purchaseorderid",required=true) String purchaseorderid,
			@RequestParam(value="enterpriseid",required=true) String enterpriseid,
			@RequestParam(value="auditremark",required=false) String auditremark,
			@RequestParam(value="orderstate",required=true) String orderstate,
			@RequestParam(value="purchaseorderlist",required=false) String purchaseorderlist,
			HttpServletRequest request,HttpServletResponse response)throws Exception{
		dataMap = new HashMap<String, Object>();
		dataMap.put("purchaseordernum",purchaseordernum);
		dataMap.put("purchaseorderid",Long.parseLong(purchaseorderid));
		dataMap.put("enterpriseid",Long.parseLong(enterpriseid));
		if(auditremark != null && !"".equals(auditremark.toString())){
			dataMap.put("auditremark" , auditremark.toString());
		}
		dataMap.put("orderstate",Integer.parseInt(orderstate));
		dataMap.put("purchaseorderlist", purchaseorderlist);
		params = new Gson().toJson(dataMap);
		params = params.replace("\\", "").replace("\"[", "[").replace("]\"", "]").replace("\"{", "{").replace("}\"", "}");
		String TAG = "/masgetweb/enterprise/purchaseorders/auditExternalPurchaseorders";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.purchaseorders.external.audit",params);
		}catch(Exception e){
			logger.info(TAG+ ":供应商审核采购单时发生异常,审核失败:" + dataMap.toString(), e); 
			new MgException(20174,"供应商审核采购单时发生异常,审核失败",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 供应商受理采购单
	 * @param purchaseordernum
	 * @param purchaseorderid
	 * @param enterpriseid
	 * @param warehouseid 供应商站点 
	 * @param request
	 * @param response
	 * @since 2015-9-15
	 */	
	@RequestMapping("/acceptExternalPurchaseorders")	
	public void acceptExternalPurchaseorders(
			@RequestParam(value="purchaseordernum",required = true) String purchaseordernum,
			@RequestParam(value="purchaseorderid",required = true) String purchaseorderid,
			@RequestParam(value="enterpriseid",required = true) String enterpriseid,
			@RequestParam(value="warehouseid",required = true) String warehouseid,
			HttpServletRequest request,HttpServletResponse response)throws Exception{
		dataMap = new HashMap<String, Object>();
		dataMap.put("purchaseordernum",purchaseordernum);
		dataMap.put("purchaseorderid",purchaseorderid);
		dataMap.put("enterpriseid",enterpriseid);
		dataMap.put("warehouseid",warehouseid);
		params = new Gson().toJson(dataMap);
		String TAG = "/masgetweb/enterprise/purchaseorders/auditExternalPurchaseorders";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.purchaseorders.external.accept",params);
		}catch(Exception e){
			logger.info(TAG+ ":供应商受理采购单时发生异常,受理失败:" + dataMap.toString(), e); 
			new MgException(20215,"供应商受理采购单时发生异常,受理失败",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
}
