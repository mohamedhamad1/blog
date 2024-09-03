const express = require('express')
const mongoose = require('mongoose');
const {dbUri} = require('./configs/configs')
//----------- mongodb start ----------------
mongoose
        .connect(dbUri)
        .then(() => {console.log('Connect to Mongoose successfully');})
        .catch((err) => {console.log(err);})
//----------- app start --------------------
const app = express();
const postsRoutes = require('./routes/posts.routes')
app.use('/api/posts', postsRoutes)

app.listen(2753, () => {
    console.log('listening on 2753');
})