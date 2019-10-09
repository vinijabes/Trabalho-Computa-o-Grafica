module.exports = class VertexArray{

    static AvaType = {
        Vec2: 2,
        Vec3: 3,
        Vec4: 4
    }

    locations = [];

    /**
     * 
     * @param {number} location 
     * @param {VertexArray.AvaType} type 
     * @param {number} offset 
     */
    AddVextexAttrib(location, type, offset){
        this.locations[location] = {type, offset};
    }

    Size(){
        let size = 0;
        for(location of this.locations){
            size += location.type;
        }

        return size;
    }    

    Bind() {}
    Unbind() {}
}