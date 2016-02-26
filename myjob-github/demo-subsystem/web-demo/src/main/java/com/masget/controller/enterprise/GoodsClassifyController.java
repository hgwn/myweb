package com.masget.controller.enterprise;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.*;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;

/**
 * 商品分类控制器
 * @author ChenJinxing
 * @since 2015-6-18
 */
@Controller
@RequestMapping("/enterprise/goodsclassify")
public class GoodsClassifyController {
	private Map<String,Object> dataMaps = null;
	private String params = "";
	private String result = "";

	/**
	 * 通过父节点id获取商品分类信息
	 * @param parentid 商品分类信息父节点id
	 * @param request
	 * @param response
	 */
	@RequestMapping("/get")
	public void get(
			@RequestParam(value="parentid",required=false) String parentid,
			HttpServletRequest request,HttpServletResponse response){
		dataMaps = new HashMap<String, Object>();
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		JSONObject jsonObject = JSONObject.fromObject(login_data);
		String companyid = jsonObject.get("companyid").toString();
		
		dataMaps.put("companyid", companyid);
		
		if(parentid != null &&!"".equals(parentid)){
			dataMaps.put("parentid", parentid);
		}
		params = new Gson().toJson(dataMaps);
		result = CommomUtil.CallApiWithoutEncrypt(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.companygoodsclassify.get",params);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 添加商品分类信息
	 * @param keywords 关键词
	 * @param parentid 上级分类id
	 * @param description 描述
	 * @param companygoodsclassifyname 商品分类名称
	 * @param request
	 * @param response
	 */	
	@RequestMapping("/addCompanyGoodsClassify")
	public void addCompanyGoodsClassify(
			@RequestParam(value="keywords",required=false) String keywords,
			@RequestParam(value="parentid",required=true) String parentid,
			@RequestParam(value="description",required=false) String description,
			@RequestParam(value="companygoodsclassifyname",required=true) String companygoodsclassifyname,
			HttpServletRequest request,HttpServletResponse response){
		dataMaps = new HashMap<String, Object>();
		if(companygoodsclassifyname != null &&!"".equals(companygoodsclassifyname.trim().toString())){
			dataMaps.put("companygoodsclassifyname", companygoodsclassifyname);
		}
		if(description != null &&!"".equals(description.trim().toString())){
			dataMaps.put("description", description);
		}
		if(parentid != null &&!"".equals(parentid.trim().toString())){
			dataMaps.put("parentid", Long.parseLong(parentid));
		}
		if(keywords != null &&!"".equals(keywords.trim().toString())){
			dataMaps.put("keywords", keywords);
		}
		params = new Gson().toJson(dataMaps);
		result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.companygoodsclassify.add",params);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 编辑商品分类信息
	 * @param keywords 关键词
	 * @param parentid 上级分类id
	 * @param companygoodsclassifyid 商品分类id
	 * @param description 描述
	 * @param companygoodsclassifyname 商品分类名称
	 * @param request
	 * @param response
	 */	
	@RequestMapping("/editCompanyGoodsClassify")
	public void editCompanyGoodsClassify(
			@RequestParam(value="keywords",required=false) String keywords,
			@RequestParam(value="parentid",required=true) String parentid,
			@RequestParam(value="companygoodsclassifyid",required=true) String companygoodsclassifyid,
			@RequestParam(value="description",required=false) String description,
			@RequestParam(value="companygoodsclassifyname",required=false) String companygoodsclassifyname,
			HttpServletRequest request,HttpServletResponse response){
		dataMaps = new HashMap<String, Object>();
		if(companygoodsclassifyname != null &&!"".equals(companygoodsclassifyname.trim().toString())){
			dataMaps.put("companygoodsclassifyname", companygoodsclassifyname);
		}
		if(description != null &&!"".equals(description.trim().toString())){
			dataMaps.put("description", description);
		}
		if(parentid != null &&!"".equals(parentid.trim().toString())){
			dataMaps.put("parentid", Long.parseLong(parentid));
		}
		if(companygoodsclassifyid != null &&!"".equals(companygoodsclassifyid.trim().toString())){
			dataMaps.put("companygoodsclassifyid", Long.parseLong(companygoodsclassifyid));
		}
		if(keywords != null &&!"".equals(keywords.trim().toString())){
			dataMaps.put("keywords", keywords);
		}
		dataMaps.put("showorders", new Integer("0"));
		params = new Gson().toJson(dataMaps);
		result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.companygoodsclassify.modify",params);
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * @param companygoodsclassifyid 商品分类id
	 */
	@RequestMapping("/deleteCompanyGoodsClassifyById")
	public void deleteCompanyGoodsClassifyById(
			@RequestParam(value="companygoodsclassifyid",required=true) String companygoodsclassifyid,
			HttpServletRequest request,HttpServletResponse response){
		dataMaps = new HashMap<String, Object>();
		if(companygoodsclassifyid != null &&!"".equals(companygoodsclassifyid.trim().toString())){
			dataMaps.put("companygoodsclassifyid", Long.parseLong(companygoodsclassifyid));
		}
		params = new Gson().toJson(dataMaps);
		result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.companygoodsclassify.delete",params);
		CommomUtil.writeResultBack(request, response, result);
	}
}
