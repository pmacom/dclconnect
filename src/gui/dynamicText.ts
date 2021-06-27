/**
 * @public
 */
export interface IDynamicTextAnimationNumber {
    from: number
    to: number
    duration: number
}

/**
 * @public
 */
export interface IDynamicTextAnimationVector2 {
    from: Vector2
    to: Vector2
    duration: number
}

/**
 * @public
 */
export class DynamicTextAnimationNumber {
    timer: number
    constructor(public options: IDynamicTextAnimationNumber){
        this. timer = 0
    }
}

/**
 * @public
 */
export class DynamicTextAnimationVector2 {
    timer: number
    constructor(public options: IDynamicTextAnimationVector2){
        this. timer = 0
    }
}

/**
 * @public
 */
export interface DynamicTextAnimation {
    opacity?: DynamicTextAnimationNumber
    size?: DynamicTextAnimationVector2
    position?: DynamicTextAnimationVector2
}

/**
 * @public
 */
export class DynamicText implements ISystem{
    public text: UIText
    public system: ISystem = this
    public animations: DynamicTextAnimation = {}

    constructor(text: UIText){
        this.text = text
    }

    setText(text: string){
        this.text.value = text
    }

    enable(){
        if(!this.system.active){
            engine.addSystem(this.system)
        }
    }

    disable(){
        if(this.system.active){
            engine.removeSystem(this.system)
        }
    }

    fadeTo(to: number, duration: number){
        let from = this.text.opacity
        this.animations.opacity = new DynamicTextAnimationNumber({ from, to, duration })
        this.enable()
    }

    moveTo(to: Vector2, duration: number){
        let { positionX, positionY } = this.text.data
        let from = new Vector2(positionX.value, positionY.value)
        this.animations.position = new DynamicTextAnimationVector2({ from, to, duration })
        this.enable()
    }

    resizeTo(to: Vector2, duration: number){
        let { width, height } = this.text.data
        let from = new Vector2(width.value, height.value)
        this.animations.size = new DynamicTextAnimationVector2({ from, to, duration })
        this.enable()
    }

    resizeTextTo(to: Vector2, duration: number){
        let { width, height } = this.text.data
        this.text.adaptWidth = true
        this.text.fontAutoSize = true
        let from = new Vector2(width.value, height.value)
        this.animations.size = new DynamicTextAnimationVector2({ from, to, duration })
        this.enable()
    }

    checkIsAnimating(): boolean {
        return !!Object.keys(this.animations).length
    }

    private handleOpacity(dt: number){
        if(this.animations.opacity){
            const { timer, options } = this.animations.opacity
            if(this.text.opacity == options.to){
                delete this.animations.opacity
            }else{
                let lerpTime =  Scalar.Clamp(timer/options.duration, 0, 1)
                this.text.opacity = Scalar.Lerp(options.from, options.to, lerpTime)
                this.animations.opacity.timer += dt
            }
        }
    }

    private handleSize(dt: number){
        if(this.animations.size){
            const { timer, options } = this.animations.size
            if(
                this.text.data.width.value == options.to.x &&
                this.text.data.height.value == options.to.y
            ){
                delete this.animations.size
            }else{
                let lerpTime = Scalar.Clamp(timer/options.duration, 0, 1)
                this.text.width = Scalar.Lerp(options.from.x, options.to.x, lerpTime)
                this.text.height = Scalar.Lerp(options.from.y, options.to.y, lerpTime)
                this.animations.size.timer += dt
            }
        }
    }

    private handlePosition(dt: number){
        if(this.animations.position){
            const { timer, options } = this.animations.position
            if(
                this.text.positionX == options.to.x &&
                this.text.positionY == options.to.y
            ){
                delete this.animations.position
            }else{
                let lerpTime = Scalar.Clamp(timer/options.duration, 0, 1)
                this.text.positionX = Scalar.Lerp(options.from.x, options.to.x, lerpTime)
                this.text.positionY = Scalar.Lerp(options.from.y, options.to.y, lerpTime)
                this.animations.position.timer += dt
            }
        }
    }

    update(dt: number){
        if(this.checkIsAnimating()){
            if(this.animations.opacity){        this.handleOpacity(dt) }
            if(this.animations.size){           this.handleSize(dt) }
            if(this.animations.position){       this.handlePosition(dt) }
        }else{
            this.disable()
        }
    }
}
