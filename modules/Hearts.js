class Hearts {

    constructor(CONFIG, x) {

        this.CONFIG = CONFIG;

        //image size axa
        this.imageSize = 45;

        //position
        this.positionX = x;
        this.positionY = -10;

        //loading the image
        this.heart = new Image();
        this.heart.src = './gameArt/heart-smol.png';

        this.speed = 8;
    }

    update(){
        //updating the position
        this.positionY = this.positionY + 1 * this.speed;        
    }

    render(context){
        context.translate(this.positionX, this.positionY); // <-- start transformation
        context.drawImage(this.heart, 0, 0, 45, 45);
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

export default Hearts;