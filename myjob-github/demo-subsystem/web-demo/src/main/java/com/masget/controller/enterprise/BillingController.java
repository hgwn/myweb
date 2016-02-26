package com.masget.controller.enterprise;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.aspectj.apache.bcel.classfile.Constant;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.alibaba.dubbo.common.Constants;
import com.google.gson.Gson;
import com.masget.entity.RetStruct;
import com.masget.util.CommomUtil;

/**
 * 开单控制器
 * @author lh
 */
@Controller
@RequestMapping("enterprise/billing")
public class BillingController {
	private Map<String,Object> dataMap = null;
	private String params = null;
	private String dataCommodities = null;
			
	@RequestMapping(method=RequestMethod.GET)
	public String show(
			HttpServletRequest request, HttpServletResponse response){	
		return "enterprise/billing/billing";
	}
	
	/**
	 * 查询商品
	 * @param pageSize 页数
	 * @param pageNum 每页记录数
	 * @param goodsName 商品名字
	 * @param orders 排序条件
	 * @param orderKey 排序规则,降序或升序
	 * @param request
	 * @param response
	 */
	@RequestMapping(value="/list",method={RequestMethod.POST,RequestMethod.GET})
	public void list(
			@RequestParam(value="pageSize",required=true) Integer pagesize,
			@RequestParam(value="pageNum",required=true) Integer pagenum,
			@RequestParam(value="goodsname",required=false) String goodsname,
			@RequestParam(value="barcode",required=false) String barcode,
			
			HttpServletRequest request,HttpServletResponse response){
		dataMap = new HashMap<String,Object>();
		dataMap.put("pagesize", pagesize);
		dataMap.put("pagenum", pagenum);
		//根据商品名
		if(goodsname!=null&&!"".equals(goodsname.trim())&&!"undefined".equals(goodsname.trim())){
			dataMap.put("goodsname", goodsname);
		}	
		//根据条形码 货号
		if(barcode!=null&&!"".equals(barcode.trim())&&!"undefined".equals(barcode.trim())){
			dataMap.put("barcode", barcode);
		}	
		params = new Gson().toJson(dataMap);
		
		dataCommodities = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goods.get",params);
		CommomUtil.writeResultBack(request, response, dataCommodities);
	}
	
	/**
	 * 根据商品销售属性查询剩余销售属性和价格库存量
	 */
	/*@RequestMapping(value="/getgoodssku",method={RequestMethod.POST,RequestMethod.GET})
	public void getgoodssku(			
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request,HttpServletResponse response){
			
		String result = CommomUtil.CallApiWithoutEncrypt(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goods.getgoodssku",data);
		CommomUtil.writeResultBack(request, response, result);
	}*/
	
	/**
	 * 加入购物车
	 */
	@RequestMapping(value="/addcart",method={RequestMethod.POST,RequestMethod.GET})
	public void addcart(			
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request,HttpServletResponse response){
			
		String result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goodscart.add",data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 查询购物车
	 */
	@RequestMapping(value="/listcart",method={RequestMethod.POST,RequestMethod.GET})
	public void listcart(
			@RequestParam(value="companyid",required=false) String companyid,
			HttpServletRequest request, HttpServletResponse response){	
		dataMap = new HashMap<String,Object>();
		if(companyid!=null&&!"".equals(companyid.trim())&&!"undefined".equals(companyid.trim())){
			dataMap.put("companyid", companyid);
		}	
		params = new Gson().toJson(dataMap);
		String result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goodscart.get",params);
		
		Gson gson2=new Gson();
		
		RetStruct struct=gson2.fromJson(result, RetStruct.class);
		
		result=gson2.toJson(struct.getData().getRows());
		
		CommomUtil.writeResultBack(request, response, result);		
	}
	
	/**
	 * 删除购物车
	 */
	@RequestMapping("/delete.do")
	public void delete(
			@RequestParam(value="data",required=false) String data,	
		HttpServletRequest request,HttpServletResponse response){
			
		String result = CommomUtil.CallApi(request, "enterpriseService", "masget.enterprise.com.goodscart.delete", data);						
		CommomUtil.writeResultBack(request, response, result);
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
	 * 查询客户
	 */
	@RequestMapping("/getcontactname.do")
	public void getcontactname(	
			@RequestParam(value="q",required=false) String contactname,
			HttpServletRequest request, HttpServletResponse response){	
		Map<String, Object> dataMap=new HashMap<String, Object>();				
		if(contactname!=null&&!contactname.trim().equals("")){
			dataMap.put("contactname", contactname);
		}
		dataMap.put("pagesize", 20);
		dataMap.put("pagenum", 1);
		dataMap.put("scenetypeid", 3);
		dataMap.put("rcompanytypeid", 3000);
		Gson gson=new Gson();
		String data=gson.toJson(dataMap);
		
		String result = CommomUtil.CallApi(request, "baseService", "masget.base.com.addresslist.getbyscenetype", data);						
		Gson gson2=new Gson();
		
		RetStruct struct=gson2.fromJson(result, RetStruct.class);
		
		result=gson2.toJson(struct.getData().getRows());
		
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 获取单号
	 */
	@RequestMapping("/getordernum.do")
	public void getordernum(
			@RequestParam(value="ordertypeid",required=false) String ordertypeid,	
		HttpServletRequest request,HttpServletResponse response){
		dataMap = new HashMap<String,Object>();
		
		dataMap.put("ordertypeid","307");
		Gson gson=new Gson();
		String data=gson.toJson(dataMap);
		String result = CommomUtil.CallApi(request, "baseService", "masget.base.com.order.getordernum", data);						
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * 提交采购订单
	 */
	@RequestMapping("/addsalesorder.do")
	public void addsalesorder(
			@RequestParam(value="data",required=true) String data,	
		HttpServletRequest request,HttpServletResponse response){
			
		String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, "masget.enterprise.com.orders.addsalesorder", data);						
		CommomUtil.writeResultBack(request, response, result);
	}	
	
	/**
	 * 查询站点
	 */
	@RequestMapping("/getstationtype.do")
	public void getstationtype(
			@RequestParam(value="stationtypeid",required=false) String stationtypeid,	
		HttpServletRequest request,HttpServletResponse response){
		dataMap = new HashMap<String,Object>();
		
		dataMap.put("stationtypeid","3");
		Gson gson=new Gson();
		String data=gson.toJson(dataMap);
		String result = CommomUtil.CallApi(request, "baseService", "masget.base.com.station.getlist", data);						
		CommomUtil.writeResultBack(request, response, result);
	}
}
