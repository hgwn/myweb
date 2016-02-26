package com.masget.controller.enterprise.baseline;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;

@Controller
@RequestMapping("enterprise/baseline/goods")
public class GoodsBaselineController {

	Gson gson = null;
	
	public GoodsBaselineController(){
		gson = new Gson();
	}
	@RequestMapping(value = "/get")
	public void get(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!CommomUtil.checkLogin(request, response)){
			return ;
		}
		JSONObject obj = JSONObject.fromObject(data);
		String method = "masget.enterprise.baseline.goods.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 查供应商商品，不考虑规格
	 */
	@RequestMapping(value = "/getExternal")
	public void getExternal(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!CommomUtil.checkLogin(request, response)){
			return ;
		}
		JSONObject obj = JSONObject.fromObject(data);
		String method = "masget.enterprise.baseline.goods.external.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		CommomUtil.writeResultBack(request, response, result);
	}
}
