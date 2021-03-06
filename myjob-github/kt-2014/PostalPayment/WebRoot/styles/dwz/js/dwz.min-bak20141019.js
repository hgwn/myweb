function Map() {
	this.elements = new Array, this.size = function() {
		return this.elements.length
	}, this.isEmpty = function() {
		return this.elements.length < 1
	}, this.clear = function() {
		this.elements = new Array
	}, this.put = function(a, b) {
		this.remove(a), this.elements.push({
			key: a,
			value: b
		})
	}, this.remove = function(a) {
		try {
			for (i = 0; i < this.elements.length; i++)
				if (this.elements[i].key == a) return this.elements.splice(i, 1), !0
		} catch (b) {
			return !1
		}
		return !1
	}, this.get = function(a) {
		try {
			for (i = 0; i < this.elements.length; i++)
				if (this.elements[i].key == a) return this.elements[i].value
		} catch (b) {
			return null
		}
	}, this.element = function(a) {
		return 0 > a || a >= this.elements.length ? null : this.elements[a]
	}, this.containsKey = function(a) {
		try {
			for (i = 0; i < this.elements.length; i++)
				if (this.elements[i].key == a) return !0
		} catch (b) {
			return !1
		}
		return !1
	}, this.values = function() {
		var a = new Array;
		for (i = 0; i < this.elements.length; i++) a.push(this.elements[i].value);
		return a
	}, this.keys = function() {
		var a = new Array;
		for (i = 0; i < this.elements.length; i++) a.push(this.elements[i].key);
		return a
	}
}

function initEnv() {
	if ($("body").append(DWZ.frag.dwzFrag), $.browser.msie && /6.0/.test(navigator.userAgent)) try {
		document.execCommand("BackgroundImageCache", !1, !0)
	} catch (a) {}
	$.browser.msie && window.setInterval("CollectGarbage();", 1e4), $(window).resize(function() {
		initLayout(), $(this).trigger(DWZ.eventType.resizeGrid)
	});
	var b = $("#background,#progressBar");
	b.hide(), $(document).ajaxStart(function() {
		b.show()
	}).ajaxStop(function() {
		b.hide()
	}), $("#leftside").jBar({
		minW: 150,
		maxW: 700
	}), $.taskBar && $.taskBar.init(), navTab.init(), $.fn.switchEnv && $("#switchEnvBox").switchEnv(), $.fn.navMenu && $("#navMenu").navMenu(), setTimeout(function() {
		initLayout(), initUI();
		var a = $("div.tabsPageHeader");
		a.find(".tabsLeft").hoverClass("tabsLeftHover"), a.find(".tabsRight").hoverClass("tabsRightHover"), a.find(".tabsMore").hoverClass("tabsMoreHover")
	}, 10)
}

function initLayout() {
	var a = $(window).width() - (DWZ.ui.sbar ? $("#sidebar").width() + 10 : 34) - 5,
		b = $(window).height() - $("#header").height() - 34;
	$("#container").width(a), $("#container .tabsPageContent").height(b - 45).find("[layoutH]").layoutH(), $("#sidebar, #splitBar, #splitBarProxy").height(b - 9),$("#sidebar_s .collapse").height(b -9), $("#taskbar").css({
		top: b + $("#header").height() + 5,
		width: $(window).width()
	})
}

function initUI(_box) {
	var $p = $(_box || document);
	$("div.panel", $p).jPanel(), $("table.table", $p).jTable(), $("table.list", $p).cssTable(), $("div.tabs", $p).each(function() {
		var a = $(this),
			b = {};
		b.currentIndex = a.attr("currentIndex") || 0, b.eventType = a.attr("eventType") || "click", a.tabs(b)
	}), $("ul.tree", $p).jTree(), $("div.accordion", $p).each(function() {
		var a = $(this);
		a.accordion({
			fillSpace: a.attr("fillSpace"),
			alwaysOpen: !0,
			active: 0
		})
	}), $(":button.checkboxCtrl, :checkbox.checkboxCtrl", $p).checkboxCtrl($p), $.fn.combox && $("select.combox", $p).combox(), $.fn.xheditor && $("textarea.editor", $p).each(function() {
		var a = $(this),
			b = {
				html5Upload: !1,
				skin: "vista",
				tools: a.attr("tools") || "full"
			},
			c = [
				["upLinkUrl", "upLinkExt", "zip,rar,txt"],
				["upImgUrl", "upImgExt", "jpg,jpeg,gif,png"],
				["upFlashUrl", "upFlashExt", "swf"],
				["upMediaUrl", "upMediaExt", "avi"]
			];
		$(c).each(function(d) {
			var e = c[d][0],
				f = c[d][1];
			a.attr(e) && (b[e] = a.attr(e), b[f] = a.attr(f) || c[d][2])
		}), a.xheditor(b)
	}), $.fn.uploadify && $(":file[uploaderOption]", $p).each(function() {
		var a = $(this),
			b = {
				fileObjName: a.attr("name") || "file",
				auto: !0,
				multi: !0,
				onUploadError: uploadifyError
			},
			c = DWZ.jsonEval(a.attr("uploaderOption"));
		$.extend(b, c), DWZ.debug("uploaderOption: " + DWZ.obj2str(c)), a.uploadify(b)
	}), $("input[type=text], input[type=password], textarea", $p).addClass("textInput").focusClass("focus"), $("input[readonly], textarea[readonly]", $p).addClass("readonly"), $("input[disabled=true], textarea[disabled=true]", $p).addClass("disabled"), $("input[type=text]", $p).not("div.tabs input[type=text]", $p).filter("[alt]").inputAlert(), $("div.panelBar li, div.panelBar", $p).hoverClass("hover"), $("div.button", $p).hoverClass("buttonHover"), $("div.buttonActive", $p).hoverClass("buttonActiveHover"), $("div.tabsHeader li, div.tabsPageHeader li, div.accordionHeader, div.accordion", $p).hoverClass("hover"), $("form.required-validate", $p).each(function() {
		var a = $(this);
		a.validationEngine("attach", {
			scroll: !1,
			ajaxFormValidation: !1,
			promptPosition: "centerRight"
		})
	}), $.fn.datepicker && $("input.date", $p).each(function() {
		var a = $(this),
			b = {};
		a.attr("dateFmt") && (b.pattern = a.attr("dateFmt")), a.attr("minDate") && (b.minDate = a.attr("minDate")), a.attr("maxDate") && (b.maxDate = a.attr("maxDate")), a.attr("mmStep") && (b.mmStep = a.attr("mmStep")), a.attr("ssStep") && (b.ssStep = a.attr("ssStep")), a.datepicker(b)
	}), $("a[target=navTab]", $p).each(function() {
		
		$(this).click(function(event) {
			var $this = $(this),
				title = $this.attr("title") || $this.text(),
				tabid = $this.attr("rel") || "_blank",
				fresh = eval($this.attr("fresh") || "true"),
				external = eval($this.attr("external") || "false"),
				url = unescape($this.attr("href")).replaceTmById($(event.target).parents(".unitBox:first")),
				pTabid = navTab.getCurrentNavTab().attr("tabid");
			var icon_className = $(this).attr("icon_className");
			return DWZ.debug(url), url.isFinishedTm() ? (navTab.openTab(tabid, url, {
				title: title,
				fresh: fresh,
				external: external,
				data: {
					pTabid: pTabid,
					icon_className:icon_className
				}
			}), event.preventDefault(), void 0) : (alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg")), !1)
		})
	}), $("a[target=dialog]", $p).each(function() {
		$(this).click(function(event) {
			var $this = $(this),
				title = $this.attr("title") || $this.text(),
				rel = $this.attr("rel") || "_blank",
				options = {},
				w = $this.attr("width"),
				h = $this.attr("height");
			w && (options.width = w), h && (options.height = h), options.max = eval($this.attr("max") || "false"), options.mask = eval($this.attr("mask") || "false"), options.maxable = eval($this.attr("maxable") || "true"), options.minable = eval($this.attr("minable") || "true"), options.fresh = eval($this.attr("fresh") || "true"), options.resizable = eval($this.attr("resizable") || "true"), options.drawable = eval($this.attr("drawable") || "true"), options.close = eval($this.attr("close") || ""), options.param = $this.attr("param") || "";
			var url = unescape($this.attr("href")).replaceTmById($(event.target).parents(".unitBox:first"));
			return DWZ.debug(url), url.isFinishedTm() ? ($.pdialog.open(url, rel, title, options), !1) : (alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg")), !1)
		})
	}), $("a[target=ajax]", $p).each(function() {
		$(this).click(function(a) {
			var b = $(this),
				c = b.attr("rel");
			if (c) {
				var d = $("#" + c);
				d.loadUrl(b.attr("href"), {}, function() {
					d.find("[layoutH]").layoutH()
				})
			}
			a.preventDefault()
		})
	}), $("div.pagination", $p).each(function() {
		var a = $(this);
		a.pagination({
			targetType: a.attr("targetType"),
			rel: a.attr("rel"),
			totalCount: a.attr("totalCount"),
			numPerPage: a.attr("numPerPage"),
			pageNumShown: a.attr("pageNumShown"),
			currentPage: a.attr("currentPage")
		})
	}), $.fn.sortDrag && $("div.sortDrag", $p).sortDrag(), $.fn.ajaxTodo && $("a[target=ajaxTodo]", $p).ajaxTodo(), $.fn.dwzExport && $("a[target=dwzExport]", $p).dwzExport(), $.fn.lookup && $("a[lookupGroup]", $p).lookup(), $.fn.multLookup && $("[multLookup]:button", $p).multLookup(), $.fn.suggest && $("input[suggestFields]", $p).suggest(), $.fn.itemDetail && $("table.itemDetail", $p).itemDetail(), $.fn.selectedTodo && $("a[target=selectedTodo]", $p).selectedTodo(), $.fn.pagerForm && $("form[rel=pagerForm]", $p).pagerForm({
		parentBox: $p
	}), readyToolbarCSS()
}

function readyToolbarCSS() {
	var a = $("a[iconClass]");
	a.each(function() {
		var a = $(this).attr("iconClass"),
			b = $("span", this);
		0 == b.length ? $(this).css({
			background: "url(../styles/dwz/themes/css/images/icons/" + a + ".png) no-repeat",
			"background-position": "50% 50%",
			width: "22px",
			height: "20px",
			"text-indent": "-1000px",
			overflow: "hidden",
			display: "block",
			"float": "left"
		}) : b.css({
			"background-image": "url(../styles/dwz/themes/css/images/icons/" + a + ".png)",
			"background-position": "0 3px"
		})
	})
}

function validateCallback(a, b, c) {
	var d = $(a);
	if (!d.validationEngine("validate")) return !1;
	var e = function() {
		$.ajax({
			type: a.method || "POST",
			url: d.attr("action"),
			data: d.serializeArray(),
			dataType: "json",
			cache: !1,
			success: b || DWZ.ajaxDone,
			error: DWZ.ajaxError
		})
	};
	return c ? alertMsg.confirm(c, {
		okCall: e
	}) : e(), !1
}

function iframeCallback(a, b) {
	var c = $(a),
		d = $("#callbackframe");
	return c.validationEngine("validate") ? (0 == d.size() && (d = $("<iframe id='callbackframe' name='callbackframe' src='about:blank' style='display:none'></iframe>").appendTo("body")), a.ajax || c.append('<input type="hidden" name="ajax" value="1" />'), a.target = "callbackframe", _iframeResponse(d[0], b || DWZ.ajaxDone), void 0) : !1
}

function _iframeResponse(a, b) {
	var c = $(a),
		d = $(document);
	d.trigger("ajaxStart"), c.bind("load", function() {
		if (c.unbind("load"), d.trigger("ajaxStop"), "javascript:'%3Chtml%3E%3C/html%3E';" != a.src && "javascript:'<html></html>';" != a.src) {
			var f = a.contentDocument || a.document;
			if (!(f.readyState && "complete" != f.readyState || f.body && "false" == f.body.innerHTML)) {
				var g;
				if (f.XMLDocument) g = f.XMLDocument;
				else if (f.body) try {
					g = c.contents().find("body").text(), g = jQuery.parseJSON(g)
				} catch (h) {
					g = f.body.innerHTML
				} else g = f;
				b(g)
			}
		}
	})
}

function navTabAjaxDone(a) {
	if (DWZ.ajaxDone(a), a.statusCode == DWZ.statusCode.ok) {
		if (a.navTabId) navTab.reloadFlag(a.navTabId);
		else {
			var b = $("#pagerForm", navTab.getCurrentPanel()),
				c = b.size() > 0 ? b.serializeArray() : {};
			navTabPageBreak(c, a.rel)
		}
		"closeCurrent" == a.callbackType ? setTimeout(function() {
			navTab.closeCurrentTab(a.navTabId)
		}, 100) : "forward" == a.callbackType ? navTab.reload(a.forwardUrl) : "forwardConfirm" == a.callbackType ? alertMsg.confirm(a.confirmMsg || DWZ.msg("forwardConfirmMsg"), {
			okCall: function() {
				navTab.reload(a.forwardUrl)
			},
			cancelCall: function() {
				navTab.closeCurrentTab(a.navTabId)
			}
		}) : navTab.getCurrentPanel().find(":input[initValue]").each(function() {
			var a = $(this).attr("initValue");
			$(this).val(a)
		})
	}
}

function dialogAjaxDone(a) {
	if (DWZ.ajaxDone(a), a.statusCode == DWZ.statusCode.ok) {
		if (a.navTabId) navTab.reload(a.forwardUrl, {
			navTabId: a.navTabId
		});
		else if (a.rel) {
			var b = $("#pagerForm", navTab.getCurrentPanel()),
				c = b.size() > 0 ? b.serializeArray() : {};
			navTabPageBreak(c, a.rel)
		}
		"closeCurrent" == a.callbackType && $.pdialog.closeCurrent()
	}
}

function navTabSearch(a, b) {
	var c = $(a);
	return a[DWZ.pageInfo.numPerPage] && (a[DWZ.pageInfo.numPerPage].value = 15), navTab.reload(c.attr("action"), {
		data: c.serializeArray(),
		navTabId: b
	}), !1
}

function dialogSearch(a) {
	var b = $(a);
	return a[DWZ.pageInfo.pageNum] && (a[DWZ.pageInfo.pageNum].value = 1), $.pdialog.reload(b.attr("action"), {
		data: b.serializeArray()
	}), !1
}

function dwzSearch(a, b) {
	return "dialog" == b ? dialogSearch(a) : navTabSearch(a), !1
}

function divSearch(a, b) {
	var c = $(a);
	if (a[DWZ.pageInfo.pageNum] && (a[DWZ.pageInfo.pageNum].value = 1), b) {
		var d = $("#" + b);
		d.ajaxUrl({
			type: "POST",
			url: c.attr("action"),
			data: c.serializeArray(),
			callback: function() {
				d.find("[layoutH]").layoutH()
			}
		})
	}
	return !1
}

function _getPagerForm(a, b) {
	var c = $("#pagerForm", a).get(0);
	return c && (b.pageNum && (c[DWZ.pageInfo.pageNum].value = b.pageNum), b.numPerPage && (c[DWZ.pageInfo.numPerPage].value = b.numPerPage), b.orderField && (c[DWZ.pageInfo.orderField].value = b.orderField), b.orderDirection && c[DWZ.pageInfo.orderDirection] && (c[DWZ.pageInfo.orderDirection].value = b.orderDirection)), c
}

function dwzPageBreak(a) {
	var b = $.extend({
			targetType: "navTab",
			rel: "",
			data: {
				pageNum: "",
				numPerPage: "",
				orderField: "",
				orderDirection: "",
				totalCount: ""
			},
			callback: null
		}, a),
		c = "dialog" == b.targetType ? $.pdialog.getCurrent() : navTab.getCurrentPanel(),
		d = null,
		e = null;
	b.rel ? (e = c.find("#" + b.rel), d = _getPagerForm(e, b.data)) : d = _getPagerForm(c, b.data);
	var f = $(d).serializeArray();
	if (b.data.numPerPage && (f[1].value = b.data.numPerPage), f[4]) {
		var g = parseInt((f[4].value - 1) / b.data.numPerPage);
		f[0].value > g && (f[0].value = g)
	}
	b.rel ? d && e.ajaxUrl({
		type: "POST",
		url: $(d).attr("action"),
		data: f,
		callback: function() {
			e.find("[layoutH]").layoutH()
		}
	}) : "dialog" == b.targetType ? d && $.pdialog.reload($(d).attr("action"), {
		data: f,
		callback: b.callback
	}) : d && navTab.reload($(d).attr("action"), {
		data: f,
		callback: b.callback
	})
}

function navTabPageBreak(a, b) {
	dwzPageBreak({
		targetType: "navTab",
		rel: b,
		data: a
	})
}

function dialogPageBreak(a, b) {
	dwzPageBreak({
		targetType: "dialog",
		rel: b,
		data: a
	})
}

function ajaxTodo(url, callback) {
	var $callback = callback || navTabAjaxDone;
	$.isFunction($callback) || ($callback = eval("(" + callback + ")")), $.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		cache: !1,
		success: $callback,
		error: DWZ.ajaxError
	})
}

function uploadifyQueueComplete(a) {
	var b = "The total number of files uploaded: " + a.uploadsSuccessful + "<br/>" + "The total number of errors while uploading: " + a.uploadsErrored + "<br/>" + "The total number of bytes uploaded: " + a.queueBytesUploaded + "<br/>" + "The average speed of all uploaded files: " + a.averageSpeed;
	a.uploadsErrored ? alertMsg.error(b) : alertMsg.correct(b)
}

function uploadifySuccess(a, b) {
	alert(b)
}

function uploadifyError(a, b, c) {
	alertMsg.error(b + ": " + c)
}

