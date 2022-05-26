const db = require("./db");
const genresToAccent = require("./genres_to_accent");
const concatDomainToAsset = require("./concatDomainToAsset/");

function api(app) {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Nodejs server is running");
  });

  function handleQuery(sqlQuery, isSuccess) {
    db.query(sqlQuery, (err, data) => {
      if (err) return (isSuccess = false);
    });
  }

  app.post("/addAnime", (req, res) => {
    const data = req.body;
    const isSuccess = true;
    //anime query
    const animeQuery = `
            insert into anime47.anime(
                id,name,description,currentEp,endEp,comments,
                views,status,thumbnail,year,type
            )
            values(
                '${data.id}','${data.name}','${data.description}',
                '${data.currentEp}','${data.endEp}','${data.comments}','${data.views}',
                '${data.status}','${data.thumbnail}','${data.year}','${data.type}'
            )
        `;
    handleQuery(animeQuery, isSuccess);

    // genres query
    data.genres.split(",").forEach((genre) => {
      const genreQuery = `
                insert into anime47.anime_genres(animeId,genresId)
                value('${data.id}',(select genres.id from anime47.genres
                where(name='${genre}')))
            `;
      handleQuery(genreQuery, res, isSuccess);
    });

    //episodes query
    data.episodes.split(",").forEach((episode, index) => {
      const episodeQuery = `
                insert into anime47.episodes(animeId,url,episode)
                value('${data.id}','${episode}',${index + 1})
            `;
      handleQuery(episodeQuery, isSuccess);
    });

    if (isSuccess) {
      res.send("Add anime success!!!");
    } else res.send("Something fail!!!");
  });

  app.get("/slider", (req, res) => {
    const sqlQuery = `
            select currentEp,endEp,thumbnail,name,id
            from anime47.anime
            order by rand()
            limit 15
        `;
    db.query(sqlQuery, (err, data) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(data);
      res.send(data);
    });
  });

  app.get("/topViews", (req, res) => {
    const sqlQuery = `
        select * from anime47.anime
        ORDER by views desc
        limit 10
        `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      res.send(result);
    });
  });

  app.get("/topComments", (req, res) => {
    const sqlQuery = `
        select * from anime47.anime
        ORDER by comments desc
        limit 10
        `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      res.send(result);
    });
  });

  app.get("/home/:slug", (req, res) => {
    let type = req.params.slug;
    let limit = 4;
    if (type === "live-action") {
      type = "Live Action";
    }
    if (type === "anime") {
      limit = 16;
    }
    const sqlQuery = `
        select * from anime47.anime
        where type='${type}'
        order by createdAt desc
        limit ${limit}
        `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      res.send(result);
    });
  });

  app.get("/detail/:slug", (req, res) => {
    let data = {};
    const sqlQuery = `
      select * from anime47.anime
      where id='${req.params.slug}'`;
    const queryGenres = `
      select genres.name from anime47.anime
      join anime47.anime_genres on anime_genres.animeId = anime.id
      join anime47.genres as genres on anime_genres.genresId = genres.id
      where anime.id="${req.params.slug}"
`;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      data = result[0];
    });
    db.query(queryGenres, (err, result) => {
      if (err) throw err;
      data.genres = result.map((genre) => genre);
      res.send(data);
    });
  });

  app.get("/watch/:slug", (req, res) => {
    let data = {};
    const sqlQuery = `
      select * from anime47.anime
      where id='${req.params.slug}'`;
    const episodeQuery = `
      select episodes.url,episodes.episode from anime47.anime
      join anime47.episodes on anime.id=episodes.animeId
      where anime.id='${req.params.slug}'
      order by episodes.episode asc
    `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      data = result[0];
    });
    db.query(episodeQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.video(result);
      data.episodes = result;
      res.send(data);
    });
  });

  app.get("/filter/type/:slug", (req, res) => {
    let type;
    let data = {};
    switch (req.params.slug) {
      case "anime":
      case "china":
        type = req.params.slug;
        break;
      case "live-action":
        type = "Live Action";
        break;
      default:
        throw new err("Invalid action!");
    }
    const pageNumbQuery = `
      select count(*) as pageNumb from anime47.anime
      where type='${type}'
    `;
    db.query(pageNumbQuery, (err, result) => {
      if (err) throw err;
      data.pageNumb = Math.ceil(result[0].pageNumb / req.query.limit);
    });
    const sqlQuery = `
      select * from anime47.anime
      where type= '${type}'
      order by createdAt desc
      limit ${req.query.limit}
      offset ${(req.query.page - 1) * req.query.limit}
    `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      data.data = result;
      res.send(data);
    });
  });

  app.get("/filter/genres/live-action", (req, res) => {
    let data = {};
    const pageNumbQuery = `
      select count(*) as pageNumb from anime47.anime
      where type='Live Action'
    `;
    db.query(pageNumbQuery, (err, result) => {
      if (err) throw err;
      data.pageNumb = Math.ceil(result[0].pageNumb / req.query.limit);
    });
    const sqlQuery = `
      select * from anime47.anime
      where type= 'Live Action'
      order by createdAt desc
      limit ${req.query.limit}
      offset ${(req.query.page - 1) * req.query.limit}
    `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      data.data = result;
      res.send(data);
    });
  });

  app.get("/filter/genres/:slug", (req, res) => {
    if (req.params.slug === "live-action") return;
    const genre = genresToAccent(req.params.slug);
    let data = {};
    const pageNumbQuery = `
      select count(anime.id) as pageNumb from anime47.genres
      join anime47.anime_genres on genres.id=anime_genres.genresId
      join anime47.anime on anime.id=anime_genres.animeId
      where genres.name='${genre}'
    `;
    db.query(pageNumbQuery, (err, result) => {
      if (err) throw err;
      data.pageNumb = Math.ceil(result[0].pageNumb / req.query.limit);
    });
    const sqlQuery = `
     select genres.name,anime.* from anime47.genres
     join anime47.anime_genres on genres.id=anime_genres.genresId
     join anime47.anime on anime.id=anime_genres.animeId
     where genres.name='${genre}'
     limit ${req.query.limit}
     offset ${(req.query.page - 1) * req.query.limit}
     `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      data.data = result;
      res.send(data);
    });
  });

  app.get("/filter/status/:slug", (req, res) => {
    const status = genresToAccent(req.params.slug);
    let data = {};
    const pageNumbQuery = `
      select count(*) as pageNumb from anime47.anime
      where status='${status}'
    `;
    db.query(pageNumbQuery, (err, result) => {
      if (err) throw err;
      data.pageNumb = Math.ceil(result[0].pageNumb / req.query.limit);
    });
    const sqlQuery = `
      select * from anime47.anime
      where status='${status}'
      limit ${req.query.limit}
      offset ${(req.query.page - 1) * req.query.limit}
     `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      data.data = result;
      res.send(data);
    });
  });

  app.get("/filter/topview/:slug", (req, res) => {
    const status = genresToAccent(req.params.slug);
    let data = {};
    const pageNumbQuery = `
      select count(*) as pageNumb from anime47.anime
      order by views
    `;
    db.query(pageNumbQuery, (err, result) => {
      if (err) throw err;
      data.pageNumb = Math.ceil(result[0].pageNumb / req.query.limit);
    });
    const sqlQuery = `
      select * from anime47.anime
      order by views desc
      limit ${req.query.limit}
      offset ${(req.query.page - 1) * req.query.limit}
     `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      data.data = result;
      res.send(data);
    });
  });

  app.get("/filter/topcomment/:slug", (req, res) => {
    const status = genresToAccent(req.params.slug);
    let data = {};
    const pageNumbQuery = `
      select count(*) as pageNumb from anime47.anime
      order by comments
    `;
    db.query(pageNumbQuery, (err, result) => {
      if (err) throw err;
      data.pageNumb = Math.ceil(result[0].pageNumb / req.query.limit);
    });
    const sqlQuery = `
      select * from anime47.anime
      order by comments desc
      limit ${req.query.limit}
      offset ${(req.query.page - 1) * req.query.limit}
     `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      data.data = result;
      res.send(data);
    });
  });

  app.get("/filter/duo/:slug", (req, res) => {
    let data = {};
    const type = genresToAccent(req.params.slug);
    const genre1 = type.slice(0, type.indexOf("+") - 1);
    const genre2 = type.slice(type.indexOf("+") + 2);
    const pageNumbQuery = `
      select count(*) as pageNumb from anime47.anime
      where anime.id = any (
        select anime.id from anime47.genres
        join anime47.anime_genres on genres.id=anime_genres.genresId
        join anime47.anime on anime.id=anime_genres.animeId
        where genres.name='${genre1}'
      ) and anime.id = any (
        select anime.id from anime47.genres
        join anime47.anime_genres on genres.id=anime_genres.genresId
        join anime47.anime on anime.id=anime_genres.animeId
        where genres.name='${genre2}'
      )
    `;
    db.query(pageNumbQuery, (err, result) => {
      if (err) throw err;
      data.pageNumb = Math.ceil(result[0].pageNumb / req.query.limit);
    });
    const sqlQuery = `
      select * from anime47.anime
      where anime.id = any (
        select anime.id from anime47.genres
        join anime47.anime_genres on genres.id=anime_genres.genresId
        join anime47.anime on anime.id=anime_genres.animeId
        where genres.name='${genre1}'
      ) and anime.id = any (
        select anime.id from anime47.genres
        join anime47.anime_genres on genres.id=anime_genres.genresId
        join anime47.anime on anime.id=anime_genres.animeId
        where genres.name='${genre2}'
      )
      limit ${req.query.limit}
      offset ${req.query.limit * (req.query.page - 1)}
    `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      data.data = result;
      res.send(data);
    });
  });

  app.get("/filter/year/:slug", (req, res) => {
    const data = {};
    const year = req.params.slug;
    const pageNumbQuery = `
      select count(*) as pageNumb from anime47.anime
      where year=${year}
    `;
    db.query(pageNumbQuery, (err, result) => {
      if (err) throw err;
      data.pageNumb = Math.ceil(result[0].pageNumb / req.query.limit);
    });
    const sqlQuery = `
      select * from anime47.anime
      where year=${year}
      limit ${req.query.limit}
      offset ${req.query.limit * (req.query.page - 1)}
    `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      data.data = result;
      res.send(data);
    });
  });

  app.get("/search", (req, res) => {
    const name = req.query.name;
    const sqlQuery = `
     select * from anime47.anime
     WHERE name like '${name}%' collate utf8_general_ci
     `;
    db.query(sqlQuery, (err, result) => {
      if (err) throw err;
      concatDomainToAsset.thumbnail(result);
      res.send(result);
    });
  });
}

module.exports = api;
