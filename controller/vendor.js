const Product = require('../models/product')
const Cart = require('../models/cart')

// Render Add-Product Form
exports.getAddProduct = (req, res)=>{
    // Render the 'edit-product.ejs' page to add the product
    const product = {title: '', price: '', imgUrl: '', description: ''}
    res.render('./vendor/edit-product.ejs', {title: 'Add Product', 
    action: 'add-product', edit: false, product, btnTxt: 'Add Product', path: '/vendor/add-product',
    
    })
}

// Add a product
exports.postAddProduct = (req, res) => {
    // Run this fn to add a product
    const product = new Product(null, req.body.title, req.body.imgUrl, req.body.description, req.body.price)
    product.save()
    res.redirect('/')
}

// Render Edit-Product form
exports.getEditProduct = async (req, res) => {
    const editMode = req.query.edit === 'true' ? true : false
    if(!editMode) {
        const products = await Product.fetchAll()
        return res.render('./shop/index', {title: 'Home', prods: products, path: '/'})
    }
    const _id = req.params.id
    const product = await Product.findById(_id)
     res.render('./vendor/edit-product.ejs', {title: 'Edit Product', product: product, 
            action: 'edit-product', edit: true, btnTxt: 'Update Product', path: '/vendor/edit-product'})
}

// Save Edited Product
exports.postEditProduct = async (req, res) => {
    const product = new Product(req.body._id,  req.body.title, req.body.imgUrl, req.body.description, req.body.price)
    product.save()
    const cart = await Cart.getCart()
    // Check if the product exists in Cart
    const doesExit = cart.products.some(prod=> prod._id === req.body._id)
    // Update the cart if product exists in Cart
    if(doesExit){
         await Cart.updateCart(cart, product)
    }
    res.redirect('/vendor/products')
}

// Get All Products
exports.getProducts = async (req, res)=>{
    const products = await Product.fetchAll()
    res.render('./vendor/products.ejs', {title: 'Vendor Products', prods:products, path: '/vendor/products'})
}

// Delete a Product
exports.postDeleteProduct = async (req, res) => {
    try{
        const cart = await Cart.getCart()
        const doesExist = cart.products.some(prod => prod._id === req.body.productId)
        if(doesExist){
            await Cart.deleteCartProduct(req.body.productId)
        }
        await Product.deleteById(req.body.productId)
        res.redirect('/vendor/products')
    }
    catch(err){
        console.log(err)
        res.send('Could NOT Delete')
    }
}