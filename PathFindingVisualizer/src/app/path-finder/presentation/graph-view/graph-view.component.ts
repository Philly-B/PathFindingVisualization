import { Component, ElementRef, OnInit, Renderer2 } from "@angular/core";
import * as p5 from "p5";
import * as ColorMapping from "src/app/constants/ColorMapping";
import { P5MouseClickEvent } from "src/app/p5jModels/P5MouseClickEvent";
import { P5Vector } from "src/app/p5jModels/P5Vector";
import { Graph } from "../../model/Graph";
import { Hexagon } from "../../model/Hexagon";
import { RowColumnPair } from "../../model/RowColumnPair";

@Component({
  selector: "app-graph-view",
  templateUrl: "./graph-view.component.html",
  styleUrls: ["./graph-view.component.scss"],
})
export class GraphViewComponent implements OnInit {
  private canvasSizePx = 450;
  private hexagonSizePx = 15;
  private hexagonLinesBetweenSizePx = 3;

  private N: number;

  private hexGrid: Graph;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.N = Math.floor(this.canvasSizePx / (this.hexagonSizePx * 1.8));

    this.hexGrid = new Graph();
    this.initGraph();
  }

  initGraph() {
    this.hexGrid.graph = [];
    for (let row = 0; row < this.N; row++) {
      const currRow = [];
      for (let col = 0; col < this.N; col++) {
        currRow.push(new Hexagon(undefined, row, col));
      }
      this.hexGrid.graph.push(currRow);
    }
  }

  ngOnInit(): void {
    const graph = new p5(this.graphDefinition, this.el.nativeElement);
  }

  private graphDefinition = (picture) => {
    const pictureShift: P5Vector = {
      x: this.hexagonSizePx * 1.8,
      y: this.hexagonSizePx * 3,
      z: 0,
    };

    picture.setup = () => {
      picture.createCanvas(this.canvasSizePx, this.canvasSizePx);
      picture.angleMode(picture.RADIANS);
    };
    picture.draw = () => {
      picture.background(ColorMapping.background);
      this.drawHexagons(picture, pictureShift);
    };

    picture.mouseClicked = (event: P5MouseClickEvent) => {
      console.log(this.pixelToHex(picture, event.clientX, event.clientY));
    };
  };

  private drawHexagons = (picture, pictureShift: P5Vector): void => {
    for (let row = 0; row < this.N; row++) {
      const startForRow = row % 2 === 1 ? 1 : 0;
      for (let col = startForRow; col < this.N - 1; col++) {
        const centerOfHexagonPx = this.hexToPixel(
          picture,
          col,
          row,
          pictureShift
        );
        this.hexGrid.graph[row][col].center = centerOfHexagonPx;
        this.drawOneHexagon(picture, centerOfHexagonPx);
      }
    }
  };

  private drawOneHexagon = (picture, centerOfHexagonPx: P5Vector) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      points.push(this.hexCorner(picture, centerOfHexagonPx, i));
    }

    picture.stroke(ColorMapping.hexagonBorder);
    picture.strokeWeight(this.hexagonLinesBetweenSizePx);
    picture.beginShape();
    for (let i = 0; i <= points.length; i++) {
      picture.fill(ColorMapping.hexagonInside);
      picture.vertex(points[i % points.length].x, points[i % points.length].y);
    }
    picture.endShape();
  };

  /**
   * Index of points is clockwise and starts with 0 at the bottom right corner of a hexagon
   */
  private hexCorner = (
    picture: any,
    center: P5Vector,
    indexOfPoint: number
  ) => {
    const angleDeg = 60 * indexOfPoint + 30;
    const angleRad = (picture.PI / 180) * angleDeg;
    return picture.createVector(
      center.x + this.hexagonSizePx * picture.cos(angleRad),
      center.y + this.hexagonSizePx * picture.sin(angleRad)
    );
  };

  private pixelToHex(picture, x: number, y: number): Hexagon {
    for (let row = 0; row < this.N; row++) {
      const startForRow = row % 2 === 1 ? 1 : 0;
      for (let col = startForRow; col < this.N - 1; col++) {
        const currHex = this.hexGrid.graph[row][col];
        const dist = picture.sqrt(
          picture.pow(x - currHex.center.x, 2) +
            picture.pow(y - currHex.center.y, 2)
        );
        if (dist <= this.hexToPixel) {
          return currHex;
        }
      }
    }

    return undefined;
  }

  private hexToPixel(
    picture: any,
    col: number,
    row: number,
    pictureShift: P5Vector
  ): P5Vector {
    const isUnevenRow = row % 2 === 1;
    const x =
      (picture.sqrt(3) * col + (picture.sqrt(3) / 2) * (isUnevenRow ? 0 : 1)) *
      this.hexagonSizePx;
    const y = (3 / 2) * row * this.hexagonSizePx;
    return picture.createVector(x + pictureShift.x, y + pictureShift.y);
  }
}
