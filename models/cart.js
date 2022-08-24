const path = require('path')
const fs = require('fs').promises
const Product = require('./product')
const dir = path.join(__dirname, ('../data/cart.json'))

const Cart = class Cart {
    static async getCart() {
        try{
            const buffer = await fs.readFile(dir)
            const cart = JSON.parse(buffer)
            //Add a function to the Cart to calculate total amount in the cart
            cart.calCart = () => {
                 let sum = 0
                for(let i=0; i<cart.products.length; i++) {
                    sum = sum + cart.products[i].productTotal
                }
                return sum
            }
            return cart
        }
        catch(err){
            // If the Cart is empty then create a Cart and return it with a function to calculate the total amount in cart
            return {
                    products: [], 
                    cartTotal: 0,  
                    calCart: function () {
                        let sum = 0
                        for(let i=0; i<this.products.length; i++) {
                        sum = sum + this.products[i].productTotal
                    }
                return sum
            }}
        }
    }
    
    // Add to Cart logic
    static async addToCart (productId, unit) {
        let cart = await Cart.getCart()
        try{
            // Getting all the Products
            let product = await Product.findById(productId)
            if(!product) {
                return cart
            }
            // Destructuring product and adding unit and productTotal property
            product = {...product, unit, productTotal: product.price*unit}
             if(cart.products.length === 0){
                cart.products.push(product)
                cart.cartTotal = cart.calCart()
                await fs.writeFile(dir, JSON.stringify(cart))
            } else {
                // Checking if the product already exits in cart
                const doesExit = cart.products.some(product => product._id === productId)
                if(doesExit){
                    let index = cart.products.findIndex(item=>item._id === productId)
                    // Increase product quantity if product already exits in cart
                    cart.products[index].unit += unit
                    // Update productTotal amount
                    cart.products[index].productTotal = cart.products[index].unit * cart.products[index].price
                 } else {
                    // Add the product to cart if it doesn't exit in cart
                    cart.products.push(product)
                }
                // Calculate cartTotal
                cart.cartTotal = cart.calCart()
                await fs.writeFile(dir, JSON.stringify(cart))

            }
        }    
        catch(err) {
            // Error Case 1
            console.log('Error from model>cart.js EC1')
            console.log(err)
        }
    }

    static async getCartProducts(){
        try{
            const buffer = await fs.readFile(dir)
            const cart = JSON.parse(buffer)
            return cart.products
        }
        catch(err) {
            console.log('From models=>cart.js => getCartProducts')
            console.log(err)
            return []
        }
    }
   
    //Update the Cart if a cart product is edited by Vendor
    static async updateCart(cart, product) {
        cart.products = cart.products.map( prod => {
            if(prod._id === product._id) {
                prod = {...prod, ...product}
                prod.productTotal = prod.price * prod.unit
                return prod               
            }
            return prod
            })
        cart.cartTotal = cart.calCart()
        try{
            await fs.writeFile(dir, JSON.stringify(cart))
        } catch(err) {
            // Error Case 1
            console.log(`Error from model>product.js ES1`)
            console.log(err)
        }
    }

    // Delete Cart Product
    static async deleteCartProduct(id){
        const cart = await this.getCart()
        cart.products = cart.products.filter(prod => prod._id !== id)
        cart.cartTotal = cart.calCart()
        await fs.writeFile(dir, JSON.stringify(cart))
    }
}

module.exports = Cart