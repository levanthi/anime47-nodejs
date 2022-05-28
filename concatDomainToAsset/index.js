const concatDomainToAsset = {};
const thumbnailDomain = "https://drive.google.com/thumbnail?id=";
const animeDomain = "https://p-def5.pcloud.com/";

concatDomainToAsset.thumbnail = (data) => {
  data.forEach((item) => {
    item.thumbnail = thumbnailDomain + item.thumbnail;
  });
  return data;
};
concatDomainToAsset.video = (data) => {
  data.forEach((item) => {
    item.url = animeDomain + item.url;
  });
  return data;
};

module.exports = concatDomainToAsset
