package com.masget.controller.enterprise.baseline;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
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
@RequestMapping("baseline/orders")
public class OrdersBaselineController {
	private static Logger logger = Logger.getLogger(OrdersBaselineController.class);
	private Map<String,Object> dataMap = null;
	private String params = null;	
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
	@RequestMapping(value="/get_orders",method ={RequestMethod.POST,RequestMethod.GET})
	public void get_orders(
			@RequestParam(value = "ordernum", required = false) String  ordernum,
			@RequestParam(value = "buyerid", required = false) String  buyerid,
			@RequestParam(value = "buyername", required = false) String  buyername,
			@RequestParam(value = "orderstate", required = false) Integer  orderstate,
			@RequestParam(value = "paystate", required = false) Integer  paystate,
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			@RequestParam(value = "orders", required = false) String orders,
			
			@RequestParam(value = "begincreatedtime", required = false) String begincreatedtime,
			@RequestParam(value = "endcreatedtime", required = false) String endcreatedtime,
			HttpServletRequest request, HttpServletResponse response) {
		
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		
		/*JSONObject jsonObject = JSONObject.fromObject(login_data);

		String logisticid = jsonObject.get("companyid").toString();*/
		Map<String, Object> dataMap = new HashMap<String, Object>();
		/*dataMap.put("companyid", logisticid);*/
		
		if (ordernum != null && !ordernum.equals("")) {
			dataMap.put("ordernum", ordernum);
		}
		if(buyername != null && !buyername.equals("")){
			dataMap.put("buyername", buyername);
		}
		if(buyerid != null && !buyerid.equals("")){
			dataMap.put("buyerid", buyerid);
		}

		if (orderstate != null && !orderstate.equals("")) {
			dataMap.put("orderstate", orderstate);
		}
		
		if (paystate != null && !paystate.equals("")) {
			dataMap.put("paystate", paystate);
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
		
		if (begincreatedtime != null && begincreatedtime != null) {
			dataMap.put("begincreatedtime", begincreatedtime);
		}
		if (endcreatedtime != null && endcreatedtime != null) {
			dataMap.put("endcreatedtime", endcreatedtime);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "enterpriseService";
		String method = "masget.enterprise.baseline.orders.get";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 添加销售单
	 */
	@RequestMapping(value = "/add_orders", method = { RequestMethod.POST,
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
		String method = "masget.enterprise.baseline.orders.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 修改销售单
	 */
	@RequestMapping(value = "/modify_orders", method = { RequestMethod.POST,
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
		String method = "masget.enterprise.baseline.orders.orderlist.update";
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

		String method = "masget.enterprise.baseline.orders.delete";
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
		String orderstate = request.getParameter("orderstate");
		String buyerid = request.getParameter("buyerid");
		
		JSONObject obj = new JSONObject();
		obj.put("orderid", orderid);
		obj.put("ordernum", ordernum);
		obj.put("orderstate", orderstate);
		obj.put("buyerid", buyerid);
		
		String data = obj.toString();

		String method = "masget.enterprise.baseline.orders.audit";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 根据商品分类级联查询商品
	 */
	@RequestMapping(value = "/getgoods_by_classify", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void getgoods_by_classify(
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
		String method = "masget.enterprise.baseline.goods.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
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
		
		CommomUtil.exportPdf("/WEB-INF/reports/orders.jasper",data,subReportMap,request,response);
	}
	
	/**
	 * 导出
	 * @throws UnsupportedEncodingException 
	 */
	@RequestMapping("/export")
	public void export(
			//@RequestParam(value="data",required=false) String data,
			@RequestParam(value="ordernum",required=false) String ordernum,
			HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException {
		List<String> headList = new ArrayList<String>();
		List<String> keyList = new ArrayList<String>();
		
		HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
		
		JSONObject obj = new JSONObject();
		obj.put("ordernum", ordernum);
		obj.put("pagesize", 10);
		obj.put("pagenum", 1);
		String method = "masget.enterprise.baseline.orders.get";

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
		
		
		List<Map<String,Object>> orderList = (List<Map<String,Object>>)dataMap.get(0).get("orderlist");
		
		Map<String,Object> orderaddress = (Map<String,Object>)dataMap.get(0).get("orderaddress");
		
		int i =1;
		for (Map<String, Object> map : orderList) {
			map.put("seqid", i);
			i++;
		}
		
		Integer sum = orderList.size();
		
		String ordernum2 = (String)dataMap.get(0).get("ordernum");
		String createdtime = (String)dataMap.get(0).get("createdtime");
		
		String buyercompanyname = (String)dataMap.get(0).get("buyername");
		
		String buyername = (String)orderaddress.get("contactname");
		String buyerphone = (String)orderaddress.get("mobile");
		String buyeraddress = (String)orderaddress.get("provincename")+(String)orderaddress.get("cityname")+(String)orderaddress.get("areaname")+(String)orderaddress.get("address");
		
		String totgoodsmoney = "" + dataMap.get(0).get("totgoodsmoney");
		String totgoodsqty = "" + dataMap.get(0).get("totgoodsqty");
		
		
		keyList.add("seqid");
		keyList.add("goodsname");
		keyList.add("goodsunitname");
		keyList.add("dealingprice");
		keyList.add("discountrate");
		keyList.add("goodsqty");
		keyList.add("totalmoney");
		
		String fileName = System.currentTimeMillis() + ".xls";
		String path = FileUpload
				.getFilePath(FileUpload.emFileType.GOODS_EXPORT);
		File filePath = new File(path);
		if (!filePath.exists())
			filePath.mkdir();
		try {
			ExcelUtil.writeDataToExcelOrders(orderList,sum, headList, keyList, path
					+ fileName,ordernum2,createdtime,buyername,buyerphone,buyeraddress,buyercompanyname,totgoodsqty,totgoodsmoney, "销售单导出");
		} catch (Exception e) {
			e.printStackTrace();
		}
		boolean writeFileFlag = FileUtil.writeFileToClient(response, fileName, path);

	}
	
	
	/**
	 * 根据销售单号精确查询销售单
	 * @param ordernum
	 * @param request
	 * @param response
	 * @author chenjinxing 2015-9-28
	 */
	@RequestMapping("/getRefinedOrders")
	public void getRefinedOrders(
			@RequestParam(value="ordernum",required=false) String ordernum,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		dataMap = new HashMap<String, Object>();
		if(ordernum!=null && !"".equals(ordernum.trim())){
			dataMap.put("ordernum",ordernum);
		}
		params = new Gson().toJson(dataMap);
		String TAG = "/masgetweb/baseline/orders/getRefinedOrders";
		String result = "";
		String method = "masget.enterprise.baseline.orders.refined.get";
		String service = CommomUtil.ENTERPRISE_SERVICE;
		try{
			result = CommomUtil.CallApi(request,service,method,params);
		}catch(Exception e){
			logger.info(TAG+ ":根据销售单号精确查询销售单发生异常:" + dataMap.toString(), e); 
			new MgException(20183,"根据销售单号精确查询销售单发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 根据销售单号精确查询销售单
	 * @param ordernum
	 * @param request
	 * @param response
	 * @author chenjinxing 2015-9-29
	 */
	@RequestMapping("/auditOrders")
	public void auditOrders(
			@RequestParam(value="orderid",required=true) String orderid,
			@RequestParam(value="ordernum",required=true) String ordernum,
			@RequestParam(value="orderstate",required=true) String orderstate,
			@RequestParam(value="buyerid",required=true) String buyerid,
			@RequestParam(value="remark",required=false) String remark,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		dataMap = new HashMap<String, Object>();
		dataMap.put("orderid",orderid);
		dataMap.put("buyerid", buyerid);
		dataMap.put("ordernum",ordernum);
		dataMap.put("orderstate",orderstate);
		dataMap.put("remark",remark);
		params = new Gson().toJson(dataMap);
		String TAG = "/masgetweb/baseline/orders/auditOrders";
		String result = "";
		String method = "masget.enterprise.baseline.orders.audit";
		String service = CommomUtil.ENTERPRISE_SERVICE;
		try{
			result = CommomUtil.CallApi(request,service,method,params);
		}catch(Exception e){
			logger.info(TAG+ ":审核销售单发生异常:" + dataMap.toString(), e); 
			new MgException(20199,"审核销售单发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	
	/**
	 * 日志的查询
	 */
	@RequestMapping(value="/getOrdertracking",method ={RequestMethod.POST,RequestMethod.GET})
	public void getOrdertracking(
			@RequestParam(value="relationnum",required=false) String relationnum,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		dataMap = new HashMap<String, Object>();
		if(relationnum!=null && !"".equals(relationnum.trim())){
			dataMap.put("relationnum",relationnum);
		}
		params = new Gson().toJson(dataMap);
		String TAG = "/masgetweb/baseline/orders/getOrdertracking";
		String result = "";
		String method = "masget.base.com.ordertracking.get";
		String service = CommomUtil.BASE_SERVICE;
		try{
			result = CommomUtil.CallApi(request,service,method,params);
		}catch(Exception e){
			logger.info(TAG+ ":根据销售单号精确查询日志发生异常:" + dataMap.toString(), e); 
			new MgException(20183,"根据销售单号精确查询日志发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 现金支付
	 */
	@RequestMapping(value="/cash",method ={RequestMethod.POST,RequestMethod.GET})
	public void cash(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		String serviceName = "enterpriseService";
		String method = "masget.enterprise.baseline.orders.cash.pay";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 财务审核售货单
	 */
	@RequestMapping(value="/auditFinancial",method ={RequestMethod.POST,RequestMethod.GET})
	public void auditFinancial(HttpServletRequest request, HttpServletResponse response) {
		
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String orderid = request.getParameter("orderid");
		String ordernum = request.getParameter("ordernum");
		String orderstate = request.getParameter("orderstate");
		String buyerid = request.getParameter("buyerid");
		
		JSONObject obj = new JSONObject();
		obj.put("orderid", orderid);
		obj.put("ordernum", ordernum);
		obj.put("orderstate", orderstate);
		obj.put("buyerid", buyerid);
		
		String data = obj.toString();

		String method = "masget.enterprise.baseline.orders.financial.audit";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 出库审核售货单
	 */
	@RequestMapping(value="/auditWarehouseout",method ={RequestMethod.POST,RequestMethod.GET})
	public void auditWarehouseout(HttpServletRequest request, HttpServletResponse response) {
		
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String orderid = request.getParameter("orderid");
		String ordernum = request.getParameter("ordernum");
		String orderstate = request.getParameter("orderstate");
		String buyerid = request.getParameter("buyerid");
		
		JSONObject obj = new JSONObject();
		obj.put("orderid", orderid);
		obj.put("ordernum", ordernum);
		obj.put("orderstate", orderstate);
		obj.put("buyerid", buyerid);
		
		String data = obj.toString();

		String method = "masget.enterprise.baseline.orders.warehouseout.audit";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 查询销售单待出库商品明细
	 */
	@RequestMapping(value="/getWarehouseout",method ={RequestMethod.POST,RequestMethod.GET})
	public void getWarehouseout(HttpServletRequest request, HttpServletResponse response) {
		
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

		String method = "masget.enterprise.baseline.orders.warehouseout.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 出库审核销售单
	 */
	@RequestMapping(value = "/audit_warehouseout", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void audit_warehouseout(
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
		String method = "masget.enterprise.baseline.orders.warehouseout.audit";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * c查询订单支付流水
	 */
	@RequestMapping(value = "/get_paymentflow", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void get_paymentflow(
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		String orderid = request.getParameter("orderid");
		
		JSONObject obj = new JSONObject();
		obj.put("orderid", orderid);
		obj.put("pagesize", 20);
		obj.put("pagenum", 1);
		
		String data = obj.toString();

		String method = "masget.enterprise.pay.orderpaymentflow.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 更新销售单收货地址
	 */
	@RequestMapping(value = "/update_orderaddress", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void update_orderaddress(
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
		String method = "masget.enterprise.baseline.orders.orderaddress.update";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
}
