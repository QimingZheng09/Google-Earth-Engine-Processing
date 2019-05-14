var grc = ee.ImageCollection("NOAA/DMSP-OLS/CALIBRATED_LIGHTS_V4"),
    geometry = /* color: #d63000 */ee.Geometry.MultiPoint(),
    polygon2 = ee.FeatureCollection("users/qmzheng09/fishnet4"),
    polygon1 = ee.FeatureCollection("users/qmzheng09/gee_poly2");

var subset=ee.FeatureCollection(polygon1);
var DMSPgrc=ee.ImageCollection(grc);

// how many images in the collections?
print('Size of NTL collection',DMSPgrc.size());
print('NTL',DMSPgrc);
print('NTL_id',DMSPgrc.first().select(['avg_vis']).id());

// Table Feature;
print('feature',subset.first().get('id'));

// displace the polygon (fusion table)
Map.setCenter(120.2,30.2);
Map.addLayer(subset);
Map.addLayer(DMSPgrc.first(),{max:100},'DMSPgrc');

var data1=DMSPgrc;
var triplets=data1.map(function(image){
  return image.select('avg_vis').reduceRegions({
    collection:subset.select(['locationID']),
    reducer:ee.Reducer.mean(),
    scale: 1000,
  }).filter(ee.Filter.neq('mean',null))
  .map(function(f){
    return f.set('imageId', image.id());
  });
}).flatten();

print('test',triplets.first());

var format = function(table, rowId, colId) {
  var rows = table.distinct(rowId); 
  var joined = ee.Join.saveAll('matches').apply({
    primary: rows, 
    secondary: table, 
    condition: ee.Filter.equals({
      leftField: rowId, 
      rightField: rowId
    })
  });

  return joined.map(function(row) {
      var values = ee.List(row.get('matches'))
        .map(function(feature) {
          feature = ee.Feature(feature);
          return [feature.get(colId), feature.get('mean')];
        });
      return row.select([rowId]).set(ee.Dictionary(values.flatten()));
    });
};

var table2 = format(triplets, 'locationID', 'imageId');
Export.table.toDrive({
  collection: table2,
  description:'NTL1',
  fileFormat: 'CSV'
});

