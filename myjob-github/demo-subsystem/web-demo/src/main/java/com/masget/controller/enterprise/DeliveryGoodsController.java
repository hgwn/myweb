package com.masget.controller.enterprise;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;
import com.masget.util.DateUtils;

/**
 * 发货单Controller
 * @author cxq
 *
 */
@Controller
@RequestMapping("/enterprise/deliverygoods")
public class DeliveryGoodsController {
	
	private JSONObject loginData;
	
	/**
	 * 查询发货单--物流公司查询发货单
	 * @param request 请求对象
	 * @return
	 */
	@RequestMapping(value="/list",method={RequestMethod.POST,RequestMethod.GET})
	public void list(	
			@RequestParam(value="deliverynum",required=false) String deliverynum,
			@RequestParam(value="logisticname",required=false) String logisticname,
			@RequestParam(value="screatedtime",required=false) String screatedtime,
			@RequestParam(value="ecreatedtime",required=false) String ecreatedtime,
			@RequestParam(value="state",required=false) String state,
			@RequestParam(value="recvlinkername",required=false) String recvlinkername,
			@RequestParam(value="pageNum",required=true) String pageNum,
			@RequestParam(value="pageSize" ,required=true) String pageSize,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		dataMap.put("pagenum", pageNum);
		dataMap.put("pagesize", pageSize);
		if(deliverynum!=null&&!deliverynum.equals("")){
			dataMap.put("deliverynum", deliverynum);
		}
		
		if(logisticname!=null&&!logisticname.equals("")){
			dataMap.put("logisticname", logisticname);
		}
		
		if(screatedtime!=null&&!screatedtime.equals("")){
			dataMap.put("screatedtime", screatedtime);
		}
		
		if(ecreatedtime!=null&&!ecreatedtime.trim().equals("")){
			dataMap.put("ecreatedtime", DateUtils.getDateLastSecondTime(ecreatedtime));
		}
		
		if(state!=null&&!state.equals("")){
			dataMap.put("state", state);
		}
		
		if(recvlinkername!=null&&!recvlinkername.trim().equals("")){
			dataMap.put("recvlinkername", recvlinkername);
		}
		
		List<String> orders=new ArrayList<String>();
		orders.add("createdtime");
		dataMap.put("orders", orders);
		dataMap.put("orderkey", "desc");
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.enterprise.com.deliverygoods.get";
		
		try{
			String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
			CommomUtil.writeResultBack(request, response, result);
			
		}catch(Exception e){
			CommomUtil.writeResultBack(request, response, e.getMessage());
		}
	}
	
	/**
	 * 查询发货单--商家查询自己的发货单
	 * @param request 请求对象
	 * @return
	 */
	@RequestMapping(value="/query",method={RequestMethod.POST,RequestMethod.GET})
	public void query(	
			@RequestParam(value="deliverynum",required=false) String deliverynum,
			@RequestParam(value="logisticname",required=false) String logisticname,
			@RequestParam(value="screatedtime",required=false) String screatedtime,
			@RequestParam(value="ecreatedtime",required=false) String ecreatedtime,
			@RequestParam(value="state",required=false) String state,
			@RequestParam(value="recvlinkername",required=false) String recvlinkername,
			@RequestParam(value="pageNum",required=true) String pageNum,
			@RequestParam(value="pageSize" ,required=true) String pageSize,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		dataMap.put("pagenum", pageNum);
		dataMap.put("pagesize", pageSize);
		if(deliverynum!=null&&!deliverynum.equals("")){
			dataMap.put("deliverynum", deliverynum);
		}
		
		if(logisticname!=null&&!logisticname.equals("")){
			dataMap.put("logisticname", logisticname);
		}
		
		if(ecreatedtime!=null&&!ecreatedtime.trim().equals("")){
			dataMap.put("ecreatedtime", ecreatedtime);
		}
		
		if(screatedtime!=null&&!screatedtime.equals("")){
			dataMap.put("screatedtime", screatedtime);
		}
		
		if(ecreatedtime!=null&&!ecreatedtime.trim().equals("")){
			dataMap.put("ecreatedtime", DateUtils.getDateLastSecondTime(ecreatedtime));
		}
		
		if(state!=null&&!state.equals("")){
			dataMap.put("state", state);
		}
		
		if(recvlinkername!=null&&!recvlinkername.trim().equals("")){
			dataMap.put("recvlinkername", recvlinkername);
		}
		
		List<String> orders=new ArrayList<String>();
		orders.add("createdtime");
		dataMap.put("orders", orders);
		dataMap.put("orderkey", "desc");
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.enterprise.com.deliverygoods.query";
		
		try{
			String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
			CommomUtil.writeResultBack(request, response, result);
			
		}catch(Exception e){
			CommomUtil.writeResultBack(request, response, e.getMessage());
		}
	}
	
