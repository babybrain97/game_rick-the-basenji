
class Bones {

    constructor(CONFIG, x) {

        this.CONFIG = CONFIG;

        //image size axa
        this.imageSize = 45;

        //position
        this.positionX = x;
        this.positionY = -40;

        this.bone = new Image();
        this.bone.src = './gameArt/bone.png';

        this.speed = 2;
        this.angle = 0;

        this.lastUpdateTime = performance.now();
    }

    init() {
        
    }

    update(context){
        // this.positionY = this.positionY + 1 * this.speed;  
        let currentTime = performance.now();
        let deltaTime = (currentTime - this.lastUpdateTime)/1000; 
        let force = 9;   
        this.speed = this.speed + (force * deltaTime);
        this.positionY = this.positionY / 5 + (this.speed * deltaTime);
        this.angle = this.angle + 1;
        // console.log(this.lastUpdateTime);
    }

    render(context){
        context.translate(this.positionX + (this.imageSize/2), this.positionY + (this.imageSize/2)); // <-- start transformation
        context.rotate(this.angle * Math.PI / 180);
        context.drawImage(this.bone, 0, 0, 45, 45);

        context.resetTransform();
    }

    getBoundingBox() {
        return {
          x: this.positionX,
          y: this.positionY,
          width: this.imageSize,
          height: this.imageSize
        }
      }
}

export default Bones;