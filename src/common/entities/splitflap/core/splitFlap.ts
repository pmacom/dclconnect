
import { chars } from "./settings"
import { SplitFlapCharacter } from "./splitFlapCharacter"

/**
 * Dynamic and fun 3d text display
 * @public
 */
export class SplitFlap extends Entity {
    private scale = .5
    private chars: Array<SplitFlapCharacter> = []

    constructor(
        /**
         * Total length of the display area. Currently it's not adjustable after initial set
         */
        private length: number = 10,
        /**
         * Initial text
         */
        private text: string = ""
    ) {
        super()

        this.addComponent(new Transform({
            position: new Vector3(),
            scale: new Vector3(
                this.scale,
                this.scale,
                this.scale
            )
        }))

        for(let i=0; i<length; i++){
            let ccc = new SplitFlapCharacter()
            ccc.getComponent(Transform).position = new Vector3(i*-1, 1, 1)
            ccc.setCharacter(text[i] ? text[i] : " ")
            ccc.setParent(this)
            this.chars.push(ccc)
        }
        engine.addEntity(this)
    }

    public setText(
        /**
         * New text to display
         */
        text: string,
        /**
         * Immediately show the next character on the next flip. Bypass the cycling through all characters.
         */
        quick: boolean = false
    ) : void {
        this.text = text
        this.text.split("").forEach((char, index) => {
            if(this.chars[index].char.toUpperCase() !== char.toUpperCase()){
                if(quick){
                    this.chars[index].setCharacter(char)
                }else{
                    this.chars[index].flipTo(char)
                }
            }
        })
    }

    /**
     * Scales the size of the SplitFlap
     * @param scale - 0-1 value representing the size (default: .5)
     */
    public setScale(scale: number){
        let transform = this.getComponentOrCreate(Transform)
        transform.scale.set(scale, scale, scale)
    }

    /**
     * Sets the position
     * @param position - Vector3 position
     */
    public setPosition(position: Vector3){
        let transform = this.getComponentOrCreate(Transform)
        let { x, y, z } = position
        transform.position.set(x, y, z)
    }
}
