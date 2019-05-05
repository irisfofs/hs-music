import {Component} from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

import rawData from '../assets/data.json';
import {ComicEvent, landmarks} from '../data/act_information';

import {Track} from './track';

// TODO: Look if this exists in d3 code.
interface D3Item {
  x?: number;
  y?: number;
  baseY?: number;
}

const data: Track[] = rawData.map((raw) => new Track(raw));

// these should go somewhere better than just... sitting here ugh
const width = 1920;
const HEIGHT = 1000;
const COVER_SIZE = 60;
const BORDER_SIZE = 1;
const SPACING = 5;

const FIRST_PAGE = 1;
// Chosen somewhat arbitrarily.
// const last_page = 8130;
const LAST_PAGE = 4109;
const PAGE_SPAN = LAST_PAGE - FIRST_PAGE;

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

function d3stuff() {
  const chart = d3.select('#chart').attr('width', width).attr('height', HEIGHT);

  // ooo you should have a slick AF animation of it drawing the act line

  const cover_group = chart.append('g');
  const act_line = chart.append('g');

  drawActs(act_line);

  // Really feeling like I should call a helper method with side 1, then side 2.
  const tracker1 = new HeightTracker(COVER_SIZE + SPACING);
  const tracker2 = new HeightTracker(COVER_SIZE + SPACING);

  const side1End = landmarks.side1[landmarks.side1.length - 1].page;
  const side1Covers = [];
  const side2Covers = [];
  data.forEach((d) => {
    if (Number(d.page) <= side1End) {
      side1Covers.push(d);
    } else {
      side2Covers.push(d);
    }
  });

  side1Covers.forEach((d: Track&D3Item) => {
    d.x = pageNumToX(d.page, landmarks.side1);
    d.baseY = HEIGHT / 4;
    d.y = d.baseY + (COVER_SIZE + SPACING) * tracker1.getHeight(d);
  });

  side2Covers.forEach((d: Track&D3Item) => {
    d.x = pageNumToX(d.page, landmarks.side2);
    d.baseY = 3 * HEIGHT / 4;
    d.y = d.baseY + (COVER_SIZE + SPACING) * tracker2.getHeight(d);
  });

  const fraction_of_comic = (page_count) =>
      page_count / landmarks.side1[landmarks.side1.length - 1].page;

  const total_rollout = 4000;
  cover_group.selectAll('.drop-line')
      .data(data)
      .enter()
      .append('line')
      .attr('x1', (d) => d.x)
      .attr('x2', (d) => d.x)
      .attr('y1', (d) => d.baseY)
      .attr('y2', (d) => d.baseY)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .transition()
      .duration(500)
      .ease(d3.easeCubic)  // cubic-in
      .delay(
          (d) => total_rollout / 2 +
              fraction_of_comic(d.page - FIRST_PAGE) * total_rollout)
      .attr('y1', (d) => d.y);

  const tip = d3Tip()
                  .attr('class', 'd3-tip cover-tooltip')
                  .offset([-10, 0])
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
                  `translate(${d.x - COVER_SIZE / 2}, ${d.y - COVER_SIZE / 2})`)
          .style('opacity', 0);

  covers.on('mouseover', tip.show).on('mouseout', tip.hide);

  covers.transition()
      .duration(250)
      .ease(d3.easeCubic)  // cubic-out
      .delay(
          (d) => 500 + total_rollout / 2 +
              fraction_of_comic(d.page - FIRST_PAGE) * total_rollout)
      .style('opacity', 1);

  // put it behind the image so the border peeks out from behind
  covers.append('rect')
      .attr('width', COVER_SIZE)
      .attr('height', COVER_SIZE)
      .attr('stroke', 'black')
      .attr('stroke-width', BORDER_SIZE)
      .attr('fill', 'black');

  covers.append('image')
      .attr('xlink:href', (d) => `/assets/covers/${cover_filename(d)}`)
      .attr('width', COVER_SIZE)
      .attr('height', COVER_SIZE);
}

function drawActs(chart) {
  const height_midpoint = HEIGHT / 2;

  // why am I not just using this to begin with...?
  const combined_data = landmarks.side1;
  for (let i = combined_data.length - 1; i >= 0; i--) {
    const next_i = Math.min(i + 1, combined_data.length - 1);
    combined_data[i].length =
        combined_data[next_i].page - combined_data[i].page;
  }

  const total_rollout = 4000;
  const circle_duration = 300;

  const last_page = combined_data[combined_data.length - 1].page;
  const fraction_of_comic = (page_count) => page_count / last_page;

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
          .delay((d) => fraction_of_comic(d.page - FIRST_PAGE) * total_rollout)
          .attr('x2', (d) => page_num_to_x(d.page + d.length));

  const tip =
      d3Tip()
          .attr('class', 'd3-tip cover-tooltip')
          .offset([-10, 0])
          .html(
              (d: ImportantEvent) => (`<p>${d.title}</p><p>${d.subtitle}</p>`));

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
                          .on('mouseover', tip.show)
                          .on('mouseout', tip.hide)
                          .transition()
                          .ease(d3.easeSin)  // sin-out
                          .duration(circle_duration)
                          .delay(
                              (d, i) => total_rollout / 3 +
                                  (i / combined_data.length) * total_rollout)
                          .attr('r', 8);

  act_circles.call(tip);

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

function page_num_to_x(page: number) {
  const width_padding = 200;

  const usable_width = width - width_padding;
  const homestuck_page_count = (page || 0) - FIRST_PAGE;
  return homestuck_page_count / PAGE_SPAN * usable_width + width_padding / 2;
}

function pageNumToX(page: number, side: ComicEvent[]) {
  const width_padding = 200;
  const usable_width = width - width_padding;

  const sideStart = side[0].page;
  const sidePageCount = side[side.length - 1].page - sideStart;

  const pageCountInSide = page - sideStart;
  return pageCountInSide / sidePageCount * usable_width + width_padding / 2;
}

function cover_filename(track: Track) {
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

function HeightTracker(item_width: number) {
  const items = [];

  this.getHeight = function getHeight(track: Track&D3Item) {
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
      blocked_heights.add(items[i].heightLevel);
    }

    for (let i = insert_at; i >= 0 && i < items.length; i++) {
      if (items[i].x - track.x > item_width) {
        break;
      }
      blocked_heights.add(items[i].heightLevel);
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

    track.heightLevel = potential_height;

    // finally insert this track at the index
    items.splice(insert_at, 0, track);

    return track.heightLevel;
  };

  function binarySearch(track: D3Item, start: number, end: number) {
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
