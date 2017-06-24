var max_process = 61,
    max_dealing = 91,
    interval_process = 300, //进度条、loading延时
    process_func,
    alertB_func,
    slefAnim_func,
//增加两个计算，防止加载效果给没了
    simple_count = 0,
    process_count = 0,
// 在下方的选择区域用到
    choose_randomArray = ["fa-slideshare", "fa-paw", "fa-music", "fa-codepen", "fa-diamond"],
    choose_randomColor = ["success", "info", "default"],
    bigFileThread,

//配置使用，用来校验用户是否拥有某项权限
    GLOBAL_USER_POWER;
/**
 * @frequency 普通
 * @for 校验用户角色权限
 * @exInfo 使用全局变量依赖首页的加载，此方法在后台也有相同实现
 * @param 必须(字符),checkPower 需要检验的权限，支持多个关联，|表示或者,&表示并且，不支持同时存在
 * @returns {boolean} true为有权限 false没权限
 */
function ifHasPower(checkPower) {
    var hasPower = false, multiPower;
    if (checkPower && $.type(checkPower) === "string") {
        if (checkPower.indexOf("|") !== -1) {
            multiPower = checkPower.split("|");
            $.each(multiPower, function (idx, ele) {
                if (_ifHasPower(ele)) {
                    hasPower = true;
                    return false;//jquery中的each为break效果
                }
            });
        } else if (checkPower.indexOf("&") !== -1) {
            multiPower = checkPower.split("&");
            hasPower = true;
            $.each(multiPower, function (idx, ele) {
                if (_ifHasPower(ele)) {
                    hasPower = false;
                    return false;//jquery中的each为break效果
                }
            });
        } else {
            hasPower = _ifHasPower(checkPower);
        }
    } else {
        hasPower = false
    }
    return hasPower;
}

function _ifHasPower(checkPower) {
    if (GLOBAL_USER_POWER && GLOBAL_USER_POWER.indexOf(checkPower) !== -1) {
        return true;
    }
    return false;
}
/**
 * ajax回调时，根据情况自动进行提示操作,错误提示信息支持 1加分割线和直接错误信息
 * @param msg(字符) 必须，请求返回信息 （识别方式：如果为字符0那么即为成功，其他均为失败）
 * @param succFunc(方法) 可选，成功时调用方法
 * @param content(字符) 可选，成功时的提示基本内容，提示信息为 content+"成功"
 */
function alertMsgByResponse(msg, succFunc, content) {
    if (!content) {
        content = "保存";
    }
    if ("0" === msg) {
        alertMsg_B(content + "成功");
        if (succFunc)
            succFunc(msg);
    } else if (msg.startsWith("0|")) {
        alertMsg_B(msg.split("|")[1], "success");
    } else {
        if ("1" !== msg)
            alertMsg_B(msg, "warning");
        else
            alertMsg_B(content + "失败");
    }
}
/**
 * 通用ajax请求之封装,内部调用的是loading。。。加载效果
 * @param request_url 必须，请求地址
 * @param data 可选,请求参数
 * @param func 可选，成功回调
 * @param extend 可选，ajax其他信息，扩展是为了同步调用，也可附加其他信息，ajax时优先使用
 */
function commonAjax(request_url, data, func, extend) {
    _ajaxInner({
        request_url: request_url,
        data: data,
        func: func,
        loading_effect: 'loading',
        extend: extend
    });
}
/**
 * 通用ajax请求之封装，无加载效果
 * @param request_url 必须，请求地址
 * @param data 可选,请求参数
 * @param func 可选，成功回调
 * @param extend 可选，ajax其他信息，扩展是为了同步调用，也可附加其他信息，ajax时优先使用
 */
function commonAjax_none(request_url, data, func, extend) {
    _ajaxInner({
        request_url: request_url,
        data: data,
        func: func,
        extend: extend
    });
}
/**
 * 通用ajax请求之封装，进度条效果
 * @param request_url 必须，请求地址
 * @param data 可选,请求参数
 * @param func 可选，成功回调
 * @param extend 可选，ajax其他信息，扩展是为了同步调用，也可附加其他信息，ajax时优先使用
 */
function commonAjax_pro(request_url, data, func, extend) {
    _ajaxInner({
        request_url: request_url,
        data: data,
        func: func,
        loading_effect: 'process',
        extend: extend
    });
}
function _ajaxInner(paramobj) {
    if (paramobj.loading_effect == 'process') {
        _startProcess("");
    } else if (paramobj.loading_effect == 'loading') {
        startSimpleLoad();
    }
    //统一处理url
    if (paramobj.request_url[0] === "/") {
        paramobj.request_url = paramobj.request_url.substr(1, paramobj.request_url.length);
    }
    // 稍作修改
    $.ajax($.extend({
        type: "POST",
        url: paramobj.request_url,
        data: paramobj.data,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        cache: false,
        dataType: "text",
        success: function () {
            if (paramobj.loading_effect == 'process') {
                _processHandler();
            }
            // 参数继续向下传递
            paramobj.func(arguments[0], arguments[1], arguments[2]);
        },
        error: function () {
            if (paramobj.loading_effect == 'process') {
                _processStop();
            }
            alertMsg("系统处理异常", "danger");
        },
        complete: function () {
            if (paramobj.loading_effect == 'process') {
                _processStop();
            } else if (paramobj.loading_effect == 'loading') {
                stopSimpleLoad();
            }
        }
    }, paramobj.extend));
}
/**
 * 大文件下载方法，将会将结果进行分卷下载
 * @param request_url 请求地址
 * @param param      请求参数
 * @param totalCount 总技术，重要，此参数需要从分页信息中获取 获取方式 （table.ajax.json().recordsTotal;）
 */
