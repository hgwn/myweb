package com.masget.entity;

import java.util.List;

public class AcomaZHEntity
{
	private long cost = 0;				// 成本
	private long zhratio = 0;			// 中行比率
	private long pfratio = 0;			// 浦发比率
	private List<AcomaEntity> entitys = null;
	
	public long getCost() {
		return cost;
	}
	public long getZhratio() {
		return zhratio;
	}
	public long getPfratio() {
		return pfratio;
	}
	public List<AcomaEntity> getAcomaentity() {
		return entitys;
	}
	public void setCost(long cost) {
		this.cost = cost;
	}
	public void setZhratio(long zhratio) {
		this.zhratio = zhratio;
	}
	public void setPfratio(long pfratio) {
		this.pfratio = pfratio;
	}
	public void setAcomaentity(List<AcomaEntity> acomaentity) {
		this.entitys = acomaentity;
	}
}
