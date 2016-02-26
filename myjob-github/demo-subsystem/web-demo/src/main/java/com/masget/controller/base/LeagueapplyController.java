package com.masget.controller.base;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.masget.util.CommomUtil;

/**
 * 加盟管理Controller
 * @author lgn
 *
 */
@Controller
@RequestMapping("/base/leagueapply")
public class LeagueapplyController {
	/**
	 * 加盟申请
	 */
	@RequestMapping(value="/join",method={RequestMethod.POST,RequestMethod.GET})
	public void join(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		JSONObject obj = JSONObject.fromObject(data);
		
		String serviceName="baseService";
		
		String method="masget.base.com.leagueapply.join";
		
        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 解盟
	 */
	@RequestMapping(value="/leave",method={RequestMethod.POST,RequestMethod.GET})
	public void leave(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		JSONObject obj = JSONObject.fromObject(data);
		
		String serviceName="baseService";
		
		String method="masget.base.com.platformmember.leave";
		
        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}

	/**
	 * 加盟审核
	 */
	@RequestMapping(value="/audit",method={RequestMethod.POST,RequestMethod.GET})
	public void audit(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		JSONObject obj = JSONObject.fromObject(data);
		
		String serviceName="baseService";
		
		String method="masget.base.com.leagueapply.audit";
		
        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 加盟资料查询
	 */
	@RequestMapping(value="/get",method={RequestMethod.POST,RequestMethod.GET})
	public void get(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		JSONObject obj = JSONObject.fromObject(data);
		
		String serviceName="baseService";
		
		String method="masget.base.com.leagueapply.get";
		
        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 已加盟平台查询
	 */
	@RequestMapping(value="/getplat",method={RequestMethod.POST,RequestMethod.GET})
	public void getplat(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		JSONObject obj = JSONObject.fromObject(data);
		
		String serviceName="baseService";
		
		String method="masget.base.com.platformmember.get";
		
        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
}
