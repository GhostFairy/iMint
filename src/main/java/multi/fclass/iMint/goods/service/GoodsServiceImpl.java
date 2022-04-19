package multi.fclass.iMint.goods.service;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import multi.fclass.iMint.common.exception.NotFoundException;
import multi.fclass.iMint.common.exception.UnauthorizedException;
import multi.fclass.iMint.common.service.IFileService;
import multi.fclass.iMint.common.service.IUtilService;
import multi.fclass.iMint.goods.dao.IGoodsDAO;
import multi.fclass.iMint.goods.dto.GoodsDTO;
import multi.fclass.iMint.goods.dto.GoodsImagesDTO;

/**
 * @author Seongil, Yoon
 *
 */
@Service
public class GoodsServiceImpl implements IGoodsService {
	@Autowired
	IGoodsDAO goodsDAO;

	@Autowired
	IUtilService utilService;

	@Autowired
	IFileService fileService;

	@Autowired
	HttpSession httpSession;

	@Override
	public GoodsDTO goods(int goodsId) {
		return goodsDAO.goods(goodsId);
	}

	@Override
	public List<GoodsImagesDTO> goodsImageList(int goodsId) {
		List<GoodsImagesDTO> goodsImages = goodsDAO.goodsImageList(goodsId);
		if (goodsImages.isEmpty()) {
			goodsImages.add(new GoodsImagesDTO(null, goodsId, "/static/images/noimage.png", true, "noimage.png", null));
		}
		return goodsImages;
	}

	@Override
	public int goodsWrite(GoodsDTO goodsDto, List<MultipartFile> files) {
//		String sellerId = (String) httpSession.getAttribute("mbId");
//		String sellerNick = (String) httpSession.getAttribute("mbNick");

		if (!goodsDto.getSellerId().isEmpty()) {
//			throw new UnauthorizedException(String.format("unauthorized you"));
		}
//		int goodsId = goodsDAO.goodsInsert(goodsDto); // return 1
		goodsDAO.goodsInsert(goodsDto);
		int goodsId = goodsDto.getGoodsId();

		if (!files.isEmpty()) {
			// 상품글의 파일들을 올릴 경로("C:/iMint/goods/yyyy/MM/dd")를 배열로 반환
			List<String> paths = utilService.createGoodsPaths(goodsDAO.goodsDate(goodsId));
			fileService.mkDir(paths); // 폴더 생성
			// 경로에 파일업로드 and DB insert
			int goodsImagesId = fileService.uploadGoodsImageFiles(paths, goodsDto.getGoodsId(), files);
			if (goodsImagesId == -1) {
				return goodsImagesId;
//			throw new 
			}
		}

		return goodsId;
	}

	@Override
	public int goodsDelete(int goodsId, String mbId) {
		GoodsDTO goodsDTO = goodsDAO.goods(goodsId);
		int result = 0;

		if (goodsDTO == null) {
			throw new NotFoundException(String.format("ID[%s] not found", goodsId));
		}
		if (mbId.isEmpty() || goodsDTO.getSellerId().equals(mbId) == false) {
			// 로그인한 아이디와 작성자 아이디가 달라서 권한없음 오류보냄
			throw new UnauthorizedException(String.format("unauthorized you"));
		} else {
			// 로그인 아이디 와 작성자 아이디 가 같아서 글삭제
//			List<GoodsImagesDTO> images = goodsDAO.goodsImageList(goodsId);
//			List<String> imagesPath = new ArrayList<String>();
//			for (GoodsImagesDTO imageDTO : images) {
//				imagesPath.add(imageDTO.getGoodsImagesPath());
//			}
//	deleteCnt = fileService.rmFiles(imagesPath);
			// 실제파일은 삭제하지 않고, DB의 isdelete값만 1로 변경
			goodsDAO.goodsIsdelete(goodsId, mbId);
			goodsDAO.goodsImagesIsdelete(goodsId);
			result = 1;

		}
		return result;
	}

}
