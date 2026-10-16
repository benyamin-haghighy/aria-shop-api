const express = require('express')
const config = require('./config.app')
const path = require('path')
const cors = require('cors')
const accessTokenStrategy = require('./src/utils/accessTokenAuth')
const adminStrategy = require('./src/utils/adminValidate')
const roleStrategy = require('./src/utils/roleStrategy')
const userRouter = require('./src/module/user/v1/user.route')
const sellerRouter = require('./src/module/seller/seller.route')
const sellerValidate= require('./src/utils/sellerValidate')
const locationRouter = require('./src/module/locations/location.route')
const categoryRouter = require('./src/module/category/category.route')
const productRouter = require('./src/module/product/product.route')
const noteRouter = require('./src/module/notes/note.route')
const sellerRequestRouter = require('./src/module/sellerRequest/sellerRequest.route')
const shortUrlRouter = require('./src/module/shortLink/shortLink.route')
const cartRouter = require('./src/module/cart/cart.route')
const orderRouter = require('./src/module/orders/order.route')
const commentRouter = require('./src/module/comments/comment.route')
const checkoutRouter = require('./src/module/checkout/checkout.route')
const errorHandller = require('./src/middleware/errorHandller')
const swaggerRouter = require('./src/module/swagger/swagger.route')
const app = express()



const authRouter = require('./src/module/auth/v1/auth.route')
const banRouter = require('./src/module/ban/v1/ban.route')
const passport = require('passport')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.resolve(__dirname, 'src','public')))
app.use(cors({
    origin:"*",
    methods:['POST', 'DELETE', 'PUT', 'GET', 'PATCH'],
    allowedHeaders:['Content-Type', 'Authorization']
}))

passport.use('accessToken',accessTokenStrategy)
passport.use('adminUser',adminStrategy)
passport.use('sellerUser', sellerValidate)
passport.use('roleStrategy', roleStrategy(['ADMIN', 'USER']))

app.use('/auth',authRouter)
app.use('/ban',banRouter)
app.use('/user',userRouter)
app.use('/seller',sellerRouter)
app.use('/location',locationRouter)
app.use('/category',categoryRouter)
app.use('/note',noteRouter)
app.use('/seller-request',sellerRequestRouter)
app.use('/product',productRouter)
app.use('/p',shortUrlRouter)
app.use('/checkout',checkoutRouter)
app.use('/comment',commentRouter)
app.use('/cart',cartRouter)
app.use('/order',orderRouter)
app.use('/apies',swaggerRouter)




app.use((req,res)=>{
    
    return res.status(404).json(
        {
            message:`page with ${req.path} is not found`
        }
    )
})

app.use(errorHandller)


module.exports = app
