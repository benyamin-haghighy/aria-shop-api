
const express = require('express')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const path = require('path')

const router = express.Router()

const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'AriaShop API',
            description: 'Production-ready multi-vendor e-commerce REST API',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server'
            }
        ]
    },
    apis: [
    path.join(__dirname, '../../docs/**/*.yaml')
]
})

router.use(
    '/',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
)

module.exports = router
