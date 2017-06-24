/**
 * Created by Administrator on 2015/4/27.
 */
$(function () {
    var path = "./././resources/echarts/js";
    require.config({
        paths: {
            echarts: path
        }
    });
    //变更datatable错误提示
    $.fn.dataTable.ext.errMode = function (e) {
        alertMsg("数据加载失败", "danger");
    };

    //禁用Enter键表单自动提交
    document.onkeydown = function (event) {
        var target, code, tag;
        if (!event) {
            event = window.event; //针对ie浏览器
            target = event.srcElement;
            code = event.keyCode;
            if (code == 13) {
                tag = target.tagName;
                if (tag == "TEXTAREA") {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            target = event.target; //针对遵循w3c标准的浏览器，如Firefox
            code = event.keyCode;
            if (code == 13) {
                tag = target.tagName;
                if (tag == "INPUT") {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    };

// 2015-2-28 @wangyi : 防止连点,disabled不能点，不用特殊考虑
    $("body").on("click", "button,input[type='button']", function (e) {
        e.preventDefault();
        var $obj = $(this);
        if ($obj.hasClass("btn-none-click")) {
            return;
        }
        // 增加图形转动特效
        $obj.find("i").each(function () {
            if (!$(this).hasClass("fa-spin")) {
                var $i_obj = $(this);
                $i_obj.addClass("fa-spin");
                setTimeout(function () {
                    $i_obj.removeClass("fa-spin");
                }, 2000);
            }
        });
        $obj.attr("disabled", true);
        setTimeout(function () {
            $obj.attr("disabled", false);
        }, 1000);
    });
    //bootstrap-datetimepicker在ie8下报错增加代码兼容   @By internet
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }
    // 增加数组移除指定位置元素功能 @By internet  ,这样遍历array 就会多出一个对象
    if (!Array.prototype.remove) {
        Array.prototype.remove = function (idx) {

            if (isNaN(idx) || idx > this.length) {
                return false;
            }
            for (var i = 0, n = 0; i < this.length; i++) {
                if (this[i] != this[idx]) {
                    this[n++] = this[i]
                }
            }
            this.length -= 1
        };
    }
    if (!Array.prototype.unique) {
        Array.prototype.unique = function () {
            var n = {}, r = []; //n为hash表，r为临时数组
            for (var i = 0; i < this.length; i++) //遍历当前数组
            {
                if (!n[this[i]]) //如果hash表中没有当前项
                {
                    n[this[i]] = true; //存入hash表
                    r.push(this[i]); //把当前数组的当前项push到临时数组里面
                }
            }
            return r;
        };
    }

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
    Date.prototype.Format = function (fmt) { // author: meizz
        var o = {
            "M+": this.getMonth() + 1, // 月份
            "d+": this.getDate(), // 日
            "h+": this.getHours(), // 小时
            "m+": this.getMinutes(), // 分
            "s+": this.getSeconds(), // 秒
            "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
            "S": this.getMilliseconds()
            // 毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    String.prototype.replaceAll = function (org, target) {
        return this.split(org).join(target);
    };
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (head) {
            if (this.length < head.length) return false;
            return this.substr(0, head.length) === head;
        };
    }
    //增加表格选中
    var clickRow;
    $('body').on('click', '.table>tbody>tr,.table-ysjh2>tbody>tr', function (event) {
        var $table = $(this).parent().parent();
        if ($table.hasClass("noSelect")) {
            return;
        }
        $(".table-circle-menu").hide();
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            //@wangyi 2015-6-14 这里改用他内置的获取方式进行移除，因为有些不在页面上，会产生多选的问题
            if ($.fn.DataTable.isDataTable($table)) { //FIXED 这里后续变更为 $("#myTable").dataTable() 来进行获取  Q&A 解决了不过不是之前说的 //不过有问题，加了判断
                $table.dataTable().api().$('tr.selected').removeClass('selected');
            } else {
                $table.find(".selected").removeClass('selected');
            }
            $(this).addClass('selected');
            if ($table.hasClass("table-tool")) {
                var _mousePosition = mousePosition(event);
                clickRow = $(this);
                $(".table-circle-menu").vCircleMenu(_mousePosition[0], _mousePosition[1], 40, {}, $(this));
            }
        }
        $table.triggerHandler("select.vTable.row");//增加一个
    });
    $('body').on('vv.circle.function', function (orgevent, event, funcName, $tr) {
        //_log("debug");
        if ($tr) {
            clickRow = $tr;
        }
        try {
            switch (funcName) {
                case "func_detail":
                    var $table = clickRow.parentsVUntil(".table");
                    var confs = $table.data("displayer");
                    var table = null;
                    if ($.fn.DataTable.isDataTable($table)) { //直接调用会将table直接变为datatable，注意
                        table = $table.dataTable().api();
                    }
                    var html = "<small style='word-break: break-all;'>";
                    if (confs) {
                        if (!(confs.DP_DATAS instanceof Array)) {
                            return;
                        }
                        var data = table.row(clickRow).data();
                        // 拼装结果
                        for (var i = 0; i < confs.DP_DATAS.length; i++) {
                            html += _getHtml(ele.DP_COL_NAME, data[ele.DP_COL_ID]);
                        }
                    } else {
                        //@wangyi 2015-6-27 功能改造，还是很满意哒 ^ ^
                        clickRow.find("td").each(function () {
                            var _title = $(table.column(table.cell(this).index().column).header()).text();
                            if (_title)
                                html += _getHtml(_title, $(this).text());
                        });
                    }
                    html += "</small>";
                    $("#table_detail .bg-ex-content").html(html);
                    if ($("#table_detail").is(":hidden")) {
                        var _mousePosition = mousePosition(event);
                        $("#table_detail").css("left", _mousePosition[0]);
                        $("#table_detail").css("top", _mousePosition[1]);
                        $("#table_detail").fadeIn("100");
                        //开启拖动
                        $("#table_detail").draggable({handle: ".bg-ex-title"});
                    }

                    break;
                default :
                    break;
            }
        } catch (e) {
        }
        ;

        $(".table-circle-menu").hide();
        function _getHtml(title, value) {
            if (value === "undefined") {
                value = "";
            }
            return "" + title + "&nbsp;:&nbsp;" + value + "<hr class='mg-t-2 mg-b-2' style='border-color:#B3B3B3'>";

        }
    });

    $('body').on('click', '.table-circle-menu', function (event) {
        $('body').triggerHandler("vv.circle.function", [event, $(this).attr("name")]);
    });
    $("#table_detail .fa-close").click(function () {
        $("#table_detail").fadeOut(100);
    });

    $('body').on("vv.menu_change", function () {
        $("#table_detail").hide();
        $(".table-circle-menu").hide();
        initCommonScrollHelper();
    });
    $("#form_modal,#choose_modal,#form_modal_mini").on("show.bs.modal", function () {
        initCommonScrollHelper();
    });
    $("#form_modal,#choose_modal,#form_modal_mini").on("shown.bs.modal", function () {
        //$(this).vAdjust(); 此处暂时不需要调用
        $(this).find(".vChart").each(function () {
            if ($(this).is(":visible"))
                $(this).data("chart").resize();
        });
        $(".table-circle-menu").hide();
        $("#table_detail").hide();
        if ($(this).attr("id") === 'form_modal') {
            $(this).find(".modal-dialog").height()
        }
        //调用初始化方法
        //先切换的为showform中的方法，后面的为页面中绑定
        $(this).triggerHandler("shown.user.function");
        $(this).find("[name='form_body']").children().filter("form").triggerHandler("shown.vv.modal");
    });
    $("#form_modal,#choose_modal,#tree_select_modal,#form_modal_mini,#alert_msg,#comfrim_modal").on("hidden.bs.modal", function () {
        $(".table-circle-menu").hide();
        $("#table_detail").hide();
        // @wangyi 2015-5-20 有一个问题想在这里解决，就是在打开模态框后再打开选择框，选择框关闭后
        // 模态的框的滚动条失效，并且body的滚动条起作用了，肯定不是想要这样的效果
        if ($("#form_modal").is(":visible")) {
            $("body").addClass("modal-open");
        }
        initCommonScrollHelper();
    });

    //双击移除,在choose中应用
    fObject("selected_area", "choose_modal").on('dblclick', ".panel", function () {
        var _objData = $("#choose_modal").data("selectObj");
        delete _objData[$(this).find("[name='selelct_id']").val()];
        $("#choose_modal").data("selectObj", _objData);
        $(this).popover("hide");
        $(this).remove();
    });


    var $moving;
    var before;
    var min_width = 50;
    $("body").on("mousemove", ".table-resize th", function (event) {
        if ($moving) {
            return;
        }
        var $th = $(this);
        if (moveAccess(event, $th)) {
            $th.css({'cursor': 'ew-resize'});
        } else {
            $th.css({'cursor': 'default'});
        }
    }).on("mousedown", ".table-resize th", function (event) {
        if ($moving) {
            return;
        }
        var $th = $(this);
        if (moveAccess(event, $th)) {
            $moving = $th;
            var $table = $th.parentsVUntil("table");
            if ($table.parent().hasClass("dataTables_scrollHeadInner")) {
                $moving = $table.parent().parent().parent().find(".dataTables_scrollBody table>thead>tr>th").eq($th.index()).add(this);
            }
            $moving.addClass("moving");
            before = $th.width() - mousePosition(event)[0];
        } else {
            $moving = null;
        }
    }).on("mouseup", function (event) {
        if (!$moving) {
            return;
        }
        $moving.removeClass("moving");
        $moving = null;

    }).on("mousemove", function (event) {
        if (!$moving) {
            return;
        }
        resize(mousePosition(event)[0]);
        return false;
    });

    function resize(curX) {
        var calc = before + curX;
        if (min_width > before + curX) {
            calc = min_width;
        }
        $moving.width(calc);
        $moving.find(".th-container").width(calc);

    }

    function moveAccess(event, $th) {
        var left = $th.offset().left;
        var clientX = mousePosition(event)[0];
        var width = $th.outerWidth();
        if ((width + left - clientX ) < 10) {
            return true;
        }
        else {
            return false;
        }
    }

    $("body").on("click", "[name='extend-toggle']", function () {
        //@wangyi 2015-7-10 校验元素时，要特殊处理下
        var $icon = $(this).find(".fa");
        var $extend = $(this).next();
        if ($icon.hasClass("fa-caret-right")) {
            if ($icon.is(":visible")) {
                $extend.fadeIn('fast');
            } else {
                $extend.show();
            }
            $icon.removeClass("fa-caret-right").addClass("fa-caret-down");
            $extend.find("[validation]").removeClass("no-vali");
        } else {
            $extend.fadeOut('fast');
            $icon.removeClass("fa-caret-down").addClass("fa-caret-right");
            $extend.removeError();
            $extend.find("[validation]").addClass("no-vali");
        }
    });

    {   //帮助移动到底部和顶部的功能，modal和页面都可以
        var showFlag = false;
        var $upIcon = $("#global-scroll-top-icon");
        var $downIcon = $("#global-scroll-bottom-icon");
        $(window).add($("#form_modal,#choose_modal,#tree_select_modal,#form_modal_mini,#alert_msg,#comfrim_modal")).scroll(function () {
            var $this = $(this)
                , scrollHeight = $this[0].scrollHeight
                , windowHeight = $this.height()
                , windowFlag = false;
            if (!scrollHeight) {
                scrollHeight = $("body")[0].scrollHeight;
                windowFlag = true;
            }
            if (!showFlag && windowHeight * 2.5 < scrollHeight) {
                showFlag = true;
                $upIcon.fadeIn("slow").unbind("click").click(function () {
                    if (!windowFlag)
                        $this.animate({scrollTop: 0}, 300);
                    else
                        $this.scrollTop(0);
                });
                $downIcon.fadeIn("slow").unbind("click").click(function () {
                    if (!windowFlag)
                        $this.animate({scrollTop: scrollHeight}, 400);
                    else
                        $this.scrollTop(999999);
                });
            }
        });
        function initCommonScrollHelper() {
            $upIcon.hide();
            $downIcon.hide();
            showFlag = false;
        }
    }
});