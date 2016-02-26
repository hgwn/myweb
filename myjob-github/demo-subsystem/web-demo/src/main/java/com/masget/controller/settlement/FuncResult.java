package com.masget.controller.settlement;

public class FuncResult {
	private long ret = 0;
	private String error = "";
	private String sret = "";
	
	public void set_data(long nRet, String sError)
	{
		this.ret = nRet;
		this.error = sError;
	}
	
	public void set_data(String sRet, String sError)
	{
		this.sret = sRet;
		this.error = sError;
	}
	
	public long get_ret(){ return this.ret; }
	public String get_error(){ return this.error; }
	public String get_sret(){ return this.sret; }
}
