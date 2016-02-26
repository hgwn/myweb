package com.masget.util.file;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.masget.util.ObjectParser;
import com.masget.utils.CommonUtil;



public class XmcmbcMakeFile {

	private static int num = 0;//当天入账次数
	private static int recordCount = 4000; //文件存放记录条数
	
	private static SimpleDateFormat nowdate = new SimpleDateFormat("yyyyMMdd");
	private static String date = nowdate.format(new Date());

	public static void main(String[] args) {

		String data = GetData.getData();
		try {
			getMakefile("D:/test/",data);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	@SuppressWarnings("unchecked")
	public static String getMakefile(String path,String data) 
			throws Exception{
		
		Map<String, Object> dataMap = CommonUtil.baseDataCheck(data);
		List<Map<String, Object>> dataList = (List<Map<String, Object>>) dataMap.get("data");
		
		dataMap = getReqOrOutList(dataList);
		
		List<Map<String, Object>> reqList = new ArrayList<Map<String,Object>>();//本行
		List<Map<String, Object>> reqOutList = new ArrayList<Map<String,Object>>();//分行
		
		reqList = (List<Map<String, Object>>)dataMap.get("reqList");
		reqOutList = (List<Map<String, Object>>)dataMap.get("reqOutList");

		//写入本行数据
				if(reqList.size()/recordCount!=0){
					int re = 0;
					if(reqList.size()%recordCount!=0){
						re = 1;
					}
					for(int i=0;i<reqList.size()/recordCount+re;i++){
						if(i==reqList.size()/recordCount){
							printReq(reqList.subList(i*recordCount, reqList.size()), path);
							break;
						}
						printReq(reqList.subList(i*recordCount, i*recordCount+recordCount), path);
					}
				}else{
					printReq(reqList, path);
			}
				//写入分行数据
				if(reqOutList.size()/recordCount!=0){
					int re = 0;
					if(reqOutList.size()%recordCount!=0){
						re = 1;
					}
					for(int i=0;i<reqOutList.size()/recordCount+re;i++){
						if(i==reqOutList.size()/recordCount){
							printReqOut(reqOutList.subList(i*recordCount, reqOutList.size()), path);
							break;
						}
						printReqOut(reqOutList.subList(i*recordCount, i*recordCount+recordCount), path);
					}
				}else{
						printReqOut(reqOutList, path);
				}
		
		return "success";
	}
	/**
	 * 写入本行数据
	 * @param reqList
	 * @param path
	 */
	public static void printReq(List<Map<String, Object>> reqList,String path){
		FileOutputStream fileOut;
		try {
			double totalmaney = 0;
			for (Map<String, Object> map : reqList) {
				totalmaney += ObjectParser.toDouble(map.get("Payeramt"));
			}
			
			num+=1;
			
			String strCount = num+"";
			for(int i=strCount.length();i<3;i++){
				strCount="0"+strCount;
			}
			fileOut = new FileOutputStream(path+"req_"+date+"_"+strCount+".txt");
			PrintStream ps = new PrintStream(fileOut);
			ps.println("P|"+reqList.size()+"|"+totalmaney);
			for (Map<String, Object> map : reqList) {
				ps.println(map.get("Tansfersequence")+"|"
						+map.get("Payeeacct")+"|"
						+map.get("Payeename")+"|"
						+map.get("Payeramt")+"|"
						+map.get("POS款")+"|"
						+map.get("Remark_Sequence"));
			}
			ps.println("########");
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 写入他行数据
	 * @param reqList
	 * @param path
	 */
	public static void printReqOut(List<Map<String, Object>> reqOutList,String path){
		FileOutputStream fileOut;
		try {
			double totalmoney = 0;
			for (Map<String, Object> map : reqOutList) {
				totalmoney += ObjectParser.toDouble(map.get("Payeramt"));
			}
			num+=1;
			String strCount = num+"";
			for(int i=strCount.length();i<3;i++){
				strCount="0"+strCount;
			}
			fileOut = new FileOutputStream(path+"req_outer_"+date+"_"+strCount+".txt");
			PrintStream ps = new PrintStream(fileOut);
			ps.println("PO|"+reqOutList.size()+"|"+totalmoney);
			for (Map<String, Object> map : reqOutList) {
				ps.println(map.get("Tansfersequence")+"|"
						+map.get("Payeeacct")+"|"
						+map.get("Payeename")+"|"
						+map.get("Bnkcode")+"|"
						+map.get("Payeebranchname")+"|"
						+map.get("Payeramt")+"|"
						+map.get("POS款")+"|"
						+map.get("Remark_Sequence"));
			}
			ps.println("########");
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 对数据进行分离，分为两个集合本行和他行
	 * @param dataList
	 * @return
	 */
	public static Map<String,Object> getReqOrOutList(List<Map<String, Object>> dataList){
		
		Map<String,Object> dataMap = new HashMap<String, Object>();
		List<Map<String, Object>> reqList = new ArrayList<Map<String,Object>>();//本行
		List<Map<String, Object>> reqOutList = new ArrayList<Map<String,Object>>();//他行
		
		for (Map<String, Object> map : dataList) {
			int ordertype = ObjectParser.toInteger(map.get("ordertype"));
			if(ordertype==1||ordertype==3){
				//本行
				reqList.add(map);
			}
			if(ordertype==2||ordertype==4){
				//他行
				reqOutList.add(map);
			}
		}
		
		dataMap.put("reqList", reqList);
		dataMap.put("reqOutList", reqOutList);
		return dataMap;
	}
}
