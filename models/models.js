const mongoose = require('mongoose')

//productSchema Definition
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})
const Product = mongoose.model('Product', productSchema)

//userSchema Definition
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref:'Product', required: true },
            quantity: { type: Number, required: true}
        }]
    }
    // ,
    // cart2: {
    //     type: [
    //         {
    //             productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    //             quantity: { type: Number, required: true}  
    //         }
    //     ]
    // }
})

userSchema.methods.addToCart = async function(productId, quantity){
    const user = this
    if(user.cart.items.length === 0) {
        await user.cart.items.push({productId, quantity})
    } else {
        const doesExit = user.cart.items.some(item => item.productId.toString() === productId.toString())
        if(!doesExit) {
            user.cart.items.push({productId, quantity})
        } else {
            const index = user.cart.items.findIndex(item => item.productId.toString() === productId.toString())
            user.cart.items[index].quantity = user.cart.items[index].quantity + quantity 
        }
    }
    await user.save()
}

const User = mongoose.model('User', userSchema)

//orderSchema Definition
const orderSchema = new mongoose.Schema({
    items: [{
        _id: false, 
        title: String, 
        price: Number, 
        quantity: Number
    }],
    userId: { 
        _id: false,
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User'
    }
})
const Order = mongoose.model('Order', orderSchema)
module.exports = {
    Product,
    User, 
    Order
}