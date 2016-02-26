package com.masget.util.settlement;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import com.masget.entity.ZSumDataItem;
import com.masget.util.ExcelUtil;

public class ZSUMDatas
{
	private Logger logger = Logger.getLogger(ZSUMDatas.class);

	// 以分为单位
	private long total_businessamount = 0;			// 交易金额
	private long total_possettlement = 0;			// 手续费
	private long total_unionpaysettlement = 0;		// 清算净额
	
	// 湖北中行的统计	
	public double zh_transactionamount = 0.0; // 刷卡总额
	public double zh_creditcardfeerate = 0.0; // 商户手续费
	public double zh_incoming = 0.0; // 银行入账金额
	public double zh_merchantstoliquidatefundsmoney = 0.0; // 应清分商户金额
	public double zh_platformamount = 0.0; // 平台收益
	public double zh_mount = 0.0; // 中行（0.11%）
	public double zh_pf_mount = 0.0; // 浦发（0.01%）
	
	public Logger getLogger() {
		return logger;
	}

	/**
	 * 用指定的文件中解析ZSUM的信息，文件为ANSI编码格式
	 * @param sFileName
	 * @return
	 */
	public boolean parseFile(String sFileName, String sCharsetEncode)
	{
		boolean bOk = false;
		ZSumDataItem oItem = new ZSumDataItem();
		
		FileInputStream oFileInputStream = null;
		InputStreamReader oRead = null;
		BufferedReader oBufferedReader = null;
		
		try
		{
			String sTempText = null;
			total_businessamount = 0;			// 交易金额
			total_possettlement = 0;			// 手续费
			total_unionpaysettlement = 0;		// 清算净额
			
			logger.error("ZSUMDatas parseFile(" + sFileName + ")");
			oFileInputStream = new FileInputStream(sFileName);
			// oRead = new InputStreamReader(oFileInputStream, "ISO8859-1");
			oRead = new InputStreamReader(oFileInputStream, sCharsetEncode);
			oBufferedReader = new BufferedReader(oRead);
			
			while((sTempText = oBufferedReader.readLine())!=null)
			{
				// oItem.parse_line(new String(sTempText.getBytes(sCharsetEncode), "gbk"));
				oItem.parse_line(sTempText);
				
				total_businessamount += oItem.getBusinessamount();			// 交易金额
				total_possettlement += oItem.getPossettlement();			// 手续费
				total_unionpaysettlement += oItem.getUnionpaysettlement();	// 清算净额
			}
		}
		catch (Exception ex)
		{
			logger.error("ZSUMDatas parseFile(" + sFileName + ") Exception(" + ex.toString() + ")");
		}
		
		try{ if (oBufferedReader != null) oBufferedReader.close();}catch (Exception ex){}
		try{ if (oRead != null) oRead.close();}catch (Exception ex){}
		try{ if (oFileInputStream != null) oFileInputStream.close();}catch (Exception ex){}
		
		logger.error("ZSUMDatas parseFile(" + sFileName + ") result(" + String.valueOf(bOk) + ") end ...");		
		return bOk;
	}
	
