import * as utils from '@dcl/ecs-scene-utils'
import { TriggerLayers } from './triggerLayers'

/**
 * @public
 */
export interface TriggerColliderInput {
    position: Vector3
    scale: Vector3
    layerName: string
    triggerLayers: Array<string>
    onTriggerEnter: (entity: Entity) => void
    onTriggerExit: (entity: Entity) => void
    isSphere?: boolean // TODO: Coming Soon
    withCollisions?: boolean
    enableDebug?: boolean
}


/**
 * @public
 * Wrapps a TriggerBoxShape in an entity for easier placement
 */
export class TriggerCollider extends Entity {
    private triggerShape: utils.TriggerBoxShape | utils.TriggerSphereShape
    private triggerComponent: utils.TriggerComponent
    
    constructor(settings: TriggerColliderInput) {
        super()
        let enableDebug = !!settings.enableDebug
        this.triggerShape = new utils.TriggerBoxShape(settings.scale, settings.position)

        this.triggerComponent = new utils.TriggerComponent(
            this.triggerShape,
            {
                layer: TriggerLayers.Instance.getLayerId(settings.layerName),
                triggeredByLayer: TriggerLayers.Instance.checkLayerIds(settings.triggerLayers),
                onTriggerEnter: settings.onTriggerEnter,
                onTriggerExit: settings.onTriggerExit,
                enableDebug: !!settings.enableDebug,
            }
        )

        this.addComponent(this.triggerComponent)
        engine.addEntity(this)
    }

    /**
     * Sets the position of the TriggerCollider
     * @param position - trigger position relative to the parent object
     */
    public setPosition(position: Vector3){
        this.triggerShape.position.set(position.x, position.y, position.z)
    }

    /**
     * Sets the scale of the TriggerCollider
     * @param scale - trigger scale in meters
     */
    public setScale(scale: Vector3){
        // TODO: Coming soon
    }
}