function bigFileAutoDownLoad(request_url, param, totalCount) {
    var maxCount = 30000,
        excelFiles = Math.ceil(totalCount / maxCount),
        orgName = param.FILENAME;
    //重新进入重置timeout
    clearTimeout(bigFileThread);
    if (totalCount > maxCount) {
        confrimMsg("当前数据量超过" + maxCount / 10000 + "万，当前的" + totalCount + "条数据将会分" + excelFiles + "个分卷进行下载，是否继续？", function () {
            param.start = 0;
            param.length = maxCount;
            param.FILENAME = orgName + "--第(1)分卷";
            commonAjaxFile(request_url, param, "正在导出第(1)分卷，请稍候...");
            _innerDownLoad(2, excelFiles, param, maxCount, orgName, request_url);
        });
    } else {
        commonAjaxFile(request_url, param);
    }
}
/**
 * 文件下载时选择字段的通用方法
 * @param title  标题，展开的modal会进行展示
 * @param orgColumns  array，原始字段
 * @param confirmDown 字段调整完毕之后调用方法，方法的首个参数为过滤之后的数据
 */
function chooseDownLoadColumns(title, orgColumns, confirmDown) {
    $.vvPlugin.showForm({
        modalContent: template("template_columnChoose", {columnContainer: "columns", dataColumns: orgColumns}),
        width: "80%",
        title: title,
        confrimFunc: function ($baseContent, baseModal) {
            var filterData = [];
            $baseContent.find("ul li").each(function () {
                filterData.push({COLUMN_ID: $(this).attr("data-column-id"), COLUMN_NAME: $(this).text()})
            });
            $.vvPlugin.hideForm(baseModal);
            confirmDown(filterData);
        },
        initFunc: function ($baseContent) {
            $baseContent.find("ul").sortable();
            $baseContent.find("ul").on("dblclick", "li", function () {
                $(this).remove();
            });
        },
        baseModal: "form_modal_mini"
    });
}
function _innerDownLoad(curr, excelFiles, param, maxCount, orgName, request_url) {
    //结束
    if (curr - 1 === excelFiles) {
        return;
    }
    bigFileThread = setTimeout(function () {
        confrimMsg("目前是第" + curr + "分卷，是否继续？<br><i class='fa fa-tag mg-r-5'></i>由于数据量较大，请在上一分卷下载完成后在进行确定。", function () {
            param.start = (curr - 1) * maxCount + 1;
            param.FILENAME = orgName + "--第(" + curr + ")分卷";
            commonAjaxFile(request_url, param, "正在导出第(" + curr + ")分卷，请稍候...");
            _innerDownLoad(curr + 1);
        });
    }, 10000);
}
/**
 * 通用文件下载方法
 * @param request_url 请求地址
 * @param data       请求参数
 * @param message   下载时底部提示信息
 */
function commonAjaxFile(request_url, data, message) {
    //_log("debug");
    if (!message) {
        message = "正在导出，请稍候...";
    }
    alertMsg_B(message, "success");
    if (request_url[0] === "/") {
        request_url = request_url.substr(1, request_url.length);
    }
    var randomID = new Date().getTime() + "";
    $('<iframe style="display: none;" id="' + randomID + '"><body></body></iframe>').appendTo('body');

    var $form = $('<form action="' + request_url + '" method="post"></form>');
    $.vvPlugin.paramsToJqObj(data, $form);
    //很奇怪的问题 @wangyi 在ie 下元素无法被找到，但是方法执行后就好了
    setTimeout(function () {
        $form.appendTo($($("#" + randomID)[0].contentWindow.document).find("body")).submit();
    }, 100);

    //$iframe.remove();
}
//add @ouyl @2015-11-25 @文件上传
function commonAjaxFileUpload(request_url, $inputFile, randomID, message) {
    if(message){
        alertMsg_B(message, "success");
    }
    if (request_url[0] === "/") {
        request_url = request_url.substr(1, request_url.length);
    }
    $("#"+randomID).remove();
    $('<iframe style="display: none;" id="' + randomID + '"><body></body></iframe>').appendTo('body');
    var $form = $("<form action='" + request_url + "'  enctype='multipart/form-data' method='post'></form>");
    var clone = $inputFile.clone(true);
    $inputFile.hide;
    clone.insertAfter($inputFile);
    $form.append($inputFile);
    $form.append("<input type='hidden' name='randomID' value='"+randomID+"'/>");
    try {
        $form.appendTo($($("#" + randomID)[0].contentWindow.document).find("body")).submit();
    } catch (e) {
        _log(e);
    }
}

/**
 * 弹出确认框
 * @param msg 信息
 * @param type 类型，对应bootstrap中的success、info、warning、danger、primary
 */
function alertMsg(msg, type) {
    if (!type) {
        type = "default";
    }
    $("#alert_msg .modal-body").html("<strong class='text-" + type + " '>" + msg + "</strong>");
    $("#alert_msg").modal('show');
}
/**
 * 弹出确认框
 * @param msg 确认的信息
 * @param func 确认操作时调用
 */
function confrimMsg(msg, func) {
    fObject("confrim", "comfrim_modal").unbind("click");
    fObject("confrim", "comfrim_modal").click(func);
    $("#comfrim_modal .modal-body").html("<strong class='text-danger'>" + msg + "</strong>");
    $("#comfrim_modal").modal('show');
}