	/**
	 * 查询数据源--销售单
	 * @param request 请求对象
	 * @return
	 */
	@RequestMapping(value="/queryDataSourse",method = RequestMethod.POST)
	public void queryDataSourse(			
			@RequestParam(value="datatype",required=true) String datatype,
			@RequestParam(value="orderstate",required=false) String orderstate,
			@RequestParam(value="ordernum",required=false) String ordernum,
			@RequestParam(value="buyername",required=false) String buyername,
			@RequestParam(value="begincreatedtime",required=false) String begincreatedtime,
			@RequestParam(value="endcreatedtime",required=false) String endcreatedtime,
			@RequestParam(value="pageSize",required=false) String pageSize,
			@RequestParam(value="pageNum",required=false) String pageNum,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		dataMap.put("datatype", datatype);
		
		//当为出库单时
		if(datatype.equals("1")){
			dataMap.put("state", 1);
		}
		//当为售货单时
		else if(datatype.equals("2")){
			dataMap.put("state", 1);
			dataMap.put("orderstate", 3);
		}
		
		if(ordernum!=null&&!ordernum.trim().equals("")){
			dataMap.put("ordernum", ordernum);
		}
		if(buyername!=null&&!buyername.trim().equals("")){
			dataMap.put("buyername", buyername);
		}
		if(begincreatedtime!=null&&!begincreatedtime.trim().equals("")){
			dataMap.put("begincreatedtime", begincreatedtime);
		}
		if(endcreatedtime!=null&&!endcreatedtime.trim().equals("")){
			dataMap.put("endcreatedtime", DateUtils.getDateLastSecondTime(endcreatedtime));
		}
		if(pageSize!=null&&!pageSize.trim().equals("")){
			dataMap.put("pagesize", pageSize);
		}
		if(pageNum!=null&&!pageNum.trim().equals("")){
			dataMap.put("pagenum", pageNum);
		}
		
		List<String> orders=new ArrayList<String>();
		orders.add("createdtime");
		dataMap.put("orders", orders);
		dataMap.put("orderkey", "desc");
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.enterprise.com.orders.getsupplier";
		
		try{
			String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
			CommomUtil.writeResultBack(request, response, result);
			
		}catch(Exception e){
			CommomUtil.writeResultBack(request, response, e.getMessage());
		}
	}
		
	
	/**
	 * 删除发货单
	 * @param request 请求对象
	 * @return
	 */
	@RequestMapping(value="/delete/{deliveryid}",method ={RequestMethod.POST,RequestMethod.GET})
	public void delete(
			@PathVariable String deliveryid,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		dataMap.put("deliveryid", deliveryid);
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.enterprise.com.deliverygoods.delete";
		
		try{
			String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
			CommomUtil.writeResultBack(request, response, result);
			
		}catch(Exception e){
			CommomUtil.writeResultBack(request, response, e.getMessage());
		}
	}
	
	/**
	 * 查询联系人--比如物流，发货人，收货人
	 * @param request 请求对象
	 * @return
	 */
	@RequestMapping(value="/queryContractorinfo",method={RequestMethod.POST,RequestMethod.GET})
	public void queryContractorinfo(	
			@RequestParam(value="scenetypeid" ,required=true) String scenetypeid,
			@RequestParam(value="companyname",required=false) String companyname,
			@RequestParam(value="mobilephone",required=false) String mobilephone,
			@RequestParam(value="companytypeid" ,required=false) String companytypeid,
			@RequestParam(value="plaformuser" ,required=false) String plaformuser,
			@RequestParam(value="condition",required=false) String condition,
			@RequestParam(value="pageNum",required=true) String pageNum,
			@RequestParam(value="pageSize" ,required=true) String pageSize,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		dataMap.put("pagenum", pageNum);
		dataMap.put("pagesize", pageSize);
		dataMap.put("scenetypeid", scenetypeid);
		
		if(companyname!=null&&!companyname.equals("")){
			dataMap.put("companyname", companyname);
		}
		
		if(mobilephone!=null&&!mobilephone.equals("")){
			dataMap.put("mobilephone", mobilephone);
		}
		
		if(companytypeid!=null&&!companytypeid.equals("")){
			dataMap.put("companytypeid", companytypeid);
		}
		
		if(mobilephone!=null&&!mobilephone.equals("")){
			dataMap.put("mobilephone", mobilephone);
		}
		
		if(plaformuser!=null&&!plaformuser.equals("")){
			dataMap.put("plaformuser", plaformuser);
		}
		
		if(condition!=null&&!condition.equals("")){
			dataMap.put("companyname", condition);
			dataMap.put("mobilephone", condition);
			dataMap.put("staffname", condition);
		}
		

		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.contractorinfo.find";
		
		try{
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
			System.out.println(result);
			CommomUtil.writeResultBack(request, response, result);
			System.out.println(result);
			
		}catch(Exception e){
			CommomUtil.writeResultBack(request, response, e.getMessage());
		}
	}
	
