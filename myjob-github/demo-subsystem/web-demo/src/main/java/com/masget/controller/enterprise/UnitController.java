package com.masget.controller.enterprise;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.entity.RetStruct;
import com.masget.util.CommomUtil;


/**
 * 开单控制器
 * @author lh
 */
@Controller
@RequestMapping("enterprise/unit")
public class UnitController {
	private Map<String,Object> dataMap = null;
	private String params = null;
			
	@RequestMapping(method=RequestMethod.GET)
	public String show(
			HttpServletRequest request, HttpServletResponse response){	
		return "enterprise/unit/unit";
	}
	
	/*
	 *新增商品单位信息 
	 */
	@RequestMapping(value="/addGoodsUnit",method={RequestMethod.POST,RequestMethod.GET})
	public void addGoodsUnit(			
			@RequestParam(value="goodsunitname",required=true) String goodsunitname,
			HttpServletRequest request,HttpServletResponse response){
		dataMap = new HashMap<String,Object>();
		
		dataMap.put("goodsunitname", goodsunitname);
		
		params = new Gson().toJson(dataMap);
		String result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goodsunit.add",params);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 查询商品单位信息
	 */
	@RequestMapping(value="/listGoodsUnit",method={RequestMethod.POST,RequestMethod.GET})
	public void listGoodsUnit(
			@RequestParam(value="pagesize",required=false) Integer pagesize,
			@RequestParam(value="pagenum",required=false) Integer pagenum,
			HttpServletRequest request, HttpServletResponse response){	
		dataMap = new HashMap<String,Object>();
		dataMap.put("pagesize", pagesize);
		dataMap.put("pagenum", pagenum);
		
		params = new Gson().toJson(dataMap);
		String result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goodsunit.get",params);
		CommomUtil.writeResultBack(request, response, result);		
	}
	
	/**
	 * 删除
	 */
	@RequestMapping("/delete.do")
	public void delete(
			@RequestParam(value="goodsunitid",required=false) String goodsunitid,	
		HttpServletRequest request,HttpServletResponse response){
		dataMap = new HashMap<String,Object>();
		dataMap.put("goodsunitid", goodsunitid);	
		
		params = new Gson().toJson(dataMap);
		String result = CommomUtil.CallApi(request, "enterpriseService", "masget.enterprise.com.goodsunit.del", params);						
		CommomUtil.writeResultBack(request, response, result);
	}
}
