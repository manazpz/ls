const express = require('express');
const common = require('../libs/common');
const db = require('../libs/db');
const wxpay = require('../libs/wxpay');
const formidable = require("formidable");
const UUID = require('uuid');
const request = require('request');
const moment = require('moment');
const sd = require('silly-datetime');
const wxEnv = "wx_pro"

module.exports = () => {
    const route = express.Router();
    function getWX(callback) {
        let sql = `select  *  from ls_wx where CODE = '${wxEnv}' `;
        query(sql,function (err,data) {
            if (data.length != 0) {
                callback(data[0]);
            }
        });
    }

    //微信登錄
    route.get('/wx_login', function(req,res, next){
        getWX(function (wx) {
            var return_uri = wx.RETURN_URL + 'get_wx_access_token';
            res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+wx.APP_ID+'&redirect_uri='+return_uri+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect');
        });
    });

    /* 获取access_token */
    route.get('/get_wx_access_token', function(req,res, next){
        // 第二步：通过code换取网页授权access_token
        var code = req.query.code;
        getWX(function (wx) {
            request.get(
                {
                    url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+wx.APP_ID+'&secret='+wx.SECRET+'&code='+code+'&grant_type=authorization_code',
                },
                function(error, response, body){
                    if(response.statusCode == 200){
                        // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                        var data = JSON.parse(body);
                        var access_token = data.access_token;
                        var openid = data.openid;
                        request.get(
                            {
                                url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
                            },
                            function(error, response, body){
                                if(response.statusCode == 200){

                                    // 第四步：根据获取的用户信息进行对应操作
                                    var  userinfo = JSON.parse(body);

                                    // 小测试，实际应用中，可以由此创建一个帐户
                                    var param = JSON.stringify({"openid":userinfo.openid,"nickname":userinfo.nickname,"headimgurl":userinfo.headimgurl});
                                    res.redirect(common.SKIP_URL+"?wx="+param);

                                }else{
                                    console.log(response.statusCode);
                                }
                            }
                        );
                    }else{
                        console.log(response.statusCode);
                    }
                }
            );
        });

    });

    /* 获取access_token */
    route.get('/text', function(req,res, next){
        // 小测试，实际应用中，可以由此创建一个帐户
        var param = "{\"openid\":\"oCvWs0iKN4xh6jvNw10qmdmCQ6jA\",\"nickname\":\"headimgurl\",\"headimgurl\":\"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLWXHMG4EEWWIGicEJ1gqKGuTiaUDcazFeJLQppMkdq04pMKNmAKBAwicS3K5Pqjbfpq7KhRbrSo4V4Q/132\"}";
        res.redirect("http://localhost:8080?wx="+param);

    });

    //微信支付
    route.post('/wx/pay', function(req, res, next){
        let params = {};
        for (let obj in req.body) {
            params = JSON.parse(obj);
        }
        var time=sd.format(new Date(), 'YYYYMMDD');
        var random = "";
        for(var i =0;i<6;i++){//循环六次
            var num = Math.random()*9;//Math.random();每次生成(0-1)之间的数;
            num = parseInt(num,10);
            random = random + "" + num;
        }
        getWX(function (wx) {
            var appid = wx.APP_ID;
            var attach = params.trade_OFFICE;
            var body = params.trade_name+"["+params.trade_type+"]";
            var mch_id = wx.MCHID//商户号
            var openid = params.openid;//用户微信标识符
            var bookingNo = time+""+random;//订单号
            var total_fee = params.price;//价格
            var notify_url = wx.RETURN_URL+"wx/notify"; //通知地址
            var key = wx.KEY;
            wxpay.order(appid,attach, body, mch_id, openid, bookingNo, total_fee, notify_url,key).then(function(data){
                if(data.toString("utf-8").search("err_code_des") != -1){
                    res.status(500).end();
                }else {

                    insetPhoneProblem(params,bookingNo,res,data);

                }

            });
        });
    });

    function tuisong(params,res) {
        getWX(function (data) {
            var token = getToke(data);
            if(token == "false") {
                res.status(500).send({ 'msg': '推送失败', 'status': 0 }).end();
            }else{
                sendMessage(token,params,res);
            }
        });
    }

    function insetPhoneProblem(params,bookingNo,res,oData) {
        if(bookingNo){
            let sql1 = `SELECT COUNT(*) as num FROM ls_phone_problem where ORDER_CODE = '${bookingNo}'`;
            query(sql1,function (err,data) {
                if(err){
                    res.status(500).end();
                }else {
                    if(data[0].num == 0){
                        let sql2 = `INSERT INTO ls_phone_problem VALUES ('${UUID.v1()}'
                        ,'${bookingNo}'
                        ,'${params.openid}'
                        ,'${params.wx_name}'
                        ,'${params.ls_id}'
                        ,'${params.consumers}'
                        ,'${params.phone}'
                        ,'${params.duration}'
                        ,'${params.price}'
                        ,'N'
                        ,'N')`;
                        query(sql2,function (err,data) {
                            if (err) {
                                res.status(500).end();
                            } else {
                                let oData ={
                                    touser:params.trade_openid,
                                    name:params.consumers,
                                    tel:params.phone,
                                    lawyerName:params.trade_name,
                                    time:params.duration
                                };
                                tuisong(oData,res);
                            }
                        });
                    }else {
                        res.status(500).end();
                    }
                }

            });
        }
    }

    /**
     * 微信支付回调
     *（点击支付后微信回调的目录）
     */
    route.post('/wx/notify', function(req, res, next){
        var message = req.body.xml;
        if(message.return_code == 'SUCCESS' && message.result_code == 'SUCCESS'){
            let sql = `UPDATE ls_phone_problem set pay = 'Y' where ORDER_CODE = '${message.out_trade_no}'`;
            query(sql,function (err,data) {
            });
            //这里你可以写支付成功后的操作
            return wxpay.notify(message);
        }else {
            return wxpay.notify("");
        }
    });
    



    //保存token
    function getToke(data) {
        let token = "";
        let date = moment();
        if(!data.TIME || date/1000 - common.stringToDate(data.TIME) > 7200){
            getToken(data).then(res => {
                if(res.errcode) {
                    return "false";
                }else {
                    token = res.access_token;
                    let sql1 = `UPDATE ls_wx SET TOKEN = '${token}',TIME = '${moment(date).format('YYYY-MM-DD HH:mm:ss')}' WHERE CODE = '${wxEnv}'`;
                    query(sql1,function (err,data) {
                        if (err) {
                            return "false";
                        }
                    });
                }
            });
        }else {
            token = data.TOKEN;
        }
        return token;
    }

    //获取微信token
    function getToken(data) {
        let wxGetAccessTokenBaseUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+data.APP_ID+'&secret='+data.SECRET;
        let options = {
            method: 'GET',
            url: wxGetAccessTokenBaseUrl
        };
        return new Promise((resolve, reject) => {
            request(options, function (err, res, body) {
                if (res) {
                    resolve(JSON.parse(body));
                } else {
                    reject(err);
                }
            });
        })
    };

    /* 获取access_token */
    route.get('/wx/menue', common.isLogin,function(req,res, next){
        let sql1 = `select  COUNT(*)  from ls_wx_menue`;
        let size = 0;
        query(sql1,function (err,data) {
            size = data[0].num;
        });
        let sql = `select  *  from ls_wx_menue ORDER BY wx_name1`;
        query(sql,function (err,data) {
            if (data.length != 0) {
                res.send({total:size,rows:data});
            }else {
                res.send({total:0,rows:''});
            }
        });

    });

    route.post('/wx/menue/add', (req, res) => {
        let menue = req.body;
        let sql = `INSERT INTO ls_wx_menue ( id,wx_name1, wx_name2,wx_type,wx_key,wx_url ) 
        VALUES ( '${UUID.v1()}','${menue.wx_name1}','${menue.wx_name2}','${menue.wx_type}','${menue.wx_key}','${menue.wx_url}' )`;
        query(sql,function (err,data) {
            if (err) {
                res.send({ 'msg': '服务器出错', 'status': 0 }).end();
            } else {
                res.send({ 'msg': '创建成功', 'status': 1 }).end();
            }
        });
    });

    route.post('/wx/menue/update', (req, res) => {
        let menue = req.body;
        let sql = `UPDATE ls_wx_menue SET wx_name1 = '${menue.wx_name1}',wx_name2 = '${menue.wx_name2}',wx_type = '${menue.wx_type}', wx_key = '${menue.wx_key}', wx_url = '${menue.wx_url}' WHERE id = '${menue.id}'`;
        query(sql,function (err,data) {
            if (err) {
                res.send({ 'msg': '服务器出错', 'status': 0 }).end();
            } else {
                res.send({ 'msg': '更新成功', 'status': 1 }).end();
            }
        });
    });

    route.post('/wx/menue/del', (req, res) => {
        var id = req.body.id;
        let sql = `delete lwm from  ls_wx_menue lwm  where lwm.id='${id}'`;
        query(sql,function (err,data) {
            if (err) {
                res.status(200).send({ 'msg': '删除失败', 'status': 0 }).end();
            } else {
                res.status(200).send({ 'msg': '删除成功', 'status': 1 }).end();
            }
        });
    });

    route.post('/wx/menue/sync', (req, res) => {
        getWX(function (data) {
            var ress = res;
            var token = getToke(data);
            if(token == "false") {
                res.status(500).send({ 'msg': '微信验证失败', 'status': 0 }).end();
            }else{
                var wxMenueUrl = 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token='+token;
                var sql = `SELECT * FROM ls_wx_menue`;
                query(sql,function (err,data) {
                    if (err) {
                        ress.send({ 'msg': '服务器出错', 'status': 0 }).end();
                    } else {
                        var body = menueBody(data);
                        let options = {
                            method: 'POST',
                            url: wxMenueUrl,
                            body:body
                        };

                        return new Promise((resolve, reject) => {
                            request(options, function (err, res, body) {
                                if (res) {
                                    resolve(JSON.parse(body));
                                    if(JSON.parse(body).errmsg == "ok") {
                                        ress.status(200).send({ 'msg': '創建成功', 'status': 1 }).end();
                                    }else {
                                        ress.status(200).send({ 'msg': '創建失敗', 'status': 0 }).end();
                                    }
                                } else {
                                    reject(err);
                                }
                            });
                        })
                    }
                })
            }
        });
    });

    function menueBody(data) {
        var rArray = new Array();
        var flag = false;
        for(var i=0;i<data.length;i++){
            for (var j = 0;j<rArray.length;j++){
                if(rArray[j].name == data[i].wx_name1){
                    var zArr = rArray[j].sub_button;
                    var zjson;
                    if(data[i].wx_url != null && data[i].wx_url != ""){
                        zjson = {"type":data[i].wx_type,"name":data[i].wx_name2,"url":data[i].wx_url,"sub_button":[]};
                    }
                    if(data[i].wx_key != null && data[i].wx_key != ""){
                        zjson = {"type":data[i].wx_type,"name":data[i].wx_name2,"key":data[i].wx_key,"sub_button":[]};
                    }

                    zArr.push(zjson);
                    flag = true;
                    break;
                }
            }

            if(rArray.length == 0 || !flag){
                var zjson;
                if(data[i].wx_name2 != null && data[i].wx_name2 != ""){
                    if(data[i].wx_url != null && data[i].wx_url != ""){
                        zjson = {"name":data[i].wx_name1,"sub_button":[{"type":data[i].wx_type,"name":data[i].wx_name2,"url":data[i].wx_url,"sub_button":[]}]};
                    }
                    if(data[i].wx_key != null && data[i].wx_key != ""){
                        zjson = {"name":data[i].wx_name1,"sub_button":[{"type":data[i].wx_type,"name":data[i].wx_name2,"key":data[i].wx_key,"sub_button":[]}]};;
                    }
                }else {
                    if(data[i].wx_url != null && data[i].wx_url != ""){
                        zjson = {"type":data[i].wx_type,"name":data[i].wx_name1,"url":data[i].wx_url,"sub_button":[]};
                    }
                    if(data[i].wx_key != null && data[i].wx_key != ""){
                        zjson = {"type":data[i].wx_type,"name":data[i].wx_name1,"key":data[i].wx_key,"sub_button":[]};
                    }
                }
                rArray.push(zjson);
            }
        }
       return JSON.stringify({button:rArray});
    }

    function query(sql,callback){
        db.query(sql, (err,data) => {
            if(callback != null)
                callback(err,data);
        });
    };

    route.post('/wx/custom/send', (req, res) => {
        var id = req.body.id;
        getWX(function (data) {
            var token = getToke(data);
            if(token == "false") {
                res.status(500).send({ 'msg': '推送失败', 'status': 0 }).end();
            }else{
                var sql = `SELECT
                        lp.*, ll.NAME AS lawyerName,ll.OPENID AS OPENID
                    FROM
                        ls_phone_problem lp
                    LEFT JOIN ls_list ll ON ll.ID = lp.LS_ID
                    WHERE
                        lp.ID = '${id}'`;
                query(sql,function (err,data) {
                    if (err) {
                        ress.send({ 'msg': '服务器出错', 'status': 0 }).end();
                    } else {
                        let oData ={
                            touser:data[0].OPENID,
                            name:data[0].NAME,
                            tel:data[0].PHONE,
                            lawyerName:data[0].lawyerName,
                            time:data[0].DURATION
                        }
                        sendMessage(token,oData,res);
                    }
                });
            }
        });
    });

    function sendMessage(token,data,res) {
        var wxGetAccessTokenBaseUrl = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='+token;
        var body;
        body = wxpay.sendBody(data);
        let options = {
            method: 'POST',
            url: wxGetAccessTokenBaseUrl,
            body:body
        };
        var ress = res;
        return new Promise((resolve, reject) => {
            request(options, function (err, res, body) {
                if (res) {
                        resolve(JSON.parse(body));
                        if(JSON.parse(body).errmsg == "ok") {
                            ress.status(200).send({ 'msg': '創建成功', 'status': 1 }).end();
                        }else {
                            ress.status(200).send({ 'msg': '創建失敗', 'status': 0 }).end();
                        }
                } else {
                    reject(err);
                }
            });
        })
    }

    return route;
}
