import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as p5 from 'p5';

@Component({
  selector: 'app-graph-controls',
  templateUrl: './graph-controls.component.html',
  styleUrls: ['./graph-controls.component.scss']
})
export class GraphControlsComponent implements OnInit {


  @ViewChild('graph', { static: false }) graph: ElementRef<HTMLCanvasElement>;


  constructor() { }

  ngOnInit(): void {
    const sketch = (s) => {

      s.preload = () => {
        // preload code
      };

      s.setup = () => {
        s.createCanvas(800, 800);
      };

      s.draw = () => {
        s.background(255);
        s.rect(100, 100, 100, 100);
      };
    };

    this.graph.nativeElement = new p5(sketch);
  }

}
