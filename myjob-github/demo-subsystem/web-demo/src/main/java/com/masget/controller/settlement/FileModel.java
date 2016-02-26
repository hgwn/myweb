package com.masget.controller.settlement;

import java.io.Serializable;

public class FileModel implements Serializable
{
	private static final long serialVersionUID = 7964950152782381235L;  
    private String name;  
    private long size;  
    private String path;  
    private String type;
    private int result = 0;
    private String des = "";
    
    public void setDes(String sDes)
    {
    	this.des = sDes;
    }
    
    public String getDes()
    {
    	return this.des;
    }
    
    public void setResult(int nResult)
    {
    	this.result = nResult;
    }
    
    public int getResult()
    {
    	return this.result;
    }
  
    /** 
     * @return the path 
     */  
    public String getPath() {  
        return path;  
    }  
  
    /** 
     * @param path the path to set 
     */  
    public void setPath(String path) {  
        this.path = path;  
    }  
  
    /** 
     * @return the name 
     */  
    public String getName() {  
        return name;  
    }  
  
    /** 
     * @param name the name to set 
     */  
    public void setName(String name) {  
        this.name = name;  
    }  
  
    /** 
     * @return the size 
     */  
    public long getSize() {  
        return size;  
    }  
  
    /** 
     * @param size the size to set 
     */  
    public void setSize(long size) {  
        this.size = size;  
    }  
  
    public String getType() {  
        return type;  
    }  
  
    public void setType(String type) {  
        this.type = type;  
    }
}
