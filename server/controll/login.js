function login(data) {
    var user = document.getElementById("name").value;
    var pwd = document.getElementById("pwd").value;
    $.ajax({
        url:'/login',
        type: 'post',
        dataType: 'json',
        data: {
            USER:user,PWD:pwd
        },
        success: function(data){
            if("ok"== data.msg) window.location.href='../view/ocList.html';
            else alert(data.msg);
        },
        error: function(err){
        }
    })
}