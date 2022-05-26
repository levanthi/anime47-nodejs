const cors = require('cors')

function corsConfig(app){
    app.use(cors())
}

module.exports = corsConfig
