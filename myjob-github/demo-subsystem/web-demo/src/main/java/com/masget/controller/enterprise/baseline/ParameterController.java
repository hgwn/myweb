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
@RequestMapping("enterprise/parameter")
public class ParameterController {
	
	private static Logger logger =Logger.getLogger(ParameterController.class);
	
	/**
	 * 查询商品参数
	 */
	@RequestMapping(value = "/find_parameter", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void find_parameter(
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "parametergroupname", required = false) String parametergroupname,
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
		if (parametergroupname != null && !parametergroupname.equals("")) {
			dataMap.put("parametergroupname", parametergroupname);
		}
		Gson gson = new Gson();
		
		String data = gson.toJson(dataMap);
		String method = "masget.enterprise.baseline.parameter.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 增加商品参数
	 */
	@RequestMapping(value = "/add_parameter", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void add_parameter(
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
		String method = "masget.enterprise.baseline.parameter.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
		logger.info(result);
	}
	
	/**
	 * 删除商品参数
	 */
	
	@RequestMapping(value = "/del_parameter", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void del_parameter(
			@RequestParam(value = "parametergroupid", required = false) String parametergroupid,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();		
		dataMap.put("parametergroupid", parametergroupid);
		
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);

		String serviceName = "enterpriseService";
		String method = "masget.enterprise.baseline.parameter.delete";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
		logger.info(data);
	}
	
	/**
	 * 修改商品参数
	 * 
	 */
	@RequestMapping(value = "/modify_parameter", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void modify_parameter(
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
		String method = "masget.enterprise.baseline.parameter.modify";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
		logger.info(data);
	}
		
}
