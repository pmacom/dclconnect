const physicsCast = PhysicsCast.instance
const highlightDistanceMaximum = 100 // Maximum Length
const highlightDistanceDefault = 4 // In Meters
let highlightedEntityId : string | null = null
const debounceSpeed = .1
let debounceTimer = 0

interface IOnLookProps {
    onFocus : Function,
    onBlur : Function,
    distance?: number
}

/**
 * @public
 */
@Component('onLook')
export class OnLook {
    constructor(public props: IOnLookProps){
        onLookSystem.enable()
    }
}

const highlightGroup = engine.getComponentGroup(OnLook)

class OnLookSystem implements ISystem {
    private system: ISystem

    constructor(){
        this.system = this
    }

    enable(){
        if(!this.system.active){
            engine.addSystem(this.system)
        }
    }

    update(dt: number){ // DeltaTime
        debounceTimer += dt
    	if(debounceTimer >= debounceSpeed){
            debounceTimer = 0;
            // Make sure there is at least one entity with the HighlightComponent
            if(highlightGroup.entities.length){
                physicsCast.hitFirst(
                    physicsCast.getRayFromCamera(highlightDistanceMaximum),
                    (event) => {
                        if(event.entity.entityId){ // Make sure there is an entity there
                            let targetEntity = engine.entities[event.entity.entityId] as IEntity
                           
                            if(targetEntity && highlightGroup.hasEntity(targetEntity)){
                                for (let entity of highlightGroup.entities) {
                                    let highlightComponent = entity.getComponentOrNull(OnLook)
                                    if(highlightComponent){
                                        const { onFocus, onBlur, distance = highlightDistanceDefault } = highlightComponent.props
                                        const distanceDiff = Vector3.Distance(
                                            Camera.instance.position,
                                            event.hitPoint
                                        )
                                        if(targetEntity.uuid == entity.uuid && distanceDiff <= distance){
                                            highlightedEntityId = targetEntity.uuid
                                            onFocus()
                                        }else{
                                            onBlur()
                                        }
                                    }
                                }
                            }
                        } else if(highlightedEntityId) {
                            this.blurHighlighted()
                        }
                    },
                    Math.random()*100 // Needs a random ID so previous calls don't collide
                )
            }else{
                if(this.system.active){
                    engine.removeSystem(this)
                }
            }
        }
    }

    blurHighlighted(){
        if(highlightedEntityId){
            const highlighted = engine.entities[highlightedEntityId]
            if(highlighted){
                let highlightComponent = highlighted.getComponentOrNull(OnLook)
                if(highlightComponent){
                    const { onBlur } = highlightComponent.props
                    onBlur()
                }
            }
        }
    }
}

const onLookSystem = new OnLookSystem()