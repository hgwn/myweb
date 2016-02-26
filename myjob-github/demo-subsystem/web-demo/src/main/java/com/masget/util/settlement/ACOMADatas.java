package com.masget.util.settlement;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

import com.masget.entity.AcomaEntity;
import com.masget.util.ExcelUtil;

public class ACOMADatas
{
	private Logger logger = Logger.getLogger(ACOMADatas.class);
	private String last_error = "";
	
	// ACOMA文件的原始数据
	private List<ArrayList<String>> arrDatas = new ArrayList<ArrayList<String>>();
	private List<AcomaEntity> arrAcomaEntity = new ArrayList<AcomaEntity>();
	
	public static String[] acoma_title = new String[]{
		"com1代理机构标识码","com2发送机构标识码","com3系统跟踪号","com4交易传输时间","com5主账号",
		"com6交易金额","com7部分代收时的承兑金额","com8持卡人交易手续费","com9报文类型","com10交易类型码",
		"com11商户类型","com12受卡机终端标识码","com13受卡方标识码","com14检索参考号","com15服务点条件码",
		"com16授权应答码","com17接收机构标识码","com18原始交易的系统跟踪号","com19交易返回码","com20服务点输入方式",
		"com21受理方应收手续费","com22受理方应付手续费","com23转接服务费","com24单双转换标志","com25卡片序列号",
		"com26终端读取能力","com27IC卡条件代码","com28原始交易日期时间","com29发卡机构标识码","com30交易地域标志",
		"com31终端类型","com32ECI标志","com33分期付款附加手续费","com34其他信息",
		"coma1发送方清算机构","coma2接收方清算机构","coma3冲正标志","coma4撤销标志","coma5清算日期",
		"coma6清算场次","coma7商户名称地址","coma8交易币种","coma9银联代理清算收单机构自动折扣手续费","coma10商户手续费",
		"coma11商户结算行","coma12商户结算行费用","coma13收单方服务角色1","coma14收单方服务角色1费用","coma15收单方服务角色2",
		"coma16收单方服务角色2费用","coma17收单方服务角色3","coma18收单方服务角色3费用","coma19收单方服务角色4","coma20收单方服务角色4费用",
		"coma21收单方服务角色5","coma22收单方服务角色5费用","coma23收单方服务角色6","coma24收单方服务角色6费用","coma25收单方服务角色7",
		"coma26收单方服务角色7费用","coma27收单方服务角色8","coma28收单方服务角色8费用","coma29收单方服务角色9","coma30收单方服务角色9费用",
		"coma31银联代理清算收单机构自定义费用1","coma32银联代理清算收单机构自定义费用2","coma33银联代理清算收单机构自定义费用3","coma34转入卡号","coma35保留使用"
	};
	
	public static int[] acoma_field_length = new int[]{
		11,11,6,10,19,12,12,12,4,6,4,8,15,12,2,6,11,6,2,3,12,12,12,1,3,1,1,10,11,1,2,2,12,14,
		//COMA 6.2.1 (COMA)机构一般交易流水文件记录格式
		11,11,1,1,4,2,40,3,9,9,11,9,11,9,11,9,11,9,11,9,11,9,11,9,11,9,11,9,11,9,9,9,9,19,280
	};
	
	public List<AcomaEntity> getAcomaEntitys()
	{
		return this.arrAcomaEntity;
	}
	
	public String getLastError()
	{
		return last_error;
	}
	
	public boolean parseLine(String sData, String sFileCharsetName, ArrayList<String> arrEliminated)
	{
		int nStart = 0;
		int nEnd = -1;		
		ArrayList<String> arrFields = new ArrayList<String>();
		
		if (sData == null || sData.compareTo("") == 0) return false;
		
		try
		{	
			// 每个字段由空格分割，字段长度固定
			// int nCounts = acoma_field_length.length;
			int nCounts = 50;
			for (int i = 0; i < nCounts; i++)
			{
				nStart = nEnd + 1;
				nEnd = nStart + acoma_field_length[i];
				arrFields.add(sData.substring(nStart, nEnd).trim());
			}
			
			// 消费金额为0的排除掉
			if (Long.parseLong(arrFields.get(5)) == 0) return true;
			
			// 退款和冲正的两条记录都需要排除掉
			if (arrFields.get(37).compareTo("C") == 0 || arrFields.get(36).compareTo("R") == 0)
			{
				arrEliminated.add(arrFields.get(13));
				return true;
			}
			
			// 第41列为中文
			if (sFileCharsetName.compareTo("ISO8859-1") == 0)
			{
				arrFields.set(40, new String(arrFields.get(40).getBytes(sFileCharsetName), "GBK"));
			}
			
			arrDatas.add(arrFields);

			//Double fAcquirebankmoney = Double.parseDouble(arrFields.get(20));
			AcomaEntity oEntity = new AcomaEntity(Long.parseLong(arrFields.get(5)), arrFields.get(10), arrFields.get(11),
					arrFields.get(3), arrFields.get(12), arrFields.get(4), arrFields.get(13), 0, arrFields.get(37));
			arrAcomaEntity.add(oEntity);
			
		}
		catch (Exception ex)
		{
			last_error = ex.toString();
			logger.error("ACOMADatas parseLine(" + sData + ") Exception(" + ex.toString() + ")");
		}
		
		return true;
	}
	
