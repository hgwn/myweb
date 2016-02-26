package com.masget.controller.enterprise.baseline;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.masget.util.CommomUtil;
import com.masget.util.DateUtils;
import com.masget.util.ObjectParser;
import com.masget.utils.MgException;
/**
 * 库存盘点控制器
 * @author yuanguochun
 * @since 2015-10-09
 */
@Controller
@RequestMapping("/enterprise/goodsstock")
public class GoodsStockController {
	private static Logger logger = Logger.getLogger(GoodsStockController.class);
	
	/**
     * 查询库存
     * @param pagesize 页记录数
     * @param pagenum 页码
     * @param goodsname 商品名称
     * @param request
     * @param response
     */
    @RequestMapping("/getGoodsStockList")
    public void getGoodsStockList(
            @RequestParam(value="pagesize",required=true) String pagesize,
            @RequestParam(value="pagenum",required=true) String pagenum,    
            @RequestParam(value="keywords",required=false) String keywords,
            @RequestParam(value="categoryid",required=false) String categoryid,
            HttpServletRequest request,HttpServletResponse response){

        Map<String,Object>  dataMap = new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(pagesize)){
            dataMap.put("pagesize", ObjectParser.toInteger(pagesize));
        }
        if(StringUtils.isNotEmpty(pagenum)){
            dataMap.put("pagenum", ObjectParser.toInteger(pagenum));
        }
        if(StringUtils.isNotEmpty(keywords)){
            dataMap.put("keywords",ObjectParser.toString(keywords));
        }
        if(StringUtils.isNotEmpty(categoryid) && !("0".equals(categoryid))){
            dataMap.put("categoryid",ObjectParser.toLong(categoryid));
        }
        
