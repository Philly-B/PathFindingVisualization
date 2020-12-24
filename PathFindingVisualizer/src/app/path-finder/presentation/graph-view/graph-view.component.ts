import { Component, ElementRef, OnInit, Renderer2 } from "@angular/core";
import * as p5 from "p5";
import * as ColorMapping from "src/app/constants/ColorMapping";
import { Graph } from "../../model/Graph";

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

  private graph;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.N = Math.floor(this.canvasSizePx / (this.hexagonSizePx * 1.8));

    this.graph = new Graph();
    this.initGraph();
  }

  initGraph() {
    this.graph.graph = [this.N][this.N];
  }

  ngOnInit(): void {
    const graph = new p5(this.graphDefinition, this.el.nativeElement);
  }

  private graphDefinition = (picture) => {
    picture.setup = () => {
      picture.createCanvas(this.canvasSizePx, this.canvasSizePx);
      picture.angleMode(picture.RADIANS);
    };
    picture.draw = () => {
      picture.background(ColorMapping.background);
      this.drawHexagons(picture);
    };
  };

  private drawHexagons = (picture) => {
    const pictureShift = {
      x: this.hexagonSizePx * 1.8,
      y: this.hexagonSizePx * 3,
      z: 0,
    };

    for (let row = 0; row < this.N; row++) {
      const startForRow = row % 2 === 1 ? 1 : 0;
      for (let col = startForRow; col < this.N - 1; col++) {
        this.drawOneHexagon(
          picture,
          this.hex_to_pixel(picture, col, row, pictureShift)
        );
      }
    }
  };

  private drawOneHexagon = (
    picture,
    centerOfHexagonPx: { x: number; y: number }
  ) => {
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

  private hexCorner = (picture: any, center, i) => {
    const angleDeg = 60 * i + 30;
    const angleRad = (picture.PI / 180) * angleDeg;
    return picture.createVector(
      center.x + this.hexagonSizePx * picture.cos(angleRad),
      center.y + this.hexagonSizePx * picture.sin(angleRad)
    );
  };

  private pixel_to_hex(picture, x, y) {
    const q = ((x * picture.sqrt(3)) / 3 - y / 3) / this.hexagonSizePx;
    const r = (-x / 3 + (picture.sqrt(3) / 3) * y) / this.hexagonSizePx;
    return picture.createVector(picture.round(q), picture.round(r));
  }

  private hex_to_pixel(
    picture: any,
    col: number,
    row: number,
    pictureShift: { x: number; y: number; z: number }
  ): { x: number; y: number; z: number } {
    const isUnevenRow = row % 2 === 1;
    const x =
      (picture.sqrt(3) * col + (picture.sqrt(3) / 2) * (isUnevenRow ? 0 : 1)) *
      this.hexagonSizePx;
    const y = (3 / 2) * row * this.hexagonSizePx;
    return picture.createVector(x + pictureShift.x, y + pictureShift.y);
  }
}
