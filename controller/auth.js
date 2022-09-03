const { User } = require("../models/models")

const getLogin = (req, res, next) => {
    res.render('../views/login.ejs', {
    title: 'Login', path: '/login', isLoggedIn: false
    })
}

const postLogin = async (req, res, next) => {
    try{
         const user = await User.findById('630dbed12e058d12c35cad1e')
        req.session.user = user
        req.session.isLoggedIn = true
        req.session.save((err)=> {
            if(err){
                console.log(`Error from postLogin => controller => auth.js `)
                console.log(err)
            }
            res.redirect('/')
        })
    } 
    catch(err) {
        console.log(`Error from postlogin => controller> auth.js`)
        console.log(err)
    }
}

const postLogout = async (req, res, next) => {
    req.session.destroy(err=> {
        if(err){
            console.log(`Error deleting session`)
        }
        res.redirect('/')
    })
}

module.exports = {
    getLogin, postLogin, postLogout
}