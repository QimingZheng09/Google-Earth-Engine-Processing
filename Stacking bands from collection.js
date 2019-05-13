 // stack image band from image collection to a single image with multi-bands

var VIIRS=ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG');
print(VIIRS);
print('Number of image in Collection:',VIIRS.size());

var renameVIIRS=function(scene){
  //var reName1='VIIRS'+scene.select('avg_rad').get('system:index').getInfo();
  var NTL=ee.Image(scene.select(['avg_rad']));
  var NTL_idx=ee.String('DNB_').cat(ee.String(scene.get('system:index')));
  return NTL.rename(NTL_idx);
};

var VIIRS_Month_Collection=VIIRS.map(renameVIIRS);

var stackCollection=function(collection){
  var first=ee.Image(collection.first()).select([]);
    // Write a function that appends a band to an image.
  var appendBands = function(image, previous) {
    return ee.Image(previous).addBands(image);
  };
  return ee.Image(collection.iterate(appendBands, first));
};
var stacked = stackCollection(VIIRS_Month_Collection);
print('stacked image', stacked);
