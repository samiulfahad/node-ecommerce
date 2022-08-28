const { Product } = require('../models/models')
const Cart = require('../models/cart')

// Render Add-Product Form
exports.getAddProduct = (req, res)=>{
    // Render the 'edit-product.ejs' page to add the product
    const product = {title: '', price: '', imageUrl: '', description: ''}
    res.render('./vendor/edit-product.ejs', {title: 'Add Product', 
    action: 'add-product', edit: false, product, btnTxt: 'Add Product', path: '/vendor/add-product',
    
    })
}

// Add a product
exports.postAddProduct = async (req, res) => {
    try{
        const product = await req.user.createProduct({
            title: req.body.title,
            price: req.body.price, 
            imageUrl: req.body.imageUrl, 
            description: req.body.description
        })
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
        const products = await Product.findAll()
        console.log(products)
        return res.render('./shop/index', {title: 'Home', prods: products, path: '/'})
    }
    const productId = req.params.id
    const product = await req.user.getProducts({where : {id: productId}})
     res.render('./vendor/edit-product.ejs', {title: 'Edit Product', product: product[0], 
            action: 'edit-product', edit: true, btnTxt: 'Update Product', path: '/vendor/edit-product'})
}

exports.postEditProduct = async (req, res) => {
    let product = await Product.findByPk(req.body.id)
    try{
        const products = await req.user.getProducts({where : {id: req.body.id}})
        let product = products[0]
        product.title = req.body.title
        product.description = req.body.description
        product.price = req.body.price
        product.imageUrl = req.body.imageUrl
        await product.save()
        res.redirect(`/product/${req.body.id}`)
    } catch(err) {
        console.log(err)
    }
}

// Get All Products
exports.getProducts = async (req, res)=>{
    try{
        const products = await Product.findAll()
        res.render('./vendor/products.ejs', {title: 'Vendor Products', prods:products, path: '/vendor/products'})
    }
    catch(err){
        console.log(err)
    }
}

// Delete a Product
exports.postDeleteProduct = async (req, res) => {
    try{
        const product = await Product.findByPk(req.body.productId)
        await product.destroy()
        res.redirect('/vendor/products')
    }
    catch(err){
        console.log(err)
        res.send('Could NOT Delete')
    }
}