var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser'); 

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var con = mysql.createConnection({
  host: '39.105.198.178',
  user: 'wms',
  password: 'tiankang',
  database: 'wms'
});

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// 添加打印模板信息
app.post('/addPrintModel', function(req, res){
  let userInfor = req.body;
  let sql = `INSERT INTO printModelInfo SET ?`;
  con.query(sql, userInfor, function(error,results){
    if(error) {
        throw error;
    } else {
        res.json({success: true});
    }
    // if (results.length === 0){
    //   res.json({code: 0});
    // } else {
    //   res.json({code: 200, data:results[0]});
    // }
  })
});
// 编辑打印模板信息
app.post('/editPrintModel', function(req, res){
    let userInfor = req.body;
    // let sql = `UPDATE node_user SET modelName = ? WHERE id = ?`;
    let sql = `UPDATE printModelInfo SET modelName= "${userInfor.modelName}" , modelContent = '${userInfor.modelContent}' , logisticsWork = ${userInfor.logisticsWork} , logisticsCompany = "${userInfor.logisticsCompany}" , status = "${userInfor.status}" WHERE id = ${userInfor.id}`;
    con.query(sql, function(error,results){
      if(error) {
          throw error;
      } else {
          res.json({success: true});
      }
    })
  });

// 获取打印模板信息
app.get('/getPrintModel', function(req, res){
    let sql = `SELECT * from printModelInfo`;
    con.query(sql, function(error,results){
        if(error) {
            throw error;
        } else {
            if (results.length === 0){
                res.json({success: false});
            } else {
                res.json({success: true, data:results});
            }
        }
    })
  });
  // 编辑模板信息获取对应模板信息
  app.post('/getItemPrintModel', function(req, res){
    let id = req.body.id;
    let sql = `SELECT * from printModelInfo WHERE id=${id}`;
    con.query(sql, function(error,results){
        if(error) {
            throw error;
        } else {
            if (results.length === 0){
                res.json({success: false});
            } else {
                res.json({success: true, data:results});
            }
        }
    })
  });

let query = (sql, values) => {
    return new Promise((resolve, reject) => {
        con.query(sql, values, (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
}

// 删除打印模板
app.post('/deleteItemPrintModel', async function(req, res){
    let getVals = req.body;
    for (let item in getVals) {
        let sql = `DELETE FROM printModelInfo WHERE id = ${getVals[item].id}`;
        const val = await query(sql);
        if (item == getVals.length-1) {
            res.json({success: true});
        }
    }  
  });










app.listen(8001);