package com.masget.controller.rboperationsmanager;

public class OperationsManagerResult {
	private int ret;
	private String message;
	private RbOperationsManagerEntity fails;
	public int getRet() {
		return ret;
	}
	public void setRet(int ret) {
		this.ret = ret;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public RbOperationsManagerEntity getFails() {
		return fails;
	}
	public void setFails(RbOperationsManagerEntity fails) {
		this.fails = fails;
	}
}
