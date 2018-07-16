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
            url: '/wx/menue',         //请求后台的URL（*）
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
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [{
                checkbox: true,
                visible: false                  //是否显示复选框
            }, {
                field: 'wx_name1',
                title: '一级菜单'
            }, {
                field: 'wx_name2',
                title: '二级菜单'
            }, {
                field: 'wx_type',
                title: '触发类型'
            }, {
                field: 'wx_key',
                title: '组件标识符'
            },{
                field: 'wx_url',
                title: '链接'
            }, {
                field:'id',
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
    result += "<a href='javascript:;' class='btn btn-xs red' onclick=\"edit(" + JSON.stringify(row).replace(/"/g, '&quot;') + ",this)\" title='编辑'><span class='glyphicon glyphicon-edit'></span></a>";
    result += "<a href='javascript:;' style='margin-left: 10px' class='btn btn-xs red' onclick=\"DelViewById('" + id + "')\" title='删除'><span class='glyphicon glyphicon-remove'></span></a>";
    return result;

};

function  DelViewById(id) {
    $.ajax({
        type: "POST",
        url: "/wx/menue/del",
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

function edit(row,event) {
    $('#myModal').modal('show');
    document.getElementsByName('wx_name1')[0].value = row.wx_name1;
    document.getElementsByName('wx_name2')[0].value = row.wx_name1;
    document.getElementsByName('wx_type')[0].value = row.wx_type;
    document.getElementsByName('wx_key')[0].value = row.wx_key;
    document.getElementsByName('wx_url')[0].value = row.wx_url;
    document.getElementsByName('id')[0].value = row.id;
}

function closeWxMenue() {
    $('#myModal').modal('hide');
    document.getElementsByName('wx_name1')[0].value = "";
    document.getElementsByName('wx_name2')[0].value = "";
    document.getElementsByName('wx_type')[0].value = "view";
    document.getElementsByName('wx_key')[0].value = "";
    document.getElementsByName('wx_url')[0].value = "";
    document.getElementsByName('id')[0].value = "";
}

function initTable() {
    $('#table').bootstrapTable({
        showSearchButton: true, //显示搜索按钮
    });
}

function addWxMenue(evn) {
    var wx_name1 = document.getElementsByName('wx_name1')[0].value;
    var wx_name2 = document.getElementsByName('wx_name2')[0].value;
    var wx_type = document.getElementsByName('wx_type')[0].value
    var wx_key = document.getElementsByName('wx_key')[0].value;
    var wx_url = document.getElementsByName('wx_url')[0].value;
    var id = document.getElementsByName('id')[0].value;
    if(id != null && id != "") {
        $.ajax({
            type: "POST",
            url: "/wx/menue/update",
            data: {id:id,wx_name1:wx_name1,wx_name2:wx_name2,wx_type:wx_type,wx_key:wx_key,wx_url:wx_url},
            dataType: "json",
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
                        message: '更新菜单失败',
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
        $.ajax({
            type: "POST",
            url: "/wx/menue/add",
            data: {wx_name1:wx_name1,wx_name2:wx_name2,wx_type:wx_type,wx_key:wx_key,wx_url:wx_url},
            dataType: "json",
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
                        message: '创建菜单失败',
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

function sync() {
    $.ajax({
        type: "POST",
        url: "/wx/menue/sync",
        dataType: "json",
        success: function(data){
            if(data.status == 1){
                bootoast({
                    message: '同步成功',
                    type: 'success',
                    position:'right-bottom',
                    timeout:2
                });
            }else {
                bootoast({
                    message: '同步失败',
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