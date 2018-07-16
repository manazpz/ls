const express = require('express');
const common = require('../libs/common');
const db = require('../libs/db');
const formidable = require("formidable");
var UUID = require('uuid');
var crypto = require('crypto');

module.exports = () => {
    const route = express.Router();

    //登入
    route.post('/login', (req, res) => {
        let user = req.body.USER;
        let pwd = crypto.createHmac('sha1', "lv").update(req.body.PWD).digest().toString('base64');
        let sql = `select  *  from lv_admin la where la.FD_LOGIN = '${user}' AND la.FD_PASSWORD = '${pwd}'`;
        query(sql,function (err,data) {
            if (err) {
                res.status(200).send({ 'msg': '服务器出错', 'status': 0 }).end();
            } else {
                if (data.length == 0) {
                    res.status(200).send({ 'msg': '无用户', 'status': 0 }).end();
                } else {
                    console.log(req.session)
                    req.session.loginUser = data[0].FD_LOGIN;
                    res.status(200).send({ 'msg': 'ok', 'status': 0 }).end();

                }
            }
        });
    });

    //登出
    route.get('/logout', (req, res) => {
        req.session.loginUser = '';
        res.redirect('/view/login.html');
    });

    //问题列表
    route.get('/server/problemList',common.isLogin,(req,res) => {
        var s1 = req.query.offset;
        var s2 = req.query.limit;
        let sql1 = `SELECT COUNT(*) as num FROM ls_problem`;
        let size = 0;
        query(sql1,function (err,data) {
            size = data[0].num;
        });
        let sql = `select  lp.*,li.CONTENT AS content  from ls_problem lp 
        LEFT JOIN ls_inquiries li ON li.BASICID = lp.ID AND li.CODE IS NOT NULL AND li.CODE != ''
        ORDER BY lp.FLAG limit ${s1}, ${s2}`;
        query(sql,function (err,data) {
            if (data.length != 0) {
                for (let i=0;i<data.length;i++) {
                    data[i].TYPE = common.getpm(data[i].TYPE);
                    data[i].MODE = common.getcm(data[i].MODE);
                    data[i].FLAG = common.iswr(data[i].FLAG);
                    data[i].PAY = common.ispay(data[i].PAY);
                }
                res.send({total:size,rows:data});
            }else {
                res.send({total:0,rows:''});
            }
        });
    });

    //问题列表
    route.get('/server/phoneList',common.isLogin, (req, res) => {
        var s1 = req.query.offset;
        var s2 = req.query.limit;
        var flag = req.query.flag;
        let sql1 = `SELECT COUNT(*) as num FROM ls_phone_problem`;
        if(flag != null && flag != "") sql1 += ` where FLAG = '${flag}'`;
        let size = 0;
        query(sql1,function (err,data) {
            size = data[0].num;
        });
        let sql = `select  lpp.*,ll.NAME as LS_NAME from ls_phone_problem lpp
                LEFT JOIN ls_list ll on ll.ID = lpp.LS_ID `;
        if(flag != null && flag != "") sql += ` where lpp.FLAG = '${flag}'`;
        sql += ` ORDER BY lpp.FLAG limit ${s1}, ${s2}`;
        query(sql,function (err,data) {
            if (data.length != 0) {
                for (let i=0;i<data.length;i++) {
                    data[i].FLAG = common.iswr(data[i].FLAG);
                    data[i].PAY = common.ispay(data[i].PAY);
                }
                res.send({total:size,rows:data});
            }else {
                res.send({total:0,rows:''});
            }

        });
    });

    //删除在线咨询数据
    route.post('/server/oc/del', (req, res) => {
        var id = req.body.id;
        let sql = `delete lp,li from  ls_problem lp left join  ls_img li on lp.ID = li.BASIC_ID where lp.ID='${id}'`;
        query(sql,function (err,data) {
            if (err) {
                res.status(200).send({ 'msg': '删除失败', 'status': 0 }).end();
            } else {
                res.status(200).send({ 'msg': '删除成功', 'status': 1 }).end();
            }
        });
    });

    //在线咨询更新
    route.post('/server/oc/sure', (req, res) => {
        var id = req.body.id;
        var content = req.body.content;
        var date = new Date().toLocaleDateString();
        let sql = `UPDATE ls_problem lp SET lp.FLAG = 'Y' WHERE lp.ID = '${id}'`;
        query(sql,function (err,data) {
            if (err) {
                res.status(200).send({ 'msg': '确认失败', 'status': 0 }).end();
            } else {
                var sql2 = `INSERT INTO ls_inquiries VALUES ('${UUID.v1()}','${id}',''
                            ,''
                            ,'${content}'
                            ,'${date}')`;
                query(sql2,function (err,data) {
                    if (err) {
                        res.status(200).send({ 'msg': '回复失败！', 'status': 0 }).end();
                    } else {
                        res.status(200).send({ 'msg': '回复成功！', 'status': 1 }).end();
                    }
                });
            }
        });
    });

    //删除电话咨询数据
    route.post('/server/pc/del', (req, res) => {
        var id = req.body.id;
        let sql = `delete lp from  ls_phone_problem lp where lp.ID='${id}'`;
        query(sql,function (err,data) {
            if (err) {
                res.status(200).send({ 'msg': '删除失败', 'status': 0 }).end();
            } else {
                res.status(200).send({ 'msg': '删除成功', 'status': 1 }).end();
            }
        });
    });

    //电话咨询更新
    route.post('/server/pc/sure', (req, res) => {
        var id = req.body.id;
        let sql = `UPDATE ls_phone_problem lp SET lp.FLAG = 'Y' WHERE lp.ID = '${id}'`;
        query(sql,function (err,data) {
            if (err) {
                res.status(200).send({ 'msg': '确认失败', 'status': 0 }).end();
            } else {
                res.status(200).send({ 'msg': '确认成功', 'status': 1 }).end();
            }
        });
    });


    //律師列表
    route.get('/server/lawyer',common.isLogin,(req,res) => {
        var s1 = req.query.offset;
        var s2 = req.query.limit;
        let sql1 = `SELECT COUNT(*) as num FROM ls_list `;
        let size = 0;
        query(sql1,function (err,data) {
            size = data[0].num;
        });
        let sql = `select  *  from ls_list ORDER BY IS_FLAG limit ${s1}, ${s2}`;
        query(sql,function (err,data) {
            if (data.length != 0) {
                res.send({total:size,rows:data});
            }else {
                res.send({total:0,rows:''});
            }
        });
    });

    //律師管理新增
    route.post('/server/lawyer/add', (req, res) => {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.maxFilesSize = 2 * 1024 *1024;
        form.uploadDir = '../www/file';
        form.multiples=true;
        form.keepExtensions=true;
        form.parse(req, function(err, fields, files) {
            if(files.file){
                var img = files.file.path;
                let sql = `INSERT INTO ls_list ( ID, HEAD_PORTRAIT,NAME, OFFICE,FIELD,MONEY,IS_FLAG )
            VALUES ( '${UUID.v1()}','${img.replace("../www","")}','${fields.NAME}','${fields.OFFICE}','${fields.FIELD}','${fields.MONEY}','${fields.OPENID}','${fields.IS_FLAG}' )`;
                query(sql,function (err,data) {
                    if (err) {
                        res.send({ 'msg': '服务器出错', 'status': 0 }).end();
                    } else {
                        res.send({ 'msg': '提问成功', 'status': 1 }).end();
                    }
                });
            }else {
                res.send({ 'msg': '请上传头像', 'status': 0 }).end();
            }

        });
    });

    //律師管理修改
    route.post('/server/lawyer/update', (req, res) => {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.maxFilesSize = 2 * 1024 *1024;
        form.uploadDir = '../www/file';
        form.multiples=true;
        form.keepExtensions=true;
        form.parse(req, function(err, fields, files) {
            if(files.file){
                var img = files.file.path;
                let sql = `UPDATE ls_list SET NAME = '${fields.NAME}',OFFICE = '${fields.OFFICE}',OPENID = '${fields.OPENID}',HEAD_PORTRAIT = '${img.replace("../www","")}',FIELD = '${fields.FIELD}', MONEY = '${fields.MONEY}', IS_FLAG = '${fields.IS_FLAG}' WHERE ID = '${fields.ID}'`;
                query(sql,function (err,data) {
                    if (err) {
                        res.send({ 'msg': '服务器出错', 'status': 0 }).end();
                    } else {
                        res.send({ 'msg': '提问成功', 'status': 1 }).end();
                    }
                });
            }else {
                let sql = `UPDATE ls_list SET NAME = '${fields.NAME}',OFFICE = '${fields.OFFICE}',OPENID = '${fields.OPENID}',FIELD = '${fields.FIELD}', MONEY = '${fields.MONEY}', IS_FLAG = '${fields.IS_FLAG}' WHERE ID = '${fields.ID}'`;
                query(sql,function (err,data) {
                    if (err) {
                        res.send({ 'msg': '服务器出错', 'status': 0 }).end();
                    } else {
                        res.send({ 'msg': '提问成功', 'status': 1 }).end();
                    }
                });
            }

        });

        // let menue = req.body;
        // let sql = `UPDATE ls_list SET NAME = '${menue.NAME}',OFFICE = '${menue.OFFICE}',FIELD = '${menue.FIELD}', MONEY = '${menue.MONEY}', IS_FLAG = '${menue.IS_FLAG}' WHERE ID = '${menue.ID}'`;
        // query(sql,function (err,data) {
        //     if (err) {
        //         res.send({ 'msg': '服务器出错', 'status': 0 }).end();
        //     } else {
        //         res.send({ 'msg': '更新成功', 'status': 1 }).end();
        //     }
        // });
    });

    //删除电话咨询数据
    route.post('/server/lawyer/del', (req, res) => {
        var id = req.body.id;
        let sql = `delete lp from  ls_list lp where lp.ID='${id}'`;
        query(sql,function (err,data) {
            if (err) {
                res.status(200).send({ 'msg': '删除失败', 'status': 0 }).end();
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
    return route;
}
