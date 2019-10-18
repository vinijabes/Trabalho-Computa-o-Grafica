const MeshRenderer = require('./GameObject/Components/MeshRenderer');

module.exports = class Renderer {

    /**@type {Array<MeshRenderer>} */
    static s_renderQueue = [];

    /**
     * 
     * @param {MeshRenderer} renderer 
     */
    static Submit(renderer) {
        this.s_renderQueue.push(renderer);
    }

    static Flush() {
        for(let renderer of this.s_renderQueue){
            renderer.Render();
        }

        this.s_renderQueue = [];
    }
}