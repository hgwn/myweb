package com.masget.controller.base;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.masget.util.CommomUtil;

/**
 * 公司资源裁剪Controller
 * @author lyt
 *
 */
@Controller
@RequestMapping("base/cmpclip")
public class CompanyClippingResource{
	/**
	 * 查询追加资源列表
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/ddtionalList",method={RequestMethod.GET,RequestMethod.POST})
	public void ddtionalList(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) {
		

		String method="masget.base.com.cmpaddtionalresource.getds";
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 查询公司资源列表
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/resourceList",method={RequestMethod.GET,RequestMethod.POST})
	public void resourceList(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) {
		

		String method="masget.base.com.userresource.getadmin";
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method,  data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	/**
	 * 裁剪公司资源
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/delete",method={RequestMethod.GET,RequestMethod.POST})
	public void delete(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.base.com.cmpclippingresource.add";
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method,  data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	/**
	 * 追加公司资源
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/add",method={RequestMethod.GET,RequestMethod.POST})
	public void add(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.base.com.cmpaddtionalresource.add";
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method,  data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
}
