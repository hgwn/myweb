package com.masget.controller.rboperationsmanager;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.masget.util.CommomUtil;

@Controller
@RequestMapping("/rboperationsmanager/com")
public class OperationsmanagerController {
	Gson gson;
	@SuppressWarnings("unused")
	private static Logger logger =Logger.getLogger(OperationsmanagerController.class);
	public OperationsmanagerController() {
		gson = new GsonBuilder().serializeNulls()
				.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
	}

	/**
	 * 获取角色菜单资源
	 * 
	 * @param osenvirnmentid
	 * @param companytypeid
	 * @param roletypeid
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/osroleresource_query", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void osroleresource_query(
			@RequestParam(value = "osenvirnmentid", required = true) Long osenvirnmentid,
			@RequestParam(value = "companytypeid", required = true) Long companytypeid,
			@RequestParam(value = "roletypeid", required = true) Long roletypeid,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		Map<String, Object> dataMap = new HashMap<String, Object>();

		if (osenvirnmentid != null && !osenvirnmentid.equals("")) {
			dataMap.put("osenvirnmentid", osenvirnmentid);
		}

		if (companytypeid != null && !companytypeid.equals("")) {
			dataMap.put("companytypeid", companytypeid);
		}

		if (roletypeid != null && !roletypeid.equals("")) {
			dataMap.put("roletypeid", roletypeid);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.osroleresource.query";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 获取未配置的基础资源(根据resourcename模糊查询)
	 * 
	 * @param osenvirnmentid
	 * @param companytypeid
	 * @param roletypeid
	 * @param resourcename
	 */
	@RequestMapping(value = "/overage_query", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void overage_query(
			@RequestParam(value = "osenvirnmentid", required = true) Long osenvirnmentid,
			@RequestParam(value = "companytypeid", required = true) Long companytypeid,
			@RequestParam(value = "roletypeid", required = true) Long roletypeid,
			@RequestParam(value = "resourcename", required = false) String resourcename,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		Map<String, Object> dataMap = new HashMap<String, Object>();

		if (osenvirnmentid != null && !osenvirnmentid.equals("")) {
			dataMap.put("osenvirnmentid", osenvirnmentid);
		}

		if (companytypeid != null && !companytypeid.equals("")) {
			dataMap.put("companytypeid", companytypeid);
		}

		if (roletypeid != null && !roletypeid.equals("")) {
			dataMap.put("roletypeid", roletypeid);
		}
		
		if (resourcename != null && !resourcename.equals("")) {
			dataMap.put("resourcename", resourcename);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.resource.overage.query";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 设置角色菜单资源
	 * @param osenvirnmentid
	 * @param companytypeid
	 * @param roletypeid
	 * @throws Exception 
	 */
	@RequestMapping(value = "/osroleresource_set", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void osroleresource_set(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.osroleresource.set";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 查询划账信息数据
	 * 
	 * @param i_awardcompanyid
	 * @param i_acquirebankid
	 * @param i_targetcompanyid
	 * @param i_unionpaytransferflag
	 * @param i_samebankflag
	 * @param i_bankaccount
	 * @param i_accountname
	 * @param i_accounttype
	 * @param i_begintransfertime
	 * @param i_endtransfertime
	 * @param i_serviceflag
	 * @param i_actualtransferflag
	 * @param i_dealresult
	 * @param i_pagenum
	 * @param i_page_recordnum
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/companytransferaccountinfo_query", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void companytransferaccountinfo_query(
			@RequestParam(value = "i_awardcompanyid", required = false) Integer i_awardcompanyid,
			@RequestParam(value = "i_acquirebankid", required = false) Integer i_acquirebankid,
			@RequestParam(value = "i_targetcompanyid", required = false) Integer i_targetcompanyid,
			@RequestParam(value = "i_unionpaytransferflag", required = false) Integer i_unionpaytransferflag,
			@RequestParam(value = "i_samebankflag", required = false) Integer i_samebankflag,
			@RequestParam(value = "i_bankaccount", required = false) String i_bankaccount,
			@RequestParam(value = "i_accountname", required = false) String i_accountname,
			@RequestParam(value = "i_accounttype", required = false) Integer i_accounttype,
			@RequestParam(value = "i_begintransfertime", required = false) String i_begintransfertime,
			@RequestParam(value = "i_endtransfertime", required = false) String i_endtransfertime,
			@RequestParam(value = "i_serviceflag", required = false) Integer i_serviceflag,
			@RequestParam(value = "i_actualtransferflag", required = false) Integer i_actualtransferflag,
			@RequestParam(value = "i_dealresult", required = false) String i_dealresult,
			@RequestParam(value = "orders", required = false) String orders,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			@RequestParam(value = "i_page_recordnum", required = false) Integer i_page_recordnum,
			@RequestParam(value = "i_pagenum", required = false) Integer i_pagenum,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		Map<String, Object> dataMap = new HashMap<String, Object>();

		if (i_awardcompanyid != null && !i_awardcompanyid.equals("")) {
			dataMap.put("i_awardcompanyid", i_awardcompanyid);
		}

		if (i_acquirebankid != null && !i_acquirebankid.equals("")) {
			dataMap.put("i_acquirebankid", i_acquirebankid);
		}

		if (i_targetcompanyid != null && !i_targetcompanyid.equals("")) {
			dataMap.put("i_targetcompanyid", i_targetcompanyid);
		}

		if (i_unionpaytransferflag != null && !i_unionpaytransferflag.equals("")) {
			dataMap.put("i_unionpaytransferflag", i_unionpaytransferflag);
		}
		if (i_samebankflag != null && !i_samebankflag.equals("")) {
			dataMap.put("i_samebankflag", i_samebankflag);
		}

		if (i_bankaccount != null && !i_bankaccount.equals("")) {
			dataMap.put("i_bankaccount", i_bankaccount);
		}

		if (i_accountname != null && !i_accountname.equals("")) {
			dataMap.put("i_accountname", i_accountname);
		}

		if (i_accounttype != null && !i_accounttype.equals("")) {
			dataMap.put("i_accounttype", i_accounttype);
		}
		
		if (i_begintransfertime != null && !i_begintransfertime.equals("")) {
			dataMap.put("i_begintransfertime", i_begintransfertime);
		}
		if (i_endtransfertime != null && !i_endtransfertime.equals("")) {
			dataMap.put("i_endtransfertime", i_endtransfertime);
		}
		if (i_serviceflag != null && !i_serviceflag.equals("")) {
			dataMap.put("i_serviceflag", i_serviceflag);
		}
		if (i_actualtransferflag != null && !i_actualtransferflag.equals("")) {
			dataMap.put("i_actualtransferflag", i_actualtransferflag);
		}
		if (i_dealresult != null && !i_dealresult.equals("")) {
			dataMap.put("i_dealresult", i_dealresult);
		}
		
		if (orders != null && orderkey != null) {
			dataMap.put("orders", orders);
			dataMap.put("orderkey", orderkey);
		}
		
		if (i_page_recordnum != null && i_pagenum != null) {
			dataMap.put("i_page_recordnum", i_page_recordnum);
			dataMap.put("i_pagenum", i_pagenum);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.bank.companytransferaccountinfo.query";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 4.2.	查询划账信息数据条数以及统计数据
	 * 
	 * @param i_awardcompanyid
	 * @param i_acquirebankid
	 * @param i_targetcompanyid
	 * @param i_unionpaytransferflag
	 * @param i_samebankflag
	 * @param i_bankaccount
	 * @param i_accountname
	 * @param i_accounttype
	 * @param i_begintransfertime
	 * @param i_endtransfertime
	 * @param i_serviceflag
	 * @param i_actualtransferflag
	 * @param i_dealresult
	 * @param i_pagenum
	 * @param i_page_recordnum
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/companytransferaccountinfo_sum", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void companytransferaccountinfo_sum(
			@RequestParam(value = "i_awardcompanyid", required = false) Integer i_awardcompanyid,
			@RequestParam(value = "i_acquirebankid", required = false) Integer i_acquirebankid,
			@RequestParam(value = "i_targetcompanyid", required = false) Integer i_targetcompanyid,
			@RequestParam(value = "i_unionpaytransferflag", required = false) Integer i_unionpaytransferflag,
			@RequestParam(value = "i_samebankflag", required = false) Integer i_samebankflag,
			@RequestParam(value = "i_bankaccount", required = false) String i_bankaccount,
			@RequestParam(value = "i_accountname", required = false) String i_accountname,
			@RequestParam(value = "i_accounttype", required = false) Integer i_accounttype,
			@RequestParam(value = "i_begintransfertime", required = false) String i_begintransfertime,
			@RequestParam(value = "i_endtransfertime", required = false) String i_endtransfertime,
			@RequestParam(value = "i_serviceflag", required = false) Integer i_serviceflag,
			@RequestParam(value = "i_actualtransferflag", required = false) Integer i_actualtransferflag,
			@RequestParam(value = "i_dealresult", required = false) String i_dealresult,
			@RequestParam(value = "orders", required = false) String orders,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			@RequestParam(value = "i_page_recordnum", required = false) Integer i_page_recordnum,
			@RequestParam(value = "i_pagenum", required = false) Integer i_pagenum,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		Map<String, Object> dataMap = new HashMap<String, Object>();

		if (i_awardcompanyid != null && !i_awardcompanyid.equals("")) {
			dataMap.put("i_awardcompanyid", i_awardcompanyid);
		}

		if (i_acquirebankid != null && !i_acquirebankid.equals("")) {
			dataMap.put("i_acquirebankid", i_acquirebankid);
		}

		if (i_targetcompanyid != null && !i_targetcompanyid.equals("")) {
			dataMap.put("i_targetcompanyid", i_targetcompanyid);
		}

		if (i_unionpaytransferflag != null && !i_unionpaytransferflag.equals("")) {
			dataMap.put("i_unionpaytransferflag", i_unionpaytransferflag);
		}
		if (i_samebankflag != null && !i_samebankflag.equals("")) {
			dataMap.put("i_samebankflag", i_samebankflag);
		}

		if (i_bankaccount != null && !i_bankaccount.equals("")) {
			dataMap.put("i_bankaccount", i_bankaccount);
		}

		if (i_accountname != null && !i_accountname.equals("")) {
			dataMap.put("i_accountname", i_accountname);
		}

		if (i_accounttype != null && !i_accounttype.equals("")) {
			dataMap.put("i_accounttype", i_accounttype);
		}
		
		if (i_begintransfertime != null && !i_begintransfertime.equals("")) {
			dataMap.put("i_begintransfertime", i_begintransfertime);
		}
		if (i_endtransfertime != null && !i_endtransfertime.equals("")) {
			dataMap.put("i_endtransfertime", i_endtransfertime);
		}
		if (i_serviceflag != null && !i_serviceflag.equals("")) {
			dataMap.put("i_serviceflag", i_serviceflag);
		}
		if (i_actualtransferflag != null && !i_actualtransferflag.equals("")) {
			dataMap.put("i_actualtransferflag", i_actualtransferflag);
		}
		if (i_dealresult != null && !i_dealresult.equals("")) {
			dataMap.put("i_dealresult", i_dealresult);
		}
		
		if (orders != null && orderkey != null) {
			dataMap.put("orders", orders);
			dataMap.put("orderkey", orderkey);
		}
		
		if (i_page_recordnum != null && i_pagenum != null) {
			dataMap.put("i_page_recordnum", i_page_recordnum);
			dataMap.put("i_pagenum", i_pagenum);
		}
		
		

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.bank.companytransferaccountinfo.sum";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 2.4.	获取银联公司
	 */
	@RequestMapping(value = "/awardcompany_get", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void awardcompany_get(
			HttpServletRequest request, HttpServletResponse response) {
		
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.awardcompany.get";
		
		// 无具体参数，给接口传一个空的json对象{}
		String result = CommomUtil.CallApi(request, serviceName, method, "{}");
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 2.5.	获取银联下属收单行
	 */
	@RequestMapping(value = "/acquirerinfobyawardcompany_query", method = { RequestMethod.POST,RequestMethod.GET })
	public void acquirerinfobyawardcompany_query(
		@RequestParam(value = "awardcompanyid", required = true) Integer awardcompanyid,
		HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> dataMap = new HashMap<String, Object>();
		if (awardcompanyid != null && !awardcompanyid.equals("")) {
			dataMap.put("awardcompanyid", awardcompanyid);
		}
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.acquirerinfobyawardcompany.query";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	
	/**
	 * 6.1.	公司数据查询
	 * @param companyname
	 * @param companytypeid
	 * @param provinceid
	 * @param cityid
	 * @param pagesize
	 * @param pagenum
	 */
	@RequestMapping(value = "/companyinfo_query", method = { RequestMethod.POST,RequestMethod.GET })
	public void companyinfo_query(
		@RequestParam(value="companyname",required=false) String companyname,
		@RequestParam(value = "companytypeid[]", required = false) Integer[] companytypeid,
		@RequestParam(value = "provinceid", required = false) Integer provinceid,
		@RequestParam(value = "cityid", required = false) Integer cityid,
		@RequestParam(value = "pagesize", required = true) Integer pagesize,
		@RequestParam(value = "pagenum", required = true) Integer pagenum,
		HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> dataMap = new HashMap<String, Object>();
		if (companytypeid != null && !companytypeid.equals("")) {
			dataMap.put("companytypeid", companytypeid);
		}
		if(companyname !=null && !companyname.equals("")){
			dataMap.put("companyname",companyname);
		}
		if (provinceid != null && !provinceid.equals("")) {
			dataMap.put("provinceid", provinceid);
		}
		if(cityid !=null && !cityid.equals("")){
			dataMap.put("cityid",cityid);
		}
		if (pagesize != null && pagenum != null) {
			dataMap.put("pagesize", pagesize);
			dataMap.put("pagenum", pagenum);
		}
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.companyinfo.query";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 *6.2.	公司数据添加
	 */
	@RequestMapping(value = "/companyinfo_add", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void companyinfo_add(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.companyinfo.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 *6.3.	公司数据修改
	 */
	@RequestMapping(value = "/companyinfo_modify", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void companyinfo_modify(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.companyinfo.modify";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/***
	 * 6.4.	公司数据删除
	 * @param companyid
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/companyinfo_delete", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void companyinfo_delete(
			@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.companyinfo.delete";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 获取费率通道数据
	 */
	@RequestMapping(value = "/agentsettlementchannel_get", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void agentsettlementchannel_get(
			HttpServletRequest request, HttpServletResponse response) {
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.agentsettlementchannel.get";	
		// 无具体参数，给接口传一个空的json对象{}
		String result = CommomUtil.CallApi(request, serviceName, method, "{}");
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 2.6.	获取公司费率通道
	 */
	@RequestMapping(value = "settlementchannel_query",method ={ RequestMethod.POST,RequestMethod.GET})
	public void settlementchannel_query(
			@RequestParam(value = "pmemberid", required = true) Integer pmemberid,
			@RequestParam(value = "companytypeid", required = true) Integer companytypeid,
			HttpServletRequest request, HttpServletResponse response) {
			Map<String, Object> dataMap = new HashMap<String, Object>();
			if (pmemberid != null && !pmemberid.equals("")) {
				dataMap.put("pmemberid", pmemberid);
			}
			if (companytypeid != null && !companytypeid.equals("")) {
				dataMap.put("companytypeid", companytypeid);
			}
			Gson gson = new Gson();
			String data = gson.toJson(dataMap);
			String serviceName = "rboperationsmanagerService";
			String method = "masget.rboperationsmanager.com.settlementchannel.query";
			String result = CommomUtil.CallApi(request, serviceName, method, data);
			CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 2.7.	获取公司结算价格
	 */
	@RequestMapping(value = "settlementrate_query",method ={ RequestMethod.POST,RequestMethod.GET})
	public void settlementrate_query(
			@RequestParam(value = "pmemberid", required = true) Integer pmemberid,
			@RequestParam(value = "companytypeid", required = true) Integer companytypeid,
			@RequestParam(value = "settlementchannelid", required = true) Integer settlementchannelid,
			HttpServletRequest request, HttpServletResponse response) {
			Map<String, Object> dataMap = new HashMap<String, Object>();
			if (pmemberid != null && !pmemberid.equals("")) {
				dataMap.put("pmemberid", pmemberid);
			}
			if (companytypeid != null && !companytypeid.equals("")) {
				dataMap.put("companytypeid", companytypeid);
			}
			if (settlementchannelid != null && !settlementchannelid.equals("")) {
				dataMap.put("settlementchannelid", settlementchannelid);
			}
			Gson gson = new Gson();
			String data = gson.toJson(dataMap);
			String serviceName = "rboperationsmanagerService";
			String method = "masget.rboperationsmanager.com.settlementrate.query";
			String result = CommomUtil.CallApi(request, serviceName, method, data);
			CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 2.8.	获取基准以上以下提成
	 */
	@RequestMapping(value = "/agentprofitconfig_get", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void agentprofitconfig_get(
			HttpServletRequest request, HttpServletResponse response) {
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.agentprofitconfig.get";	
		// 无具体参数，给接口传一个空的json对象{}
		String result = CommomUtil.CallApi(request, serviceName, method, "{}");
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 查询公司类型id以及公司平台级别
	 */
	@RequestMapping(value ="companytypeplatformlevel_query", method = { RequestMethod.POST, RequestMethod.GET})
	public void companytypeplatformlevel_query(
			@RequestParam(value = "companyid", required = true) Integer companyid,
			HttpServletRequest request, HttpServletResponse response){
		    Map<String,Object> dataMap = new HashMap<String, Object>();
		    if(companyid !=null&& !companyid.equals("")){
		    	dataMap.put("companyid", companyid);
		    }
		    Gson gson = new Gson();
			String data = gson.toJson(dataMap);
			String serviceName = "rboperationsmanagerService";
			String method = "masget.rboperationsmanager.com.companytypeplatformlevel.query";
			String result = CommomUtil.CallApi(request, serviceName, method, data);
			CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 *5.2 单个服务商
	 */
	@RequestMapping(value = "/member_add", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void member_add(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.member.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 单个商户进件2015-11-11
	 */
	@RequestMapping(value="/membernew_add",method = { RequestMethod.POST, RequestMethod.GET})
	public void membernew_add(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response
			){
		String loginData = (String) request.getSession().getAttribute("user_login_data");
		if(loginData == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登陆"));
			return;
		}
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.member.new.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 修改角色菜单资源2015-11-12
	 */
	@RequestMapping(value="/osroleresource_modify",method = { RequestMethod.POST, RequestMethod.GET})
	public void osroleresource_modify(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response
			){
		String loginData = (String) request.getSession().getAttribute("user_login_data");
		if(loginData == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登陆"));
			return;
		}
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.osroleresource.modify";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 获取角色菜单资源2015-11-12--针对修改角色菜单资源
	 * @param companytypeid
	 * @param osenvirnmentid
	 * @param roletypeid 
	 * @param resourcename 
	 * @param pagesize
	 * @param pagenum
	 */
	@RequestMapping(value = "osroleresourcelist_query",method ={ RequestMethod.POST,RequestMethod.GET})
	public void osroleresourcelist_query(
			@RequestParam(value = "companytypeid", required = false) Integer companytypeid,
			@RequestParam(value = "osenvirnmentid", required = false) Integer osenvirnmentid,
			@RequestParam(value = "roletypeid", required = false) Integer roletypeid,
			@RequestParam(value = "resourcename", required = false) String resourcename,
			@RequestParam(value = "pagesize", required = true) Integer pagesize,
			@RequestParam(value = "pagenum", required = true) Integer pagenum,
			HttpServletRequest request, HttpServletResponse response) {
			Map<String, Object> dataMap = new HashMap<String, Object>();
			if (companytypeid != null && !companytypeid.equals("")) {
				dataMap.put("companytypeid", companytypeid);
			}
			if (osenvirnmentid != null && !osenvirnmentid.equals("")) {
				dataMap.put("osenvirnmentid", osenvirnmentid);
			}
			if (roletypeid  != null && !roletypeid .equals("")) {
				dataMap.put("roletypeid", roletypeid );
			}
			if (resourcename  != null && !resourcename .equals("")) {
				dataMap.put("resourcename", resourcename );
			}
			if (pagesize != null && pagenum != null) {
				dataMap.put("pagesize", pagesize);
				dataMap.put("pagenum", pagenum);
			}
			
			Gson gson = new Gson();
			String data = gson.toJson(dataMap);
			String serviceName = "rboperationsmanagerService";
			String method = "masget.rboperationsmanager.com.osroleresource.paging.query";
			String result = CommomUtil.CallApi(request, serviceName, method, data);
			CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 3.2.1商户/服务商信息查询 lhw2015-11-20
	 * @param companyname
	 * @param auditstate
	 * @param begintime 
	 * @param endtime
	 * @param acqinscode
	 * @param agentflag
	 * @param i_page_recordnum
	 * @param pagenum
	 */
	@RequestMapping(value = "auditcompany_query",method ={ RequestMethod.POST,RequestMethod.GET})
	public void auditcompany_query(
			@RequestParam(value = "auditstate", required = false) Integer auditstate,
			@RequestParam(value = "agentflag", required = false) Integer agentflag,
			@RequestParam(value = "companyname", required = false) String companyname,
			@RequestParam(value = "begintime", required = false) String begintime,
			@RequestParam(value = "endtime", required = false) String endtime,
			@RequestParam(value = "i_acqinscode", required = false) String i_acqinscode,
			@RequestParam(value = "pagesize", required = true) Integer pagesize,
			@RequestParam(value = "pagenum", required = true) Integer pagenum,
			HttpServletRequest request, HttpServletResponse response) {
			Map<String, Object> dataMap = new HashMap<String, Object>();
			if (auditstate != null && !auditstate.equals("")) {
				dataMap.put("i_auditstate", auditstate);
			}
			if (agentflag != null && !agentflag.equals("")) {
				dataMap.put("i_agentflag", agentflag);
			}
			if (companyname  != null && !companyname .equals("")) {
				dataMap.put("i_companyname", companyname );
			}
			if (begintime  != null && !begintime .equals("")) {
				dataMap.put("i_begintime", begintime );
			}
			if (endtime  != null && !endtime .equals("")) {
				dataMap.put("i_endtime", endtime );
			}
			if (i_acqinscode  != null && !i_acqinscode .equals("")) {
				dataMap.put("i_acqinscode", i_acqinscode );
			}
			if (pagesize != null && pagenum != null) {
				dataMap.put("i_page_recordnum", pagesize);
				dataMap.put("i_pagenum", pagenum);
			}
			
			Gson gson = new Gson();
			String data = gson.toJson(dataMap);
			String serviceName = "rboperationsmanagerService";
			String method = "masget.rboperationsmanager.com.auditcompany.query";
			String result = CommomUtil.CallApi(request, serviceName, method, data);
			CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 获取所有的收单行数据
	 */
	@RequestMapping(value = "/acquirerinfo_get", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void acquirerinfo_get(
			HttpServletRequest request, HttpServletResponse response) {
		
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.acquirerinfo.get";
		
		// 无具体参数，给接口传一个空的json对象{}
		String result = CommomUtil.CallApi(request, serviceName, method, "{}");
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 5.3.	单个商户/服务商详细信息查看  lhw2015-11-24 
	 * @param companyid
	 */
	@RequestMapping(value = "memberproperty_query",method ={ RequestMethod.POST,RequestMethod.GET})
	public void memberproperty_query(
			@RequestParam(value = "companyid", required = true) String companyid,
			HttpServletRequest request, HttpServletResponse response) {
			Map<String, Object> dataMap = new HashMap<String, Object>();
			if (companyid != null && !companyid.equals("")) {
				dataMap.put("companyid", companyid);
			}
			Gson gson = new Gson();
			String data = gson.toJson(dataMap);
			String serviceName = "rboperationsmanagerService";
			String method = "masget.rboperationsmanager.com.memberproperty.query";
			String result = CommomUtil.CallApi(request, serviceName, method, data);
			CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 5.5.	商户信息审核 lhw2015-11-25 
	 */
	@RequestMapping(value="/memberproperty_audit",method = { RequestMethod.POST, RequestMethod.GET})
	public void memberproperty_audit(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response
			){
		String loginData = (String) request.getSession().getAttribute("user_login_data");
		if(loginData == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登陆"));
			return;
		}
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.memberproperty.audit";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 2.9.	获取取号收单行  lhw2015-11-24 
	 * @param provinceid
	 * @param cityid
	 * @param areaid
	 */
	@RequestMapping(value = "acquirerinfochannel_query",method ={ RequestMethod.POST,RequestMethod.GET})
	public void acquirerinfochannel_query(
			@RequestParam(value = "provinceid", required = true) Integer provinceid,
			@RequestParam(value = "cityid", required = true) Integer cityid,
			@RequestParam(value = "areaid", required = false) Integer areaid,
			HttpServletRequest request, HttpServletResponse response) {
			Map<String, Object> dataMap = new HashMap<String, Object>();
			if (provinceid != null && !provinceid.equals("")) {
				dataMap.put("provinceid", provinceid);
			}
			if (cityid != null && !cityid.equals("")) {
				dataMap.put("cityid", cityid);
			}
			if (areaid != null && !areaid.equals("")) {
				dataMap.put("areaid", areaid);
			}
			Gson gson = new Gson();
			String data = gson.toJson(dataMap);
			String serviceName = "rboperationsmanagerService";
			String method = "masget.rboperationsmanager.com.acquirerinfochannel.query";
			String result = CommomUtil.CallApi(request, serviceName, method, data);
			CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 商户/服务商修改 lhw2015-12-1 
	 */
	@RequestMapping(value="/memberapply_modify",method = { RequestMethod.POST, RequestMethod.GET})
	public void memberapply_modify(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response
			){
		String loginData = (String) request.getSession().getAttribute("user_login_data");
		if(loginData == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登陆"));
			return;
		}
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.memberapply.modify";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
}