	/*
	 * 湖北中行
	 * 当日上账金额：	 2,377,505.12 
	 * 实际入账	 2,377,267.37 
	 * 浦发	 237.75 
	 */
	public boolean parseExcel4(String sFileName, int nAcomaSheetIndex, double fMerchantstoliquidatefundsmoney, long nZhRate, long nPfRate)
	{
		BufferedInputStream in = null;
		boolean bOk = false;
		
		try
		{
			in = new BufferedInputStream(new FileInputStream(sFileName));
			POIFSFileSystem fs = new POIFSFileSystem(in);
			HSSFWorkbook wb = new HSSFWorkbook(fs);
			HSSFCell cell = null;
			HSSFCell cellValue = null;
			
			String sTempValue = "";
			
			total_businessamount = 0;
			total_possettlement = 0;
			total_unionpaysettlement = 0;
			
			HSSFSheet st = wb.getSheetAt(nAcomaSheetIndex);
			for (int rowIndex = 1; rowIndex <= st.getLastRowNum(); rowIndex++)
			{
				HSSFRow row = st.getRow(rowIndex);
				if (row == null) continue;
				
				for (int i = 0; i < row.getLastCellNum(); i++)
				{
					if (zh_incoming > 0 && zh_creditcardfeerate > 0) break;
					
					cell = row.getCell(i);
					if (cell != null)
					{
						sTempValue = ExcelUtil.getCellValue(cell);
						if (sTempValue.indexOf("当日上账金额") != -1)
						{
							cellValue = row.getCell(i + 1);
							if (cellValue != null)
							{
								sTempValue = getCellValue(cellValue);
								zh_incoming = round2(Double.parseDouble(sTempValue));
							}
							continue;
						}
						
						if (sTempValue.indexOf("应付手续费") != -1)
						{
							cellValue = row.getCell(i + 1);
							if (cellValue != null)
							{
								sTempValue = getCellValue(cellValue);
								zh_creditcardfeerate = round2(Double.parseDouble(sTempValue));
							}
							continue;
						}
					}
				}
				
				if (zh_incoming > 0 && zh_creditcardfeerate > 0) break;
			}
			bOk = true;
		}
		catch (Exception ex)
		{
			bOk = false;
			logger.error("ZSUMDatas parseExcel4(" + sFileName + ") Exception(" + ex.toString() + ")");
		}
		
		// 总额  = 银行入账金额  + 手续费 
		zh_transactionamount = zh_incoming + zh_creditcardfeerate;
		zh_merchantstoliquidatefundsmoney = fMerchantstoliquidatefundsmoney;

		// 实际入账 = 银行入账金额  - 浦发金额
		double temp_real_incoming = round2(zh_incoming - round2(zh_incoming * (double)nPfRate / 10000)); // 银行入账金额
		
		// 平台收益 = 实际入账  - 应清分商户金额
		zh_platformamount = round2(temp_real_incoming - fMerchantstoliquidatefundsmoney); // 平台收益
		
		zh_mount = round2(temp_real_incoming * (double)nZhRate / 10000); // 中行（0.11%）
		zh_pf_mount = round2(temp_real_incoming * (double)nPfRate / 10000); // 浦发（0.01%）
		
		try{ if (in != null) in.close(); } catch (Exception ex){}		
		return bOk;
	}
	
	private double round2(double d)
	{
		return Double.parseDouble(String.format("%.2f",d));
	}
	
	public boolean parseExcel5(String sFileName, int nAcomaSheetIndex)
	{
		BufferedInputStream in = null;
		boolean bOk = false;
		
		try
		{
			in = new BufferedInputStream(new FileInputStream(sFileName));
			POIFSFileSystem fs = new POIFSFileSystem(in);
			HSSFWorkbook wb = new HSSFWorkbook(fs);
			HSSFCell cell = null;
			
			String sTempValue = "";
			Double fTemp = 0.0;
			
			HSSFSheet st = wb.getSheetAt(nAcomaSheetIndex);
			for (int rowIndex = 1; rowIndex <= st.getLastRowNum(); rowIndex++)
			{
				HSSFRow row = st.getRow(rowIndex);
				if (row == null) continue;
				
				// 交易金额
				cell = row.getCell(2);
				if (cell != null) sTempValue = ExcelUtil.getCellValue(cell);
				fTemp = Double.parseDouble(sTempValue);
				total_businessamount += fTemp.longValue(); 		// 交易金额
				
				cell = row.getCell(3);
				if (cell != null) sTempValue = ExcelUtil.getCellValue(cell);
				fTemp = Double.parseDouble(sTempValue);
				total_possettlement += fTemp.longValue();			// 手续费
				
				cell = row.getCell(4);
				if (cell != null) sTempValue = ExcelUtil.getCellValue(cell);
				fTemp = Double.parseDouble(sTempValue);
				total_unionpaysettlement += fTemp.longValue();	// 清算净额
			}
			bOk = true;
		}
		catch (Exception ex)
		{
			bOk = false;
			logger.error("ZSUMDatas parseExcel5(" + sFileName + ") Exception(" + ex.toString() + ")");
		}
		
		try{ if (in != null) in.close(); } catch (Exception ex){}		
		return bOk;
	}
	
