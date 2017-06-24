$(function () {
    /* 虽然随意增减属性很随意，但是还是要在增减属性时，在默认选项中体现出这些选项的变化 */
    /* 弹出modal表单的默认*/
    jQuery.vvPluginDefault = {
        showForm: {
            url: "", //此项是modal页面内容的请求地址
            refresh: false,   // 此项是打开modal时，如果和上次地址一样是否要刷新，目的是怕误操作影响的用户录入内容
            title: "表单信息", // 此项是modal窗的title
            width: "",       // 可以定制modal窗的大小，推荐使用%
            confrimFunc: null, // 点击确认按钮的事件
            changeCheck: true, // form中的表单元素是否在变更时校验
            blurCheck: true,   //  form中的表单元素是否在失去焦点时校验
            checkDisplay: {
                fail_show_type: "default",
                succ_show_type: "default"
            },
            header: true,
            footer: true, //modal的底部按钮是否隐藏
            baseModal: "form_modal",
            initFunc: null,
            modalContent: ""//这里可以直接传内容
        }
        , showTree: {
            url: "", //此项是modal页面内容的请求地址
            title: "表单信息", // 此项是modal窗的title
            width: "",       // 可以定制modal窗的大小，推荐使用%
            confrimFunc: null, // 点击确认按钮的事件
            checkDisplay: {
                fail_show_type: "default",
                succ_show_type: "default"
            },
            clickTreeNode: function () {
                //_log("这里需要有自己的方法");
            },
            header: false,
            footer: false //modal的底部按钮是否隐藏
        }


        /* 表单验证区域默认选项*/
        , vali_Form: {
            fail_show_type: "default", //失败时的展示：有none，alertMsg，alertMsg_B，默认4种
            succ_show_type: "default",  //成功时的展示，有默认和none两种
            visible: true // 元素不可见时是否校验，在分标签的时候用到
        }
        , vali_Ele: {
            fail_show_type: "default", //失败时的展示：有none，alertMsg，alertMsg_B，默认4种
            succ_show_type: "default"  //成功时的展示，有默认和none两种
        }


        , vCircleMenu: {
            animate: true
        }, load_Selection: {
            url: "/loadSelection.do",
            autocomplete: false,//是否开启自动补全，如果有自动补全后台应当考虑数目的限制
            minLength: 2,
            needCode: false,//是否已code--name形式显示
            selectFunc: function () {

            },
            paramName: "condition",//后台传递前台录入值的名称
            /*autocomple       te 结束*/
            codetype: '',
            param: {},
            // 2015-3-9 @wangyi : 是否可以访问缓存
            cache: true,
            // 2015-3-9 @wangyi : 拼接条件生成方法
            condition: undefined,
            needEmpty: true,
            defaultVal: '',
            loadComplete: null,//装载完成之后，可用于级联
            //@wangyi 2015-8-3 新增选项，通过input text 来判断，然后有自动完成的功能

            newMode: false,// 新模式开关
            container: $("#main_area").parent()
        }


    }


})
;