package com.masget.controller.base;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.masget.util.CommomUtil;

/**
 * 员工资源裁剪Controller
 * @author lyt
 *
 */
@Controller
@RequestMapping("base/clip")
public class ClippingResource{

	/**
	 * 查询员工追加资源
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/list",method={RequestMethod.GET,RequestMethod.POST})
	public void list(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession httpSession = request.getSession(false);
		if(httpSession == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession.getAttribute("user_login_data");
		JSONObject jsonObject=JSONObject.fromObject(login_data);
		String companyid=jsonObject.get("companyid").toString();
		String companytypeid=jsonObject.get("companytypeid").toString();
		JSONObject obj = JSONObject.fromObject(data);
		
		obj.put("companyid", companyid);
		
		obj.put("saasid", companytypeid);
		String method="masget.base.com.addtionalresource.getds";
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method,  obj.toString());
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	
	/**
	 * 查询员工追加资源(第二个方案)
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/getstaff",method={RequestMethod.GET,RequestMethod.POST})
	public void getstaff(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession httpSession = request.getSession(false);
		if(httpSession == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession.getAttribute("user_login_data");
		JSONObject jsonObject=JSONObject.fromObject(login_data);
		String companyid=jsonObject.get("companyid").toString();
		String companytypeid=jsonObject.get("companytypeid").toString();
		JSONObject obj = JSONObject.fromObject(data);
		
		obj.put("companyid", companyid);
		
		obj.put("saasid", companytypeid);
		String method="masget.base.com.userresource.getstaff";
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method,  obj.toString());
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	/**
	 * 查询员工追加资源(第二个方案)
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/getdisstaff",method={RequestMethod.GET,RequestMethod.POST})
	public void getdisstaff(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession httpSession = request.getSession(false);
		if(httpSession == null){
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		String login_data = (String) httpSession.getAttribute("user_login_data");
		JSONObject jsonObject=JSONObject.fromObject(login_data);
		String companyid=jsonObject.get("companyid").toString();
		String companytypeid=jsonObject.get("companytypeid").toString();
		JSONObject obj = JSONObject.fromObject(data);
		
		obj.put("companyid", companyid);
		
		obj.put("saasid", companytypeid);
		String method="masget.base.com.userresource.getdisstaff";
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method,  obj.toString());
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	
	
	
	
	
	
	
	/**
	 * 裁剪员工资源
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/delete",method={RequestMethod.GET,RequestMethod.POST})
	public void delete(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.base.com.clippingresource.add";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method,  data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	/**
	 * 追加员工资源
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/add",method={RequestMethod.GET,RequestMethod.POST})
	public void add(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.base.com.addtionalresource.add";
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method,  data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
}