	/**
	 * 用指定的文件中解析ACOMA的信息
	 * @param sFileName
	 * @return
	 */
	public boolean parseFile(String sFileName, String sFileCharsetName)
	{
		boolean bOk = false;
		
		FileInputStream oFileInputStream = null;
		InputStreamReader oRead = null;
		BufferedReader oBufferedReader = null;
		ArrayList<String> arrEliminated = new ArrayList<String>();
		
		try
		{
			String sTempText = null;
			
			arrDatas.clear();
			arrAcomaEntity.clear();
			
			logger.error("ACOMADatas parseFile(" + sFileName + ")");
			oFileInputStream = new FileInputStream(sFileName);
			oRead = new InputStreamReader(oFileInputStream, sFileCharsetName);
			oBufferedReader = new BufferedReader(oRead);
			
			while((sTempText = oBufferedReader.readLine())!=null)
			{
				bOk = parseLine(sTempText, sFileCharsetName, arrEliminated);
				if (bOk == false) break;
			}
			
			for (int i = 0; i < arrEliminated.size(); i++)
			{
				for (int j = 0; j < arrAcomaEntity.size(); j++)
				{
					if (arrAcomaEntity.get(j).getUnionpaydealid().compareTo(arrEliminated.get(i)) == 0)
					{
						arrAcomaEntity.remove(j);
						break;
					}
				}
			}
		}
		catch (Exception ex)
		{
			logger.error("ACOMADatas parseFile(" + sFileName + ") Exception(" + ex.toString() + ")");
		}
		
		try{ if (oBufferedReader != null) oBufferedReader.close();}catch (Exception ex){}
		try{ if (oRead != null) oRead.close();}catch (Exception ex){}
		try{ if (oFileInputStream != null) oFileInputStream.close();}catch (Exception ex){}
		
		logger.error("ACOMADatas parseFile(" + sFileName + ") result(" + String.valueOf(bOk) + ") end ...");		
		return bOk;
	}
	
	// 56 columns
	public boolean parseExcel4(String sFileName, int nMaxColumns, int nAcomaSheetIndex)
	{
		BufferedInputStream in = null;
		boolean bOk = false;
		ArrayList<String> arrEliminated = new ArrayList<String>();
		
		try
		{
			in = new BufferedInputStream(new FileInputStream(sFileName));
			POIFSFileSystem fs = new POIFSFileSystem(in);
			//XSSFWorkbook wb = new XSSFWorkbook(fs);
			HSSFWorkbook wb = new HSSFWorkbook(fs);
			HSSFCell cell = null;
			
			HSSFSheet st = wb.getSheetAt(nAcomaSheetIndex);
			for (int rowIndex = 1; rowIndex <= st.getLastRowNum(); rowIndex++)
			{
				HSSFRow row = st.getRow(rowIndex);
				if (row == null)
				{
					continue;
				}
				
				ArrayList<String> arrFields = new ArrayList<String>();
				for (int columnIndex = 0; columnIndex < nMaxColumns; columnIndex++)
				{
					String sValue = "";
					cell = row.getCell(columnIndex);
					if (cell != null)
					{
						sValue = getCellValue(cell);
					}
					
					arrFields.add(sValue);
				}
				
				// 消费金额为0的排除掉
				Double fTemp = Double.parseDouble(arrFields.get(5));
				if (fTemp.longValue() == 0) continue;
				
				// 退款和冲正的两条记录都需要排除掉
				if (arrFields.get(37).compareTo("C") == 0 || arrFields.get(36).compareTo("R") == 0)
				{
					arrEliminated.add(arrFields.get(13));
					continue;
				}
				
				//Double fAcquirebankmoney = Double.parseDouble(arrFields.get(20));
				AcomaEntity oEntity = new AcomaEntity(fTemp.longValue(), arrFields.get(10), arrFields.get(11),
						arrFields.get(3), arrFields.get(12), arrFields.get(4), arrFields.get(13), 0, "");
				arrAcomaEntity.add(oEntity);					
			}
			
			for (int i = 0; i < arrEliminated.size(); i++)
			{
				for (int j = 0; j < arrAcomaEntity.size(); j++)
				{
					if (arrAcomaEntity.get(j).getUnionpaydealid().compareTo(arrEliminated.get(i)) == 0)
					{
						arrAcomaEntity.remove(j);
						break;
					}
				}
			}
			bOk = true;
		}
		catch (Exception ex)
		{
			bOk = false;
			logger.error("ACOMADatas parseExcel(" + sFileName + ") Exception(" + ex.toString() + ")");
		}
		
		try{ if (in != null) in.close(); } catch (Exception ex){}		
		return bOk;
	}
	
