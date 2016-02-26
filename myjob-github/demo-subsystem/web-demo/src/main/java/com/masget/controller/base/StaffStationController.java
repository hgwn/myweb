package com.masget.controller.base;

import java.util.HashMap;
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

/**
 * 站点Controller
 * @author cxq
 *
 */
@Controller
@RequestMapping("base/staffstation")
public class StaffStationController{

	
	/**
	 * 获取登录人站点信息
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/list",method={RequestMethod.GET,RequestMethod.POST})
	public void list(HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.staffstations.getswitchable";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	/**
	 * 获取员工未分配工作站点
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/getstation",method={RequestMethod.GET,RequestMethod.POST})
	public void getStation(
			@RequestParam(value="workingstaffid",required=true) String workingstaffid,
			HttpServletRequest request, HttpServletResponse response) {
		
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		//获取参数转成json格式
		JSONObject jsonObject = JSONObject.fromObject(login_data);
		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);
		dataMap.put("workingstaffid", workingstaffid);
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.staffstations.getuseable";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 获取员工已经分配工作站点
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/getHasStation",method={RequestMethod.GET,RequestMethod.POST})
	public void getHasStation(
			@RequestParam(value="workingstaffid",required=true) String workingstaffid,
			@RequestParam(value="staffcompanyid",required=true) String staffcompanyid,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("companyid", staffcompanyid);
		dataMap.put("workingstaffid", workingstaffid);
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.staffstations.getstaffsite";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 获取员工信息 
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/getstaff",method={RequestMethod.GET,RequestMethod.POST})
	public void getStaff(
			@RequestParam(value="pageNum",required=true) String pageNum,
			@RequestParam(value="pageSize",required=true) String pageSize,
			HttpServletRequest request, HttpServletResponse response) {
		
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		//获取参数转成json格式
		JSONObject jsonObject = JSONObject.fromObject(login_data);
		String logisticid = jsonObject.get("companyid").toString();
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("companyid", logisticid);
		dataMap.put("pagenum", pageNum);
		dataMap.put("pagesize", pageSize);
		dataMap.put("showme", 1);//showme=1,不查找当前登录用户
		
		String data=new Gson().toJson(dataMap);
		String method="masget.base.com.companystaff.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 分配员工工作站点
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/add",method={RequestMethod.GET,RequestMethod.POST})
	public void add(
			@RequestParam(value="staffstations",required=false) String staffstations,
			@RequestParam(value="cancelstations",required=false) String cancelstations,
			HttpServletRequest request, HttpServletResponse response) {
		
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String result="";
		String method="masget.base.com.staffstations.add";
		
		//删除员工的工作站点
		if(cancelstations!=null&&!"".equals(cancelstations)&&!"[]".equals(cancelstations)){
			String delmethod="masget.base.com.staffstations.delete";
			result= CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, delmethod, "{\"staffstations\":"+cancelstations+"}");
	
			JSONObject jsonObject = JSONObject.fromObject(result);
			String ret = jsonObject.get("ret").toString();
			
			if("0".equals(ret)&&staffstations!=null&&!"".equals(staffstations)){//删除接口执行成功再执行添加站点接口
				result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, "{\"staffstations\":"+staffstations+"}");
			}
		}else{
			result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, "{\"staffstations\":"+staffstations+"}");
		}
		
		CommomUtil.writeResultBack(request, response, result);
	}
}
