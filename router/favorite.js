const router = require("express").Router();
const db = require("../db");
const confirmUserMiddleware = require("../src/middleWare/confirmUserMiddleware");
const concatDomainToAsset = require('../src/concatDomainToAsset')

router.post("/", confirmUserMiddleware, (req, res) => {
  const userId = req.user.id;
  const animeId = req.body.animeId;
  db.query(
    `select count(*) as exist from anime47.favorite
     where userId='${userId}' && animeId='${animeId}'
    `,
    (err, result) => {
      if (err) throw err;
      if (result[0].exist) {
        res.send({ type: "error", message: "Phim đã tồn tại trong tủ!" });
      } else {
        const sqlQuery = `
        insert into anime47.favorite(animeId,userId)
        values('${animeId}','${userId}');
    `;
        db.query(sqlQuery, (err, result) => {
          if (err) throw err;
          res.send({
            type: "success",
            message: "Thêm vào tủ phim thành công!",
          });
        });
      }
    }
  );
});

router.get("/", confirmUserMiddleware, (req, res) => {
  const data = {};
  const userId = req.user.id;
  let type = req.query.type;
  const limit = req.query.limit;
  const page = req.query.page;
  if (type === "live-action") {
    type = "Live Action";
  }

  const pageNumbQuery = `
    select count(anime.id) as quantity from anime47.favorite
    join anime47.anime on favorite.animeId=anime.id
    where favorite.userId='${userId}' && anime.type='${type}'
  `;
  const pageNumbPromise = new Promise((resolve) => {
    db.query(pageNumbQuery, (err, result) => {
      if (err) throw err;
      data.pageNumb = Math.ceil(result[0].quantity / limit);
      resolve();
    });
  });

  const sqlQuery = `
    select anime.* from anime47.favorite
    join anime47.anime on favorite.animeId=anime.id
    where favorite.userId='${userId}' && anime.type='${type}'
    limit ${limit}
    offset ${limit * (page - 1)}
    `;
  const animeListPromise = new Promise((resolve) => {
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result)
      data.data = result;
      resolve();
    });
  });
  Promise.all([pageNumbPromise, animeListPromise]).then(() => {
    res.send(data);
  });
});

module.exports = router;
