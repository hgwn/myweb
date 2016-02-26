package com.masget.controller.enterprise;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.alibaba.dubbo.common.json.JSONObject;
import com.google.gson.Gson;
import com.masget.util.CommomUtil;
/**
 * 商品控制器
 * @author ChenJinxing
 */
@Controller
@RequestMapping("/enterprise/commodity")
public class CommodityController {
	private Map<String,Object> dataMap = null;
	private List<String> ordersList = null;
	private String params = null;
	private String dataMerchant = null;
	private String dataCommodities = null;
	
	/**
	 * 获取商家个人信息
	 * @param companyid 商家id
	 * @param request
	 * @param response
	 */	
	@RequestMapping("/merchant")
	public void getMerchant(
			@RequestParam(value="companyId",required=true) String companyid,
			HttpServletRequest request,HttpServletResponse response){
		Map<String,Object> dataMap = new HashMap<String,Object>();
		dataMap.put("companyid", Long.parseLong(companyid)); 
		params = new Gson().toJson(dataMap);
		dataMerchant = CommomUtil.CallApiWithoutEncrypt(request,CommomUtil.BASE_SERVICE,"masget.base.com.companystaff.getmerchants",params);
		CommomUtil.writeResultBack(request, response, dataMerchant);
	}
	/**
	 * 查询商品
	 * @param companyId 商家id
	 * @param pageSize 页数
	 * @param pageNum 每页记录数
	 * @param goodsName 商品名字
	 * @param orders 排序条件
	 * @param orderKey 排序规则,降序或升序
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void list(
			@RequestParam(value="companyId",required=true) String companyId,
			@RequestParam(value="pageSize",required=true) String pageSize,
			@RequestParam(value="pageNum",required=true) String pageNum,
			@RequestParam(value="goodsName",required=false) String goodsName,
			@RequestParam(value="orders",required=false) String orders,
			@RequestParam(value="orderKey",required=false) String orderKey,
			HttpServletRequest request,HttpServletResponse response){
		String goodsname = null;
		dataMap = new HashMap<String,Object>();
		ordersList = new ArrayList<String>();
		if(goodsName!=null&&!"".equals(goodsName)){
			try {
				goodsname = new String(goodsName.getBytes("ISO-8859-1"),"UTF-8");
			} catch (Exception e) {
				e.printStackTrace();
			}			
		}
		//如果companyId不为null表示的是用户点击查询的操作获取所有商品，为null则表示是用户第一次访问页面获取所有商品信息
		if(companyId!=null&&!"".equals(companyId.trim())){
			dataMap.put("companyid",Long.parseLong(companyId));
		}
		dataMap.put("pagesize",Integer.parseInt(pageSize));
		dataMap.put("pagenum",Integer.parseInt(pageNum));
		//根据商品名
		if(goodsname!=null&&!"".equals(goodsname.trim())&&!"undefined".equals(goodsname.trim())){
			dataMap.put("goodsname", goodsname);
		}
		//排序条件
		if(orders!=null&&!"".equals(orders.trim())&&!"undefined".equals(orders.trim())){
			ordersList.add(orders); 
			dataMap.put("orders", ordersList);
			dataMap.put("orderkey", orderKey);
		}		
		params = new Gson().toJson(dataMap);
		dataCommodities = CommomUtil.CallApiWithoutEncrypt(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goods.getstoresgoods",params);
		CommomUtil.writeResultBack(request, response, dataCommodities);
	}	

	/**
	 * 获取某个商品的sku
	 * @param attribid 属性id
	 * @param attribtype 属性类型
	 * @param attribproperties 属性值
	 * @param request
	 * @param response
	 * 
	 */	
	@RequestMapping("/get_goods_sku")
	public void getGoodsSku(
			@RequestParam(value="companyid",required=true) String companyid,
			@RequestParam(value="goodsid",required=true) String goodsid,
			@RequestParam(value="goodsattrib",required=true) String goodsattrib,
			HttpServletRequest request,HttpServletResponse response){
		dataMap = new HashMap<String,Object>();
		
		dataMap.put("goodsattrib",goodsattrib);
		dataMap.put("companyid", companyid);
		dataMap.put("goodsid", goodsid);
		params = new Gson().toJson(dataMap);
		params=params.replace("\\", "").replace("\"[", "[").replace("]\"", "]").replace("\"{", "{").replace("}\"", "}");
		dataCommodities = CommomUtil.CallApiWithoutEncrypt(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goods.getgoodssku",params);	
	    CommomUtil.writeResultBack(request, response, dataCommodities); 
	}
	/**
	 * 删除购物车中的商品
	 * @param goodscart购物车
	 * @param request
	 * @param response
	 */
	@RequestMapping("/addgoodscart")
	public void addGoodscart(
			@RequestParam(value="goodscart",required=true) String goodscart,
			HttpServletRequest request,HttpServletResponse response){
		dataMap = new HashMap<String,Object>();
		dataMap.put("goodscart", goodscart);
		params = new Gson().toJson(dataMap);
		params=params.replace("\\", "").replace("\"[", "[").replace("]\"", "]").replace("\"{", "{").replace("}\"", "}");
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goodscart.add", params);
		CommomUtil.writeResultBack(request, response, result); 
	}
	/**
	 * 查询购物车中的商品
	 * @param companyid 购物车商品所属的公司id
	 * @param request
	 * @param response
	 */	
	@RequestMapping("/getgoodscart")
	public void getGoodsCart(
			@RequestParam(value="companyid",required=true) String companyid,
			HttpServletRequest request,HttpServletResponse response){
		dataMap = new HashMap<String,Object>();
		dataMap.put("companyid", Long.parseLong(companyid));
		params = new Gson().toJson(dataMap);
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goodscart.get", params);
		CommomUtil.writeResultBack(request, response, result); 
	}
	/**
	 * 删除购物车中的商品
	 * @param goodscarts 购物车商品列表
	 * @param request
	 * @param response
	 */
	@RequestMapping("/deletegoodscart")
	public void deleteGoodsCart(
			@RequestParam(value="goodscarts",required=true) String goodscarts,
			HttpServletRequest request,HttpServletResponse response){
		dataMap = new HashMap<String,Object>();
		dataMap.put("goodscarts", goodscarts);
		params = new Gson().toJson(dataMap);
		params=params.replace("\\", "").replace("\"[", "[").replace("]\"", "]").replace("\"{", "{").replace("}\"", "}");
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goodscart.delete", params);
		CommomUtil.writeResultBack(request, response, result); 
	}
	/**
	 * 修改购物车
	 * @param goodscartid 购物车id
	 * @param numbers 购物车某商品数量
	 * @param skuid 商品属性skuid
	 * @param request
	 * @param response
	 */
	@RequestMapping("/modifyGoodscarts")
	public void modifyGoodsCarts(
			@RequestParam(value="goodscartid",required=true) String goodscartid,
			@RequestParam(value="numbers",required=true) String numbers,
			@RequestParam(value="skuid",required=true) String skuid,
			HttpServletRequest request,HttpServletResponse response){
		dataMap = new HashMap<String, Object>();
		dataMap.put("goodscartid", goodscartid);
		dataMap.put("numbers", numbers);
		dataMap.put("skuid", skuid);
		params = new Gson().toJson(dataMap);
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goodscart.modify", params);
	    CommomUtil.writeResultBack(request, response, result); 	
	}
	/**
	 * 生成采购订单号
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getordernum")
	public void getOrderNum(HttpServletRequest request,HttpServletResponse response){
		dataMap = new HashMap<String, Object>();
		dataMap.put("ordertypeid", "306");
		params = new Gson().toJson(dataMap);
		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,"masget.base.com.order.getordernum", params);
		CommomUtil.writeResultBack(request, response, result); 
	}
	/**
	 * 获取省市区
	 * @param cityid 城市id
	 * @param provinceid 省id
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getdistrict")
	public void getDistrict(
			@RequestParam(value="cityid",required=false) String cityid,
			@RequestParam(value="provinceid",required=false) String provinceid,
			HttpServletRequest request,HttpServletResponse response){
		dataMap = new HashMap<String, Object>();
		if(cityid!=null&&!"".equals(cityid.toString())){
			dataMap.put("cityid", Integer.parseInt(cityid));
		}
		if(provinceid!=null&&!"".equals(provinceid.toString())){
			dataMap.put("provinceid", Integer.parseInt(provinceid));
		}
		params = new Gson().toJson(dataMap);
		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,"masget.base.com.district.get", params);
		CommomUtil.writeResultBack(request, response, result); 
	}	
	
	
	/**
	 * 根据购物车添加采购订单
	 * @param ordernum 订单号
	 * @param supplierid 供应商id
	 * @param supplierstationid 供应商站点id
	 * @param buyername 购物者名称
	 * @param buyerprovinceid 省份id
	 * @param buyercityid 城市id
	 * @param buyerareaid 区、县id
	 * @param buyeraddress 详细地址
	 * @param buyerphone 联系电话
	 * @param goodsdeposit 预付款
	 * @param deliveryflag 交货方式：1-送货上门, 2-自提
	 * @param settlementtypeid 结算方式：当预付款大于等于0且小于货物总金额时,可选的结算方式包括：到付/月结
     *                         当预付款== 货物总金额时, 结算方式为现付
	 * @param paymenttype 支付方式
	 * @param remark 备注
	 * @param goodscart 购物车列表
	 * @param requese
	 * @param response
	 */
	@RequestMapping("/addpurchaseorderbycart")
	public void addPurchaseOrderByCart(
			@RequestParam(value="ordernum",required=false) String ordernum,
			@RequestParam(value="supplierid",required=false) String supplierid,
			@RequestParam(value="supplierstationid",required=false) String supplierstationid,
			@RequestParam(value="buyername",required=false) String buyername,
			@RequestParam(value="buyerprovinceid",required=false) String buyerprovinceid,
			@RequestParam(value="buyercityid",required=false) String buyercityid,
			@RequestParam(value="buyerareaid",required=false) String buyerareaid,
			@RequestParam(value="buyeraddress",required=false) String buyeraddress,
			@RequestParam(value="buyerphone",required=false) String buyerphone,
			@RequestParam(value="goodsdeposit",required=false) String goodsdeposit,
			@RequestParam(value="deliveryflag",required=false) String deliveryflag,
			@RequestParam(value="settlementtypeid",required=false) String settlementtypeid,
			@RequestParam(value="paymenttype",required=false) String paymenttype,
			@RequestParam(value="remark",required=false) String remark,
			@RequestParam(value="goodscart",required=false) String goodscart,
			HttpServletRequest request,HttpServletResponse response){
		dataMap = new HashMap<String, Object>();
		dataMap.put("ordernum", ordernum);
		dataMap.put("supplierid", Long.parseLong(supplierid));
		dataMap.put("supplierstationid", Long.parseLong(supplierstationid));
		dataMap.put("buyername", buyername);
		dataMap.put("buyerprovinceid", Long.parseLong(buyerprovinceid));
		dataMap.put("buyercityid", Long.parseLong(buyercityid));
		dataMap.put("buyerareaid", Long.parseLong(buyerareaid));
		dataMap.put("buyeraddress", buyeraddress);
		dataMap.put("buyerphone", buyerphone);
		dataMap.put("goodsdeposit", goodsdeposit);
		dataMap.put("deliveryflag", deliveryflag);
		dataMap.put("settlementtypeid", Long.parseLong(settlementtypeid));
		dataMap.put("paymenttype", paymenttype);
		dataMap.put("remark", remark);
		dataMap.put("goodscart", goodscart);
		
		dataMap.put("warehouseid", "0");
		params = new Gson().toJson(dataMap);
		params=params.replace("\\", "").replace("\"[", "[").replace("]\"", "]").replace("\"{", "{").replace("}\"", "}");
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.orders.addpurchaseorderbycart", params);
		CommomUtil.writeResultBack(request, response, result); 
	}
	/**
	 * 获取供应商列表
	 * @param scenetypeid id=2为供应商
	 * @param pagesize 每页记录数
	 * @param pagenum 页数
	 * @param companyname 供应商名字
	 * @param request
	 * @param response
	 */
	@RequestMapping("/suppliersGetAll")
	public void getAllSuppliers(
		    @RequestParam(value="scenetypeid",required=true) String scenetypeid,
			@RequestParam(value="pagesize",required=true) String pagesize,
			@RequestParam(value="pagenum",required=true) String pagenum,
			@RequestParam(value="companyname",required=false) String companyname,
			HttpServletRequest request,HttpServletResponse response){
        dataMap = new HashMap<String, Object>();
		dataMap.put("scenetypeid", Long.parseLong(scenetypeid));
		dataMap.put("pagesize", Integer.parseInt(pagesize));
		dataMap.put("pagenum", Integer.parseInt(pagenum));
		if(companyname!=null&&!"".equals(companyname.toString())){
			dataMap.put("companyname", companyname);
		}
		params = new Gson().toJson(dataMap);
		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,"masget.base.com.contractorinfo.find", params);
	    CommomUtil.writeResultBack(request, response, result); 	
	}
}
