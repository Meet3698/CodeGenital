const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const cors = require('cors');
const Users = require('./Models/Database');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const compiler = require('compilex');
const {c, cpp, node, python, java} = require('compile-run');
const options = {stats : true}; 
const port = process.env.PORT || 3000

compiler.init(options);
const fs = require('fs');
const morgan = require('morgan');
const Cookies = require('cookies');
var session = require('express-session');
const formidable = require('formidable');
const moveFile = require('move-file');
const publicDir = require('path').join(__dirname,'/public');
const alert = require('alert-node');
app.use(express.static(publicDir));

app.use(express.static('public'));
app.use(morgan('combined'));
app.use(session({secret: 'secret',saveUninitialized: true,resave: true}));



mongoose.connect('mongodb+srv://meet:Meet@3698@anonymous-edqd9.mongodb.net/CodeGenital?retryWrites=true&w=majority',{useNewUrlParser:true});
mongoose.Promise = global.Promise;

let gfs;
const conn = mongoose.createConnection('mongodb+srv://meet:Meet@3698@anonymous-edqd9.mongodb.net/CodeGenital?retryWrites=true&w=majority',{useNewUrlParser:true});

conn.once('open',function(){
  gfs = Grid(conn.db,mongoose.mongo);
  gfs.collection('uploads');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(methodOverride('_method'));

const storage = new GridFsStorage({
  url: 'mongodb+srv://meet:Meet@3698@anonymous-edqd9.mongodb.net/CodeGenital?retryWrites=true&w=majority',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const fileInfo = {
          filename: file.originalname,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });


app.get('/chat', function(req, res){
  const sess = req.session;
  if(sess.email) {
    res.sendfile('chat.html');
    console.log(sess.email);
  }
  else
    res.sendfile('login.html');
});

app.get('/coding', function(req, res){
  const sess = req.session;
  if(sess.email) {
    res.sendfile('coding.html');
    console.log(sess.email);
  }
  else
    res.sendfile('login.html');
});

app.get('/project', function(req, res){
  const sess = req.session;
  if(sess.email) {
    res.sendfile('project.html');
    console.log(sess.email);
  }
  else
    res.sendfile('login.html');
});

io.on('connection', function(socket){
  console.log("connected");
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});


app.get('/add',(req,res)=>{
  const sess = req.session;
    if(sess.email) {
      res.sendfile('add.html');
      console.log(sess.email)
    }
    else
      res.sendfile('login.html');
});

app.get('/login',(req,res)=>{
  const sess = req.session;
  sess.email = "";
  res.sendfile('login.html');
});

app.get('/fileupload',(req,res)=>{
  const sess = req.session;
    if(sess.email) {
      res.sendfile('FileUpload.html');
      console.log(sess.email);
    }
    else
      res.sendfile('login.html');
});


app.get('/index',(req,res)=>{
  const sess = req.session;
    if(sess.email) {
      res.sendfile('index.html');
      console.log(sess.email)
    }
    else
      res.sendfile('login.html');
});

app.get('/',(req,res)=>{
  res.sendfile('login.html');
});

app.post('/addFile',function(req,res,next){

  const form = new formidable.IncomingForm();

  form.parse(req);

  form.on('fileBegin', function (name, file){
      file.path = 'E:/Project/CodeGenital/input file/'+file.name;
  });

  form.on('file', function (name, file){
      console.log('Uploaded ' + file.name);
    const sess = req.session;
    console.log(sess.email)
  let resultPromise = cpp.runFile('E:/Project/CodeGenital/input file/'+file.name, { stdin:'3\n2 '});
  resultPromise
      .then(result => {
        if(result.stdout!="")
        {
          var dir = 'E:/Project/CodeGenital/username';

          if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
          (async () => {
            await moveFile('E:/Project/CodeGenital/input file/'+file.name,'E:/Project/CodeGenital/Users_Files/'+sess.email+'/'+file.name );
            console.log('The file has been moved');
        })();
          }
          else if(fs.existsSync(dir)){
          (async () => {
            await moveFile('E:/Project/CodeGenital/input file/'+file.name,'E:/Project/CodeGenital/Users_Files/'+sess.email+'/'+file.name );
            console.log('The file has been moved');
        })();
        }
        alert('Compiled Successfully!');
        res.redirect('coding');
      }
        else
          res.json(result.stderr);
        })
        .catch(err => {
          res.json(err);
        });
});
});

app.post('/addFile1',function(req,res,next){

  const form = new formidable.IncomingForm();

  form.parse(req);

  form.on('fileBegin', function (name, file){
      file.path = 'E:/Project/CodeGenital/input file/'+file.name;
  });

  form.on('file', function (name, file){
      console.log('Uploaded ' + file.name);
      
    const sess = req.session;
    console.log(sess.email)
  let resultPromise = cpp.runFile('E:/Project/CodeGenital/input file/'+file.name, { stdin:'3\n2 '});
  resultPromise
      .then(result => {
        if(result.stdout!="")
        {
          var dir = 'E:/Project/CodeGenital/Users_Files/'+sess.email;

          if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
          (async () => {
            await moveFile('E:/Project/CodeGenital/input file/'+file.name,'E:/Project/CodeGenital/Users_Files/'+sess.email+'/'+file.name );
            console.log('The file has been moved');
        })();
          }
          else if(fs.existsSync(dir)){
          (async () => {
            await moveFile('E:/Project/CodeGenital/input file/'+file.name,'E:/Project/CodeGenital/Users_Files/'+sess.email+'/'+file.name );
            console.log('The file has been moved');
        })();
        }
        alert('Compiled Successfully!');
        res.redirect('project');
      }
        else
          res.json(result.stderr);
        })
        .catch(err => {
          res.json(err);
        });
});
});


app.get('/files',(req,res) =>{
  // gfs.files.find().toArray((err,files)=>{
  //     if(!files || files.length === 0){
  //       return res.status(404).json({
  //         err : 'No Files Exist'
  //       });
  //     }
  const sess = req.session;
  const testFolder = 'E:/Project/CodeGenital/Users_Files/'+sess.email;
  let f = [];
  fs.readdirSync(testFolder).forEach(file => {
    f.push(file);
  });
  res.send({f});
});

app.get('/files/:filename',(req,res) =>{
  gfs.files.findOne({filename : req.params.filename},(err,file)=>{

      if(!file || file.length === 0){
        return res.status(404).json({
          err : 'No File Exists'
        });
      }
      else if (file) {
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
      }

      else if(file.contentType === 'image/jpeg' || file.contentType ==='img/png'){
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
      }
      else{
        res.status(404).json({
          err : 'Not An Image'
        });
      }
  });
});

app.get('/compile' , function (req , res ) {

  const sess = req.session;
  if(sess.email) {
    res.sendfile('compile.html');
    console.log(sess.email);
  }
    else
  res.sendfile('login.html');

});

app.post('/compilecode' , function (req , res ) {

	const code = req.body.code;
	const input = req.body.input;
    const inputRadio = req.body.inputRadio;
    const lang = req.body.lang;
    if((lang === "C") || (lang === "C++"))
    {
        if(inputRadio === "true")
        {
        	var envData = { OS : "windows" , cmd : "g++",options: {timeout:1000 }};
        	compiler.compileCPPWithInput(envData , code ,input , function (data) {
        		if(data.error)
        		{
        			res.send(data.error);
        		}
        		else
        		{
              alert('Compiled Successfully!');
              res.redirect('coding'); 
        		}
        	});
	   }
	   else
	   {

	   	var envData = { OS : "windows" , cmd : "g++",options: {timeout:1000 }};
        	compiler.compileCPP(envData , code , function (data) {
        	if(data.error)
        	{
        		res.send(data.error);
        	}
        	else
        	{
            alert('Compiled Successfully!');
            res.redirect('coding'); 
        	}

            });
	   }
    }
    if(lang === "Java")
    {
        if(inputRadio === "true")
        {
            var envData = { OS : "windows" };
            console.log(code);
            compiler.compileJavaWithInput( envData , code , function(data){
                res.send(data);
            });
        }
        else
        {
            var envData = { OS : "windows" };
            console.log(code);
            compiler.compileJavaWithInput( envData , code , input ,  function(data){
                res.send(data);
            });

        }

    }
    if( lang === "Python")
    {
        if(inputRadio === "true")
        {
            var envData = { OS : "windows"};
            compiler.compilePythonWithInput(envData , code , input , function(data){
                res.send(data);
            });
        }
        else
        {
            var envData = { OS : "windows"};
            compiler.compilePython(envData , code , function(data){
                res.send(data);
            });
        }
    }
    if( lang === "CS")
    {
        if(inputRadio === "true")
        {
            var envData = { OS : "windows"};
            compiler.compileCSWithInput(envData , code , input , function(data){
                res.send(data);
            });
        }
        else
        {
            var envData = { OS : "windows"};
            compiler.compileCS(envData , code , function(data){
                res.send(data);
            });
        }
    }
    if( lang === "VB")
    {
        if(inputRadio === "true")
        {
            var envData = { OS : "windows"};
            compiler.compileVBWithInput(envData , code , input , function(data){
                res.send(data);
            });
        }
        else
        {
            var envData = { OS : "windows"};
            compiler.compileVB(envData , code , function(data){
                res.send(data);
            });
        }

    }

});

let x = 0;
app.post('/add',function(req,res){
  const newUser = new Users();
    newUser.username = req.body.username;
    newUser.email =req.body.email;
   
    newUser.password = req.body.password;
    newUser.points = 10;
    newUser.rank = x+1;
    newUser.save(function(err, user) {
      if (err) {
        throw err;
      } else {
        console.log(req.body.username);
        console.log(req.body.email);
        console.log(newUser.password);
      }
      res.redirect('login');
    });
});

app.post('/authenticate', function(req, res) {
  
  Users.findOne({
    'email': req.body.email
  }, function(err, user) {
    if (err) {
      throw err;
    } else {
      if (!user) {
        res.json({success:false});
        
      } else {
        if (user.validPassword(req.body.password)) {
          const sess = req.session;
          sess.email = req.body.email;
          console.log("Login Successful!");

          res.redirect('index');
        } else {
          res.json({success : false})
        }
      }
    }
  });
});

http.listen(port, function(){
  console.log("Listning on port : "+port);
});
