import {Component} from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

import rawData from '../assets/data.json';

interface Track {
  page?: string;
  title?: string;
  track_link?: string;
  page_link: string;
  album: string;
  album_link: string;
  artist: string;
  artist_link: string;
  page_title?: string;
}

// TODO: Look if this exists in d3 code.
interface D3Item {
  x?: number;
  y?: number;
}

const data: Track[] = rawData;

// these should go somewhere better than just... sitting here ugh
const width = 1920;
const height = 1000;
const cover_size = 60;
const border_size = 1;
const spacing = 5;

const first_page = 1;
// Chosen somewhat arbitrarily.
const last_page = 8130;
const page_span = last_page - first_page;

@Component({
  selector: 'hs-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent {
  ngOnInit() {
    console.log(data);
    d3stuff();
  }
}

interface ImportantEvent {
  title: string;
  page: number;
  subtitle: string;
  color: string;
  length?: number;
}

const HS_RED = '#e00707';
const HS_BLUE = '#0715cd';
const HS_LIME = '#4ac925';
const HS_GREEN = '#168500';
const HS_GRAY = '#C6C6C6';

function drawActs(chart) {
  /* Act information */
  const everything: {part1: ImportantEvent[], part2: ImportantEvent[]} = {
    part1: [
      {
        title: 'Act 1',
        page: 1,
        subtitle: 'The Note Desolation Plays',
        color: HS_RED
      },
      {
        title: 'Act 2',
        page: 248,
        subtitle: 'Raise of the Conductor\'s Baton',
        color: HS_RED
      },
      {
        title: 'Act 3',
        page: 759,
        subtitle: 'Insane Corkscrew Haymakers',
        color: HS_RED
      },
      {
        title: 'Intermission',
        page: 1154,
        subtitle: 'Don\'t Bleed on the Suits',
        color: HS_GREEN,
      },
      {
        title: 'Act 4',
        page: 1358,
        subtitle: 'Flight of the Paradox Clones',
        color: HS_RED
      },
    ],
    part2: [
      {
        title: 'Act 5 Act 1',
        page: 1989,
        subtitle: 'MOB1US DOUBL3 R34CH4ROUND',
        color: 'blue'
      },
      {
        title: 'Act 5 Act 2',
        page: 2626,
        subtitle: 'He is already here.',
        color: HS_RED
      },
      {title: 'EOA5', page: 4109, subtitle: 'Cascade.', color: 'black'},
      {
        title: 'Act 6 Act 1',
        page: 4113,
        subtitle: 'Through Broken Glass',
        color: HS_GRAY
      },
      {
        title: 'Act 6 Intermission 1',
        page: 4295,
        subtitle: 'corpse party',
        color: HS_LIME
      },
      {
        title: 'Act 6 Act 2',
        page: 4419,
        subtitle: 'Your shit is wrecked.',
        color: HS_GRAY
      },
      {
        title: 'Act 6 Intermission 2',
        page: 4667,
        subtitle: 'penis ouija',
        color: HS_LIME
      },
      {title: 'Act 6 Act 3', page: 4820, subtitle: 'Nobles', color: HS_GRAY},
      {
        title: 'Act 6 Intermission 3',
        page: 5263,
        subtitle: 'Ballet of the Dancestors',
        color: HS_LIME
      },
      {title: 'Act 6 Act 4', page: 5438, subtitle: 'Void', color: HS_GRAY},
      {
        title: 'Act 6 Intermission 4',
        page: 5441,
        subtitle: 'Dead',
        color: HS_LIME
      },
      {
        title: 'Act 6 Act 5',
        page: 5571,
        subtitle: 'Of Gods and Tricksters',
        color: HS_GRAY
      },
      {
        title: 'Act 6 Intermission 5',
        page: 5927,
        subtitle: 'I\'M PUTTING YOU ON SPEAKER CRAB.',
        color: HS_LIME
      },
      {title: 'Act 6 Act 6', page: 6243, subtitle: '', color: HS_GREEN},
      {
        title: 'Act 6 Act 6 Intermission 1',
        page: 6278,
        subtitle: '',
        color: HS_GRAY
      },
      {title: 'Act 6 Act 6 Act 2', page: 6475, subtitle: '', color: HS_GREEN},
      {
        title: 'Act 6 Act 6 Intermission 2',
        page: 6531,
        subtitle: '',
        color: HS_GRAY
      },
      {title: 'Act 6 Act 6 Act 3', page: 6853, subtitle: '', color: HS_GREEN},
      {
        title: 'Act 6 Act 6 Intermission 3',
        page: 6901,
        subtitle: '',
        color: HS_GRAY
      },
      {title: 'Act 6 Act 6 Act 4', page: 6921, subtitle: '', color: HS_GREEN},
      {
        title: 'Act 6 Act 6 Intermission 4',
        page: 6944,
        subtitle: '',
        color: HS_GRAY
      },
      {title: 'Act 6 Act 6 Act 5', page: 7409, subtitle: '', color: HS_GREEN},
      {
        title: 'Act 6 Act 6 Intermission 5',
        page: 7449,
        subtitle: '',
        color: HS_GRAY
      },
      {title: 'EOA6', page: 8087, subtitle: 'Collide.', color: 'green'},
      {title: 'Act 7', page: 8127, subtitle: '', color: 'white'},
    ],
  };

  const height_midpoint = height / 2;

  // why am I not just using this to begin with...?
  const combined_data = everything.part1.concat(everything.part2);
  for (let i = combined_data.length - 1; i >= 0; i--) {
    const next_i = Math.min(i + 1, combined_data.length - 1);
    combined_data[i].length =
        combined_data[next_i].page - combined_data[i].page;
  }

  const total_rollout = 4000;
  const circle_duration = 300;

  const act_lines =
      chart.selectAll('line')
          .data(combined_data)
          .enter()
          .append('line')
          .attr('y1', height_midpoint)
          .attr('y2', height_midpoint)
          .attr('x1', (d) => page_num_to_x(d.page))
          .attr('x2', (d) => page_num_to_x(d.page))
          .attr('stroke', (d) => d.color)
          .attr('stroke-width', 3)
          .transition()
          .ease(d3.easeSin)  // sin-out
          // TODO: write functions to clear up these computations
          // like until_act_line_passed or something...
          .duration((d) => fraction_of_comic(d.length) * total_rollout)
          .delay((d) => fraction_of_comic(d.page - first_page) * total_rollout)
          .attr('x2', (d) => page_num_to_x(d.page + d.length));

  const act_circles = chart.selectAll('circle')
                          .data(combined_data)
                          .enter()
                          .append('circle')
                          .attr('cx', (d) => page_num_to_x(d.page))
                          .attr('cy', height_midpoint)
                          .attr('stroke', (d) => d.color)
                          .attr('stroke-width', 3)
                          .attr('fill', d => d.color)
                          .attr('r', 0)
                          .transition()
                          .ease(d3.easeSin)  // sin-out
                          .duration(circle_duration)
                          .delay(
                              (d, i) => total_rollout / 3 +
                                  (i / combined_data.length) * total_rollout)
                          .attr('r', 8);

  // d3.transition()
  //   .each(function () {
  //     act_lines.transition()
  //       .duration((d) => d.length * 10)
  //       .delay((d) => (page_num_to_x(d.page) - page_num_to_x(1901)) * 10) //
  //       adds extra starting delay .attr('x2', (d) => page_num_to_x(d.page) +
  //       d.length);
  //   })
  //   .transition()
  //   .each('start', () => {
  //     d3.selectAll('circle')
  //       .transition()
  //       .delay((d) => (page_num_to_x(d.page) - page_num_to_x(1901)) * 10) //
  //       adds extra starting delay .duration(500) .attr('r', 8);
  //   });
}

function page_num_to_x(page) {
  const width_padding = 200;

  const usable_width = width - width_padding;
  const homestuck_page_count = (page || 0) - first_page;
  return homestuck_page_count / page_span * usable_width + width_padding / 2;
}

function fraction_of_comic(page_count) {
  return page_count / page_span;
}

function cover_filename(track) {
  if (track.title) {
    const fn =
        track.title.toLowerCase().replace(/ /g, '_').replace(/[^\w-]/g, '');
    const final = `cover_${fn}.jpg`;
    console.log(final);
    return final;
  }
  // TODO: return some generic cover page
  // also learn when one isn't there and replace that also
  return undefined;
}

function d3stuff() {
  const chart = d3.select('#chart').attr('width', width).attr('height', height);

  // ooo you should have a slick AF animation of it drawing the act line

  const cover_group = chart.append('g');
  const act_line = chart.append('g');

  drawActs(act_line);

  const tracker = new HeightTracker(cover_size + spacing);

  // Do this once as opposed to every time d3 needs x
  // UGH but now it'll break on resizing page...
  // well that was broken anyway
  data.forEach((d: Track&D3Item) => {
    d.x = page_num_to_x(d.page);
    d.y = (height / 2) + (cover_size + spacing) * tracker.getHeight(d);
  });

  const total_rollout = 4000;
  cover_group.selectAll('.drop-line')
      .data(data)
      .enter()
      .append('line')
      .attr('x1', (d) => d.x)
      .attr('x2', (d) => d.x)
      .attr('y1', () => height / 2)
      .attr('y2', () => height / 2)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .transition()
      .duration(500)
      .ease(d3.easeCubic)  // cubic-in
      .delay(
          (d) => total_rollout / 2 +
              fraction_of_comic(d.page - first_page) * total_rollout)
      .attr('y1', (d) => d.y);

  const tip = d3Tip()
                  .attr('class', 'd3-tip cover-tooltip')
                  .html((d) => (`<p>${d.title} - ${d.artist}</p>
<p>${d.page_title}</p>`));

  cover_group.call(tip);

  const covers =
      cover_group.selectAll('.cover')
          .data(data)
          .enter()
          .append('g')
          .attr(
              'transform',
              (d) =>
                  `translate(${d.x - cover_size / 2}, ${d.y - cover_size / 2})`)
          .style('opacity', 0);

  covers.on('mouseover', tip.show).on('mouseout', tip.hide);

  covers.transition()
      .duration(250)
      .ease(d3.easeCubic)  // cubic-out
      .delay(
          (d) => 500 + total_rollout / 2 +
              fraction_of_comic(d.page - first_page) * total_rollout)
      .style('opacity', 1);

  // put it behind the image so the border peeks out from behind
  covers.append('rect')
      .attr('width', cover_size)
      .attr('height', cover_size)
      .attr('stroke', 'black')
      .attr('stroke-width', border_size)
      .attr('fill', 'black');

  covers.append('image')
      .attr('xlink:href', (d) => `/assets/covers/${cover_filename(d)}`)
      .attr('width', cover_size)
      .attr('height', cover_size);
}

function HeightTracker(item_width) {
  const items = [];

  this.getHeight = function getHeight(track) {
    // use the stored x
    console.log(`${track.x}: ${track.title}`);
    // binary search
    const insert_at = binarySearch(track, 0, items.length - 1);

    // now traverse left and right and see how many are within 'range'
    const blocked_heights = new Set();
    for (let i = insert_at - 1; i >= 0 && i < items.length; i--) {
      if (track.x - items[i].x > item_width) {
        break;
      }
      blocked_heights.add(items[i].height_level);
    }

    for (let i = insert_at; i >= 0 && i < items.length; i++) {
      if (items[i].x - track.x > item_width) {
        break;
      }
      blocked_heights.add(items[i].height_level);
    }

    // get the first not-blocked height
    let potential_height = 0;
    do {
      potential_height *= -1;  // flip sign again
      potential_height++;
      if (!blocked_heights.has(potential_height)) {
        break;
      }
      potential_height *= -1;  // flip sign
    } while (blocked_heights.has(potential_height));

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
      return start;  // insert before start
    } else if (track.x > items[end].x) {
      return end + 1;  // insert after end
    }

    if (start === end || end - start === 1) {
      return start + 1;  // insert right after start
    }

    const midpoint = Math.floor((start + end) / 2);
    if (track.x <= items[midpoint].x) {
      return binarySearch(track, start, midpoint);
    }
    return binarySearch(track, midpoint + 1, end);
  }
}
