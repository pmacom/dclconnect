import * as utils from '@dcl/ecs-scene-utils'
import { BoxHighlight } from '../highlights/boxHighlight'
import { TriggerLayers } from './triggerLayers'

/**
* @public
*/
export interface ITriggerZoneInput {
    position: Vector3
    scale: Vector3
    highlightDirection?: "north" | "south" | "east" | "west" | "ceiling" | "floor";
    withCollisions?: boolean
    enableDebug?: boolean
    showHighlight?: boolean
    highlightColor?: Color4
}


/**
 * @public
 * Wrapps a TriggerBoxShape in an entity for easier placement
 */
export class TriggerZone extends Entity {
    private triggerShape: utils.TriggerBoxShape
    private triggerComponent: utils.TriggerComponent
    private boxHighlightZone: BoxHighlight | null = null
    public onCameraEnter : () => void = () => {log('default TriggerZone Enter')}
    public onCameraExit : () => void = () => {log('default TriggerZone Exit')}
    
    constructor(settings: ITriggerZoneInput) {
        super()
        let enableDebug = !!settings.enableDebug
        this.triggerShape = new utils.TriggerBoxShape(settings.scale, settings.position)
        this.triggerComponent = new utils.TriggerComponent(
            this.triggerShape,
            {
                onCameraEnter: this.onCameraEnter,
                onCameraExit: this.onCameraExit,
                enableDebug: !!settings.enableDebug,
            }
        ) 
        if(settings.showHighlight){
            this.boxHighlightZone = new BoxHighlight(
                Vector3.Zero(),
                Vector3.One(),
            )
            let { x, y, z } = settings.scale
            let expandAmount = .005
            this.boxHighlightZone.setScale(
                x + expandAmount,
                y + expandAmount,
                z + expandAmount,
            )
            let p = Vector3.Add(settings.position, new Vector3(0, 0, 0))
            // this.boxHighlightZone.setPosition(p.x, p.y, p.z)
            // this.boxHighlightZone.setParent(this)
        }

        this.addComponent(this.triggerComponent)
        engine.addEntity(this)
    }

    /**
     * Sets the position of the TriggerCollider
     * @param position - trigger position relative to the parent object
     */
    public setPosition(position: Vector3){
        this.triggerShape.position.set(position.x, position.y, position.z)
        if(this.boxHighlightZone){
            let p = Vector3.Add(position, new Vector3(0, 0, 0))
            // this.boxHighlightZone.setPosition(p.x, p.y, p.z)
        }
    }

    /**
     * Sets the scale of the TriggerCollider
     * @param scale - trigger scale in meters
     */
    public setScale(scale: Vector3){
        this.triggerShape.size.set(scale.x, scale.y, scale.z)
        if(this.boxHighlightZone){
            let p = Vector3.Add(scale, new Vector3(0, 0, 0))
            // this.boxHighlightZone.setPosition(p.x, p.y, p.z)
        }
    }

    public set onEnter(func: () => void) {
        this.triggerComponent.onCameraEnter = func
    }

    public set onExit(func: () => void) {
        this.triggerComponent.onCameraExit = func
    }
}