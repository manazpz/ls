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
            url: '/server/lawyer',         //请求后台的URL（*）
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
                field: 'NAME',
                title: '名字'
            }, {
                field: 'OFFICE',
                title: '事務所'
            }, {
                field: 'FIELD',
                title: '擅長領域'
            },{
                field: 'MONEY',
                title: '價格/分鐘'
            },{
                field: 'IS_FLAG',
                title: '是否認證'
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
    result += "<a href='javascript:;' class='btn btn-xs red' onclick=\"edit(" + JSON.stringify(row).replace(/"/g, '&quot;') + ",this)\" title='修改'><span class='glyphicon glyphicon-edit'></span></a>";
    result += "<a href='javascript:;' style='margin-left: 10px' class='btn btn-xs red' onclick=\"DelViewById('" + id + "')\" title='删除'><span class='glyphicon glyphicon-remove'></span></a>";

    return result;

};

function  DelViewById(id) {
    $.ajax({
        type: "POST",
        url: "/server/lawyer/del",
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

function initTable() {
    $('#table').bootstrapTable({
        showSearchButton: true, //显示搜索按钮
    });
}

function edit(row,event) {
    $('#myModal').modal('show');
    document.getElementsByName('NAME')[0].value = row.NAME;
    document.getElementsByName('OFFICE')[0].value = row.OFFICE;
    document.getElementsByName('FIELD')[0].value = row.FIELD;
    document.getElementsByName('MONEY')[0].value = row.MONEY;
    document.getElementsByName('IS_FLAG')[0].value = row.IS_FLAG;
    document.getElementsByName('id')[0].value = row.ID;
    document.getElementsByName('OPENID')[0].value = row.OPENID;
}

function closeLawyer() {
    $('#myModal').modal('hide');
    document.getElementsByName('NAME')[0].value = "";
    document.getElementsByName('OFFICE')[0].value = "";
    document.getElementsByName('FIELD')[0].value = "";
    document.getElementsByName('MONEY')[0].value = "";
    document.getElementsByName('IS_FLAG')[0].value = "已认证";
    document.getElementsByName('id')[0].value = "";
    document.getElementsByName('OPENID')[0].value = "";
    document.querySelector("#pic").files[0] = "";
}

function addLawyer(evn) {
    var NAME = document.getElementsByName('NAME')[0].value;
    var OFFICE = document.getElementsByName('OFFICE')[0].value;
    var FIELD = document.getElementsByName('FIELD')[0].value;
    var MONEY = document.getElementsByName('MONEY')[0].value;
    var IS_FLAG = document.getElementsByName('IS_FLAG')[0].value;
    var OPENID = document.getElementsByName('OPENID')[0].value;
    var id = document.getElementsByName('id')[0].value;
    var file = document.querySelector("#pic").files[0];

    if(id != null && id != "") {
        var param = new FormData();
        if(file){
            param.append("file",file);
        }
        param.append("NAME",NAME);
        param.append("OFFICE",OFFICE);
        param.append("FIELD",FIELD);
        param.append("MONEY",MONEY);
        param.append("IS_FLAG",IS_FLAG);
        param.append("OPENID",OPENID);
        param.append("ID",id);
        $.ajax({
            type: "POST",
            url: "/server/lawyer/update",
            data: param,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function(data){
                if(data.status == 1){
                    $('#myModal').modal('hide');
                    bootoast({
                        message: '更新成功',
                        type: 'success',
                        position:'right-bottom',
                        timeout:2
                    });
                }else {
                    bootoast({
                        message: '更新失败',
                        type: 'danger',
                        position:'right-bottom',
                        timeout:2
                    });
                }
            },
            error:function (data) {
                alert('请求出错！');
            }
        });
    }else {
        var param = new FormData();
        if(file){
            param.append("file",file);
        }
        param.append("NAME",NAME);
        param.append("OFFICE",OFFICE);
        param.append("FIELD",FIELD);
        param.append("MONEY",MONEY);
        param.append("IS_FLAG",IS_FLAG);
        param.append("OPENID",OPENID);
        $.ajax({
            type: "POST",
            url: "/server/lawyer/add",
            data: param,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function(data){
                if(data.status == 1){
                    $('#myModal').modal('hide');
                    bootoast({
                        message: '创建成功',
                        type: 'success',
                        position:'right-bottom',
                        timeout:2
                    });
                }else {
                    bootoast({
                        message: data.msg,
                        type: 'danger',
                        position:'right-bottom',
                        timeout:2
                    });
                }
            },
            error:function (data) {
                alert('请求出错！');
            }
        });
    }

}