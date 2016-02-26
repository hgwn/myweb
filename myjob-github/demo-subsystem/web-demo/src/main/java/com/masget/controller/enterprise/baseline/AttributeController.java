package com.masget.controller.enterprise.baseline;

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
import com.masget.util.CommomUtil;

@Controller
@RequestMapping("enterprise/attribute")
public class AttributeController {
	
	private static Logger logger =Logger.getLogger(AttributeController.class);
	
	/**
	 * 查询商品属性
	 */
	@RequestMapping(value = "/find_attribute", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void find_attribute(
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "attributename", required = false) String attributename,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		Map<String, Object> dataMap = new HashMap<String, Object>();
		
		if (pagesize != null && !pagesize.equals("")) {
			dataMap.put("pagesize", pagesize);
		}
		if (pagenum != null && !pagenum.equals("")) {
			dataMap.put("pagenum", pagenum);
		}
		if (attributename != null && !attributename.equals("")) {
			dataMap.put("attributename", attributename);
		}
		Gson gson = new Gson();
		
		String data = gson.toJson(dataMap);
		String method = "masget.enterprise.baseline.attribute.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 增加商品属性
	 */
	@RequestMapping(value = "/add_attribute", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void add_attribute(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		String serviceName = "enterpriseService";
		String method = "masget.enterprise.baseline.attribute.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
		logger.info(result);
	}
	
	
	/**
	 * 删除商品属性
	 */
	
	@RequestMapping(value = "/del_attribute", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void del_attribute(
			@RequestParam(value = "attributeid", required = false) String attributeid,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();		
		dataMap.put("attributeid", attributeid);
		
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);

		String serviceName = "enterpriseService";
		String method = "masget.enterprise.baseline.attribute.delete";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
		logger.info(data);
	}
	
	/**
	 * 修改商品规属性
	 * 
	 */
	@RequestMapping(value = "/modify_attribute", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void modify_attribute(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		String serviceName = "enterpriseService";
		String method = "masget.enterprise.baseline.attribute.modify";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
		logger.info(data);
	}
		
}
