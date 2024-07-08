import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Network, DataSet } from 'vis-network';

@Component({
  selector: 'app-force-graph',
  templateUrl: './force-graph.component.html',
  styleUrls: ['./force-graph.component.css']
})
export class ForceGraphComponent implements OnInit, AfterViewInit {
  @ViewChild('network', { static: true }) networkContainer!: ElementRef;

  private nodes = new DataSet([
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' }
  ]);

  private edges = new DataSet([
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
  ]);

  private network: Network | undefined;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const container = this.networkContainer.nativeElement;
    const data = {
      nodes: this.nodes,
      edges: this.edges
    };
    const options = {
      nodes: {
        shape: 'dot',
        size: 16
      },
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08
        },
        maxVelocity: 146,
        solver: 'forceAtlas2Based',
        timestep: 0.35,
        stabilization: { iterations: 150 }
      }
    };
    this.network = new Network(container, data, options);
  }

  exportToSVG(): void {
    const svgElement = this.networkContainer.nativeElement.querySelector('canvas');
    if (!svgElement) {
      console.error('Canvas element not found');
      return;
    }

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    // Add XML namespace if needed
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    // Add xmlns:xlink if needed
    if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    // Add XML declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'graph.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