	public boolean parseExcel5(String sFileName, int nMaxColumns, int nAcomaSheetIndex)
	{
		BufferedInputStream in = null;
		boolean bOk = false;
		ArrayList<String> arrEliminated = new ArrayList<String>();
		
		try
		{
			in = new BufferedInputStream(new FileInputStream(sFileName));
			POIFSFileSystem fs = new POIFSFileSystem(in);
			HSSFWorkbook wb = new HSSFWorkbook(fs);
			HSSFCell cell = null;
			
			HSSFSheet st = wb.getSheetAt(nAcomaSheetIndex);
			for (int rowIndex = 1; rowIndex <= st.getLastRowNum(); rowIndex++)
			{
				HSSFRow row = st.getRow(rowIndex);
				if (row == null)
				{
					continue;
				}
				
				ArrayList<String> arrFields = new ArrayList<String>();
				for (int columnIndex = 1; columnIndex < nMaxColumns; columnIndex++)
				{
					String sValue = "";
					cell = row.getCell(columnIndex);
					if (cell != null)
					{
						sValue = ExcelUtil.getCellValue(cell);
					}
					
					arrFields.add(sValue);
				}
				
				// 消费金额为0的排除掉
				if (Long.parseLong(arrFields.get(5)) == 0) continue;
				
				// 退款和冲正的两条记录都需要排除掉
				if (arrFields.get(37).compareTo("C") == 0 || arrFields.get(36).compareTo("R") == 0)
				{
					arrEliminated.add(arrFields.get(13));
					continue;
				}
				
				Double fAcquirebankmoney = Double.parseDouble(arrFields.get(20));
				AcomaEntity oEntity = new AcomaEntity(Long.parseLong(arrFields.get(5)), arrFields.get(10), arrFields.get(11),
						arrFields.get(3), arrFields.get(12), arrFields.get(4), arrFields.get(13), 0, arrFields.get(37));
				arrAcomaEntity.add(oEntity);					
			}
			
			for (int i = 0; i < arrEliminated.size(); i++)
			{
				for (int j = 0; j < arrAcomaEntity.size(); j++)
				{
					if (arrAcomaEntity.get(j).getUnionpaydealid().compareTo(arrEliminated.get(i)) == 0)
					{
						arrAcomaEntity.remove(j);
						break;
					}
				}
			}
			bOk = true;
		}
		catch (Exception ex)
		{
			bOk = false;
			logger.error("ACOMADatas parseExcel(" + sFileName + ") Exception(" + ex.toString() + ")");
		}
		
		try{ if (in != null) in.close(); } catch (Exception ex){}		
		return bOk;
	}
	
	/*
	 * 宁波银商
	 */
	public boolean parseExcel6(String sFileName, int nMaxColumns, int nAcomaSheetIndex)
	{
		BufferedInputStream in = null;
		boolean bOk = false;
		ArrayList<String> arrEliminated = new ArrayList<String>();
		
		try
		{
			in = new BufferedInputStream(new FileInputStream(sFileName));
			POIFSFileSystem fs = new POIFSFileSystem(in);
			HSSFWorkbook wb = new HSSFWorkbook(fs);
			HSSFCell cell = null;
			
			HSSFSheet st = wb.getSheetAt(nAcomaSheetIndex);
			for (int rowIndex = 1; rowIndex <= st.getLastRowNum(); rowIndex++)
			{
				HSSFRow row = st.getRow(rowIndex);
				if (row == null)
				{
					continue;
				}
				
				ArrayList<String> arrFields = new ArrayList<String>();
				for (int columnIndex = 0; columnIndex < nMaxColumns; columnIndex++)
				{
					String sValue = "";
					cell = row.getCell(columnIndex);
					if (cell != null)
					{
						sValue = getCellValue(cell);
					}
					
					arrFields.add(sValue);
				}
				
				// 消费金额为0的排除掉
				Double fTemp = Double.parseDouble(arrFields.get(6));
				if (fTemp.longValue() == 0) continue;
				
				// 退款和冲正的两条记录都需要排除掉
				if (arrFields.get(40).compareTo("C") == 0 || arrFields.get(39).compareTo("R") == 0)
				{
					arrEliminated.add(arrFields.get(13));
					continue;
				}
				
				AcomaEntity oEntity = new AcomaEntity(
						fTemp.longValue(), 
						arrFields.get(12), 
						arrFields.get(13),
						arrFields.get(4), 
						arrFields.get(14), 
						arrFields.get(5), 
						arrFields.get(15), 
						0, 
						"");
				arrAcomaEntity.add(oEntity);					
			}
			
			for (int i = 0; i < arrEliminated.size(); i++)
			{
				for (int j = 0; j < arrAcomaEntity.size(); j++)
				{
					if (arrAcomaEntity.get(j).getUnionpaydealid().compareTo(arrEliminated.get(i)) == 0)
					{
						arrAcomaEntity.remove(j);
						break;
					}
				}
			}
			bOk = true;
		}
		catch (Exception ex)
		{
			bOk = false;
			logger.error("ACOMADatas parseExcel(" + sFileName + ") Exception(" + ex.toString() + ")");
		}
		
		try{ if (in != null) in.close(); } catch (Exception ex){}		
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
				//value = String.valueOf(cell.getNumericCellValue());
				value = String.format("%f", cell.getNumericCellValue());
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
}
