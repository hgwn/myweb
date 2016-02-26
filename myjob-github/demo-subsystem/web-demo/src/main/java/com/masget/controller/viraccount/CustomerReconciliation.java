package com.masget.controller.viraccount;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.controller.base.BaseImpl;
import com.masget.util.CommomUtil;

/**
 * 运单信息Controller
 * @author lgn
 *
 */
@Controller
@RequestMapping("/viraccount/reconciliation")
public class CustomerReconciliation {
	/**
	 * @param request 请求对象
	 * @return
	 */
	@RequestMapping(method = RequestMethod.GET)
	public String show(HttpServletRequest request){	
		String path = request.getContextPath();
		String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
		System.out.println(basePath);
		request.getSession().setAttribute("ctx", basePath);
		return "viraccount/customer_reconciliation";
	}
	
	
	@RequestMapping("/con_list")
	public String showAddPage(HttpServletRequest request, HttpServletResponse response) {
		
		new BaseImpl().login1(request, response);
		
		String path = request.getContextPath();
		String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
		request.getSession().setAttribute("ctx", basePath);

		return "logistic/tr_consignnote/consignnote_list";
	}
	
	/**
	 * 根据条件  查询对账单数据源汇总
	 * @param consignnotenum 合同编号
	 * @param rcompanyname 邮路名称
	 * @param screatedtime 有效开始时间
	 * @param ecreatetime 有效结束时间
	 * @param reconstate 对账状态
	 * @param pagesize 每一页的条目数
	 * @param pagenum 当前的页码
	 */
	@RequestMapping("/checkList")
	public void checkList(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		HttpSession httpSession = request.getSession(false);
		if(httpSession == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession.getAttribute("user_login_data");
		JSONObject jsonObject=JSONObject.fromObject(login_data);
		String logisticid=jsonObject.get("companyid").toString();
		String stationid=jsonObject.get("stationid").toString();
		
		JSONObject obj = JSONObject.fromObject(data);
		obj.put("logisticid", logisticid);
		obj.put("stationid", stationid);
	
		String serviceName="logisticsService";
		
		String method="masget.logistic.transport.tr_consignnote.get";
		
        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(obj.toString());
		
		System.out.println(result);
	}
	
	/**
	 * 根据条件  运单明细查询信息
	 */
	@RequestMapping("/getdetail")
	public void getdetail(
			@RequestParam(value="consignnoteid",required=true) String consignnoteid,
			@RequestParam(value="consignnotedetailid",required=false) String consignnotedetailid,
			HttpServletRequest request, HttpServletResponse response)
	{
		HttpSession httpSession = request.getSession(false);
		if(httpSession == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession.getAttribute("user_login_data");
		JSONObject jsonObject=JSONObject.fromObject(login_data);
		String logisticid=jsonObject.get("companyid").toString();
		String stationid=jsonObject.get("stationid").toString();
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("logisticid", logisticid);
		dataMap.put("stationid", stationid);
		dataMap.put("consignnoteid", consignnoteid);
		dataMap.put("consignnotedetailid", consignnotedetailid);
		
		String data=new Gson().toJson(dataMap);
		
		String serviceName="logisticsService";
		
		String method="masget.logistic.transport.tr_consignnote.getdetail";
		
        String result = CommomUtil.CallApi(request, serviceName, method, data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(data);
		
		System.out.println(result);
	}
//	
//	/**
//	 * 根据条件  运单回单查询信息
//	 */
//	@RequestMapping("/getpics")
//	public void getpics(
//			@RequestParam(value="consignnoteid",required=false) String consignnoteid,
//			@RequestParam(value="consignnotedetailid",required=false) String consignnotedetailid,
//			@RequestParam(value="consignnotepicsid",required=false) String consignnotepicsid,
//			HttpServletRequest request, HttpServletResponse response)
//	{
//		
//		Map<String, Object> dataMap=new HashMap<String, Object>();
//		dataMap.put("consignnoteid", consignnoteid);
//		dataMap.put("consignnotedetailid", consignnotedetailid);
//		dataMap.put("consignnotedetailid", consignnotedetailid);
//		
//		String data=new Gson().toJson(dataMap);
//		
//		String serviceName="logisticsService";
//		
//		String method="masget.logistic.transport.tr_consignnote.getpics";
//		
//        String result = CommomUtil.CallApi(request, serviceName, method, data);
//		
//		CommomUtil.writeResultBack(request, response, result);
//		
//		System.out.println(data);
//		
//		System.out.println(result);
//	}
	
	/**
	 * 新增运单
	 * @param logisticid 开单者公司
	 * @param stationid 开单者公司站点
	 * @param consignnotenum 运单号
	 * @param roadmapid 邮路id
	 * @param enterpriseid 企业公司id
	 * @param enstationid 企业站点id
	 * @param enlinkerid 发货方联系人
	 * @param recvlinkerid 收货方联系人
	 * @param logisticlinkerid 物流方联系人
	 * @param roundtrip 往返标志 1.单程 2.往返 默认为1.
	 * @param isaddtionalflight 是否加班车 1.不是 2.是 默认值1
	 * @param ishiredvehicle 是否租出装载 1.否 2.是 默认值为1
	 * @param direction 邮路方向 1.去程 2.回程
	 * @param calculationtypeid 运费计算方式 1.按体积计算 2.按重量单价计算 3.按数里单价计算
	 * @param plansenddate 计划运输日期
	 */
	@RequestMapping(value="/add")
	public void add(
		@RequestParam(value="data",required=false) String data,
		HttpServletRequest request,HttpServletResponse response){
		
		HttpSession httpSession = request.getSession(false);
		if(httpSession == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession.getAttribute("user_login_data");
		JSONObject jsonObject=JSONObject.fromObject(login_data);
		String logisticid=jsonObject.get("companyid").toString();
		String stationid=jsonObject.get("stationid").toString();
		String staffid=jsonObject.get("staffid").toString();
		
		
		
//		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		JSONObject obj = JSONObject.fromObject(data);
		obj.put("logisticid", logisticid);
		obj.put("stationid", stationid);
		obj.put("createdby", staffid);
//		boolean isaddtionalflight =  (boolean) obj.get("isaddtionalflight");
		if(obj.get("isaddtionalflight") !=null&&obj.getBoolean("isaddtionalflight")){
			obj.put("isaddtionalflight", 2);
		}else{
			obj.put("isaddtionalflight", 1);
		}
		if(obj.get("ishiredvehicle") !=null&&obj.getBoolean("ishiredvehicle")){
			obj.put("ishiredvehicle", 2);
		}else{
			obj.put("ishiredvehicle", 1);
		}
		
		String serviceName="logisticsService";
		
		String method="masget.logistic.transport.tr_consignnote.add";
		
		String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
		System.out.println(obj.toString());
	
	}
	
	/**
	 * 修改运单
	 */
	@RequestMapping(value="/update")
	public void update(
		@RequestParam(value="data",required=false) String data,
		HttpServletRequest request, HttpServletResponse response){
		
		
		
		HttpSession httpSession = request.getSession(false);
		if(httpSession == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession.getAttribute("user_login_data");
		JSONObject jsonObject=JSONObject.fromObject(login_data);
		String logisticid=jsonObject.get("companyid").toString();
		String stationid=jsonObject.get("stationid").toString();
		
		JSONObject obj = JSONObject.fromObject(data);
		obj.put("logisticid", logisticid);
		obj.put("stationid", stationid);
		if(obj.get("isaddtionalflight") !=null&&obj.getBoolean("isaddtionalflight")){
			obj.put("isaddtionalflight", 2);
		}else{
			obj.put("isaddtionalflight", 1);
		}
		if(obj.get("ishiredvehicle") !=null&&obj.getBoolean("ishiredvehicle")){
			obj.put("ishiredvehicle", 2);
		}else{
			obj.put("ishiredvehicle", 1);
		}
		
		String serviceName="logisticsService";
		 
		String method="masget.logistic.transport.tr_consignnote.modify";
		
		String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
		System.out.println(obj.toString());
	
	}
	
	/**
	 * 删除运单信息
	 * @param consignnoteid 运单信息id
	 */
	@RequestMapping("/delete")
	public void delete(
			@RequestParam(value="consignnoteid") String consignnoteid,
			HttpServletRequest request, HttpServletResponse response)
	{
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("consignnoteid", consignnoteid);
		String data=new Gson().toJson(dataMap);
		
		String serviceName="logisticsService";
		
		String method="masget.logistic.transport.tr_consignnote.delete";
		
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	
	}
	
	/**
	 * 根据条件 获取运单号
	 */
	@RequestMapping(value="/getconsignnotenum",method={RequestMethod.POST,RequestMethod.GET})
	public void getconsignnotenum(
			@RequestParam(value="ordertypeid",required=true) String ordertypeid,
			HttpServletRequest request, HttpServletResponse response)
	{
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("ordertypeid", ordertypeid);
		
		String data=new Gson().toJson(dataMap);
		
		String serviceName="baseService";
		
		String method="masget.base.com.order.getordernum";
		
        String result = CommomUtil.CallApi(request, serviceName, method, data);
        
        JSONObject jsonObject = JSONObject.fromObject(result);
        Long jsonString = (Long) jsonObject.get("ordernum");
		
		CommomUtil.writeResultBack(request, response, String.valueOf(jsonString));
		
		System.out.println(data);
		
		System.out.println(result);
	}
	
	/**
	 * 根据条件 查询员工
	 */
	@RequestMapping(value="/getcompanystaff",method={RequestMethod.POST,RequestMethod.GET})
	public void getcompanystaff(
			@RequestParam(value="stafftype",required=false) String stafftype,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		HttpSession httpSession = request.getSession(false);
		if(httpSession == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession.getAttribute("user_login_data");
		JSONObject jsonObject=JSONObject.fromObject(login_data);
		String companyid=jsonObject.get("companyid").toString();
		String stationid=jsonObject.get("stationid").toString();
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("companyid", companyid);
		dataMap.put("stationid", stationid);
		dataMap.put("stafftype", stafftype);
		
		String data=new Gson().toJson(dataMap);
		
		String serviceName="baseService";
		
		String method="masget.base.com.companystaff.get";
		
        String result = CommomUtil.CallApi(request, serviceName, method, data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(data);
		
		System.out.println(result);
	}
	
	/**
	 * 根据条件 合作关系查询
	 */
	@RequestMapping(value="/getcompanyrelation",method={RequestMethod.POST,RequestMethod.GET})
	public void getcompanyrelation(
			HttpServletRequest request, HttpServletResponse response)
	{
		
		HttpSession httpSession = request.getSession(false);
		if(httpSession == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession.getAttribute("user_login_data");
		JSONObject jsonObject=JSONObject.fromObject(login_data);
		String companyid=jsonObject.get("companyid").toString();
		String stationid=jsonObject.get("stationid").toString();
		String staffid=jsonObject.get("staffid").toString();

		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("companyid", companyid);
		dataMap.put("stationid", stationid);
		dataMap.put("staffid", staffid);
		
		String data=new Gson().toJson(dataMap);
		
		String serviceName="baseService";
		
		String method="masget.base.com.companyrelation.get";
		
        String result = CommomUtil.CallApi(request, serviceName, method, data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(data);
		
		System.out.println(result);
	}
	
	/**
	 * 获取邮路及路段
	 * @param request
	 * @param response
	 */
	@RequestMapping(value="/getallroadinfo.do",method={RequestMethod.POST,RequestMethod.GET})
	public void getroadmapdetail( 
//			q是jquery.easyui.min.js传入的值
			@RequestParam(value="roadmapname",required=false) String roadmapname,
			@RequestParam(value="roadmapid",required=false) String roadmapid,
			HttpServletRequest request, HttpServletResponse response)
	{		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("roadmapname", roadmapname);
		dataMap.put("roadmapid", roadmapid);
		Gson gson=new Gson();
		String jsonStr=gson.toJson(dataMap);
 	
		String result = CommomUtil.CallApi(request, "logisticsService", "masget.logistic.transport.tr_roadmapinfo.getallroadinfo", jsonStr);
		
//		RetStruct retStruct=new Gson().fromJson(result, RetStruct.class);
//        
//        String str=new Gson().toJson(retStruct.getData().getRows());
		
		CommomUtil.writeResultBack(request, response, result);		
	}
	
	/**
	 * 获取车辆信息
	 * @param request
	 * @param response
	 */
	@RequestMapping(value="/getcompanyvehicle",method={RequestMethod.POST,RequestMethod.GET})
	public void getcompanyvehicle(
			@RequestParam(value="licensenumber",required=false) String licensenumber,
			@RequestParam(value="vehicletypename",required=true) String vehicletypename,
			HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession httpSession = request.getSession(false);
		if(httpSession == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession.getAttribute("user_login_data");
		JSONObject jsonObject=JSONObject.fromObject(login_data);
		String logisticid=jsonObject.get("companyid").toString();
		String stationid=jsonObject.get("stationid").toString();
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("logisticid", logisticid);
		dataMap.put("stationid", stationid);
		dataMap.put("licensenumber", licensenumber);
		dataMap.put("vehicletypename", vehicletypename);
		String data=new Gson().toJson(dataMap);
		
		String serviceName="baseService";
		
		String method="masget.base.com.companyvehicle.get";
		
        String result = CommomUtil.CallApi(request, serviceName, method, data);
        
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(data);
		System.out.println(result);
	}
}