function _startProcess(msg) {
    if (!msg) {
        msg = "正在加载，请稍候";
    }
    //_log(msg);
    $("#show_process .process_info").text(msg);
    if (process_count == 0) {
        $("#show_process").show();
        $("#show_process .progress-bar").css("width", "10%");
        $("#show_process .progress-bar").data("width", 10);
        // 2015-2-12 @wangyi : 开始自动增加
        process_func = setTimeout(function () {
            _processUp(10, max_process)
        }, interval_process);

    }
    process_count++;


}
function _processUp(cur, max) {
    //_log("cur:" + cur);
    var upspace = max - cur,
        after = upspace / 2 * Math.random() + cur;
    $("#show_process .progress-bar").css("width", after + "%");
    $("#show_process .progress-bar").data("width", after);
    if (max - after > 1) {
        process_func = setTimeout(function () {
            _processUp(after, max)
        }, interval_process);
    }
}
function _processHandler(msg) {
    if (!msg) {
        msg = "处理数据中...";
    }
    $("#show_process .process_info").text(msg);
    if (process_count === 1) {
        clearTimeout(process_func);
        process_func = setTimeout(function () {
            _processUp($("#show_process .progress-bar").data("width"), max_dealing)
        }, interval_process);
    }

}
function _processComplete(msg) {
    if (!msg) {
        msg = "加载完成";
    }
    $("#show_process .process_info").text(msg);
    if (process_count === 1) {
        clearTimeout(process_func);
        //_log(msg);
        var cur = $("#show_process .progress-bar").data("width");
        setTimeout(function () {
            $("#show_process .progress-bar").css("width", "100%");
            setTimeout(function () {
                $("#show_process").hide();
                $("#show_process .progress-bar").css("width", "0%");
            }, interval_process);
        }, interval_process)
    }

}
function _processStop() {
    if (process_count === 1) {
        process_count = 0;
        clearTimeout(process_func);
        $("#show_process").hide();
        $("#show_process .progress-bar").css("width", "0%");
    } else {
        process_count--;
    }

}
//@wangyi 2015-6-25 改造，外部调用start就++
/**
 * 开始loading效果，会有全局计数，最后一个完成时解除加载效果
 */
function startSimpleLoad() {
    if (simple_count === 0) {
        $("#loading_simple_content [name='self-animate']").text("");
        $("#loading_simple_back").show();
        $("#loading_simple_content").show();
        clearTimeout(slefAnim_func);
        _selfAnimate($("#loading_simple_content [name='self-animate']"));
    }
    simple_count++;

}
function _selfAnimate($obj) {
    //犹豫页面的假死导致？？
    var text = $obj.text();
    if (text.length == 6) {
        text = "";
    } else {
        text += ".";
    }
    $obj.text(text);
    slefAnim_func = setTimeout(function () {
        _selfAnimate($obj);
    }, 500);
}
/**
 * 结束loading效果，会有全局计数，最后一个完成时解除加载效果
 */
function stopSimpleLoad() {

    if (simple_count === 1) {
        setTimeout(function () {
            clearTimeout(slefAnim_func);
            $("#loading_simple_back").hide();
            $("#loading_simple_content").hide();
        }, interval_process / 2);
        simple_count = 0;
    } else {
        simple_count--;
    }

}
/**
 * 日志方法，不多说了
 * @param message
 * @private
 */
function _log(message) {
    var now = new Date(), y = now.getFullYear(), m = now.getMonth() + 1, // ！JavaScript中月分是从0开始的
        d = now.getDate(), h = now.getHours(), min = now.getMinutes(), s = now.getSeconds(), time = y + '/' + m + '/' + d + ' ' + h + ':' + min + ':' + s;
    try {
        if (window.console) {
            console.log(time + ' My App: ' + message);
        }
        if (message == "debug") {
            var a = 1;
            //break here
        }
    } catch (e) {
        // do nothing
    }
}

// ---- -----------------  通用选择 功能区域  -----------------start
function showChoose(paramObj) {
    if (!paramObj.title) {
        paramObj.title = "请选择";
    }
    if (paramObj.width) {
        $("#choose_modal .modal-dialog").css("width", paramObj.width);
    } else {
        $("#choose_modal .modal-dialog").css("width", "");
    }

    $("#choose_modal [name='form_title']").text(paramObj.title);
    // 2015-3-26 @wangyi : 清楚选择区域
    removeAllSelected();
    commonAjax(paramObj.url, paramObj.param, function (msg) {
        // 2015-3-4 @wangyi : 需要去除之前的绑定哦
        fObject("confrim", "choose_modal").unbind("click");
        $("#choose_modal [name='form_body']").html(msg);
        $("#choose_modal").modal('show');
        // 2015-4-24 @wangyi 继续修复，如果调用添加就不需要在这里初始已经选择
        //if (paramObj.initEle) {
        //$("#choose_modal").data("selectObj", paramObj.initEle);
        //}
        $("#choose_modal").data("paramObj", paramObj);
        fObject("confrim", "choose_modal").click(function () {
            //_log(displayObj($("#choose_modal").data("selectObj")));
            paramObj.confrim_func($("#choose_modal").data("selectObj"));
            hideChoose();
        });
        if (paramObj.initEle) {
            // @wangyi 2015-7-14 这里应当注意,Array和object并无不同,在页面时也为一致，区别在于添加元素时
            //      但是这里做了转换之后，array和object完全无不同
            // @wangyi 2015-8-26 为数组扩展方法后发现遍历时 会把扩展属性也带上，修改掉
            if ($.isArray(paramObj.initEle)) {
                for (var i = 0; i < paramObj.initEle.length; i++) {
                    choose_addEle(paramObj.initEle[i]);
                }
            } else {
                for (var _index in paramObj.initEle) {
                    choose_addEle(paramObj.initEle[_index]);
                }
            }
        }
    });
    // 2015-4-24 @wangyi 修复bug ，添加应当在加载之后，不该在外面
    //if (paramObj.initEle) {
    //    alert("happen 2")
    //    for (var _index in paramObj.initEle) {
    //        choose_addEle(paramObj.initEle[_index]);
    //    }
    //}

}
function choose_addEle(_data) {
    var _objData = $("#choose_modal").data("selectObj"),
        _paramObj = $("#choose_modal").data("paramObj");
    if (!_objData) {
        _objData = new Object();
    } else {
        if (_objData[_data[_paramObj.select_id]]) {
            return;
        }
    }
    if (_paramObj.maxChoose) {
        if (getObj_Attr_Count(_objData) >= _paramObj.maxChoose) {
            alertMsg_B("操作失败，超过最大选择上限（" + _paramObj.maxChoose + "）");
            return;
        }
    }
    _objData[_data[_paramObj.select_id]] = _data;
    $("#choose_modal").data("selectObj", _objData);
    var html = "<div class='panel panel-" + choose_randomColor[parseInt(Math.random() * 3)] + " pull-left mg-r-5 mg-b-5 cursor-p'  name='" + _data[_paramObj.select_id]
        + "'  title='' data-content='<span class=base-font><small>";
    for (var info_param in _paramObj.show_info) {
        html += _paramObj.show_info[info_param] + "：" + (_data[info_param] ? _data[info_param] : '') + "<br>";
    }
    if (_paramObj.show_info.length != 0) {
        html = html.substr(0, html.length - 4);
    }
    /* 可以传入自定义的图片 fa-xx*/
    var iconImg;
    if (_data._pic_img) {
        iconImg = _data._pic_img;
    } else {
        iconImg = choose_randomArray[parseInt(Math.random() * 5)];
    }
    html += "</small><span>'> <div class='panel-heading panel-head-lite pull-left'> <i class=' fa " + iconImg
        + " fa-lg pull-left mg-t-3'></i> <div class='huge pull-left'> " + _data[_paramObj.select_name] + " </div> </div><input type='hidden' name='selelct_id' value='"
        + _data[_paramObj.select_id] + "'> </div>";
    fObject("selected_area", "choose_modal").append(html);

    fObject("selected_area", "choose_modal").find("[name='" + _data[_paramObj.select_id] + "']").popover({
        placement: 'top',
        trigger: "click",
        delay: {
            show: 200,
            hide: 100
        },
        html: true
    });

}
function removeAllSelected() {
    fObject("selected_area", "choose_modal").html('');
    $("#choose_modal").data("selectObj", new Object());
}
function hideChoose() {
    $("#choose_modal").modal('hide');
}

