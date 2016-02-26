package com.masget.controller.enterprise;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;
/**
 * 商品分类控制器
 * @author ChenJinxing
 * @since 2015-7-3
 */
@Controller
@RequestMapping("/enterprise/goodssupplierrelation")
public class GoodsSupplierRelationController {
	private Map<String,Object> dataMaps = null;
	private String params = "";
	private String result = "";
	
	
	@RequestMapping("/addContractor")
	public void addContractor(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request,HttpServletResponse response){
		params = new Gson().toJson(data);
		params = params.replace("\\", "").replace("\"[", "[").replace("]\"", "]").replace("\"{", "{").replace("}\"", "}");
		String method="masget.base.com.contractorinfo.add";
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, params.toString());
        
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 根据商品分类级联查询商品
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getgoods_by_classify")
	public void getgoods_by_classify(
			@RequestParam(value = "supplierid", required = false) String supplierid,
			@RequestParam(value = "suppliername", required = false) String suppliername,
			@RequestParam(value = "goodsname", required = false) String goodsname,
			@RequestParam(value = "companygoodsclassifyid", required = false) String companygoodsclassifyid,
			@RequestParam(value = "barcode",required = false) String barcode,
			@RequestParam(value = "goodsspec", required = false) String goodsspec,
			@RequestParam(value = "pagesize",required = true) String pagesize,
			@RequestParam(value = "pagenum", required = true) String pagenum,
			@RequestParam(value = "orders", required = false) List<String> orders,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			HttpServletRequest request, HttpServletResponse response){
		
		HttpSession httpSession = request.getSession(false);
		if (httpSession == null){
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		JSONObject obj = new JSONObject();
		obj.put("supplierid", Long.parseLong(supplierid));
		obj.put("suppliername", suppliername);
		obj.put("goodsname", goodsname);
		obj.put("companygoodsclassifyid", Long.parseLong(companygoodsclassifyid));
		obj.put("barcode", barcode);
		obj.put("pagesize", pagesize);
		obj.put("pagenum", pagenum);
		obj.put("goodsspec", goodsspec);
		obj.put("orders", orders);
		obj.put("orderkey", orderkey);
		
		//String method = "masget.enterprise.com.goods.getgoods_by_classify";
        String method = "masget.enterprise.com.goods.suppliergoods.not.get";
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());

		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 添加供应商供货关系
	 * @param supplierid 联系人id
	 * @param request
	 * @param response
	 */
	@RequestMapping("/addSupplierGoods")
	public void addSupplierGoods(
			@RequestParam(value = "supplierid", required = true) String supplierid,
			@RequestParam(value = "plaformuser", required = true) String plaformuser,
			@RequestParam(value = "goodslist", required = false) String goodslist,
			HttpServletRequest request, HttpServletResponse response){
		dataMaps = new HashMap<String, Object>();
		if(supplierid != null && !"".equals(supplierid.toString())){
			dataMaps.put("supplierid", Long.parseLong(supplierid));
		}
		if(plaformuser != null && !"".equals(plaformuser.toString())){
			dataMaps.put("plaformuser", Long.parseLong(plaformuser));
		}
		dataMaps.put("goodslist", goodslist);
		
		params = new Gson().toJson(dataMaps);
		params=params.replace("\\", "").replace("\"[", "[").replace("]\"", "]").replace("\"{", "{").replace("}\"", "}");
		result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goods.suppliergoods.add",params);	
	    CommomUtil.writeResultBack(request, response, result); 
	}
	/**
	 * 获取供应商供货关系
	 * @param supplierid 联系人id
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getSupplierGoods")	
	public void getSupplierGoods(
			@RequestParam(value = "supplierid", required = false) String supplierid,
			@RequestParam(value = "suppliername", required = false) String suppliername,
			@RequestParam(value = "goodsname", required = false) String goodsname,
			@RequestParam(value = "companygoodsclassifyid", required = false) String companygoodsclassifyid,
			@RequestParam(value = "barcode",required = false) String barcode,
			@RequestParam(value = "goodsspec", required = false) String goodsspec,
			@RequestParam(value = "pagesize",required = true) String pagesize,
			@RequestParam(value = "pagenum", required = true) String pagenum,
			@RequestParam(value = "orders", required = false) List<String> orders,
			@RequestParam(value = "orderkey", required = false) String orderkey,
			HttpServletRequest request, HttpServletResponse response){
		
		HttpSession httpSession = request.getSession(false);
		if (httpSession == null){
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		dataMaps = new HashMap<String, Object>();
		dataMaps.put("supplierid", Long.parseLong(supplierid));
		dataMaps.put("suppliername", suppliername);
		dataMaps.put("companygoodsclassifyid", Long.parseLong(companygoodsclassifyid)); 
		dataMaps.put("barcode", barcode);
		dataMaps.put("goodsspec", goodsspec);
		dataMaps.put("pagesize", Integer.valueOf(pagesize));
		dataMaps.put("pagenum", Integer.valueOf(pagenum));
		params = new Gson().toJson(dataMaps);
		result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goods.suppliergoods.get",params);	
	    CommomUtil.writeResultBack(request, response, result); 
	}
}
