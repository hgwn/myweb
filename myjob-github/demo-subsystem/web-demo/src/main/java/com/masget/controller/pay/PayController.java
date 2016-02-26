package com.masget.controller.pay;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;

@Controller
@RequestMapping("pay/com")
public class PayController {
	//private static String batch="000000";
	@RequestMapping(value="/get",method={RequestMethod.POST,RequestMethod.GET})
	public void getMposInfo(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request,HttpServletResponse response){
			System.out.println(data);
			JSONObject obj=JSONObject.fromObject(data);
			String serviceName="payService";
			String method="masget.pay.com.pospay.get";
	        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
	        if(result==null||result.equals("error")){
	        	result="{\"ret\":1,\"message\":\"dopost处理异常\"}";
	        }else{
	        	JSONObject jsondata = JSONObject.fromObject(result);
	        	if(!jsondata.containsKey("ret")){
	        		jsondata.put("ret", 0);
	        	}
	        	result=jsondata.toString();
	        	System.out.println(result);
	        }
			CommomUtil.writeResultBack(request, response, result);
		}
	@RequestMapping(value="/find",method={RequestMethod.POST,RequestMethod.GET})
	public void findMposname(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request,HttpServletResponse response){
			System.out.println(data);
			JSONObject obj=JSONObject.fromObject(data);
			String serviceName="baseService";
			String method="masget.base.com.companystaff.getstaff";
	        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
	        if(result==null||result.equals("error")){
	        	result="{\"ret\":1,\"message\":\"dopost处理异常\"}";
	        }else{
	        	JSONObject jsondata = JSONObject.fromObject(result);
	        	if(!jsondata.containsKey("ret")){
	        		jsondata.put("ret", 0);
	        	}
	        	result=jsondata.toString();
	        	System.out.println(result);
	        }
			CommomUtil.writeResultBack(request, response, result);
		}
	@RequestMapping(value="/signIn",method={RequestMethod.POST,RequestMethod.GET})
	public void signIn(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request,HttpServletResponse response){
			System.out.println(data);
			JSONObject obj=JSONObject.fromObject(data);
			String str=initSignIn(obj.getString("batchno"), obj.getString("terminalnumber"), obj.getString("merchantid"),obj.getString("batch"));
			String serviceName="payService";
			String method="masget.pay.com.pospay.signin";
	        String result = CommomUtil.CallApi(request, serviceName, method, str);
	        JSONObject resultData=new JSONObject();
	        if(result==null||result.equals("error")){
	        	result="{\"ret\":1,\"message\":\"dopost处理异常\"}";
	        }else{
	        	JSONObject jsondata = JSONObject.fromObject(result);
	        	if(jsondata.containsKey("39")){
	        		if(jsondata.getString("39").equals("00")){
	        			resultData.put("ret", 0);
	        		}else{
	        			resultData.put("ret", 1);
	        		}
	        	}else{
	        		resultData.put("ret", 1);
	        	}
	        	if(jsondata.containsKey("62")){
	        		String feild062=jsondata.getString("62");
		        	if (feild062.length() == 64) {
		    			String pin = feild062.substring(0, 32);
		    			String pinCheck = feild062.substring(32, 40);
		    			String mac = feild062.substring(40, 56);
		    			String macCheck = feild062.substring(56, 64);
		    			resultData.put("pin", pin);
		    			resultData.put("pinCheck", pinCheck);
		    			resultData.put("mac", mac);
		    			resultData.put("macCheck", macCheck);
		    		}else{
		    			resultData.put("ret", 1);
		    		}
	        	}else{
	        		resultData.put("ret", 1);
	        	}
	        	result=resultData.toString();
	        	System.out.println(result);
	        }
			CommomUtil.writeResultBack(request, response, result);
		}
	@RequestMapping(value="/consume",method={RequestMethod.POST,RequestMethod.GET})
	public void consume(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request,HttpServletResponse response){
			System.out.println(data);
			JSONObject obj=JSONObject.fromObject(data);
   			String cardno=obj.containsKey("cardno")?obj.getString("cardno"):"";
   			String terminalnumber=obj.containsKey("terminalnumber")?obj.getString("terminalnumber"):"";
			String businessno=obj.containsKey("businessno")?obj.getString("businessno"):"";
   			String batchno=obj.containsKey("batchno")?obj.getString("batchno"):"";
   			batchno=VerifyCode.getBatchNO(batchno);
   			String secondTrackData=obj.containsKey("secondTrackData")?obj.getString("secondTrackData"):"";
   			secondTrackData=secondTrackData.replaceAll("F", "").replaceAll("f", "").replace("=", "D");
   			String cardpin=obj.containsKey("cardpin")?obj.getString("cardpin"):"";
   			String money=obj.containsKey("money")?obj.getString("money"):"";
   			money=getMoney(money);
   			String tlv=obj.containsKey("tlv")?obj.getString("tlv"):"";
   			String type=obj.containsKey("type")?obj.getString("type"):"";
   			String batch=obj.containsKey("batch")?obj.getString("batch"):"";
   			Map<String,String> rep=new HashMap<String,String>();
   			//磁条卡
   			if(type.equals("1")){
   			//无密交易
   				if(PayConst.StripConsumeConst.hex8Zero.equalsIgnoreCase(cardpin)){
   					rep.put("2",cardno);
   					rep.put("3",PayConst.StripConsumeConst.Processing_Code);
   					rep.put("4", money);
   					rep.put("11", batchno);
   					rep.put("22", PayConst.StripConsumeConst.Entry_Mode_Code_Nopin);
   					rep.put("25", PayConst.StripConsumeConst.Condition_Mode);
   					rep.put("35", secondTrackData);
   					rep.put("41", terminalnumber);
   					rep.put("42", businessno);
   					rep.put("49", PayConst.StripConsumeConst.Currency_Code);
   					rep.put("60", "22"+batch+"00000050");
   					rep.put("64",  PayConst.StripConsumeConst.Mac);
   				}else{
   					rep.put("2",cardno);
   					rep.put("3",PayConst.StripConsumeConst.Processing_Code);
   					rep.put("4", money);
   					rep.put("11", batchno);
   					rep.put("22", PayConst.StripConsumeConst.Entry_Mode_Code_pin);
   					rep.put("25", PayConst.StripConsumeConst.Condition_Mode);
   					rep.put("26", PayConst.StripConsumeConst.Pin_apture_Code);
   					rep.put("35", secondTrackData);
   					rep.put("41", terminalnumber);
   					rep.put("42", businessno);
   					rep.put("49", PayConst.StripConsumeConst.Currency_Code);
   					rep.put("52", cardpin);
   					rep.put("53",  PayConst.StripConsumeConst.Control_Information);
   					rep.put("60", "22"+batch+"00000050");
   					rep.put("64",  PayConst.StripConsumeConst.Mac);
   				}
   			}else{
   				//ic卡
   				
   				//无密
   				if(PayConst.StripConsumeConst.hex8Zero.equalsIgnoreCase(cardpin)){
   					rep.put("2", cardno);
   	   				rep.put("3",PayConst.StripConsumeConst.Processing_Code);
   	   				rep.put("4", money);
   	   				rep.put("11", batchno);
   	   				rep.put("22", "0520");
   	   				//卡序列号
   	   				String feild023=getCardSequenceNumber(tlv);
   	   				if(feild023!=null){
   					for(int i=feild023.length();i<3;i++){
   						feild023="0"+feild023;
   						}
   					rep.put("23", feild023);
   	   				}
   	   				
   	   				rep.put("25", "82");
   	   				rep.put("35", secondTrackData);
   	   				rep.put("41", terminalnumber);
					rep.put("42", businessno);
					rep.put("49", PayConst.StripConsumeConst.Currency_Code);
					//55域
					String feild055=resolveFeild55(tlv);
					rep.put("55", feild055);
					rep.put("60", "22"+batch+"00000050");
					rep.put("64", PayConst.StripConsumeConst.Mac);
   				}else{
   					rep.put("2", cardno);
   	   				rep.put("3",PayConst.StripConsumeConst.Processing_Code);
   	   				rep.put("4", money);
   	   				rep.put("11", batchno);
   	   				rep.put("22", "0510");
   	   				//卡序列号
   	   				String feild023=getCardSequenceNumber(tlv);
   	   				if(feild023!=null){
   					for(int i=feild023.length();i<3;i++){
   						feild023="0"+feild023;
   						}
   					rep.put("23", feild023);
   	   				}
   	   				rep.put("25", "82");
   	   				rep.put("26", "06");
   	   				rep.put("35", secondTrackData);
   	   				rep.put("41", terminalnumber);
					rep.put("42", businessno);
					rep.put("49", PayConst.StripConsumeConst.Currency_Code);
					rep.put("52", cardpin);
   					rep.put("53",  PayConst.StripConsumeConst.Control_Information);
					//55域
					String feild055=resolveFeild55(tlv);
					rep.put("55", feild055);
					rep.put("60", "22"+batch+"00000050");
					rep.put("64", PayConst.StripConsumeConst.Mac);
   				}
   				
   			}
			
			String serviceName="payService";
			String method="masget.pay.com.pospay.consume";
			JSONObject resultData=new JSONObject();
			JSONObject jsondata=null;
	        String result = CommomUtil.CallApi(request, serviceName, method, VerifyCode.getPam("ReqConsume", rep));
	        if(result==null||result.equals("error")){
	        	result="{\"ret\":1,\"message\":\"dopost处理异常\"}";
	        }else{
	        	jsondata= JSONObject.fromObject(result);
	        	if(jsondata.containsKey("39")){
	        		if(jsondata.getString("39").equals("00")){
	        			resultData.put("ret", 0);
	        		}else{
	        			resultData.put("ret", 1);
	        		}
	        	}else{
	        		resultData.put("ret", 1);
	        	}
	        	result=resultData.toString();
	        	System.out.println(result);
	        }
	      //增加支付记录
	        if(jsondata!=null){
	        	String recordmethod="masget.pay.com.pospay.addConsumeRecord";
	        	Map<String,String> map=new HashMap<String,String>();
	        	map.put("cardno", jsondata.containsKey("2")?jsondata.getString("2"):null);
	        	map.put("processingcode", jsondata.containsKey("3")?jsondata.getString("3"):null);
	        	map.put("money", jsondata.containsKey("4")?jsondata.getString("4"):null);
	        	map.put("batchno", jsondata.containsKey("11")?jsondata.getString("11"):null);
	        	map.put("localcurtime", jsondata.containsKey("12")?jsondata.getString("12"):null);
	        	map.put("localcurdate", jsondata.containsKey("13")?jsondata.getString("13"):null);
	        	map.put("expirationdate", jsondata.containsKey("14")?jsondata.getString("14"):null);
	        	map.put("settlementdate", jsondata.containsKey("15")?jsondata.getString("15"):null);
	        	map.put("cardsequencenumber", jsondata.containsKey("23")?jsondata.getString("23"):null);
	        	map.put("conditionmode", jsondata.containsKey("25")?jsondata.getString("25"):null);
	        	map.put("identificationcode", jsondata.containsKey("32")?jsondata.getString("32"):null);
	        	map.put("secondtrackdata", jsondata.containsKey("35")?jsondata.getString("35"):null);
	        	map.put("referencenumber", jsondata.containsKey("37")?jsondata.getString("37"):null);
	        	map.put("identificationresponse", jsondata.containsKey("38")?jsondata.getString("38"):null);
	        	map.put("treminalnumber", jsondata.containsKey("41")?jsondata.getString("41"):null);
	        	map.put("businessnumber", jsondata.containsKey("42")?jsondata.getString("42"):null);
	        	map.put("dataprivate", jsondata.containsKey("48")?jsondata.getString("48"):null);
	        	map.put("currencycode", jsondata.containsKey("49")?jsondata.getString("49"):null);
	        	map.put("icdata", jsondata.containsKey("55")?jsondata.getString("55"):null);
	        	map.put("detailinquiring", jsondata.containsKey("59")?jsondata.getString("59"):null);
	        	map.put("serviceinformation", jsondata.containsKey("60")?jsondata.getString("60"):null);
	        	map.put("reservedprivate", jsondata.containsKey("61")?jsondata.getString("61"):null);
	        	map.put("messageauthenticationcode", jsondata.containsKey("64")?jsondata.getString("64"):null);
	        	map.put("relationnumber", obj.containsKey("relationnumber")?(obj.getString("relationnumber").equals("")?null:obj.getString("relationnumber")):null);
	        	map.put("type", obj.containsKey("c_type")?(obj.getString("c_type").equals("")?null:obj.getString("c_type")):null);
	        	map.put("consumestatu", jsondata.containsKey("39")?(jsondata.getString("39").equals("00")?"交易成功":"交易失败"):"交易失败");
	        	map.put("staffid", obj.containsKey("staffid")?(obj.getString("staffid").equals("")?null:obj.getString("staffid")):null);
	        	map.put("businessname", obj.containsKey("businessname")?(obj.getString("businessname").equals("")?null:obj.getString("businessname")):null);
	        	SimpleDateFormat sd=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	        	map.put("consumetime", sd.format(new Date()));
	        	Gson gson=new Gson();
	        	String str=gson.toJson(map);
	        	str = CommomUtil.CallApi(request, serviceName, recordmethod, str);
	        }
			CommomUtil.writeResultBack(request, response, result);
		}
	//冲正交易
	@RequestMapping(value="/reset",method={RequestMethod.POST,RequestMethod.GET})
	public void reset(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request,HttpServletResponse response){
		System.out.println(data);
		JSONObject obj=JSONObject.fromObject(data);
			String cardno=obj.containsKey("cardno")?obj.getString("cardno"):"";
			String terminalnumber=obj.containsKey("terminalnumber")?obj.getString("terminalnumber"):"";
		String businessno=obj.containsKey("businessno")?obj.getString("businessno"):"";
			String batchno=obj.containsKey("batchno")?obj.getString("batchno"):"";
			batchno=VerifyCode.getBatchNO(batchno);
			String secondTrackData=obj.containsKey("secondTrackData")?obj.getString("secondTrackData"):"";
			secondTrackData=secondTrackData.replaceAll("F", "").replaceAll("f", "").replace("=", "D");
			String cardpin=obj.containsKey("cardpin")?obj.getString("cardpin"):"";
			String money=obj.containsKey("money")?obj.getString("money"):"";
			money=getMoney(money);
			String tlv=obj.containsKey("tlv")?obj.getString("tlv"):"";
			String type=obj.containsKey("type")?obj.getString("type"):"";
			String batch=obj.containsKey("batch")?obj.getString("batch"):"";
			Map<String,String> correct=new HashMap<String,String>();
			SimpleDateFormat sd=new SimpleDateFormat("MMdd");
			String d=sd.format(new Date());
			//磁条卡
   			if(type.equals("1")){
   			//没有收到响应 发起冲正交易
				correct.put("3",PayConst.StripConsumeConst.Processing_Code);
				correct.put("4",money);
				correct.put("11",batchno);
				if(PayConst.StripConsumeConst.hex8Zero.equalsIgnoreCase(cardpin)){
					//无密操作
					correct.put("22", PayConst.StripConsumeConst.Entry_Mode_Code_Nopin);
				}else{
					correct.put("22", PayConst.StripConsumeConst.Entry_Mode_Code_pin);
				}
				correct.put("25", PayConst.StripConsumeConst.Condition_Mode);
				correct.put("35", secondTrackData);
				correct.put("39", "98");
				correct.put("41", terminalnumber);
				correct.put("42", businessno);
				correct.put("49", PayConst.StripConsumeConst.Currency_Code);
				correct.put("60", "22"+batch+"00000050");
				correct.put("61", batch+batchno+d+"00"+""+"00000000000"+"0200");
				correct.put("64", PayConst.StripConsumeConst.Mac);
   			}else{
   				correct.put("3",PayConst.StripConsumeConst.Processing_Code);
				correct.put("4",money);
				correct.put("11",batchno);
				if(PayConst.StripConsumeConst.hex8Zero.equalsIgnoreCase(cardpin)){
					//无密操作
					correct.put("22", "0520");
				}else{
					correct.put("22", "0510");
				}
				//卡序列号
	   			String feild023=getCardSequenceNumber(tlv);
	   			if(feild023!=null){
				for(int i=feild023.length();i<3;i++){
					feild023="0"+feild023;
				}
				correct.put("23", feild023);
				}
				correct.put("25", PayConst.StripConsumeConst.Condition_Mode);
				correct.put("35", secondTrackData);
				correct.put("39", "98");
				correct.put("41", terminalnumber);
				correct.put("42", businessno);
				correct.put("49", PayConst.StripConsumeConst.Currency_Code);
				//correct.put("55", feild055);
				correct.put("60", "22"+batch+"00000050");
				correct.put("61", batch+batchno+d+"00"+""+"00000000000"+"0200");
				correct.put("64", PayConst.StripConsumeConst.Mac);
   			}
   			String serviceName="payService";
			String method="masget.pay.com.pospay.consumeCorrect";
			JSONObject resultData=new JSONObject();
	        String result = CommomUtil.CallApi(request, serviceName, method, VerifyCode.getPam("Correct", correct));
	        if(result==null||result.equals("error")){
	        	result="{\"ret\":1,\"message\":\"dopost处理异常\"}";
	        }else{
	        	JSONObject jsondata = JSONObject.fromObject(result);
	        	if(jsondata.containsKey("39")){
	        		if(jsondata.getString("39").equals("00")||jsondata.getString("39").equals("25")){
	        			resultData.put("ret", 0);
	        		}else{
	        			resultData.put("ret", 1);
	        		}
	        	}else{
	        		resultData.put("ret", 1);
	        	}
	        	result=resultData.toString();
	        	System.out.println(result);
	        }
			CommomUtil.writeResultBack(request, response, result);

	}
	//撤销交易
		@RequestMapping(value="/cancle",method={RequestMethod.POST,RequestMethod.GET})
		public void cancle(
				@RequestParam(value="data",required=false) String data,
				HttpServletRequest request,HttpServletResponse response){
			System.out.println(data);
			JSONObject obj=JSONObject.fromObject(data);
				String cardno=obj.containsKey("cardno")?obj.getString("cardno"):"";
				String terminalnumber=obj.containsKey("terminalnumber")?obj.getString("terminalnumber"):"";
			String businessno=obj.containsKey("businessno")?obj.getString("businessno"):"";
				String batchno=obj.containsKey("batchno")?obj.getString("batchno"):"";
				batchno=VerifyCode.getBatchNO(batchno);
				String secondTrackData=obj.containsKey("secondTrackData")?obj.getString("secondTrackData"):"";
				secondTrackData=secondTrackData.replaceAll("F", "").replaceAll("f", "").replace("=", "D");
				String cardpin=obj.containsKey("cardpin")?obj.getString("cardpin"):"";
				String money=obj.containsKey("money")?obj.getString("money"):"";
				money=getMoney(money);
				String tlv=obj.containsKey("tlv")?obj.getString("tlv"):"";
				String type=obj.containsKey("type")?obj.getString("type"):"";
				String batch=obj.containsKey("batch")?obj.getString("batch"):"";
				Map<String,String> resetMap=new HashMap<String,String>();
				SimpleDateFormat sd=new SimpleDateFormat("MMdd");
				String d=sd.format(new Date());
				String transactionrecordid=obj.containsKey("transactionrecordid")?obj.getString("transactionrecordid"):"";
				String result=null;
				String serviceName="payService";
				String method="masget.pay.com.pospay.consume";
				if(transactionrecordid.equals("")){
					result="{\"ret\":1,\"message\":\"dopost处理异常\"}";
				}
				//查询支付记录
				String searchmethod="masget.pay.com.pospay.findConsumeRecord";
				JSONObject searchData=new JSONObject();
				searchData.put("transactionrecordid", transactionrecordid);
		        String searchResult = CommomUtil.CallApi(request, serviceName, searchmethod, searchData.toString());
		        JSONObject seatchDataResult=JSONObject.fromObject(searchResult);
		        if(seatchDataResult.getJSONArray("data").size()<=0){
		        	result="{\"ret\":1,\"message\":\"dopost处理异常\"}";
		        	CommomUtil.writeResultBack(request, response, result);
		        	return;
		        }
		        seatchDataResult=seatchDataResult.getJSONArray("data").getJSONObject(0);
				//磁条卡
	   			if(type.equals("1")){
	   				resetMap.put("2",cardno);
					resetMap.put("3", "280000");
					resetMap.put("4", money);
					resetMap.put("11", batchno);
					resetMap.put("25", "82");
					resetMap.put("35", secondTrackData);
					resetMap.put("37", seatchDataResult.getString("referencenumber"));
					resetMap.put("41", terminalnumber);
					resetMap.put("42", businessno);
					resetMap.put("49", "156");
					resetMap.put("60", "23"+batch+"00000050");
					resetMap.put("61", seatchDataResult.getString("serviceinformation").substring(2,8)+seatchDataResult.getString("batchno")+seatchDataResult.getString("localcurdate")+"00"+""+"00000000000"+"0200");
					resetMap.put("64", PayConst.StripConsumeConst.Mac);
					if(seatchDataResult.getString("identificationresponse").equals("")||seatchDataResult.getString("identificationresponse")==null){
						
					}else{
						resetMap.put("38", seatchDataResult.getString("identificationresponse"));
					}
					if(PayConst.StripConsumeConst.hex8Zero.equalsIgnoreCase(cardpin)){
						resetMap.put("22", PayConst.StripConsumeConst.Entry_Mode_Code_Nopin);
					}
					else{
						resetMap.put("22", PayConst.StripConsumeConst.Entry_Mode_Code_pin);
						resetMap.put("26", PayConst.StripConsumeConst.Pin_apture_Code);
						resetMap.put("52", cardpin);
						resetMap.put("53", PayConst.StripConsumeConst.Control_Information);
					}
	   			}else{
	   				resetMap.put("2",cardno);
					resetMap.put("3", "280000");
					resetMap.put("4", money);
					resetMap.put("11", batchno);
					String feild023=getCardSequenceNumber(tlv);
					if(feild023!=null){
						for(int i=feild023.length();i<3;i++){
							feild023="0"+feild023;
						}
						resetMap.put("23", feild023);
					}
					resetMap.put("25", "82");
					resetMap.put("35", secondTrackData);
					resetMap.put("37", seatchDataResult.getString("referencenumber"));
					resetMap.put("41", terminalnumber);
					resetMap.put("42", businessno);
					resetMap.put("49", "156");
					resetMap.put("60", "23"+batch+"00000050");
					resetMap.put("61", seatchDataResult.getString("serviceinformation").substring(2,8)+seatchDataResult.getString("batchno")+seatchDataResult.getString("localcurdate")+"00"+""+"00000000000"+"0200");
					resetMap.put("64", PayConst.StripConsumeConst.Mac);
					if(seatchDataResult.getString("identificationresponse").equals("")||seatchDataResult.getString("identificationresponse")==null){
						
					}else{
						resetMap.put("38", seatchDataResult.getString("identificationresponse"));
					}
					if(PayConst.StripConsumeConst.hex8Zero.equalsIgnoreCase(cardpin)){
						resetMap.put("22", "0520");
					}
					else{
						resetMap.put("22", "0510");
						resetMap.put("26", PayConst.StripConsumeConst.Pin_apture_Code);
						resetMap.put("52", cardpin);
						resetMap.put("53", PayConst.StripConsumeConst.Control_Information);
					}
	   			}
				JSONObject resultData=new JSONObject();
		        result = CommomUtil.CallApi(request, serviceName, method, VerifyCode.getPam("ReqConsume", resetMap));
		        if(result==null||result.equals("error")){
		        	result="{\"ret\":1,\"message\":\"dopost处理异常\"}";
		        }else{
		        	JSONObject jsondata = JSONObject.fromObject(result);
		        	if(jsondata.containsKey("39")){
		        		if(jsondata.getString("39").equals("00")||jsondata.getString("39").equals("25")){
		        			resultData.put("ret", 0);
		        			//更新支付记录
		        			JSONObject updateJson=new JSONObject();
		        			updateJson.put("transactionrecordid", transactionrecordid);
		        			updateJson.put("consumestatu", "已撤销");
		        			CommomUtil.CallApi(request, serviceName, "masget.pay.com.pospay.updateConsumeRecord", updateJson.toString());
		        		}else{
		        			resultData.put("ret", 1);
		        		}
		        	}else{
		        		resultData.put("ret", 1);
		        	}
		        	result=resultData.toString();
		        	System.out.println(result);
		        }
				CommomUtil.writeResultBack(request, response, result);

		}
	@RequestMapping(value="/searchRecord" 	,method={RequestMethod.POST,RequestMethod.GET})
	public void searchRecord(
			@RequestParam(value="relationnumber",required=false) String relationnumber,
			@RequestParam(value="consumestatu",required=false) String consumestatu,
			@RequestParam(value="beginconsumetime",required=false) String beginconsumetime,
			@RequestParam(value="endconsumetime",required=false) String endconsumetime,
			@RequestParam(value="pagenum",required=false) String pagenum,
			@RequestParam(value="pagesize",required=false) String pagesize,
			@RequestParam(value="staffid",required=false) String staffid,
			HttpServletRequest request,HttpServletResponse response){
			Map<String,String> map=new HashMap<String,String>();
			map.put("relationnumber", relationnumber);
			map.put("consumestatu", consumestatu);
			map.put("beginconsumetime", beginconsumetime);
			map.put("endconsumetime", endconsumetime);
			map.put("pagenum", pagenum);
			map.put("pagesize", pagesize);
			map.put("staffid", staffid);
			 Gson gson = new Gson();
			 String jsonStr = gson.toJson(map);
			//obj=obj.getJSONObject("data");
			String serviceName="payService";
			String method="masget.pay.com.pospay.findConsumeRecord";
	        String result = CommomUtil.CallApi(request, serviceName, method, jsonStr);
	        if(result==null||result.equals("error")){
	        	result="{\"ret\":1,\"message\":\"dopost处理异常\"}";
	        }else{
	        	JSONObject jsondata = JSONObject.fromObject(result);
	        	if(!jsondata.containsKey("ret")){
	        		jsondata.put("ret", 0);
	        	}
	        	result=jsondata.toString();
	        	System.out.println(result);
	        }
			CommomUtil.writeResultBack(request, response, result);
		}
	//外部调用增加支付记录
	@RequestMapping(value="/addPayRecord",method={RequestMethod.POST,RequestMethod.GET})
	public void addPayRecord(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request,HttpServletResponse response){
			JSONObject obj=JSONObject.fromObject(data);
			//obj=obj.getJSONObject("data");
			String serviceName="payService";
			String method="masget.pay.com.pospay.addConsumeRecord";
	        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
	        if(result==null||result.equals("error")){
	        	result="{\"ret\":1,\"message\":\"dopost处理异常\"}";
	        }else{
	        	JSONObject jsondata = JSONObject.fromObject(result);
	        	if(!jsondata.containsKey("ret")){
	        		jsondata.put("ret", 0);
	        	}
	        	result=jsondata.toString();
	        	System.out.println(result);
	        }
			CommomUtil.writeResultBack(request, response, result);
		}
	//初始化签到参数
	private String initSignIn(String batchNO,String terminalNumber,String businessNumber,String batch) {
			//流水号
			//批次号
			int arr[] = new int[] { 11, 41, 42, 60, 63 };
			List<String> lists = new ArrayList<String>();
			lists.add(batchNO);
			lists.add(terminalNumber);
			lists.add(businessNumber);
			lists.add("00" + batch + "003");
			lists.add(terminalNumber);
			return VerifyCode.reqpam("ReqSign", arr, lists);
		}
	public static String getMoney(String money) {
		DecimalFormat df = new DecimalFormat("#0.00");
		String str=null;
		if(money!=null&&!money.equals("")){
			str=df.format(Double.parseDouble(money)).replaceAll("\\.", "");
		}else{
			str="";
		}
		return VerifyCode.LeftFillString(str, 12, "0");
	}
	//解析tlv数据获取55域值
	public static String resolveFeild55(String tlv){
		tlv=tlv.toUpperCase();
		Map<String,Tlv> map=TlvUtils.builderTlvMap(tlv);
//		Iterator<String> it=map.keySet().iterator();
//		while(it.hasNext()){
//			String key=it.next();
//			System.out.println(key+","+map.get(key));
//		}
		List<String> L_55TAGS=new ArrayList<String>();
		L_55TAGS.add("9f26");
		L_55TAGS.add("9F27");
		L_55TAGS.add("9F10");
		L_55TAGS.add("9F37");
		L_55TAGS.add("9F36");
		L_55TAGS.add("95");
		L_55TAGS.add("9A");
		L_55TAGS.add("9C");
		L_55TAGS.add("9F02");
		L_55TAGS.add("5F2A");
		L_55TAGS.add("82");
		L_55TAGS.add("9F1A");
		L_55TAGS.add("9F03");
		L_55TAGS.add("9F33");
		L_55TAGS.add("9F74");
		L_55TAGS.add("9F34");
		L_55TAGS.add("9F35");
		L_55TAGS.add("9F1E");
		L_55TAGS.add("84");
		L_55TAGS.add("9F09");
		L_55TAGS.add("9F41");
		L_55TAGS.add("91");
		L_55TAGS.add("71");
		L_55TAGS.add("72");
		L_55TAGS.add("DF31");
		L_55TAGS.add("9F63");
		L_55TAGS.add("8A");
		L_55TAGS.add("DF32");
		L_55TAGS.add("DF33");
		L_55TAGS.add("DF34");
		StringBuilder result=new StringBuilder();
		int count=0;
		for(int i=0;i<L_55TAGS.size();i++){
			if(map.containsKey(L_55TAGS.get(i).toLowerCase())){
				result.append(map.get(L_55TAGS.get(i).toLowerCase()).toString());
			}
			else if(map.containsKey(L_55TAGS.get(i).toUpperCase())){
				result.append(map.get(L_55TAGS.get(i).toUpperCase()).toString());
			}else{
				
			}
		}
		return result.toString();
	}
	public String getCardSequenceNumber(String tlv){
		tlv=tlv.toUpperCase();
		Map<String,Tlv> map=TlvUtils.builderTlvMap(tlv);
		if(map.containsKey("5F34")){
			return map.get("5F34").getValue();
		}
		else{
			return null;
		}
	}
	public static void main(String[] args) {
		System.out.println(resolveFeild55("9F4104000001179F4005FF80F0B0019F03060000000000009F020600000000111082027C004F08A0000003330101018408A0000003330101019F090200209A0315070157136222083602013891103D24062202409991628F9B02E8009C01009F120D494342432050626F6343617264500A50424F432044656269749F101307010103A0A002010A0100000000000986A76E9F1E0831313131313131319F1A020840950500000488009F5D060000000000005A0A6222083602013891103F9F2701805F2A0201569F2608AE5E72AF358AE7619F21031634095F24032406309F34030203009F3501349F360201249F3704DF1FD5FE9F3303E0F8C89F79060000000000005F3401019F390105DF750103DF760400000000".toUpperCase()));
	//System.out.println(getCardSequenceNumber("9F4104000001179F4005FF80F0B0019F03060000000000009F020600000000111082027C004F08A0000003330101018408A0000003330101019F090200209A0315070157136222083602013891103D24062202409991628F9B02E8009C01009F120D494342432050626F6343617264500A50424F432044656269749F101307010103A0A002010A0100000000000986A76E9F1E0831313131313131319F1A020840950500000488009F5D060000000000005A0A6222083602013891103F9F2701805F2A0201569F2608AE5E72AF358AE7619F21031634095F24032406309F34030203009F3501349F360201249F3704DF1FD5FE9F3303E0F8C89F79060000000000005F3401019F390105DF750103DF760400000000"));
	}
}
