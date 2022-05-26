const express = require("express");

const authRoute = require("./router/auth");
const favoriteRoute = require("./router/favorite");
const corsConfig = require("./cors_config");
const db = require("./db");
const api = require("./api");

const app = express();
corsConfig(app);

app.use(express.json());
app.use("/auth/", authRoute);
app.use("/favorite/", favoriteRoute);
app.get("/",(req,res)=>{
    res.send('<h1>Hello</h1>')
})

api(app);
