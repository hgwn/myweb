package com.masget.controller.base;

import java.util.HashMap;
import java.util.List;
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
import com.google.gson.reflect.TypeToken;
import com.masget.entity.RetStruct;
import com.masget.util.CommomUtil;
import com.masget.util.ObjectParser;

/**
 * 站点Controller
 * 
 * @author lgn
 * 
 */
@Controller
@RequestMapping("/base/stationdatum")
public class StationDatumController {

	/**
	 * 获取站点信息
	 * 
	 * @param request
	 *            请求对象
	 * @param response
	 *            响应对象
	 */
	@RequestMapping(value = "/list", method = { RequestMethod.GET,
			RequestMethod.POST })
	public void list(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

		JSONObject obj = JSONObject.fromObject(data);

		String method = "masget.base.com.station.gettrees";

		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,
				method, obj.toString());

		if (result != null) {
			RetStruct retStruct = new Gson().fromJson(result, RetStruct.class);
			if (retStruct.getData() != null) {
				result = new Gson().toJson(retStruct.getData().getRows());
			}
		}

		CommomUtil.writeResultBack(request, response, result);

		System.out.println(result);
	}

	/**
	 * 获取站点信息
	 * 
	 * @param request
	 *            请求对象
	 * @param response
	 *            响应对象
	 */
	@RequestMapping(value = "/getrecusive", method = { RequestMethod.GET,
			RequestMethod.POST })
	public void getrecusive(
			@RequestParam(value = "stationid", required = false) Long stationid,
			@RequestParam(value = "pstationid", required = false) Long pstationid,
			@RequestParam(value = "companyid", required = false) Long companyid,
			@RequestParam(value = "stationtypeid", required = false) Integer stationtypeid,
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

		if (stationid != null && !stationid.equals("")) {
			dataMap.put("stationid", stationid);
		}

		if (pstationid != null && !pstationid.equals("")) {
			dataMap.put("pstationid", pstationid);
		}

		if (companyid != null && !companyid.equals("")) {
			dataMap.put("companyid", companyid);
		}

		if (stationtypeid != null && !stationtypeid.equals("")) {
			dataMap.put("stationtypeid", stationtypeid);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "baseService";
		String method = "masget.base.com.station.getrecusive";
		String result = CommomUtil.CallApi(request, serviceName, method, data);

		List<Map<String, Object>> stations = gson.fromJson(result,
				new TypeToken<List<Map<String, Object>>>() {
				}.getType());
		 
		
		String treeresult = "[{\"id\":"+Long.parseLong(jsonObject.get("stationid").toString())+",\"title\":\""+jsonObject.get("stationname").toString()+"\",\"items\":";
		String node = createStationNode(
				ObjectParser.toLong(jsonObject.get("stationid")),
				stations);
		treeresult = treeresult + node + "}]";
		treeresult="{\"ret\":0,\"rows\":"+treeresult+"}";
		CommomUtil.writeResultBack(request, response, treeresult);
	}

	private String createStationNode(long parestationid,
			List<Map<String, Object>> stations) {

		String temp = "[";

		int count=0;
		for (Map<String, Object> obj : stations) {
		
			if(	ObjectParser.toLong(obj.get("pstationid"))==parestationid){
				temp=temp+"{\"id\":"+obj.get("stationid")+",\"title\":\""+obj.get("stationname")+"\",\"items\":"+createStationNode(ObjectParser.toLong(obj.get("stationid")),stations)+" }";
				if(count<stations.size()-1){
					temp=temp+",";
				}
			}
			count++;
		}
		
		temp = temp + "]";
		return temp;
	}

	/**
	 * 获取父站点信息
	 * 
	 * @param request
	 *            请求对象
	 * @param response
	 *            响应对象
	 */
	@RequestMapping(value = "/plist", method = { RequestMethod.GET,
			RequestMethod.POST })
	public void plist(
			@RequestParam(value = "companyid", required = false) String companyid,
			@RequestParam(value = "id", required = false) String id,
			HttpServletRequest request, HttpServletResponse response) {

		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", companyid);
		dataMap.put("id", id);

		String data = new Gson().toJson(dataMap);

		String method = "masget.base.com.station.gettrees";

		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,
				method, data);

		CommomUtil.writeResultBack(request, response, result);

	}
	
	
	/**
	 * 获取父站点信息
	 * 
	 * @param request
	 *            请求对象
	 * @param response
	 *            响应对象
	 */
	@RequestMapping(value = "/plistData", method = { RequestMethod.GET,
			RequestMethod.POST })
	public void plistData(
			@RequestParam(value = "companyid", required = false) String companyid,
			@RequestParam(value = "id", required = false) String id,
			HttpServletRequest request, HttpServletResponse response) {

		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", companyid);
		dataMap.put("id", id);

		String data = new Gson().toJson(dataMap);

		String method = "masget.base.com.station.gettrees";

		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,
				method, data);

		if (result != null) {
			RetStruct retStruct = new Gson().fromJson(result, RetStruct.class);
			if (retStruct.getData() != null) {
				result = new Gson().toJson(retStruct.getData().getRows());
			}
		}
		CommomUtil.writeResultBack(request, response, result);

		System.out.println(result);
	}
	
	/**
	 * 获取父站点信息
	 * 
	 * @param request
	 *            请求对象
	 * @param response
	 *            响应对象
	 */
	@RequestMapping(value = "/plData", method = { RequestMethod.GET,
			RequestMethod.POST })
	public void plData(
			@RequestParam(value = "companyid", required = false) String companyid,
			@RequestParam(value = "id", required = false) String id,
			HttpServletRequest request, HttpServletResponse response) {

		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", companyid);
		dataMap.put("id", id);

		String data = new Gson().toJson(dataMap);

		String method = "masget.base.com.station.gettrees";

		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,
				method, data);

		CommomUtil.writeResultBack(request, response, result);

		System.out.println(result);
	}


	/**
	 * 修改站点信息
	 * 
	 * @param request
	 *            请求对象
	 * @param response
	 *            响应对象
	 */
	@RequestMapping(value = "/update", method = { RequestMethod.GET,
			RequestMethod.POST })
	public void update(
			@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request, HttpServletResponse response) {

		JSONObject obj = JSONObject.fromObject(data);

		String method = "masget.base.com.station.modify";

		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,
				method, obj.toString());

		CommomUtil.writeResultBack(request, response, result);

		System.out.println(result);
	}

	/**
	 * 新增站点信息
	 * 
	 * @param request
	 *            请求对象
	 * @param response
	 *            响应对象
	 */
	@RequestMapping(value = "/add", method = { RequestMethod.GET,
			RequestMethod.POST })
	public void add(@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request, HttpServletResponse response) {

		JSONObject obj = JSONObject.fromObject(data);

		String method = "masget.base.com.station.add";

		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,
				method, obj.toString());

		CommomUtil.writeResultBack(request, response, result);

		System.out.println(result);
	}

	/**
	 * 删除站点信息
	 * 
	 * @param request
	 *            请求对象
	 * @param response
	 *            响应对象
	 */
	@RequestMapping(value = "/delete", method = { RequestMethod.GET,
			RequestMethod.POST })
	public void delete(
			@RequestParam(value = "mstationid", required = true) String mstationid,
			HttpServletRequest request, HttpServletResponse response) {

		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("mstationid", mstationid);

		String data = new Gson().toJson(dataMap);

		String method = "masget.base.com.station.delete";

		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,
				method, data);

		CommomUtil.writeResultBack(request, response, result);

		System.out.println(result);
	}

	/**
	 * 获取站点类型信息
	 * 
	 * @param request
	 *            请求对象
	 * @param response
	 *            响应对象
	 */
	@RequestMapping(value = "/stationtype", method = { RequestMethod.GET,
			RequestMethod.POST })
	public void stationtype(HttpServletRequest request,
			HttpServletResponse response) {

		Map<String, Object> dataMap = new HashMap<String, Object>();

		String data = new Gson().toJson(dataMap);

		String method = "masget.base.com.stationtype.get";

		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,
				method, data);

		CommomUtil.writeResultBack(request, response, result);

		System.out.println(result);
	}

	/**
	 * 根据条件 合作关系查询
	 */
	@RequestMapping(value = "/getcompanyrelation", method = {
			RequestMethod.POST, RequestMethod.GET })
	public void getcompanyrelation(HttpServletRequest request,
			HttpServletResponse response) {

		HttpSession httpSession = request.getSession(false);
		if (httpSession == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession
				.getAttribute("user_login_data");
		JSONObject jsonObject = JSONObject.fromObject(login_data);
		String companyid = jsonObject.get("companyid").toString();
		String stationid = jsonObject.get("stationid").toString();
		String staffid = jsonObject.get("staffid").toString();

		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", companyid);
		dataMap.put("stationid", stationid);
		dataMap.put("staffid", staffid);

		String data = new Gson().toJson(dataMap);

		String serviceName = "baseService";

		String method = "masget.base.com.companyrelation.getlist";

		String result = CommomUtil.CallApi(request, serviceName, method, data);

		CommomUtil.writeResultBack(request, response, result);

		System.out.println(data);

		System.out.println(result);
	}

	/**
	 * 查询单个站点的信息
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value = "/getOneStation", method = { RequestMethod.GET,
			RequestMethod.POST })
	public void getOneStation(
			@RequestParam(value = "stationid", required = true) String stationid,
			HttpServletRequest request, HttpServletResponse response) {

		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("stationid", stationid);

		String data = new Gson().toJson(dataMap);

		String method = "masget.base.com.companystations.get";

		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,
				method, data);

		CommomUtil.writeResultBack(request, response, result);

		System.out.println(result);
	}
	
	/**
	 * 根据权限
	 * 查询站点的信息
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value = "/getCompetenceStation", method = { RequestMethod.GET,RequestMethod.POST })
	public void getCompetenceStation(
			HttpServletRequest request, HttpServletResponse response) {

		Map<String, Object> dataMap = new HashMap<String, Object>();

		String data = new Gson().toJson(dataMap);
		
		String method = "masget.base.com.station.get";

		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method,data);

		CommomUtil.writeResultBack(request, response, result);

		System.out.println(result);
	}
}
