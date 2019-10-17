const UIObject = require('./UIObject');

module.exports = class UICheckbox extends UIObject {
    
    /**@type {String} */
    m_Value;

    /**
     * 
     * @param {UIObject} parent 
     */
    constructor(parent, checked) {        
        super(parent, document.createElement('input'));
        this.m_DomNode.type = 'checkbox';
        this.m_DomNode.checked = checked;
    }

    Render(){
    }

    SetValue(newValue){
        this.m_DomNode.checked = newValue;
    }

    Update(delta){
    }

    Value(){
        return this.m_DomNode.checked;
    }
}