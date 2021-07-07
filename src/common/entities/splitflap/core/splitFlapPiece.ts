import { map } from "src/common/utils/map"
import { chars } from "./settings"

let clockTexture = new Texture("images/splitFlapSprite.jpg")
let clockMaterial = new Material()
let faceWidth = 102
let faceHeight = 71

clockMaterial.albedoTexture = clockTexture
clockMaterial.metallic = 0.5

const convertPxToUV = (x: number, y: number, width: number, height: number, isFlipped?: boolean) : Array<number> => {
    let _x = map(x, 0, 510, 0, 1)
    let _y = map(y, 0, 1278, 0, 1)
    let _width = map(width, 0, 510, 0, 1)
    let _height = map(height, 0, 1278, 0, 1)

    let tr = {x: _x, y: 1-_y }
    let tl = {x: _x+_width, y: 1-_y }
    let bl = {x: _x+_width, y: 1-_y-_height }
    let br = {x: _x, y: 1-_y-_height }

    let uvs = isFlipped ? [
        bl.x,        bl.y,
        br.x,        br.y,
        tr.x,        tr.y,
        tl.x,        tl.y,
    ]:[
        tl.x,        tl.y,
        tr.x,        tr.y,
        br.x,        br.y,
        bl.x,        bl.y,
    ]

    return uvs
}


export class SplitFlapPiece extends Entity {
    private faceEntity: Entity = new Entity()
    private faceShape: PlaneShape = new PlaneShape()
    private uvFront: Array<number> = []
    private uvBack: Array<number> = []
    
    constructor(
        public frontChar: string,
        public backChar: string,
        private isBottom: boolean,
    ){
        super()

        this.faceEntity.setParent(this)
        this.faceEntity.addComponent(this.faceShape)
        this.faceEntity.addComponent(new Transform({
            position: new Vector3(0, isBottom ? -.5 : .5, 0),
            scale: new Vector3(1, 1, 1),
            rotation: new Quaternion().setEuler(0, 0, 180)
        }))
        this.faceEntity.addComponent(clockMaterial)
        
        this.setFrontFace(frontChar)
        this.setBackFace(backChar)
        this.refreshUV()
    }

    hide() {
        this.faceShape.visible = false
    }

    show() {
        this.faceShape.visible = true
    }

    refreshUV() : void {
        this.faceShape.uvs = [...this.uvFront, ...this.uvBack]
    }

    setFaces(frontChar: string, backChar: string){
        this.setFrontFace(frontChar)
        this.setBackFace(backChar)
        this.refreshUV()
    }

    setFrontFace(char: string) : void {
        let index = chars.indexOf(char.toUpperCase())
        let col = index % 5
        let row = Math.floor(index / 5)
        let x = col*faceWidth
        let y = this.isBottom ?  (row*(faceHeight*2))+faceHeight : (row*(faceHeight*2))
        this.uvFront = convertPxToUV(
            x,
            y,
            faceWidth,
            faceHeight,
        )
    }

    setBackFace(char: string) : void {
        let index = chars.indexOf(char.toUpperCase())
        let col = index % 5
        let row = Math.floor(index / 5)
        let x = col*faceWidth
        let y = (row*(faceHeight*2))+71
        this.uvBack = convertPxToUV(
            x,
            y,
            faceWidth,
            faceHeight,
            true
        )
    }

    flip(callback: Function, duration: number = .3) : void {
        countdownClockFlipAnimation.addAnimationToQueue({
            entity: this,
            startRotation: 0,
            endRotation: 179,
            duration,
            callback,
        })
    }
}

interface ICountdownClockFlipAnimationData {
    entity: Entity,
    startRotation: number,
    endRotation: number,
    duration: number,
    callback?: Function,
    timer?: number,
}

export class CountdownClockFlipAnimation implements ISystem {
    private system: ISystem
    private animations: Array<ICountdownClockFlipAnimationData> = []

    constructor(){
        this.system = this
    }

    addAnimationToQueue(animationSettings: ICountdownClockFlipAnimationData){
        animationSettings.timer = 0
        this.animations.push(animationSettings)
        this.enable()
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

    update(dt: number){
        if(this.animations.length){
            this.animations.forEach((animation, index) => {
                if(typeof animation.timer == "number"){
                    animation.timer += dt
                    let transform = animation.entity.getComponent(Transform)
                    if(animation.timer >= animation.duration){
                        this.animations.splice(index, 1)
                        transform.rotation = new Quaternion().setEuler(
                            animation.endRotation,
                            0,
                            0,
                        )
                        if(animation.callback){
                            animation.callback()
                        }
                    } else {
                        transform.rotation = new Quaternion().setEuler(
                            Scalar.Lerp(
                                animation.startRotation,
                                animation.endRotation,
                                easeInSine(animation.timer/animation.duration)),
                            0,
                            0
                        )
                    }
                }
            })
        }else{
            engine.removeSystem(this)
        }
    }
}

const easeInSine = (x: number): number => 1 - Math.cos((x * Math.PI) / 2)
const countdownClockFlipAnimation = new CountdownClockFlipAnimation()