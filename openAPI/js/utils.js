Utils = {};
Utils.gotoPage = function(url, params, target) {

	if (params) {

		url = url + "?" + $.param(params);
	}
	window.location.target = "_ablank ";
	window.location.href = url;

};

Utils.getCaptcha = function(imgElem, url) {

	var timenow = new Date().getTime();
	$(imgElem).attr("src", url + "?__=" + timenow);

};

Utils.bindData = function(container, obj) {
	function replace(str) {
		var patten = "";
		for ( var name in obj) {

			patten = new RegExp("\\$" + name +"(?!\\w+)", "g");

			str = str.replace(patten, obj[name]);

		}
		return str;

	}
	;

	function handleUnmatch(str) {

		var patten = new RegExp("\\$\\w+", "g");
		str = str.replace(patten, "");

		return str;
	}
	;

	function handleAttr(attr) {
		var val = container.attr("@" + attr);
		if (val) {
			val = replace(val);

			// container.removeAttr("@" + attr);

			container.attr(attr, val);

		}

	}
	;

	var html, patten;

	html = container.html() + "";

	if (typeof obj == "object") {

		html = replace(html);

	} else {

		html = obj + "";
	}

	// @src @href 处理
	patten = /@((href)|(src))/gi;
	html = html.replace(patten, "$1");

	// dom属性中的@src @href处理
	handleAttr("src");
	handleAttr("href");
	handleAttr("id");
	handleAttr("value");
	handleAttr("name");
	handleAttr("data");
	handleAttr("text");
	handleAttr("title");

	html = handleUnmatch(html);

	container.html(html);
};

Utils.bindList = function(container, itemTmpl, list, actions, onBind) {
	// bind product items
	var itemMod = $(itemTmpl).eq(0);

	var frame = document.createDocumentFragment();

	for (var i = 0; i < list.length; i++) {

		var item = itemMod.clone(true);

		item.removeAttr("id");

		Utils.bindData(item, list[i]);

		item.show();

		// action binding
		if (actions) {
			Utils.bindAction(item, actions);
		}

		if (onBind) {

			onBind(item, list[i]);
		}

		frame.appendChild(item[0]);

	}

	$(container).append(frame);
};

Utils.bindAction = function(viewElem, actions) {

	var events = [ "click", "changed" ];

	var fn = function(evt) {

	}

	var attr = "";
	for (var i = 0; i < events.length; i++) {

		attr = "[" + events[i] + "]";

		switch (events[i]) {
		case 'click':
			$(viewElem).find(attr).click(function() {

				var action = $(this).attr('click');
				actions[action](this);
			});
			break;
		case 'changed':
			$(viewElem).find(attr).change(function() {

				var action = $(this).attr('changed');
				actions[action](this);
			});
			break;

		}

	}

};

Utils.bindProps = function(viewElem, props, direct) {

	function collect(props) {

		$(viewElem)
				.find("input")
				.each(
						function(index, elem) {

							elem = $(elem);
							if (!elem.attr("name") || !elem.val()
									|| (elem.val() == "")) {
								return;
							}

							switch (elem.attr("type")) {

							case "checkbox":
								if (elem.attr("checked")) {
									if (elem.attr("group")) {
										var data = props[elem.attr("name")];
										if (!data) {
											data = props[elem.attr("name")] = [];
										}
										props[elem.attr("name")][data.length] = elem
												.val();
									} else {

										props[elem.attr("name")] = elem.val();
									}

								}
								break;
							case "radio":
								if (elem.attr("checked")) {
									props[elem.attr("name")] = elem.val();
								}
								break;
							case "text":
							case "hidden":
							case "password":
							default:
								if (!elem.attr("name") || (elem.val() == "")) {
									break;
								}
								if (props[elem.attr("name")]) {

									props[elem.attr("name")] = props[elem
											.attr("name")]
											+ "," + elem.val();
								} else {
									props[elem.attr("name")] = elem.val();
								}

							}

						});

		$(viewElem).find("select").each(function(index, elem) {
			props[$(elem).attr("name")] = $(elem).val();
		});
		$(viewElem).find("textarea").each(function(index, elem) {
			props[$(elem).attr("name")] = $(elem).val();
		});
	}

	function fillElem(elem, data) {

		if (elem.attr("type") == "checkbox" || elem.attr("type") == "radio") {

			var val = $(elem).val() + "";

			if (val == (data + "")) {

				elem.attr("checked", true);
			}

		} else if (elem.is("input") || (elem.is("textarea"))
				|| (elem.is("select"))) {
			elem.val(data);

		} else {
			elem.html(data);
		}

	}

	function fill(props) {

		var elems = {};

		for ( var p in props) {

			elems = $(viewElem).find("[name='" + p + "']");

			if (elems.lenght <= 0) {

				break;
			}

			// is array
			if ($.isArray(props[p])) {

				$.each(props[p], function(index, data) {

					$(elems).each(function(index, elem) {

						if ($(elem).val() == (data + "")) {
							fillElem($(elem), data);
						}
					});

				});

			} else {

				elems.each(function(index, elem) {

					fillElem($(elem), props[p]);
				});

			}

		}

	}

	if (direct) {
		fill(props);
	} else {
		collect(props);
	}

};