	/**
	 * 获取登录用户信息
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/getLoginCompanyMsg",method = RequestMethod.POST)
	public void getLoginCompanyMsg(
			HttpServletRequest request,HttpServletResponse response){
		Map<String, Object> dataMap=new HashMap<String, Object>();
		HttpSession session = request.getSession();
		String loginDataStr = (String) session.getAttribute("user_login_data");
		if(loginDataStr!=null){
			loginData=JSONObject.fromObject(loginDataStr);
			dataMap.put("staffid", loginData.get("staffid").toString());
			dataMap.put("companyid", loginData.get("companyid").toString());
			dataMap.put("companyname", loginData.get("companyname").toString());
			dataMap.put("stationid", loginData.get("stationid").toString());
			dataMap.put("stationname", loginData.get("stationname").toString());
		}
		String result=new Gson().toJson(dataMap);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 创建发货单
	 * @param consignnotenum
	 * @param relationnumber
	 * @param loadstationid
	 * @param curstationid
	 * @param unloadstationid
	 * @param enterpriseid
	 * @param enstationid
	 * @param enlinkername
	 * @param enlinkerphone
	 * @param sendstationid
	 * @param sendaddress
	 * @param recvcompanyid
	 * @param recvstationid
	 * @param recvlinkername
	 * @param recvlinkerphone
	 * @param recvaddress
	 * @param datasource
	 * @param codflag
	 * @param receiptflag
	 * @param consignmenttype
	 * @param deliverytype
	 * @param transporttypeid
	 * @param consignnotelist
	 * @param consignnotecharge
	 * @param request
	 * @param response
	 */
	@RequestMapping(value="/createOrder",method = RequestMethod.POST)
	public void createOrder(			
			@RequestParam(value="deliverynum",required=true) String deliverynum,
			@RequestParam(value="relationnum",required=false) String relationnum,
			@RequestParam(value="sendcompanyid",required=true) String sendcompanyid,
			@RequestParam(value="enlinkername",required=true) String enlinkername,
			@RequestParam(value="enlinkerphone",required=true) String enlinkerphone,
			@RequestParam(value="sendstationid",required=true) String sendstationid,
			@RequestParam(value="sendaddress",required=true) String sendaddress,
			@RequestParam(value="recvcompanyid",required=true) String recvcompanyid,
			@RequestParam(value="recvstationid",required=true) String recvstationid,
			@RequestParam(value="recvlinkername",required=true) String recvlinkername,
			@RequestParam(value="recvlinkerphone",required=true) String recvlinkerphone,
			@RequestParam(value="recvaddress",required=true) String recvaddress,
			@RequestParam(value="datasource",required=true) String datasource,
			@RequestParam(value="codflag",required=true) String codflag,
			@RequestParam(value="receiptflag",required=true) String receiptflag,
			@RequestParam(value="consignmenttype",required=true) String consignmenttype,
			@RequestParam(value="deliverytype",required=true) String deliverytype,
			@RequestParam(value="logisticid",required=true) String logisticid,
			@RequestParam(value="logstationid",required=true) String logstationid,
			@RequestParam(value="deliverygoodslist",required=true) String deliverygoodslist,
			@RequestParam(value="deliverygoodscharge",required=false) String deliverygoodscharge,
			@RequestParam(value="remark1",required=false) String remark1,
			
			@RequestParam(value="orderid",required=false) String orderid,
			@RequestParam(value="warehouseoutid",required=false) String warehouseoutid,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		dataMap.put("deliverynum", deliverynum);
		dataMap.put("relationnum", relationnum==null?"":relationnum);
		dataMap.put("sendcompanyid", sendcompanyid);
		dataMap.put("enlinkername", enlinkername);
		dataMap.put("enlinkerphone", enlinkerphone);
		dataMap.put("sendstationid", sendstationid);
		dataMap.put("sendaddress", sendaddress);
		dataMap.put("recvcompanyid", recvcompanyid);
		dataMap.put("recvstationid", recvstationid);
		dataMap.put("recvlinkername", recvlinkername);
		dataMap.put("recvphone", recvlinkerphone);
		dataMap.put("recvaddress", recvaddress);
		dataMap.put("datasource", datasource);
		dataMap.put("codflag", codflag);
		dataMap.put("receiptflag", receiptflag);
		dataMap.put("consignmenttype", consignmenttype);
		dataMap.put("deliverytype", deliverytype);
		dataMap.put("deliverystate", 1);
		dataMap.put("logisticid", logisticid);
		dataMap.put("logstationid", logstationid);
		dataMap.put("remark1", remark1);
		
		if(deliverygoodslist!=null&&!deliverygoodslist.trim().equals("")){
			dataMap.put("deliverygoodslist", deliverygoodslist);
		}
		
		if(deliverygoodscharge!=null&&!deliverygoodscharge.trim().equals("")){
			dataMap.put("deliverygoodscharge", deliverygoodscharge);
		}
		
		//出库单时
		if(datasource.equals("2")){
			dataMap.put("warehouseoutid", warehouseoutid);
		}
		
		//售货单时
		if(datasource.equals("3")){
			dataMap.put("orderid", orderid);
		}
		
		String data=new Gson().toJson(dataMap);
		data=data.replace("\\", "").replace("\"[", "[").replace("]\"", "]").replace("\"{", "{").replace("}\"", "}");
		
		String method="masget.enterprise.com.deliverygoods.add";
		
		try{
			String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
			CommomUtil.writeResultBack(request, response, result);
			System.out.println(result);
			
		}catch(Exception e){
			CommomUtil.writeResultBack(request, response, e.getMessage());
		}
	}
	
