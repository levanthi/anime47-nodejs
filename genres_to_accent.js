function genreToAccent(genre, type) {
  switch (type) {
    case "anime":
      return "Anime";
    case "china":
      return "Hoạt Hình Trung Quốc";
    case "live-action":
      return "Live Action";
  }
  switch (genre) {
    case "blu-ray":
      return "Blu-ray";
    case "coming-of-age":
      return "Coming Of Age";
    case "martial-art":
      return "Martial Art";
    case "shoujo-ai":
      return "Shoujo Ai";
    case "shounen-ai":
      return "Shounen Ai";
    case "super-power":
      return "Super Power";
    case "doi-thuong":
      return "Đời Thường";
    case "hoc-duong":
      return "Học Đường";
    case "the-thao":
      return "Thể Thao";
    case "trinh-tham":
      return "Trinh Thám";
    case "kinh-di":
      return "Kinh Dị";
    case "phep-thuat":
      return "Phép Thuật";
    case "phieu-luu":
      return "Phiêu Lưu";
    case "hai-huoc":
      return "Hài Hước";
    case "hanh-dong":
      return "Hành Động";
    case "lich-su":
      return "Lịch Sử";
    case "am-nhac":
      return "Âm Nhạc";
    case "vien-tuong":
      return "Viễn Tưởng";
    case "hoat-hinh-trung-quoc":
      return "Hoạt Hình Trung Quốc";
    case "hoan-thanh":
      return "Hoàn Thành";
    case "dang-tien-hanh":
      return "Đang Tiến Hành";
    case "ngay":
      return "Ngày";
    case "tuan":
      return "Tuần";
    case "thang":
      return "Tháng";
    case "mua-nay":
      return "Mùa Này";
    case "nam-nay":
      return "Năm Này";
    case "mua-truoc":
      return "Mùa Trước";
    case "nam-truoc":
      return "Năm Trước";
    case "tat-ca":
      return "Tất Cả";
    case "hanh-dong+hai-huoc":
      return "Hành Động + Hài Hước";
    case "lang-man+hanh-dong":
      return "Lãng Mạn + Hành Động";
    case "harem+hai-huoc":
      return "Harem + Hài Hước";
    case "ecchi+harem":
      return "Ecchi + Harem";
    case "doi-thuong+hoc-duong":
      return "Đời Thường + Học Đường";
    case "hoc-duong+ecchi":
      return "Học Đường + Ecchi";
    case "romance+tragedy":
      return "Romance + Tragedy";
    case "ket-hop-ngau-nhien":
      return "Kết Hợp Ngẫu Nhiên";
  }
  genre = [...genre];
  let firstLetter = genre[0].toUpperCase();
  genre.shift();
  return firstLetter + genre.join("");
}

module.exports = genreToAccent;
