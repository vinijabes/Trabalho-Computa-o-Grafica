const GameObject = require('../src/Ava').Engine.GameObject;
const PixelRenderer = require('../src/Ava').Engine.Components.PixelRenderer;
const { Vec3, Vec4 } = require('../src/Ava').Math;
const CanvasAPI = require('../src/Ava').Canvas.CanvasApi;

class SeedFill extends GameObject {
    constructor() {
        super("SeedFill");

        this.m_PixelRenderer = this.AddComponent(PixelRenderer);
        this.pixels = new Array(200);
        for (let p = 0; p < this.pixels.length; p++) {
            this.pixels[p] = new Array(200).fill(0);
        }

        this.CreateSurface();
        //this.Fill(100, 100);
        //this.Fill(3, 3, true);
        this.Transform.Translate(new Vec3(-200, -200, 0));
    }

    Update(delta) {
        super.Update();
        this.DrawPixels();
    }

    CreateSurface() {
        for (let i = 0; i < 100; i++) {
            this.pixels[0][i] = new Vec4(1, 1, 1, 1);
            this.pixels[98][i + 100] = new Vec4(1, 1, 1, 1);
            this.pixels[199][i + 100] = new Vec4(1, 1, 1, 1);
        }

        for (let i = 0; i < 100; i++) {
            this.pixels[i][0] = new Vec4(1, 1, 1, 1);
            this.pixels[i + 100][98] = new Vec4(1, 1, 1, 1);
            this.pixels[i + 100][199] = new Vec4(1, 1, 1, 1);
        }

        for (let i = 0; i < 99; i++) {
            this.pixels[i][99] = new Vec4(1, 1, 1, 1);
            this.pixels[99][i] = new Vec4(1, 1, 1, 1);
        }
    }

    DrawPixels() {
        let pixels = [];
        let index = [];
        for (let i = 0; i < this.pixels.length; i++) {
            for (let j = 0; j < this.pixels[i].length; j++) {
                if(this.pixels[i][j] != 0){
                    pixels.push(i, j, 0, this.pixels[i][j].x, this.pixels[i][j].y, this.pixels[i][j].z, this.pixels[i][j].w, 0, 1, 0);
                    index.push(index.length);
                }
            }
        }

        this.m_PixelRenderer.m_Mesh.Index = index;
        this.m_PixelRenderer.m_Mesh.Vertex = pixels;
    }

    Fill(x, y, diagonals = false) {
        let queue = [];
        queue.push({ x, y });

        while (queue.length) {
            let current = queue.shift();
            if (current.x >= 200 || current.x < 0 || current.y >= 200 || current.y < 0) continue;

            let pixel = this.pixels[current.y][current.x];
            if (pixel == 0) {
                this.pixels[current.y][current.x] = new Vec4(1, 1, 1, 1);
                queue.push({ x: current.x + 1, y: current.y });
                queue.push({ x: current.x - 1, y: current.y });
                queue.push({ x: current.x, y: current.y + 1 });
                queue.push({ x: current.x, y: current.y - 1 });

                if (diagonals) {
                    queue.push({ x: current.x + 1, y: current.y + 1 });
                    queue.push({ x: current.x + 1, y: current.y - 1 });
                    queue.push({ x: current.x - 1, y: current.y + 1 });
                    queue.push({ x: current.x - 1, y: current.y - 1 });
                }
            }
        }
    }
}

module.exports = SeedFill;