	@RequestMapping(value="/updateOrder",method = RequestMethod.POST)
	public void updateOrder(
			@RequestParam(value="deliveryid",required=true) String deliveryid,
			@RequestParam(value="deliverynum",required=true) String deliverynum,
			@RequestParam(value="sendcompanyid",required=true) String sendcompanyid,
			@RequestParam(value="enlinkername",required=true) String enlinkername,
			@RequestParam(value="enlinkerphone",required=true) String enlinkerphone,
			@RequestParam(value="sendstationid",required=true) String sendstationid,
			@RequestParam(value="sendaddress",required=true) String sendaddress,
			@RequestParam(value="recvcompanyid",required=true) String recvcompanyid,
			@RequestParam(value="recvstationid",required=true) String recvstationid,
			@RequestParam(value="recvlinkername",required=true) String recvlinkername,
			@RequestParam(value="recvlinkerphone",required=true) String recvlinkerphone,
			@RequestParam(value="recvaddress",required=true) String recvaddress,
			@RequestParam(value="datasource",required=false) String datasource,//
			@RequestParam(value="codflag",required=true) String codflag,
			@RequestParam(value="receiptflag",required=true) String receiptflag,
			@RequestParam(value="consignmenttype",required=true) String consignmenttype,
			@RequestParam(value="deliverytype",required=true) String deliverytype,
			@RequestParam(value="logisticid",required=true) String logisticid,
			@RequestParam(value="logstationid",required=true) String logstationid,
			@RequestParam(value="deliverygoodslist",required=true) String deliverygoodslist,
			@RequestParam(value="deliverygoodscharge",required=false) String deliverygoodscharge,
			@RequestParam(value="remark1",required=false) String remark1,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		dataMap.put("deliveryid", deliveryid);
		dataMap.put("deliverynum", deliverynum);
		dataMap.put("sendcompanyid", sendcompanyid);
		dataMap.put("enlinkername", enlinkername);
		dataMap.put("enlinkerphone", enlinkerphone);
		dataMap.put("sendstationid", sendstationid);
		dataMap.put("sendaddress", sendaddress);
		dataMap.put("recvcompanyid", recvcompanyid);
		dataMap.put("recvstationid", recvstationid);
		dataMap.put("recvlinkername", recvlinkername);
		dataMap.put("recvphone", recvlinkerphone);
		dataMap.put("recvaddress", recvaddress);
		dataMap.put("datasource", datasource);
		dataMap.put("codflag", codflag);
		dataMap.put("receiptflag", receiptflag);
		dataMap.put("consignmenttype", consignmenttype);
		dataMap.put("deliverytype", deliverytype);
		dataMap.put("deliverystate", 1);
		dataMap.put("logisticid", logisticid);
		dataMap.put("logstationid", logstationid);
		dataMap.put("remark1", remark1);
		
		if(deliverygoodslist!=null&&!deliverygoodslist.trim().equals("")){
			dataMap.put("deliverygoodslist", deliverygoodslist);
		}
		
		if(deliverygoodscharge!=null&&!deliverygoodscharge.trim().equals("")){
			dataMap.put("deliverygoodscharge", deliverygoodscharge);
		}
		
		String data=new Gson().toJson(dataMap);
		data=data.replace("\\", "").replace("\"[", "[").replace("]\"", "]").replace("\"{", "{").replace("}\"", "}");
		
		String method="masget.enterprise.com.deliverygoods.modify";
		
		try{
			String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
			CommomUtil.writeResultBack(request, response, result);
			System.out.println(result);
			
		}catch(Exception e){
			CommomUtil.writeResultBack(request, response, e.getMessage());
		}
	}
	
}
