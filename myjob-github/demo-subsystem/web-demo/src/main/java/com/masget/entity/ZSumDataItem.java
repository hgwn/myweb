package com.masget.entity;

/*
 * 827510150130089 ¸ßÐÂÇø½ÝÂ·ÆûÅä¾­Óª²¿-ÎÄÁú                                                        C000111700529 D000000014803 C000111685726
 * 15位		+ 空格 + 80位 	+ 空格 + 13位 + 空格 + 13位 + 空格 + 13位 + 空格 + 200位
 * 商户编号			商户名称			交易金额		手续费		清算净额		 备注
 */
public class ZSumDataItem
{
	private String merchantid = "";				// 编号
	private String membername = "";				// 商户名称
	
	private String businessamountflag = "";		// 交易金额标志
	private long businessamount = 0;			// 交易金额
	
	private String possettlementflag = "";		// 手续费标志
	private long possettlement = 0;			// 手续费
	
	private String unionpaysettlementflag = "";	// 清算净额标志
	private long unionpaysettlement = 0;		// 清算净额	
	private String remark = "";	

	public ZSumDataItem()
	{
	}
	
	private void init()
	{
		merchantid = "";				// 编号
		membername = "";				// 商户名称
		businessamountflag = "";		// 交易金额标志
		businessamount = 0;				// 交易金额
		possettlementflag = "";			// 手续费标志
		possettlement = 0;				// 手续费
		unionpaysettlementflag = "";	// 清算净额标志
		unionpaysettlement = 0;			// 清算净额
		remark = "";
	}
	
	public boolean parse_line(String sLine)
	{
		boolean bOk = false;
		Double fTemp = 0.0;
		
		init();
		if (sLine.length() < 138) return false;
		
		try
		{
			merchantid = sLine.substring(0, 15);
			
			membername = sLine.substring(16, 96);			
			String sGBKTemp = new String(membername.getBytes("ISO8859-1"), "GBK");
			membername = sGBKTemp.trim();
			
			businessamountflag = sLine.substring(97, 98);
			
			fTemp = Double.parseDouble(sLine.substring(98, 110));
			businessamount = fTemp.longValue();
			
			possettlementflag = sLine.substring(111, 112);
			
			fTemp = Double.parseDouble(sLine.substring(112, 124));
			possettlement = fTemp.longValue();
			
			unionpaysettlementflag = sLine.substring(125, 126);
			
			fTemp = Double.parseDouble(sLine.substring(126, 138));
			unionpaysettlement = fTemp.longValue();
			remark = sLine.substring(139).trim();
			bOk = true;
		}
		catch (Exception ex)
		{
			
		}
		
		return bOk;
	}
	
	public String getRemark()
	{
		return remark;
	}
	
	public String getMerchantid()
	{
		return merchantid;
	}
	
	public String getMembername()
	{
		return membername;
	}
	
	public String getBusinessamountflag()
	{
		return businessamountflag;
	}
	
	public long getBusinessamount()
	{
		return businessamount;
	}
	
	public String getPossettlementflag()
	{
		return possettlementflag;
	}
	
	public long getPossettlement()
	{
		return possettlement;
	}
	
	public String getUnionpaysettlementflag()
	{
		return unionpaysettlementflag;
	}
	
	public long getUnionpaysettlement()
	{
		return unionpaysettlement;
	}
	
	
}
