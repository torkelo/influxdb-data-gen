var influx = require('influx');
var client = influx({
    host: 'localhost',
    port: 8086,
    username: 'root',
    password: 'root',
    database: 'site'
});

var data = {};

client.createDatabase('site', function() {
  console.log('creating database site', arguments);
});

client.createDatabase('graphite', function() {
  console.log('creating database graphite', arguments);
});

client.createUser('site', 'grafana', 'grafana', function() {
  console.log('creating user grafana for db site', arguments);
});

client.createUser('graphite', 'grafana', 'grafana', function() {
  console.log('creating user grafana for db graphite', arguments);
});

setInterval(function() {

  //randomWalk('request_count', 1000, 100);
  randomWalk('request_count2', 1000, 100);
  randomWalk('request_count3', 1000, 100);

  randomWalk('request_time', 10, 5);
  randomWalk('request_time2', 10, 5);

  appStatus('eu1-web-01', 1000, 100);
  appStatus('eu1-web-02', 1000, 100);
  appStatus('eu1-web-03', 1000, 100);


}, 10000);

function randomWalk(name, start, variation) {
  if (!data[name]) {
    data[name] = start;
  }

  data[name] += (Math.random() * variation) - (variation / 2);

//  console.log('Writing ' + name + " :" + data[name]);

  if (Math.round(data[name] % 5) != 0)  {
    client.writePoint(name, { time: new Date(), value: data[name] }, function(err) {
      if (err) {
        console.log('InfluxDB Error', err);
      }
    });
  }
  else {
    console.log("skip");
  }
}

function appStatus(host, start, variation) {
  var name = "app.status." + host;
  if (!data[name]) {
    data[name] = start;
  }

  data[name] += (Math.random() * variation) - (variation / 2);

  //console.log('Writing ' + name + " :" + data[name]);

  client.writePoint("app.status", { time: new Date(), value: data[name], host: host }, function(err) {
    if (err) {
      console.log('InfluxDB Error', err);
    }
  });
}