function uploadifyError(a, b, c, d) {
	alert("event:" + a + "\nqueueId:" + b + "\nfileObj.name:" + c.name + "\nerrorObj.type:" + d.type + "\nerrorObj.info:" + d.info)
}
var DWZ = {
	keyCode: {
		ENTER: 13,
		ESC: 27,
		END: 35,
		HOME: 36,
		SHIFT: 16,
		TAB: 9,
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		DOWN: 40,
		DELETE: 46,
		BACKSPACE: 8
	},
	eventType: {
		pageClear: "pageClear",
		resizeGrid: "resizeGrid"
	},
	isOverAxis: function(a, b, c) {
		return a > b && b + c > a
	},
	isOver: function(a, b, c, d, e, f) {
		return this.isOverAxis(a, c, e) && this.isOverAxis(b, d, f)
	},
	pageInfo: {
		pageNum: "pageNum",
		numPerPage: "numPerPage",
		orderField: "orderField",
		orderDirection: "orderDirection"
	},
	statusCode: {
		ok: 200,
		error: 300,
		timeout: 301,
		forbidden: 403
	},
	ui: {
		sbar: !0
	},
	frag: {},
	_msg: {},
	_set: {
		loginUrl: "",
		loginTitle: "",
		debug: !1
	},
	msg: function(a, b) {
		var c = function(a, b) {
			b = b || [];
			for (var c = a || "", d = 0; d < b.length; d++) c = c.replace(new RegExp("\\{" + d + "\\}", "g"), b[d]);
			return c
		};
		return c(this._msg[a], b)
	},
	debug: function(a) {
		this._set.debug && ("undefined" != typeof console ? console.log(a) : alert(a))
	},
	loadLogin: function() {
		$.pdialog && DWZ._set.loginTitle ? $.pdialog.open(DWZ._set.loginUrl, "login", DWZ._set.loginTitle, {
			mask: !0,
			width: 520,
			height: 260
		}) : window.location = DWZ._set.loginUrl
	},
	obj2str: function(a) {
		var b = [];
		if ("string" == typeof a) return '"' + a.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + '"';
		if ("object" == typeof a) {
			if (a.sort) {
				for (var c = 0; c < a.length; c++) b.push(DWZ.obj2str(a[c]));
				b = "[" + b.join() + "]"
			} else {
				for (var c in a) b.push(c + ":" + DWZ.obj2str(a[c]));
				document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(a.toString) && b.push("toString:" + a.toString.toString()), b = "{" + b.join() + "}"
			}
			return b
		}
		return a.toString()
	},
	jsonEval: function(data) {
		try {
			return "string" == $.type(data) ? eval("(" + data + ")") : data
		} catch (e) {
			return {}
		}
	},
	ajaxError: function(a, b, c) {
		alertMsg ? alertMsg.error("<div>Http status: " + a.status + " " + a.statusText + "</div>" + "<div>ajaxOptions: " + b + "</div>" + "<div>thrownError: " + c + "</div>" + "<div>" + a.responseText + "</div>") : alert("Http status: " + a.status + " " + a.statusText + "\najaxOptions: " + b + "\nthrownError:" + c + "\n" + a.responseText)
	},
	ajaxDone: function(a) {
		a.statusCode == DWZ.statusCode.error ? a.message && alertMsg && alertMsg.error(a.message) : a.statusCode == DWZ.statusCode.timeout ? alertMsg ? alertMsg.error(a.message || DWZ.msg("sessionTimout"), {
			okCall: DWZ.loadLogin
		}) : DWZ.loadLogin() : a.statusCode == DWZ.statusCode.forbidden ? alertMsg ? alertMsg.error(a.message || DWZ.msg("forbidden")) : DWZ.loadLogin() : a.message && alertMsg && alertMsg.correct(a.message)
	},
	init: function(a, b) {
		var c = $.extend({
			loginUrl: "login.html",
			loginTitle: null,
			callback: null,
			debug: !1,
			statusCode: {}
		}, b);
		this._set.loginUrl = c.loginUrl, this._set.loginTitle = c.loginTitle, this._set.debug = c.debug, $.extend(DWZ.statusCode, c.statusCode), $.extend(DWZ.pageInfo, c.pageInfo), jQuery.ajax({
			type: "GET",
			url: a,
			dataType: "xml",
			timeout: 5e4,
			cache: !1,
			error: function(b) {
				alert("Error loading XML document: " + a + "\nHttp status: " + b.status + " " + b.statusText)
			},
			success: function(a) {
				$(a).find("_PAGE_").each(function() {
					var a = $(this).attr("id");
					a && (DWZ.frag[a] = $(this).text())
				}), $(a).find("_MSG_").each(function() {
					var a = $(this).attr("id");
					a && (DWZ._msg[a] = $(this).text())
				}), jQuery.isFunction(c.callback) && c.callback()
			}
		});
		var d = $(document);
		d.isBind(DWZ.eventType.pageClear) || d.bind(DWZ.eventType.pageClear, function(a) {
			var b = a.target;
			$.fn.xheditor && $("textarea.editor", b).xheditor(!1)
		})
	}
};
! function(a) {
	a.setRegional = function(b, c) {
		a.regional || (a.regional = {}), a.regional[b] = c
	}, a.fn.extend({
		ajaxUrl: function(b) {
			var c = a(this);
			c.trigger(DWZ.eventType.pageClear), a.ajax({
				type: b.type || "GET",
				url: b.url,
				data: b.data,
				cache: !1,
				success: function(d) {
					var e = DWZ.jsonEval(d);
					e.statusCode == DWZ.statusCode.error ? e.message && alertMsg.error(e.message) : (c.html(d).initUI(), a.isFunction(b.callback) && b.callback(d)), e.statusCode == DWZ.statusCode.timeout && (a.pdialog && a.pdialog.checkTimeout(), navTab && navTab.checkTimeout(), alertMsg.error(e.message || DWZ.msg("sessionTimout"), {
						okCall: function() {
							DWZ.loadLogin()
						}
					})), e.statusCode == DWZ.statusCode.forbidden && (a.pdialog && a.pdialog.forbidden(), navTab && navTab.forbidden(), alertMsg.error(e.message || DWZ.msg("forbidden"), {
						okCall: function() {}
					}))
				},
				error: DWZ.ajaxError,
				statusCode: {
					503: function(a, b, c) {
						alert(DWZ.msg("statusCode_503") || c)
					}
				}
			})
		},
		loadUrl: function(b, c, d) {
			a(this).ajaxUrl({
				url: b,
				data: c,
				callback: d
			})
		},
		initUI: function() {
			return this.each(function() {
				a.isFunction(initUI) && initUI(this)
			})
		},
		layoutH: function(b) {
			return this.each(function() {
				var c = a(this);
				b || (b = c.parents("div.layoutBox:first"));
				var d = b.height(),
					e = parseInt(c.attr("layoutH")),
					f = d - e > 50 ? d - e : 50;
				c.isTag("table") ? c.removeAttr("layoutH").wrap('<div layoutH="' + e + '" style="overflow:auto;height:' + f + 'px"></div>') : c.height(f).css("overflow", "auto")
			})
		},
		hoverClass: function(b, c) {
			var d = b || "hover";
			return this.each(function() {
				var e, b = a(this);
				b.hover(function() {
					e && clearTimeout(e), b.addClass(d)
				}, function() {
					e = setTimeout(function() {
						b.removeClass(d)
					}, c || 10)
				})
			})
		},
		focusClass: function(b) {
			var c = b || "textInputFocus";
			return this.each(function() {
				a(this).focus(function() {
					a(this).addClass(c)
				}).blur(function() {
					a(this).removeClass(c)
				})
			})
		},
		inputAlert: function() {
			return this.each(function() {
				function c() {
					return b.parent().find("label.alt")
				}

				function d(a) {
					var c = b.position();
					return {
						width: b.width(),
						top: c.top + "px",
						left: c.left + "px",
						opacity: a || 1
					}
				}
				var b = a(this);
				if (c().size() < 1) {
					b.attr("id") || b.attr("id", b.attr("name") + "_" + Math.round(1e4 * Math.random()));
					var e = a('<label class="alt" for="' + b.attr("id") + '">' + b.attr("alt") + "</label>").appendTo(b.parent());
					e.css(d(1)), b.val() && e.hide()
				}
				b.focus(function() {
					c().css(d(.3))
				}).blur(function() {
					a(this).val() || c().show().css("opacity", 1)
				}).keydown(function() {
					c().hide()
				})
			})
		},
		isTag: function(b) {
			return b ? a(this)[0].tagName.toLowerCase() == b ? !0 : !1 : !1
		},
		isBind: function(b) {
			var c = a(this).data("events");
			return c && b && c[b]
		},
		log: function(a) {
			return this.each(function() {
				console && console.log("%s: %o", a, this)
			})
		}
	}), a.extend(String.prototype, {
		isPositiveInteger: function() {
			return new RegExp(/^[1-9]\d*$/).test(this)
		},
		isInteger: function() {
			return new RegExp(/^\d+$/).test(this)
		},
		isNumber: function() {
			return new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(this)
		},
		trim: function() {
			return this.replace(/(^\s*)|(\s*$)|\r|\n/g, "")
		},
		startsWith: function(a) {
			return 0 === this.indexOf(a)
		},
		endsWith: function(a) {
			var b = this.length - a.length;
			return b >= 0 && this.lastIndexOf(a) === b
		},
		replaceSuffix: function(a) {
			return this.replace(/\[[0-9]+\]/, "[" + a + "]").replace("#index#", a)
		},
		trans: function() {
			return this.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
		},
		encodeTXT: function() {
			return this.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(" ", "&nbsp;")
		},
		replaceAll: function(a, b) {
			return this.replace(new RegExp(a, "gm"), b)
		},
		replaceTm: function(a) {
			return a ? this.replace(RegExp("({[A-Za-z_]+[A-Za-z0-9_]*})", "g"), function(b) {
				return a[b.replace(/[{}]+/g, "")]
			}) : this
		},
		replaceTmById: function(b) {
			var c = b || a(document);
			return this.replace(RegExp("({[A-Za-z_]+[A-Za-z0-9_]*})", "g"), function(a) {
				var b = c.find("#" + a.replace(/[{}]+/g, ""));
				return b.val() ? b.val() : a
			})
		},
		isFinishedTm: function() {
			return !new RegExp("{[A-Za-z_]+[A-Za-z0-9_]*}").test(this)
		},
		skipChar: function(a) {
			return this && 0 !== this.length ? this.charAt(0) === a ? this.substring(1).skipChar(a) : this : ""
		},
		isValidPwd: function() {
			return new RegExp(/^([_]|[a-zA-Z0-9]){6,32}$/).test(this)
		},
		isValidMail: function() {
			return new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(this.trim())
		},
		isSpaces: function() {
			for (var a = 0; a < this.length; a += 1) {
				var b = this.charAt(a);
				if (" " != b && "\n" != b && "	" != b && "\r" != b) return !1
			}
			return !0
		},
		isPhone: function() {
			return new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/).test(this)
		},
		isUrl: function() {
			return new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(this)
		},
		isExternalUrl: function() {
			return this.isUrl() && -1 == this.indexOf("://" + document.domain)
		}
	})
}(jQuery),
function() {
	function LZ(a) {
		return (0 > a || a > 9 ? "" : "0") + a
	}

	function formatDate(a, b) {
		b += "";
		var k, c = "",
			d = 0,
			e = "",
			f = "",
			g = a.getYear() + "",
			h = a.getMonth() + 1,
			i = a.getDate(),
			j = a.getDay(),
			k = a.getHours(),
			l = a.getMinutes(),
			m = a.getSeconds(),
			C = {};
		for (g.length < 4 && (g = "" + (g - 0 + 1900)), C.y = "" + g, C.yyyy = g, C.yy = g.substring(2, 4), C.M = h, C.MM = LZ(h), C.MMM = MONTH_NAMES[h - 1], C.NNN = MONTH_NAMES[h + 11], C.d = i, C.dd = LZ(i), C.E = DAY_NAMES[j + 7], C.EE = DAY_NAMES[j], C.H = k, C.HH = LZ(k), C.h = 0 == k ? 12 : k > 12 ? k - 12 : k, C.hh = LZ(C.h), C.K = k > 11 ? k - 12 : k, C.k = k + 1, C.KK = LZ(C.K), C.kk = LZ(C.k), C.a = k > 11 ? "PM" : "AM", C.m = l, C.mm = LZ(l), C.s = m, C.ss = LZ(m); d < b.length;) {
			for (e = b.charAt(d), f = ""; b.charAt(d) == e && d < b.length;) f += b.charAt(d++);
			c += null != C[f] ? C[f] : f
		}
		return c
	}

	function _isInteger(a) {
		return new RegExp(/^\d+$/).test(a)
	}

	function _getInt(a, b, c, d) {
		for (var e = d; e >= c; e--) {
			var f = a.substring(b, b + e);
			if (f.length < c) return null;
			if (_isInteger(f)) return f
		}
		return null
	}

	function parseDate(a, b) {
		a += "", b += "";
		for (var h, i, c = 0, d = 0, e = "", f = "", j = new Date(1900, 0, 1), k = j.getYear(), l = j.getMonth() + 1, m = 1, n = j.getHours(), o = j.getMinutes(), p = j.getSeconds(), q = ""; d < b.length;) {
			for (e = b.charAt(d), f = ""; b.charAt(d) == e && d < b.length;) f += b.charAt(d++);
			if ("yyyy" == f || "yy" == f || "y" == f) {
				if ("yyyy" == f && (h = 4, i = 4), "yy" == f && (h = 2, i = 2), "y" == f && (h = 2, i = 4), k = _getInt(a, c, h, i), null == k) return 0;
				c += k.length, 2 == k.length && (k = k > 70 ? 1900 + (k - 0) : 2e3 + (k - 0))
			} else if ("MMM" == f || "NNN" == f) {
				l = 0;
				for (var r = 0; r < MONTH_NAMES.length; r++) {
					var s = MONTH_NAMES[r];
					if (a.substring(c, c + s.length).toLowerCase() == s.toLowerCase() && ("MMM" == f || "NNN" == f && r > 11)) {
						l = r + 1, l > 12 && (l -= 12), c += s.length;
						break
					}
				}
				if (1 > l || l > 12) return 0
			} else if ("EE" == f || "E" == f)
				for (var r = 0; r < DAY_NAMES.length; r++) {
					var t = DAY_NAMES[r];
					if (a.substring(c, c + t.length).toLowerCase() == t.toLowerCase()) {
						c += t.length;
						break
					}
				} else if ("MM" == f || "M" == f) {
					if (l = _getInt(a, c, f.length, 2), null == l || 1 > l || l > 12) return 0;
					c += l.length
				} else if ("dd" == f || "d" == f) {
				if (m = _getInt(a, c, f.length, 2), null == m || 1 > m || m > 31) return 0;
				c += m.length
			} else if ("hh" == f || "h" == f) {
				if (n = _getInt(a, c, f.length, 2), null == n || 1 > n || n > 12) return 0;
				c += n.length
			} else if ("HH" == f || "H" == f) {
				if (n = _getInt(a, c, f.length, 2), null == n || 0 > n || n > 23) return 0;
				c += n.length
			} else if ("KK" == f || "K" == f) {
				if (n = _getInt(a, c, f.length, 2), null == n || 0 > n || n > 11) return 0;
				c += n.length
			} else if ("kk" == f || "k" == f) {
				if (n = _getInt(a, c, f.length, 2), null == n || 1 > n || n > 24) return 0;
				c += n.length, n--
			} else if ("mm" == f || "m" == f) {
				if (o = _getInt(a, c, f.length, 2), null == o || 0 > o || o > 59) return 0;
				c += o.length
			} else if ("ss" == f || "s" == f) {
				if (p = _getInt(a, c, f.length, 2), null == p || 0 > p || p > 59) return 0;
				c += p.length
			} else if ("a" == f) {
				if ("am" == a.substring(c, c + 2).toLowerCase()) q = "AM";
				else {
					if ("pm" != a.substring(c, c + 2).toLowerCase()) return 0;
					q = "PM"
				}
				c += 2
			} else {
				if (a.substring(c, c + f.length) != f) return 0;
				c += f.length
			}
		}
		if (c != a.length) return 0;
		if (2 == l)
			if (0 == k % 4 && 0 != k % 100 || 0 == k % 400) {
				if (m > 29) return 0
			} else if (m > 28) return 0;
		return (4 == l || 6 == l || 9 == l || 11 == l) && m > 30 ? 0 : (12 > n && "PM" == q ? n = n - 0 + 12 : n > 11 && "AM" == q && (n -= 12), new Date(k, l - 1, m, n, o, p))
	}

	function replaceTmEval(data) {
		return data.replace(RegExp("({[A-Za-z0-9_+-]*})", "g"), function($1) {
			return eval("(" + $1.replace(/[{}]+/g, "") + ")")
		})
	}
	var MONTH_NAMES = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"),
		DAY_NAMES = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
	Date.prototype.formatDate = function(a) {
		return formatDate(this, a)
	}, String.prototype.parseDate = function(a) {
		return this.length < a.length && (a = a.slice(0, this.length)), parseDate(this, a)
	}, Date.prototype.formatDateTm = function(a) {
		var b = this.getFullYear(),
			c = this.getMonth() + 1,
			d = this.getDate(),
			e = a.replaceAll("%y", b).replaceAll("%M", c).replaceAll("%d", d);
		e = replaceTmEval(e);
		var f = 1900,
			g = 0,
			h = 1,
			i = e.split("-");
		return i.length > 0 && (f = i[0]), i.length > 1 && (g = i[1] - 1), i.length > 2 && (h = i[2]), new Date(f, g, h).formatDate("yyyy-MM-dd")
	}
}(),
function($) {
	$.validator && ($.validator.addMethod("alphanumeric", function(a, b) {
		return this.optional(b) || /^\w+$/i.test(a)
	}, "Letters, numbers or underscores only please"), $.validator.addMethod("lettersonly", function(a, b) {
		return this.optional(b) || /^[a-z]+$/i.test(a)
	}, "Letters only please"), $.validator.addMethod("phone", function(a, b) {
		return this.optional(b) || /^[0-9 \(\)]{7,30}$/.test(a)
	}, "Please specify a valid phone number"), $.validator.addMethod("postcode", function(a, b) {
		return this.optional(b) || /^[0-9 A-Za-z]{5,20}$/.test(a)
	}, "Please specify a valid postcode"), $.validator.addMethod("date", function(a, b) {
		if (a = a.replace(/\s+/g, ""), String.prototype.parseDate) {
			var c = $(b),
				d = c.attr("dateFmt") || "yyyy-MM-dd";
			return !c.val() || c.val().parseDate(d)
		}
		return this.optional(b) || a.match(/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/)
	}, "Please enter a valid date."), $.validator.addMethod("customvalid", function(value, element, params) {
		try {
			return eval("(" + params + ")")
		} catch (e) {
			return !1
		}
	}, "Please fix this field."), $.validator.addClassRules({
		date: {
			date: !0
		},
		alphanumeric: {
			alphanumeric: !0
		},
		lettersonly: {
			lettersonly: !0
		},
		phone: {
			phone: !0
		},
		postcode: {
			postcode: !0
		}
	}), $.validator.setDefaults({
		errorElement: "span"
	}), $.validator.autoCreateRanges = !0)
}(jQuery),
function(a) {
	a.fn.cssv = function(b) {
		var c = a(this).css(b);
		return 1 * c.substring(0, c.indexOf("px"))
	}, a.fn.jBar = function(b) {
		var c = a.extend({
			container: "#container",
			collapse: ".collapse",
			toggleBut: ".toggleCollapse div",
			sideBar: "#sidebar",
			sideBar2: "#sidebar_s",
			splitBar: "#splitBar",
			splitBar2: "#splitBarProxy"
		}, b);
		return this.each(function() {
			var d = this,
				e = a(c.sideBar2, d),
				f = a(c.sideBar, d);
			a(c.toggleBut, f).click(function() {
				DWZ.ui.sbar = !1, a(c.splitBar).hide();
				var b = e.cssv("left") + e.outerWidth(),
					d = b - f.outerWidth(),
					g = a(c.container).cssv("left") - (f.outerWidth() - e.outerWidth()),
					h = f.outerWidth() - e.outerWidth() + a(c.container).outerWidth();
				return a(c.container).animate({
					left: g,
					width: h
				}, 50, function() {
					f.animate({
						left: d
					}, 500, function() {
						f.hide(), e.show().css("left", -50).animate({
							left: 5
						}, 200), a(window).trigger(DWZ.eventType.resizeGrid)
					})
				}), a(c.collapse, e).click(function() {
					function g() {
						a(c.container).unbind("click", g), DWZ.ui.sbar || f.animate({
							left: d
						}, 500, function() {
							f.hide()
						})
					}
					var b = e.cssv("left") + e.outerWidth();
					return f.is(":hidden") ? (a(c.toggleBut, f).hide(), f.show().animate({
						left: b
					}, 500), a(c.container).click(g)) : f.animate({
						left: d
					}, 500, function() {
						f.hide()
					}), !1
				}), !1
			}), a(c.toggleBut, e).click(function() {
				return DWZ.ui.sbar = !0, e.animate({
					left: -25
				}, 200, function() {
					f.show()
				}), f.animate({
					left: 5
				}, 800, function() {
					a(c.splitBar).show(), a(c.toggleBut, f).show();
					var b = 5 + f.outerWidth() + a(c.splitBar).outerWidth(),
						d = a(c.container).outerWidth() - (b - a(c.container).cssv("left"));
					a(c.container).css({
						left: b,
						width: d
					}), a(c.collapse, e).unbind("click"), a(window).trigger(DWZ.eventType.resizeGrid)
				}), !1
			}), a(c.splitBar).mousedown(function(d) {
				a(c.splitBar2).each(function() {
					var e = a(this);
					return setTimeout(function() {
						e.show()
					}, 100), e.css({
						visibility: "visible",
						left: a(c.splitBar).css("left")
					}), e.jDrag(a.extend(b, {
						obj: a("#sidebar"),
						move: "horizontal",
						event: d,
						stop: function() {
							a(this).css("visibility", "hidden");
							var b = a(this).cssv("left") - a(c.splitBar).cssv("left"),
								d = f.outerWidth() + b,
								e = a(c.container).cssv("left") + b,
								g = a(c.container).outerWidth() - b;
							f.css("width", d), a(c.splitBar).css("left", a(this).css("left")), a(c.container).css({
								left: e,
								width: g
							})
						}
					})), !1
				})
			})
		})
	}
}(jQuery),
function(a) {
	a.fn.jDrag = function(b) {
		return "string" == typeof b && "destroy" == b ? this.each(function() {
			a(this).unbind("mousedown", a.rwdrag.start), a.data(this, "pp-rwdrag", null)
		}) : this.each(function() {
			var c = a(this);
			if (a.data(a.rwdrag, "pp-rwdrag", {
				options: a.extend({
					el: c,
					obj: c
				}, b)
			}), b.event) a.rwdrag.start(b.event);
			else {
				var d = b.selector;
				a(d, obj).bind("mousedown", a.rwdrag.start)
			}
		})
	}, a.rwdrag = {
		start: function(b) {
			document.onselectstart = function() {
				return !1
			};
			var c = a.data(this, "pp-rwdrag"),
				d = c.options.el[0];
			a.data(d, "pp-rwdrag", {
				options: c.options
			}), a.rwdrag.current || (a.rwdrag.current = {
				el: d,
				oleft: parseInt(d.style.left) || 0,
				otop: parseInt(d.style.top) || 0,
				ox: b.pageX || b.screenX,
				oy: b.pageY || b.screenY
			}, a(document).bind("mouseup", a.rwdrag.stop).bind("mousemove", a.rwdrag.drag))
		},
		drag: function(b) {
			if (!b) var b = window.event;
			var c = a.rwdrag.current,
				d = a.data(c.el, "pp-rwdrag"),
				e = c.oleft + (b.pageX || b.clientX) - c.ox,
				f = c.otop + (b.pageY || b.clientY) - c.oy;
			if (1 > f && (f = 0), "horizontal" == d.options.move) d.options.minW && e >= a(d.options.obj).cssv("left") + d.options.minW && d.options.maxW && e <= a(d.options.obj).cssv("left") + d.options.maxW ? c.el.style.left = e + "px" : d.options.scop && (d.options.relObj ? e - parseInt(d.options.relObj.style.left) > d.options.cellMinW && (c.el.style.left = e + "px") : c.el.style.left = e + "px");
			else if ("vertical" == d.options.move) c.el.style.top = f + "px";
			else {
				var g = d.options.selector ? a(d.options.selector, d.options.obj) : a(d.options.obj);
				e >= 2 * -g.outerWidth() / 3 && f >= 0 && e + g.outerWidth() / 3 < a(window).width() && f + g.outerHeight() < a(window).height() && (c.el.style.left = e + "px", c.el.style.top = f + "px")
			}
			return d.options.drag && d.options.drag.apply(c.el, [c.el]), a.rwdrag.preventEvent(b)
		},
		stop: function(b) {
			var c = a.rwdrag.current,
				d = a.data(c.el, "pp-rwdrag");
			return a(document).unbind("mousemove", a.rwdrag.drag).unbind("mouseup", a.rwdrag.stop), d.options.stop && d.options.stop.apply(c.el, [c.el]), a.rwdrag.current = null, document.onselectstart = function() {
				return !0
			}, a.rwdrag.preventEvent(b)
		},
		preventEvent: function(a) {
			return a.stopPropagation && a.stopPropagation(), a.preventDefault && a.preventDefault(), !1
		}
	}
}(jQuery),
function($) {
	$.extend($.fn, {
		jTree: function(options) {
			var op = $.extend({
				checkFn: null,
				selected: "selected",
				exp: "expandable",
				coll: "collapsable",
				firstExp: "first_expandable",
				firstColl: "first_collapsable",
				lastExp: "last_expandable",
				lastColl: "last_collapsable",
				folderExp: "folder_expandable",
				folderColl: "folder_collapsable",
				endExp: "end_expandable",
				endColl: "end_collapsable",
				file: "file",
				ck: "checked",
				unck: "unchecked"
			}, options);
			return this.each(function() {
				var $this = $(this),
					cnum = $this.children().length;
				$(">li", $this).each(function() {
					var a = $(this),
						b = a.prev()[0] ? !1 : !0,
						c = a.next()[0] ? !1 : !0;
					a.genTree({
						icon: $this.hasClass("treeFolder"),
						ckbox: $this.hasClass("treeCheck"),
						options: op,
						level: 0,
						exp: cnum > 1 ? b ? op.firstExp : c ? op.lastExp : op.exp : op.endExp,
						coll: cnum > 1 ? b ? op.firstColl : c ? op.lastColl : op.coll : op.endColl,
						showSub: !($this.hasClass("collapse") || !$this.hasClass("expand") && (cnum > 1 ? b ? 0 : 1 : 0)),
						isLast: cnum > 1 ? c ? !0 : !1 : !0
					})
				}), setTimeout(function() {
					if ($this.hasClass("treeCheck")) {
						var checkFn = eval($this.attr("oncheck"));
						checkFn && $.isFunction(checkFn) && $("div.ckbox", $this).each(function() {
							var a = $(this);
							a.click(function() {
								var b = $(a).hasClass("checked"),
									c = [];
								if (b) {
									var d = $(a).parent().parent(),
										e = $("input", d);
									e.size() > 1 ? $(e).each(function() {
										c[c.length] = {
											name: $(this).attr("name"),
											value: $(this).val(),
											text: $(this).attr("text")
										}
									}) : c = {
										name: e.attr("name"),
										value: e.val(),
										text: e.attr("text")
									}
								}
								checkFn({
									checked: b,
									items: c
								})
							})
						})
					}
					$("a", $this).click(function(a) {
						$("div." + op.selected, $this).removeClass(op.selected);
						var b = $(this).parent().addClass(op.selected),
							c = $(this).parents("li:first"),
							d = c.attr("target");
						return d && (0 == $("#" + d, $this).size() && $this.prepend('<input id="' + d + '" type="hidden" />'), $("#" + d, $this).val(c.attr("rel"))), $(".ckbox", b).trigger("click"), a.stopPropagation(), $(document).trigger("click"), $(this).attr("target") ? void 0 : !1
					})
				}, 1)
			})
		},
		subTree: function(a, b) {
			return this.each(function() {
				$(">li", this).each(function() {
					var c = $(this),
						d = c.next()[0] ? !1 : !0;
					c.genTree({
						icon: a.icon,
						ckbox: a.ckbox,
						exp: d ? a.options.lastExp : a.options.exp,
						coll: d ? a.options.lastColl : a.options.coll,
						options: a.options,
						level: b,
						space: d ? null : a.space,
						showSub: a.showSub,
						isLast: d
					})
				})
			})
		},
		genTree: function(a) {
			function c(a, b) {
				if (a > 0) {
					var c = b.parent().parent(),
						d = c.next()[0] ? "line" : "indent",
						e = "<div class='" + d + "'></div>";
					if (a > 1) {
						for (var f = $(">div>div", c).filter(":first"), g = ""; a > 1;) g = g + "<div class='" + f.attr("class") + "'></div>", f = f.next(), a--;
						e = g + e
					}
					$(">div", b).prepend(e)
				}
			}
			var b = $.extend({
				icon: a.icon,
				ckbox: a.ckbox,
				exp: "",
				coll: "",
				showSub: !1,
				level: 0,
				options: null,
				isLast: !1
			}, a);
			return this.each(function() {
				var a = $(this),
					d = $(">ul", a),
					e = a.parent().prev(),
					f = "unchecked";
				b.ckbox && $(">.checked", e).size() > 0 && (f = "checked"), d.size() > 0 ? (a.children(":first").wrap("<div></div>"), $(">div", a).prepend("<div class='" + (b.showSub ? b.coll : b.exp) + "'></div>" + (b.ckbox ? "<div class='ckbox " + f + "'></div>" : "") + (b.icon ? "<div class='" + (b.showSub ? b.options.folderColl : b.options.folderExp) + "'></div>" : "")), b.showSub ? d.show() : d.hide(), $(">div>div:first,>div>a", a).click(function() {
					var c = $(">li:first", d);
					c.children(":first").isTag("a") && d.subTree(b, b.level + 1);
					var e = $(this),
						f = e.isTag("a"),
						e = f ? $(">div>div", a).eq(b.level) : e;
					return (!f || d.is(":hidden")) && (e.toggleClass(b.exp).toggleClass(b.coll), b.icon && $(">div>div:last", a).toggleClass(b.options.folderExp).toggleClass(b.options.folderColl)), d.is(":hidden") ? d.slideDown("fast") : f ? "" : d.slideUp("fast"), !1
				}), c(b.level, a), b.showSub && d.subTree(b, b.level + 1)) : (a.children().wrap("<div></div>"), $(">div", a).prepend("<div class='node'></div>" + (b.ckbox ? "<div class='ckbox " + f + "'></div>" : "") + (b.icon ? "<div class='file'></div>" : "")), c(b.level, a), b.isLast && $(a).addClass("last")), b.ckbox && a._check(b), $(">div", a).mouseover(function() {
					$(this).addClass("hover")
				}).mouseout(function() {
					$(this).removeClass("hover")
				}), $.browser.msie && $(">div", a).click(function() {
					return $("a", this).trigger("click"), !1
				})
			})
		},
		_check: function() {
			var b = $(this),
				c = $(">div>.ckbox", b),
				d = b.find("a"),
				e = d.attr("tname"),
				f = d.attr("tvalue"),
				g = "text='" + d.text() + "' ";
			e && (g += "name='" + e + "' "), f && (g += "value='" + f + "' "), c.append("<input type='checkbox' style='display:none;' " + g + "/>").click(function() {
				var a = c.hasClass("checked"),
					d = a ? "unchecked" : "checked",
					e = a ? "checked" : "unchecked";
				return c.removeClass(e).removeClass(a ? "" : "indeterminate").addClass(d), $("input", c).attr("checked", !a), $(">ul", b).find("li").each(function() {
					var b = $("div.ckbox", this);
					b.removeClass(e).removeClass(a ? "" : "indeterminate").addClass(d).find("input").attr("checked", !a)
				}), $(b)._checkParent(), !1
			});
			var h = d.attr("checked") || !1;
			h && (c.find("input").attr("checked", !0), c.removeClass("unchecked").addClass("checked"), $(b)._checkParent())
		},
		_checkParent: function() {
			if (!$(this).parent().hasClass("tree")) {
				var a = $(this).parent().parent(),
					b = $(">ul", a),
					c = b.find(">li>a").size() + b.find("div.ckbox").size(),
					d = b.find("div.checked").size(),
					e = d == c ? "checked" : 0 != d ? "indeterminate" : "unchecked",
					f = d == c ? "indeterminate" : 0 != d ? "checked" : "indeterminate";
				$(">div>.ckbox", a).removeClass("unchecked").removeClass("checked").removeClass(f).addClass(e);
				var g = $(":checkbox", a);
				"checked" == e ? g.attr("checked", "checked") : g.removeAttr("checked"), a._checkParent()
			}
		}
	})
}(jQuery),
function(a) {
	function c(a, b) {
		return function() {
			return a.apply(b, arguments)
		}
	}

	function d(b) {
		if (a.data(this, "dwz-accordion")) {
			var c = a.data(this, "dwz-accordion"),
				d = c.options;
			d.running = b ? 0 : --d.running, d.running || (d.clearStyle && d.toShow.add(d.toHide).css({
				height: "",
				overflow: ""
			}), a(this).triggerHandler("change.dwz-accordion", [d.data], d.change))
		}
	}

	function e(c) {
		var d = b.get(c);
		if (d) {
			var e = a(d).parent(),
				f = e.height() - a(".accordionHeader", d).size() * a(".accordionHeader:first-child", d).outerHeight() - 2,
				g = e.children().not(d);
			a.each(g, function(b) {
				f -= a(g[b]).outerHeight()
			}), a(".accordionContent", d).height(f)
		}
	}

	function f(b, e, f, g, h) {
		var i = a.data(this, "dwz-accordion").options;
		i.toShow = b, i.toHide = e, i.data = f;
		var j = c(d, this);
		i.running = 0 == e.size() ? b.size() : e.size(), i.animated ? !i.alwaysOpen && g ? a.dwz.accordion.animations[i.animated]({
			toShow: jQuery([]),
			toHide: e,
			complete: j,
			down: h,
			autoheight: i.autoheight
		}) : a.dwz.accordion.animations[i.animated]({
			toShow: b,
			toHide: e,
			complete: j,
			down: h,
			autoheight: i.autoheight
		}) : (!i.alwaysOpen && g ? b.toggle() : (e.hide(), b.show()), j(!0))
	}

	function g(b) {
		var c = a.data(this, "dwz-accordion").options;
		if (c.disabled) return !1;
		if (!b.target && !c.alwaysOpen) {
			c.active.find("h2").toggleClass(c.selectedClass);
			var d = c.active.next(),
				e = {
					instance: this,
					options: c,
					newHeader: jQuery([]),
					oldHeader: c.active,
					newContent: jQuery([]),
					oldContent: d
				},
				g = c.active = a([]);
			return f.call(this, g, d, e), !1
		}
		var h = a(b.target);
		if (h.parents(c.header).length)
			for (; !h.is(c.header);) h = h.parent();
		var i = h[0] == c.active[0];
		if (c.running || c.alwaysOpen && i) return !1;
		if (h.is(c.header)) {
			c.active.find("h2").toggleClass(c.selectedClass), i || h.find("h2").addClass(c.selectedClass);
			var g = h.next(),
				d = c.active.next(),
				e = {
					instance: this,
					options: c,
					newHeader: h,
					oldHeader: c.active,
					newContent: g,
					oldContent: d
				},
				j = c.headers.index(c.active[0]) > c.headers.index(h[0]);
			return c.active = i ? a([]) : h, f.call(this, g, d, e, i, j), !1
		}
	}

	function h(b, c) {
		return void 0 != c ? "number" == typeof c ? b.filter(":eq(" + c + ")") : b.not(b.not(c)) : c === !1 ? a([]) : b.filter(":eq(0)")
	}
	var b = new Map;
	a.dwz = a.dwz || {}, a(window).resize(function() {
		setTimeout(function() {
			for (var a = 0; a < b.size(); a++) e(b.element(a).key)
		}, 100)
	}), a.fn.extend({
		accordion: function(c) {
			var e = Array.prototype.slice.call(arguments, 1);
			return this.each(function() {
				if (c.fillSpace && b.put(c.fillSpace, this), "string" == typeof c) {
					var d = a.data(this, "dwz-accordion");
					d[c].apply(d, e)
				} else a(this).is(".dwz-accordion") || a.data(this, "dwz-accordion", new a.dwz.accordion(this, c))
			})
		},
		activate: function(a) {
			return this.accordion("activate", a)
		}
	}), a.dwz.accordion = function(b, c) {
		if (this.options = c = a.extend({}, a.dwz.accordion.defaults, c), this.element = b, a(b).addClass("dwz-accordion"), c.navigation) {
			var d = a(b).find("a").filter(c.navigationFilter);
			d.length && (d.filter(c.header).length ? c.active = d : (c.active = d.parent().parent().prev(), d.addClass("current")))
		}
		if (c.headers = a(b).find(c.header), c.active = h(c.headers, c.active), c.fillSpace) e(c.fillSpace);
		else if (c.autoheight) {
			var f = 0;
			c.headers.next().each(function() {
				f = Math.max(f, a(this).outerHeight())
			}).height(f)
		}
		c.headers.not(c.active || "").next().hide(), c.active.find("h2").addClass(c.selectedClass), c.event && a(b).bind(c.event + ".dwz-accordion", g)
	}, a.dwz.accordion.prototype = {
		activate: function(a) {
			g.call(this.element, {
				target: h(this.options.headers, a)[0]
			})
		},
		enable: function() {
			this.options.disabled = !1
		},
		disable: function() {
			this.options.disabled = !0
		},
		destroy: function() {
			this.options.headers.next().css("display", ""), (this.options.fillSpace || this.options.autoheight) && this.options.headers.next().css("height", ""), a.removeData(this.element, "dwz-accordion"), a(this.element).removeClass("dwz-accordion").unbind(".dwz-accordion")
		}
	}, a.extend(a.dwz.accordion, {
		defaults: {
			selectedClass: "collapsable",
			alwaysOpen: !0,
			animated: "slide",
			event: "click",
			header: ".accordionHeader",
			autoheight: !0,
			running: 0,
			navigationFilter: function() {
				return this.href.toLowerCase() == location.href.toLowerCase()
			}
		},
		animations: {
			slide: function(b, c) {
				if (b = a.extend({
					easing: "swing",
					duration: 300
				}, b, c), !b.toHide.size()) return b.toShow.animate({
					height: "show"
				}, b), void 0;
				var d = b.toHide.height(),
					e = b.toShow.height(),
					f = e / d;
				b.toShow.css({
					height: 0
				}).show(), b.toHide.filter(":hidden").each(b.complete).end().filter(":visible").animate({
					height: "hide"
				}, {
					step: function(c) {
						var e = (d - c) * f;
						(a.browser.msie || a.browser.opera) && (e = Math.ceil(e)), b.toShow.height(e)
					},
					duration: b.duration,
					easing: b.easing,
					complete: function() {
						b.autoheight || b.toShow.css({
							height: "auto"
						}), b.toShow.css({
							overflow: "auto"
						}), b.complete()
					}
				})
			},
			bounceslide: function(a) {
				this.slide(a, {
					easing: a.down ? "bounceout" : "swing",
					duration: a.down ? 1e3 : 200
				})
			},
			easeslide: function(a) {
				this.slide(a, {
					easing: "easeinout",
					duration: 700
				})
			}
		}
	})
}(jQuery),
function(a) {
	a.fn.extend({
		theme: function(b) {
			var c = a.extend({
					themeBase: "themes"
				}, b),
				d = c.themeBase + "/#theme#/style.css";
			return this.each(function() {
				var b = a(this).find(">li[theme]"),
					c = function(c) {
						a("head").find("link[href$='style.css']").attr("href", d.replace("#theme#", c)), b.find(">div").removeClass("selected"), b.filter("[theme=" + c + "]").find(">div").addClass("selected"), a.isFunction(a.cookie) && a.cookie("dwz_theme", c)
					};
				if (b.each(function() {
					var d = a(this),
						e = d.attr("theme");
					d.addClass(e).click(function() {
						c(e)
					})
				}), a.isFunction(a.cookie)) {
					var e = a.cookie("dwz_theme");
					e && c(e)
				}
			})
		}
	})
}(jQuery),
function(a) {
	function b(b) {
		b.addClass("selected"), a(document).bind("click", {
			box: b
		}, d)
	}

	function c(b) {
		b.removeClass("selected"), a(document).unbind("click", d)
	}

	function d(a) {
		c(a.data.box)
	}
	a.fn.navMenu = function() {
		return this.each(function() {
			var b = a(this);
			b.find("li>a").click(function() {
				var c = a(this);
				return a.post(c.attr("href"), {}, function(d) {
					a("#sidebar").find(".accordion").remove().end().append(d).initUI(), b.find("li").removeClass("selected"), c.parent().addClass("selected"), navTab.closeAllTab()
				}), !1
			})
		})
	}, a.fn.switchEnv = function() {
		var d = {
			cities$: ">ul>li",
			boxTitle$: ">a>span"
		};
		return this.each(function() {
			var e = a(this);
			e.click(function() {
				return e.hasClass("selected") ? c(e) : b(e), !1
			}), e.find(d.cities$).click(function() {
				var b = a(this);
				return a.post(b.find(">a").attr("href"), {}, function(f) {
					c(e), e.find(d.boxTitle$).html(b.find(">a").html()), navTab.closeAllTab(), a("#sidebar").find(".accordion").remove().end().append(f).initUI()
				}), !1
			})
		})
	}
}(jQuery), $.setRegional("alertMsg", {
	title: {
		error: "Error",
		info: "Information",
		warn: "Warning",
		correct: "Successful",
		confirm: "Confirmation"
	},
	butMsg: {
		ok: "OK",
		yes: "Yes",
		no: "No",
		cancel: "Cancel"
	}
});
var alertMsg = {
	_boxId: "#alertMsgBox",
	_bgId: "#alertBackground",
	_closeTimer: null,
	_types: {
		error: "error",
		info: "info",
		warn: "warn",
		correct: "correct",
		confirm: "confirm"
	},
	_getTitle: function(a) {
		return $.regional.alertMsg.title[a]
	},
	_keydownOk: function(a) {
		return a.keyCode == DWZ.keyCode.ENTER && a.data.target.trigger("click"), !1
	},
	_keydownEsc: function(a) {
		a.keyCode == DWZ.keyCode.ESC && a.data.target.trigger("click")
	},
	_open: function(a, b, c) {
		$(this._boxId).remove();
		var d = "";
		if (c)
			for (var e = 0; e < c.length; e++) {
				var f = c[e].call ? "callback" : "";
				d += DWZ.frag.alertButFrag.replace("#butMsg#", c[e].name).replace("#callback#", f)
			}
		var g = DWZ.frag.alertBoxFrag.replace("#type#", a).replace("#title#", this._getTitle(a)).replace("#message#", b).replace("#butFragment#", d);
		$(g).appendTo("body").css({
			top: -$(this._boxId).height() + "px"
		}).animate({
			top: "40%"
		}, 500), this._closeTimer && (clearTimeout(this._closeTimer), this._closeTimer = null), this._types.info == a || this._types.correct == a ? this._closeTimer = setTimeout(function() {
			alertMsg.close()
		}, 3500) : $(this._bgId).show();
		for (var h = $(this._boxId).find("a.button"), i = h.filter("[rel=callback]"), j = $(document), e = 0; e < c.length; e++) c[e].call && i.eq(e).click(c[e].call), c[e].keyCode == DWZ.keyCode.ENTER && j.bind("keydown", {
			target: h.eq(e)
		}, this._keydownOk), c[e].keyCode == DWZ.keyCode.ESC && j.bind("keydown", {
			target: h.eq(e)
		}, this._keydownEsc)
	},
	close: function() {
		$(document).unbind("keydown", this._keydownOk).unbind("keydown", this._keydownEsc), $(this._boxId).animate({
			top: -$(this._boxId).height()
		}, 500, function() {
			$(this).remove()
		}), $(this._bgId).hide()
	},
	error: function(a, b) {
		this._alert(this._types.error, a, b)
	},
	info: function(a, b) {
		this._alert(this._types.info, a, b)
	},
	warn: function(a, b) {
		this._alert(this._types.warn, a, b)
	},
	correct: function(a, b) {
		this._alert(this._types.correct, a, b)
	},
	_alert: function(a, b, c) {
		var d = {
			okName: $.regional.alertMsg.butMsg.ok,
			okCall: null
		};
		$.extend(d, c);
		var e = [{
			name: d.okName,
			call: d.okCall,
			keyCode: DWZ.keyCode.ENTER
		}];
		this._open(a, b, e)
	},
	confirm: function(a, b) {
		var c = {
			okName: $.regional.alertMsg.butMsg.ok,
			okCall: null,
			cancelName: $.regional.alertMsg.butMsg.cancel,
			cancelCall: null
		};
		$.extend(c, b);
		var d = [{
			name: c.okName,
			call: c.okCall,
			keyCode: DWZ.keyCode.ENTER
		}, {
			name: c.cancelName,
			call: c.cancelCall,
			keyCode: DWZ.keyCode.ESC
		}];
		this._open(this._types.confirm, a, d)
	}
};
! function(a) {
	function e(e, g, h) {
		var j = d[e],
			k = a(DWZ.frag[j.id]);
		k.find("li").hoverClass(), b.html(k), a.each(j.bindings, function(c, d) {
			a("[rel='" + c + "']", b).bind("click", function() {
				f(), d(a(g), a("#" + j.id))
			})
		});
		var l = h.pageX,
			m = h.pageY;
		a(window).width() < l + b.width() && (l -= b.width()), a(window).height() < m + b.height() && (m -= b.height()), b.css({
			left: l,
			top: m
		}).show(), j.shadow && c.css({
			width: b.width(),
			height: b.height(),
			left: l + 3,
			top: m + 3
		}).show(), a(document).one("click", f), a.isFunction(j.ctrSub) && j.ctrSub(a(g), a("#" + j.id))
	}

	function f() {
		b.hide(), c.hide()
	}
	var b, c, d;
	a.fn.extend({
		contextMenu: function(f, g) {
			var h = a.extend({
				shadow: !0,
				bindings: {},
				ctrSub: null
			}, g);
			b || (b = a('<div id="contextmenu"></div>').appendTo("body").hide()), c || (c = a('<div id="contextmenuShadow"></div>').appendTo("body").hide()), d = d || [], d.push({
				id: f,
				shadow: h.shadow,
				bindings: h.bindings || {},
				ctrSub: h.ctrSub
			});
			var i = d.length - 1;
			return a(this).bind("contextmenu", function(a) {
				return e(i, this, a, h), !1
			}), this
		}
	})
}(jQuery);
var navTab = {
	componentBox: null,
	_tabBox: null,
	_prevBut: null,
	_nextBut: null,
	_panelBox: null,
	_moreBut: null,
	_moreBox: null,
	_currentIndex: 0,
	_op: {
		id: "navTab",
		stTabBox: ".navTab-tab",
		stPanelBox: ".navTab-panel",
		mainTabId: "main",
		close$: "a.close",
		prevClass: "tabsLeft",
		nextClass: "tabsRight",
		stMore: ".tabsMore",
		stMoreLi: "ul.tabsMoreList"
	},
	init: function(a) {
		$.History && $.History.init("#container");
		var b = this;
		$.extend(this._op, a), this.componentBox = $("#" + this._op.id), this._tabBox = this.componentBox.find(this._op.stTabBox), this._panelBox = this.componentBox.find(this._op.stPanelBox), this._prevBut = this.componentBox.find("." + this._op.prevClass), this._nextBut = this.componentBox.find("." + this._op.nextClass), this._moreBut = this.componentBox.find(this._op.stMore), this._moreBox = this.componentBox.find(this._op.stMoreLi), this._prevBut.click(function() {
			b._scrollPrev()
		}), this._nextBut.click(function() {
			b._scrollNext()
		}), this._moreBut.click(function() {
			return b._moreBox.show(), !1
		}), $(document).click(function() {
			b._moreBox.hide()
		}), this._contextmenu(this._tabBox), this._contextmenu(this._getTabs()), this._init(), this._ctrlScrollBut()
	},
	_init: function() {
		var a = this;
		this._getTabs().each(function(b) {
			$(this).unbind("click").click(function() {
				a._switchTab(b)
			}), $(this).find(navTab._op.close$).unbind("click").click(function() {
				a._closeTab(b)
			})
		}), this._getMoreLi().each(function(b) {
			$(this).find(">a").unbind("click").click(function() {
				a._switchTab(b)
			})
		}), this._switchTab(this._currentIndex)
	},
	_contextmenu: function(a) {
		var b = this;
		a.contextMenu("navTabCM", {
			bindings: {
				reload: function(a) {
					b._reload(a, !0)
				},
				closeCurrent: function(a) {
					var d = a.attr("tabid");
					d ? b.closeTab(d) : b.closeCurrentTab()
				},
				closeOther: function(a) {
					var d = b._indexTabId(a.attr("tabid"));
					b._closeOtherTab(d > 0 ? d : b._currentIndex)
				},
				closeAll: function() {
					b.closeAllTab()
				}
			},
			ctrSub: function(a, c) {
				var d = c.find("[rel='reload']"),
					e = c.find("[rel='closeCurrent']"),
					f = c.find("[rel='closeOther']"),
					g = c.find("[rel='closeAll']"),
					h = b._getTabs();
				h.size() < 2 && (e.addClass("disabled"), f.addClass("disabled"), g.addClass("disabled")), 0 == b._currentIndex || a.attr("tabid") == b._op.mainTabId ? (e.addClass("disabled"), d.addClass("disabled")) : 2 == h.size() && f.addClass("disabled")
			}
		})
	},
	_getTabs: function() {
		return this._tabBox.find("> li")
	},
	_getPanels: function() {
		return this._panelBox.find("> div")
	},
	_getMoreLi: function() {
		return this._moreBox.find("> li")
	},
	_getTab: function(a) {
		var b = this._indexTabId(a);
		return b >= 0 ? this._getTabs().eq(b) : void 0
	},
	getPanel: function(a) {
		var b = this._indexTabId(a);
		return b >= 0 ? this._getPanels().eq(b) : void 0
	},
	_getTabsW: function(a, b) {
		return this._tabsW(this._getTabs().slice(a, b))
	},
	_tabsW: function(a) {
		var b = 0;
		return a.each(function() {
			b += $(this).outerWidth(!0)
		}), b
	},
	_indexTabId: function(a) {
		if (!a) return -1;
		var b = -1;
		return this._getTabs().each(function(c) {
			return $(this).attr("tabid") == a ? (b = c, void 0) : void 0
		}), b
	},
	_getLeft: function() {
		return this._tabBox.position().left
	},
	_getScrollBarW: function() {
		return this.componentBox.width() - 55
	},
	_visibleStart: function() {
		for (var a = this._getLeft(), b = 0, c = this._getTabs(), d = 0; d < c.size(); d++) {
			if (b + a >= 0) return d;
			b += c.eq(d).outerWidth(!0)
		}
		return 0
	},
	_visibleEnd: function() {
		for (var a = this._getLeft(), b = 0, c = this._getTabs(), d = 0; d < c.size(); d++)
			if (b += c.eq(d).outerWidth(!0), b + a > this._getScrollBarW()) return d;
		return c.size()
	},
	_scrollPrev: function() {
		var a = this._visibleStart();
		a > 0 && this._scrollTab(-this._getTabsW(0, a - 1))
	},
	_scrollNext: function() {
		var a = this._visibleEnd();
		a < this._getTabs().size() && this._scrollTab(-this._getTabsW(0, a + 1) + this._getScrollBarW())
	},
	_scrollTab: function(a) {
		var c = this;
		this._tabBox.animate({
			left: a + "px"
		}, 200, function() {
			c._ctrlScrollBut()
		})
	},
	_scrollCurrent: function() {
		var a = this._tabsW(this._getTabs());
		a <= this._getScrollBarW() ? this._scrollTab(0) : this._getLeft() < this._getScrollBarW() - a ? this._scrollTab(this._getScrollBarW() - a) : this._currentIndex < this._visibleStart() ? this._scrollTab(-this._getTabsW(0, this._currentIndex)) : this._currentIndex >= this._visibleEnd() && this._scrollTab(this._getScrollBarW() - this._getTabs().eq(this._currentIndex).outerWidth(!0) - this._getTabsW(0, this._currentIndex))
	},
	_ctrlScrollBut: function() {
		var a = this._tabsW(this._getTabs());
		this._getScrollBarW() > a ? (this._prevBut.hide(), this._nextBut.hide(), this._tabBox.parent().removeClass("tabsPageHeaderMargin")) : (this._prevBut.show().removeClass("tabsLeftDisabled"), this._nextBut.show().removeClass("tabsRightDisabled"), this._tabBox.parent().addClass("tabsPageHeaderMargin"), this._getLeft() >= 0 ? this._prevBut.addClass("tabsLeftDisabled") : this._getLeft() <= this._getScrollBarW() - a && this._nextBut.addClass("tabsRightDisabled"))
	},
	_switchTab: function(a) {
		var b = this._getTabs().removeClass("selected").eq(a).addClass("selected");
		this._getPanels().hide().eq(a).show(), this._getMoreLi().removeClass("selected").eq(a).addClass("selected"), this._currentIndex = a, this._scrollCurrent(), this._reload(b)
	},
	_closeTab: function(a, b) {
		if (this._getTabs().eq(a).remove(), this._getPanels().eq(a).trigger(DWZ.eventType.pageClear).remove(), this._getMoreLi().eq(a).remove(), this._currentIndex >= a && this._currentIndex--, b) {
			var c = this._indexTabId(b);
			c > 0 && (this._currentIndex = c)
		}
		this._init(), this._scrollCurrent(), this._reload(this._getTabs().eq(this._currentIndex))
	},
	closeTab: function(a) {
		var b = this._indexTabId(a);
		b > 0 && this._closeTab(b)
	},
	closeCurrentTab: function(a) {
		this._currentIndex > 0 && this._closeTab(this._currentIndex, a)
	},
	closeAllTab: function() {
		this._getTabs().filter(":gt(0)").remove(), this._getPanels().filter(":gt(0)").trigger(DWZ.eventType.pageClear).remove(), this._getMoreLi().filter(":gt(0)").remove(), this._currentIndex = 0, this._init(), this._scrollCurrent()
	},
	_closeOtherTab: function(a) {
		if (a = a || this._currentIndex, a > 0) {
			var b = ":eq(" + a + ")";
			this._getTabs().not(b).filter(":gt(0)").remove(), this._getPanels().not(b).filter(":gt(0)").trigger(DWZ.eventType.pageClear).remove(), this._getMoreLi().not(b).filter(":gt(0)").remove(), this._currentIndex = 1, this._init(), this._scrollCurrent()
		} else this.closeAllTab()
	},
	_loadUrlCallback: function(a) {
		a.find("[layoutH]").layoutH(), a.find(":button.close").click(function() {
			navTab.closeCurrentTab()
		})
	},
	_reload: function(a, b) {
		b = b || a.data("reloadFlag");
		var c = a.attr("url");
		if (b && c) {
			a.data("reloadFlag", null);
			var d = this.getPanel(a.attr("tabid"));
			if (a.hasClass("external")) navTab.openExternal(c, d);
			else {
				var e = $("#pagerForm", d),
					f = e.size() > 0 ? e.serializeArray() : {};
				d.loadUrl(c, f, function() {
					navTab._loadUrlCallback(d)
				})
			}
		}
	},
	reloadFlag: function(a) {
		var b = this._getTab(a);
		b && (this._indexTabId(a) == this._currentIndex ? this._reload(b, !0) : b.data("reloadFlag", 1))
	},
	reload: function(a, b) {
		var c = $.extend({
				data: {},
				navTabId: "",
				callback: null
			}, b),
			d = c.navTabId ? this._getTab(c.navTabId) : this._getTabs().eq(this._currentIndex),
			e = c.navTabId ? this.getPanel(c.navTabId) : this._getPanels().eq(this._currentIndex);
		if (e && (a || (a = d.attr("url")), a))
			if (d.hasClass("external")) navTab.openExternal(a, e);
			else {
				if ($.isEmptyObject(c.data)) {
					var f = $("#pagerForm", e);
					c.data = f.size() > 0 ? f.serializeArray() : {}
				}
				e.ajaxUrl({
					type: "POST",
					url: a,
					data: c.data,
					callback: function(a) {
						navTab._loadUrlCallback(e), $.isFunction(c.callback) && c.callback(a)
					}
				})
			}
	},
	getCurrentPanel: function() {
		return this._getPanels().eq(this._currentIndex)
	},
	checkTimeout: function() {
		var a = DWZ.jsonEval(this.getCurrentPanel().html());
		a && a.statusCode == DWZ.statusCode.timeout && this.closeCurrentTab()
	},
	forbidden: function() {
		var a = DWZ.jsonEval(this.getCurrentPanel().html());
		a && a.statusCode == DWZ.statusCode.forbidden && this.closeCurrentTab()
	},
	openExternal: function(a, b) {
		var c = navTab._panelBox.height();
		b.html(DWZ.frag.externalFrag.replaceAll("{url}", a).replaceAll("{height}", c + "px"))
	},
	openTab: function(a, b, c) {
		if ("#" != b) {
			var d = $.extend({
					title: "New Tab",
					data: {},
					fresh: !0,
					external: !1
				}, c),
				e = this._indexTabId(a);
			if (e >= 0) {
				var f = this._getTabs().eq(e);
				d.data.pTabid && f.attr("pTabid", d.data.pTabid);
				var g = f.attr("tabid") == this._op.mainTabId ? "> span > span" : "> span";
				f.find(">a").attr("title", d.title).find(g).text(d.title);
				var h = this._getPanels().eq(e);
				(d.fresh || f.attr("url") != b) && (f.attr("url", b), d.external || b.isExternalUrl() ? (f.addClass("external"), navTab.openExternal(b, h)) : (f.removeClass("external"), h.ajaxUrl({
					type: "GET",
					url: b,
					data: d.data,
					callback: function() {
						navTab._loadUrlCallback(h)
					}
				}))), this._currentIndex = e
			} else {
				var i = '<li tabid="#tabid#"#pTabid#><a href="javascript:" title="#title#" class="#tabid#"><span>#title#</span></a><a href="javascript:;" class="close">close</a></li>';
				d.data.pTabid ? this._tabBox.append(i.replaceAll("#tabid#", a).replaceAll("#title#", d.title).replaceAll("#pTabid#", ' pTabid="' + d.data.pTabid + '"')) : this._tabBox.append(i.replaceAll("#tabid#", a).replaceAll("#title#", d.title).replaceAll("#pTabid#", "")), this._panelBox.append('<div class="page unitBox"></div>'), this._moreBox.append('<li><a href="javascript:" title="#title#">#title#</a></li>'.replaceAll("#title#", d.title));
				var j = this._getTabs(),
					f = j.filter(":last"),
					h = this._getPanels().filter(":last");
				d.external || b.isExternalUrl() ? (f.addClass("external"), navTab.openExternal(b, h)) : (f.removeClass("external"), h.ajaxUrl({
					type: "GET",
					url: b,
					data: d.data,
					callback: function() {
						navTab._loadUrlCallback(h)
					}
				})), $.History && setTimeout(function() {
					$.History.addHistory(a, function(a) {
						var b = navTab._indexTabId(a);
						b >= 0 && navTab._switchTab(b)
					}, a)
				}, 10), this._currentIndex = j.size() - 1, this._contextmenu(j.filter(":last").hoverClass("hover"))
			}
			this._init(), this._scrollCurrent(), this._getTabs().eq(this._currentIndex).attr("url", b)
		}
	},
	getCurrentNavTab: function() {
		return this._tabBox.find("li[class='selected']")
	}
};
! function(a) {
	a.fn.extend({
		tabs: function(b) {
			function d(b) {
				var f = b.add(a("> *", b)),
					g = a(c.stTabHeader, f),
					h = a(c.stTab + " li", g),
					i = a(c.stTabPanel + " > *", f);
				h.unbind().find("a").unbind(), g.find("." + c.prevClass).unbind(), g.find("." + c.nextClass).unbind(), h.each(function(f) {
					c.currentIndex == f ? a(this).addClass("selected") : a(this).removeClass("selected"), "hover" == c.eventType ? a(this).hover(function() {
						e(b, f)
					}) : a(this).click(function() {
						e(b, f)
					}), a("a", this).each(function() {
						a(this).hasClass(c.ajaxClass) ? a(this).click(function(a) {
							var b = i.eq(f);
							this.href && !b.attr("loaded") && b.loadUrl(this.href, {}, function() {
								b.find("[layoutH]").layoutH(), b.attr("loaded", !0)
							}), a.preventDefault()
						}) : a(this).hasClass(c.closeClass) && a(this).click(function() {
							return h.eq(f).remove(), i.eq(f).remove(), f == c.currentIndex ? c.currentIndex = f + 1 < h.size() ? f : f - 1 : f < c.currentIndex && (c.currentIndex = f), d(b), !1
						})
					})
				}), e(b, c.currentIndex)
			}

			function e(b, d) {
				var e = b.add(a("> *", b)),
					f = a(c.stTabHeader, e),
					g = a(c.stTab + " li", f),
					h = a(c.stTabPanel + " > *", e),
					i = g.eq(d),
					j = h.eq(d);
				c.reverse && i.hasClass("selected") ? (g.removeClass("selected"), h.hide()) : (c.currentIndex = d, g.removeClass("selected"), i.addClass("selected"), h.hide().eq(c.currentIndex).show()), j.attr("inited") || j.attr("inited", 1e3).find("input[type=text]").filter("[alt]").inputAlert()
			}
			var c = a.extend({
				reverse: !1,
				eventType: "click",
				currentIndex: 0,
				stTabHeader: "> .tabsHeader",
				stTab: ">.tabsHeaderContent>ul",
				stTabPanel: "> .tabsContent",
				ajaxClass: "j-ajax",
				closeClass: "close",
				prevClass: "tabsLeft",
				nextClass: "tabsRight"
			}, b);
			return this.each(function() {
				d(a(this))
			})
		}
	})
}(jQuery),
function(a) {
	a.fn.extend({
		jresize: function(b) {
			return "string" == typeof b && "destroy" == b ? this.each(function() {
				var b = this;
				a("div[class^='resizable']", b).each(function() {
					a(this).hide()
				})
			}) : this.each(function() {
				var b = a(this),
					c = a(".resizable");
				a("div[class^='resizable']", b).each(function() {
					var d = this;
					a(d).mousedown(function(e) {
						return a.pdialog.switchDialog(b), a.resizeTool.start(c, b, e, a(d).attr("tar")), !1
					}).show()
				})
			})
		}
	}), a.resizeTool = {
		start: function(b, c, d, e) {
			a.pdialog.initResize(b, c, e), a.data(b[0], "layer-drag", {
				options: a.extend(a.pdialog._op, {
					target: e,
					dialog: c,
					stop: a.resizeTool.stop
				})
			}), a.layerdrag.start(b[0], d, a.pdialog._op)
		},
		stop: function() {
			var b = a.data(arguments[0], "layer-drag");
			a.pdialog.resizeDialog(arguments[0], b.options.dialog, b.options.target), a("body").css("cursor", ""), a(arguments[0]).hide()
		}
	}, a.layerdrag = {
		start: function(b, c) {
			return a.layerdrag.current || (a.layerdrag.current = {
				el: b,
				oleft: parseInt(b.style.left) || 0,
				owidth: parseInt(b.style.width) || 0,
				otop: parseInt(b.style.top) || 0,
				oheight: parseInt(b.style.height) || 0,
				ox: c.pageX || c.screenX,
				oy: c.pageY || c.clientY
			}, a(document).bind("mouseup", a.layerdrag.stop), a(document).bind("mousemove", a.layerdrag.drag)), a.layerdrag.preventEvent(c)
		},
		drag: function(b) {
			if (!b) var b = window.event;
			var c = a.layerdrag.current,
				d = a.data(c.el, "layer-drag"),
				e = (b.pageX || b.screenX) - c.ox,
				f = (b.pageY || b.clientY) - c.oy;
			if ((b.pageY || b.clientY) <= 0 || (b.pageY || b.clientY) >= a(window).height() - a(".dialogHeader", a(d.options.dialog)).outerHeight()) return !1;
			var g = d.options.target,
				h = c.owidth,
				i = c.oheight;
			return "n" != g && "s" != g && (h += g.indexOf("w") >= 0 ? -e : e), h >= a.pdialog._op.minW && (g.indexOf("w") >= 0 && (c.el.style.left = c.oleft + e + "px"), "n" != g && "s" != g && (c.el.style.width = h + "px")), "w" != g && "e" != g && (i += g.indexOf("n") >= 0 ? -f : f), i >= a.pdialog._op.minH && (g.indexOf("n") >= 0 && (c.el.style.top = c.otop + f + "px"), "w" != g && "e" != g && (c.el.style.height = i + "px")), a.layerdrag.preventEvent(b)
		},
		stop: function(b) {
			var c = a.layerdrag.current,
				d = a.data(c.el, "layer-drag");
			return a(document).unbind("mousemove", a.layerdrag.drag), a(document).unbind("mouseup", a.layerdrag.stop), d.options.stop && d.options.stop.apply(c.el, [c.el]), a.layerdrag.current = null, a.layerdrag.preventEvent(b)
		},
		preventEvent: function(a) {
			return a.stopPropagation && a.stopPropagation(), a.preventDefault && a.preventDefault(), !1
		}
	}
}(jQuery),
function(a) {
	a.pdialog = {
		_op: {
			height: 300,
			width: 580,
			minH: 40,
			minW: 50,
			total: 20,
			max: !1,
			mask: !1,
			resizable: !0,
			drawable: !0,
			maxable: !0,
			minable: !0,
			fresh: !0
		},
		_current: null,
		_zIndex: 42,
		getCurrent: function() {
			return this._current
		},
		reload: function(b, c) {
			var d = a.extend({
					data: {},
					dialogId: "",
					callback: null
				}, c),
				e = d.dialogId && a("body").data(d.dialogId) || this._current;
			if (e) {
				var f = e.find(".dialogContent");
				f.ajaxUrl({
					type: "POST",
					url: b,
					data: d.data,
					callback: function(b) {
						f.find("[layoutH]").layoutH(f), a(".pageContent", e).width(a(e).width() - 14), a(":button.close", e).click(function() {
							return a.pdialog.close(e), !1
						}), a.isFunction(d.callback) && d.callback(b)
					}
				})
			}
		},
		open: function(b, c, d, e) {
			var f = a.extend({}, a.pdialog._op, e),
				g = a("body").data(c);
			if (g) {
				if (g.is(":hidden") && g.show(), f.fresh || b != a(g).data("url")) {
					g.data("url", b), g.find(".dialogHeader").find("h1").html(d), this.switchDialog(g);
					var h = g.find(".dialogContent");
					h.loadUrl(b, {}, function() {
						h.find("[layoutH]").layoutH(h), a(".pageContent", g).width(a(g).width() - 14), a("button.close").click(function() {
							return a.pdialog.close(g), !1
						})
					})
				}
			} else {
				a("body").append(DWZ.frag.dialogFrag), g = a(">.dialog:last-child", "body"), g.data("id", c), g.data("url", b), e.close && g.data("close", e.close), e.param && g.data("param", e.param), a.fn.bgiframe && g.bgiframe(), g.find(".dialogHeader").find("h1").html(d), a(g).css("zIndex", a.pdialog._zIndex += 2), a("div.shadow").css("zIndex", a.pdialog._zIndex - 3).show(), a.pdialog._init(g, e), a(g).click(function() {
					a.pdialog.switchDialog(g)
				}), f.resizable && g.jresize(), f.drawable && g.dialogDrag(), a("a.close", g).click(function() {
					return a.pdialog.close(g), !1
				}), f.maxable ? a("a.maximize", g).show().click(function() {
					return a.pdialog.switchDialog(g), a.pdialog.maxsize(g), g.jresize("destroy").dialogDrag("destroy"), !1
				}) : a("a.maximize", g).hide(), a("a.restore", g).click(function() {
					return a.pdialog.restore(g), g.jresize().dialogDrag(), !1
				}), f.minable ? a("a.minimize", g).show().click(function() {
					return a.pdialog.minimize(g), !1
				}) : a("a.minimize", g).hide(), a("div.dialogHeader a", g).mousedown(function() {
					return !1
				}), a("div.dialogHeader", g).dblclick(function() {
					a("a.restore", g).is(":hidden") ? a("a.maximize", g).trigger("click") : a("a.restore", g).trigger("click")
				}), f.max && (a.pdialog.maxsize(g), g.jresize("destroy").dialogDrag("destroy")), a("body").data(c, g), a.pdialog._current = g, a.pdialog.attachShadow(g);
				var h = a(".dialogContent", g);
				h.loadUrl(b, {}, function() {
					h.find("[layoutH]").layoutH(h), a(".pageContent", g).width(a(g).width() - 14), a("button.close").click(function() {
						return a.pdialog.close(g), !1
					})
				})
			}
			f.mask ? (a(g).css("zIndex", 1e3), a("a.minimize", g).hide(), a(g).data("mask", !0), a("#dialogBackground").show()) : f.minable && a.taskBar.addDialog(c, d)
		},
		switchDialog: function(b) {
			var c = a(b).css("zIndex");
			if (a.pdialog.attachShadow(b), a.pdialog._current) {
				var d = a(a.pdialog._current).css("zIndex");
				a(a.pdialog._current).css("zIndex", c), a(b).css("zIndex", d), a("div.shadow").css("zIndex", d - 1), a.pdialog._current = b
			}
			a.taskBar.switchTask(b.data("id"))
		},
		attachShadow: function(b) {
			var c = a("div.shadow");
			c.is(":hidden") && c.show(), c.css({
				top: parseInt(a(b)[0].style.top) - 2,
				left: parseInt(a(b)[0].style.left) - 4,
				height: parseInt(a(b).height()) + 8,
				width: parseInt(a(b).width()) + 8,
				zIndex: parseInt(a(b).css("zIndex")) - 1
			}), a(".shadow_c", c).children().andSelf().each(function() {
				a(this).css("height", a(b).outerHeight() - 4)
			})
		},
		_init: function(b, c) {
			var d = a.extend({}, this._op, c),
				e = d.height > d.minH ? d.height : d.minH,
				f = d.width > d.minW ? d.width : d.minW;
			(isNaN(b.height()) || b.height() < e) && (a(b).height(e + "px"), a(".dialogContent", b).height(e - a(".dialogHeader", b).outerHeight() - a(".dialogFooter", b).outerHeight() - 6)), (isNaN(b.css("width")) || b.width() < f) && a(b).width(f + "px");
			var g = (a(window).height() - b.height()) / 2;
			b.css({
				left: (a(window).width() - b.width()) / 2,
				top: g > 0 ? g : 0
			})
		},
		initResize: function(b, c, d) {
			a("body").css("cursor", d + "-resize"), b.css({
				top: a(c).css("top"),
				left: a(c).css("left"),
				height: a(c).css("height"),
				width: a(c).css("width")
			}), b.show()
		},
		repaint: function(b, c) {
			var d = a("div.shadow");
			"w" != b && "e" != b && (d.css("height", d.outerHeight() + c.tmove), a(".shadow_c", d).children().andSelf().each(function() {
				a(this).css("height", a(this).outerHeight() + c.tmove)
			})), ("n" == b || "nw" == b || "ne" == b) && d.css("top", c.otop - 2), !c.owidth || "n" == b && "s" == b || d.css("width", c.owidth + 8), b.indexOf("w") >= 0 && d.css("left", c.oleft - 4)
		},
		resizeTool: function(b, c, d) {
			a("div[class^='resizable']", d).filter(function() {
				return "w" == a(this).attr("tar") || "e" == a(this).attr("tar")
			}).each(function() {
				a(this).css("height", a(this).outerHeight() + c)
			})
		},
		resizeDialog: function(b, c, d) {
			var e = parseInt(b.style.left),
				f = parseInt(b.style.top),
				g = parseInt(b.style.height),
				h = parseInt(b.style.width);
			if (tmove = "n" == d || "nw" == d ? parseInt(a(c).css("top")) - f : g - parseInt(a(c).css("height")), a(c).css({
				left: e,
				width: h,
				top: f,
				height: g
			}), a(".dialogContent", c).css("width", h - 12 + "px"), a(".pageContent", c).css("width", h - 14 + "px"), "w" != d && "e" != d) {
				var i = a(".dialogContent", c);
				i.css({
					height: g - a(".dialogHeader", c).outerHeight() - a(".dialogFooter", c).outerHeight() - 6
				}), i.find("[layoutH]").layoutH(i), a.pdialog.resizeTool(d, tmove, c)
			}
			a.pdialog.repaint(d, {
				oleft: e,
				otop: f,
				tmove: tmove,
				owidth: h
			}), a(window).trigger(DWZ.eventType.resizeGrid)
		},
		close: function(b) {
			"string" == typeof b && (b = a("body").data(b));
			var c = b.data("close"),
				d = !0;
			if (c && a.isFunction(c)) {
				var e = b.data("param");
				if (e && "" != e ? (e = DWZ.jsonEval(e), d = c(e)) : d = c(), !d) return
			}
			a(b).hide(), a("div.shadow").hide(), a(b).data("mask") ? a("#dialogBackground").hide() : a(b).data("id") && a.taskBar.closeDialog(a(b).data("id")), a("body").removeData(a(b).data("id")), a(b).trigger(DWZ.eventType.pageClear).remove()
		},
		closeCurrent: function() {
			this.close(a.pdialog._current)
		},
		checkTimeout: function() {
			var b = a(".dialogContent", a.pdialog._current),
				c = DWZ.jsonEval(b.html());
			c && c.statusCode == DWZ.statusCode.timeout && this.closeCurrent()
		},
		forbidden: function() {
			var b = a(".dialogContent", a.pdialog._current),
				c = DWZ.jsonEval(b.html());
			c && c.statusCode == DWZ.statusCode.forbidden && this.closeCurrent()
		},
		maxsize: function(b) {
			a(b).data("original", {
				top: a(b).css("top"),
				left: a(b).css("left"),
				width: a(b).css("width"),
				height: a(b).css("height")
			}), a("a.maximize", b).hide(), a("a.restore", b).show();
			var c = a(window).width(),
				d = a(window).height() - 34;
			a(b).css({
				top: "0px",
				left: "0px",
				width: c + "px",
				height: d + "px"
			}), a.pdialog._resizeContent(b, c, d)
		},
		restore: function(b) {
			var c = a(b).data("original"),
				d = parseInt(c.width),
				e = parseInt(c.height);
			a(b).css({
				top: c.top,
				left: c.left,
				width: d,
				height: e
			}), a.pdialog._resizeContent(b, d, e), a("a.maximize", b).show(), a("a.restore", b).hide(), a.pdialog.attachShadow(b)
		},
		minimize: function(b) {
			a(b).hide(), a("div.shadow").hide();
			var c = a.taskBar.getTask(a(b).data("id"));
			a(".resizable").css({
				top: a(b).css("top"),
				left: a(b).css("left"),
				height: a(b).css("height"),
				width: a(b).css("width")
			}).show().animate({
				top: a(window).height() - 60,
				left: c.position().left,
				width: c.outerWidth(),
				height: c.outerHeight()
			}, 250, function() {
				a(this).hide(), a.taskBar.inactive(a(b).data("id"))
			})
		},
		_resizeContent: function(b, c, d) {
			var e = a(".dialogContent", b);
			e.css({
				width: c - 12 + "px",
				height: d - a(".dialogHeader", b).outerHeight() - a(".dialogFooter", b).outerHeight() - 6
			}), e.find("[layoutH]").layoutH(e), a(".pageContent", b).css("width", c - 14 + "px"), a(window).trigger(DWZ.eventType.resizeGrid)
		}
	}
}(jQuery),
function(a) {
	a.fn.dialogDrag = function(b) {
		return "string" == typeof b && "destroy" == b ? this.each(function() {
			var b = this;
			a("div.dialogHeader", b).unbind("mousedown")
		}) : this.each(function() {
			var b = a(this);
			a("div.dialogHeader", b).mousedown(function(c) {
				return a.pdialog.switchDialog(b), b.data("task", !0), setTimeout(function() {
					b.data("task") && a.dialogDrag.start(b, c)
				}, 100), !1
			}).mouseup(function() {
				return b.data("task", !1), !1
			})
		})
	}, a.dialogDrag = {
		currId: null,
		_init: function(b) {
			this.currId = (new Date).getTime();
			var c = a("#dialogProxy");
			c.size() || (c = a(DWZ.frag.dialogProxy), a("body").append(c)), a("h1", c).html(a(".dialogHeader h1", b).text())
		},
		start: function(b, c) {
			this._init(b);
			var d = a("#dialogProxy");
			return d.css({
				left: b.css("left"),
				top: b.css("top"),
				height: b.css("height"),
				width: b.css("width"),
				zIndex: parseInt(b.css("zIndex")) + 1
			}).show(), a("div.dialogContent", d).css("height", a("div.dialogContent", b).css("height")), d.data("dialog", b), b.css({
				left: "-10000px",
				top: "-10000px"
			}), a(".shadow").hide(), a(d).jDrag({
				selector: ".dialogHeader",
				stop: this.stop,
				event: c
			}), !1
		},
		stop: function() {
			var b = a(arguments[0]),
				c = b.data("dialog");
			a(c).css({
				left: a(b).css("left"),
				top: a(b).css("top")
			}), a.pdialog.attachShadow(c), a(b).hide()
		}
	}
}(jQuery),
function(a) {
	var b = {
			cursor: "move",
			sortBoxs: "div.sortDrag",
			replace: !1,
			items: "> *",
			selector: "",
			zIndex: 1e3
		},
		c = {
			start: function(a, b, c, d) {
				var e = this._createPlaceholder(b),
					f = b.clone(),
					g = b.position();
				return f.data("$sortBox", a).data("op", d).data("$item", b).data("$placeholder", e), f.addClass("sortDragHelper").css({
					position: "absolute",
					top: g.top + a.scrollTop(),
					left: g.left,
					zIndex: d.zIndex,
					width: b.width() + "px",
					height: b.height() + "px"
				}).jDrag({
					selector: d.selector,
					drag: this.drag,
					stop: this.stop,
					event: c
				}), b.before(e).before(f).hide(), !1
			},
			drag: function() {
				var b = a(arguments[0]),
					d = b.data("$sortBox"),
					e = b.data("$placeholder"),
					f = d.find(b.data("op").items).filter(":visible").filter(":not(.sortDragPlaceholder, .sortDragHelper)"),
					g = b.position();
				f.eq(0).position();
				var i = c._getOverSortBox(b);
				if (i.length > 0 && i[0] != d[0]) e.appendTo(i), b.data("$sortBox", i);
				else
					for (var j = 0; j < f.length; j++) {
						var k = f.eq(j),
							l = k.position();
						if (g.top > l.top + 10) k.after(e);
						else if (g.top <= l.top) {
							k.before(e);
							break
						}
					}
			},
			stop: function() {
				var c = a(arguments[0]),
					d = c.data("$sortBox"),
					e = c.data("$item"),
					f = c.data("$placeholder"),
					g = f.position();
				c.animate({
					top: g.top + d.scrollTop() + "px",
					left: g.left + "px"
				}, {
					complete: function() {
						c.data("op").replace && ($srcBox = e.parents(b.sortBoxs + ":first"), $destBox = f.parents(b.sortBoxs + ":first"), $srcBox[0] != $destBox[0] && ($replaceItem = f.next(), $replaceItem.size() > 0 && $replaceItem.insertAfter(e))), e.insertAfter(f).show(), f.remove(), c.remove()
					},
					duration: 300
				})
			},
			_createPlaceholder: function(b) {
				return a("<" + b[0].nodeName + ' class="sortDragPlaceholder"/>').css({
					width: b.outerWidth() + "px",
					height: b.outerHeight() + "px",
					marginTop: b.css("marginTop"),
					marginRight: b.css("marginRight"),
					marginBottom: b.css("marginBottom"),
					marginLeft: b.css("marginLeft")
				})
			},
			_getOverSortBox: function(c) {
				var d = c.position(),
					e = d.top + c.height() / 2,
					f = d.left + c.width() / 2;
				return a(b.sortBoxs).filter(":visible").filter(function() {
					var b = a(this),
						c = b.position();
					return DWZ.isOver(e, f, c.top, c.left, b.height(), b.width())
				})
			}
		};
	a.fn.sortDrag = function(d) {
		return this.each(function() {
			var e = a.extend({}, b, d),
				f = a(this);
			f.attr("selector") && (e.selector = f.attr("selector")), f.find(e.items).each(function() {
				var d = a(this),
					g = d;
				e.selector && (g = d.find(e.selector).css({
					cursor: e.cursor
				})), g.mousedown(function(a) {
					c.start(f, d, a, e), a.preventDefault()
				})
			})
		})
	}
}(jQuery),
function(a) {
	a.fn.extend({
		cssTable: function() {
			return this.each(function() {
				var b = a(this),
					c = b.find("tbody>tr"),
					d = b.parent(),
					e = b.hasClass("nowrap");
				c.hoverClass("hover").each(function(b) {
					var f = a(this);
					e || 1 != b % 2 || f.addClass("trbg"), f.click(function() {
						c.filter(".selected").removeClass("selected"), f.addClass("selected");
						var b = f.attr("target");
						b && (0 == a("#" + b, d).size() && d.prepend('<input id="' + b + '" type="hidden" />'), a("#" + b, d).val(f.attr("rel")))
					})
				}), b.find("thead [orderField]").orderBy({
					targetType: b.attr("targetType"),
					rel: b.attr("rel"),
					asc: b.attr("asc") || "asc",
					desc: b.attr("desc") || "desc"
				})
			})
		}
	})
}(jQuery),
function(a) {
	a.fn.jTable = function(b) {
		return this.each(function() {
			function x() {
				a("div.j-resizeGrid").each(function() {
					var b = a(this).innerWidth();
					b && a("div.gridScroller", this).width(b + "px")
				})
			}
			for (var c = a(this), d = c.attr("nowrapTD"), e = c.width(), f = [], g = c.parent().addClass("j-resizeGrid"), h = a(this).attr("layoutH"), i = c.find("thead>tr:last-child").find("th"), j = 0, k = i.size(); k > j; j++) {
				var l = a(i[j]),
					m = [],
					n = l.innerWidth() - 100 * l.innerWidth() / e - 2;
				m[0] = parseInt(n), m[1] = l.attr("align"), f[f.length] = m
			}
			a(this).wrap("<div class='grid'></div>");
			var o = c.parent().html(c.html()),
				p = o.find("thead");
			p.wrap("<div class='gridHeader'><div class='gridThead'><table style='width:" + (e - 20) + "px;'></table></div></div>");
			var q = a(">tr:last-child", p),
				r = a(">th", q);
			a("th", p).each(function() {
				var b = a(this);
				b.html("<div class='gridCol' title='" + b.text() + "'>" + b.html() + "</div>")
			}), r.each(function(b) {
				var c = a(this),
					d = f[b];
				c.addClass(d[1]).hoverClass("hover").removeAttr("align").removeAttr("width").width(d[0])
			}).filter("[orderField]").orderBy({
				targetType: c.attr("targetType"),
				rel: c.attr("rel"),
				asc: c.attr("asc") || "asc",
				desc: c.attr("desc") || "desc"
			});
			var s = o.find(">tbody"),
				t = h ? " layoutH='" + h + "'" : "";
			s.wrap("<div class='gridScroller'" + t + " style='width:" + g.width() + "px;'><div class='gridTbody'><table style='width:" + (e - 20) + "px;'></table></div></div>");
			var u = a(">tr:first-child", s),
				v = s.find(">tr");
			v.hoverClass().each(function() {
				for (var b = a(this), c = a(">td", this), e = 0; e < c.size(); e++) {
					var g = a(c[e]);
					"false" != d && g.html("<div>" + g.html() + "</div>"), e < f.length && g.addClass(f[e][1])
				}
				b.click(function() {
					v.filter(".selected").removeClass("selected"), b.addClass("selected");
					var c = b.attr("target");
					c && (0 == a("#" + c, o).size() && o.prepend('<input id="' + c + '" type="hidden" />'), a("#" + c, o).val(b.attr("rel")))
				})
			}), a(">td", u).each(function(b) {
				b < f.length && a(this).width(f[b][0])
			}), o.append("<div class='resizeMarker' style='height:300px; left:57px;display:none;'></div><div class='resizeProxy' style='height:300px; left:377px;display:none;'></div>");
			var w = a(".gridScroller", o);
			w.scroll(function() {
				var c = a(".gridThead", o);
				if (w.scrollLeft() > 0) {
					c.css("position", "relative");
					var d = w.scrollLeft();
					c.css("left", w.cssv("left") - d)
				}
				return 0 == w.scrollLeft() && (c.css("position", "relative"), c.css("left", "0px")), !1
			}), a(">tr", p).each(function() {
				a(">th", this).each(function() {
					var d = this,
						e = a(this);
					e.mouseover(function(c) {
						var f = a.jTableTool.getOffset(d, c).offsetX;
						return e.outerWidth() - f < 5 ? e.css("cursor", "col-resize").mousedown(function(c) {
							a(".resizeProxy", o).show().css({
								left: a.jTableTool.getRight(d) - a(".gridScroller", o).scrollLeft(),
								top: a.jTableTool.getTop(d),
								height: a.jTableTool.getHeight(d, o),
								cursor: "col-resize"
							}), a(".resizeMarker", o).show().css({
								left: a.jTableTool.getLeft(d) + 1 - a(".gridScroller", o).scrollLeft(),
								top: a.jTableTool.getTop(d),
								height: a.jTableTool.getHeight(d, o)
							}), a(".resizeProxy", o).jDrag(a.extend(b, {
								scop: !0,
								cellMinW: 20,
								relObj: a(".resizeMarker", o)[0],
								move: "horizontal",
								event: c,
								stop: function() {
									var b = a(".resizeProxy", o).position().left,
										c = a(".resizeMarker", o).position().left,
										d = b - c - e.outerWidth() - 9;
									a.jTableTool.getColspan(e);
									var g = a.jTableTool.getCellNum(e),
										h = e.width(),
										i = e.width() + d,
										j = a(">td", u).eq(g - 1);
									e.width(i + "px"), j.width(i + "px");
									var k = a(p).parent();
									k.width(k.width() - h + i + "px");
									var l = a(s).parent();
									l.width(l.width() - h + i + "px"), a(".resizeMarker,.resizeProxy", o).hide()
								}
							}))
						}) : (e.css("cursor", e.attr("orderField") ? "pointer" : "default"), e.unbind("mousedown")), !1
					})
				})
			}), a(window).unbind(DWZ.eventType.resizeGrid).bind("resizeGrid", x)
		})
	}, a.jTableTool = {
		getLeft: function(b) {
			var c = 0;
			return a(b).prevAll().each(function() {
				c += a(this).outerWidth()
			}), c - 1
		},
		getRight: function(b) {
			var c = 0;
			return a(b).prevAll().andSelf().each(function() {
				c += a(this).outerWidth()
			}), c - 1
		},
		getTop: function(b) {
			var c = 0;
			return a(b).parent().prevAll().each(function() {
				c += a(this).outerHeight()
			}), c
		},
		getHeight: function(b, c) {
			var d = 0,
				e = a(b).parent();
			return e.nextAll().andSelf().each(function() {
				d += a(this).outerHeight()
			}), a(".gridTbody", c).children().each(function() {
				d += a(this).outerHeight()
			}), d
		},
		getCellNum: function(b) {
			return a(b).prevAll().andSelf().size()
		},
		getColspan: function(b) {
			return a(b).attr("colspan") || 1
		},
		getStart: function(b) {
			var c = 1;
			return a(b).prevAll().each(function() {
				c += parseInt(a(this).attr("colspan") || 1)
			}), c
		},
		getPageCoord: function(a) {
			for (var b = {
				x: 0,
				y: 0
			}; a;) b.x += a.offsetLeft, b.y += a.offsetTop, a = a.offsetParent;
			return b
		},
		getOffset: function(b, c) {
			if (a.browser.msie) {
				var d = a(b).offset(),
					e = {
						offsetX: c.pageX || c.screenX,
						offsetY: c.pageY || c.screenY
					},
					f = {
						offsetX: e.offsetX - d.left,
						offsetY: e.offsetY - d.top
					};
				return f
			}
			var g = c.target;
			void 0 == g.offsetLeft && (g = g.parentNode);
			var h = a.jTableTool.getPageCoord(g),
				i = {
					x: window.pageXOffset + c.clientX,
					y: window.pageYOffset + c.clientY
				},
				f = {
					offsetX: i.x - h.x,
					offsetY: i.y - h.y
				};
			return f
		}
	}
}(jQuery),
function(a) {
	a.fn.extend({
		jTask: function() {
			return this.each(function() {
				var b = a(this),
					c = b.attr("id");
				b.click(function() {
					var e = a("body").data(c);
					return b.hasClass("selected") ? a("a.minimize", e).trigger("click") : e.is(":hidden") ? a.taskBar.restoreDialog(e) : a(e).trigger("click"), a.taskBar.scrollCurrent(a(this)), !1
				}), a("div.close", b).click(function() {
					return a.pdialog.close(c), !1
				}).hoverClass("closeHover"), b.hoverClass("hover")
			})
		}
	}), a.taskBar = {
		_taskBar: null,
		_taskBox: null,
		_prevBut: null,
		_nextBut: null,
		_op: {
			id: "taskbar",
			taskBox: "div.taskbarContent",
			prevBut: ".taskbarLeft",
			prevDis: "taskbarLeftDisabled",
			nextBut: ".taskbarRight",
			nextDis: "taskbarRightDisabled",
			selected: "selected",
			boxMargin: "taskbarMargin"
		},
		init: function(b) {
			var c = this;
			a.extend(this._op, b), this._taskBar = a("#" + this._op.id), 0 == this._taskBar.size() && (this._taskBar = a(DWZ.frag.taskbar).appendTo(a("#layout")), this._taskBar.find(".taskbarLeft").hoverClass("taskbarLeftHover"), this._taskBar.find(".taskbarRight").hoverClass("taskbarRightHover")), this._taskBox = this._taskBar.find(this._op.taskBox), this._taskList = this._taskBox.find(">ul"), this._prevBut = this._taskBar.find(this._op.prevBut), this._nextBut = this._taskBar.find(this._op.nextBut), this._prevBut.click(function() {
				c.scrollLeft()
			}), this._nextBut.click(function() {
				c.scrollRight()
			}), this._contextmenu(this._taskBox)
		},
		_contextmenu: function(b) {
			a(b).contextMenu("dialogCM", {
				bindings: {
					closeCurrent: function(b) {
						var d = b.isTag("li") ? b : a.taskBar._getCurrent();
						a("div.close", d).trigger("click")
					},
					closeOther: function(b) {
						var d = b.isTag("li") ? "#" + b.attr("id") : ".selected",
							e = a.taskBar._taskList.find(">li:not(:" + d + ")");
						e.each(function(b) {
							a("div.close", e[b]).trigger("click")
						})
					},
					closeAll: function() {
						var d = a.taskBar._getTasks();
						d.each(function(b) {
							a("div.close", d[b]).trigger("click")
						})
					}
				},
				ctrSub: function(b, c) {
					var d = c.find("[rel='closeCurrent']"),
						e = c.find("[rel='closeOther']");
					a.taskBar._getCurrent()[0] ? 1 == a.taskBar._getTasks().size() && e.addClass("disabled") : (d.addClass("disabled"), e.addClass("disabled"))
				}
			})
		},
		_scrollCurrent: function() {
			var b = this._tasksW(this._getTasks());
			if (b > this._getTaskBarW()) {
				var c = this,
					d = a(">li:last-child", this._taskList),
					e = this._getTaskBarW() - d.position().left - d.outerWidth(!0);
				this._taskList.animate({
					left: e + "px"
				}, 200, function() {
					c._ctrlScrollBut()
				})
			} else this._ctrlScrollBut()
		},
		_getTaskBarW: function() {
			return this._taskBox.width() - (this._prevBut.is(":hidden") ? this._prevBut.width() + 2 : 0) - (this._nextBut.is(":hidden") ? this._nextBut.width() + 2 : 0)
		},
		_scrollTask: function(a) {
			var b = this;
			if (a.position().left + this._getLeft() + a.outerWidth() > this._getBarWidth()) {
				var c = this._getTaskBarW() - a.position().left - a.outerWidth(!0) - 2;
				this._taskList.animate({
					left: c + "px"
				}, 200, function() {
					b._ctrlScrollBut()
				})
			} else if (a.position().left + this._getLeft() < 0) {
				var c = this._getLeft() - (a.position().left + this._getLeft());
				this._taskList.animate({
					left: c + "px"
				}, 200, function() {
					b._ctrlScrollBut()
				})
			}
		},
		_ctrlScrollBut: function() {
			var a = this._tasksW(this._getTasks());
			this._getTaskBarW() > a ? (this._taskBox.removeClass(this._op.boxMargin), this._nextBut.hide(), this._prevBut.hide(), this._getTasks().eq(0)[0] && this._scrollTask(this._getTasks().eq(0))) : (this._taskBox.addClass(this._op.boxMargin), this._nextBut.show().removeClass(this._op.nextDis), this._prevBut.show().removeClass(this._op.prevDis), this._getLeft() >= 0 && this._prevBut.addClass(this._op.prevDis), this._getLeft() <= this._getTaskBarW() - a && this._nextBut.addClass(this._op.nextDis))
		},
		_getLeft: function() {
			return this._taskList.position().left
		},
		_visibleStart: function() {
			for (var a = this._getLeft(), b = this._getTasks(), c = 0; c < b.size(); c++)
				if (b.eq(c).position().left + b.eq(c).outerWidth(!0) + a >= 0) return b.eq(c);
			return b.eq(0)
		},
		_visibleEnd: function() {
			for (var a = this._getLeft(), b = this._getTasks(), c = 0; c < b.size(); c++)
				if (b.eq(c).position().left + b.eq(c).outerWidth(!0) + a > this._getBarWidth()) return b.eq(c);
			return b.eq(b.size() - 1)
		},
		_getTasks: function() {
			return this._taskList.find(">li")
		},
		_tasksW: function(b) {
			var c = 0;
			return b.each(function() {
				c += a(this).outerWidth(!0)
			}), c
		},
		_getBarWidth: function() {
			return this._taskBar.innerWidth(!0)
		},
		addDialog: function(b, c) {
			this.show();
			var d = a("#" + b, this._taskList);
			if (d[0]) a(">div>span", d).text(c);
			else {
				var e = '<li id="#taskid#"><div class="taskbutton"><span>#title#</span></div><div class="close">Close</div></li>';
				this._taskList.append(e.replace("#taskid#", b).replace("#title#", c)), d = a("#" + b, this._taskList), d.jTask()
			}
			this._contextmenu(d), this.switchTask(b), this._scrollTask(d)
		},
		closeDialog: function(b) {
			var c = "string" == typeof b ? a("#" + b, this._taskList) : b;
			c.remove(), 0 == this._getTasks().size() && this.hide(), this._scrollCurrent()
		},
		restoreDialog: function(b) {
			var c = "string" == typeof b ? a("body").data(b) : b,
				d = "string" == typeof b ? b : c.data("id"),
				e = a.taskBar.getTask(d);
			a(".resizable").css({
				top: a(window).height() - 60,
				left: a(e).position().left,
				height: a(e).outerHeight(),
				width: a(e).outerWidth()
			}).show().animate({
				top: a(c).css("top"),
				left: a(c).css("left"),
				width: a(c).css("width"),
				height: a(c).css("height")
			}, 250, function() {
				a(this).hide(), a(c).show(), a.pdialog.attachShadow(c)
			}), a.taskBar.switchTask(d)
		},
		inactive: function(b) {
			a("#" + b, this._taskList).removeClass("selected")
		},
		scrollLeft: function() {
			var a = this._visibleStart();
			this._scrollTask(a)
		},
		scrollRight: function() {
			var a = this._visibleEnd();
			this._scrollTask(a)
		},
		scrollCurrent: function(a) {
			this._scrollTask(a)
		},
		switchTask: function(a) {
			this._getCurrent().removeClass("selected"), this.getTask(a).addClass("selected")
		},
		_getCurrent: function() {
			return this._taskList.find(">.selected")
		},
		getTask: function(b) {
			return a("#" + b, this._taskList)
		},
		show: function() {
			this._taskBar.is(":hidden") && (this._taskBar.css("top", a(window).height() - 34 + this._taskBar.outerHeight()).show(), this._taskBar.animate({
				top: a(window).height() - this._taskBar.outerHeight()
			}, 500))
		},
		hide: function() {
			this._taskBar.animate({
				top: a(window).height() - 29 + this._taskBar.outerHeight(!0)
			}, 500, function() {
				a.taskBar._taskBar.hide()
			})
		}
	}
}(jQuery), $.fn.extend({
	ajaxTodo: function() {
		return this.each(function() {
			var a = $(this);
			a.click(function(b) {
				var c = unescape(a.attr("href")).replaceTmById($(b.target).parents(".unitBox:first"));
				if (DWZ.debug(c), !c.isFinishedTm()) return alertMsg.error(a.attr("warn") || DWZ.msg("alertSelectMsg")), !1;
				var d = a.attr("title");
				d ? alertMsg.confirm(d, {
					okCall: function() {
						ajaxTodo(c, a.attr("callback"))
					}
				}) : ajaxTodo(c, a.attr("callback")), b.preventDefault()
			})
		})
	},
	dwzExport: function() {
		function a(a) {
			var b = "dialog" == a.attr("targetType") ? $.pdialog.getCurrent() : navTab.getCurrentPanel(),
				c = $("#pagerForm", b),
				d = a.attr("href");
			window.location = d + (-1 == d.indexOf("?") ? "?" : "&") + c.serialize()
		}
		return this.each(function() {
			var b = $(this);
			b.click(function(c) {
				var d = b.attr("title");
				d ? alertMsg.confirm(d, {
					okCall: function() {
						a(b)
					}
				}) : a(b), c.preventDefault()
			})
		})
	}
}),
function(a) {
	a.fn.extend({
		pagination: function(c) {
			function e(a, b, c, d) {
				a.bind("click", {
					pageNum: b
				}, function(a) {
					dwzPageBreak({
						targetType: c,
						rel: d,
						data: {
							pageNum: a.data.pageNum
						}
					}), a.preventDefault()
				})
			}
			var d = {
				first$: "li.j-first",
				prev$: "li.j-prev",
				next$: "li.j-next",
				last$: "li.j-last",
				nums$: "li.j-num>a",
				jumpto$: "li.jumpto",
				pageNumFrag: '<li class="#liClass#"><a href="javascript:;">#pageNum#</a></li>'
			};
			return this.each(function() {
				for (var f = a(this), g = new b(c), h = g.getInterval(), i = "", j = h.start; j < h.end; j++) i += d.pageNumFrag.replaceAll("#pageNum#", j).replaceAll("#liClass#", j == g.getCurrentPage() ? "selected j-num" : "j-num");
				f.html(DWZ.frag.pagination.replaceAll("#pageNumFrag#", i).replaceAll("#currentPage#", g.getCurrentPage())).find("li").hoverClass();
				var k = f.find(d.first$),
					l = f.find(d.prev$),
					m = f.find(d.next$),
					n = f.find(d.last$);
				g.hasPrev() ? (k.add(l).find(">span").hide(), e(l, g.getCurrentPage() - 1, g.targetType(), g.rel()), e(k, 1, g.targetType(), g.rel())) : k.add(l).addClass("disabled").find(">a").hide(), g.hasNext() ? (m.add(n).find(">span").hide(), e(m, g.getCurrentPage() + 1, g.targetType(), g.rel()), e(n, g.numPages(), g.targetType(), g.rel())) : m.add(n).addClass("disabled").find(">a").hide(), f.find(d.nums$).each(function(b) {
					e(a(this), b + h.start, g.targetType(), g.rel())
				}), f.find(d.jumpto$).each(function() {
					var b = a(this),
						c = b.find(":text"),
						d = b.find(":button");
					d.click(function() {
						var b = c.val();
						b && b.isPositiveInteger() && (b > g.numPages() && (b = 1), dwzPageBreak({
							targetType: g.targetType(),
							rel: g.rel(),
							data: {
								pageNum: b
							}
						}))
					}), c.keyup(function(a) {
						a.keyCode == DWZ.keyCode.ENTER && d.click()
					})
				})
			})
		},
		orderBy: function(b) {
			var c = a.extend({
				targetType: "navTab",
				rel: "",
				asc: "asc",
				desc: "desc"
			}, b);
			return this.each(function() {
				var b = a(this).css({
					cursor: "pointer"
				}).click(function() {
					var a = b.attr("orderField"),
						d = b.hasClass(c.asc) ? c.desc : c.asc;
					dwzPageBreak({
						targetType: c.targetType,
						rel: c.rel,
						data: {
							orderField: a,
							orderDirection: d
						}
					})
				})
			})
		},
		pagerForm: function(b) {
			var c = a.extend({
					pagerForm$: "#pagerForm",
					parentBox: document
				}, b),
				d = '<input type="hidden" name="#name#" value="#value#" />';
			return this.each(function() {
				var b = a(this),
					e = a(c.pagerForm$, c.parentBox),
					f = e.attr("action").replaceAll("#rel#", b.attr("action"));
				e.attr("action", f), b.find(":input").each(function() {
					var b = a(this),
						c = b.attr("name");
					if (c && (!b.is(":checkbox,:radio") || b.is(":checked")) && 0 == e.find(":input[name='" + c + "']").length) {
						var f = d.replaceAll("#name#", c).replaceAll("#value#", b.val());
						e.append(f)
					}
				})
			})
		}
	});
	var b = function(b) {
		this.opts = a.extend({
			targetType: "navTab",
			rel: "",
			totalCount: 0,
			numPerPage: 10,
			pageNumShown: 10,
			currentPage: 1,
			callback: function() {
				return !1
			}
		}, b)
	};
	a.extend(b.prototype, {
		targetType: function() {
			return this.opts.targetType
		},
		rel: function() {
			return this.opts.rel
		},
		numPages: function() {
			return Math.ceil(this.opts.totalCount / this.opts.numPerPage)
		},
		getInterval: function() {
			var a = Math.ceil(this.opts.pageNumShown / 2),
				b = this.numPages(),
				c = b - this.opts.pageNumShown,
				d = this.getCurrentPage() > a ? Math.max(Math.min(this.getCurrentPage() - a, c), 0) : 0,
				e = this.getCurrentPage() > a ? Math.min(this.getCurrentPage() + a, b) : Math.min(this.opts.pageNumShown, b);
			return {
				start: d + 1,
				end: e + 1
			}
		},
		getCurrentPage: function() {
			var a = parseInt(this.opts.currentPage);
			return isNaN(a) ? 1 : a
		},
		hasPrev: function() {
			return this.getCurrentPage() > 1
		},
		hasNext: function() {
			return this.getCurrentPage() < this.numPages()
		}
	})
}(jQuery),
function($) {
	var _lookup = {
			currentGroup: "",
			suffix: "",
			$target: null,
			pk: "id",
			callback: null
		},
		_util = {
			_lookupPrefix: function(a) {
				var b = _lookup.currentGroup ? "." : "";
				return _lookup.currentGroup + b + a + _lookup.suffix
			},
			lookupPk: function(a) {
				return this._lookupPrefix(a)
			},
			lookupField: function(a) {
				return this.lookupPk(a)
			}
		};
	$.extend({
		bringBackSuggest: function(a) {
			var b = _lookup.$target.parents(".unitBox:first");
			b.find(":input").each(function() {
				var b = $(this),
					c = b.attr("name");
				for (var d in a) {
					var e = _lookup.pk == d ? _util.lookupPk(d) : _util.lookupField(d);
					if (e == c) {
						b.val(a[d]);
						break
					}
				}
			});
			var callback = _lookup['callback'];
			try {
				eval(callback + "();");
			} catch (e) {}
		},
		bringBack: function(a) {
			$.bringBackSuggest(a), $.pdialog.closeCurrent()
		}
	}), $.fn.extend({
		lookup: function() {
			return this.each(function() {
				var $this = $(this),
					options = {
						mask: !0,
						width: $this.attr("width") || 820,
						height: $this.attr("height") || 400,
						maxable: eval($this.attr("maxable") || "true"),
						resizable: eval($this.attr("resizable") || "true")
					};
				$this.click(function(a) {
					_lookup = $.extend(_lookup, {
						currentGroup: $this.attr("lookupGroup") || "",
						callback: $this.attr("callback"),
						suffix: $this.attr("suffix") || "",
						$target: $this,
						pk: $this.attr("lookupPk") || "id"
					});
					var b = unescape($this.attr("href")).replaceTmById($(a.target).parents(".unitBox:first"));
					return b.isFinishedTm() ? ($.pdialog.open(b, "_blank", $this.attr("title") || $this.text(), options), !1) : (alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg")), !1)
				})
			})
		},
		multLookup: function() {
			return this.each(function() {
				var a = $(this),
					b = {};
				a.click(function() {
					var d = a.parents(".unitBox:first");
					return d.find("[name='" + a.attr("multLookup") + "']").filter(":checked").each(function() {
						var a = DWZ.jsonEval($(this).val());
						for (var c in a) {
							var d = b[c] ? b[c] + "," : "";
							b[c] = d + a[c]
						}
					}), $.isEmptyObject(b) ? (alertMsg.error(a.attr("warn") || DWZ.msg("alertSelectMsg")), !1) : ($.bringBack(b), void 0)
				})
			})
		},
		suggest: function() {
			var a = {
					suggest$: "#suggest",
					suggestShadow$: "#suggestShadow"
				},
				b = -1;
			return this.each(function() {
				function e(b) {
					var e = c.offset(),
						h = e.top + this.offsetHeight,
						i = $(a.suggest$);
					0 == i.size() && (i = $('<div id="suggest"></div>').appendTo($("body"))), i.css({
						left: e.left + "px",
						top: h + "px"
					}).show(), _lookup = $.extend(_lookup, {
						currentGroup: c.attr("lookupGroup") || "",
						suffix: c.attr("suffix") || "",
						$target: c,
						pk: c.attr("lookupPk") || "id"
					});
					var j = unescape(c.attr("suggestUrl")).replaceTmById($(b.target).parents(".unitBox:first"));
					if (!j.isFinishedTm()) return alertMsg.error(c.attr("warn") || DWZ.msg("alertSelectMsg")), !1;
					var k = {};
					return k[c.attr("postField") || "inputValue"] = c.val(), $.ajax({
						global: !1,
						type: "POST",
						dataType: "json",
						url: j,
						cache: !1,
						data: k,
						success: function(a) {
							if (a) {
								var c = "";
								$.each(a, function(a) {
									for (var b = "", e = "", a = 0; a < d.length; a++) {
										var f = this[d[a]];
										f && (e && (e += "-"), e += f)
									}
									for (var g in this) b && (b += ","), b += g + ":'" + this[g] + "'";
									c += '<li lookupAttrs="' + b + '">' + e + "</li>"
								});
								var e = i.html("<ul>" + c + "</ul>").find("li");
								if (e.hoverClass("selected").click(function() {
									f($(this))
								}), 1 == e.size() && b.keyCode != DWZ.keyCode.BACKSPACE) f(e.eq(0));
								else if (0 == e.size()) {
									for (var g = "", h = 0; h < d.length && _util.lookupField(d[h]) != b.target.name; h++) g && (g += ","), g += d[h] + ":''";
									g = "{" + _lookup.pk + ":''," + g + "}", $.bringBackSuggest(DWZ.jsonEval(g))
								}
							}
						},
						error: function() {
							i.html("")
						}
					}), $(document).bind("click", g), !1
				}

				function f(a) {
					var b = "{" + a.attr("lookupAttrs") + "}";
					$.bringBackSuggest(DWZ.jsonEval(b))
				}

				function g() {
					$(a.suggest$).html("").hide(), b = -1, $(document).unbind("click", g)
				}
				var c = $(this).attr("autocomplete", "off").keydown(function(b) {
						return b.keyCode == DWZ.keyCode.ENTER && $(a.suggest$).is(":visible") ? !1 : void 0
					}),
					d = c.attr("suggestFields").split(",");
				c.focus(e).click(!1).keyup(function(c) {
					var d = $(a.suggest$).find("li");
					switch (c.keyCode) {
						case DWZ.keyCode.ESC:
						case DWZ.keyCode.TAB:
						case DWZ.keyCode.SHIFT:
						case DWZ.keyCode.HOME:
						case DWZ.keyCode.END:
						case DWZ.keyCode.LEFT:
						case DWZ.keyCode.RIGHT:
							break;
						case DWZ.keyCode.ENTER:
							g();
							break;
						case DWZ.keyCode.DOWN:
							b >= d.size() - 1 ? b = -1 : b++;
							break;
						case DWZ.keyCode.UP:
							0 > b ? b = d.size() - 1 : b--;
							break;
						default:
							e(c)
					}
					if (d.removeClass("selected"), b >= 0) {
						var h = d.eq(b).addClass("selected");
						f(h)
					}
				})
			})
		},
		itemDetail: function() {
			function a(a) {
				a.find(">tr").each(function(a) {
					$(":input, a.btnLook, a.btnAttach", this).each(function() {
						var b = $(this),
							c = b.attr("name"),
							d = b.val();
						c && b.attr("name", c.replaceSuffix(a));
						var e = b.attr("lookupGroup");
						e && b.attr("lookupGroup", e.replaceSuffix(a));
						var f = b.attr("suffix");
						f && b.attr("suffix", f.replaceSuffix(a)), d && d.indexOf("#index#") >= 0 && b.val(d.replace("#index#", a + 1))
					})
				})
			}

			function b(a) {
				var b = "",
					c = "";
				a.name.endsWith("[#index#]") ? c = "[#index#]" : a.name.endsWith("[]") && (c = "[]");
				var d = c ? ' suffix="' + c + '" ' : "",
					e = "";
				if (a.fieldAttrs) {
					var f = DWZ.jsonEval(a.fieldAttrs);
					for (var g in f) e += g + '="' + f[g] + '"'
				}
				switch (a.type) {
					case "del":
						b = '<a href="javascript:void(0)" class="btnDel ' + a.fieldClass + '">\u5220\u9664</a>';
						break;
					case "lookup":
						var h = "";
						a.suggestFields && (h = 'autocomplete="off" lookupGroup="' + a.lookupGroup + '"' + d + ' suggestUrl="' + a.suggestUrl + '" suggestFields="' + a.suggestFields + '"' + ' postField="' + a.postField + '"'), b = '<input type="hidden" name="' + a.lookupGroup + "." + a.lookupPk + c + '"/>' + '<input type="text" name="' + a.name + '"' + h + ' lookupPk="' + a.lookupPk + '" size="' + a.size + '" class="' + a.fieldClass + '"/>' + '<a class="btnLook" href="' + a.lookupUrl + '" lookupGroup="' + a.lookupGroup + '" ' + h + ' lookupPk="' + a.lookupPk + '" title="\u67e5\u627e\u5e26\u56de">\u67e5\u627e\u5e26\u56de</a>';
						break;
					case "attach":
						b = '<input type="hidden" name="' + a.lookupGroup + "." + a.lookupPk + c + '"/>' + '<input type="text" name="' + a.name + '" size="' + a.size + '" readonly="readonly" class="' + a.fieldClass + '"/>' + '<a class="btnAttach" href="' + a.lookupUrl + '" lookupGroup="' + a.lookupGroup + '" ' + h + ' lookupPk="' + a.lookupPk + '" width="560" height="300" title="\u67e5\u627e\u5e26\u56de">\u67e5\u627e\u5e26\u56de</a>';
						break;
					case "enum":
						$.ajax({
							type: "POST",
							dataType: "html",
							async: !1,
							url: a.enumUrl,
							data: {
								inputName: a.name
							},
							success: function(a) {
								b = a
							}
						});
						break;
					case "date":
						b = '<input type="text" name="' + a.name + '" value="' + a.defaultVal + '" class="date ' + a.fieldClass + '" dateFmt="' + a.patternDate + '" size="' + a.size + '"/>' + '<a class="inputDateButton" href="javascript:void(0)">\u9009\u62e9</a>';
						break;
					default:
						b = '<input type="text" name="' + a.name + '" value="' + a.defaultVal + '" size="' + a.size + '" class="' + a.fieldClass + '" ' + e + "/>"
				}
				return "<td>" + b + "</td>"
			}

			function c(a) {
				var c = "";
				return $(a).each(function() {
					c += b(this)
				}), '<tr class="unitBox">' + c + "</tr>"
			}
			return this.each(function() {
				var b = $(this).css("clear", "both"),
					d = b.find("tbody"),
					e = [];
				b.find("tr:first th[type]").each(function() {
					var b = $(this),
						c = {
							type: b.attr("type") || "text",
							patternDate: b.attr("dateFmt") || "yyyy-MM-dd",
							name: b.attr("name") || "",
							defaultVal: b.attr("defaultVal") || "",
							size: b.attr("size") || "12",
							enumUrl: b.attr("enumUrl") || "",
							lookupGroup: b.attr("lookupGroup") || "",
							lookupUrl: b.attr("lookupUrl") || "",
							lookupPk: b.attr("lookupPk") || "id",
							suggestUrl: b.attr("suggestUrl"),
							suggestFields: b.attr("suggestFields"),
							postField: b.attr("postField") || "",
							fieldClass: b.attr("fieldClass") || "",
							fieldAttrs: b.attr("fieldAttrs") || ""
						};
					e.push(c)
				}), d.find("a.btnDel").click(function() {
					function c() {
						$.ajax({
							type: "POST",
							dataType: "json",
							url: b.attr("href"),
							cache: !1,
							success: function() {
								b.parents("tr:first").remove(), a(d)
							},
							error: DWZ.ajaxError
						})
					}
					var b = $(this);
					return b.is("[href^=javascript:]") ? (b.parents("tr:first").remove(), a(d), !1) : (b.attr("title") ? alertMsg.confirm(b.attr("title"), {
						okCall: c
					}) : c(), !1)
				});
				var f = b.attr("addButton") || "Add New";
				if (f) {
					var g = $('<div class="button"><div class="buttonContent"><button type="button">' + f + "</button></div></div>").insertBefore(b).find("button"),
						h = $('<input type="text" name="dwz_rowNum" class="textInput" style="margin:2px;" value="1" size="2"/>').insertBefore(b),
						i = "";
					g.click(function() {
						i || (i = c(e));
						var b = 1;
						try {
							b = parseInt(h.val())
						} catch (f) {}
						for (var g = 0; b > g; g++) {
							var j = $(i);
							j.appendTo(d).initUI().find("a.btnDel").click(function() {
								return $(this).parents("tr:first").remove(), a(d), !1
							})
						}
						a(d)
					})
				}
			})
		},
		selectedTodo: function() {
			function _getIds(a, b) {
				var c = "",
					d = "dialog" == b ? $.pdialog.getCurrent() : navTab.getCurrentPanel();
				return d.find("input:checked").filter("[name='" + a + "']").each(function(a) {
					var b = $(this).val();
					c += 0 == a ? b : "," + b
				}), c
			}
			return this.each(function() {
				var $this = $(this),
					selectedIds = $this.attr("rel") || "ids",
					postType = $this.attr("postType") || "map";
				$this.click(function() {
					function _doPost() {
						$.ajax({
							type: "POST",
							url: $this.attr("href"),
							dataType: "json",
							cache: !1,
							data: function() {
								if ("map" == postType) return $.map(ids.split(","), function(a) {
									return {
										name: selectedIds,
										value: a
									}
								});
								var a = {};
								return a[selectedIds] = ids, a
							}(),
							success: _callback,
							error: DWZ.ajaxError
						})
					}
					var targetType = $this.attr("targetType"),
						ids = _getIds(selectedIds, targetType);
					if (!ids) return alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg")), !1;
					var _callback = $this.attr("callback") || ("dialog" == targetType ? dialogAjaxDone : navTabAjaxDone);
					$.isFunction(_callback) || (_callback = eval("(" + _callback + ")"));
					var title = $this.attr("title");
					return title ? alertMsg.confirm(title, {
						okCall: _doPost
					}) : _doPost(), !1
				})
			})
		}
	})
}(jQuery),
function(a) {
	a.setRegional("datepicker", {
		dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	}), a.fn.datepicker = function(c) {
		function e(b) {
			var c = a(d.tmBox$);
			c.removeClass("hh").removeClass("mm").removeClass("ss"), b && (c.addClass(b), a(d.tmInputs$).removeClass("slt").filter("." + b).addClass("slt"))
		}

		function f(b, c) {
			a(d.tmBox$).find("." + c + " li").each(function() {
				var c = a(this);
				c.click(function() {
					b.val(c.text())
				})
			})
		}

		function g(a) {
			return a.keyCode >= 48 && a.keyCode <= 57 || a.keyCode == DWZ.keyCode.DELETE || a.keyCode == DWZ.keyCode.BACKSPACE ? void 0 : !1
		}

		function h(a, b) {
			var c = parseInt(a.val()),
				d = parseInt(a.attr("start")) || 0,
				e = parseInt(a.attr("end")),
				f = parseInt(a.attr("step") || 1);
			1 == b ? e - f >= c && a.val(c + f) : -1 == b ? c >= d + f && a.val(c - f) : c > e ? a.val(e) : d > c && a.val(d)
		}
		var d = {
			box$: "#calendar",
			year$: "#calendar [name=year]",
			month$: "#calendar [name=month]",
			tmInputs$: "#calendar .time :text",
			hour$: "#calendar .time .hh",
			minute$: "#calendar .time .mm",
			second$: "#calendar .time .ss",
			tmBox$: "#calendar .tm",
			tmUp$: "#calendar .time .up",
			tmDown$: "#calendar .time .down",
			close$: "#calendar .close",
			calIcon$: "a.inputDateButton",
			main$: "#calendar .main",
			days$: "#calendar .days",
			dayNames$: "#calendar .dayNames",
			clearBut$: "#calendar .clearBut",
			okBut$: "#calendar .okBut"
		};
		return this.each(function() {
			function k(b) {
				var c = b.getDateWrap(),
					j = b.getMinDate(),
					k = b.getMaxDate(),
					m = new Date(c.year, c.month - 1, 1),
					n = m.getDay(),
					o = "";
				if (n > 0) {
					m.setMonth(m.getMonth() - 1);
					for (var p = b.getDateWrap(m), q = p.days - n + 1; q <= p.days; q++) {
						var r = new Date(c.year, c.month - 2, q),
							s = r >= j && k >= r ? "" : "disabled";
						o += '<dd class="other ' + s + '" chMonth="-1" day="' + q + '">' + q + "</dd>"
					}
				}
				for (var q = 1; q <= c.days; q++) {
					var r = new Date(c.year, c.month - 1, q),
						s = r >= j && k >= r ? "" : "disabled";
					o += q == c.day ? '<dd class="slt ' + s + '" day="' + q + '">' + q + "</dd>" : '<dd class="' + s + '" day="' + q + '">' + q + "</dd>"
				}
				for (var q = 1; q <= 42 - n - c.days; q++) {
					var r = new Date(c.year, c.month, q),
						s = r >= j && k >= r ? "" : "disabled";
					o += '<dd class="other ' + s + '" chMonth="1" day="' + q + '">' + q + "</dd>"
				}
				var t = a(d.days$).html(o).find("dd");
				if (t.not(".disabled").click(function() {
					var c = a(this);
					b.hasTime() ? (t.removeClass("slt"), c.addClass("slt")) : (i.val(b.formatDate(b.changeDay(c.attr("day"), c.attr("chMonth")))), l())
				}), b.hasDate() || a(d.main$).addClass("nodate"), b.hasTime()) {
					a("#calendar .time").show();
					var u = a(d.hour$).val(c.hour).focus(function() {
							e("hh")
						}),
						v = parseInt(c.minute / b.opts.mmStep) * b.opts.mmStep,
						w = a(d.minute$).val(v).attr("step", b.opts.mmStep).focus(function() {
							e("mm")
						}),
						x = a(d.second$).val(b.hasSecond() ? c.second : 0).attr("step", b.opts.ssStep).focus(function() {
							e("ss")
						});
					u.add(w).add(x).click(function() {
						return !1
					}), f(u, "hh"), f(w, "mm"), f(x, "ss"), a(d.box$).click(function() {
						e()
					});
					var y = a(d.tmInputs$);
					y.keydown(g).each(function() {
						var b = a(this);
						b.keyup(function() {
							h(b, 0)
						})
					}), a(d.tmUp$).click(function() {
						y.filter(".slt").each(function() {
							h(a(this), 1)
						})
					}), a(d.tmDown$).click(function() {
						y.filter(".slt").each(function() {
							h(a(this), -1)
						})
					}), b.hasHour() || u.attr("disabled", !0), b.hasMinute() || w.attr("disabled", !0), b.hasSecond() || x.attr("disabled", !0)
				}
			}

			function l() {
				a(d.box$).remove(), a(document).unbind("click", l)
			}
			var i = a(this);
			new b(i.val(), c), i.click(function() {
				l();
				var f = new b(i.val(), c),
					g = i.offset(),
					h = g.top + this.offsetHeight;
				a(DWZ.frag.calendarFrag).appendTo("body").css({
					left: g.left + "px",
					top: h + "px"
				}).show().click(function(a) {
					a.stopPropagation()
				}), a.fn.bgiframe && a(d.box$).bgiframe();
				var j = "";
				a.each(a.regional.datepicker.dayNames, function(a, b) {
					j += "<dt>" + b + "</dt>"
				}), a(d.dayNames$).html(j);
				var m = f.getDateWrap(),
					n = a(d.year$),
					o = f.getMinDate().getFullYear(),
					p = f.getMaxDate().getFullYear();
				for (y = o; p >= y; y++) n.append('<option value="' + y + '"' + (m.year == y ? 'selected="selected"' : "") + ">" + y + "</option>");
				var q = a(d.month$);
				a.each(a.regional.datepicker.monthNames, function(a, b) {
					var c = a + 1;
					q.append('<option value="' + c + '"' + (m.month == c ? 'selected="selected"' : "") + ">" + b + "</option>")
				}), k(f), n.add(q).change(function() {
					f.changeDate(n.val(), q.val()), k(f)
				});
				var r = a(d.box$).outerHeight(!0);
				return h > r && h > a(window).height() - r && a(d.box$).css("top", g.top - r), a(d.close$).click(function() {
					l()
				}), a(d.clearBut$).click(function() {
					i.val(""), l()
				}), a(d.okBut$).click(function() {
					var b = a(d.days$).find("dd.slt");
					if (b.hasClass("disabled")) return !1;
					var c = f.changeDay(b.attr("day"), b.attr("chMonth"));
					f.hasTime() && (c.setHours(parseInt(a(d.hour$).val())), c.setMinutes(parseInt(a(d.minute$).val())), c.setSeconds(parseInt(a(d.second$).val()))), i.val(f.formatDate(c)), l()
				}), a(document).bind("click", l), !1
			}), i.parent().find(d.calIcon$).click(function() {
				return i.trigger("click"), !1
			})
		})
	};
	var b = function(b, c) {
		this.opts = a.extend({
			pattern: "yyyy-MM-dd",
			minDate: "1900-01-01",
			maxDate: "2099-12-31",
			mmStep: 1,
			ssStep: 1
		}, c);
		var d = new Date;
		this.opts.minDate = d.formatDateTm(this.opts.minDate), this.opts.maxDate = d.formatDateTm(this.opts.maxDate), this.sDate = b.trim()
	};
	a.extend(b.prototype, {
		get: function(a) {
			return this.opts[a]
		},
		_getDays: function(a, b) {
			return 2 == b ? a % 4 || !(a % 100) && a % 400 ? 28 : 29 : /4|6|9|11/.test(b) ? 30 : 31
		},
		_minMaxDate: function(a) {
			var b = a.split("-").length - 1,
				c = "y-M-d";
			return 1 == b ? c = "y-M" : 0 == b && (c = "y"), a.parseDate(c)
		},
		getMinDate: function() {
			return this._minMaxDate(this.opts.minDate)
		},
		getMaxDate: function() {
			var a = this.opts.maxDate,
				b = a.split("-").length - 1,
				c = this._minMaxDate(a);
			if (2 > b) {
				var d = this._getDays(c.getFullYear(), c.getMonth() + 1);
				c.setDate(d), 0 == b && c.setMonth(11)
			}
			return c
		},
		getDateWrap: function(a) {
			a || (a = this.parseDate(this.sDate) || new Date);
			var b = a.getFullYear(),
				c = a.getMonth() + 1,
				d = this._getDays(b, c);
			return {
				year: b,
				month: c,
				day: a.getDate(),
				hour: a.getHours(),
				minute: a.getMinutes(),
				second: a.getSeconds(),
				days: d,
				date: a
			}
		},
		changeDate: function(a, b, c) {
			var d = new Date(a, b - 1, c || 1);
			return this.sDate = this.formatDate(d), d
		},
		changeDay: function(a, b) {
			b || (b = 0);
			var c = this.getDateWrap();
			return this.changeDate(c.year, c.month + parseInt(b), a)
		},
		parseDate: function(a) {
			return a ? a.parseDate(this.opts.pattern) : null
		},
		formatDate: function(a) {
			return a.formatDate(this.opts.pattern)
		},
		hasHour: function() {
			return -1 != this.opts.pattern.indexOf("H")
		},
		hasMinute: function() {
			return -1 != this.opts.pattern.indexOf("m")
		},
		hasSecond: function() {
			return -1 != this.opts.pattern.indexOf("s")
		},
		hasTime: function() {
			return this.hasHour() || this.hasMinute() || this.hasSecond()
		},
		hasDate: function() {
			for (var a = ["y", "M", "d", "E"], b = 0; b < a.length; b++)
				if (-1 != this.opts.pattern.indexOf(a[b])) return !0;
			return !1
		}
	})
}(jQuery),
function(a) {
	a.extend(a.fn, {
		jBlindUp: function(b) {
			var c = a.extend({
				duration: 500,
				easing: "swing",
				call: function() {}
			}, b);
			return this.each(function() {
				var b = a(this);
				a(this).animate({
					height: 0
				}, {
					step: function() {},
					duration: c.duration,
					easing: c.easing,
					complete: function() {
						b.css({
							display: "none"
						}), c.call()
					}
				})
			})
		},
		jBlindDown: function(b) {
			var c = a.extend({
				to: 0,
				duration: 500,
				easing: "swing",
				call: function() {}
			}, b);
			return this.each(function() {
				var b = a(this),
					d = c.to > 0 ? c.to : a.effect.getDimensions(b[0]).height;
				b.animate({
					height: d
				}, {
					step: function() {},
					duration: c.duration,
					easing: c.easing,
					complete: function() {
						b.css({
							display: ""
						}), c.call()
					}
				})
			})
		},
		jSlideUp: function(b) {
			var c = a.extend({
				to: 0,
				duration: 500,
				easing: "swing",
				call: function() {}
			}, b);
			return this.each(function() {
				var b = a(this);
				b.wrapInner("<div></div>");
				var d = c.to > 0 ? c.to : a.effect.getDimensions(a(">div", b)[0]).height;
				b.css({
					overflow: "visible",
					position: "relative"
				}), a(">div", b).css({
					position: "relative"
				}).animate({
					top: -d
				}, {
					easing: c.easing,
					duration: c.duration,
					complete: function() {
						b.html(a(this).html())
					}
				})
			})
		},
		jSlideDown: function(b) {
			var c = a.extend({
				to: 0,
				duration: 500,
				easing: "swing",
				call: function() {}
			}, b);
			return this.each(function() {
				var b = a(this),
					d = c.to > 0 ? c.to : a.effect.getDimensions(b[0]).height;
				b.wrapInner('<div style="top:-' + d + 'px;"></div>'), b.css({
					overflow: "visible",
					position: "relative",
					height: "0px"
				}).animate({
					height: d
				}, {
					duration: c.duration,
					easing: c.easing,
					complete: function() {
						b.css({
							display: "",
							overflow: ""
						}), c.call()
					}
				}), a(">div", b).css({
					position: "relative"
				}).animate({
					top: 0
				}, {
					easing: c.easing,
					duration: c.duration,
					complete: function() {
						b.html(a(this).html())
					}
				})
			})
		}
	}), a.effect = {
		getDimensions: function(b) {
			var d = new a.effect.Rectangle,
				e = a(b).css("display"),
				f = a(b).css("visibility"),
				g = 0 == a(b).height() ? !0 : !1;
			return a(b).is(":hidden") && (a(b).css({
				visibility: "hidden",
				display: "block"
			}), g && a(b).css("height", ""), a.browser.opera && refElement.focus()), d.height = a(b).outerHeight(), d.width = a(b).outerWidth(), "none" == e && (a(b).css({
				visibility: f,
				display: "none"
			}), g && g && a(b).css("height", "0px")), d
		}
	}, a.effect.Rectangle = function() {
		this.width = 0, this.height = 0, this.unit = "px"
	}
}(jQuery),
function(a) {
	a.extend(a.fn, {
		jPanel: function(b) {
			var c = a.extend({
				header: "panelHeader",
				headerC: "panelHeaderContent",
				content: "panelContent",
				coll: "collapsable",
				exp: "expandable",
				footer: "panelFooter",
				footerC: "panelFooterContent"
			}, b);
			return this.each(function() {
				var b = a(this),
					d = b.hasClass("close"),
					e = b.hasClass("collapse"),
					f = a(">div", b).addClass(c.content),
					g = a(">h1", b).wrap('<div class="' + c.header + '"><div class="' + c.headerC + '"></div></div>');
				e && a('<a href=""></a>').addClass(d ? c.exp : c.coll).insertAfter(g);
				var h = a(">div:first", b);
				a('<div class="' + c.footer + '"><div class="' + c.footerC + '"></div></div>').appendTo(b);
				var j = b.attr("defH") ? b.attr("defH") : 0,
					k = b.attr("minH") ? b.attr("minH") : 0;
				if (d ? f.css({
					height: "0px",
					display: "none"
				}) : j > 0 ? f.height(j + "px") : k > 0 && f.css("minHeight", k + "px"), e) {
					var l = a("a", h),
						m = f.innerHeight() - 6;
					j = k > 0 && k >= m ? k : m, l.click(function() {
						return l.hasClass(c.exp) ? f.jBlindDown({
							to: j,
							call: function() {
								l.removeClass(c.exp).addClass(c.coll), k > 0 && f.css("minHeight", k + "px")
							}
						}) : (k > 0 && f.css("minHeight", ""), k >= m && f.css("height", k + "px"), f.jBlindUp({
							call: function() {
								l.removeClass(c.coll).addClass(c.exp)
							}
						})), !1
					})
				}
			})
		}
	})
}(jQuery),
function(a) {
	a.fn.extend({
		checkboxCtrl: function(b) {
			return this.each(function() {
				var c = a(this);
				c.click(function() {
					var d = c.attr("group");
					if (c.is(":checkbox")) {
						var e = c.is(":checked") ? "all" : "none";
						d && a.checkbox.select(d, e, b)
					} else d && a.checkbox.select(d, c.attr("selectType") || "all", b)
				})
			})
		}
	}), a.checkbox = {
		selectAll: function(a, b) {
			this.select(a, "all", b)
		},
		unSelectAll: function(a, b) {
			this.select(a, "none", b)
		},
		selectInvert: function(a, b) {
			this.select(a, "invert", b)
		},
		select: function(b, c, d) {
			switch ($parent = a(d || document), $checkboxLi = $parent.find(":checkbox[name='" + b + "']"), c) {
				case "invert":
					$checkboxLi.each(function() {
						$checkbox = a(this), $checkbox.attr("checked", !$checkbox.is(":checked"))
					});
					break;
				case "none":
					$checkboxLi.attr("checked", !1);
					break;
				default:
					$checkboxLi.attr("checked", !0)
			}
		}
	}
}(jQuery),
function(a) {
	var b = [],
		c = function(d) {
			a.each(b, function(e) {
				b[e] != d && (a("#" + b[e])[0] ? a("#op_" + b[e]).css({
					height: "",
					width: ""
				}).hide() : a("#op_" + b[e]).remove(), a(document).unbind("click", c))
			})
		};
	a.extend(a.fn, {
		comboxSelect: function(d) {
			var e = a.extend({
				selector: ">a"
			}, d);
			return this.each(function() {
				var d = a(this),
					f = a(e.selector, d);
				b.push(d.attr("id")), a(e.selector, d).click(function() {
					var b = a("#op_" + d.attr("id"));
					if (b.is(":hidden")) {
						b.height() > 300 && b.css({
							height: "300px",
							overflow: "scroll"
						});
						var e = d.offset().top + d[0].offsetHeight - 50;
						e + b.height() > a(window).height() - 20 && (e = a(window).height() - 20 - b.height()), b.css({
							top: e,
							left: d.offset().left
						}).show(), c(d.attr("id")), a(document).click(c)
					} else a(document).unbind("click", c), c();
					return !1
				}), a("#op_" + d.attr("id")).find(">li").comboxOption(f, d)
			})
		},
		comboxOption: function(b, c) {
			return this.each(function() {
				a(">a", this).click(function() {
					var d = a(this);
					d.parent().parent().find(".selected").removeClass("selected"), d.addClass("selected"), b.text(d.text());
					var e = a("select", c);
					e.val() != d.attr("value") && a("select", c).val(d.attr("value")).trigger("change")
				})
			})
		},
		combox: function() {
			var c = [];
			return a.each(b, function(d) {
				a("#" + b[d])[0] ? c.push(b[d]) : a("#op_" + b[d]).remove()
			}), b = c, this.each(function() {
				function l() {
					var d = a("#" + g);
					return 0 == d.size() ? !1 : (a.ajax({
						type: "POST",
						dataType: "json",
						url: h.replace("{value}", encodeURIComponent(c.attr("value"))),
						cache: !1,
						data: {},
						success: function(b) {
							if (b) {
								var c = "";
								a.each(b, function(a) {
									b[a] && b[a].length > 1 && (c += '<option value="' + b[a][0] + '">' + b[a][1] + "</option>")
								});
								var e = d.parents("div.combox:first");
								d.html(c).insertAfter(e), e.remove(), d.trigger("change").combox()
							}
						},
						error: DWZ.ajaxError
					}), void 0)
				}
				var c = a(this).removeClass("combox"),
					d = c.attr("name"),
					e = c.val(),
					f = a("option[value=" + e + "]", c).text(),
					g = c.attr("ref"),
					h = c.attr("refUrl") || "",
					i = c.attr("id") || Math.round(1e7 * Math.random()),
					j = '<div class="combox"><div id="combox_' + i + '" class="select"' + (g ? ' ref="' + g + '"' : "") + ">";
				j += '<a href="javascript:" class="' + c.attr("class") + '" name="' + d + '" value="' + e + '">' + f + "</a></div></div>";
				var k = '<ul class="comboxop" id="op_combox_' + i + '">';
				a("option", c).each(function() {
					var b = a(this);
					k += '<li><a class="' + (e == b[0].value ? "selected" : "") + '" href="#" value="' + b[0].value + '">' + b[0].text + "</a></li>"
				}), k += "</ul>", a("body").append(k), c.after(j), a("div.select", c.next()).comboxSelect().append(c), g && h && c.unbind("change", l).bind("change", l)
			})
		}
	})
}(jQuery),
function(a) {
	a.extend({
		History: {
			_hash: new Array,
			_cont: void 0,
			_currentHash: "",
			_callback: void 0,
			init: function(b, c) {
				a.History._cont = b, a.History._callback = c;
				var d = location.hash.replace(/\?.*$/, "");
				if (a.History._currentHash = d, a.browser.msie) {
					"" == a.History._currentHash && (a.History._currentHash = "#"), a("body").append('<iframe id="jQuery_history" style="display: none;" src="about:blank"></iframe>');
					var e = a("#jQuery_history")[0],
						f = e.contentDocument || e.contentWindow.document;
					f.open(), f.close(), f.location.hash = d
				}
				a.isFunction(this._callback) && a.History._callback(d.skipChar("#")), setInterval(a.History._historyCheck, 100)
			},
			_historyCheck: function() {
				var b = "";
				if (a.browser.msie) {
					var c = a("#jQuery_history")[0],
						d = c.contentWindow;
					b = d.location.hash.skipChar("#").replace(/\?.*$/, "")
				} else b = location.hash.skipChar("#").replace(/\?.*$/, "");
				b != a.History._currentHash && (a.History._currentHash = b, a.History.loadHistory(b))
			},
			addHistory: function(b, c, d) {
				a.History._currentHash = b;
				var e = [b, c, d];
				if (a.History._hash.push(e), a.browser.msie) {
					var f = a("#jQuery_history")[0],
						g = f.contentDocument || f.contentWindow.document;
					g.open(), g.close(), g.location.hash = b.replace(/\?.*$/, ""), location.hash = b.replace(/\?.*$/, "")
				} else location.hash = b.replace(/\?.*$/, "")
			},
			loadHistory: function(b) {
				a.browser.msie && (location.hash = b);
				for (var c = 0; c < a.History._hash.length; c += 1)
					if (a.History._hash[c][0] == b) return a.History._hash[c][1](a.History._hash[c][2]), void 0
			}
		}
	})
}(jQuery),
function(a) {
	a.printBox = function(b) {
		var c = "printBox",
			d = b ? a("#" + b) : a("body"),
			e = a("#" + c);
		0 == e.size() && (e = a('<div id="' + c + '"></div>').appendTo("body")), e.html(d.html()).find("[layoutH]").height("auto"), window.print()
	}
}(jQuery);