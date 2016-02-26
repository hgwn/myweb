package com.masget.controller.pay;

import com.google.gson.Gson;

public class Tlv {
	/** 子域Tag标签 */  
    private String tag;  
  
    /** 子域取值的长度 */  
    private int length;  
  
    /** 子域取值 */  
    private String value;  
  
    public Tlv(String tag, int length, String value) {  
        this.length = length;  
        this.tag = tag;  
        this.value = value;  
    }  
  
    public String getTag() {  
        return tag;  
    }  
  
    public void setTag(String tag) {  
        this.tag = tag;  
    }  
  
    public int getLength() {  
        return length;  
    }  
  
    public void setLength(int length) {  
        this.length = length;  
    }  
  
    public String getValue() {  
        return value;  
    }  
  
    public void setValue(String value) {  
        this.value = value;  
    }

    @Override
	public String toString() {
    	String result="";
    	String l=Integer.toHexString(length).toUpperCase();
		if(l.length()%2!=0){
			l="0"+l;
		}
		if(length>0&&length<=127){
			result=l;
		}else if(length>127&&length<=255){
			result="81"+l;
		}else{
			result="82"+l;
		}
		return  tag+result+value;
	}  
}