// @wangyi 2015-7-14 这里因为返回的特殊key-object模式，所以提供一个统一的方法转换为list，用于后台提交
function formatChooseEle(chooseEle) {
    var array = [];
    if ($.isArray(chooseEle)) {
        for (var i = 0; i < chooseEle.length; i++) {
            array.push(chooseEle[i]);
        }
    } else {
        for (var param in chooseEle) {
            array.push(chooseEle[param]);
        }
    }

    return array;
}

//---- -----------------  通用选择 功能区域  -----------------end

function fValue(field, baseD) {
    return fObject(field, baseD).val();
}

/**
 * 根据name来获取元素本身 主要考虑页面相同id过多
 *
 * @param field
 * @returns
 */
function fObject(field, baseD) {
    if (baseD instanceof jQuery) {
        return baseD.find("[name='" + field + "']");
    } else if (baseD) {
        return $("#" + baseD + "  [name='" + field + "']");
    } else {
        return $("[name='" + field + "']");
    }
}
/* 方便操作吧*/
function fSelectText($select) {
    return $select.find("option:selected").text();
}
function fSelectObj($select) {
    return $select.find("option:selected");
}

function dPicker($obj, extend) {
    if (!extend) {
        extend = {};
    }

    return $obj.datetimepicker($.extend({
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        language: "zh-CN"
    }, extend));
}

/**
 * 校验日期合法性
 *
 * @param str
 * @returns {Boolean}
 */
function checkDate(str) {
    if (!str) {
        return false;
    }
    var reg = /^(\d{4})(\d{2})(\d{2})$/;
    var r = str.match(reg);
    if (r == null)
        return false;
    r[2] = r[2] - 1;
    var d = new Date(r[1], r[2], r[3]);
    if (d.getFullYear() != r[1])
        return false;
    if (d.getMonth() != r[2])
        return false;
    if (d.getDate() != r[3])
        return false;

    return true;
}

function checkNecessaryStr(str) {
    if (str && str !== "null" && str.trim() !== "") {
        return true;
    }
    return false;
}
/**
 * 改良升级版本，可以有多个提示出来~
 * @param msg
 * @param type
 */
function alertMsg_B(msg, type) {
    if (!type) {
        // 2015-3-27 @wangyi : 类型转换
        msg = msg.toString();
        if (msg.indexOf("成功") !== -1) {
            type = "success";
        } else if (msg.indexOf("失败") !== -1) {
            type = "danger";
        } else {
            type = "info";
        }
    }
    var $div = $("<div/>").addClass("alert alert-" + type + " alert-dismissable mg-b-5").css("display", "none")
        , html = '<button class="close" ><span aria-hidden="true">&times;</span></button><span class="label label-' + type + ' " >提示</span><i class=" fa fa-info-circle mg-l-5"></i><strong class="mg-l-5 ">' + msg + '</strong>'
        , timeOut;
    $div.html(html);
    $("#alert_bottom").append($div);
    $div.fadeIn("noraml", function () {
        timeOut = setTimeout(function () {
            $div.fadeOut("slow", function () {
                $div.remove();
            });
        }, 4000);
    });
    $div.find("button").click(function () {
        $div.finish();//结束动画
        clearTimeout(timeOut);
        $div.remove();
    });
}

function addCookie(name, value, days) {
    var cookieString = name + "=" + escape(value);
    // 判断是否设置过期时间
    if (days > 0) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 3600 * 1000);
        cookieString = cookieString + "; path=/;expires=" + date.toGMTString();
    }
    document.cookie = cookieString;
}

function getCookie(name) {
    var strCookie = document.cookie,
        arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name)
            return arr[1];
    }
    return "";
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
}

