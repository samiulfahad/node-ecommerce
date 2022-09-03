const { Product } = require('../models/models')
const Cart = require('../models/cart')

// Render Add-Product Form
exports.getAddProduct = (req, res)=>{
    const product = {title: '', price: '', imageUrl: '', description: ''}
    res.render('./vendor/edit-product.ejs', {title: 'Add Product', 
    action: 'add-product', edit: false, product, btnTxt: 'Add Product', 
    path: '/vendor/add-product', isLoggedIn: req.session.isLoggedIn
    })
}

// Add a product
exports.postAddProduct = async (req, res) => {
    try{
        const product = await Product.create({...req.body, userId: req.user._id})
        await product.save()
        res.redirect('/vendor/products')
    }
    catch(err) {
        console.log(err)
    }
}

// Render Edit-Product form
exports.getEditProduct = async (req, res) => {
    const editMode = req.query.edit === 'true' ? true : false
    if(!editMode) {
        const products = await Product.find()
        console.log(products)
        return res.render('./shop/index', {title: 'Home', prods: products, path: '/', 
        isLoggedIn: req.session.isLoggedIn})
    }
    const product = await Product.findById(req.params.id)
     res.render('./vendor/edit-product.ejs', {title: 'Edit Product', product, 
            action: 'edit-product', edit: true, btnTxt: 'Update Product', path: '/vendor/edit-product', 
            isLoggedIn: req.session.isLoggedIn})
}

exports.postEditProduct = async (req, res) => {
    try{
        let product = await Product.findByIdAndUpdate(req.body.id, {...req.body})
        //await product.save()
        res.redirect(`/product/${req.body.id}`)
    } catch(err) {
        console.log(err)
    }
}

// Get All Products
exports.getProducts = async (req, res)=>{
    try{
        const products = await Product.find()
        res.render('./vendor/products.ejs', {title: 'Vendor Products', prods:products, path: '/vendor/products', 
        isLoggedIn: req.session.isLoggedIn})
    }
    catch(err){
        console.log(err)
    }
}

// Delete a Product
exports.postDeleteProduct = async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.body.productId)
        res.redirect('/vendor/products')
    }
    catch(err){
        console.log(err)
        res.send('Could NOT Delete')
    }
}