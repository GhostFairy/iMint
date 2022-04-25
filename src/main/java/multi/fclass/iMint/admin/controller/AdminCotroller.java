package multi.fclass.iMint.admin.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import multi.fclass.iMint.admin.dao.IAdminDAO;
import multi.fclass.iMint.admin.dto.AdminDTO;
import multi.fclass.iMint.admin.service.AdminServiceImpl;
import multi.fclass.iMint.common.service.IFileService;
import multi.fclass.iMint.member.dto.MemberDTO;
import multi.fclass.iMint.member.dto.Role;
import multi.fclass.iMint.security.parsing.mbid.ParseMbId;

/**
 * @author Junming, Yang
 *
 */

@Controller
public class AdminCotroller {
	
	@Autowired
	AdminServiceImpl service;
	
	@Autowired
	ParseMbId parseMbId;
	
	@Autowired
	IAdminDAO adminDAO;

	@Value("${root}")
	private String root;

	@Value("${directory}")
	private String directory;
	
	@Autowired
	IFileService fileService;
	
	// 전체 회원 조회 
	@RequestMapping("/admin/member")
	public ModelAndView member(Authentication auth) {

		ModelAndView mv = new ModelAndView();
		
		try {
			String mbId = parseMbId.parseMbId(auth);
			MemberDTO memberDTO = parseMbId.getMemberMbId(mbId);
			
			if (memberDTO.getMbRole() == Role.ADMIN) {
				
				List<MemberDTO> memberlist = adminDAO.selectmemberall();
				
				mv.addObject("memberlist", memberlist);
				mv.setViewName("admin/admin_member");
			}
		} catch (Exception e) {
		}

		return mv;
	}
	
	// 회원 통계  
	@GetMapping("/admin/stats/member")
	public ModelAndView stats(Authentication auth) {
		
		ModelAndView mv = new ModelAndView();

		try {
			String mbId = parseMbId.parseMbId(auth);
			MemberDTO memberDTO = parseMbId.getMemberMbId(mbId);
			
			if (memberDTO.getMbRole() == Role.ADMIN) {
				
				List<AdminDTO> memberstats = adminDAO.selectmemberstats();
				
				mv.addObject("memberstats", memberstats);
				mv.setViewName("admin/stats_member");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return mv;
	}
	
	@PostMapping("/admin/stats/member")
	@ResponseBody
	public Map<String, List<String>> stats() {
		Map<String, List<String>> map = new HashMap();

		List<String> location = new ArrayList();
		List<String> regist = new ArrayList();
		List<String> withdraw = new ArrayList();
		
		List<AdminDTO> memberstats = adminDAO.selectmemberstats();
		
		for(AdminDTO adminDTO: memberstats) {
			location.add(adminDTO.getMbLocation());
			regist.add(adminDTO.getMbCntAll());
			withdraw.add(adminDTO.getMbWithdrawAll());
		}
		
		map.put("location", location);
		map.put("regist", regist);
		map.put("withdraw", withdraw);
		
		System.out.println(map);
		return map;
	};

}
