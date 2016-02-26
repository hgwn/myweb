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
@RequestMapping("enterprise/category")
public class CategoryController {
	
	private static Logger logger =Logger.getLogger(CategoryController.class);

	
	/**
	 * 查询商品分类
	 */
	@RequestMapping(value = "/find_category", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void find_category(
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "categoryname", required = false) String categoryname,
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
		if (categoryname != null && !categoryname.equals("")) {
			dataMap.put("categoryname", categoryname);
		}
		Gson gson = new Gson();
		
		String data = gson.toJson(dataMap);
		String method = "masget.enterprise.baseline.category.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 增加商品分类
	 */
	@RequestMapping(value = "/add_category", method = { RequestMethod.POST,
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
		String method = "masget.enterprise.baseline.category.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
		logger.info(result);
	}
	
	/**
	 * 修改商品分类
	 * 
	 */
	@RequestMapping(value = "/modify_category", method = { RequestMethod.POST,
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
		String method = "masget.enterprise.baseline.category.modify";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
		logger.info(data);
	}
	
	/**
	 * 删除商品分类
	 */
	
	@RequestMapping(value = "/del_category", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void del_parameter(
			@RequestParam(value = "categoryid", required = false) String categoryid,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();		
		dataMap.put("categoryid", categoryid);
		
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);

		String serviceName = "enterpriseService";
		String method = "masget.enterprise.baseline.category.delete";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
		logger.info(data);
	}
}
