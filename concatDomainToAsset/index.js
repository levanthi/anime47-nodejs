const concatDomainToAsset = {};
const assetDomain = "http://localhost:5500";

concatDomainToAsset.thumbnail = (data) => {
  data.forEach((item) => {
    item.thumbnail = assetDomain + item.thumbnail;
  });
  return data;
};
concatDomainToAsset.video = (data) => {
  data.forEach((item) => {
    item.url = assetDomain + item.url;
  });
  return data;
};

module.exports = concatDomainToAsset
