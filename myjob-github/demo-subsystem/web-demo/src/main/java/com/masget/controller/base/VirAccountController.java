package com.masget.controller.base;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.entity.RetStruct;
import com.masget.util.CommomUtil;

/**
 *虚拟账户Controller
 * @author cxq
 *
 */
@Controller
@RequestMapping("/virAccount")
public class VirAccountController{
	
	/**
	 * 获取虚拟账户信息
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void list(
			HttpServletRequest request, HttpServletResponse response){
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("pagesize", 5);
		dataMap.put("pagenum", 1);
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.account.viraccount.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 获取虚拟账户信息-部分信息
	 * @param request
	 * @param response
	 */
	@RequestMapping("/get")
	public void get(
			HttpServletRequest request, HttpServletResponse response){
		
			//获取虚拟账户信息
			Map<String, Object> dataMap=new HashMap<String, Object>();
			dataMap.put("pagesize", 5);
			dataMap.put("pagenum", 1);
			String data=new Gson().toJson(dataMap);
			
			String method="masget.base.account.viraccount.get";
			
	        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
			
	        //获取账户类型名称，账户编号，账户余额
	        String accounttypename="",accountNum="",curbalance="0";
	        RetStruct retStruct=new Gson().fromJson(result, RetStruct.class);
	        if(retStruct!=null&&retStruct.getData()!=null&&retStruct.getData().getRows()!=null){
	        	JSONObject virAccount=JSONObject.fromObject(retStruct.getData().getRows().get(0));
	        	accounttypename=virAccount.get("accounttypename")!=null?virAccount.get("accounttypename").toString():"";
	        	accountNum=virAccount.get("accountnum")!=null?virAccount.get("accountnum").toString():"";
	        	curbalance=virAccount.get("curbalance")!=null?virAccount.get("curbalance").toString():"0";
	        }
	        
	        Map<String, Object> resultMap=new HashMap<String, Object>();
	        resultMap.put("accounttypename", accounttypename);
	        resultMap.put("accountnum", accountNum);
	        resultMap.put("curbalance", curbalance);
	        
	        String str=new Gson().toJson(resultMap);
	       
		
		CommomUtil.writeResultBack(request, response, str);
		
		System.out.println(result);
	}
	
	/**
	 * 获取虚拟账户信息-部分信息
	 * @param request
	 * @param response
	 */
	@RequestMapping("/checkPassword")
	public void checkPassword(
			@RequestParam(value="payPassword",required=true) String payPassword,
			HttpServletRequest request, HttpServletResponse response){
		
			//获取虚拟账户信息
			Map<String, Object> dataMap=new HashMap<String, Object>();
			dataMap.put("pagesize", 5);
			dataMap.put("pagenum", 1);
			String data=new Gson().toJson(dataMap);
			
			String method="masget.base.account.viraccount.get";
			
	        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
			
	        //获取账户类型名称，账户编号，账户余额
	        String paymentpwd="";
	        RetStruct retStruct=new Gson().fromJson(result, RetStruct.class);
	        if(retStruct!=null&&retStruct.getData()!=null&&retStruct.getData().getRows()!=null){
	        	JSONObject virAccount=JSONObject.fromObject(retStruct.getData().getRows().get(0));
	        	paymentpwd=virAccount.get("paymentpwd")!=null?virAccount.get("paymentpwd").toString():"";
	        }
	        
	        Map<String, Object> resultMap=new HashMap<String, Object>();
	        
	        if(paymentpwd.equals(payPassword)){
	        	resultMap.put("isPwdCorrect", true);
	        }else{
	        	resultMap.put("isPwdCorrect", false);
	        }
	        
	        String str=new Gson().toJson(resultMap);
	       
		
		CommomUtil.writeResultBack(request, response, str);
		
		System.out.println(result);
	}

}
