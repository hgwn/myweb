package com.masget.controller.base;

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
import com.masget.util.CommomUtil;

/**
 * 员工Controller
 * @author lgn
 *
 */
@Controller
@RequestMapping("/base/companystaff")
public class CompanystaffController {
	
	/**
	 * 根据条件 查询员工
	 */
	@RequestMapping(value="/getcompanystaff",method={RequestMethod.POST,RequestMethod.GET})
	public void getcompanystaff(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		HttpSession httpSession = request.getSession(false);
		if(httpSession == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		
		JSONObject obj = JSONObject.fromObject(data);
		
		if(obj.get("companyid")==null){
			String login_data = (String) httpSession.getAttribute("user_login_data");
			JSONObject jsonObject=JSONObject.fromObject(login_data);
			String companyid=jsonObject.get("companyid").toString();
			obj.put("companyid", companyid);
		}
		
		
		String serviceName="baseService";
		
		String method="masget.base.com.companystaff.get";
		
        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
				CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(data);
		
		System.out.println(result);
	}
	
	/**
	 * 根据条件 查询当前站点员工(不包括自己 和管理员)
	 */
	@RequestMapping(value="/getcompanystaffwithout",method={RequestMethod.POST,RequestMethod.GET})
	public void getcompanystaffwithout(
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
		String companyid=jsonObject.get("companyid").toString();
		
		JSONObject obj = JSONObject.fromObject(data);
		obj.put("companyid", companyid);
		
		String serviceName="baseService";
		
		String method="masget.base.com.companystaff.getwithout";
		
        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(data);
		
		System.out.println(result);
	}
	
	/**
	 * 根据条件 查询员工
	 */
	@RequestMapping(value="/getonestaff",method={RequestMethod.POST,RequestMethod.GET})
	public void getonestaff(
			@RequestParam(value="companyid",required=false) String companyid,
			@RequestParam(value="staffid",required=false) String staffid,
			HttpServletRequest request, HttpServletResponse response)
	{
				
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("companyid", companyid);
		dataMap.put("staffid", staffid);
		
		String data=new Gson().toJson(dataMap);
		
		String serviceName="baseService";
		
		String method="masget.base.com.companystaff.getstaff";
		
        String result = CommomUtil.CallApi(request, serviceName, method, data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(data);
		
		System.out.println(result);
	}
	
	/**
	 * 查询员工信息
	 */
	@RequestMapping(value="/get",method={RequestMethod.POST,RequestMethod.GET})
	public void get(
			@RequestParam(value="stationid",required=false) String stationid,
			@RequestParam(value="roletypeid",required=false) String roletypeid,
			@RequestParam(value="staffname",required=false) String staffname,
			@RequestParam(value="mobilephone",required=false) String mobilephone,
			@RequestParam(value="pageSize",required=true) String pageSize,
			@RequestParam(value="pageNum",required=true) String pageNum,
			HttpServletRequest request, HttpServletResponse response)
	{
		HttpSession httpSession = request.getSession(false);
		String login_data = (String) httpSession.getAttribute("user_login_data");
		JSONObject jsonObject=JSONObject.fromObject(login_data);
		String companyid=jsonObject.get("companyid").toString();
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		dataMap.put("companyid", companyid);
		dataMap.put("pagesize", pageSize);
		dataMap.put("pagenum", pageNum);
		
		if(stationid!=null&&!stationid.trim().equals("")){
			dataMap.put("stationid", stationid);
		}
		
		if(roletypeid!=null&&!roletypeid.trim().equals("")){
			dataMap.put("roletypeid", roletypeid);
		}
		
		if(staffname!=null&&!staffname.trim().equals("")){
			dataMap.put("staffname", staffname);
		}
		
		if(mobilephone!=null&&!mobilephone.trim().equals("")){
			dataMap.put("mobilephone", mobilephone);
		}
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.companystaff.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 修改员工信息
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/update",method={RequestMethod.GET,RequestMethod.POST})
	public void update(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
			JSONObject obj = JSONObject.fromObject(data);
			
			String method="masget.base.com.companystaff.modify";
			
	        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
	        
//	        try {
//				String SMSdata = Base64Method.EncryptBase64(obj.toString());
//				//result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, SMSdata);
//				base service = (base)WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext())
//						.getBean(CommomUtil.BASE_SERVICE);
//				result = service.doPostForWeb("", method, SMSdata);
//			} catch (Exception e) {
//				e.printStackTrace();
//			}
	        
			CommomUtil.writeResultBack(request, response, result);
			
			System.out.println(result);
	}
	
	/**
	 * 新增员工信息
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/add",method={RequestMethod.GET,RequestMethod.POST})
	public void add(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		
		JSONObject obj = JSONObject.fromObject(data);
		obj.put("loginname", obj.getString("loginname").trim());
		
		String method="masget.base.com.companystaff.add";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 获取角色类型
	 */
	@RequestMapping(value="/getcompanyroletype",method={RequestMethod.POST,RequestMethod.GET})
	public void getcompanyroletype(
			HttpServletRequest request, HttpServletResponse response)
	{
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		String data=new Gson().toJson(dataMap);
		
		String serviceName="baseService";
		
		String method="masget.base.com.companyroletype.get";
		
        String result = CommomUtil.CallApi(request, serviceName, method, data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(data);
		
		System.out.println(result);
	}
	
	/**
	 * 获取站点信息
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/StationList",method={RequestMethod.GET,RequestMethod.POST})
	public void list(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
			JSONObject obj = JSONObject.fromObject(data);
			
			String method="masget.base.com.station.getlist";
			
	        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
	        
			CommomUtil.writeResultBack(request, response, result);
			
		System.out.println(result);
	}
	
}

