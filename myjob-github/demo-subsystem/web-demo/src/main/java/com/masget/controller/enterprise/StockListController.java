package com.masget.controller.enterprise;

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


/**
 * 商品库存控制器
 * @author ChenJinxing
 * @since 2015-8-6
 */
@Controller
@RequestMapping("/enterprise/stockList")
public class StockListController {
	private Map<String,Object> dataMaps = null;
	private String params = "";
	private String result = "";
	/**
	 * 获取站点信息
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getStation")
	public void getStations(
			HttpServletRequest request,HttpServletResponse response){
		dataMaps = new HashMap<String, Object>();

		params = new Gson().toJson(dataMaps);
		result = CommomUtil.CallApi(request,CommomUtil.BASE_SERVICE,"masget.base.com.station.getrecusive",params);
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 获取商品库存信息
	 * @param stationid 库存id
	 * @param goodsname 商品名
	 * @param goodssn 商品货号
	 * @param barcode 商品条形码
	 * @param pagenum 页码
	 * @param pagesize 页记录数
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getGoodsStock")
	public void getGoodsStock(
			@RequestParam(value="warehouseid",required=false) String warehouseid,
			@RequestParam(value="goodsname",required=false) String goodsname,
			@RequestParam(value="goodssn",required=false) String goodssn,
			@RequestParam(value="barcode",required=false) String barcode,
			@RequestParam(value="pagenum",required=true) String pagenum,
			@RequestParam(value="pagesize",required=true) String pagesize,
			HttpServletRequest request,HttpServletResponse response){
		dataMaps = new HashMap<String, Object>();
		//判断是否登录
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		if(warehouseid!=null && !"".equals(warehouseid)){
			dataMaps.put("warehouseid", Long.valueOf(warehouseid));
		}
		if(goodsname!=null && !"".equals(goodsname)){
			dataMaps.put("goodsname", goodsname);
		}
		//商品货号
		if(goodssn!=null && !"".equals(goodssn)){
			dataMaps.put("goodssn", goodssn);
		}
		//商品条码	
		if(barcode!=null && !"".equals(barcode)){
			dataMaps.put("barcode", barcode);
		}
		dataMaps.put("pagenum", Integer.valueOf(pagenum));
		dataMaps.put("pagesize", Integer.valueOf(pagesize));
		params = new Gson().toJson(dataMaps);
		result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goodsstock.get",params);
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 获取商品库存详细信息
	 * @param stationid 库存id
	 * @param batchcode 库存批次号
	 * @param pagenum 页码
	 * @param pagesize 页记录数
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getGoodsStockList")
	public void getGoodsStockList(
			@RequestParam(value="goodsstockid",required=true) String goodsstockid,
			@RequestParam(value="batchcode",required=false) String batchcode,
			@RequestParam(value="pagenum",required=true) String pagenum,
			@RequestParam(value="pagesize",required=true) String pagesize,
			HttpServletRequest request,HttpServletResponse response){
		
		dataMaps = new HashMap<String, Object>();
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		if(goodsstockid!=null && !"".equals(goodsstockid)){
			dataMaps.put("goodsstockid", Long.valueOf(goodsstockid));
		}
		if(batchcode!=null && !"".equals(batchcode)){
			dataMaps.put("batchcode", Long.valueOf(batchcode));
		}
		dataMaps.put("pagenum", Long.valueOf(pagenum));
		dataMaps.put("pagesize", Long.valueOf(pagesize));
		params = new Gson().toJson(dataMaps);
		result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goodsstocklist.get",params);
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 获取商品库存详细信息
	 * @param stationid 库存id
	 * @param batchcode 库存批次号
	 * @param pagenum 页码
	 * @param pagesize 页记录数
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getGoodsStockListByGoods")
	public void getGoodsStockListByGoods(
			@RequestParam(value="goodsid",required=true) String goodsid,
			@RequestParam(value="warehouseid",required=true) String warehouseid,
			HttpServletRequest request,HttpServletResponse response){
		
		dataMaps = new HashMap<String, Object>();
		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		if(goodsid!=null && !"".equals(goodsid)){
			dataMaps.put("goodsid", Long.valueOf(goodsid));
		}
		if(warehouseid!=null && !"".equals(warehouseid)){
			dataMaps.put("warehouseid", Long.valueOf(warehouseid));
		}
		params = new Gson().toJson(dataMaps);
		result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.com.goodsstocklist.bygoods.get",params);
		CommomUtil.writeResultBack(request, response, result);
	}	
}
