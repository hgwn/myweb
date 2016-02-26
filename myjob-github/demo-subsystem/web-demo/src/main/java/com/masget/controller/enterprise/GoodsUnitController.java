package com.masget.controller.enterprise;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.alibaba.dubbo.common.json.JSONArray;
import com.masget.util.CommomUtil;

@Controller
@RequestMapping("/enterprise/goodsunit")
public class GoodsUnitController {
	@RequestMapping("/get")
	public void get(HttpServletRequest request,HttpServletResponse response){
		try{
			String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, "masget.enterprise.com.goodsunit.get", "{}");
			CommomUtil.writeResultBack(request, response, result);			
		}catch(Exception e){
			CommomUtil.writeResultBack(request, response, e.getMessage());
		}
	}

	@RequestMapping("/del")
	public void delete(
			@RequestParam(value="goodsunitid",required=true) Long goodsunitid,
			HttpServletRequest request,HttpServletResponse response){
		try{
			JSONObject obj = new JSONObject();
			obj.put("goodsunitid", goodsunitid);
			
			String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, "masget.enterprise.com.goodsunit.del", obj.toString());
			CommomUtil.writeResultBack(request, response, result);			
		}catch(Exception e){
			CommomUtil.writeResultBack(request, response, e.getMessage());
		}
	}

	@RequestMapping("/update")
	public void update(
			@RequestParam(value="goodsunitid",required=true) Long goodsunitid,
			@RequestParam(value="goodsunitname",required=true) String goodsunitname,
			HttpServletRequest request,HttpServletResponse response){
		try{
			JSONObject obj = new JSONObject();
			obj.put("goodsunitid", goodsunitid);
			obj.put("goodsunitname", goodsunitname);
			
			String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, "masget.enterprise.com.goodsunit.update", obj.toString());
			CommomUtil.writeResultBack(request, response, result);			
		}catch(Exception e){
			CommomUtil.writeResultBack(request, response, e.getMessage());
		}
	}
	
	@RequestMapping("/add")
	public void add(
			@RequestParam(value="goodsunitname",required=true) String goodsunitname,
			HttpServletRequest request,HttpServletResponse response){
		try{
			JSONObject obj = new JSONObject();
			obj.put("goodsunitname", goodsunitname);
			
			String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, "masget.enterprise.com.goodsunit.add", obj.toString());
			CommomUtil.writeResultBack(request, response, result);			
		}catch(Exception e){
			CommomUtil.writeResultBack(request, response, e.getMessage());
		}
	}
}
