class MoveController {
    constructor() {
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.jumping = false;
        this.disparando = false;
    }

    /**
     * @public
     */
    reset(){
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.jumping = false;
        this.disparando = false;
    }
}

export default MoveController;