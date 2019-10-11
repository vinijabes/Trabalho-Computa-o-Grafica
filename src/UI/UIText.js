const UIObject = require('./UIObject');
const HTMLObject = require('./UIHTMLObject');

module.exports = class UIText extends UIObject {
    
    /**@type {String} */
    m_Text;

    /**
     * 
     * @param {UIObject} parent 
     */
    constructor(parent, text) {        
        super(parent, document.createElement('div'));
        this.m_Text = text;
    }

    Render(){
        this.m_DomNode.innerHTML = '';

        let p = document.createElement('p');
        p.innerHTML = this.m_Text;
        this.m_DomNode.appendChild(p);
    }

    SetText(newText){
        if(newText != this.m_Text){
            this.m_Text = newText;
            this.Render();
        }
    }

    Update(delta){
    }
}