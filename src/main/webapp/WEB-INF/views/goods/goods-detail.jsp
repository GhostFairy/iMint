<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<title>Insert title here</title>
	<jsp:include page="../libs/libsStyles.jsp" flush="false" />
	<link rel="stylesheet" href="/static/css/goods/goods-detail.css" />
</head>

<body>
	<jsp:include page="../include/header.jsp" flush="false" />

	<section class="container">
		<article class="row1">
			<h1>${goods.goodsTitle}</h1>
			<a href="/goods/modify?goodsId=${goods.goodsId}">
				<img src="/static/images/write-icon.png" alt="">
			</a>
			<a href="/goods/delete?goodsId=${goods.goodsId}">
				<img src="/static/images/delete-icon.png" alt="">
			</a>
		</article>
		<article class="row2">
			<h2>${goods.goodsStatus}</h2>
			<div class="goods-info">
				<div>
					<span>${goods.sellerNick}</span>
					<img class="member-rating" src="/static/images/sun_4.png" alt="">
					<span>${goods.goodsLocation}</span>
					<span>🤍관심 </span>
				</div>
				<span class="goods-date" id="timeForToday">${goods.goodsCreateDate}</span>
			</div>
		</article>
		<article class="carousel">
			<div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
				<div class="carousel-indicators">
					<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"
						class="active" aria-current="true" aria-label="Slide 1"></button>
					<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
						aria-label="Slide 2"></button>
					<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
						aria-label="Slide 3"></button>
				</div>
				<div class="carousel-inner">
					<!-- JS영역 -->
					<div class="carousel-item active">
						<img src="/static/images/hamster.png" class="d-block w-100" alt="...">
					</div>
					<div class="carousel-item">
						<img src="/static/images/hamster.png" class="d-block w-100" alt="...">
					</div>
					<div class="carousel-item">
						<img src="/static/images/hamster.png" class="d-block w-100" alt="...">
					</div>
				</div>
				<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
					data-bs-slide="prev">
					<span class="carousel-control-prev-icon" aria-hidden="true"></span>
					<span class="visually-hidden">Previous</span>
				</button>
				<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
					data-bs-slide="next">
					<span class="carousel-control-next-icon" aria-hidden="true"></span>
					<span class="visually-hidden">Next</span>
				</button>
			</div>
		</article>
		<article class="goods-content-wrap">
			<textarea disabled="" id="goods-content" placeholder=${goods.goodsContent}></textarea>
		</article>
		<article class="roundBox goods-action" id="js-goods-action">
			<!-- 일단 로그인됫다고 가정하고 페이지작성 -->
			<div>
				<span>카테고리 : ${goods.goodsCategory}</span>
				<span>가격 : ${goods.goodsPrice}</span>
				<c:choose>
					<c:when test="${goods.goodsSuggestible == true}">
						<span>가격 흥정 가능</span>
					</c:when>
					<c:otherwise>
						<span>가격 흥정 불가능</span>
					</c:otherwise>
				</c:choose>
			</div>
			<div>
			</div>
			<div>
				<c:choose>
					<c:when test="${sessionScope.mbId != null}">
						<!-- 둘러보기 -->
					</c:when>
					<c:when test="${sessionScope.mbId == goods.sellerId}">
						<a class="btn btn-primary" href="/chatroom/">
							내 채팅 목록가기
						</a>
					</c:when>
					<c:otherwise>
						<button class="btn btn-primary">
							관심
						</button>
						<a class="btn btn-primary" href="/chatroom/">
							구매 제안하기
						</a>
					</c:otherwise>
				</c:choose>
			</div>
		</article>
	</section>


	<jsp:include page="../libs/libsScript.jsp" flush="false" />
	<script type="text/javascript" src="/static/js/goods/goods-detail.js"></script>
	<script type="text/javascript" src="/static/js/goods/carousel.js"></script>
	<script>
		carouselReady($ {
			goods.goodsId
		});
	</script>
</body>

</html>