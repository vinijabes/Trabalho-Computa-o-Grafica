const Vec3 = require('../Mat/Vec3');
const Mat4 = require('../Mat/Mat4');
const UIObject = require('../UI/UIObject');
const UIMenu = require('../UI/UIMenu');
const UIText = require('../UI/UIText');
const UIInput = require('../UI/UIInput');
const UIButton = require('../UI/UIButton');
const UISelect = require('../UI/UISelect');
const UICheckbox = require('../UI/UICheckbox');

class ActionInput extends UIMenu {
    /**@type {UIText} */
    m_Text;

    /**@type {UIInput} */
    m_Input;

    /**@type {UIButton} */
    m_Button;

    constructor(parent, label, buttonText) {
        super(parent);

        this.m_DomNode.style.flexDirection = 'row';

        this.m_Text = new UIText(null, label);
        this.m_Input = new UIInput(null, '');
        this.m_Button = new UIButton(null, buttonText);

        this.m_Input.m_DomNode.style.width = '75%';
        this.m_Button.onClick = () => {
            if (this.onSubmit) this.onSubmit(this.m_Input.Value());
        }

        this.AddChild(this.m_Text);
        this.AddChild(this.m_Input);
        this.AddChild(this.m_Button);
    }

    Reset(){
        this.m_Input.SetValue("");
    }

    onSubmit;
}

