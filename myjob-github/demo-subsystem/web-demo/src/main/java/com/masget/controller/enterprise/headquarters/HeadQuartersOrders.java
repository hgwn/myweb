package com.masget.controller.enterprise.headquarters;

import java.net.URLDecoder;
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
 * 订货单控制器
 * @author ChenJinxing
 * @since 2015-9-21
 */
@Controller
@RequestMapping("/enterprise/headquartersorders")
public class HeadQuartersOrders {
	private static Logger logger = Logger.getLogger(HeadQuartersOrders.class);
	
	private Map<String,Object> dataMap = null;
	private List<String> ordersList = null;
	private String params = null;
	
	/**
	 * 经销商添加采购单
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/addHeadQuartersOrders", method = { RequestMethod.POST,RequestMethod.GET })
	public void addHeadQuartersOrders(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.headquarters.orders.external.add";
        
        String TAG = "/masgetweb/enterprise/headquartersorders/addHeadQuartersOrders";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":新增订货单时发生异常:" + dataMap.toString(), e); 
			new MgException(20018,"新增订货单发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 经销商查询采购单
	 * @param data 
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getExternalHeadQuartersOrders")
	public void getExternalHeadQuartersOrders(
			@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request,HttpServletResponse response)throws Exception{
		/*dataMap = new HashMap<String, Object>();
		if(pagesize != null && !"".equals(pagesize)){
			dataMap.put("pagesize", Integer.parseInt(pagesize));
		}
		if(pagenum != null && !"".equals(pagenum)){
			dataMap.put("pagenum", Integer.parseInt(pagenum));
		}
		if(supplierid != null && !"".equals(supplierid)){
			dataMap.put("supplierid", Long.parseLong(supplierid));
		}
		if(supplierstationid != null && !"".equals(supplierstationid)){
			dataMap.put("supplierstationid", Long.parseLong(supplierstationid));
		}
		if(ordernum != null && !"".equals(ordernum)){
			dataMap.put("ordernum", ordernum);
		}
		if(ordertype != null && !"".equals(ordertype)){
			dataMap.put("ordertype", Integer.parseInt(ordertype));
		}
		if(orderstate != null && !"".equals(orderstate)){
			dataMap.put("orderstate", Integer.parseInt(orderstate));
		}
		if(paystate != null && !"".equals(paystate)){
			dataMap.put("paystate", Integer.parseInt(paystate));
		}
		params = new Gson().toJson(dataMap);*/
		
		JSONObject obj = JSONObject.fromObject(data);
		String TAG = "/masgetweb/enterprise/purchaseorders/getExternalHeadQuartersOrders";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.headquarters.orders.external.get",obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":经销商查询采购单异常:" + dataMap.toString(), e); 
			new MgException(20269,"经销商查询采购单异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 更新订单状态
	 * @param orderid 
	 * @param ordernum
	 * @param paystate
	 * @param remark
	 * @param request
	 * @param response
	 */
	@RequestMapping("/paidOrders")
	public void paidOrders(
			@RequestParam(value="orderid",required=true) String orderid,
			@RequestParam(value="ordernum",required=true) String ordernum,
			@RequestParam(value="paystate",required=true) String paystate,
			@RequestParam(value="remark",required=false) String remark,
			HttpServletRequest request,HttpServletResponse response)throws Exception{
		
		dataMap = new HashMap<String, Object>();
		dataMap.put("orderid", Long.parseLong(orderid));
		dataMap.put("ordernum", String.valueOf(ordernum.trim()));
		dataMap.put("paystate", Integer.parseInt(paystate));
		if(remark != null && !"".equals(remark)){
			dataMap.put("remark", Integer.parseInt(remark));
		}
		params = new Gson().toJson(dataMap);
		String TAG = "/masgetweb/enterprise/headquartersorders/paidOrders";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.orders.paid",params);
		}catch(Exception e){
			logger.info(TAG+ ":订单支付异常:" + dataMap.toString(), e); 
			new MgException(20276,"订单支付异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 修改销售单
	 */
	@RequestMapping(value = "/modifyExternalOrders", method = { RequestMethod.POST,RequestMethod.GET })
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
		String method = "masget.enterprise.headquarters.orders.external.modify";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 打印
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/reportOrders", method = {RequestMethod.POST,RequestMethod.GET})
	public void reportOrders(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request,HttpServletResponse response) throws Exception{
		
		data=URLDecoder.decode(data, "UTF-8");

		Map<String, String> subReportMap = new HashMap<String, String>();
		subReportMap.put("goodsDataSource", "orderlist");
		
		CommomUtil.exportPdf("/WEB-INF/reports/purchaseorders.jasper",data,subReportMap,request,response);
	}
}
