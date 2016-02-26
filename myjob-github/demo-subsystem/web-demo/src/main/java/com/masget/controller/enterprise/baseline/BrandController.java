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
@RequestMapping("enterprise/brand")
public class BrandController {
	
	private static Logger logger =Logger.getLogger(BrandController.class);
	
	/**
	 * 查询商品品牌
	 */
	@RequestMapping(value = "/find_brand", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void find_brand(
			@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "pagenum", required = false) Integer pagenum,
			@RequestParam(value = "brandname", required = false) String brandname,
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
		if (brandname != null && !brandname.equals("")) {
			dataMap.put("brandname", brandname);
		}
		Gson gson = new Gson();
		
		String data = gson.toJson(dataMap);
		String method = "masget.enterprise.baseline.brand.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 增加商品品牌
	 */
	@RequestMapping(value = "/add_brand", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void add_brand(
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
		String method = "masget.enterprise.baseline.brand.add";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
		logger.info(result);
	}
	
	
	/**
	 * 删除商品品牌
	 */
	
	@RequestMapping(value = "/del_brand", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void del_brand(
			@RequestParam(value = "brandid", required = false) String brandid,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();		
		dataMap.put("brandid", brandid);
		
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);

		String serviceName = "enterpriseService";
		String method = "masget.enterprise.baseline.brand.delete";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
		logger.info(data);
	}
	
	/**
	 * 修改商品品牌
	 * 
	 */
	@RequestMapping(value = "/modify_brand", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void modify_brand(
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
		String method = "masget.enterprise.baseline.brand.modify";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
		logger.info(data);
	}
		
}
