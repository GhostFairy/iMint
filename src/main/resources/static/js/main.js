let lastBoard = 999999; //게시글 18개씩 불러 오기 위해 lastBoard 값넣는 변수 초기값 은  20000
let mainScrollTime = true; //스크롤 중복 방지 변수
let end = true //게시글 없을 경우 데이터 가져오지 않는 변수
let countWish = 0;
let crtLocation = undefined;
/* 현재 위치 받기  */
let position = {
	latitude: undefined,
	longitude: undefined
}
let crtLocationCallback = undefined;

//on load html 이미지나 자바스크립트 링크가 다오고 실행됨
function getMyLocation() {
	crtLocation = $("#userLocation").val();
	console.log(crtLocation);
	if (crtLocation == undefined || crtLocation == "") {

		function geolocationPromis() {
			return new Promise(function (resolve, reject) {
				let options = {
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0
				};

				function success(pos) {
					let crd = pos.coords;
					position.latitude = crd.latitude;
					position.latitude = position.latitude.toFixed(5);
					position.longitude = crd.longitude;
					position.longitude = position.longitude.toFixed(5);
					resolve(position);
				}

				function error(err) {
					console.warn(`ERROR(${err.code}): ${err.message}`);
				}
				navigator.geolocation.getCurrentPosition(success, error, options);
			});
		}

		function kakaoAjax(position) {
			return new Promise(function (resolve, reject) {
				$.ajax({
					url: 'https://dapi.kakao.com/v2/local/geo/coord2address.json?input_coord=WGS84&output_coord=WGS84&x=' + position.longitude + '&y=' + position.latitude,
					headers: {
						'Authorization': 'KakaoAK 81c7bda99c1d17edaf364c7a1fe1b80d'
					},
					type: 'GET',

					success: function (response) {
						crtLocation = "";
						crtLocation += JSON.stringify(response.documents[0].address.region_1depth_name); /* 파싱 한다음에 JSON.stringify */
						let len = crtLocation.length;
						crtLocation = crtLocation.substring(1, len - 1)

						let secLocation = JSON.stringify(response.documents[0].address.region_2depth_name); /* 파싱 한다음에 JSON.stringify */
						len = secLocation.length;
						crtLocation += " " + secLocation.substring(1, len - 1);
						$(".location-text").html(crtLocation);
						$("#userLocation").val(crtLocation);
						console.log("getMyLocation() 실행 : " + crtLocation);

						resolve(crtLocation);
					}, // success
					error: function (error) {
						//서버오류 500  찾는 자료없음 404  권한없음  401
						if (error.status == 404) {
							swal('찾는 자료가 없습니다', '', 'error');

						} else if (error.status == 401) {
							swal('유효하지 않은 인증입니다', '', 'error');

						} else if (error.status == 403) {
							swal('접근 권한이 없습니다', '', 'error');

						} else if (error.status == 500) {
							swal('서버 오류 관리자에게 문의 하세요', '', 'error');
						}
					}
				}); // ajax 	
			});

		}

		function loadScroll(crtLocation) {
			return new Promise(function (resolve, reject) {
				resolve(localStorage.setItem("crtLocation", crtLocation));


				// $(window).on('load', function () {
				start(crtLocation); //처음 4개 출력
				$(window).scroll(function () { //스크롤 감지 이벤트
					let scroll = $(document).scrollTop(); //현재 스크롤 값
					let documentHeight = $(document).height(); //문서 전체높이
					let windowHeight = window.innerHeight; //윈도우 높이
					//윈도우 높이에 스크롤값을 계속더해서 문서 전체 길이에서 100 px 앞에 스크롤이 왔을때 데이터 불러옴
					if ((windowHeight + scroll) >= documentHeight - 100) {
						if (mainScrollTime == true && end == true) {
							start(crtLocation);
						}
					}
				})
				// });
			});
		}
		let result = geolocationPromis()
			.then(kakaoAjax)
			.then(loadScroll);

		console.log(result);

	} else {
		console.log("위치조회X");
		$(window).on('load', function () {
			start(crtLocation); //처음 4개 출력
			$(window).scroll(function () { //스크롤 감지 이벤트
				let scroll = $(document).scrollTop(); //현재 스크롤 값
				let documentHeight = $(document).height(); //문서 전체높이
				let windowHeight = window.innerHeight; //윈도우 높이
				//윈도우 높이에 스크롤값을 계속더해서 문서 전체 길이에서 100 px 앞에 스크롤이 왔을때 데이터 불러옴
				if ((windowHeight + scroll) >= documentHeight - 100) {
					if (mainScrollTime == true && end == true) {
						start(crtLocation);
					}
				}
			})
		});
	}

}

