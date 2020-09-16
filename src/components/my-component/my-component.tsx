import { Build, Component, Element, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
  assetsDirs: ['assets']
})
export class MyComponent {
  @Element() el!: HTMLElement;
  private canvasRef!: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  isDown = false;
  nextTime = 0;
  nextN = 0;
  private points = [{"x":20,"y":278},{"x":33,"y":262,"lineWidth":40},{"x":49,"y":253,"lineWidth":40},{"x":66,"y":250,"lineWidth":40},{"x":82,"y":246,"lineWidth":40},{"x":100,"y":245,"lineWidth":40},{"x":116,"y":245,"lineWidth":40},{"x":132,"y":245,"lineWidth":40},{"x":148,"y":244,"lineWidth":40},{"x":164,"y":240,"lineWidth":40},{"x":180,"y":234,"lineWidth":6},{"x":196,"y":219,"lineWidth":6},{"x":212,"y":206,"lineWidth":6},{"x":226,"y":190,"lineWidth":6},{"x":238,"y":174,"lineWidth":6},{"x":248,"y":158,"lineWidth":6},{"x":253,"y":142,"lineWidth":30},{"x":258,"y":126,"lineWidth":30},{"x":264,"y":110,"lineWidth":30},{"x":268,"y":94,"lineWidth":30},{"x":269,"y":78,"lineWidth":30},{"x":252,"y":68,"lineWidth":30},{"x":236,"y":76,"lineWidth":30},{"x":232,"y":92,"lineWidth":30},{"x":223,"y":108,"lineWidth":30},{"x":216,"y":124,"lineWidth":30},{"x":211,"y":140,"lineWidth":30},{"x":207,"y":156,"lineWidth":30},{"x":204,"y":172,"lineWidth":30},{"x":202,"y":188,"lineWidth":30},{"x":201,"y":204,"lineWidth":30},{"x":200,"y":220,"lineWidth":30},{"x":200,"y":236,"lineWidth":30},{"x":200,"y":252,"lineWidth":30},{"x":202,"y":268,"lineWidth":30},{"x":207,"y":284,"lineWidth":30},{"x":223,"y":280,"lineWidth":30},{"x":230,"y":264,"lineWidth":30},{"x":246,"y":250,"lineWidth":30},{"x":261,"y":234,"lineWidth":30},{"x":270,"y":218,"lineWidth":30},{"x":274,"y":202,"lineWidth":30},{"x":276,"y":186,"lineWidth":30},{"x":269,"y":202,"lineWidth":30},{"x":258,"y":220,"lineWidth":30},{"x":257,"y":236,"lineWidth":30},{"x":258,"y":252,"lineWidth":30},{"x":256,"y":268,"lineWidth":30},{"x":256,"y":284,"lineWidth":30},{"x":257,"y":300,"lineWidth":30},{"x":259,"y":316,"lineWidth":30},{"x":260,"y":332,"lineWidth":30},{"x":260,"y":348,"lineWidth":30},{"x":262,"y":364,"lineWidth":30},{"x":265,"y":380,"lineWidth":30},{"x":268,"y":396,"lineWidth":30},{"x":268,"y":380,"lineWidth":30},{"x":266,"y":364,"lineWidth":30},{"x":262,"y":348,"lineWidth":30},{"x":256,"y":332,"lineWidth":30},{"x":251,"y":316,"lineWidth":30},{"x":250,"y":300,"lineWidth":30},{"x":253,"y":284,"lineWidth":30},{"x":260,"y":268,"lineWidth":30},{"x":268,"y":252,"lineWidth":30},{"x":276,"y":236,"lineWidth":30},{"x":288,"y":220,"lineWidth":30},{"x":304,"y":207,"lineWidth":30},{"x":320,"y":195,"lineWidth":30},{"x":329,"y":211,"lineWidth":30},{"x":328,"y":227,"lineWidth":30},{"x":327,"y":243,"lineWidth":30},{"x":320,"y":259,"lineWidth":30},{"x":311,"y":275,"lineWidth":30},{"x":295,"y":288,"lineWidth":30},{"x":288,"y":272,"lineWidth":30},{"x":295,"y":256,"lineWidth":30},{"x":311,"y":247,"lineWidth":30},{"x":327,"y":243,"lineWidth":30},{"x":343,"y":240,"lineWidth":30},{"x":359,"y":239,"lineWidth":30},{"x":375,"y":240,"lineWidth":30},{"x":391,"y":244,"lineWidth":30},{"x":407,"y":251,"lineWidth":30},{"x":423,"y":255,"lineWidth":30},{"x":439,"y":256,"lineWidth":30},{"x":455,"y":256,"lineWidth":30},{"x":471,"y":253,"lineWidth":30},{"x":487,"y":239,"lineWidth":30}, {"x":494,"y":234},{"x":478,"y":240,"lineWidth":40},{"x":462,"y":246,"lineWidth":40},{"x":446,"y":251,"lineWidth":40},{"x":426,"y":258,"lineWidth":40},{"x":408,"y":263,"lineWidth":40},{"x":392,"y":270,"lineWidth":40},{"x":376,"y":278,"lineWidth":40},{"x":360,"y":282,"lineWidth":40},{"x":344,"y":287,"lineWidth":40}];

