import {
  Component,
  OnInit,
  AfterContentInit
} from '@angular/core';
import {Http, RequestOptions} from "@angular/http";
import {
  D3Service,
  D3
} from 'd3-ng2-service';

declare var jQuery: any;

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements OnInit, AfterContentInit {

  private d3: D3;
  data_isready: boolean = false;
  data_processing: boolean = false;
  width: number;
  height: number;
  simulation: any;

  myformValues = {
    range_n: 12,
    range_p: 0.1,
    range_c:40
  }

  selectedLayout =
    {
      name: 'large',
      label: 'Large Visualization',
      width: document.body.offsetWidth,
      height: 600,
      phylloRadius: 7,
      pointRadius: 4
    };

  color: any = null;
  svg = null;
  nodes: any = [{'target': 17, 'source': 15}, {'target': 17, 'source': 15}, {'target': 17, 'source': 15}];
  links: any = [];
  link: any = null;
  node: any = null;
  graph: any = null;
  g: any = null;

  constructor(private d3Service: D3Service, private http: Http) {
    this.d3 = d3Service.getD3();
    this.width = document.body.offsetWidth;
    this.height = document.body.offsetHeight - 240;
  }

  ngOnInit() {
    this.data_isready = true;
    this.initGraph();
    this.forceGraph();

      setTimeout(function () {
        jQuery('.ui.dropdown').dropdown();
    }, 1000);

  }

  ngAfterContentInit(): void {

    jQuery('#range_n').range({
      min: 0,
      max: 50,
      start: this.myformValues.range_n,
      labelType: 'letter',
      onChange: (value) => {
        this.myformValues.range_n = value
      }
    });

    jQuery('#range_p').range({
      min: 0.05,
      max: 0.1,
      step: 0.005,
      start: this.myformValues.range_p,
      labelType: 'letter',
      onChange: (value) => {
        this.myformValues.range_p = value
      }
    });

    jQuery('#range_c').range({
      min: 10,
      max: 100,
      step: 1,
      start: this.myformValues.range_c,
      labelType: 'letter',
      onChange: (value) => {
        console.log("onchange");
        this.myformValues.range_c = value
      }
    });
  }

  d3Form(value: any) {

    this.data_processing = false;

    value.range_n = this.myformValues.range_n;
    value.range_p = this.myformValues.range_p;
    value.json_file = 'graph_n.json';

    this.postData(value, '/echo').subscribe(
      response => {
        this.graph = response;
        this.showGraph();

        this.data_processing = true;

      }, error => {
        console.log("通信失敗")
      }
    );
  }

  postData(data, url) {
    let body = JSON.stringify(data);
    let headers: any = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(url, body, options)
      .map(res => {
        return res.json();
      });
  }

  initGraph() {
    this.color = this.d3.scaleOrdinal(this.d3.schemeCategory10);
    this.svg = this.d3.select("#d3-container").append("svg");
    this.svg = this.svg.attr('width', this.width).attr('height', this.height);
    this.g = this.svg.append("g"); //.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
    this.node = this.g.attr("class", "nodes").selectAll("circle");
    this.link = this.g.attr("class", "links").selectAll("line");

    this.simulation =
      this.d3.forceSimulation(this.nodes)
        .force("charge", this.d3.forceManyBody())
        .force("collide", this.d3.forceCollide((d) => {
          return 10
        }).iterations(160))
        .force("link", this.d3.forceLink(this.links).id((d: { id: string, group: number }) => {
          return d.id;
        }))
        .force("center", this.d3.forceCenter(this.width / 2, this.height / 2))
        .force("y", this.d3.forceY(0))
        .force("x", this.d3.forceX(0))
        .on("tick", () => {
          this.link
            .attr("x1", function (d: any) {
              return d.source.x;
            })
            .attr("y1", function (d: any) {
              return d.source.y;
            })
            .attr("x2", function (d: any) {
              return d.target.x;
            })
            .attr("y2", function (d: any) {
              return d.target.y;
            });
          this.node
            .attr("cx", function (d: any) {
              return d.x;
            })
            .attr("cy", function (d: any) {
              return d.y;
            });
        });
  }

  forceGraph() {
    this.http.get("/static/data/graph/graph_n.json").subscribe(
      response => {
        this.graph = response.json();
        this.showGraph();
        this.data_processing = true;
      },
      error => {
        console.log("通信失敗")
      }
    );
  }

  mouseOut(){
    console.log("mouseOut");
  }

  showGraph() {
    this.nodes = this.graph.nodes;
    this.links = this.graph.links;

    this.node = this.node.data(this.nodes);
    this.node.exit().remove();
    this.node = this.node.enter()
      .append("circle")
      .attr("r", 6)
      .attr("fill", (d: any) => {
        return this.color(d.degree);
      }).merge(this.node);

    this.link = this.link.data(this.links);
    this.link.exit().remove();
    this.link = this.link.enter().append("line").attr("stroke", "#ccc").attr("opacity", 0.45).merge(this.link);

    this.simulation.nodes(this.nodes);
    this.simulation.force("link").links(this.links).strength(function(){ return 1.2; });
    this.simulation.force("charge").strength(function() { return -0.8; });
    this.simulation.force("collide", this.d3.forceCollide((d) => {
          return this.myformValues.range_c
        }).iterations(160));
    this.simulation.alpha(1).restart();

    this.svg.selectAll("circle").call(this.d3.drag<SVGCircleElement, any>().on("start", (d) => {
      console.log(this);
      if (!this.d3.event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      d
    })
      .on("drag", (d) => {
        d.fx = this.d3.event.x;
        d.fy = this.d3.event.y;
      })
      .on("end", (d) => {
        if (!this.d3.event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }));
  }

}
