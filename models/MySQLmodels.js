const Sequelize = require('sequelize')
const sequelize = require('./MySQLdbConnection')

//Product Model
const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }

},
{
    timestamps: false 
})

// User Model
const User = sequelize.define('user', {
    id: {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
},
{
    timestamps: false 
})

//Cart Model
const Cart = sequelize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    }
},
{
    timestamps: false 
})

//CartItem Junction-Model
const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},
{
    timestamps: false 
})

//Order Model
const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    }
},
{
    timestamps: false 
})

//OrderItem Model
const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},
{
    timestamps: false 
})

module.exports = {
    Product,
    User,
    Cart,
    CartItem,
    Order,
    OrderItem
}
















// const fs = require('fs').promises
// const path = require('path')
// const dir = path.join(__dirname, '../data/products.json')

// class Product {
//     constructor(_id, title, imgUrl, description, price){
//         this._id = _id
//         this.title = title
//         this.imgUrl = imgUrl
//         this.description = description
//         this.price = price
//     }

//     // Save a product to the file system
//     async save () {
//         if(this._id){
//             let products = await Product.fetchAll()
//             products.forEach(async (product, index)=>{
//                 if(product._id === this._id){
//                     products[index] = {...product, ...this}
//                     await fs.writeFile(dir, JSON.stringify(products))
//                 }
//             })
//         }else {
//             this._id = Math.random().toString()
//             let products = []
//             try{
//                 await fs.access(dir)
//                 const data = await fs.readFile(dir)
//                 if(!data.toString().length){
//                     products.push(this)
//                     await fs.writeFile(dir, JSON.stringify(products))
//                 } else {
//                     products = await Product.fetchAll()
//                     products.push(this)
//                     await fs.writeFile(dir, JSON.stringify(products))
//                 }
//             }
//             catch (err) {
//                 // Error Case 2
//                 console.log('Error from models>product.js => EC2')
//                 products.push(this)
//                 console.log(err)
//                 await fs.writeFile(dir, JSON.stringify(products))
//             }
//         }
//     }

//     // Get all the products
//     static async fetchAll() {
//         try{
//             let buffer = await fs.readFile(dir)
//             let products = JSON.parse(buffer)
//             return products
//         } 
//         catch (err) {
//             // Error Case 3
//             console.log('Error from models>product.js => EC3')
//             console.log(err)
//             return []
//         }
//     }

//     // Search a product by ID
//     static async findById(id){
//         let products = []
//         try{
//             let products = await Product.fetchAll()
//             let product
//             products.forEach( item => {
//                 if (item._id === id) {
//                     product = item                   
//                 }
//             });
//             if(product === undefined) {
//                 return {_id: 'No Product'}
//             }
//             return product
//         }
//          catch(err){
//             // Error Case 4
//             console.log('Error from models>product.js => EC4')
//             console.log(err)
//             return {_id: 'No Product'}
//         }
//     }

//     // Delete a product by ID
//     static async deleteById (id) {
//         try{
//             let products = await Product.fetchAll()
//             products = products.filter(product => product._id !== id)
//             await fs.writeFile(dir, JSON.stringify(products))
//         }
//         catch(err) {
//             // Error Case 5
//             console.log('Error from models>product.js => EC5')
//             return []
//         }
//     }
// }
// module.exports = Product