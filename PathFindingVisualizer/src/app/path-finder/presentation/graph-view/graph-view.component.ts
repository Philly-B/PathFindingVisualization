import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import * as p5 from 'p5';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss']
})
export class GraphViewComponent implements OnInit {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2) { }

  ngOnInit(): void {

    const size = 450;

    const graph = new p5(p => {
      let x = 100;
      let y = 100;

      p.setup = () => {
        p.createCanvas(size, size);
      };

      p.draw = () => {
        p.background(0);
        p.fill(255);
        p.rect(x, y, 50, 50);
      };
    }, this.el.nativeElement);
  }

}
