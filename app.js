console.log("Hey");
var mysql = require('mysql');
var mysql2 = require('mysql2');
var { faker } = require('@faker-js/faker');
var express = require('express')


var connection = mysql.createConnection({
    host: 'localhost'
    ,user:'root'
    ,password: 'Password100'
    ,database:'join_us'
});

// let q = "Select * from users ";

// connection.query(q,function (error ,results,fields){
//     if (error) throw error;
//     console.log(results[0]);
// });

//insert 1000 users
// var data = create500Users();

//  q = 'insert into users (email ,created_at) values ? ';

//  console.log(data);

// connection.query(q,[data],function (error ,results){
//     console.log("error: ",error)
//     console.log("results",results);
// });

//-----------------------------earliest user ----------------------------------

let q = "Select email, DATE_FORMAT(created_at, '%Y %b %D') as ealiest_date from users order by created_at asc limit 1 ";

connection.query(q,function (error ,results,fields){
    if (error) throw error;
    console.log(results[0].ealiest_date.toString());
    console.log(results[0].email);
});

//-----------------------------user  group by month----------------------------------

q = 'Select DATE_FORMAT(created_at ,"%M") as mont , count(DATE_FORMAT(created_at ,"%M")) as total from users group by mont';

connection.query(q,function (error ,results,fields){
    if (error) throw error;
    console.log(results);
});

//-----------------------------email that have yahoo----------------------------------

q = 'select count(*) as yahoo_user from users where email like "%\@yahoo%" ';

connection.query(q,function (error ,results,fields){
    if (error) throw error;
    console.log(results[0].yahoo_user);
});



//-----------------------------group by mail----------------------------------

q = `select case when email like "%@yahoo%" then "yahoo" when email like "%@gmail%" then "google"
 when email like "%@hotmail%" then "hotmail"
     else "others"
end as "provider"
,count(*) as "total_user"
from users 
group by provider `;

connection.query(q,function (error ,results,fields){
    if (error) throw error;
    console.log(results);
});



//----------------------------------------------------------------------------------

function create500Users(){
    
    data = [];
    for (let i = 0 ; i<500 ; i++)
    {
    data.push([
        faker.internet.email(),
        faker.date.past()]);
    
    }
    console.log("here");
    return data;
}



var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser')


app.set ("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
    let q = 'Select count(*) as cont from users ';
    
     connection.query(q,function (error ,results,fields){
    if (error) throw error;
    // console.log(results[0].cont);
    let count;
     count= results[0].cont;
     
     res.render("home" , {count : count});
});

app.post("/register", function(req,res){
    let person = {email: req.body.email};
    console.log(req); 
    q = 'insert into users set ?';

    connection.query(q ,person,function (error ,results){
      if(error) throw error ;
//     console.log("results",results);
});
   res.redirect("/")
})
   
});

// connection.end();
 
app.listen(3000,function(){
    console.log('listening at 3000');
});

