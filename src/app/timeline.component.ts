import {Component} from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

import rawData from '../assets/data.json';
import {ComicEvent, landmarks} from '../data/act_information';

import {HeightTracker} from './height_tracker';
import {D3Item, Track} from './track';

const data: Track[] = rawData.map((raw) => new Track(raw));

// these should go somewhere better than just... sitting here ugh
const width = window.innerWidth;
const HEIGHT = window.innerHeight;
const COVER_SIZE = 60;
const BORDER_SIZE = 1;
const SPACING = 5;

const FIRST_PAGE = 1;
// Chosen somewhat arbitrarily.
const LAST_PAGE = 8130;
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

const HS_RED = '#e00707';
const HS_BLUE = '#0715cd';
const HS_LIME = '#4ac925';
const HS_GREEN = '#168500';
const HS_GRAY = '#C6C6C6';

function d3stuff() {
  const chart = d3.select('#chart').attr('width', width).attr('height', HEIGHT);

  // ooo you should have a slick AF animation of it drawing the act line

  const cover_group = chart.append('g');
  const act_line1 = chart.append('g');
  const act_line2 = chart.append('g');

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

  side1Covers.forEach((d: Track) => {
    d.x = pageNumToX(d.page, landmarks.side1);
    d.baseY = HEIGHT / 4;
    d.y = d.baseY + (COVER_SIZE + SPACING) * tracker1.addTrack(d);
  });

  side2Covers.forEach((d: Track&D3Item) => {
    d.x = pageNumToX(d.page, landmarks.side2);
    d.baseY = 3 * HEIGHT / 4;
    d.y = d.baseY + (COVER_SIZE + SPACING) * tracker2.addTrack(d);
  });

  const fraction_of_comic = (page_count) =>
      page_count / landmarks.side1[landmarks.side1.length - 1].page;

  const totalRollout = 4000;

  const side1Rollout =
      (landmarks.side1[landmarks.side1.length - 1].page - FIRST_PAGE) /
      PAGE_SPAN * totalRollout;
  const side2Delay =
      (landmarks.side2[0].page - FIRST_PAGE) / PAGE_SPAN * totalRollout;

  drawActs(act_line1, landmarks.side1, HEIGHT / 4, 0, side1Rollout);
  drawActs(
      act_line2, landmarks.side2, 3 * HEIGHT / 4, side2Delay, totalRollout);

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
          (d) => totalRollout / 2 +
              fraction_of_comic(d.page - FIRST_PAGE) * totalRollout)
      .attr('y1', (d) => d.y);

  const tip = d3Tip()
                  .attr('class', 'd3-tip cover-tooltip')
                  .offset([-10, 0])
                  .html((d: Track) => (`<p>${d.title} - ${d.artist}</p>
<p>${d.pageTitle}</p>`));

  cover_group.call(tip);

  const covers = cover_group.selectAll('.cover')
                     .data(data)
                     .enter()
                     .append('g')
                     .attr(
                         'transform',
                         (d) => `translate(${d.displayX - COVER_SIZE / 2}, ${
                             d.y - COVER_SIZE / 2})`)
                     .style('opacity', 0);

  covers.on('mouseover', tip.show).on('mouseout', tip.hide);

  covers.transition()
      .duration(250)
      .ease(d3.easeCubic)  // cubic-out
      .delay(
          (d) => 500 + totalRollout / 2 +
              fraction_of_comic(d.page - FIRST_PAGE) * totalRollout)
      .style('opacity', 1);

  // put it behind the image so the border peeks out from behind
  covers.append('rect')
      .attr('width', COVER_SIZE)
      .attr('height', COVER_SIZE)
      .attr('stroke', 'black')
      .attr('stroke-width', BORDER_SIZE)
      .attr('fill', 'black');

  covers.append('image')
      .attr('xlink:href', (d) => `assets/covers/${cover_filename(d)}`)
      .attr('width', COVER_SIZE)
      .attr('height', COVER_SIZE);
}

function drawActs(
    chart: d3.Selection<d3.BaseType, {}, HTMLElement, unknown>,
    events: ComicEvent[], actLineHeight: number, delay: number,
    rolloutDuration: number) {
  for (let i = events.length - 1; i >= 0; i--) {
    const next_i = Math.min(i + 1, events.length - 1);
    events[i].length = events[next_i].page - events[i].page;
  }

  const circle_duration = 300;

  const firstPage = events[0].page;
  const lastPage = events[events.length - 1].page;
  const fractionOfSide = (pageCount) => pageCount / lastPage;

  const act_lines =
      chart.selectAll('line')
          .data(events)
          .enter()
          .append('line')
          .attr('y1', actLineHeight)
          .attr('y2', actLineHeight)
          .attr('x1', (d) => pageNumToX(d.page, events))
          .attr('x2', (d) => pageNumToX(d.page, events))
          .attr('stroke', (d) => d.color)
          .attr('stroke-width', 3)
          .transition()
          .ease(d3.easeSin)  // sin-out
          // TODO: write functions to clear up these computations
          // like until_act_line_passed or something...
          .duration((d) => fractionOfSide(d.length) * rolloutDuration)
          .delay(
              (d) =>
                  delay + fractionOfSide(d.page - firstPage) * rolloutDuration)
          .attr('x2', (d) => pageNumToX(d.page + d.length, events));

  const tip =
      d3Tip()
          .attr('class', 'd3-tip cover-tooltip')
          .offset([-10, 0])
          .html((d: ComicEvent) => (`<p>${d.title}</p><p>${d.subtitle}</p>`));

  const act_circles = chart.selectAll('circle')
                          .data(events)
                          .enter()
                          .append('circle')
                          .attr('cx', (d) => pageNumToX(d.page, events))
                          .attr('cy', actLineHeight)
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
                              (d, i) => delay + rolloutDuration / 3 +
                                  (i / events.length) * rolloutDuration)
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
