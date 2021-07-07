import { SplitFlapPiece } from "./splitFlapPiece"
import { chars } from "./settings"

const splitFlipClip = new AudioClip("sounds/splitFlip.mp3")
export const splitFlipSound = new AudioSource(splitFlipClip)

export class SplitFlapCharacter extends Entity {
    public char: string = " "
    private targetChar: string = " "
    private bottomFace = new SplitFlapPiece(" ", "1", true)
    private topFace = new SplitFlapPiece(" ", "1", false)
    private revealFace = new SplitFlapPiece(" ", "1", false)
    private backFace = new SplitFlapBack()
    // public sound: AudioSource = splitFlipSound

    constructor(){
        super()
        this.addComponent(splitFlipSound)
        this.addComponent(new Transform({
            position: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
            rotation: new Quaternion().setEuler(0, 0, 0)
        }))
        engine.addEntity(this)
        this.topFace.setParent(this)
        this.bottomFace.setParent(this)
        this.revealFace.setParent(this)
        this.backFace.setParent(this)
        this.revealFace.hide()
        this.resetFaceRotations()
        splitFlipSound.loop = true
        splitFlipSound.playing = true
        splitFlipSound.playOnce()
    }

    resetFaceRotations(){
        this.topFace.addComponentOrReplace(new Transform({
            rotation: new Quaternion().setEuler(0,0,0)
        }))
        this.bottomFace.addComponentOrReplace(new Transform({
            rotation: new Quaternion().setEuler(0,0,0)
        }))
    }

    afterFlip(char: string, backChar: string){
        this.revealFace.hide()
        this.topFace.setFaces(char, backChar)
        this.bottomFace.setFaces(char, backChar)
        this.revealFace.hide()
        this.resetFaceRotations()
        this.char = char
    }

    setCharacter(char: string, callback?: Function){
        let frontIndex = chars.indexOf(char.toUpperCase())
        let backChar = frontIndex >= chars.length-1 ? chars[0] : chars[frontIndex+1]
        this.topFace.setFaces(this.char, char)
        this.bottomFace.setFaces(this.char, char)
        this.revealFace.setFaces(char, backChar)
        this.revealFace.show()

        this.topFace.flip(() => {
            this.afterFlip(char, backChar)
            if(callback){ callback() }
        })
    }

    flipTo(char: string, callback?: Function, duration: number = .1){
        this.targetChar = char
        let currentIndex = chars.indexOf(this.char.toUpperCase())
        let nextIndex = currentIndex == chars.length-1 ? 0 : currentIndex+1

        this.topFace.setFaces(chars[currentIndex], chars[nextIndex])
        this.bottomFace.setFaces(chars[currentIndex], chars[nextIndex])
        this.revealFace.setFaces(chars[nextIndex], chars[nextIndex])
        this.revealFace.show()
        splitFlipSound.loop = true
        splitFlipSound.playing = true

        this.topFace.flip(() => {
            this.afterFlip(chars[nextIndex], chars[nextIndex])
            if(this.char !== this.targetChar){
                this.flipTo(this.targetChar, callback ? callback : () => {})
            }
            splitFlipSound.loop = false
            splitFlipSound.playing = false
            if(callback){ callback() }
        }, duration)
    }
}

export class SplitFlapBack extends Entity {
    private faceEntity: Entity = new Entity()
    private faceShape: PlaneShape = new PlaneShape()
    private material: Material = new Material()

    constructor(
    ){
        super()

        this.faceEntity.setParent(this)
        this.faceEntity.addComponent(this.faceShape)
        this.faceEntity.addComponent(new Transform({
            position: new Vector3(0, 0, -.01),
            scale: new Vector3(1, 2, 1),
            rotation: new Quaternion().setEuler(0, 0, 180)
        }))
        this.material.albedoColor = Color4.Black()
        this.faceEntity.addComponent(this.material)
    }
}
