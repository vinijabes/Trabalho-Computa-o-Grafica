const UIObject = require('./UIObject');
module.exports = class UIHTMLObject extends UIObject{
    constructor(DOMElement){
        super();
        this.m_DomNode = DOMElement
    }
}