import { Wait } from '../common/utils/wait'

/**
 * @public
 */
 export interface IDynamicImage2AnimationSettings {
    from: UIValue | number
    to: UIValue | number
    duration: number
    ease?: (n: number) => number
    callback?: () => void
}

/**
 * @public
 */
 export class DynamicImageAnimation {
    timer: number
    constructor(public options: IDynamicImage2AnimationSettings){
        this. timer = 0
    }
}

/**
 * @public
 */
export interface DynamicImageAnimations {
    [key:string]: DynamicImageAnimation
}

/**
 * @public
 */
 export interface DynamicImageSettings {
    width: UIValue
    height: UIValue
    positionX: UIValue
    positionY: UIValue
    sourceHeight?: number
    sourceWidth?: number
    sourceTop?: number
    sourceLeft?: number
}

/**
 * @public
 */
 export class DynamicImage2 implements ISystem{
    public image: UIImage
    public system: ISystem = this
    public animations: DynamicImageAnimations = {}
    public animate: boolean = true
    public defaultSettings: DynamicImageSettings

    constructor(image: UIImage){
        this.image = image
        this.defaultSettings = {
            width: image.data.width,
            height: image.data.height,
            positionX: image.data.positionX,
            positionY: image.data.positionY,
            sourceHeight: image.data.sourceHeight,
            sourceWidth: image.data.sourceWidth,
            sourceTop: image.data.sourceTop,
            sourceLeft: image.data.sourceLeft,
        }
     }

    enable(){ if(!this.system.active){ engine.addSystem(this.system) }}
    disable(){ if(this.system.active){ engine.removeSystem(this.system) }}
    hide(){ this.image.visible = false }
    show(){ this.image.visible = true }

    checkIsAnimating(): boolean {
        return !!Object.keys(this.animations).length
    }
    
    update(dt: number){
        if(this.checkIsAnimating()){
            const attributes = Object.keys(this.animations)
            attributes.forEach(attribute => {
                this.handleChange(attribute, dt)
            })
        }else{
            this.disable()
        }
    }

    handleChange(name: string, dt: number){
        if(this.animations[name]){
            const { timer, options } = this.animations[name]
            const { from, to, duration, ease, callback } = options
            let lerpTime = Scalar.Clamp(timer/duration, 0, 1)
            let easeValue = ease ? ease(lerpTime) : lerpTime
            let current = this.getValue(from)
            let destination = this.getValue(to)
            let nextValue = Scalar.Lerp(current, destination, easeValue)
            switch(name){
                case 'opacity': this.image.opacity = nextValue; break;
                case 'width': this.image.width = this.isPercent(from) ? `${nextValue}%`: nextValue; break;
                case 'height': this.image.height = this.isPercent(from) ? `${nextValue}%`: nextValue; break;
                case 'positionX': this.image.positionX = this.isPercent(from) ? `${nextValue}%`: nextValue; break;
                case 'positionY': this.image.positionY = this.isPercent(from) ? `${nextValue}%`: nextValue; break;
                case 'sourceHeight': this.image.sourceHeight = nextValue; break;
                case 'sourceWidth': this.image.sourceWidth = nextValue; break;
                case 'sourceTop': this.image.sourceTop = nextValue; break;
                case 'sourceLeft': this.image.sourceLeft = nextValue; break;
            }
            log('nextValue', this.image.opacity)
            if(lerpTime == 1){
                if(callback){ callback() }
                delete this.animations[name]
                return
            }
            this.animations[name].timer += dt
        }
    }

    fadeIn(duration: number, ease?: (n: number) => number, callback?: () => void, delay?: number ){
        let animate = () => {
            this.image.visible = true
            let options = {
                from: 0,
                to: 1,
                duration,
                callback,
                ease,
            }
            this.animations.opacity = new DynamicImageAnimation(options)
            this.enable()
        }
        if(delay){
            new Wait(() => animate(), delay)
        } else {
            animate()
        }
    }

    fadeOut(duration: number, ease?: (n: number) => number, callback?: () => void, delay?: number ){
        let animate = () => {
            let options = {
                from: this.image.opacity,
                to: 0,
                duration,
                callback: () => {
                    this.image.visible = false
                    if(callback){ callback() }
                },
                ease,
            }
            this.animations.opacity = new DynamicImageAnimation(options)
            this.enable()
        }
        if(delay){
            new Wait(() => animate(), delay)
        } else {
            animate()
        }
    }

    scaleIn(duration: number, ease?: (n: number) => number, callback?: () => void, delay?: number ){
        let animate = () => {
            log(new UIValue(this.defaultSettings.height.type == UIValueType.PERCENT ? '0%' : 0))
            this.image.visible = true
            this.animations.width = new DynamicImageAnimation({
                from: new UIValue(this.defaultSettings.height.type == UIValueType.PERCENT ? '0%' : 0),
                to: this.defaultSettings.width,
                duration,
                callback,
                ease,
            })
            this.animations.height = new DynamicImageAnimation({
                from: new UIValue(this.defaultSettings.height.type == UIValueType.PERCENT ? '0%' : 0),
                to: this.defaultSettings.height,
                duration,
                callback,
                ease,
            })
            this.enable()
        }
        if(delay){
            new Wait(() => animate(), delay)
        } else {
            animate()
        }
    }

    scaleOut(duration: number, ease?: (n: number) => number, callback?: () => void, delay?: number ){
        let animate = () => {
            this.image.visible = true
            this.animations.width = new DynamicImageAnimation({
                from: this.defaultSettings.width,
                to: 0,
                duration,
                callback,
                ease,
            })
            this.animations.height = new DynamicImageAnimation({
                from: this.defaultSettings.height,
                to: 0,
                duration,
                callback: () => {
                    this.image.visible = false
                    if(callback){ callback() }
                },
                ease,
            })
            this.enable()
        }
        if(delay){
            new Wait(() => animate(), delay)
        } else {
            animate()
        }
    }

    getValue(value: UIValue | number) : number {
        return value instanceof UIValue ? value.value : value as number
    }

    isPercent(value: any) : boolean{
        return value instanceof UIValue ? value.type == UIValueType.PERCENT : false
    }
 }