function getSimpleDate(str) {
    if (str) {
        return (str.toString()).replace("-", "").replace("-", "").replace("/", "").replace("/", "");
    }
}
/**
 * 通过毫秒值来获取时间
 * @param str
 * @returns {string}
 */
function getDateByTime(str, formateStr) {
    if (str) {
        var dateObj = new Date(str);
        if (formateStr) {
            return dateObj.Format(formateStr);
        } else {
            return dateObj;
        }
    }
}

/**
 * 解析 稽核中的日期  20150722 ，20150813050328
 * @param str
 * @returns {*}
 */
function formatAuditDate(str) {
    if (str) {
        if (str.length == 8) {
            return str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2);
        } else if (str.length == 14) {
            return str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2) + " " + str.substr(8, 2) + ":" + str.substr(10, 2) + ":" + str.substr(12, 2);
        } else {
            return str;
        }
    } else {
        return str;
    }
}

/**
 * 获取日期对象
 *
 * @param strDate
 *            日期字符串
 * @param splitOp
 *            分割符
 * @return 返回日期对象
 *
 */
function getDate(strDate) {
    if (!strDate || strDate instanceof Date) {
        return strDate
    }
    strDate = getSimpleDate(strDate);
    if (strDate.length != 8) {
        return null;
    }
    // 2015-3-11 @wangyi : 月份减1？
    // 2015-3-23 @wangyi : 改了又改
    return new Date(Date.parse(strDate.substr(0, 4) + "/" + strDate.substr(4, 2) + "/" + strDate.substr(6, 2)));
}

function calDate(baseDate, interval, unit) {
    var baseD = getDate(baseDate), result = baseD;
    if (unit === "D") {
        result.setDate(baseD.getDate() + interval);
    } else if (unit === "M") {
        result.setMonth(baseD.getMonth() + interval);
    } else if (unit === "Y") {
        result.setFullYear(baseD.getFullYear() + interval);
    }
    return result.Format("yyyy-MM-dd");
}

function getInterval(startDate, endDate) {
    var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
    var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
    var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
    return dates;
}

function monthLastDay(tMonth) {
    var tYM = tMonth.split("-");
    var tY = tYM[0];
    var tM = tYM[1];
    var tD = "31";
    if ("04" === tM || "06" === tM || "09" === tM || "11" === tM) {
        tD = "30";
    } else if ("02" === tM) {
        if (parseInt(tY) % 4 == 0 && (parseInt(tY) % 100 != 0 || parseInt(tY) % 400 == 0)) {
            tD = "29";
        } else {
            tD = "28";
        }
    }
    return tMonth + "-" + tD;
}

/**
 * 格式化数字
 *
 * @param num
 * @returns
 */
function formatNum(num) {
    if (isNaN(num)) {
        return 0;
    }
    num = "" + num;
    if (num.charAt(0) === '-') {
        return "-" + formatNum(num.substring(1));
    }
    if (num.indexOf(".") == -1) {
        var count = 0;
        var result = "";
        for (var i = num.length - 1; i >= 0; i--) {
            count++;
            result = num.charAt(i) + result;
            if (count % 3 === 0 && count < num.length)
                result = "," + result;
        }
        return result;
    } else {
        var array = num.split('.');
        return formatNum(array[0]) + "." + array[1];
    }
}

function formatFloat(num, len) {
    if (isNaN(num)) {
        return 0;
    }
    if (!len) {
        len = 2;
    }
    num = parseFloat(num);
    return parseFloat(num.toFixed(len))
}
function dMoney(s, n) {
    //@wangyi 2015-9-6 支持money格式转换回来
    return formatFloat((s + "").replaceAll(",", ""), n);
}
function fMoney(s, n) {
    //_log("debug");
    if (!s && s !== 0) {
        //空值返回去
        return s;
    }
    //fix n 为0的问题
    if (isNaN(n) || n < 0) {
        n = 2;
    }
    //@wangyi 2015-9-6 支持money格式转换回来
    s = parseFloat((s + "").replaceAll(",", "")/*.replace(/[^\d\.-]/g, "")*/);
    var _f = s >= 0 ? "" : "-";
    s = Math.abs(s).toFixed(n) + "";
    var _a = s.split("."), l = _a[0], r = _a[1];
    var t = "";
    var count = 0;
    for (var i = l.length - 1; i >= 0; i--) {
        count++;
        t = l.charAt(i) + t;
        if (count % 3 === 0 && count < l.length)
            t = "," + t;
    }
    if (n > 0) {
        r = "." + r;
    } else {
        r = "";
    }
    return _f + t + r;
}

function displayObj(obj) {
    try {
        return JSON.stringify(obj);
    } catch (e) {
        _log("can't parseObj");
    }
}

function getObj_Attr_Count(obj) {
    var count = 0;
    for (var i in obj)
        count++;
    return count;
}

/*
 * <link rel="stylesheet" href="./resources/self/css/base.css"/>
 */
function importCss(fpath) {
    fpath = fpath.replace(/\./g, '\/');
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript = document.createElement("link");
    //oScript.rel = "stylesheet";
    oScript.href = "./resources/" + fpath + ".css";

    oHead.appendChild(oScript);
}

/*
 * updated By Jquery For Use Cache Directly
 * */
function importJs(fpath, successFunc) {
    fpath = fpath.replace(/\./g, '\/');
    $.ajax({
        url: "./resources/" + fpath + ".js",
        dataType: "script",
        cache: true,
        success: successFunc
    });
}
function bindJsInit(moduleName, initFunc) {
    $("body").off(moduleName).on(moduleName, function (event, serverData) {
        initFunc(serverData);
    });
}
function triggerJsInit(moduleName, serverData) {
    $("body").triggerHandler(moduleName, serverData)
}


