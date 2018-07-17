const express = require('express');
const common = require('../libs/common');
const db = require('../libs/db');
const sd = require('silly-datetime');
const wxpay = require('../libs/wxpay');
const formidable = require("formidable");
var UUID = require('uuid');
var crypto = require('crypto');
const wxEnv = "wx_pro";

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
    //提交问题
    route.post('/problem', (req, res) => {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.maxFilesSize = 2 * 1024 *1024;
        form.uploadDir = '../www/file';
        form.multiples=true;
        form.keepExtensions=true;
        form.parse(req, function(err, fields, files) {
            if(fields.MODE == "cc") {
                var time=sd.format(new Date(), 'YYYYMMDD');
                var random = "";
                for(var i =0;i<6;i++){//循环六次
                    var num = Math.random()*9;//Math.random();每次生成(0-1)之间的数;
                    num = parseInt(num,10);
                    random = random + "" + num;
                }

                getWX(function (wx) {
                    var appid = wx.APP_ID;
                    var attach = fields.TITLE;
                    var body = fields.DETAIL;
                    var mch_id = wx.MCHID//商户号
                    var openid = fields.WX_CODE;//用户微信标识符
                    var bookingNo = time+""+random;//订单号
                    var total_fee = fields.PRICE;//价格
                    var notify_url = wx.RETURN_URL+"notify"; //通知地址
                    var key = wx.KEY;
                    wxpay.order(appid,attach, body, mch_id, openid, bookingNo, total_fee, notify_url,key).then(function(data){
                        if(data.toString("utf-8").search("err_code_des") != -1){
                            res.status(500).end();
                        }else {
                            insetProblem(fields,files,bookingNo,res,data);
                        }

                    });
                });

            }
            if(fields.MODE == "fc"){
                insetProblem(fields, files, "",res,"");
            }
        });
    });

    function insetProblem(fields,files,bookingNo,res,oData) {
        var id = UUID.v1();
        var pay = fields.MODE == "cc"?"N":"";
        var sql1 = `INSERT INTO ls_problem VALUES ('${id}','${bookingNo}'
                ,'${fields.WX_CODE}'
                ,'${fields.WX_NAME}'
                ,'${fields.TYPE}'
                ,'${fields.DETAIL}'
                ,'${fields.TITLE}'
                ,'${fields.TIME}'
                ,'${fields.MODE}'
                ,'${fields.NAME}'
                ,'${fields.PHONE}'
                ,'${fields.PRICE}'
                ,'${pay}','N')`;

        if(files.file != null) {

            if(files.file.length == null) {
                var img = files.file.path;
                var sql2 = `INSERT INTO ls_img VALUES ('${UUID.v1()}'
                    ,'${id}'
                    ,'${img.replace("../www","")}')`;
                query(sql2);
            }
            for(let i=0;i<files.file.length;i++){
                //上传文件数据
                var img = files.file[i].path;
                var sql2 = `INSERT INTO ls_img VALUES ('${UUID.v1()}'
                    ,'${id}'
                    ,'${img.replace("../www","")}')`;
                query(sql2);
            }
        }
        query(sql1,function (err,data) {
            if (err) {
                res.status(500).end();
            } else {
                if(oData == null || oData == "") {
                    res.status(200).send({ 'msg': '提问成功', 'status': 1 }).end();
                }else {
                    res.status(200).send(oData).end();
                }

            }
        });
    }

    route.post('/notify', function(req, res, next){
        var message = req.body.xml;
        if(message.return_code == 'SUCCESS' && message.result_code == 'SUCCESS'){
            let sql = `UPDATE ls_problem set pay = 'Y' where ORDER_CODE = '${message.out_trade_no}'`;
            query(sql,function (err,data) {
            });
            //这里你可以写支付成功后的操作
            return wxpay.notify(message);
        }else {
            return wxpay.notify("");
        }
    });

    //问题列表
    route.get('/problemList', (req, res) => {
        let wxCode = req.query.wxCode;
        let sql = `select  *  from ls_problem lp where lp.WX_CODE = '${wxCode}'`;
        query(sql,function (err,data) {
            if (err) {
                res.status(500).send({ 'msg': '服务器出错', 'status': 0 }).end();
            } else {
                if (data.length == 0) {
                    res.status(500).send({ 'msg': '无数据', 'status': 0 }).end();
                } else {
                    for (let i=0;i<data.length;i++) {
                        data[i].PAY = data[i].MODE == 'cc'?"("+common.ispay(data[i].PAY)+"￥"+data[i].PRICE+")":"";
                        data[i].TYPE = common.getpm(data[i].TYPE);
                        data[i].MODE = common.getcm(data[i].MODE);
                        data[i].FLAG = common.iswr(data[i].FLAG);

                    }
                    res.send(data);
                }
            }
        });
    });

    //问题详情
    route.get('/problemDetail', (req, res) => {
        let mId = req.query.mId;
        let sql = `SELECT * FROM ls_problem lp 
                    LEFT JOIN ls_img li on lp.ID = li.BASIC_ID
                    WHERE lp.ID = '${mId}'`;
        query(sql,function (err,data) {
            if (err) {
                res.status(500).send({ 'msg': '服务器出错', 'status': 0 }).end();
            } else {
                if (data.length == 0) {
                    res.status(500).send({ 'msg': '无数据', 'status': 0 }).end();
                } else {
                    for (let i=0;i<data.length;i++) {
                        data[i].TYPE = common.getpm(data[i].TYPE);
                        data[i].MODE = common.getcm(data[i].MODE);
                        data[i].FLAG = common.iswr(data[i].FLAG);
                        data[i].PAY = common.ispay(data[i].PAY);
                    }
                    res.send(data);
                }
            }
        });
    });

    //问题详情
    route.get('/inquiriesList', (req, res) => {
        let basicId = req.query.basicId;
        let wxCode = req.query.wxCode;
        let sql = `SELECT * FROM ls_inquiries li
                    WHERE li.BASICID = '${basicId}'`;
        query(sql,function (err,data) {
            if (err) {
                res.status(500).send({ 'msg': '服务器出错', 'status': 0 }).end();
            } else {
                if (data.length == 0) {
                    res.status(500).send({ 'msg': '无数据', 'status': 0 }).end();
                } else {
                    res.send(data);
                }
            }
        });
    });

    //律师列表
    route.get('/lawyerList', (req, res) => {
        let sql = `SELECT * FROM ls_list WHERE IS_FLAG != 'F' `;
        query(sql,function (err,data) {
            if (err) {
                res.status(500).send({ 'msg': '服务器出错', 'status': 0 }).end();
            } else {
                if (data.length == 0) {
                    res.status(500).send({ 'msg': '无数据', 'status': 0 }).end();
                } else {
                    res.send(data);
                }
            }
        });
    });

    //咨询列表
    route.get('/phoneList', (req, res) => {
        let wxCode = req.query.wxCode;
        let sql = `select  lpp.*,ll.NAME as LS_NAME from ls_phone_problem lpp
                LEFT JOIN ls_list ll on ll.ID = lpp.LS_ID where lpp.WX_CODE = '${wxCode}'`;
        query(sql,function (err,data) {
            if (err) {
                res.status(500).send({ 'msg': '服务器出错', 'status': 0 }).end();
            } else {
                if (data.length == 0) {
                    res.status(500).send({ 'msg': '无数据', 'status': 0 }).end();
                } else {
                    for (let i=0;i<data.length;i++) {
                        data[i].FLAG = common.iswr(data[i].FLAG);
                    }
                    res.send(data);
                }
            }
        });
    });

    //删除在线咨询数据
    route.post('/oc/del', (req, res) => {
        var id = req.body.id;
        let sql = `delete lp,li from  ls_problem lp left join  ls_img li on lp.ID = li.BASIC_ID where lp.ID='${id}' and lp.FLAG = 'Y'`;
        query(sql,function (err,data) {
            if (err) {
                res.status(200).send({ 'msg': '删除失败,订单是否未完成！', 'status': 0 }).end();
            } else {
                res.status(200).send({ 'msg': '删除成功', 'status': 1 }).end();
            }
        });
    });

    //删除电话咨询数据
    route.post('/pc/del', (req, res) => {
        var id = req.body.id;
        let sql = `delete lp from  ls_phone_problem lp where lp.ID='${id}' and lp.FLAG = 'Y'`;
        query(sql,function (err,data) {
            if (err) {
                res.status(200).send({ 'msg': '删除失败,订单是否未完成', 'status': 0 }).end();
            } else {
                res.status(200).send({ 'msg': '删除成功', 'status': 1 }).end();
            }
        });
    });

    function query(sql,callback){
        db.query(sql, (err,data) => {
            if(callback != null)
                callback(err,data);
        });
    };

    //追问
    route.post('/inquiries', (req, res) => {
        var body = {};
        for (let obj in req.body) {
            body = JSON.parse(obj);
        }
        var date = new Date().toLocaleDateString();
        let sql1 = `SELECT * FROM ls_inquiries li WHERE li.CODE = '${body.wxCode}' AND li.BASICID = '${body.basicId}'`;
        query(sql1,function (err,data) {
            if (err) {
                res.status(200).send({ 'msg': '查询失败', 'status': 0 }).end();
            } else {
                if(data.length != 0){
                    res.status(200).send({ 'msg': '追问只限一次！', 'status': 0 }).end();
                }else {
                    let sql3 = `UPDATE ls_phone_problem lp SET lp.FLAG = 'N' WHERE lp.ID = '${body.basicId}'`;
                    query(sq3,function (err,data) {
                    });
                    var sql2 = `INSERT INTO ls_inquiries VALUES ('${UUID.v1()}','${body.basicId}','${body.wxCode}'
                            ,'${body.questioner}'
                            ,'${body.content}'
                            ,'${date}')`;
                    query(sql2,function (err,data) {
                        if (err) {
                            res.status(200).send({ 'msg': '追问失败！', 'status': 0 }).end();
                        } else {
                            res.status(200).send({ 'msg': '追问成功！', 'status': 1 }).end();
                        }
                    });
                }
            }
        });
    });

    return route;
}
