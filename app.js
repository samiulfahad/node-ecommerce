const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const {User} = require('./models/models')
const vendorRouter = require('./routers/vendor')
const shopRouter = require('./routers/shop')
const authRouter = require('./routers/auth')
const app = express()
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')))
// Session storage
const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/shop',
    collection: 'sessions'
})
// Initialize Session
app.use(session({
    secret: 'my secret str',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use( async (req, res, next) => {
    try{
        if(req.session.user){
            req.user = await User.findById(req.session.user._id)
        }
    }
    catch(err){
        console.log(err)
    }
    next()
})
app.use(shopRouter)
app.use(authRouter)
app.use('/vendor', vendorRouter)
app.use('*', (req, res)=>{
    res.render('404.ejs', {title: '404 Page NOT Found', path:'', isLoggedIn: req.isLoggedIn})
})

const port = process.env.PORT || 3000
const connectDB = async () => {
   await mongoose.connect('mongodb://127.0.0.1:27017/shop')
   console.log(`Connected to DB successfully`)
   const user = await User.findOne()
   if(!user){
        await User.create({name: 'Demo User', email:'demo@email.com', cart: {items: []}})
   }
   app.listen(port, _ => {
    console.log(`Server listening on port ${port}`)
})}
connectDB()