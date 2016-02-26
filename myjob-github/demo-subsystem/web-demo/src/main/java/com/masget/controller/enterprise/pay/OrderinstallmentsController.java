package com.masget.controller.enterprise.pay;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.masget.util.CommomUtil;
import com.masget.utils.MgException;

/**
 * 分期记录Controller
 * @author chenjinxing
 * @since 2015-11-6
 */
@Controller
@RequestMapping("/enterprise/orderinstallments")
public class OrderinstallmentsController {
	private static Logger logger = Logger.getLogger(OrderinstallmentsController.class);
	/**
	 * 查询分期记录
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getOrderinstallments", method = { RequestMethod.POST,RequestMethod.GET })
	public void getOrderinstallments(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.pay.orderinstallments.get";
        
        String TAG = "/masgetweb/enterprise/orderinstallments/getOrderinstallments";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":查询订单分期记录数时异常:" + obj.toString(), e); 
			new MgException(20306,"查询订单分期记录数时异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 审核分期记录
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/auditOrderinstallments", method = { RequestMethod.POST,RequestMethod.GET })
	public void auditOrderinstallments(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.pay.orderinstallments.audit";
        
        String TAG = "/masgetweb/enterprise/orderinstallments/auditOrderinstallments";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":审核订单分期时异常:" + obj.toString(), e); 
			new MgException(20310,"审核订单分期时异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
}
