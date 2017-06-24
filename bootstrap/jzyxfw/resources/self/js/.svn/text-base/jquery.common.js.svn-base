(function ($) {
    $.fn.vTable = function (data, title) {
        var html = "<table class='table table-condensed  table-hover' style='table-layout: fixed;'>";
        html += "<thead><tr class=''>"
        for (var j = 0; j < title.length; j++) {
            if (title[j].unVisible) {
                continue;
            }
            html += "<th width='" + title[j].width + "px'>" + title[j].name + "</th>";
        }
        html += "</tr></thead><tbody>";
        for (var i = 0; i < data.length; i++) {
            html += "<tr class='";
            if (i % 2 === 0) {
                html += "odd";
            } else {
                html += "even";
            }
            html += "'>";
            for (var j = 0; j < title.length; j++) {
                if (title[j].unVisible) {
                    continue;
                }
                var node = data[i][title[j].data];
                // 替换可能的undifined
                // @wangyi 2015-6-19 修改，把0给弄没了
                if (node === "null" || node === null || node === undefined) {
                    node = "";
                }
                html += "<td ><div class='over-h'   title='" + node + "'>" + node + "</div></td>";
            }
            html += "</tr>";
        }
        html += "</tbody><tfoot><tr></tr></tfoot></table>";
        $(this).html(html).find(">table>tbody>tr").on("getRowData", function () {
            //_log("debug");
            return data[$(this).index()];
        });
        //$(this).find("[title]").tooltip({
        //    placement: 'top',
        //    trigger: "hover",
        //    delay: {
        //        "show": 200,
        //        "hide": 50
        //    }
        //});

    };
})(jQuery);
/**
 * 表单校验部分 1.加入参数，校验成功不显示正确
 *  深入依赖规定的格式
 */
