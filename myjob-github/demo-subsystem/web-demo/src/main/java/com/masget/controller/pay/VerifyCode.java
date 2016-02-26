package com.masget.controller.pay;

import java.text.DecimalFormat;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class VerifyCode {
	public static String mpexNO="000000";
	public static String MaxNO="999999";
	public static String getBatchNO(String pexNO){
//		Random localRandom = new Random();
//	    String str1 = "";
//	    for (int i = 0; ; i++)
//	    {
//	      if (i >= paramInt)
//	        return str1;
//	      String str2 = String.valueOf(localRandom.nextInt(10));
//	      str1 = str1 + str2;
//	    }
		if(pexNO==null){
			pexNO=mpexNO;
		}
		if(pexNO.equals("999999")){
			pexNO=mpexNO;
		}
		Integer result=Integer.valueOf(pexNO)+1;
		DecimalFormat df = new DecimalFormat("000000");
		return df.format(result);
		
	}
	public static String reqpam(String messageType,int[] arr,List<String> lists){
		JsonObject json=new JsonObject();
		JsonArray jArray=new JsonArray();
		for(int i=0;i<arr.length;i++){
			JsonObject temp=new JsonObject();
			temp.addProperty("feildName", arr[i]);
			temp.addProperty("value", lists.get(i));
			jArray.add(temp);
		}
		json.add("data", jArray);
		json.addProperty("messageType", messageType);
		return json.toString();
	}
	public static String getPam(String messageType,Map<String,String> map){
		JsonObject json=new JsonObject();
		JsonArray jArray=new JsonArray();
//		for(int i=0;i<map.keySet().size();i++){
//			JsonObject temp=new JsonObject();
//			temp.addProperty("feildName", map.keySet().);
//			temp.addProperty("value", lists.get(i));
//			jArray.add(temp);
//		}
		Iterator<String> i=map.keySet().iterator();
		while(i.hasNext()){
			JsonObject temp=new JsonObject();
			String key=i.next();
			temp.addProperty("feildName",  key);
			temp.addProperty("value", map.get(key));
			jArray.add(temp);
		}
		json.add("data", jArray);
		json.addProperty("messageType", messageType);
		return json.toString();
	}
	public static String rightFillString(String str,int length,String fillstr){
		StringBuilder sb=new StringBuilder(str);
		for(int i=str.length();i<length;i++){
			sb.append(fillstr);
		}
		return sb.toString();
	}
	public static String LeftFillString(String str,int length,String fillstr){
		if(str==null||str.equals("")){
			return null;
		}
		StringBuilder sb=new StringBuilder(str);
		for(int i=str.length();i<length;i++){
			sb.insert(0, fillstr);
		}
		return sb.toString();
	}
	/**
	 * 将16机制形式的字符串转成ascii字符串
	 * @param str
	 * @return
	 */
	public static String HexToString(String hex){
		  StringBuilder sb = new StringBuilder();
		  StringBuilder temp = new StringBuilder();

		  for( int i=0; i<hex.length()-1; i+=2 ){
		      String output = hex.substring(i, (i + 2));
		      int decimal = Integer.parseInt(output, 16);
		      sb.append((char)decimal);
		      temp.append(decimal);
		  }
		  return sb.toString();
	}
}