module.exports = class InputController{
    static _instance;

    /**@type {Array<boolean>} */ 
    keys = [];

    constructor(){
        if(this._instance) throw new Error("Can't create multiple instances of InputController");
        window.onkeydown = (e) => {
            console.log(document.activeElement.tagName);
            this.keys[e.keyCode] = true;
        }

        window.onkeyup = (e) => {            
            this.keys[e.keyCode] = false;
        }
        
    }

    static Instance() {
        if(!this._instance) this._instance = new InputController();
        return this._instance;
    }

    IsKeyDown(keyCode){
        if(document.activeElement.tagName != 'BODY') return false;
        return this.keys[keyCode] ? this.keys[keyCode] : false;
    }
}