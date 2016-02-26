package com.masget.controller.base;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;

/**
 * 站点Controller
 * @author cxq
 *
 */
@Controller
@RequestMapping("station")
public class StationController{

	
	/**
	 * 获取站点信息
	 * @param stationname 站点名称
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/list",method={RequestMethod.GET,RequestMethod.POST})
	public void list(
			@RequestParam(value="stationname",required=false) String stationname,
			@RequestParam(value="stationtypeid",required=false) Integer stationtypeid,
			@RequestParam(value="selfflag",required=false) Integer selfflag,
			@RequestParam(value="actionflag",required=false) Integer actionflag,
			@RequestParam(value="pagesize",required=false) Integer pagesize,
			@RequestParam(value="pagenum",required=false) Integer pagenum,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();

		if(stationname!=null&&!stationname.equals("")){
			dataMap.put("stationname", stationname);
		}
		
		if(stationtypeid != null && stationtypeid != 0){
			dataMap.put("stationtypeid", stationtypeid);
		}
		
		if(selfflag != null && selfflag != 0){
			dataMap.put("selfflag", selfflag);
		}
		
		if(actionflag != null && actionflag != 0){
			dataMap.put("actionflag", actionflag);
		}
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.station.getlist";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}

}
