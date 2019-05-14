
var DMSPgrc = ee.ImageCollection("NOAA/DMSP-OLS/CALIBRATED_LIGHTS_V4"),
    geo1 = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[119.9646428166219, 30.328561489615637],
          [119.9646428166219, 30.119718381878908],
          [120.31414538009847, 30.119718381878908],
          [120.31414538009847, 30.328561489615637]]], null, false);

var DMSPgrc=ee.ImageCollection(DMSPgrc).first().clip(geo1);
Map.addLayer(DMSPgrc,{max:100});

var scale1=ee.Number(DMSPgrc.projection().nominalScale());

print(scale1)

Export.image.toDrive({
  image: DMSPgrc.clip(geo1),
  description: 'NTLtoDrive',
  scale: scale1,
  region: geo1
});
