$(function () {

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();

});

var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_departments').bootstrapTable({
            url: '/server/problemList',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: true,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: 550,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [{
                checkbox: true,
                visible: false                  //是否显示复选框
            }, {
                field: 'WX_NAME',
                title: '提交人'
            }, {
                field: 'TYPE',
                title: '问题类型'
            }, {
                field: 'TITLE',
                title: '标题'
            }, {
                field: 'TIME',
                title: '时间'
            },{
                field: 'MODE',
                title: '咨询方式'
            },{
                field: 'NAME',
                title: '姓名'
            },{
                field: 'PHONE',
                title: '联系方式'
            },{
                field: 'PRICE',
                title: '价格'
            },{
                field: 'PAY',
                title: '是否支付'
            },{
                field: 'FLAG',
                title: '是否咨询'
            }, {
                field:'ID',
                title: '操作',
                width: 120,
                align: 'center',
                valign: 'middle',
                formatter: actionFormatter
            }, ],
            onLoadSuccess: function (data) {
                if(data.status == -1){
                    window.location.href='../view/login.html';
                }
            },
            onLoadError: function (data) {
            },

        });
    };

    return oTableInit;
};


var ButtonInit = function () {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function () {
        //初始化页面上面的按钮事件
    };

    return oInit;
};

function actionFormatter(value, row, index) {
    var id = value;
    var result = "";
    if("未回复" == row.FLAG) {
        var content = row.content == null?row.DETAIL:row.content;
        result += "<a href='javascript:;' class='btn btn-xs red' onclick=\"sure('"+id+"','" + content + "',this)\" title='回复'><span class='glyphicon glyphicon-ok'></span></a>";
    }
    result += "<a href='javascript:;' style='margin-left: 10px' class='btn btn-xs red' onclick=\"DelViewById('" + id + "')\" title='删除'><span class='glyphicon glyphicon-remove'></span></a>";
    return result;

};

function  DelViewById(id) {
    $.ajax({
        type: "POST",
        url: "/server/oc/del",
        data: {id:id},
        dataType: "json",
        success: function(data){
            if(data.status == 1) {
                window.location.reload();
            }else {
                alert(data.msg);
            }
        },
        error:function (data) {
            alert('请求出错！');
        }
    });
}

function closeLawyer() {
    $('#myModal').modal('hide');
}

function sure(id,content,event) {
    $('#myModal').modal('show');
    document.getElementsByName('wt')[0].value = content;
    document.getElementsByName('id')[0].value = id;
}

function addLawyer(evn) {
    var id = document.getElementsByName('id')[0].value;
    var content = document.getElementsByName('hf')[0].value;
    $.ajax({
        type: "POST",
        url: "/server/oc/sure",
        data: {id:id,content:content},
        dataType: "json",
        success: function(data){
            if(data.status == 1) {
                window.location.reload();
            }else {
                alert(data.msg);
            }
        },
        error:function (data) {
            alert('请求出错！');
        }
    });

}

function initTable() {
    $('#table').bootstrapTable({
        showSearchButton: true, //显示搜索按钮
    });
}