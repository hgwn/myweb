//DL openApi by hgwn 2018/9/27

$(function() {

	var data = {
		"code": 0,
		"msg": "获取产品列表成功",
		"result": {
			"data": [{
				"productCitys": "所有城市",
				"productBriefInfo": "cscs",
				"productId": 10000064590004,
				"productImg": "10000064590003",
				"yearRate": "12",
				"proCategoryValue": "1003",
				"productName": "CSProduct"
			}, {
				"productCitys": "所有城市",
				"productBriefInfo": "cs",
				"productId": 10000059320008,
				"productImg": "10000059320007",
				"yearRate": "15",
				"proCategoryValue": "1003",
				"productName": "贸易融资"
			}],
			"proCount": 5
		}
	}
	//$("#response").html(JSON.stringify(data))



	var value = 0;
	var time = 50;
	//进度条复位函数
	function resetLoading() {
		value = 0
		$("#prog").removeClass("progress-bar-success").css("width", "0%").text("等待启动");
		//setTimeout(increment,5000);
	}
	//百分数增加，0-30时为红色，30-60为黄色，60-90为蓝色，>90为绿色
	function incrementLoading() {
		value += 1;
		$("#prog").css("width", value + "%").text(value + "%");
		if (value >= 0 && value <= 30) {
			$("#prog").addClass("progress-bar-danger");
		} else if (value >= 30 && value <= 60) {
			$("#prog").removeClass("progress-bar-danger");
			$("#prog").addClass("progress-bar-warning");
		} else if (value >= 60 && value <= 90) {
			$("#prog").removeClass("progress-bar-warning");
			$("#prog").addClass("progress-bar-info");
		} else if (value >= 90 && value < 100) {
			$("#prog").removeClass("progress-bar-info");
			$("#prog").addClass("progress-bar-success");
		} else {
			setTimeout(incrementLoading, 3000);
			return;

		}

		st = setTimeout(incrementLoading, time);
	}


	//引入css3Loading模块页面，并触发其loading方法
	$('#loadingModal').load('./html/css3Loading.html', function() {
		css3LoadingBox.show();
		setTimeout(function() {
			//alert('fuck..')
			css3LoadingBox.hide();
		}, 600)
	});

	// ajax 菊花状 loading ~显示    
	function showAjaxLoading() {
		if (css3LoadingBox) {
			css3LoadingBox.show();
		}

		if (document.getElementById('fixbg')) { //假如16秒之后还在转，则取消loading，
			//防止 情况：No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:72' is therefore not allowed access.
			// Failed to load http://192.168.16.16:86/api/loanform/base/loanBaseProductCategory/getCategoryList.ht?_1538040599695:
			//防止ajax 请求跨域了，如上面get ,浏览器如chrome 请求状态码 200，但response返回null（为空）情况，则loading一直在转，没有结束。
			//alert('ok..')
			setTimeout(function() {
				//toggleModal('情况不妙~~取消ajax菊花状哦')
				css3LoadingBox.hide();
			}, 16000)
		}

	}

	// ajax 菊花状 loading  ~消失
	function hideAjaxLoading() {
		if (css3LoadingBox) {
			setTimeout(function() {
				css3LoadingBox.hide();
			}, 600)
		}
	}

	//登录模块，待完成~~~
	var isClick = true;
	$('#loginBtn').on('click', function() {
		//resetLoading();
		if (isClick) { //防止重复提交,简单粗暴 1秒之内禁止多次点击

			isClick = false;

			setTimeout(function() {
				isClick = true;
			}, 1000)

			//incrementLoading();

			getList();

		}
		return false;
	});

	//测试16开发环境--保理列表接口
	function getList() {

		showAjaxLoading();
		console.warn(window.location.protocol + '//' + window.location.host + '/api/loanform/base/loanBaseProductCategory/getCategoryList.ht')
		//debugger;
		dlService.get('/api/loanform/base/loanBaseProductCategory/getCategoryList.ht', {},
			function(res) {
				hideAjaxLoading();
				console.log('...测试16开发环境--保理列表接口')
				console.log(res)
				updateResponse(res)
			})
	}


	//清空参数
	$('#resetBtn').on('click', function() {
		//document.getElementById("params").value="" ;
		$('#params').val('');
	});

	function alertTip(msg) {
		$('.alert-danger .tip').html(msg)
		$('.alert-danger').removeClass('hide').addClass('in')
	}


	//模态框提示
	function toggleModal(msg) {
		msg = msg ? msg : '提示'
		$('#myTips').html(msg);
		$('#myModal').modal('toggle');

		setTimeout(function() { //3秒自动消失
			$('#myModal').modal('toggle');
		}, 3000)

	}

	//填充ajax请求response 数据,并取消菊花状
	function updateResponse(data) {
		if (typeof data == 'object') {
			data = JSON.stringify(data)
		}
		setTimeout(function() {
			$('#response').html(data)
			css3LoadingBox.hide();
		}, 600)

	}

	function clearResponse() {
		$('#response').html('')
	}

	//测试提交
	$('#submit').on('click', function() {

		var contentType = $("input[name='contentTypeRadio']:checked").val(); // contentType
		var ajaxType = $("#ajaxType").val(); // ajaxType
		var ajaxUrl = $('#ajaxUrl').val();
		var params = $('#params').val();


		//alert(contentType + ':' + ajaxType + '::' + ajaxUrl + '::' + params)

		if (!ajaxUrl) {
			toggleModal('请求地址不能为空！');
			return;
		}


		if (ajaxUrl.indexOf('http') >= 0) {
			//ajaxUrl = ajaxUrl.substring(7)
		} else {
			ajaxUrl = 'http://' + ajaxUrl
		}

		console.warn(ajaxUrl)

		/*if(!params){
			toggleModal('请求参数不能为空！若为空，请输入{}');
			return;
		}
		*/
		var $btn = $(this).button('loading')
		clearResponse();
		css3LoadingBox.show();
		//incrementLoading();
		// business logic...
		// $btn.button('reset')

		if (contentType == 'application/x-www-form-urlencoded') { //表单提交

			dlService.ajax(ajaxUrl, ajaxType, params, function(res) {
				console.log(res)
				console.log('....success....')
				$btn.button('reset')
				updateResponse(res.data);

			}, function(error) {
				console.warn('...error....')
				console.warn(error)
				updateResponse(error.responseText)
				if (error.statusText) {
					updateResponse(error.statusText)
				}
				$btn.button('reset')


			})


		} else { //application/json 
			dlService.ajaxJosn(ajaxUrl, ajaxType, params, function(res) {
				console.log(res)
				console.log('....success....')
				$btn.button('reset')
				updateResponse(res.data)

			}, function(error) {
				console.log('...error....')
				console.log(error)
				updateResponse(error.responseText)
				if (error.statusText) {
					updateResponse(error.statusText)
				}
				$btn.button('reset');


			})
		}

		//toggleModal('测试提示');

	});

})