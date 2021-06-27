// import { InspectorImage } from "src/dclconnect-gui/inspector"
// import { DynamicImage } from "src/dclconnect/gui/dynamicImage"
import { state } from "../../state"
import { InteractibleEntity, isInteractible } from "./interactible"

// const guiInspector = new InspectorImage()

let highlightDistance = 3

export interface HoldableMetaData {
    [key: string]: any
} 
export abstract class HoldableEntity extends Entity {
    public abstract holdingPosition: Vector3
    public abstract holdingRotation: Quaternion
    public readonly class: string = 'HoldableEntity'
    public readonly interactions: Array<string> = []
    public abstract spriteIndex: number
    public abstract GUIName: string
    public abstract metadata: HoldableMetaData

    constructor() {
        super()

        this.addComponent(
            new OnPointerDown(
              () => {
                if(!state.isHolding){ this.pickUp() }
              },
              {
                button: ActionButton.PRIMARY,
                showFeedback: true,
                hoverText: `Pick Up`,
                distance: 3
              }
            )
        )
    }

    pickUp(){
        log('Picking Up')
        state.isHolding = true
        state.isHoldingEntityName = this.uuid
        // guiInspector.setEntity(this)
        this.setParent(Attachable.FIRST_PERSON_CAMERA)
        this.getComponentOrCreate(Transform).position = this.holdingPosition
        this.getComponentOrCreate(Transform).rotation = this.holdingRotation
    }

    putDown(position: Vector3){
        log('Putting Down')
        let transform = this.getComponent(Transform)
        state.isHolding = false
        state.isHoldingEntityName = null
        // guiInspector.clearEntity()
        transform.position = position
        transform.rotation = new Quaternion()
        this.setParent(null)
    }

    destroy(){
        state.isHolding = false
        state.isHoldingEntityName = null
        engine.removeEntity(this)
    }

    public abstract useItem(target: InteractibleEntity): void
}

const input = Input.instance
input.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, true, (event) => {
    const entity = state.isHoldingEntityName ? findHoldableEntityByName(state.isHoldingEntityName) : null
    if(state.isHolding && event.hit){
        if(event.hit.normal.y >= 0.98 && event.hit.normal.y <= 1.02 && entity){
            entity.putDown(event.hit.hitPoint)
        }
    }
});


input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, true, (event) => {
    const entity = state.isHoldingEntityName ? findHoldableEntityByName(state.isHoldingEntityName) : null
    if(!entity){ return }
    if(state.isHolding && event?.hit?.entityId && event.hit.length <= highlightDistance){
        let targetId = event.hit.entityId
        let target = engine.entities[targetId] as InteractibleEntity
        if(isInteractible(target)){
            let targetInteractions = target.interactions.filter(element => entity.interactions.indexOf(element) !== -1)
            if(targetInteractions.length){
                entity.useItem(target as InteractibleEntity)
            }
        }
    }
});

export const isHoldable = (entity: HoldableEntity) : boolean => entity.class == "HoldableEntity"
export const findHoldableEntityByName = (name: string) : HoldableEntity | null => engine.entities[name] as HoldableEntity