(function ($) {
    $.fn.vali_Ele = function (settings) {
        //_log("debug");
        // 2015-4-8 @wangyi :  没有变为空对象
        var opt = $.extend({}, $.vvPluginDefault.vali_Ele, settings);
        /* 2015-4-9 @wangyi  考虑到有隐藏表单，无需校验
         * 2015-4-22 @wangyi 但是标签页的校验就会失效哦 */
        // 选择只校验可见元素对于隐藏元素可以跳过 ,或者他的属性值是空的
        if (!$(this).attr("validation") || (opt.visible && $(this).is(":hidden")) || $(this).is(".no-vali")) {
            //_log("test pass");
            return true;
        }
        var validation = $(this).attr("validation");
        var value = $(this).val();
        var $display = $(this).closest(".form-group");
        //var $form = $(this).closest("form");
        //@wangyi 2015-6-9 修改了方式，深度依赖格式，label和对应的必须在form-group下
        //@wangyi 2015-6-14 这里有特殊的情况，如果input-group会向上找两层
        var _parent = $(this).parent();
        if (!_parent.hasClass("form-group")) {
            _parent = _parent.parent();
        }
        var $msg = _parent.find("label[for='" + $(this).attr("name") + "']");
        removeClass($display);
        removeMsg($msg);
        // 准备结束
        var valis = validation.split("|");
        for (var i = 0; i < valis.length; i++) {
            var checkResult = validateFunc(value, valis[i], $(this));
            if (checkResult !== 0) {
                $(this).display_Error(checkResult, opt.fail_show_type, $display, $msg);
                return false;
            }
        }
        if (opt.succ_show_type === 'none') {
            // 2015-3-27 @wangyi :  do nothing but stand for extend
        } else {
            $display.addClass("has-success");
            $msg.after("<div class='extendinfo label label-success pull-right'><i class='fa fa-check-circle'></i></div>");
        }
        return true;
    };
    $.fn.vali_Ele_Outer = function () {
        var $this = $(this);
        if (!$this.attr("validation")) {
            //_log("test pass");
            return true;
        }
        var valis = $this.attr("validation").split("|");
        for (var i = 0; i < valis.length; i++) {
            var checkResult = validateFunc($this.val(), valis[i]);
            if (checkResult !== 0) {
                return checkResult;
            }
        }
        return true;

    };
    //独立出来可以给外部调用
    $.fn.display_Error = function (checkResult, fail_show_type, $display, $msg) {
        if (!$display) {
            $display = $(this).closest(".form-group");
            $msg = $display.find("label");
            removeClass($display);
            removeMsg($msg);
        }
        if (fail_show_type === 'none') {
            // 2015-3-27 @wangyi : do nothing
        } else if (fail_show_type === 'alertMsg') {
            alertMsg("校验失败：（" + $msg.text() + "）" + checkResult);
        } else if (fail_show_type === 'alertMsg_B') {
            alertMsg_B("校验失败：（" + $msg.text() + "）" + checkResult);
        } else {
            // 出现错误
            $display.addClass("has-error");
            $msg.after("<div class='extendinfo label label-danger pull-right'><i class='fa fa-minus-circle mg-r-2'></i>" + checkResult + "</div>");
            // 2015-2-26 @wangyi : 增加一个提示动画效果
            $msg.nextAll(".extendinfo").animate({
                marginRight: 70
            }, 200, null, function () {
                $msg.nextAll(".extendinfo").animate({
                    marginRight: 0
                }, 200);
            });
        }
    };
    $.fn.vali_Form = function (settings) {
        var ok = true,
            opt = $.extend({}, $.vvPluginDefault.vali_Form, settings);
        $(this).find("[validation]").each(function () {
            if (!$(this).vali_Ele(opt) && ok) {
                ok = false;
                // 2015-3-27 @wangyi :  特殊，不能全部校验所有元素
                if (opt.fail_show_type === "alertMsg" || opt.fail_show_type === "alertMsg_B") {
                    return ok;
                }
            }
        });
        return ok;
    };
    /* 为了帮助实现多个标签页+隐藏标签的校验，需要在切换时，更新class 让他不去校验 */
    $.fn.initPanelState = function () {
        var $form = $(this);
        $form.find("[role='presentation']").each(function () {
            $(this).parent().removeClass("color-bd-g color-bd-r");
            var $eles = $form.find("#" + $(this).find("a").attr("aria-controls")).find("[validation]");
            if ($(this).is(":visible")) {
                $eles.each(function () {
                    $eles.removeClass("no-vali");
                })
            } else {
                $eles.each(function () {
                    $eles.addClass("no-vali");
                })
            }

        });
    }
    /* 当出现分多个标签页进行校验时，会用到*/
    $.fn.displayPanelTitle = function () {
        var $form = $(this);
        $form.find(".tab-content [role='tabpanel']").each(function () {
            var $li = $form.find("a").filter("[aria-controls='" + $(this).attr("id") + "']");
            $li.removeClass("color-bd-g color-bd-r");
            if (!$li.is(":hidden")) {
                if ($(this).hasError()) {
                    $li.addClass("color-bd-r");
                } else {
                    //$li.addClass("color-bd-g");
                }
            }
        });
    }

    $.fn.hasError = function () {
        return $(this).getErrorEles().length > 0 ? true : false;
    };
    $.fn.getErrorEles = function () {
        // 2015-4-15 @wangyi 增加去除隐藏元素
        // 2015-4-22 @wangyi 去掉        .filter(":visible")  ,增加 no-vali 有此class 不会校验
        return $(this).find(".label-danger").filter(".extendinfo").not(".no-vali");
    };
    $.fn.removeError = function () {
        var $form = $(this);
        if ($form.hasClass("form-control")) {
            return $form.removeSingleError();//有这个肯定是自己lo
        }
        $form.find("[validation]").each(function () {
            $(this).removeSingleError();
        });
        return $form;
    };
    $.fn.removeSingleError = function () {
        var $group = $(this).closest(".form-group");
        removeClass($group);
        removeMsg($group.find("label[for='" + $(this).attr("name") + "']"));
    };
    $.fn.addLabel = function (info, labelType) {
        // @wangyi 2015-6-9 改造主要缘起：需要定义css，需要定义点击function，所以直接反回对象后随便操作了
        var $label = $("<span>" + info + "</span>");
        $label.addClass("label label-" + labelType + " mg-l-5 user_label_info");
        if ($(this).is("label")) {//更改判断类型，更自由
            $(this).append($label);
        } else {
            var _parent = $(this).parent();
            if (!_parent.hasClass("form-group")) {
                _parent = _parent.parent();
            }
            _parent.find("[for='" + $(this).attr("name") + "']").append($label);
        }
        return $label;
    };
    $.fn.delLabel = function () {
        if ($(this).attr("for")) {
            $(this).find(".label").filter(".user_label_info").remove();
        } else {
            $(this).closest("form").find("[for='" + $(this).attr("name") + "']").find(".label").filter(".user_label_info").remove();
        }
    }
    $.fn.displayNec_Ele = function (style) {
        var validation = $(this).attr("validation");
        //var $form = $(this).closest("form");
        var _parent = $(this).parent();
        if (!_parent.hasClass("form-group")) {
            _parent = _parent.parent();
        }
        var $msg = _parent.find("label[for='" + $(this).attr("name") + "']");
        if (validation.indexOf("required") !== -1) {
            if (style === "simple")
                $msg.append('<span class="text-danger mg-l-2">*</span>');
            else
                $msg.addLabel("必要", "warning");
        } else {
            if (style !== "simple")
                $msg.addLabel("可选", "primary");
        }
    };
    $.fn.displayNec_Form = function (style) {
        $(this).find("[validation]").each(function () {
            $(this).displayNec_Ele(style);
        });
    };
    function removeClass($obj) {
        $obj.removeClass("has-success");
        $obj.removeClass("has-error");
    }

    function removeMsg($obj) {
        $obj.nextAll(".extendinfo").remove();
    }

    function validateFunc(value, rule, $obj) {
        // @wangyi 小改造下结构
        if (rule === "required") {
            if (!checkNecessaryStr(value)) {
                return "此项必须填写";
            }
        } else if (rule.indexOf("default=") !== -1) {
            /* @wangyi 20150416 增加一个校验，其实也不算，算是一个功能正好套用在这里了 */
            if (!checkNecessaryStr(value)) {
                $obj.val(rule.split("=")[1]);
            }
        } else {
            if (checkNecessaryStr(value)) {
                if (rule === "num") {
                    if (isNaN(value)) {
                        return "请输入正确的数字";
                    }
                } else if (rule === "int") {
                    var regx = /^[0-9]*$/;
                    if (!regx.test(value)) {
                        return "只可输入数字0~9";
                    }
                } else if (rule === "date") {
                    value = getSimpleDate(value);
                    if (!checkDate(value)) {
                        return "日期不合法请重新填写";
                    }
                } else if (rule === "password") {
                    var regx = /^[a-zA-Z0-9_]*$/;
                    if (!regx.test(value)) {
                        return "只可输入字母数字下划线";
                    }

                } else if (rule === "nodoubleY") {
                    if (value.indexOf("\"") !== -1) {
                        return "引号是不允许的";
                    }
                } else if (rule === "noenter") {
                    if (value.indexOf("\n") !== -1) {
                        return "不允许出现回车符";
                    }
                } else if (rule === "nospecial") {
                    /* @wangyi 2015-7-2增加校验 前后台交互的json中出现特殊字符，所以在前台的录入要进行校验   */
                    if (value.indexOf("\'") !== -1) {
                        return "单引号是不允许的";
                    }
                    if (value.indexOf("\"") !== -1) {
                        return "引号是不允许的";
                    }
                    if (value.indexOf("\n") !== -1) {
                        return "不允许出现回车符";
                    }
                } else if (rule.substr(0, 3) === "len") {
                    var length = rule.split("=")[1];
                    if (value.length != length) {
                        return "此项的长度应为" + length;
                    }
                } else if (rule.indexOf("maxdate=") !== -1) {
                    var maxdate = rule.split("=")[1];
                    var maxdateval = getSimpleDate(maxdate);
                    value = getSimpleDate(value);
                    if (value > maxdateval) {
                        return "超过最大日期范围:" + maxdate;
                    }

                } else if (rule.indexOf("max=") !== -1) {
                    var max = rule.split("=")[1];
                    if (formatFloat(value) > max) {
                        return "此项最大值为" + max;
                    }
                } else if (rule.indexOf("min=") !== -1) {
                    var min = rule.split("=")[1];
                    if (formatFloat(value) < min) {
                        return "此项最小值为" + min;
                    }
                } else if (rule.indexOf("maxlen=") !== -1) {
                    var maxlength = rule.split("=")[1];
                    if (value.length > maxlength) {
                        return "此项最大长度为" + maxlength;
                    }
                } else if (rule.indexOf("minlen=") !== -1) {
                    var minlength = rule.split("=")[1];
                    if (value.length < minlength) {
                        return "此项最小长度为" + minlength;
                    }
                } else {
                    _log("vali element not matching：" + rule + "(" + $obj.attr("name") + ")");

                }
            }
        }

        return 0;
    }
})
(jQuery);
/*
 *  2015-6-8更新：增加autocomplete
 *
 *
 * */

