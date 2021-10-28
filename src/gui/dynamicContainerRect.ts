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
}

/**
 * @public
 */
 export class DynamicContainerRect implements ISystem{
    public rect: UIContainerRect
    public system: ISystem = this
    public animations: DynamicImageAnimations = {}
    public animate: boolean = true
    public defaultSettings: DynamicImageSettings

    constructor(rect: UIContainerRect){
        this.rect = rect
        this.defaultSettings = {
            width: rect.data.width,
            height: rect.data.height,
            positionX: rect.data.positionX,
            positionY: rect.data.positionY,
        }
     }

    enable(){ if(!this.system.active){ engine.addSystem(this.system) }}
    disable(){ if(this.system.active){ engine.removeSystem(this.system) }}
    hide(){ this.rect.visible = false }
    show(){ this.rect.visible = true }

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
                case 'opacity': this.rect.opacity = nextValue; break;
                case 'width': this.rect.width = this.isPercent(from) ? `${nextValue}%`: nextValue; break;
                case 'height': this.rect.height = this.isPercent(from) ? `${nextValue}%`: nextValue; break;
                case 'positionX': this.rect.positionX = this.isPercent(from) ? `${nextValue}%`: nextValue; break;
                case 'positionY': this.rect.positionY = this.isPercent(from) ? `${nextValue}%`: nextValue; break;
            }
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
            this.rect.visible = true
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
                from: this.rect.opacity,
                to: 0,
                duration,
                callback: () => {
                    this.rect.visible = false
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
            this.rect.visible = true
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
            this.rect.visible = true
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
                    this.rect.visible = false
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