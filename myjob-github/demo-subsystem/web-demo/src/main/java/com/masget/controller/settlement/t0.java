package com.masget.controller.settlement;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;
import com.masget.util.FileUpload;

@Controller
public class t0 
{
	private String get_companycontractno_path()
	{
		String sPath = "";
		
		try
		{
			Properties oProperties = new Properties();
			InputStream oInputStream = t0.class.getResourceAsStream("/config.properties");
			oProperties.load(oInputStream);
			sPath = oProperties.getProperty("companycontractno");
			oInputStream.close();
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		
		return sPath;
	}
	
	private String get_certificate_path()
	{
		String sPath = "";
		
		try
		{
			Properties oProperties = new Properties();
			InputStream oInputStream = t0.class.getResourceAsStream("/config.properties");
			oProperties.load(oInputStream);
			sPath = oProperties.getProperty("companycertificates_path") + oProperties.getProperty("db_companycertificates_path");
			oInputStream.close();
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		
		return sPath;
	}
	
	public static byte[] read_file(String sFile)
	{
		File file = new File(sFile);
        FileInputStream fin = null;
        try 
        {
            fin = new FileInputStream(file);
            byte fileContent[] = new byte[(int)file.length()];
            fin.read(fileContent);
            fin.close();
            return fileContent;
        }
        catch (FileNotFoundException e)
        {
        }
        catch (IOException ioe)
        {
        }
        finally
        {
            // close the streams using close method
            try
            {
                if (fin != null) {
                    fin.close();
                }
            }
            catch (IOException ioe)
            {
            }
        }
        
        return new byte[1];
	}
	
	@RequestMapping(value="/t0/ctrl_query_financingproduct.do", method={RequestMethod.POST, RequestMethod.GET})
	public void ctrl_query_financingproduct(Model model,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		//dataMap.put("companyid", sCompanyid);

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String serviceName = "settlementService";
		String method = "masget.settlement.t0.investor.getArray";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping(value="/t0/ctrl_query_companycontract.do", method=RequestMethod.POST)
	public void ctrl_query_companycontract(Model model,
			@RequestParam(value="companycontractno") String sCompanycontractno,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companycontractno", sCompanycontractno);

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String serviceName = "settlementService";
		String method = "masget.settlement.t0.companycertificates.getcontractno";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping(value="/t0/ctrl_query_companycertificates.do", method=RequestMethod.POST)
	public void ctrl_query_companycertificates(Model model,
			@RequestParam(value="companyid") Long nCompanyid,
			@RequestParam(value="certificatetypeid") Integer nCertificatetypeid,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", nCompanyid);
		dataMap.put("certificatetypeid", nCertificatetypeid);

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String serviceName = "settlementService";
		String method = "masget.settlement.t0.companycertificates.get";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping(value="/t0/ctrl_submit_t0_apply.do")
	public void ctrl_submit_T0_apply(Model model,
			@RequestParam(value="loanbankid") Long nLoanbankid,
			@RequestParam(value="applyloanaccountname") String sApplyloanaccountname,
			@RequestParam(value="loanpercent") Double fLoanpercent, // 货款可贷款百分比.小于等于1
			@RequestParam(value="singlelimitamount") Double fSinglelimitamount, // 融资产品结算单笔最高限额
			@RequestParam(value="loanbalance") Double fLoanbalance,                 // 结算可用余额
			@RequestParam(value="creditcardallowflag") Integer nCreditcardallowflag,         // 信用卡T结算标志 1=不允许 2=允许
			@RequestParam(value="financingproductname") String sFinancingproductname, // 融资产品名称
			@RequestParam(value="loanbankname") String sLoanbankname, // 资方公司名称
			@RequestParam(value="bankloanflag") Integer nFinancingproductid, // 金融产品id
			@RequestParam(value="bank") String sBank, // 申请融资产品公司收款账户开户行
			@RequestParam(value="applyloanbankaccount") String sApplyloanbankaccount,        // 申请融资产品公司收款帐号
			@RequestParam(value="bankcode") String sBankcode, // 申请融资产品公司收款开户行的联行号
			@RequestParam(value="bankaddress") String sBankaddress, // 申请融资产品公司收款开户行地址
			@RequestParam(value="totalloanamount") Double fTotalloanamount, // 融资产品最高限额
			@RequestParam(value="idcardno") String sIdcardno,                    // 收款人身份证号码
			@RequestParam(value="companycontractno") String sCompanycontractno, // 主电子合同模板编号
			@RequestParam(value="accounttype") Integer nAccounttype, // 账号类型
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("loanbankid", String.valueOf(nLoanbankid));
		dataMap.put("applyloanaccountname", sApplyloanaccountname);
		dataMap.put("loanpercent", (fLoanpercent > 1 ? (fLoanpercent / 100) : fLoanpercent)); // 货款可贷款百分比.小于等于1
		dataMap.put("singlelimitamount", fSinglelimitamount); // 融资产品结算单笔最高限额
		dataMap.put("loanbalance", fLoanbalance);                 // 结算可用余额
		dataMap.put("creditcardallowflag", String.valueOf(nCreditcardallowflag));         // 信用卡T结算标志 1=不允许 2=允许
		dataMap.put("financingproductname", sFinancingproductname); // 融资产品名称
		dataMap.put("loanbankname", sLoanbankname); // 资方公司名称
		dataMap.put("bankloanflag", String.valueOf(nFinancingproductid)); // 金融产品id
		dataMap.put("bank", sBank); // 申请融资产品公司收款账户开户行
		dataMap.put("applyloanbankaccount", sApplyloanbankaccount);        // 申请融资产品公司收款帐号
		dataMap.put("bankcode", sBankcode); // 申请融资产品公司收款开户行的联行号
		dataMap.put("bankaddress", sBankaddress); // 申请融资产品公司收款开户行地址
		dataMap.put("totalloanamount", fTotalloanamount); // 融资产品最高限额
		dataMap.put("idcardno", sIdcardno);                    // 收款人身份证号码
		dataMap.put("companycontractno", sCompanycontractno); // 主电子合同模板编号
		dataMap.put("accounttype", String.valueOf(nAccounttype)); // 账号类型
		
		dataMap.put("execdate", "");
		dataMap.put("invaliddate", "");
		dataMap.put("remark", "");
		dataMap.put("contractsignedflag", "2");
		dataMap.put("applytype", "1");
		dataMap.put("platformauditflag", "3");
		
		dataMap.put("auditcompanyid", "0");
		dataMap.put("auditcompanyname", "");

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String serviceName = "settlementService";
		String method = "masget.settlement.t0.enterprise.add";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping(value="/t0/ctrl_query_t0_apply.do", method=RequestMethod.POST)
	public void ctrl_query_t0_apply(Model model,
			@RequestParam(value="platformauditflag") Integer nPlatformauditflag,
			@RequestParam(value="enableflag") Integer nEnableflag,
			@RequestParam(value="companyname") String sCompanyname,
			@RequestParam(value="begintime") String sBegintime,
			@RequestParam(value="endtime") String sEndtime,
			@RequestParam(value="pagenum") Integer nPagenum,
			@RequestParam(value="pagesize") Integer nPagesize,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("platformauditflag", String.valueOf(nPlatformauditflag));
		dataMap.put("enableflag", String.valueOf(nEnableflag));
		dataMap.put("companyname", sCompanyname);
		dataMap.put("begintime", sBegintime);
		dataMap.put("endtime", sEndtime);
		dataMap.put("pagenum", String.valueOf(nPagenum));
		dataMap.put("pagesize", String.valueOf(nPagesize));

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String serviceName = "settlementService";
		String method = "masget.settlement.t0.enterprise.get";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping(value="/t0/ctrl_query_t0_apply_counts.do", method={RequestMethod.POST, RequestMethod.GET})
	public void ctrl_query_t0_apply_counts(Model model,
			@RequestParam(value="platformauditflag") Integer nPlatformauditflag,
			@RequestParam(value="enableflag") Integer nEnableflag,
			@RequestParam(value="companyname") String sCompanyname,
			@RequestParam(value="begintime") String sBegintime,
			@RequestParam(value="endtime") String sEndtime,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("platformauditflag", String.valueOf(nPlatformauditflag));
		dataMap.put("enableflag", String.valueOf(nEnableflag));
		dataMap.put("companyname", sCompanyname);
		dataMap.put("begintime", sBegintime);
		dataMap.put("endtime", sEndtime);

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String serviceName = "settlementService";
		String method = "masget.settlement.t0.enterprise.gettotal";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping(value="/t0/ctrl_query_member_infos.do", method={RequestMethod.POST, RequestMethod.GET})
	public void ctrl_query_member_infos(Model model,
			@RequestParam(value="companyid") Long nCompanyid,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("companyid", String.valueOf(nCompanyid));

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String serviceName = "settlementService";
		String method = "masget.settlement.t0.companycertificates.t0enterpriseinfo";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping(value="/t0/ctrl_audit_t0_apply.do", method=RequestMethod.POST)
	public void ctrl_audit_t0_apply(Model model,
			@RequestParam(value="companytype") Integer nCompanytype,
			@RequestParam(value="applyloanconfigid") Long nApplyloanconfigid,
			@RequestParam(value="auditstate") Integer nAuditstate,
			@RequestParam(value="remark") String sRemark,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("applyloanconfigid", String.valueOf(nApplyloanconfigid));
		dataMap.put("auditstate", String.valueOf(nAuditstate));
		dataMap.put("remark", sRemark);		

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String method = "";
		String serviceName = "settlementService";
		if (nCompanytype == 1) method = "masget.settlement.t0.platform.audit";
		else if (nCompanytype == 7) method = "masget.settlement.t0.investor.audit";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	// 取消T+0
	@RequestMapping(value="/t0/ctrl_cancel_t0_apply.do", method=RequestMethod.POST)
	public void ctrl_cancel_t0_apply(Model model,
			@RequestParam(value="applyloanconfigid") Long nApplyloanconfigid,
			@RequestParam(value="companytype") Integer nCompanytype,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("applyloanconfigid", String.valueOf(nApplyloanconfigid));
		dataMap.put("auditstate", "4");
		dataMap.put("remark", "取消T+0");		

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String method = "";
		String serviceName = "settlementService";
		if (nCompanytype == 1) method = "masget.settlement.t0.platform.audit";
		else if (nCompanytype == 7) method = "masget.settlement.t0.investor.audit";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	// 恢复T+0
	@RequestMapping(value="/t0/ctrl_recovery_t0_apply.do", method=RequestMethod.POST)
	public void ctrl_recovery_t0_apply(Model model,
			@RequestParam(value="applyloanconfigid") Long nApplyloanconfigid,
			@RequestParam(value="platformauditflag") Integer nPlatformauditflag,
			@RequestParam(value="enableflag") Integer nEnableflag,
			@RequestParam(value="companytype") Integer nCompanytype,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		if (nPlatformauditflag + nEnableflag != 1)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "参数错误"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("applyloanconfigid", String.valueOf(nApplyloanconfigid));
		dataMap.put("auditstate", "1");
		dataMap.put("remark", "恢复T+0");		

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String method = "";
		String serviceName = "settlementService";
		if (nCompanytype == 1) method = "masget.settlement.t0.platform.audit";
		else if (nCompanytype == 7) method = "masget.settlement.t0.investor.audit";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	// 修改T+0限额
	@RequestMapping(value="/t0/ctrl_modify_t0_financingtopamount.do", method=RequestMethod.POST)
	public void ctrl_modify_t0_financingtopamount(Model model,
			@RequestParam(value="applyloanconfigid") Long nApplyloanconfigid,
			@RequestParam(value="totalloanamount") Double fTotalloanamount,
			@RequestParam(value="loanpercent") Double fLoanpercent,			
			@RequestParam(value="singlelimitamount") Double fSinglelimitamount,
			@RequestParam(value="loanbalance") Double fLoanbalance,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("applyloanconfigid", String.valueOf(nApplyloanconfigid));
		dataMap.put("totalloanamount", String.valueOf(fTotalloanamount));
		dataMap.put("loanpercent", String.valueOf(fLoanpercent / 100));	
		dataMap.put("loanbalance", String.valueOf(fLoanbalance));	
		dataMap.put("singlelimitamount", String.valueOf(fSinglelimitamount));

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String method = "";
		String serviceName = "settlementService";
		method = "masget.settlement.t0.investor.modify";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping(value="/t0/ctrl_query_member_infos_by_applyloanconfigid.do", method={RequestMethod.POST, RequestMethod.GET})
	public void ctrl_query_member_infos_by_applyloanconfigid(Model model,
			@RequestParam(value="applyloanconfigid") Long nApplyloanconfigid,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("applyloanconfigid", String.valueOf(nApplyloanconfigid));

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String method = "";
		String serviceName = "settlementService";
		method = "masget.settlement.t0.enterprise.select";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping(value="/t0/ctrl_modify_t0_apply.do")
	public void ctrl_modify_t0_apply(Model model,
			@RequestParam(value="applyloanconfigid") Long nApplyloanconfigid,
			@RequestParam(value="loanbankid") Long nLoanbankid,
			@RequestParam(value="applyloanaccountname") String sApplyloanaccountname,
			@RequestParam(value="loanpercent") Double fLoanpercent, // 货款可贷款百分比.小于等于1
			@RequestParam(value="singlelimitamount") Double fSinglelimitamount, // 融资产品结算单笔最高限额
			@RequestParam(value="loanbalance") Double fLoanbalance,                 // 结算可用余额
			@RequestParam(value="creditcardallowflag") Integer nCreditcardallowflag,         // 信用卡T结算标志 1=不允许 2=允许
			@RequestParam(value="financingproductname") String sFinancingproductname, // 融资产品名称
			@RequestParam(value="loanbankname") String sLoanbankname, // 资方公司名称
			@RequestParam(value="bankloanflag") Integer nFinancingproductid, // 金融产品id
			@RequestParam(value="bank") String sBank, // 申请融资产品公司收款账户开户行
			@RequestParam(value="applyloanbankaccount") String sApplyloanbankaccount,        // 申请融资产品公司收款帐号
			@RequestParam(value="bankcode") String sBankcode, // 申请融资产品公司收款开户行的联行号
			@RequestParam(value="bankaddress") String sBankaddress, // 申请融资产品公司收款开户行地址
			@RequestParam(value="totalloanamount") Double fTotalloanamount, // 融资产品最高限额
			@RequestParam(value="idcardno") String sIdcardno,                    // 收款人身份证号码
			@RequestParam(value="companycontractno") String sCompanycontractno, // 主电子合同模板编号
			@RequestParam(value="accounttype") Integer nAccounttype, // 账号类型
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("applyloanconfigid", String.valueOf(nApplyloanconfigid));
		dataMap.put("loanbankid", String.valueOf(nLoanbankid));
		dataMap.put("applyloanaccountname", sApplyloanaccountname);
		dataMap.put("loanpercent", (fLoanpercent > 1 ? (fLoanpercent / 100) : fLoanpercent)); // 货款可贷款百分比.小于等于1
		dataMap.put("singlelimitamount", fSinglelimitamount); // 融资产品结算单笔最高限额
		dataMap.put("loanbalance", fLoanbalance);                 // 结算可用余额
		dataMap.put("creditcardallowflag", String.valueOf(nCreditcardallowflag));         // 信用卡T结算标志 1=不允许 2=允许
		dataMap.put("financingproductname", sFinancingproductname); // 融资产品名称
		dataMap.put("loanbankname", sLoanbankname); // 资方公司名称
		dataMap.put("bankloanflag", String.valueOf(nFinancingproductid)); // 金融产品id
		dataMap.put("bank", sBank); // 申请融资产品公司收款账户开户行
		dataMap.put("applyloanbankaccount", sApplyloanbankaccount);        // 申请融资产品公司收款帐号
		dataMap.put("bankcode", sBankcode); // 申请融资产品公司收款开户行的联行号
		dataMap.put("bankaddress", sBankaddress); // 申请融资产品公司收款开户行地址
		dataMap.put("totalloanamount", fTotalloanamount); // 融资产品最高限额
		dataMap.put("idcardno", sIdcardno);                    // 收款人身份证号码
		dataMap.put("companycontractno", sCompanycontractno); // 主电子合同模板编号
		dataMap.put("accounttype", String.valueOf(nAccounttype)); // 账号类型
		
		dataMap.put("auditcompanyid", "0");
		dataMap.put("auditcompanyname", "");

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String serviceName = "settlementService";
		String method = "masget.settlement.t0.investor.modify";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping(value="/t0/ctrl_remove_companycertificates.do", method=RequestMethod.POST)
	public void ctrl_remove_companycertificates(Model model,
			@RequestParam(value="type") Integer nTypeid,
			@RequestParam(value="picname") String sPicname,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("certificatetypeid", String.valueOf(nTypeid));
		dataMap.put("certificatepath", sPicname);

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String serviceName = "settlementService";
		String method = "masget.settlement.t0.companycertificates.delete";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping(value="/t0/ctrl_query_report_month.do", method=RequestMethod.POST)
	public void ctrl_query_report_month(Model model,
			@RequestParam(value="begintime") String sBegintime,
			@RequestParam(value="endtime") String sEndtime,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("i_terminalnumber", "");
		dataMap.put("i_agentflag", "0");
		dataMap.put("i_businesstimeend", "");
		dataMap.put("i_settlementtimeend", sEndtime + " 23:59:59");
		dataMap.put("i_membername", "");
		dataMap.put("i_paymenttype", "0");
		dataMap.put("i_businesstimebegin", "");
		dataMap.put("i_settlementtimebegin", sBegintime + " 00:00:00");
		
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String serviceName = "settlementService";
		String method = "masget.settlement.t0.payment.day";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	// 查询刷卡流水记录的个数
	@RequestMapping(value="/t0/ctrl_query_paymentjournal_counts.do", method=RequestMethod.POST)
	public void ctrl_query_paymentjournal_counts(Model model,
			@RequestParam(value="pmembername") String sPmembername,
			@RequestParam(value="membername") String sMembername,
			@RequestParam(value="orderno") String sOrderno,
			@RequestParam(value="unionpaydealid") String sUnionpaydealid,
			@RequestParam(value="terminal") String sTerminal,
			@RequestParam(value="begintime") String sBegintime,
			@RequestParam(value="endtime") String sEndtime,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("i_enterprisemembername", sMembername);
		dataMap.put("i_logisticsname", sPmembername);
		dataMap.put("i_businesstimeend", sEndtime);
		dataMap.put("i_unionpaydealid", sUnionpaydealid);
		dataMap.put("i_consignnotenum", sOrderno);
		dataMap.put("i_terminalnumber", sTerminal);
		dataMap.put("i_businesstimebegin", sBegintime);
		
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String serviceName = "settlementService";
		String method = "masget.settlement.t0.payment.gettotal";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping(value="/t0/ctrl_query_paymentjournal.do", method=RequestMethod.POST)
	public void ctrl_query_paymentjournal(Model model,
			@RequestParam(value="pmembername") String sPmembername,
			@RequestParam(value="membername") String sMembername,
			@RequestParam(value="orderno") String sOrderno,
			@RequestParam(value="unionpaydealid") String sUnionpaydealid,
			@RequestParam(value="terminal") String sTerminal,
			@RequestParam(value="begintime") String sBegintime,
			@RequestParam(value="endtime") String sEndtime,
			@RequestParam(value="pagenum") Integer nPagenum,
			@RequestParam(value="pagesize") Integer nPagesize,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("i_enterprisemembername", sMembername);
		dataMap.put("i_logisticsname", sPmembername);
		dataMap.put("i_businesstimeend", sEndtime);
		dataMap.put("i_unionpaydealid", sUnionpaydealid);
		dataMap.put("i_consignnotenum", sOrderno);
		dataMap.put("i_terminalnumber", sTerminal);
		dataMap.put("i_businesstimebegin", sBegintime);
		dataMap.put("pagenum", String.valueOf(nPagenum));
		dataMap.put("pagesize", String.valueOf(nPagesize));
		
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String serviceName = "settlementService";
		String method = "masget.settlement.t0.payment.get";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping(value="/t0/ctrl_get_file.do")
	public void ctrl_get_file( 
			Model model, 
			@RequestParam(value="file_path") String sName,
			@RequestParam(value="file_type") Integer nType,
			HttpServletRequest request, HttpServletResponse response)
	{
		String sPrePath = "";
		Gson gson = new Gson();
		img_file oImg = new img_file();
		
		String sImage = "";
		String[] arrImage = sName.split(",");
		if (arrImage.length == 1)
		{
			sImage = arrImage[0];
		}
		else if (arrImage.length == 2)
		{
			sImage = arrImage[1];
		}
		else
		{
			CommomUtil.writeResultBack(request, response, gson.toJson(oImg));
			return;
		}
		
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response, gson.toJson(oImg));
			return;
		}
		
		if (nType == 1) sPrePath = get_companycontractno_path();
		else sPrePath = get_certificate_path();
		
		if (sPrePath.compareTo("") == 0)
		{
			CommomUtil.writeResultBack(request, response, gson.toJson(oImg));
			return;
		}
		sPrePath = sPrePath + sImage;
		
		try 
		{
			String sExtension = upload_file_controller.get_extension_name(sImage);			
			if (sPrePath.compareTo("") == 0) return;
			
			byte[] arrFile = read_file(sPrePath);
			if (arrFile.length > 0)
			{
				byte[] byteArray = Base64.encodeBase64(arrFile);
				String sOut = new String(byteArray);
								
				oImg.ext = sExtension.toLowerCase();
				oImg.content = sOut;
				
				String sJson = gson.toJson(oImg);
				CommomUtil.writeResultBack(request, response, sJson);
			}
			else
			{
				CommomUtil.writeResultBack(request, response, gson.toJson(oImg));
			}
		}
		catch (Exception e) 
		{
		}
	}
	
	/*
	 * 查询T+0商户的账号信息
	 */
	@RequestMapping(value="/t0/ctrl_query_t0_account.do", method={RequestMethod.POST, RequestMethod.GET})
	public void ctrl_query_t0_account(Model model,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		//dataMap.put("applyloanconfigid", String.valueOf(nApplyloanconfigid));

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String method = "";
		String serviceName = "settlementService";
		method = "masget.settlement.t0.enterprise.getone";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/*
	 * 商户自己撤销T+0的申请，在平台和资方未审核
	 */
	@RequestMapping(value="/t0/cancel_apply_by_owner.do", method={RequestMethod.POST, RequestMethod.GET})
	public void cancel_apply_by_owner(Model model,
			@RequestParam(value="applyloanconfigid") Long nApplyloanconfigid,
			HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		//获取登陆对象判断是否登录
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("applyloanconfigid", String.valueOf(nApplyloanconfigid));

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		
		String method = "";
		String serviceName = "settlementService";
		method = "masget.settlement.t0.enterprise.audit";
		
		//调用接口
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
}
