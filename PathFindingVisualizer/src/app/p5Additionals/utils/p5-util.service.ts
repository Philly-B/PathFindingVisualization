import { Injectable } from '@angular/core';
import { P5Vector } from '../models/P5Vector';

import * as ColorMapping from 'src/app/constants/ColorMapping';
import { P5Settings } from '../models/P5Settings';
import { Graph } from 'src/app/model/Graph';
import { GraphCell } from 'src/app/model/GraphCell';

@Injectable({
  providedIn: 'root',
})
export class P5UtilService {
  constructor() {}

  graphDefinition = (picture, graph: Graph, settings: P5Settings, hexagonClickedCallback: (hexagonClicked) => void) => {
    const pictureShift: P5Vector = {
      x: settings.hexagonSizePx * 1.8,
      y: settings.hexagonSizePx * 3,
      z: 0,
    };

    picture.setup = () => {
      const canvas = picture.createCanvas(settings.canvasSizePx, settings.canvasSizePx);
      picture.angleMode(picture.RADIANS);
    };
    picture.draw = () => {
      picture.background(ColorMapping.background);
      this.drawHexagons(picture, graph.grid, pictureShift, settings);
    };

    picture.mouseClicked = () => {
      this.handleMouseEvent(graph.grid, settings, hexagonClickedCallback, picture);
    };
    picture.mouseDragged = () => {
      this.handleMouseEvent(graph.grid, settings, hexagonClickedCallback, picture);
    };
  };

  pixelToHex = (graph: GraphCell[][], picture, x: number, y: number, settings: P5Settings): GraphCell => {
    for (let row = 0; row < settings.N; row++) {
      const startForRow = row % 2 === 1 ? 1 : 0;
      for (let col = startForRow; col < settings.N - 1; col++) {
        const currHex = graph[row][col];
        const dist = picture.sqrt(picture.pow(x - currHex.center.x, 2) + picture.pow(y - currHex.center.y, 2));
        if (dist <= settings.hexagonSizePx) {
          return currHex;
        }
      }
    }

    return undefined;
  };

  private handleMouseEvent = (
    graph: GraphCell[][],
    settings: P5Settings,
    hexagonClickedCallback: (hexagonClicked) => void,
    picture: any
  ) => {
    const hexagonClicked = this.pixelToHex(graph, picture, picture.mouseX, picture.mouseY, settings);
    if (hexagonClicked === undefined) {
      return false;
    }
    hexagonClickedCallback(hexagonClicked);
    return false;
  };

  private drawHexagons = (picture, graph: GraphCell[][], pictureShift: P5Vector, settings: P5Settings): void => {
    for (let row = 0; row < settings.N; row++) {
      const startForRow = row % 2 === 1 ? 1 : 0;
      for (let col = startForRow; col < settings.N - 1; col++) {
        const centerOfHexagonPx = this.hexToPixel(picture, col, row, pictureShift, settings);
        graph[row][col].center = centerOfHexagonPx;
        this.drawOneHexagon(picture, graph[row][col], settings);
      }
    }
  };

  private drawOneHexagon = (picture, hexagon: GraphCell, settings: P5Settings) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      points.push(this.hexCorner(picture, hexagon.center, i, settings));
    }

    picture.stroke(ColorMapping.hexagonBorder);
    picture.strokeWeight(settings.hexagonLinesBetweenSizePx);
    picture.beginShape();
    for (let i = 0; i <= points.length; i++) {
      picture.fill(ColorMapping.getColorForHexagon(hexagon));
      picture.vertex(points[i % points.length].x, points[i % points.length].y);
    }
    picture.endShape();
  };

  /**
   * Index of points is clockwise and starts with 0 at the bottom right corner of a hexagon
   */
  private hexCorner = (picture: any, center: P5Vector, indexOfPoint: number, settings: P5Settings) => {
    const angleDeg = 60 * indexOfPoint + 30;
    const angleRad = (picture.PI / 180) * angleDeg;
    return picture.createVector(
      center.x + settings.hexagonSizePx * picture.cos(angleRad),
      center.y + settings.hexagonSizePx * picture.sin(angleRad)
    );
  };

  private hexToPixel(picture: any, col: number, row: number, pictureShift: P5Vector, settings: P5Settings): P5Vector {
    const isUnevenRow = row % 2 === 1;
    const x = (picture.sqrt(3) * col + (picture.sqrt(3) / 2) * (isUnevenRow ? 0 : 1)) * settings.hexagonSizePx;
    const y = (3 / 2) * row * settings.hexagonSizePx;
    return picture.createVector(x + pictureShift.x, y + pictureShift.y);
  }
}
