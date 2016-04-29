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
  var width = 1920;
  var width_padding = 200;
  var height = 1000;
  var cover_size = 60;
  var border_size = 1;
  var spacing = 5;

  var first_page = 1901;
  var last_page = 10028;
  var page_span = last_page - first_page;

  var chart = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);

  var tracker = new HeightTracker(cover_size + spacing);

  var covers = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", (d) => {
        d.x = ((d.page || 100) - first_page) / page_span * (width - width_padding) + width_padding / 2;
        var y = (height/2) + (cover_size + spacing) * tracker.getHeight(d);

        return `translate(${d.x - cover_size / 2}, ${y - cover_size / 2})`;
      });

  covers.append("image")
    .attr("xlink:href", (d) => `/covers/${cover_filename(d)}`)
    .attr("width", cover_size)
    .attr("height", cover_size);

  // yes, this will cover up border_size/2 pixels of the cover. OH WELL
  covers.append("rect")
    .attr("width", cover_size)
    .attr("height", cover_size)
    .attr("stroke", "black")
    .attr("stroke-width", border_size)
    .attr("fill", "none");


}

function HeightTracker(width) {
  var items = [];

  this.getHeight = function getHeight(track) {
    // use the stored x
    console.log(`${track.x}: ${track.title}`);
    // binary search
    var insert_at = binarySearch(track, 0, items.length - 1);

    // now traverse left and right and see how many are within 'range'
    var blocked_heights = new Set();
    for (var i = insert_at - 1; i >= 0 && i < items.length; i--) {
      if (track.x - items[i].x > width) {
        break;
      }
      blocked_heights.add(items[i].height_level);
    }

    for (var i = insert_at; i >= 0 && i < items.length; i++) {
      if (items[i].x - track.x > width) {
        break;
      }
      blocked_heights.add(items[i].height_level);
    }

    // get the first not-blocked height
    var potential_height = 1;
    while(true) {
      if (!blocked_heights.has(potential_height)) {
        break;
      }
      potential_height *= -1; // flip sign
      if (!blocked_heights.has(potential_height)) {
        break;
      }
      potential_height *= -1; // flip sign again
      potential_height++;
    }

    track.height_level = potential_height;

    // finally insert this track at the index
    items.splice(insert_at, 0, track);

    return track.height_level;
  };

  function binarySearch(track, start, end) {
    if (items.length === 0) {
      return 0;
    }
    // end case: one or two element range
    if (track.x < items[start].x) {
      return start; // insert before start
    } else if (track.x > items[end].x) {
      return end + 1; // insert after end
    }

    if (start === end || end - start === 1) {
      return start + 1; // insert right after start
    }

    var midpoint = Math.floor((start + end) / 2);
    if (track.x <= items[midpoint].x) {
      return binarySearch(track, start, midpoint);
    } else {
      return binarySearch(track, midpoint + 1, end);
    }
  }


}


