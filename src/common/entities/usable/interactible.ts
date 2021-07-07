
import { BoxHighlight } from "src/common/highlights/boxHighlight"
import { state } from "src/state"

/**
 * @public
 */
export abstract class InteractibleEntity extends Entity {
    public readonly class: string = 'InteractibleEntity'
    public readonly interactions: Array<string> = []
    public boxHighlight: BoxHighlight | null = null

    constructor() {
        super()
    }
    abstract onFocus(): void;
    abstract onBlur(): void;
}

export const isInteractible = (entity: InteractibleEntity) : boolean => entity.class == "InteractibleEntity"
export const findInteractibleEntityByName = (name: string) : InteractibleEntity | null => engine.entities[name] as InteractibleEntity