// 摘自网上 http://blog.sina.com.cn/s/blog_8a18c33d01013teo.html
function mousePosition(evt) {
    var xPos, yPos;
    evt = evt || window.event;
    if (evt.pageX) {
        xPos = evt.pageX;
        yPos = evt.pageY;
    } else {
        xPos = evt.clientX + document.body.scrollLeft - document.body.clientLeft;
        yPos = evt.clientY + document.body.scrollTop - document.body.clientTop;
    }
    return [xPos, yPos];
}

function evalV(json) {
    if ($.type(json) === "string")
        return eval("(" + json + ")");
    else
        return json
}
function cutTail(str) {
    if (str && str.length !== 0) {
        return str.substr(0, str.length - 1);
    } else {
        return str;
    }
}
function getArrayElementByAttr(array, attr, value) {
    var result = null;
    $.each(array, function (idx, ele) {
        if (ele[attr] === value) {
            result = ele;
            return false;
        }
    });
    return result;
}

/* @wangyi 2015-4-15 开始改造，引入命名空间
 *  @wangyi 2015-6-10 改造，原因是refresh用在两个需要相同功能不同反映的按钮，所以行改造，对于时间的绑定重新改造了 */


$(function () {
    var _last_form = "";
    jQuery.vvPlugin = {
        /* 弹出表单的相关操作*/
        showForm: function (settings) {
            /* @wangyi 2015-4-16 这里的extent的顺序，第一个元素会合并第二个*/
            var opt = $.extend({}, $.vvPluginDefault.showForm, settings);
            // @wangyi 2015-8-28 fixbug param有可能为空，所以加了一个判断
            var baseModal = opt.baseModal, $baseModal = $("#" + baseModal), $baseContent, /* $baseForm,*/ condition = $.param(opt.param ? opt.param : {});
            //_log("default:"+$.vvPluginDefault.showForm.width+",setting:"+settings.width+",opt:"+opt.width);
            // @wangyi 2015-5-26 这里增加是因为有可能modal需要自己的按钮
            if (opt.header)
                $("#" + baseModal + " .modal-header").removeClass("ds-none");
            else
                $("#" + baseModal + " .modal-header").addClass("ds-none");
            if (opt.footer)
                $("#" + baseModal + " .modal-footer").removeClass("ds-none");
            else
                $("#" + baseModal + " .modal-footer").addClass("ds-none");

            $("#" + baseModal + " .modal-dialog").css("width", opt.width);

            $("#" + baseModal + " [name='form_title']").html(opt.title);

            //@wangyi 2015-8-24 发现个奇怪的问题，每次绑定的都是上一次的内容，所以shown事件要提前
            //必须放在外面，例如稽核点的两个按钮都是打开的同样页面，但是方法是不一样的
            $baseContent = $baseModal.find("[name='form_body']");
            //想法挺好，但是页面还没加进来！ 哪来的form
            //$baseForm = $baseContent.children().filter("form");
            $baseModal.off("shown.user.function");
            //这个在前
            if (opt.initFunc) {
                //改为 show.user.function，要比页面中自己的事件早一步
                $baseModal.on("shown.user.function", function () {
                    //init中参数修改
                    opt.initFunc($baseContent, baseModal);
                });
            }
            //重置确认按钮
            fObject("confrim", baseModal).unbind("click");
            // 2015-4-15 @wangyi 增加绑定确认动作
            if (opt.confrimFunc) {
                fObject("confrim", baseModal).click(function () {
                    opt.confrimFunc($baseContent, baseModal)
                });
            }
            //如果有url的话
            if (opt.url) {
                if (_last_form === (opt.url + condition) && !opt.refresh) {
                    $baseModal.modal({backdrop: 'static'});
                    // 2015-3-4 @wangyi : 需要去除之前的绑定哦
                    // 2015-6-23 @wangyi :如果确认的方式不是在参数中，那么不可以去除绑定
                } else {
                    _last_form = opt.url + condition;
                    commonAjax(opt.url, opt.param, function (msg) {
                        //只要刷新就可以重新绑定click
                        $.vvPlugin._loadModalDOM(msg, baseModal, $baseModal, $baseContent, opt);
                    });
                }
            } else {
                _last_form = "";//重置，否则缓存会出问题
                //可以直接传内容
                $.vvPlugin._loadModalDOM(opt.modalContent, baseModal, $baseModal, $baseContent, opt);
            }


            /* 保证在页面已经展示后再进行加载*/
            //@wangyi 2015-5-20 放到global事件中处理
            //$("#form_modal").off().on('shown.bs.modal', function () {
            //    // @wangyi 2015-5-19 这里在modal出现时重新绘制
            //    $("#form_modal").find(".vChart").each(function () {
            //        if ($(this).is(":visible"))
            //            $(this).data("chart").resize();
            //    });
            //    if (opt.completeFunc) {
            //        opt.completeFunc();
            //    }
            //});

        },
        /*为了复用，独立出方法*/
        _loadModalDOM: function (msg, baseModal, $baseModal, $baseContent, opt) {
            $baseContent.html(msg);
            $baseModal.modal({backdrop: 'static'});
            // 2015-4-15 @wangyi 增加校验功能
            if (opt.blurCheck) {
                $baseContent.find("[validation]").blur(function () {
                    $(this).vali_Ele(opt.checkDisplay);
                });
            }
            if (opt.changeCheck) {
                $baseContent.find("[validation]").change(function () {
                    $(this).vali_Ele(opt.checkDisplay);
                });
            }
        },
        hideForm: function (baseModal) {
            if (!baseModal) {
                baseModal = "form_modal";
            }
            $("#" + baseModal).modal('hide');
        }

        ,
        showTree: function (settings) {
            var opt = $.extend({}, $.vvPluginDefault.showTree, settings);
            //_log("default:"+$.vvPluginDefault.showForm.width+",setting:"+settings.width+",opt:"+opt.width);
            // @wangyi 2015-5-26 这里增加是因为有可能modal需要自己的按钮
            var $tree = $("#tree_select_modal");
            if (opt.header)
                $tree.find(".modal-header").removeClass("ds-none");
            else
                $tree.find(".modal-header").addClass("ds-none");
            if (opt.footer)
                $tree.find(".modal-footer").removeClass("ds-none");
            else
                $tree.find(".modal-footer").addClass("ds-none");

            $tree.find(".modal-dialog").css("width", opt.width);

            $tree.find("[name='form_title']").text(opt.title);
            if (opt.multi === true) {
                $tree.find(".alert").show();
            } else {
                $tree.find(".alert").hide();
            }
            var _setting = {
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                view: {
                    nameIsHTML: true,
                    showIcon: false
                },
                callback: {
                    onClick: opt.clickTreeNode
                }
            };
            if (opt.exSetting) {
                _setting = $.extend(_setting, opt.exSetting);
            }
            if (settings.exSetting && settings.exSetting.async && settings.exSetting.async.enable === true) {
                $.fn.zTree.init($("#tree_select_common"), _setting);
            } else {
                commonAjax(opt.url, opt.param, function (msg) {
                    $.fn.zTree.init($("#tree_select_common"), _setting, eval("(" + msg + ")"));
                });
            }
            // 2015-3-4 @wangyi : 需要去除之前的绑定哦
            fObject("confrim", "tree_select_modal").unbind("click");
            if (opt.confrimFunc) {
                // 2015-4-15 @wangyi 增加绑定确认动作
                fObject("confrim", "tree_select_modal").click(function () {
                    opt.confrimFunc($.fn.zTree.getZTreeObj("tree_select_common"));
                });
            }
            $("#tree_select_modal").modal('show');
        }
        ,
        hideTree: function () {
            $("#tree_select_modal").modal('hide');
        }

        ,
        /*
         这里控制样式，js在global中控制
         @wangyi 2015-7-21 更新，直接改td的宽度无语了。。
         需要将td下嵌套一个div，然后调整div的宽度
         */
        resizeAble: function ($table) {
            $table.addClass("table-resize");
            $table.removeClass("table-fixed");
            $table.find(">thead").disableSelection().find(">tr>th").each(function () {
                $(this).html("<div class='th-container'>" + $(this).html() + "</div>")
            });
        },
        /*
         * 按照顺序进行tab切换
         * */
        tabByOrder: function ($ul, $tab, initFunc, clickFunc) {
            if (!$tab) {
                $tab = $ul.next();
            }
            $ul.on("click", ">li", function (e) {
                e.preventDefault();//阻止默认行径
                if ($(this).hasClass("active")) {
                    return;
                }
                var $curTab = $tab.find(">.tab-pane").eq($(this).index());
                if ($curTab.length == 0) {
                    return;
                }
                $ul.find(">li").removeClass("active");
                $(this).addClass("active");
                $tab.find(">.tab-pane").removeClass("active");
                if (initFunc && !$curTab.hasClass("init-over")) {
                    initFunc($curTab.index());
                    $curTab.addClass("init-over");
                }
                if (clickFunc) {
                    clickFunc($curTab.index());
                }
                $curTab.addClass("active").find("textarea").each(function () {//附加功能
                    $(this).height("auto");//此处。。
                    $(this).height(this.scrollHeight + 10);
                });
            });
        },
        //帮助简单的表格获取excel参数
        //@wangyi 2015-8-7 并具备简单过滤功能
        getSimpleExcelHeader: function (table, withOutCols, havingCols) {
            var mode = 0;
            var obj = {};
            //_log("debug");
            if (havingCols instanceof Array) {
                mode = 1;
                for (var attr in havingCols) {
                    obj[havingCols[attr]] = "show";
                }
            } else if (withOutCols instanceof Array) {
                mode = 2;
                for (var attr in withOutCols) {
                    obj[withOutCols[attr]] = "none";
                }
            }
            var _array = [];
            $(table.table().header()).find("th").each(function () {
                var _index = $(this).index();
                if (mode == 0 || (mode == 1 && obj[_index]) || (mode == 2 && !obj[_index]))
                    _array.push({
                        "COLUMN_ID": table.column(_index).dataSrc(),
                        "COLUMN_NAME": $(this).text()
                    });
                ;
            });
            return _array;
        }
        ,
        checkRepeatID: function () {
            $("[id]").each(function () {
                if ($("[id='" + $(this).attr("id") + "']").length !== 1) {
                    alert("页面中出现重复ID:" + $(this).attr("id"));
                }
            })


        },
        /* 山西地市级联代码 */
        loadAreaSelections: function ($city, $area, $dict, $container) {
            $area.initNewMode_Selection("请输入查询区县");
            if ($dict) {
                $dict.initNewMode_Selection("请输入查询营业厅");
            }
            $city.change(function () {
                $area.change(function () {
                    if ($dict) {
                        $dict.load_Selection({
                            codetype: "SELECT_DICT",
                            param: {
                                SQL_ID: "selectGroupLevelThreeSelection",
                                SELECT_AREA: $area.val()
                            },
                            newMode: true,
                            needCode: false,
                            container: $container
                        }).trigger("change");
                    }
                }).load_Selection({
                    codetype: "SELECT_AREA",
                    param: {
                        SQL_ID: "selectGroupLevelTwoSelection",
                        SELECT_CITY: $city.val()
                    },
                    newMode: true,
                    needCode: false,
                    container: $container
                }).trigger("change");
            }).load_Selection({
                codetype: "SELECT_CITY",
                param: {
                    SQL_ID: "selectGroupLevelOneSelection"
                },
                newMode: true,
                needCode: false,
                placeholder: "请输入查询地市",
                container: $container
            });
        },
        bindTableTitle: function ($table, style) {
            style = style + "";//可以输入数字
            if (style === "3") {
                $table.on("click", "tbody tr", function (event) {
                    var $tr = $(this);
                    //style3
                    $('body').triggerHandler("vv.circle.function", [event, "func_detail", $tr]);
                });
            } else {
                $table.on("mouseover", "tbody tr td", function () {
                    var $td = $(this);
                    if ($td.children().length !== 0) {
                        return;
                    }
                    if (style === "1") {
                        //style1
                        if (!$td.attr("title")) {
                            $td.attr("title", $td.text());
                        }
                    } else if (style === "2") {
                        //style2
                        if (!$td.attr("data-title")) {
                            $td.attr("data-title", $td.text()).tooltip({
                                delay: {"show": 500, "hide": 100}, container: 'body', title: $td.text()
                            }).trigger("focusin");//give it a try Q&A it works 调用这个方法保证第一次也可以有提示
                        }
                    }
                });
            }
        },
        testSpeed: function (targetFunction) {
            var start = new Date().getTime();
            targetFunction();
            var end = new Date().getTime();
            var perTime = end - start;
            var cycle;
            if (perTime < 1) {
                cycle = 2000;
            } else if (perTime >= 1 && perTime < 10) {
                cycle = 1000;
            } else if (perTime >= 10 && perTime < 50) {
                cycle = 200;
            } else if (perTime >= 50 && perTime < 250) {
                cycle = 20;
            } else {
                cycle = 5;
            }
            start = new Date().getTime();
            for (var i = 0; i < cycle; i++) {
                targetFunction();
            }
            end = new Date().getTime();
            _log("此次测试用时:" + (end - start) / 1000 + "秒，共计执行" + cycle + "次，平均每5次用时" + (end - start) / 5);

        },

        /*---------------------------------- 分割线    上方为和页面功能耦合 下方为单独的功能-------------------------------*/
        /*---------------------------------- 分割线    上方为和页面功能耦合 下方为单独的功能-------------------------------*/
        /*---------------------------------- 分割线    上方为和页面功能耦合 下方为单独的功能-------------------------------*/
        /*---------------------------------- 分割线    上方为和页面功能耦合 下方为单独的功能-------------------------------*/
        /*---------------------------------- 分割线    上方为和页面功能耦合 下方为单独的功能-------------------------------*/


        /* 两个字符将表单信息转换的方法*/
        parseParam: function ($objs) {
            var param_str = "{";
            var multipleFlag = false;
            $objs.each(function () {
                multipleFlag = true;
                param_str += $(this).attr("name") + ":\"";
                param_str += $(this).val() + "\",";
            });
            if (multipleFlag) {
                param_str = param_str.substr(0, param_str.length - 1);
            }
            param_str += "}";
            return param_str;
        }
        ,
        parseParamObj: function ($objs) {
            var obj = {};
            $objs.each(function () {
                obj[$(this).attr("name")] = $(this).val();
            });
            return obj;
        }
        ,
        filterFormEle: function ($form) {
            return $form.find("[name]").filter(function () {
                if ($(this).is(":visible") || $(this).is("[type='hidden']")) {
                    //_log($(this).attr("name") + "is hidden");
                    return true;
                }
            });
        },
        /*  过滤元素 */
        filterArray: function (array, filterCol, filterVal, opposite) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                if (array[i][filterCol] === filterVal) {
                    if (opposite !== true) {
                        result.push(array[i]);
                    }
                } else {
                    if (opposite === true) {
                        result.push(array[i]);
                    }
                }
            }
            return result;
        },
        filterArrayByFunc: function (array, filterFunction) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                if (filterFunction(i, array[i])) {
                    result.push(array[i]);
                }
            }
            return result;
        }
        /* js中有原生方法sort，- -# */
        //, orderArray: function (array, orderCol, direction) {
        //
        //}
        ,
        paramsToJqObj: function (obj, $form) {
            //var $inputs;
            //_log("debug");
            for (var s in obj) {
                //@wangyi 2015-6-30 考虑json的问题
                //@wangyi 2015-8-28 sql格式参数无法解析
                //var  html = '<input type="hidden" name="' + s + '">';
                $form.append($("<input>").attr("type", "hidden").attr("name", s).val(obj[s]));
            }
        }
        //TODO 感觉实现的方式不是很好，可以有时间再考虑一下
        ,
        getZindex: function ($e) {
            //貌似较新版本为auto，较老版本为0
            var zindex = $.vvPlugin._formatZindex($e.css("z-index"));
            if (zindex != 0) {
                return zindex;
            }
            if ($e.parent().length === 1) {
                try {
                    return $.vvPlugin.getZindex($e.parent());
                } catch (e) {
                    return 0;
                }
            }
            else
                return 0;
        }
        ,
        _formatZindex: function (num) {
            if (isNaN(num)) {
                return 0;
            } else {
                return parseInt(num);
            }

        }
        ,
        extendParams: function (obj, obj2) {
            for (var param in obj2) {
                if (!obj[param]) {
                    obj[param] = obj2[param]
                }
            }
            return obj;
        }
        ,

        /*
         看了自己以前写的另一种代码发现 遍历obj更为合理
         */
        fillFormWithObj: function ($eles, obj) {
            //for (var param in obj) {
            //    $eles.find("[name='" + param + "']").val(obj[param]);
            //}
            $eles.each(function () {
                var name = $(this).attr("name");
                if (obj[name]) {
                    $(this).val(obj[name]);
                }
            });
        }
        ,
        upperJsonAttr: function (obj) {
            var newObj = {};
            for (var attr in obj) {
                newObj[attr.toUpperCase()] = obj[attr];
            }
            return newObj;
        }
        , load_Dictionary: function (settings, successFunc, param) {
            return $("body").load_Dictionary(settings, successFunc, param);
        }

    }
    ;
})
;
