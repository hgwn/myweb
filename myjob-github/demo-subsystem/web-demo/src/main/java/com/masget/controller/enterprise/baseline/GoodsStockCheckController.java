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
@RequestMapping("/enterprise/goodsstockcheck")
public class GoodsStockCheckController {
	private static Logger logger = Logger.getLogger(GoodsStockCheckController.class);
	
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
            @RequestParam(value="goodsname",required=false) String goodsname,
            @RequestParam(value="categoryid",required=false) String categoryid,
            @RequestParam(value="issernum",required=false) String issernum,
            HttpServletRequest request,HttpServletResponse response){
        Map<String,Object>  dataMap = new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(pagesize)){
            dataMap.put("pagesize", ObjectParser.toInteger(pagesize));
        }
        if(StringUtils.isNotEmpty(pagenum)){
            dataMap.put("pagenum", ObjectParser.toInteger(pagenum));
        }
        if(StringUtils.isNotEmpty(goodsname)){
            dataMap.put("goodsname",ObjectParser.toString(goodsname));
        }
        if(StringUtils.isNotEmpty(categoryid) && !("0".equals(categoryid))){
            dataMap.put("categoryid",ObjectParser.toLong(categoryid));
        }
        if(StringUtils.isNotEmpty(issernum)){
            dataMap.put("issernum",ObjectParser.toLong(issernum));
        }
        
        String params = new Gson().toJson(dataMap);
        String TAG = "/masgetweb/enterprise/goodsstockcheck/getGoodsList";
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
     * 查询盘点记录
     * @param pagesize 页记录数
     * @param pagenum 页码
     * @param goodsname 商品名称
     * @param request
     * @param response
     */
    @RequestMapping("/getGoodsStockCheckList")
    public void getGoodsStockCheckList(
            @RequestParam(value="pagesize",required=true) String pagesize,
            @RequestParam(value="pagenum",required=true) String pagenum,    
            @RequestParam(value="begincreatedtime",required=false) String begincreatedtime,
            @RequestParam(value="endcreatedtime",required=false) String endcreatedtime,
            HttpServletRequest request,HttpServletResponse response){
        Map<String,Object>  dataMap = new HashMap<String, Object>();
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
//        if(DateUtils.compareDateStr(begincreatedtime, endcreatedtime)>0)
//        {
//            CommomUtil.writeResultBack(request, response,
//                CommomUtil.RetResponse(101, "查询的开始日期不能大于结束日期"));
//            return;
//        }
        
        dataMap.put("begincreatedtime", begincreatedtime);
        dataMap.put("endcreatedtime", endcreatedtime);
        
        String params = new Gson().toJson(dataMap);
        String TAG = "/masgetweb/enterprise/goodsstockcheck/getGoodsCheckList";
        String result = "";
        try{
            result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.goodsstockcheck.get",params);
        }catch(Exception e){
            logger.info(TAG+ ":查询盘点数据出现异常:" + dataMap.toString(), e); 
            new MgException(0,"查询盘点数据出现异常",e);
        }
        CommomUtil.writeResultBack(request, response, result);
    }
    
    /**
     * 批量添加盘点记录
     * @param pagesize 页记录数
     * @param pagenum 页码
     * @param goodsname 商品名称
     * @param request
     * @param response
     */
    @RequestMapping("/addGoodsStockCheckList")
    public void addGoodsStockCheckList(
            @RequestParam(value="insertDatas",required=true) String insertDatas,
            HttpServletRequest request,HttpServletResponse response){

        String TAG = "/masgetweb/enterprise/goodsstockcheck/addGoodsStockCheckList";
        String result = "";
        try{
            result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.goodsstockcheck.add",insertDatas);
        }catch(Exception e){
            logger.info(TAG+ ":添加盘点数据出现异常:" + insertDatas, e); 
//            new MgException(0,"添加盘点数据出现异常",e);
        }
        CommomUtil.writeResultBack(request, response, result);
    }
}
