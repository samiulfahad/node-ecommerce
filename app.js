const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const vendorRouter = require('./routers/vendor')
const shopRouter = require('./routers/shop')
const sequelize = require('./models/dbConnection')
const {  Product, User, Cart, CartItem, Order, OrderItem } = require('./models/models')
const app = express()
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')))
app.use( async (req, res, next) => {
    try{
         let user = await User.findByPk(1)
        if(user){
        req.user = user
        }
    next()
    }
    catch(err){
        console.log(err)
    }
})
app.use(shopRouter)
app.use('/vendor', vendorRouter)
app.use('*', (req, res)=>{
    res.render('404.ejs', {title: '404 Page NOT Found', path:''})
})

const port = process.env.PORT || 3000

// One-One Relationship
User.hasOne(Cart, {onDelete: 'CASCADE' })
Cart.belongsTo(User, {onDelete: 'CASCADE' })

//One-Many Relationships
User.hasMany(Product)
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })

// Many-Many Relationship
Cart.belongsToMany(Product, {through: CartItem})
Product.belongsToMany(Cart, {through: CartItem})

//One-Many Relationship
User.hasMany(Order)
Order.belongsTo(User)

// Many-many Relationship
Order.belongsToMany(Product, {through: OrderItem})


const initSeq = async() => {
    await sequelize
    //.sync({force: true})
    .sync()
    try{
        let user = await User.findByPk(1)
        if(!user){
            user = await User.create({
                email: 'hasan@test.com',
                name: "Hasan Mahmud"
            })
        await user.createCart()
        }
    }
    catch(err) {
        console.log(err)
    }
}
initSeq()

app.listen(port, _ => {
    console.log(`Server listening on port ${port}`)
})