  @Prop() width? = 512;
  @Prop() height? = 512;
  @Prop() imgUrl? = './build/assets/heart-512.png';

  connectedCallback() {
    if (this.width !== 512 || this.height !== 512) {
      const xDiff = this.width/512;
      const yDiff = this.height/512;
      const lWDiff = (xDiff + yDiff) * 0.5;
      this.points = this.points.map(el => ({
        x: el.x * xDiff, y: el.y * yDiff, lineWidth: el.lineWidth * lWDiff
      }));
    }
    this.waitUntilVisible(this.el, '5px', () => {
      this.beginRedrawing();
    });
  }

  componentDidLoad() {
    this.ctx = this.canvasRef.getContext("2d");
    this.fillCanvasWithWhite();
  }

  fillCanvasWithWhite() {
    var imgData = this.ctx.createImageData(512, 512);
    var i;
    for (i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i+0] = 255;
      imgData.data[i+1] = 255;
      imgData.data[i+2] = 255;
      imgData.data[i+3] = 255;
    }
    this.ctx.putImageData(imgData, 0, 0);
    this.ctx.globalCompositeOperation="destination-out";
  }

  private waitUntilVisible(el: HTMLElement, rootMargin: string, cb: () => void) {
    if (Build.isBrowser && typeof window !== 'undefined' && (window as any).IntersectionObserver) {
      const io = new (window as any).IntersectionObserver((data: IntersectionObserverEntry[]) => {
        if (data[0].isIntersecting) {
          io.disconnect();
          cb();
        }
      }, { rootMargin, threshold: 0.75 });
      io.observe(el);
    } else {
      cb();
    }
  }

  beginRedrawing() {
    this.ctx.lineCap = "round";
    if (this.points.length < 2) {
      return;
    }
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";
    this.ctx.strokeStyle = "red";
    this.nextN = 1;
    requestAnimationFrame(this.redraw);
  }

  redraw = (time) => {
    const duration = 1000/60;
    if (this.nextN > this.points.length - 1) {
      return;
    }
    if (time < this.nextTime) {
      requestAnimationFrame(this.redraw);
      return;
    }
    this.nextTime = time + duration;
    this.lineSegment(this.points[this.nextN - 1], this.points[this.nextN]);
    this.nextN++;
    requestAnimationFrame(this.redraw);
  }

  lineSegment(p0, p1) {
    if (!p0) return;
    if (!p1) return;
    if (p1.lineWidth) {
      this.ctx.lineWidth = p1.lineWidth;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(p0.x, p0.y);
    this.ctx.lineTo(p1.x, p1.y);
    this.ctx.stroke();
  }

  render() {
    return  <Host role="img">
      <canvas
        ref={(el) => this.canvasRef = el}
        id="canvas"
        width={this.width || 512}
        height={this.height || 512}
        style={{
          backgroundImage: `url(${this.imgUrl})`
        }}
      >
      </canvas>
    </Host>;
  }
}
