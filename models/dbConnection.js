//Connection to DB
const Sequelize = require('sequelize')
const sequelize = new Sequelize('node-ecommerce-mysql', 'root', 'password', {
    logging: false,
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize