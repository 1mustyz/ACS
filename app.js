var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const passport = require('passport')
const expressSession = require('express-session')
const MongoStore = require('connect-mongo')
const cors = require('cors')
const Staff = require('./models/staff')
const LocalStrategy = require('passport-local').Strategy;
const ClientAlert = require('./models/clientAlert')
const Chart = require('./models/chart')
const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1236911",
  key: "4fd41dcde3de7004fcf0",
  secret: "6e49d89e8b2e2f2d5450",
  cluster: "mt1",
  useTLS: true
});



require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const adminRouter = require('./routes/adminRoute')
const staffRouter = require('./routes/staffRoute')
const clientRouter = require('./routes/clientRoute')

var app = express();
app.use(cors())

// setting up session
app.use(expressSession({
  secret: '[credentials.secret]',
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_ATLAS_CONNECTION,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native',
  }),
  saveUninitialized: false,
  cookie: { maxAge: 1 * 60 * 60 * 1000 },
  resave: true
}))

// //connect to db
mongoose.connect(process.env.MONGO_ATLAS_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true
})
mongoose.Promise = global.Promise

// test DB connection
mongoose.connection
  .once('open', () => {
    console.log('mongodb started')
    
    
    // connect the server if DB is UP
    // http.listen(PORT, () => {
    //   console.log(`server started `)
    // })
  })
  .on('error', (error) => {
    console.log('error occured:', error)
  })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport setup
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport.config')(passport);


passport.use('staff', Staff.createStrategy())

passport.serializeUser(function(user, done) {
  var key = {
    id: user.id,
    type: user.role
  }
  done(null, key);
})

passport.deserializeUser(function(key, done) {
  // if(key.type === 'staff'|| key.type === 'admin' ){
    Staff.findById(key.id, function(err, user) {
      done(err, user)
    }) 
  // }
  
})
passport.serializeUser(Staff.serializeUser());
passport.deserializeUser(Staff.deserializeUser());

passport.use(new LocalStrategy(Staff.authenticate()));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter)
app.use('/staff', staffRouter)
app.use('/client', clientRouter)

// client 
// alert
app.post('/recieve-client-notification', async (req,res)=>{

 req.body.respond = false
 req.body.time = new Date()
 req.body.month = new Date().getMonth() + 1
  
 const newAlert = await ClientAlert.collection.insertOne(req.body)
 let allAlerts
 if(newAlert){
   
   const allAlert = await ClientAlert.find({})
   allAlerts = allAlert
   if(allAlert){
     
     pusher.trigger("notifications", "alert", {
       allAlert
      });
    }

    console.log('all Alert',allAlert)
  }
  console.log('new Alert',newAlert)

  res.json({success: true, message: allAlerts});
  
})

// chat ///////////////////////++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.post('/voke-a-chart', async (req,res,next) => {

    const {
        staffOneId,
        staffTwoId,
        senderId,
        receiverId
    } = req.body

  req.body.time = new Date()


   const newChart = await Chart.collection.insertOne(req.body)
   if(newChart){
       const allChart = await Chart.find({staffOneId,staffTwoId}).sort({time: 1}).limit(10)
       console.log(staffOneId)
       console.log(allChart)

       pusher.trigger("notifications", "vokeAChart", {
        allChart
       });
   }

   res.json({success: true, message: `user ${senderId} voked user ${receiverId}`})
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
