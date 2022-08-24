const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const vendorRouter = require('./routers/vendor')
const shopRouter = require('./routers/shop')
const app = express()
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')))
app.use(shopRouter)
app.use('/vendor', vendorRouter)
app.use('*', (req, res)=>{
    res.render('404.ejs', {title: '404 Page NOT Found', path:''})
})


const port = process.env.PORT || 3000
app.listen(port, _ => {
    console.log(`Server listening on port ${port}`)
})