class Dog {

    //constructor, passing in CONFIG
    constructor(CONFIG) {
        this.CONFIG = CONFIG;

        //frame size
        this.frameWidth = 170;
        this.frameHeight = 118;

        //starting position
        this.positionX = this.CONFIG.width / 2;
        this.positionY = this.CONFIG.height - this.frameWidth;

        //player speed
        this.speed = 6;

        //movement on the X axis, value changes to -+1
        this.movementX = 0;
        //pressed keys array
        this.pressedAtm = [];
        this.lastLeft = false;

        //ticks counter: displaying sprites
        this.ticks = 0;

        this.spriteSheetData = {
            walk: {
                size: {
                    w: 1360,
                    h: 118,
                },
                fpt: 0.2,
                framesTotal: 8,
            },

            idle: {
                size: {
                    w: 850,
                    h: 118,
                },
                fpt: 0.02,
                framesTotal: 5,
            },

        }

        //rendering
        this.lastRenderedTime = performance.now();

        //calling INIT
        this.init();
    }



    //initialising
    init() {

        //loading spritesheets/images
        this.basenji = new Image();
        this.basenji.src = './gameArt/walk_spritesheet.png';

        this.basenjiIdle = new Image();
        this.basenjiIdle.src = './gameArt/idle_spritesheet.png';

        //listening to pressed keys
        document.addEventListener('keydown', (event) => {
            this.pressedAtm[event.code] = true;
        });

        //nothing is pressed
        document.addEventListener('keyup', (event) => {
            this.pressedAtm[event.code] = false;
        });
    }

    //updating
    update() {
        //movement based on the pressed keys
        this.pressedAtm['ArrowRight'] ? (this.movementX = +1, this.lastLeft = false) :
            this.pressedAtm['ArrowLeft'] ? (this.movementX = -1, this.lastLeft = true) :
            this.movementX = 0

        console.log(this.pressedAtm);

        if (this.pressedAtm['Space'] && this.pressedAtm['ArrowRight'] || this.pressedAtm['Space'] && this.pressedAtm['ArrowLeft']) {
            this.speed = 10;
            this.spriteSheetData.fpt = 0.5
        } else {
            this.speed = 6;
            this.spriteSheetData.fpt = 0.2
        }

        this.positionX = this.positionX + this.movementX * this.speed;

        //borders
        if (this.positionX < 0) {
            this.positionX = 0;
        } else if (this.positionX > this.CONFIG.width - this.frameWidth) {
            this.positionX = this.CONFIG.width - this.frameWidth;
        }

    }

    //rendering
    render(context) {
        let spriteCoordinates;
        //drawing sprites
        if (this.movementX == 0) {
            this.image = this.basenjiIdle;
            spriteCoordinates = this.getCoordinates(this.spriteSheetData.idle.fpt, this.spriteSheetData.idle.framesTotal);

            if (this.lastLeft) {
                context.drawImage(
                    this.image,
                    spriteCoordinates.sourceX, //sourceX
                    spriteCoordinates.sourceY, //sourceY
                    spriteCoordinates.sourceW, //sourceWidth
                    spriteCoordinates.sourceH, //sourceHeight
                    spriteCoordinates.destinationX, //destinationX
                    spriteCoordinates.destinationY, //destinationY
                    spriteCoordinates.destinationW, //destinationWidth
                    spriteCoordinates.destinationH, //destinationHeight
                );

            } else {
                context.save();
                context.translate(this.CONFIG.width, 1);
                context.scale(-1, 1);

                context.drawImage(
                    spriteCoordinates.image,
                    spriteCoordinates.sourceX, //sourceX
                    spriteCoordinates.sourceY, //sourceY
                    spriteCoordinates.sourceW, //sourceWidth
                    spriteCoordinates.sourceH, //sourceHeight
                    -this.positionX + this.CONFIG.width - this.frameWidth, //destinationX
                    spriteCoordinates.destinationY, //destinationY
                    spriteCoordinates.destinationW, //destinationWidth
                    spriteCoordinates.destinationH, //destinationHeight
                );

                context.restore();
            }

        } else if (this.movementX == 1) {

            spriteCoordinates = this.getCoordinates(this.spriteSheetData.walk.fpt, this.spriteSheetData.walk.framesTotal);
            this.image = this.basenji;
            context.save();
            context.translate(this.CONFIG.width, 1);
            context.scale(-1, 1);

            context.drawImage(
                spriteCoordinates.image,
                spriteCoordinates.sourceX, //sourceX
                spriteCoordinates.sourceY, //sourceY
                spriteCoordinates.sourceW, //sourceWidth
                spriteCoordinates.sourceH, //sourceHeight
                -this.positionX + this.CONFIG.width - this.frameWidth, //destinationX
                spriteCoordinates.destinationY, //destinationY
                spriteCoordinates.destinationW, //destinationWidth
                spriteCoordinates.destinationH, //destinationHeight
            );

            context.restore();
        } else {
            spriteCoordinates = this.getCoordinates(this.spriteSheetData.walk.fpt, this.spriteSheetData.walk.framesTotal);

            this.image = this.basenji;
            context.drawImage(
                spriteCoordinates.image,
                spriteCoordinates.sourceX, //sourceX
                spriteCoordinates.sourceY, //sourceY
                spriteCoordinates.sourceW, //sourceWidth
                spriteCoordinates.sourceH, //sourceHeight
                spriteCoordinates.destinationX, //destinationX
                spriteCoordinates.destinationY, //destinationY
                spriteCoordinates.destinationW, //destinationWidth
                spriteCoordinates.destinationH, //destinationHeight
            );
        }
        this.ticks++;

    }

    getCoordinates = (framePerTick, framesTotal) => {
        this.framesTotal = framesTotal;
        this.currentFpt = framePerTick;

        let frameX = Math.floor(this.ticks * this.currentFpt % this.framesTotal);
        let frameWidth = 170;

        let coordinates = {
            image: this.image,
            sourceX: frameWidth * frameX,
            sourceY: 0,
            sourceW: this.frameWidth, //sourceWidth
            sourceH: this.frameHeight, //sourceHeight
            destinationX: this.positionX, //destinationX
            destinationY: this.positionY, //destinationY
            destinationW: this.frameWidth, //destinationWidth
            destinationH: this.frameHeight, //destinationHeight
        }

        return coordinates
    }

    getBoundingBox() {
        return {
            x: this.positionX,
            y: this.positionY,
            width: this.frameWidth,
            height: this.frameHeight - 50,
        }
    }

}

export default Dog;