Utils.getUrlParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var str = window.location.search.substr(1);
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
};

Utils.getUrlParams = function getParameters() {
	var searchString = window.location.search.substring(1), params = searchString
			.split("&"), hash = {};

	if (searchString == "")
		return {};
	for (var i = 0; i < params.length; i++) {
		var val = params[i].split("=");
		hash[unescape(val[0])] = unescape(val[1]);
	}
	return hash;
};

Utils.addRules = function(rules) {

	$.extend($.fn.validatebox.defaults.rules, rules);

};

Utils.debug = function(msg) {
	window.console
			&& ((window.console.debug && (console.debug(msg) || 1)) || (window.console.log && console
					.log(msg)));
}

Utils.error = function(msg) {
	window.console
			&& ((window.console.error && (console.error(msg) || 1)) || (window.console.log && console
					.log(msg)));
}

Utils.warn = function(msg) {
	window.console
			&& ((window.console.warn && (console.warn(msg) || 1)) || (window.console.log && console
					.log(msg)));
}

Utils.log = function(msg) {
	window.console && window.console.log && console.log(msg);
}

$.fn.extend({
	makeform : function(options) {

		var opt = {
			type : 'post',
			dataType : 'json'

		};

		this.each(function() {
			var $this = $(this);
			$.extend(opt, options, {
				// beforeSubmit : function() {
				//                   
				// var canSubmit = $this.form('validate');
				//                    
				// return canSubmit;
				// },

				success : function(data) {
					if (options.onsuccess) {
						options.onsuccess(data);
					}
				}

			});

			$this.unbind("submit");
			$this.submit(function() {

				if (opt.submit) {

					opt.submit();

				} else {
					$(this).ajaxSubmit(opt);
				}

				return false;
			});

		});

	},

	cleanForm : function() {

		$(this).form("clear");
	},
	disableForm : function() {
		$(this).find(':input').each(function() {
			if (this.type != "button") {
				$(this).attr("disabled", "disabled");
			}
		});
	}

});

Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
PorletLoader = {
    loadPorlet: function(container, porlets) {

        if (!porlets)
        {
            return;
        }

        for (var i = 0; i < porlets.length; i++) {

            if (!porlets[i].link || porlets[i].link === "") {

                return;
            }

            (function(arg) {
                var porlet = porlets[arg];
                $("#" + container).load(porlet.link, function() {
                    if (porlet.datas) {
                        var fn = porlet.name + ".render(porlet.datas)";
                        eval(fn);
                    }else  if (porlet.dataurl){
                        
                         var fn = porlet.name + ".init(porlet.dataurl)";
                        eval(fn);
                    }
                });

            })(i);
        }
    },
    loadPageConfig: function(url) {

        $.getJSON(url, function(data) {

            for (var container in data) {

                PorletLoader.loadPorlet(container, data[container]);

            }

        });


    }

};