function start() {
	//무한 스크롤 중복 방지
	mainScrollTime = false;

	$.ajax({
		// crtLocation는 컨트롤러에서 Auth객체가 없을때만 처리
		url: `/goods-list/${lastBoard}?userLocation=${crtLocation}`,
		type: "GET",
		dataType: "json", //json 으로 받기
		success: function (result) {

			for (var i = 0; i < result.length; i++) {
				let html = "";
				html += `
					<li class="goods-detail">
						<a href="goods/detail?goodsId=${result[i].goods.goodsId}">
							<div class="goods-image">
								<img src="${decodeURIComponent(result[i].goodsImage.goodsImagesPath)}">
							</div>
							<div class="goods-info">
								<div>
									<span class="goods-title">${result[i].goods.goodsTitle}</span>
								</div>
								<div>
									<span class="goods-price">${fomatPrice(result[i].goods.goodsPrice)}원</span>
									<span class="goods-status">${result[i].goods.goodsStatus}</span>
								</div>
								<div>
									<span class="goods-location">${result[i].goods.goodsLocation}</span>
								</div>
								<div>
									<span class="goods-wishCount">🤍관심 ${result[i].countWishes}</span>
									<span class="goods-writeDate">${timeForToday(result[i].goods.goodsCreateDate)}</span>
								</div>
							</div>
						</a>
					</li>
				`;

				$("#goodsList").append(html);
			}
			if (result[result.length - 1] != undefined) {
				//다음 게시글 18개 가져 오기 위해 마지막 게시글 기본키 값 넘겨줌
				console.log(lastBoard);
				lastBoard = result[result.length - 1].goods.goodsId;
			}

			setTimeout(function () {
				mainScrollTime = true;
			}, 400); //스크롤 이벤트 0.2초뒤 실행 중복방지 위해

		},
		error: function (error) {
			//서버오류 500  권한없음 401  찾는내용없음 400
			if (error.status == 500) {
				swal('서버오류', '', 'error');
			} else if (error.status == 404) {
				end = false;
				//가져올 게시글이 없어서 더이상 데이터를 가져오지 않게 바꿈
			}
		}
	});
}

//시간차이 계산 함수
function timeForToday(value) {
	const today = new Date();
	const timeValue = new Date(value);
	// const timeValue = new Date(value[0], value[1] - 1, value[2], value[3], value[4], value[5], 0);

	//시간은 1970-01-01을 기준으로 한 에포크시간.
	const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
	if (betweenTime < 1) return '방금전 작성';
	if (betweenTime < 60) {
		return `${betweenTime}분전 작성`;
	}

	const betweenTimeHour = Math.floor(betweenTime / 60);
	if (betweenTimeHour < 24) {
		return `${betweenTimeHour}시간전 작성`;
	}

	const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
	if (betweenTimeDay < 365) {
		if (betweenTimeDay == 0) {
			return `오늘 작성`;
		}
		return `${betweenTimeDay}일전 작성`;
	}

	return `${Math.floor(betweenTimeDay / 365)}년전 작성`;
}

//숫자 가격화 함수
function fomatPrice(strNum) {
	return strNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 세자리 콤마
}

function main() {
	getMyLocation();
	// loadScroll();
}
main();





// function countWishlist(goodId) {
// 	return new Promise(function (resolve, reject) {
// 		$.ajax({
// 			url: `/wishlist/count?goodsId=${goodId}`,
// 			type: "GET",
// 			dataType: "json", //json 으로 받기
// 			success: function (result) {
// 				resolve(result.value);
// 			},
// 			error: function (error) {
// 				reject(new Error("error"));
// 				//서버오류 500  권한없음 401  찾는내용없음 400
// 				if (error.status == 500) {
// 					swal('서버오류', '', 'error');
// 				} else if (error.status == 404) {
// 					end = false;
// 					//가져올 게시글이 없어서 더이상 데이터를 가져오지 않게 바꿈
// 				}
// 			}
// 		});
// 	});
// }


// function getCount(goodsId) {
// 	let goodsWishCount = document.querySelector(".goods-wishCount");
// 	let data = 0;
// 	countWishlist(goodsId)
// 		.then((response) => {
// 			console.log(response);
// 			goodsWishCount.innerHTML = "ASD";
// 			data = response
// 		});

// 	return data;

// }


// console.log(getCount(31));

// countWishlist(31).then(function (data) {
// 	console.log(data);
// }).catch(function (err) {
// 	console.log(err);
// });