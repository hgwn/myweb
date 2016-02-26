package com.masget.controller.base;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.entity.RetStruct;
import com.masget.util.CommomUtil;

/**
 * 通讯录分组Controller
 * @author cxq
 *
 */
@Controller
@RequestMapping("base/addressGroup")
public class AddressGroupController{

	
	/**
	 * 获取通讯录分组信息
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void list(
			@RequestParam(value="addressgroupname", required = false) String addressgroupname,
			@RequestParam(value="scenetypeid", required = true) String scenetypeid,
			@RequestParam(value="pageNum", required = true) String pageNum,
			@RequestParam(value="pageSize", required = true) String pageSize,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		if(addressgroupname!=null&&!addressgroupname.trim().equals("")){
			dataMap.put("addressgroupname", addressgroupname);
		}
		
		dataMap.put("scenetypeid", scenetypeid);
		dataMap.put("pagenum", pageNum);
		dataMap.put("pagesize", pageSize);
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.addressgroup.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
}
