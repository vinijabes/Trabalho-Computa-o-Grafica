const UIObject = require('./UIObject');

module.exports = class UIButton extends UIObject {

    /**@type {String}*/
    m_Text;

    /**
     * 
     * @param {UIObject} parent 
     */
    constructor(parent, text) {        
        super(parent, document.createElement('button'));
        this.m_Text = text;
        this.m_DomNode.innerHTML = text;

        this.m_DomNode.onclick = () => {
            if(this.onClick) this.onClick();
        }
    }

    SetText(newText){
        if(newText != text){
            this.m_Text = newText;
            this.m_DomNode.innerHTML = newText;
        }
    }

    Render(){
    }

    Update(delta){
    }

    onClick;
}