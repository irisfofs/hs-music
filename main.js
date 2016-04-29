var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};


getJSON('/data.json').then(function(data) {
  console.log(data);
  d3stuff(data);
});

function cover_filename(track) {
  if (track.title) {
    var fn = track.title.toLowerCase().replace(/ /g, '_').replace(/[^\w-]/g, '');
    var final = `cover_${fn}.jpg`;
    console.log(final);
    return final;
  } else {
    // TODO: return some generic cover page
    return undefined;
  }
}

function d3stuff(data) {
  var width = 800;
  var height = 600;

  var chart = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);

  var bar = chart.selectAll("image")
      .data(data)
    .enter().append("image")
      .attr("xlink:href", (d) => `/covers/${cover_filename(d)}`)
      .attr("x", (d) => (d.page || 100)/10)
      .attr("y", 300)
      .attr("width", 30)
      .attr("height", 30);
}
