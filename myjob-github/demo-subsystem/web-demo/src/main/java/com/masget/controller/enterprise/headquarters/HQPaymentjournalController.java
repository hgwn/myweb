package com.masget.controller.enterprise.headquarters;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;
import com.masget.util.DateUtils;

/**
 * 支付流水Controller
 * @author cxq
 *
 */
@Controller
@RequestMapping("/headquarters/paymentjournal")
public class HQPaymentjournalController {
	
	@RequestMapping(value="/list",method ={RequestMethod.POST,RequestMethod.GET})
	public void list(
			@RequestParam(value="subcompanyid",required=false) String subcompanyid,
			@RequestParam(value="agentflag",required=false) String agentflag,
			@RequestParam(value="paymenttype",required=false) String paymenttype,
			@RequestParam(value="consignnotenum",required=false) String consignnotenum,
			@RequestParam(value="terminalnumber",required=false) String terminalnumber,
			@RequestParam(value="businesstimebegin",required=false) String businesstimebegin,
			@RequestParam(value="businesstimeend",required=false) String businesstimeend,
			@RequestParam(value="settlementtimebegin",required=false) String settlementtimebegin,
			@RequestParam(value="settlementtimeend",required=false) String settlementtimeend,
			@RequestParam(value="cupcompanyid",required=false) String cupcompanyid,
			@RequestParam(value="acquirebankid",required=false) String acquirebankid,
			@RequestParam(value="pagesize",required=false) String pagesize,
			@RequestParam(value="pagenum",required=false) String pagenum,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		dataMap.put("pagesize", pagesize);
		dataMap.put("pagenum", pagenum);
		
//		if(membername!=null&&!membername.equals("")){
//			dataMap.put("membername", membername);
//		}
		
		if(subcompanyid!=null&&!subcompanyid.equals("")){
			dataMap.put("subcompanyid", subcompanyid);
		}
		
		if(agentflag!=null&&!agentflag.equals("")){
			dataMap.put("agentflag", agentflag);
		}
		
		if(paymenttype!=null&&!paymenttype.equals("")){
			dataMap.put("paymenttype", paymenttype);
		}
		
		if(consignnotenum!=null&&!consignnotenum.equals("")){
			dataMap.put("consignnotenum", consignnotenum);
		}
		
		if(terminalnumber!=null&&!terminalnumber.trim().equals("")){
			dataMap.put("terminalnumber", terminalnumber);
		}
		
		if(businesstimebegin!=null&&!businesstimebegin.equals("")){
			dataMap.put("businesstimebegin", businesstimebegin);
		}
		
		if(businesstimeend!=null&&!businesstimeend.trim().equals("")){
			dataMap.put("businesstimeend", DateUtils.getDateLastSecondTime(businesstimeend));
		}
		
		if(settlementtimebegin!=null&&!settlementtimebegin.equals("")){
			dataMap.put("settlementtimebegin", settlementtimebegin);
		}
		
		if(settlementtimeend!=null&&!settlementtimeend.trim().equals("")){
			dataMap.put("settlementtimeend", DateUtils.getDateLastSecondTime(settlementtimeend));
		}
		
		if(cupcompanyid!=null&&!cupcompanyid.trim().equals("")){
			dataMap.put("cupcompanyid", cupcompanyid);
		}
		
		if(acquirebankid!=null&&!acquirebankid.trim().equals("")){
			dataMap.put("acquirebankid", acquirebankid);
		}
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.enterprise.settlementjournal.rpt.get";
		
		try{
			String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
//			System.out.println(result);
			CommomUtil.writeResultBack(request, response, result);
			System.out.println(result);
			
		}catch(Exception e){
			CommomUtil.writeResultBack(request, response, e.getMessage());
		}
	}
	
	@RequestMapping(value="/report",method ={RequestMethod.POST,RequestMethod.GET})
	public void report(
			@RequestParam(value="membername",required=false) String membername,
			@RequestParam(value="agentflag",required=false) String agentflag,
			@RequestParam(value="paymenttype",required=false) String paymenttype,
			@RequestParam(value="consignnotenum",required=false) String consignnotenum,
			@RequestParam(value="terminalnumber",required=false) String terminalnumber,
			@RequestParam(value="businesstimebegin",required=false) String businesstimebegin,
			@RequestParam(value="businesstimeend",required=false) String businesstimeend,
			@RequestParam(value="settlementtimebegin",required=false) String settlementtimebegin,
			@RequestParam(value="settlementtimeend",required=false) String settlementtimeend,
			@RequestParam(value="cupcompanyid",required=false) String cupcompanyid,
			@RequestParam(value="acquirebankid",required=false) String acquirebankid,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		if(membername!=null&&!membername.equals("")){
			dataMap.put("membername", URLDecoder.decode(membername, "UTF-8").toString());
		}
		
		if(agentflag!=null&&!agentflag.equals("")){
			dataMap.put("agentflag", agentflag);
		}
		
		if(paymenttype!=null&&!paymenttype.equals("")){
			dataMap.put("paymenttype", paymenttype);
		}
		
		if(consignnotenum!=null&&!consignnotenum.equals("")){
			dataMap.put("consignnotenum", consignnotenum);
		}
		
		if(terminalnumber!=null&&!terminalnumber.trim().equals("")){
			dataMap.put("terminalnumber", terminalnumber);
		}
		
		if(businesstimebegin!=null&&!businesstimebegin.equals("")){
			dataMap.put("businesstimebegin", businesstimebegin);
		}
		
		if(businesstimeend!=null&&!businesstimeend.trim().equals("")){
			dataMap.put("businesstimeend", DateUtils.getDateLastSecondTime(businesstimeend));
		}
		
		if(settlementtimebegin!=null&&!settlementtimebegin.equals("")){
			dataMap.put("settlementtimebegin", settlementtimebegin);
		}
		
		if(settlementtimeend!=null&&!settlementtimeend.trim().equals("")){
			dataMap.put("settlementtimeend", DateUtils.getDateLastSecondTime(settlementtimeend));
		}
		
		if(cupcompanyid!=null&&!cupcompanyid.trim().equals("")){
			dataMap.put("cupcompanyid", cupcompanyid);
		}
		
		if(acquirebankid!=null&&!acquirebankid.trim().equals("")){
			dataMap.put("acquirebankid", acquirebankid);
		}
		
		String data=new Gson().toJson(dataMap);
		
		String method="asget.enterprise.settlementjournal.rpt.get";
		
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		
		CommomUtil.exportPdf("/WEB-INF/reports/paymentjournallist.jasper",result,null,request,response);
	}
	
}