        String params = new Gson().toJson(dataMap);
        String TAG = "/masgetweb/enterprise/goodsstock/getGoodsList";
        String result = "";
        try{
            result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.goodsstock.get",params);
        }catch(Exception e){
            logger.info(TAG+ ":查询商品库存异常:" + dataMap.toString(), e); 
            new MgException(0,"查询商品库存异常",e);
        }
        CommomUtil.writeResultBack(request, response, result);
    }
    
    /**
     *  查询商品出入库历史记录 
     * @param pagesize
     * @param pagenum
     * @param begincreatedtime
     * @param endcreatedtime
     * @param keywords
     * @param categoryid
     * @param request
     * @param response 
     * @see [类、类#方法、类#成员]
     */
    @RequestMapping("/getGoodsStockInOutList")
    public void getGoodsStockInOutList(
    		@RequestParam(value="companyid",required=false) String companyid,
    		/*@RequestParam(value="warehouseid",required=false) String warehouseid,*/
            @RequestParam(value="pagesize",required=true) String pagesize,
            @RequestParam(value="pagenum",required=true) String pagenum,    
            @RequestParam(value="begincreatedtime",required=false) String begincreatedtime,
            @RequestParam(value="endcreatedtime",required=false) String endcreatedtime,
            @RequestParam(value="keywords",required=false) String keywords,
            @RequestParam(value="categoryid",required=false) String categoryid,      
            @RequestParam(value="goodsid",required=false) String goodsid,
            HttpServletRequest request,HttpServletResponse response){
        Map<String,Object>  dataMap = new HashMap<String, Object>();
        
        dataMap.put("keywords", keywords);
        dataMap.put("categoryid", categoryid);
        dataMap.put("goodsid", goodsid);
        if(StringUtils.isNotEmpty(companyid) && companyid != null){
            dataMap.put("companyid", ObjectParser.toLong(companyid));
        }
        /*if(StringUtils.isNotEmpty(warehouseid) && warehouseid != null){
            dataMap.put("warehouseid", ObjectParser.toLong(warehouseid));
        }*/
        if(StringUtils.isNotEmpty(pagesize)){
            dataMap.put("pagesize", ObjectParser.toInteger(pagesize));
        }
        if(StringUtils.isNotEmpty(pagesize)){
            dataMap.put("pagesize", ObjectParser.toInteger(pagesize));
        }
        if(StringUtils.isNotEmpty(pagenum)){
            dataMap.put("pagenum", ObjectParser.toInteger(pagenum));
        }
        
        //如果该参数为空，则取当天日期
        if(StringUtils.isEmpty(begincreatedtime))
        {
            begincreatedtime =  DateUtils.getDate();
        }
        //开始日期的时分秒需要选择指定日期的00:00:00 
        begincreatedtime +=" 00:00:00";
        
        //如果该参数为空，则取当天日期
        if(StringUtils.isEmpty(endcreatedtime))
        {
            endcreatedtime =  DateUtils.getDate();
        }
        //结束日期的时分秒需要选择指定日期的23:59:59 
        endcreatedtime +=" 23:59:59";
        
        dataMap.put("begincreatedtime", begincreatedtime);
        dataMap.put("endcreatedtime", endcreatedtime);
        Gson  gson = new GsonBuilder().serializeNulls().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
        String params =gson.toJson(dataMap);
        String TAG = "/masgetweb/enterprise/goodsstock/getGoodsStockInOutList";
        String result = "";
        try{
            result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.goodsstock.inoutdetail.get",params);
        }catch(Exception e){
            logger.info(TAG+ ":查询仓库出入库历史记录数据出现异常:" + dataMap.toString(), e); 
            new MgException(0,"查询仓库出入库历史记录数据出现异常",e);
        }
        CommomUtil.writeResultBack(request, response, result);
    }
    
    /**
     * 根据id查询出库单明细
     * @param pagesize 页记录数
     * @param pagenum 页码
     * @param goodsname 商品名称
     * @param request
     * @param response
     */
    @RequestMapping("/getGoodsStockOutDetail")
    public void getGoodsStockOutDetail(
            @RequestParam(value="pagesize",required=false) String pagesize,
            @RequestParam(value="pagenum",required=false) String pagenum,    
            @RequestParam(value="orderid",required=true) String orderid,
            HttpServletRequest request,HttpServletResponse response){

        Map<String,Object>  dataMap = new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(pagesize)){
            dataMap.put("pagesize", ObjectParser.toInteger(pagesize));
        }
        if(StringUtils.isNotEmpty(pagenum)){
            dataMap.put("pagenum", ObjectParser.toInteger(pagenum));
        }
        
        if(StringUtils.isNotEmpty(orderid)){
            dataMap.put("warehouseoutid",ObjectParser.toLong(orderid));
        }
        
        String params = new Gson().toJson(dataMap);
        String TAG = "/masgetweb/enterprise/goodsstock/getGoodsStockOutDetail";
        String result = "";
        try{
            result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.warehouseout.get",params);
        }catch(Exception e){
            logger.info(TAG+ ":查询商品库存出库记录异常:" + dataMap.toString(), e); 
            new MgException(0,"查询商品库存出库记录异常",e);
        }
        CommomUtil.writeResultBack(request, response, result);
    }
    
    /**
     * 根据id查询入库单明细
     * @param pagesize 页记录数
     * @param pagenum 页码
     * @param goodsname 商品名称
     * @param request
     * @param response
     */
    @RequestMapping("/getGoodsStockInDetail")
    public void getGoodsStockInDetail(
            @RequestParam(value="pagesize",required=false) String pagesize,
            @RequestParam(value="pagenum",required=false) String pagenum,    
            @RequestParam(value="orderid",required=true) String orderid,
            HttpServletRequest request,HttpServletResponse response){

        Map<String,Object>  dataMap = new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(pagesize)){
            dataMap.put("pagesize", ObjectParser.toInteger(pagesize));
        }
        if(StringUtils.isNotEmpty(pagenum)){
            dataMap.put("pagenum", ObjectParser.toInteger(pagenum));
        }
        
        if(StringUtils.isNotEmpty(orderid)){
            dataMap.put("warehouseinid",ObjectParser.toLong(orderid));
        }
        
        String params = new Gson().toJson(dataMap);
        String TAG = "/masgetweb/enterprise/goodsstock/getGoodsStockInDetail";
        String result = "";
        try{
            result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.warehousein.get",params);
        }catch(Exception e){
            logger.info(TAG+ ":查询商品库存入库记录异常:" + dataMap.toString(), e); 
            new MgException(0,"查询商品库存入库记录异常",e);
        }
        CommomUtil.writeResultBack(request, response, result);
    }
    
    /**
     * 根据goodsid,和goodsstockid查询商品批次明细
     * @param pagesize 页记录数
     * @param pagenum 页码
     * @param goodsid 商品ID
     * @param goodsstockid  库存id
     * @param request
     * @param response
     */
    @RequestMapping("/getGoodsStockBatchDetail")
    public void getGoodsStockBatchDetail(
            @RequestParam(value="pagesize",required=false) String pagesize,
            @RequestParam(value="pagenum",required=false) String pagenum,    
            @RequestParam(value="goodsid",required=true) String goodsid,
            @RequestParam(value="goodsstockid",required=true) String goodsstockid,
            HttpServletRequest request,HttpServletResponse response){

        Map<String,Object>  dataMap = new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(pagesize)){
            dataMap.put("pagesize", ObjectParser.toInteger(pagesize));
        }
        if(StringUtils.isNotEmpty(pagenum)){
            dataMap.put("pagenum", ObjectParser.toInteger(pagenum));
        }
        
        dataMap.put("goodsid",ObjectParser.toLong(goodsid));
        dataMap.put("goodsstockid",ObjectParser.toLong(goodsstockid));

        String params = new Gson().toJson(dataMap);
        String TAG = "/masgetweb/enterprise/goodsstock/getGoodsStockBatchDetail";
        String result = "";
        try{
            result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.goodsstocklist.get",params);
        }catch(Exception e){
            logger.info(TAG+ ":查询商品库存出库记录异常:" + dataMap.toString(), e); 
            new MgException(0,"查询商品库存出库记录异常",e);
        }
        CommomUtil.writeResultBack(request, response, result);
    }
    
}