	public boolean parseExcel6(String sFileName, int nAcomaSheetIndex)
	{
		BufferedInputStream in = null;
		boolean bOk = false;
		
		try
		{
			in = new BufferedInputStream(new FileInputStream(sFileName));
			POIFSFileSystem fs = new POIFSFileSystem(in);
			HSSFWorkbook wb = new HSSFWorkbook(fs);
			HSSFCell cell = null;
			
			String sTempValue = "";
			Double fTemp = 0.0;
			
			HSSFSheet st = wb.getSheetAt(nAcomaSheetIndex);
			for (int rowIndex = 1; rowIndex <= st.getLastRowNum(); rowIndex++)
			{
				HSSFRow row = st.getRow(rowIndex);
				if (row == null) continue;
				
				cell = row.getCell(1);
				if (cell != null) sTempValue = ExcelUtil.getCellValue(cell).trim();
				if (sTempValue.compareTo("银联供应链综合服务平台清算户") != 0) continue;
				
				// 交易金额
				cell = row.getCell(6);
				if (cell != null) sTempValue = ExcelUtil.getCellValue(cell);
				fTemp = Double.parseDouble(sTempValue);
				total_businessamount += fTemp.longValue(); 		// 交易金额
				
				cell = row.getCell(9);
				if (cell != null) sTempValue = ExcelUtil.getCellValue(cell);
				fTemp = Double.parseDouble(sTempValue);
				total_possettlement += fTemp.longValue();			// 手续费
				
				cell = row.getCell(19);
				if (cell != null) sTempValue = ExcelUtil.getCellValue(cell);
				fTemp = Double.parseDouble(sTempValue);
				total_unionpaysettlement += fTemp.longValue();	// 清算净额
			}
			bOk = true;
		}
		catch (Exception ex)
		{
			bOk = false;
			logger.error("ZSUMDatas parseExcel5(" + sFileName + ") Exception(" + ex.toString() + ")");
		}
		
		try{ if (in != null) in.close(); } catch (Exception ex){}		
		return bOk;
	}
	
	/**
	 * 解析数组中的数据，arrDatas中字符串为ISO8859-1编码格式
	 * @param arrDatas
	 * @return
	 */
	public boolean parseLines(List<String> arrDatas)
	{
		boolean bOk = false;		
		ZSumDataItem oItem = new ZSumDataItem();
		
		total_businessamount = 0;			// 交易金额
		total_possettlement = 0;			// 手续费
		total_unionpaysettlement = 0;		// 清算净额
		
		for (String sLine : arrDatas)
		{
			if ((bOk = oItem.parse_line(sLine)) == false) break;
			
			total_businessamount += oItem.getBusinessamount();			// 交易金额
			total_possettlement += oItem.getPossettlement();			// 手续费
			total_unionpaysettlement += oItem.getUnionpaysettlement();	// 清算净额
		}
		
		return bOk;
	}
	
	public String getCellValue(HSSFCell cell) {
		if (cell == null) return "";

		String value = "";
		switch (cell.getCellType())
		{
		case HSSFCell.CELL_TYPE_STRING:
			value = cell.getStringCellValue();
			break;
		case HSSFCell.CELL_TYPE_NUMERIC:
			if (HSSFDateUtil.isCellDateFormatted(cell))
			{
				Date date = cell.getDateCellValue();
				if (date != null)
				{
					value = new SimpleDateFormat("yyyy-MM-dd").format(date);
				}
				else
				{
					value = "";
				}
			}
			else
			{
				//value = new DecimalFormat("0").format(cell.getNumericCellValue());
				value = String.valueOf(cell.getNumericCellValue());
			}
			break;
		case HSSFCell.CELL_TYPE_FORMULA:
			// 导入时如果为公式生成的数据则无值
			if (!cell.getStringCellValue().equals(""))
			{
				value = cell.getStringCellValue();
			}
			else
			{
				value = cell.getNumericCellValue() + "";
			}
			break;
		case HSSFCell.CELL_TYPE_BLANK:
			break;
		case HSSFCell.CELL_TYPE_ERROR:
			value = "";
			break;
		case HSSFCell.CELL_TYPE_BOOLEAN:
			value = (cell.getBooleanCellValue() == true ? "Y" : "N");
			break;
		default:
			value = "";
		}

		return value;
	}
	
	public long getTotal_businessamount()
	{
		return total_businessamount;
	}

	public long getTotal_possettlement()
	{
		return total_possettlement;
	}

	public long getTotal_unionpaysettlement()
	{
		return total_unionpaysettlement;
	}
}