(function ($) {
    $.fn.load_Selection = function (settings) {
        var opt = $.extend({}, $.vvPluginDefault.load_Selection, settings), $selectObj = $(this), cacheValue = null,
            request_param = $.extend(opt.param, {
                codetype: opt.codetype,
                condition: opt.condition
            }), condition = $.param(request_param);
        if ($selectObj.attr("data-defaultVal")) {
            opt.defaultVal = $selectObj.attr("data-defaultVal");
        }
        if (opt.autocomplete) {
            var $new;
            var _outerWidth = $(this).outerWidth();
            if ($(this).is("select")) {
                var $parent = $(this).parent();
                var _name = $(this).attr("name")
                var _html = "<input class='" + $(this).attr("class") + "' name='" + _name + "'/>";
                $(this).after(_html);
                $(this).remove();
                $new = $parent.find("[name='" + _name + "']");
            } else {
                $new = $(this);
            }
            $new.autocomplete({
                minLength: opt.minLength,
                source: function (request, response) {
                    var condition = request.term;
                    var _cache = null;
                    if (opt.cache) {
                        _cache = $("body").data(opt.url + "|" + opt.codetype + "|" + condition);
                        if (_cache) {
                            response(_cache);
                            return;
                        }
                    }
                    //自定后台传递名称
                    opt.param[opt.paramName] = condition;
                    commonAjax_none(opt.url, request_param, function (data) {
                        data = $.map(data, function (item) {
                            return opt.needCode ? {
                                label: item.CODE + "--" + item.CODENAME,
                                value: item.CODE + "--" + item.CODENAME,
                                CODE: item.CODE,
                                CODENAME: item.CODENAME
                            } : {
                                label: item.CODE,
                                value: item.CODE + "--" + item.CODENAME,
                                CODE: item.CODE,
                                CODENAME: item.CODENAME
                            }
                        });
                        if (opt.cache)
                            $("body").data(opt.url + "|" + opt.codetype + "|" + condition, data);
                        response(data);
                    }, {dataType: "json"});

                },
                select: opt.selectFunc
                , appendTo: opt.container
            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append(item.label)
                    .appendTo(ul).css("width", _outerWidth);
            };
            $new.autocomplete("instance")._resizeMenu = function () {
                this.menu.element.outerWidth(_outerWidth);
            };
            $new.on("change", function () {
                if ($new.val() === "") {
                    opt.selectFunc(null, {
                        item: {code: ""}
                    })
                }
            });
        } else {
            initElement($selectObj);
            if (opt.cache) {
                cacheValue = $("body").data(opt.url + "|" + opt.codetype + "|" + condition);
            }

            if (cacheValue) {
                displayResult(cacheValue, $selectObj, opt);
                if (opt.loadComplete) {
                    opt.loadComplete(cacheValue, $selectObj);
                }
            } else {
                commonAjax_none(opt.url, request_param, function (msg) {
                    $("body").data(opt.url + "|" + opt.codetype + "|" + condition, msg);

                    displayResult(msg, $selectObj, opt);
                    if (opt.loadComplete) {
                        opt.loadComplete(msg, $selectObj);
                    }
                    //@wangyi 2015-6-3 如果页面中存在大量select可能导致假死，而且select操作不费时，使用同步的方式加载
                    //FIXME 这里如果很多太耗费时间，应当改造
                }, {async: false});

            }
        }
        // 链式
        return this;
    };
    $.fn.load_Dictionary = function (settings, successFunc, param) {
        var opt = $.extend({}, $.vvPluginDefault.load_Selection, settings), cacheValue = null,
            request_param = $.extend(opt.param, {
                codetype: opt.codetype,
                condition: opt.condition
            }), condition = $.param(request_param);
        if (opt.cache) {
            cacheValue = $("body").data(opt.url + "|" + opt.codetype + "|" + condition);
        }
        if (!cacheValue) {
            if (successFunc) {
                commonAjax_none(opt.url, request_param, function (msg) {
                    $("body").data(opt.url + "|" + opt.codetype + "|" + condition, msg);
                    successFunc(msg, param);
                });
            } else {
                commonAjax_none(opt.url, request_param, function (msg) {
                    $("body").data(opt.url + "|" + opt.codetype + "|" + condition, msg);
                    cacheValue = msg;
                }, {async: false});
                return cacheValue;
            }
        } else {
            if (successFunc) {
                successFunc(cacheValue, param);
            } else {
                return cacheValue;
            }
        }
    };
    $.fn.set_Dictionary = function (settings, data) {
        var opt = $.extend({}, $.vvPluginDefault.load_Selection, settings),
            request_param = $.extend(opt.param, {
                codetype: opt.codetype,
                condition: opt.condition
            }), condition = $.param(request_param);
        $("body").data(opt.url + "|" + opt.codetype + "|" + condition, data);
        return $(this);
    };
    $.fn.load_Selection_Static = function (settings, data) {
        var opt = $.extend({}, $.vvPluginDefault.load_Selection, settings), $selectObj = $(this);
        displayResult(data, $selectObj, opt);
        return $selectObj;
    };

    function initElement($selectObj) {
        $selectObj.empty();
        $selectObj.append("<option value=''>正在加载...</option>");
        $selectObj.prop("disabled", true);
    }

    function displayResult(msg, $selectObj, opt) {
        $selectObj.empty();
        var datas = evalV(msg), html = "";
        if (opt.needEmpty && !$selectObj.attr("multiple")) {
            html += "<option value=''>请选择</option>";
        }
        for (var i = 0; i < datas.length; i++) {
            html += "<option value='" + datas[i].CODE + "' codealias='" + datas[i].CODEALIAS + "'>" + ((opt.needCode && !opt.newMode) ? (datas[i].CODENAME + " -- " + datas[i].CODE) : datas[i].CODENAME) + "</option>";
        }
        $selectObj.append(html);
        $selectObj.prop("disabled", false);
        $selectObj.val(opt.defaultVal);
        var $newMode_input;
        var $new;
        if (opt.newMode) {
            //_log("debug");
            $new = $selectObj.next();
            if ($new.length == 0 || $new.attr("name") !== $selectObj.attr("name") + "_new_wrapper") {
                $new = $selectObj.initNewMode_Selection(opt.placeholder);
            }
            if (!$new.hasClass("init-over")) {
                $selectObj.change(function () {
                    $new.trigger("oldChange");
                });
                $new.on("oldChange", function () {
                    //_log("oldChange");
                    if (!$selectObj.val())
                        $new.find(">input").val("");
                    else
                        $new.find(">input").val(opt.needCode ? ($selectObj.val() + "--" + $selectObj.find("option:selected").text()) : $selectObj.find("option:selected").text());
                }).addClass("init-over").trigger("oldChange");
            }
            //@wangyi 初始化后同步
            if ($selectObj.val())
                $new.find(">input").val(opt.needCode ? ($selectObj.val() + "--" + $selectObj.find("option:selected").text()) : $selectObj.find("option:selected").text());
            $newMode_input = $new.find(">input");
            var $newMode_addon = $new.find(">.input-group-addon");
            var _outerWidth = $new.outerWidth();
            var newData = $.map(datas, function (item) {
                return opt.needCode ? {
                    label: item.CODE + "--" + item.CODENAME,
                    value: item.CODE + "--" + item.CODENAME,
                    CODE: item.CODE,
                    CODENAME: item.CODENAME
                } : {
                    label: item.CODENAME,
                    value: item.CODENAME,
                    CODE: item.CODE,
                    CODENAME: item.CODENAME
                }
            });
            $newMode_input.autocomplete({
                source: newData
                , select: function (e, ui) {
                    $newMode_input.val(ui.item.label);
                    $selectObj.val(ui.item.CODE).trigger("change");
                    return false;//不使用默认的赋值
                }
                , appendTo: opt.container,
                minLength: 2
                , search: function () {
                    return false;
                }
            }).change(function () {
                //用在当input框清空了之后的清空，需要有空值的option
                if ($(this).val() === "") {
                    $selectObj.val("").trigger("change");
                }
            }).on("input propertychange", function () {
                _outerWidth = $new.outerWidth();
            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append(item.label)
                    .appendTo(ul).css("width", _outerWidth);
            };
            $newMode_input.autocomplete("instance")._resizeMenu = function () {
                this.menu.element.outerWidth(_outerWidth);
            };
            var isShowing;
            $newMode_addon.mousedown(function () {
                var input = $newMode_input;
                if (input.autocomplete("widget").is(":visible")) {
                    isShowing = true;
                } else
                    isShowing = false;
            }).click(function () {
                if (isShowing) {
                    return
                }
                _outerWidth = $new.outerWidth();
                var input = $newMode_input;
                input.focus();
                input.autocomplete("instance")._search("");
            });
        }
        /* IE中总会出现一个悬浮框，很奇怪 */
        //@wangyi 2015-8-10 这里的方式是为了方便操作吧
        if (datas.length === 1) {
            $selectObj.val(datas[0].CODE);
        }
        $selectObj.trigger("change").blur();
        if ($newMode_input) {
            setTimeout(function () {
                $newMode_input.autocomplete("option", "search", function () {
                    return true;
                });
            }, 500);
        }
    }

    $.fn.initNewMode_Selection = function (placeholder) {
        var $selectObj = $(this);
        var oldName = $selectObj.attr("name");
        var newSize = "";
        if ($(this).hasClass("input-sm")) {
            newSize = "input-group-sm";
        } else if ($selectObj.hasClass("input-xs")) {
            newSize = "input-group-xs";
        }
        var newHtml = '<div class="input-group ' + newSize + '" name="' + oldName + '_new_wrapper">';
        newHtml += '<input type="text" placeholder="' + placeholder + '" class="form-control" name="' + oldName + '_new_input">';
        newHtml += '<span class="input-group-addon color-bg-w" name="' + oldName + '_new_addon" style="padding:5px;"><i class="fa fa-caret-down"></i></span></div>';
        var $new = $(newHtml);
        $selectObj.css({"position": "absolute", "top": "-9999px"});//解决有的是拿元素是否可见做的校验
        $new.insertAfter($selectObj);
        return $new;
    }
})(jQuery);

/**
 * 数据中的参数包括
 * top，left，id，name，renderTo，css，cssClass,title等
 *
 * @wangyi 20150414 增加提示框方向、增加对于renderTo的转换
 */
(function ($) {
    $.fn.vProcess = function (settings) {
        var defaults = {
            title_direct: 'top',
            label_head: '',
            width: 150,
            top: 100,
            left: 50,
            x_step: 300,
            y_step: 150,
            direct: 1,
            move_able: false,
            simple_datas: null,
            complex_datas: null,
            lineFunc: undefined,
            program: false,
            title_direct: "auto"
        }, opt = $.extend(defaults, settings), $processOjb = $(this), width = $processOjb.width(), html = "<div class='flowcontent'>", random_id = $processOjb.attr("id"), complex_default = {
            top: 0,
            left: 0
        }, complex_opt, org_left = opt.left;
        if (opt.simple_datas) {
            // 2015-3-16 @wangyi : 首先计算宽度
            var size = parseInt((width - 2 * org_left - opt.width) / opt.x_step);
            if (size < 0) {
                // 2015-3-16 @wangyi : 至少为1
                size = 0
            }
            //第一个只需要150宽度即可
            size += 1;
            for (var i = 0; i < opt.simple_datas.length; i++) {
                if (typeof opt.simple_datas[i] == "object") {
                    html += getNodeHtml(opt, opt.left, opt.top, random_id, i, opt.simple_datas[i].name, opt.simple_datas[i].cssClass, opt.simple_datas[i].title);
                } else {
                    html += getNodeHtml(opt, opt.left, opt.top, random_id, i, opt.simple_datas[i], null, null);
                }
                opt.left += opt.direct * opt.x_step;
                // 2015-3-17 @wangyi :  此处的逻辑应当调整
                if ((i + 1) % size == 0) {
                    if (opt.direct == -1) {
                        opt.left = org_left;
                    } else {
                        // u n y?
                        opt.left = org_left + (size - 1) * opt.x_step;
                    }
                    opt.direct = opt.direct * -1;
                    opt.top += opt.y_step;
                }
            }
        } else if (opt.complex_datas) {
            for (var i = 0; i < opt.complex_datas.length; i++) {
                if (!opt.complex_datas[i].left) {
                    opt.complex_datas[i].left = 100;
                }
                if (!opt.complex_datas[i].top) {
                    opt.complex_datas[i].top = 100;
                }
                html += getNodeHtml(opt, opt.complex_datas[i].left, opt.complex_datas[i].top, random_id, opt.complex_datas[i].id, opt.complex_datas[i].name,
                    opt.complex_datas[i].cssClass, opt.complex_datas[i].title)
            }
            if (opt.program) {
                html += "<input type='button' name='export' value='导出信息'><textarea name='export_info' style='width:500px;height:200px;'></textarea>";
            }
        }
        html += "</div>";

        $processOjb.html(html);
        if (opt.simple_datas) {
            for (var i = 0; i < opt.simple_datas.length; i++) {
                if (typeof opt.simple_datas[i] == "object") {
                    if (opt.simple_datas[i].css) {
                        for (var i = 0; i < opt.simple_datas.length; i++) {
                            if (opt.simple_datas[i].css) {
                                $("#node_" + random_id + i).css(opt.simple_datas[i].css);
                            }
                        }
                    }
                }
            }
        } else if (opt.complex_datas) {
            for (var i = 0; i < opt.complex_datas.length; i++) {
                if (opt.complex_datas[i].css) {
                    $("#node_" + random_id + opt.complex_datas[i].id).css(opt.complex_datas[i].css);
                }
            }
        }
        // 2015-3-17 @wangyi :  提示框
        $processOjb.find(".w").popover({
            placement: opt.title_direct,
            trigger: "hover",
            delay: {
                "show": 200,
                "hide": 50
            },
            html: true
        });
        //		$processOjb.find(".w").tooltip({
        //			html : true,
        //			placement : opt.title_direct,
        //			template:'<div class="tooltip" role="tooltip" style="backgroud-color:red;"><div class="tooltip-arrow" style="backgroud-color:red;"></div><div class="tooltip-inner"></div></div>'
        //		});

        $processOjb.find("[name='export']").click(function () {
            $processOjb.find("[name='export_info']").val(exportElements(opt.complex_datas, random_id));
        });

        var instance = initJsPlumb($processOjb.attr("id"), opt.complex_datas);
        var windows = jsPlumb.getSelector("#" + $processOjb.attr("id") + " .flowcontent .w");
        // 可以拖动
        if (opt.move_able) {
            instance.draggable(windows);
        }
        if (opt.lineFunc) {
            instance.bind("connection", opt.lineFunc);
            // function(info) {
            // 更改连线名称
            // info.connection.getOverlay("label").setLabel("流转");
            // });
        }
        // suspend drawing and initialise.
        instance.batch(function () {
            instance.makeSource(windows, {
                filter: ".ep",
                anchor: "Continuous",
                connector: "Straight",
                connectorStyle: {
                    strokeStyle: "#839178",
                    lineWidth: 2,
                    outlineColor: "transparent",
                    outlineWidth: 4
                }
                // maxConnections : 5,
                // onMaxConnections : function(info, e) {
                // alert("Maximum connections (" + info.maxConnections + ")
                // reached");
                // }
            });

            // 连线
            instance.makeTarget(windows, {
                dropOptions: {
                    hoverClass: "dragHover"
                },
                anchor: "Continuous",
                allowLoopback: true
            });
            if (opt.simple_datas) {
                for (var i = 0; i < opt.simple_datas.length; i++) {
                    if (opt.simple_datas[i + 1]) {
                        instance.connect({
                            source: "node_" + random_id + i,
                            target: "node_" + random_id + (i + 1)
                        });
                    }
                }
            } else if (opt.complex_datas) {
                for (var i = 0; i < opt.complex_datas.length; i++) {
                    if (opt.complex_datas[i].renderTo) {
                        // 2015-4-14 @wangyi :  此处因为后台传输的数据为 "[0]",实际是数组
                        if (typeof opt.complex_datas[i].renderTo == "string") {
                            opt.complex_datas[i].renderTo = eval(opt.complex_datas[i].renderTo);
                        }
                        for (var j = 0; j < opt.complex_datas[i].renderTo.length; j++) {
                            //_log("source:" + opt.complex_datas[i].id + ",target:" + opt.complex_datas[i].renderTo[j]);
                            if (typeof opt.complex_datas[i].renderTo[j] == "object") {
                                instance.connect({
                                    source: "node_" + random_id + opt.complex_datas[i].id,
                                    target: "node_" + random_id + opt.complex_datas[i].renderTo[j].target,
                                    // 2015-3-16 @wangyi : 增加标签
                                    overlays: [["Label", {
                                        label: opt.complex_datas[i].renderTo[j].lineName,
                                        id: "label",
                                        cssClass: "aLabel"
                                    }]]
                                });
                            } else {
                                instance.connect({
                                    source: "node_" + random_id + opt.complex_datas[i].id,
                                    target: "node_" + random_id + opt.complex_datas[i].renderTo[j]
                                });
                            }
                        }
                    }
                }
            }
        });
    };
    function getNodeHtml(opts, left, top, random_id, id, name, cssClass, title) {
        var html = "<div class='label-front'><div class='w label label-default";
        if (cssClass) {
            html += " " + cssClass;
        }
        html += "' id='node_" + random_id + id + "' style='left:" + left + "px;top:" + top + "px;width:" + opts.width + "px' ";
        if (title) {
            html += " title='" + opts.label_head + "' data-content='" + title + "'";
        }
        html += " >" + name + "</div></div>";
        return html;
    }

    function initJsPlumb(id, obj) {
        var setting = {};
        // 2015-3-16 @wangyi : 暂时废弃
        if (false) {
            setting = {
                // 箭头上的文字和选中效果
                label: "FOO",
                id: "label",
                cssClass: "aLabel"
            }
        }
        return jsPlumb.getInstance({
            Endpoint: ["Dot", {
                radius: 2
            }],
            HoverPaintStyle: {
                strokeStyle: "#5bc0de",
                lineWidth: 2
            },
            ConnectionOverlays: [["Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            }], ["Label", setting]],
            Container: id
        });
    }

    function exportElements(complex_datas, random_id) {
        if (!complex_datas)
            return;
        for (var i = 0; i < complex_datas.length; i++) {
            complex_datas[i].top = parseInt($("#node_" + random_id + complex_datas[i].id).position().top);
            complex_datas[i].left = parseInt($("#node_" + random_id + complex_datas[i].id).position().left);
        }
        return JSON.stringify(complex_datas);
    }

})(jQuery);
(function ($) {
    var _Cal = [{X: "X", Y: "-1*R+Y"}, {X: "0.707*R+X", Y: "-0.707*R+Y"}, {
        X: "R+X",
        Y: "Y"
    }, {X: "0.707*R+X", Y: "0.707*R+Y"}, {X: "X", Y: "R+Y"}, {X: "-0.707*R+X", Y: "0.707*R+Y"}, {
        X: "-1*R+X",
        Y: "Y"
    }, {X: "-0.707*R+X", Y: "-0.707*R+Y"}];
    // @wangyo 2015-5-4 圆心的X、Y 半径R
    $.fn.vCircleMenu = function (X, Y, R, settings, $clickRow) {
        var opt = $.extend({}, $.vvPluginDefault.vCircleMenu, settings);
        for (var i = 0; i < _Cal.length; i++) {
            var $obj = $(this).eq(i);
            if ($obj.length != 1) {
                return;
            }
            $obj.css("left", eval(_Cal[i].X) - $obj.width() / 2);
            $obj.css("top", eval(_Cal[i].Y) - $obj.height() / 2);
            // @wangyi 2015-5-12 解决弹出页面明细功能失效
            var parent_index = $.vvPlugin.getZindex($clickRow);
            $obj.css("z-index", parent_index + 1);
            $("#table_detail").css("z-index", parent_index + 2);
            if (opt.animate)
                $obj.show(100 + i * 50);
            else
                $obj.show();
        }
    }
    /**
     * 获取直到指定的parent
     * @param exp
     * @returns {*}
     */
    $.fn.parentsVUntil = function (exp) {
        return _is($(this), exp);
        function _is($cur, exp) {
            var $parent = $cur.parent();
            if ($parent.length !== 0) {
                if ($parent.is(exp))
                    return $parent;
                else
                    return _is($parent, exp);

            } else {
                return $parent;
            }
        }
    }
})(jQuery);