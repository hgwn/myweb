package com.masget.controller.enterprise.headquarters;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.masget.util.CommomUtil;
import com.masget.utils.MgException;
/**
 * 总部查看经销商库存
 * @author chenjinxing
 * @since 2015-11-23
 */
@Controller
@RequestMapping("/enterprise/goodsstock/headquarters/goodsstock")
public class GoodsStockCheckHeadQuartersController {
	private static Logger logger = Logger.getLogger(GoodsStockCheckHeadQuartersController.class);
	
	/**
     * 查询库存
     * @param pagesize 页记录数
     * @param pagenum 页码
     * @param goodsname 商品名称
     * @param request
     * @param response
     */
    @RequestMapping("/get")
    public void getGoodsStockList(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.headquarters.goodsstock.get";
        
        String TAG = "/enterprise/goodsstock/headquarters/goodsstock/get.do";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":新增订货单时发生异常:" + obj.toString(), e); 
			new MgException(20018,"新增订货单发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
}