module.exports = class TransformationUI extends UIMenu {

    /**@type {UIMenu} */
    m_TranslationMenu;
    /**@type {ActionInput} */
    m_XTranslationInput;
    /**@type {ActionInput} */
    m_YTranslationInput;
    /**@type {ActionInput} */
    m_ZTranslationInput;
    /**@type {UIButton} */
    m_TranslationButton;

    /**@type {UIMenu} */
    m_ScaleMenu;
    /**@type {ActionInput} */
    m_XScaleInput;
    /**@type {ActionInput} */
    m_YScaleInput;
    /**@type {ActionInput} */
    m_ZScaleInput;
    /**@type {ActionInput} */
    m_GlobalScaleInput;
    /**@type {UIButton} */
    m_ScaleButton;

    /**@type {UIMenu} */
    m_RotationMenu;
    /**@type {ActionInput} */
    m_XRotationInput;
    /**@type {ActionInput} */
    m_YRotationInput;
    /**@type {ActionInput} */
    m_ZRotationInput;
    /**@type {UIButton} */
    m_RotationButton;
    /**@type {UICheckbox} */
    m_AxiosCheck;

    /**@type {UIMenu} */
    m_ShearingMenu;
    /**@type {ActionInput} */
    m_ShearXYInput;
    /**@type {ActionInput} */
    m_ShearXZInput;
    /**@type {ActionInput} */
    m_ShearYZInput;
    /**@type {ActionInput} */
    m_ShearYXInput;
    /**@type {ActionInput} */
    m_ShearZXInput;
    /**@type {ActionInput} */
    m_ShearZYInput;
    /**@type {UIButton} */
    m_ShearingButton;;

    /**
     * 
     * @param {UIObject} parent 
     */
    constructor(parent) {
        super(parent);

        /** TRANSLATION MENU */

        this.m_TranslationMenu = new UIMenu(null);
        this.m_XTranslationInput = new ActionInput(null, "X:", "Translate");
        this.m_XTranslationInput.onSubmit = (value) => {
            if (this.m_Parent) {
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Translation(value, 0, 0));
            }
        }

        this.m_YTranslationInput = new ActionInput(null, "Y:", "Translate");
        this.m_YTranslationInput.onSubmit = (value) => {
            if (this.m_Parent) {
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Translation(0, value, 0));
            }
        }

        this.m_ZTranslationInput = new ActionInput(null, "Z:", "Translate");
        this.m_ZTranslationInput.onSubmit = (value) => {
            if (this.m_Parent) {
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Translation(0, 0, value));
            }
        }

        this.m_TranslationButton = new UIButton(null, "Translate");
        this.m_TranslationButton.m_DomNode.style.marginTop = '4px';
        this.m_TranslationButton.onClick = () => {
            let x = this.m_XTranslationInput.GetChildOfType(UIInput).Value();
            let y = this.m_YTranslationInput.GetChildOfType(UIInput).Value();
            let z = this.m_ZTranslationInput.GetChildOfType(UIInput).Value();
            if (this.m_Parent) {
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Translation(x, y, z));
            }
        }


        this.m_TranslationMenu.AddChild(this.m_XTranslationInput);
        this.m_TranslationMenu.AddChild(this.m_YTranslationInput);
        this.m_TranslationMenu.AddChild(this.m_ZTranslationInput);
        this.m_TranslationMenu.AddChild(this.m_TranslationButton);

        this.m_TranslationMenu.m_DomNode.style.marginTop = '8px';
        this.m_TranslationMenu.m_DomNode.style.padding = '8px';
        this.m_TranslationMenu.m_DomNode.style.borderTop = '1px solid black';

        this.AddChild(this.m_TranslationMenu);

        /** ROTATION MENU */

        this.m_RotationMenu = new UIMenu(null);

        this.m_XRotationInput = new ActionInput(null, "X:", "Rotate");
        this.m_XRotationInput.onSubmit = (value) => {
            if (this.m_Parent) {
                let center = this.m_AxiosCheck.Value() ? this.m_Parent.GetChildOfType(UISelect).Value().center() : new Vec3(0, 0, 0);
                
                console.log(this.m_Parent.GetChildOfType(UISelect).Value());
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.RotationX(value, center.x, center.y, center.z));
                console.log(this.m_Parent.GetChildOfType(UISelect).Value());
            }
        }

        this.m_YRotationInput = new ActionInput(null, "Y:", "Rotate");
        this.m_YRotationInput.onSubmit = (value) => {
            if (this.m_Parent) {
                let center = this.m_AxiosCheck.Value() ? this.m_Parent.GetChildOfType(UISelect).Value().center() : new Vec3(0, 0, 0);
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.RotationY(value, center.x, center.y, center.z));
            }
        }

        this.m_ZRotationInput = new ActionInput(null, "Z:", "Rotate");
        this.m_ZRotationInput.onSubmit = (value) => {
            if (this.m_Parent) {
                let center = this.m_AxiosCheck.Value() ? this.m_Parent.GetChildOfType(UISelect).Value().center() : new Vec3(0, 0, 0);
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.RotationZ(value, center.x, center.y, center.z));
            }
        }

        this.m_RotationButton = new UIButton(null, "Rotate");
        this.m_RotationButton.m_DomNode.style.marginTop = '4px';
        this.m_RotationButton.onClick = () => {
            let center = this.m_AxiosCheck.Value() ? this.m_Parent.GetChildOfType(UISelect).Value().center() : new Vec3(0, 0, 0);
            let x = this.m_XRotationInput.GetChildOfType(UIInput).Value();
            let y = this.m_YRotationInput.GetChildOfType(UIInput).Value();
            let z = this.m_ZRotationInput.GetChildOfType(UIInput).Value();
            if (this.m_Parent) {
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.RotationX(x, center.x, center.y, center.z));
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.RotationY(y, center.x, center.y, center.z));
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.RotationZ(z, center.x, center.y, center.z));
            }
        }


        this.m_RotationMenu.AddChild(this.m_XRotationInput);
        this.m_RotationMenu.AddChild(this.m_YRotationInput);
        this.m_RotationMenu.AddChild(this.m_ZRotationInput);
        this.m_RotationMenu.AddChild(this.m_RotationButton);

        this.m_RotationMenu.m_DomNode.style.padding = '8px';
        this.m_RotationMenu.m_DomNode.style.borderTop = '1px solid black';

        let AxiosMenu = new UIMenu(null);
        AxiosMenu.m_DomNode.style.flexDirection = 'row';
        this.m_AxiosCheck = new UICheckbox(null, true);
        this.m_AxiosCheck.m_DomNode.style.margin = 'auto';

        AxiosMenu.AddChild(new UIText(null, "Rotacionar no próprio eixo?"));
        AxiosMenu.AddChild(this.m_AxiosCheck);
        this.m_RotationMenu.AddChild(AxiosMenu);

        this.AddChild(this.m_RotationMenu);

        /** SCALE MENU */
        this.m_ScaleMenu = new UIMenu(null);

        this.m_XScaleInput = new ActionInput(null, "X:", "Scale");
        this.m_XScaleInput.onSubmit = (value) => {
            if (this.m_Parent) {
                let center = this.m_Parent.GetChildOfType(UISelect).Value().center();
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Scale(value, 1, 1, 1));
            }
        }

        this.m_YScaleInput = new ActionInput(null, "Y:", "Scale");
        this.m_YScaleInput.onSubmit = (value) => {
            if (this.m_Parent) {
                let center = this.m_Parent.GetChildOfType(UISelect).Value().center();
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Scale(1, value, 1, 1));
            }
        }

        this.m_ZScaleInput = new ActionInput(null, "Z:", "Scale");
        this.m_ZScaleInput.onSubmit = (value) => {
            if (this.m_Parent) {
                let center = this.m_Parent.GetChildOfType(UISelect).Value().center();
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Scale(1, 1, value, 1));
            }
        }

        this.m_GlobalScaleInput = new ActionInput(null, "Global:", "Scale");
        this.m_GlobalScaleInput.onSubmit = (value) => {
            if (this.m_Parent) {
                let center = this.m_Parent.GetChildOfType(UISelect).Value().center();
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Scale(1, 1, 1, value));
            }
        }

        this.m_ScaleButton = new UIButton(null, "Scale");
        this.m_ScaleButton.m_DomNode.style.marginTop = '4px';
        this.m_ScaleButton.onClick = () => {
            let x = this.m_XScaleInput.GetChildOfType(UIInput).Value() ? this.m_XScaleInput.GetChildOfType(UIInput).Value() : 1;
            let y = this.m_YScaleInput.GetChildOfType(UIInput).Value() ? this.m_YScaleInput.GetChildOfType(UIInput).Value() : 1;
            let z = this.m_ZScaleInput.GetChildOfType(UIInput).Value() ? this.m_ZScaleInput.GetChildOfType(UIInput).Value() : 1;
            let global = this.m_GlobalScaleInput.GetChildOfType(UIInput).Value() ? this.m_GlobalScaleInput.GetChildOfType(UIInput).Value() : 1;
            if (this.m_Parent) {
                let center = this.m_Parent.GetChildOfType(UISelect).Value().center();
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Scale(x, y, z, global));
            }
        }

        this.m_ScaleMenu.AddChild(this.m_XScaleInput);
        this.m_ScaleMenu.AddChild(this.m_YScaleInput);
        this.m_ScaleMenu.AddChild(this.m_ZScaleInput);
        this.m_ScaleMenu.AddChild(this.m_GlobalScaleInput);
        this.m_ScaleMenu.AddChild(this.m_ScaleButton);

        this.m_ScaleMenu.m_DomNode.style.padding = '8px';
        this.m_ScaleMenu.m_DomNode.style.borderTop = '1px solid black';

        this.AddChild(this.m_ScaleMenu);

        /** SHEARING MENU */

        this.m_ShearingMenu = new UIMenu(null);

        this.m_ShearXYInput = new ActionInput(null, "XY:", "Shear");
        this.m_ShearXYInput.onSubmit = (value) => {
            if (this.m_Parent) {
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Shear(value, 0, 0, 0, 0, 0));
            }
        }

        this.m_ShearXZInput = new ActionInput(null, "XZ:", "Shear");
        this.m_ShearXZInput.onSubmit = (value) => {
            if (this.m_Parent) {
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Shear(0, value, 0, 0, 0, 0));
            }
        }

        this.m_ShearYZInput = new ActionInput(null, "YZ:", "Shear");
        this.m_ShearYZInput.onSubmit = (value) => {
            if (this.m_Parent) {
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Shear(0, 0, value, 0, 0, 0));
            }
        }

        this.m_ShearYXInput = new ActionInput(null, "YX:", "Shear");
        this.m_ShearYXInput.onSubmit = (value) => {
            if (this.m_Parent) {
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Shear(0, 0, 0, value, 0, 0));
            }
        }

        this.m_ShearZXInput = new ActionInput(null, "ZX:", "Shear");
        this.m_ShearZXInput.onSubmit = (value) => {
            if (this.m_Parent) {
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Shear(0, 0, 0, 0, value, 0));
            }
        }

        this.m_ShearZYInput = new ActionInput(null, "ZY:", "Shear");
        this.m_ShearZYInput.onSubmit = (value) => {
            if (this.m_Parent) {
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Shear(0, 0, 0, 0, 0, value));
            }
        }

        this.m_ShearingButton = new UIButton(null, "Shear");
        this.m_ShearingButton.m_DomNode.style.marginTop = '4px';
        this.m_ShearingButton.onClick = () => {
            let xy = this.m_ShearXYInput.GetChildOfType(UIInput).Value() ? this.m_ShearXYInput.GetChildOfType(UIInput).Value() : 0;
            let xz = this.m_ShearXZInput.GetChildOfType(UIInput).Value() ? this.m_ShearXZInput.GetChildOfType(UIInput).Value() : 0;
            let yz = this.m_ShearYZInput.GetChildOfType(UIInput).Value() ? this.m_ShearYZInput.GetChildOfType(UIInput).Value() : 0;
            let yx = this.m_ShearYXInput.GetChildOfType(UIInput).Value() ? this.m_ShearYXInput.GetChildOfType(UIInput).Value() : 0;
            let zx = this.m_ShearZXInput.GetChildOfType(UIInput).Value() ? this.m_ShearZXInput.GetChildOfType(UIInput).Value() : 0;
            let zy = this.m_ShearZYInput.GetChildOfType(UIInput).Value() ? this.m_ShearZYInput.GetChildOfType(UIInput).Value() : 0;

            if (this.m_Parent) {
                this.m_Parent.GetChildOfType(UISelect).Value().Transform(Mat4.Shear(xy, xz, yz, yx, zx, zy));
            }
        }


        this.m_ShearingMenu.AddChild(this.m_ShearXYInput);
        this.m_ShearingMenu.AddChild(this.m_ShearXZInput);
        this.m_ShearingMenu.AddChild(this.m_ShearYZInput);
        this.m_ShearingMenu.AddChild(this.m_ShearYXInput);
        this.m_ShearingMenu.AddChild(this.m_ShearZXInput);
        this.m_ShearingMenu.AddChild(this.m_ShearZYInput);
        this.m_ShearingMenu.AddChild(this.m_ShearingButton);

        this.m_ShearingMenu.m_DomNode.style.padding = '8px';
        this.m_ShearingMenu.m_DomNode.style.borderTop = '1px solid black';
        this.m_ShearingMenu.m_DomNode.style.borderBottom = '1px solid black';

        this.AddChild(this.m_ShearingMenu);
    }

    SetParent(parent) {
        super.SetParent(parent);
    }

    Reset(){
        this.m_XTranslationInput.Reset();
        this.m_YTranslationInput.Reset();
        this.m_ZTranslationInput.Reset();

        this.m_XRotationInput.Reset();
        this.m_YRotationInput.Reset();
        this.m_ZRotationInput.Reset();
        
        this.m_XScaleInput.Reset();
        this.m_YScaleInput.Reset();
        this.m_ZScaleInput.Reset();
        this.m_GlobalScaleInput.Reset();

        this.m_ShearXYInput.Reset();
        this.m_ShearXZInput.Reset();
        this.m_ShearYXInput.Reset();
        this.m_ShearZXInput.Reset();
        this.m_ShearYZInput.Reset();
        this.m_ShearZYInput.Reset();
    }
}