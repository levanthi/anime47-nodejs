const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("../db");
const router = require("express").Router();

function generateAccessToken(user){
    return jwt.sign({
        id:user.id,
        isAdmin:!!user.isAdmin
    },process.env.TOKEN_ACCESS_KEY,{expiresIn:"30d"})
}
function generateRefreshToken(user){
    return jwt.sign({
        id:user.id,
        isAdmin:!!user.isAdmin
    },process.env.TOKEN_REFRESH_KEY,{expiresIn:"365d"})
}

router.post("/sign-up", async (req, res) => {
  await new Promise((resolve, reject) => {
    db.query(
      `select * from anime47.user where user_name='${req.body.name}'`,
      (err, result) => {
        if (err) throw err;
        if (result.length) {
          reject("user existed!");
        } else resolve();
      }
    );
  })
    .then(async () => {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      const id = uuidv4();
      const addUserQuery = `
        insert into anime47.user(id,user_name,password)
        values('${id}','${req.body.name}','${hashed}');
      `;
      db.query(addUserQuery, (err) => {
        if (err) throw err;
      });
      const userQuery = `
        select * from anime47.user
        where id='${id}';
      `;
      db.query(userQuery, (err, result) => {
        if (err) throw err;
        res.send({
          type: "success",
          user: result[0],
        });
      });
    })
    .catch((err) => {
      res.send({ type: "error", message: err });
    });
});

router.get("/sign-in", async (req, res) => {
  await new Promise((resolve, reject) => {
    const sqlQuery = `
        select password from anime47.user
        where user_name='${req.query.name}'
        `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      if (result.length) {
        resolve(result[0].password);
      } else {
        reject();
      }
    });
  })
    .then(async (hashed) => {
      const match = await bcrypt.compare(req.query.password, hashed);
      if (match) {
        db.query(
          `select * from anime47.user where user_name='${req.query.name}'`,
          (err, result) => {
            if (err) throw err;
            const user = result[0];
            const accessToken = generateAccessToken(user)
            delete user.password
            res.send({...user,accessToken});
          }
        );
      } else {
        res.send({
          type: "error",
          message: "Tài khoản hoặc mật khẩu không đúng!",
        });
      }
    })
    .catch(() => {
      res.send({
        type: "error",
        message: "Tài khoản hoặc mật khẩu không đúng!",
      });
    });
});

module.exports = router;
