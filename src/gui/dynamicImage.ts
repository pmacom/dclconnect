/**
 * @public
 */
export interface IDynamicAnimationNumber {
    from: number
    to: number
    duration: number
    isPercent?: boolean
}

/**
 * @public
 */
export interface IDynamicAnimationVector2 {
    from: Vector2
    to: Vector2
    duration: number
    isPercent?: boolean
}

/**
 * @public
 */
export class DynamicAnimationNumber {
    timer: number
    constructor(public options: IDynamicAnimationNumber){
        this. timer = 0
    }
}

/**
 * @public
 */
export class DynamicAnimationVector2 {
    timer: number
    constructor(public options: IDynamicAnimationVector2){
        this. timer = 0
    }
}

/**
 * @public
 */
export interface DynamicAnimation {
    opacity?: DynamicAnimationNumber
    size?: DynamicAnimationVector2
    position?: DynamicAnimationVector2
    sourceSize?: DynamicAnimationVector2
    sourcePosition?: DynamicAnimationVector2
}

/**
 * @public
 */
export class DynamicImage implements ISystem{
    public image: UIImage
    public system: ISystem = this
    public animations: DynamicAnimation = {}
    public animate: boolean = true

    constructor(image: UIImage){
        this.image = image
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

    hide(){
        this.image.visible = false
    }

    show(){
        this.image.visible = true
    }

    fadeTo(to: number, duration: number){
        if(this.animate){
            let from = this.image.opacity
            this.animations.opacity = new DynamicAnimationNumber({ from, to, duration })
            this.enable()
        }else{
            this.image.opacity = to
        }
    }

    moveTo(to: Vector2, duration: number, isPercent: boolean = false){
        if(this.animate){
            let { positionX, positionY } = this.image.data
            let from = new Vector2(positionX.value, positionY.value)
            this.animations.position = new DynamicAnimationVector2({ from, to, duration, isPercent })
            this.enable()
        } else {
            this.image.positionX = to.x
            this.image.positionY = to.y
        }
    }

    resizeTo(to: Vector2, duration: number, isPercent: boolean = false){
        if(this.animate){
            let { width, height } = this.image.data
            let from = new Vector2(width.value, height.value)
            this.animations.size = new DynamicAnimationVector2({ from, to, duration, isPercent })
            this.enable()
        } else {
            this.image.width = isPercent ? `${to.x}%` : to.x
            this.image.height = isPercent ? `${to.y}%` : to.y
        }
    }

    moveSourceTo(to: Vector2, duration: number){
        if(this.animate){
            let from = new Vector2(this.image.sourceLeft, this.image.sourceTop)
            this.animations.sourcePosition = new DynamicAnimationVector2({ from, to, duration })
            this.enable()
        } else {
            this.image.sourceLeft = to.x
            this.image.sourceTop = to.y
        }
    }

    resizeSourceTo(to: Vector2, duration: number){
        if(this.animate){
            let from = new Vector2(this.image.sourceWidth, this.image.sourceHeight)
            this.animations.sourceSize = new DynamicAnimationVector2({ from, to, duration })
            this.enable()
        } else {
            this.image.sourceWidth = to.x
            this.image.sourceHeight = to.y
        }
    }

    checkIsAnimating(): boolean {
        return !!Object.keys(this.animations).length
    }

    private handleOpacity(dt: number){
        if(this.animations.opacity){
            const { timer, options } = this.animations.opacity
            if(this.image.opacity == options.to){
                delete this.animations.opacity
            }else{
                let lerpTime =  Scalar.Clamp(timer/options.duration, 0, 1)
                this.image.opacity = Scalar.Lerp(options.from, options.to, lerpTime)
                this.animations.opacity.timer += dt
            }
        }
    }

    private handleSize(dt: number){
        if(this.animations.size){
            const { timer, options } = this.animations.size
            if(
                this.image.data.width.value == options.to.x &&
                this.image.data.height.value == options.to.y
            ){
                delete this.animations.size
            }else{
                let lerpTime = Scalar.Clamp(timer/options.duration, 0, 1)
                let width = Scalar.Lerp(options.from.x, options.to.x, lerpTime)
                let height = Scalar.Lerp(options.from.y, options.to.y, lerpTime)
                this.image.width = options.isPercent ? `${width}%` : width
                this.image.height = options.isPercent ? `${height}%` : height
                this.animations.size.timer += dt
            }
        }
    }

    private handlePosition(dt: number){
        if(this.animations.position){
            const { timer, options } = this.animations.position
            if(
                this.image.data.positionX.value == options.to.x &&
                this.image.data.positionY.value == options.to.y
            ){
                delete this.animations.position
            }else{
                let lerpTime = Scalar.Clamp(timer/options.duration, 0, 1)
                let positionX = Scalar.Lerp(options.from.x, options.to.x, lerpTime)
                let positionY = Scalar.Lerp(options.from.y, options.to.y, lerpTime)
                this.image.positionX = options.isPercent ? `${positionX}%` : positionX
                this.image.positionY = options.isPercent ? `${positionY}%` : positionY
                this.animations.position.timer += dt
            }
        }
    }

    private handleSourceSize(dt: number){
        if(this.animations.sourceSize){
            const { timer, options } = this.animations.sourceSize
            if(
                this.image.sourceWidth == options.to.x &&
                this.image.sourceHeight == options.to.y
            ){
                delete this.animations.sourceSize
            }else{
                let lerpTime = Scalar.Clamp(timer/options.duration, 0, 1)
                this.image.sourceWidth = Scalar.Lerp(options.from.x, options.to.x, lerpTime)
                this.image.sourceHeight = Scalar.Lerp(options.from.y, options.to.y, lerpTime)
                this.animations.sourceSize.timer += dt
            }
        }
    }

    private handleSourcePosition(dt: number){
        if(this.animations.sourcePosition){
            const { timer, options } = this.animations.sourcePosition
            if(
                this.image.sourceLeft == options.to.x &&
                this.image.sourceTop == options.to.y
            ){
                delete this.animations.sourcePosition
            }else{
                let lerpTime = Scalar.Clamp(timer/options.duration, 0, 1)
                this.image.sourceLeft = Scalar.Lerp(options.from.x, options.to.x, lerpTime)
                this.image.sourceTop = Scalar.Lerp(options.from.y, options.to.y, lerpTime)
                this.animations.sourcePosition.timer += dt
            }
        }
    }

    update(dt: number){
        if(this.checkIsAnimating()){
            if(this.animations.opacity){        this.handleOpacity(dt) }
            if(this.animations.size){           this.handleSize(dt) }
            if(this.animations.position){       this.handlePosition(dt) }
            if(this.animations.sourceSize){     this.handleSourceSize(dt) }
            if(this.animations.sourcePosition){ this.handleSourcePosition(dt) }
        }else{
            this.disable()
        }
    }
}
