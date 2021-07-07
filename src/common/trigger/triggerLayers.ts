/**
 * @public
 */
export class TriggerLayers {
    private static layers: Array<string> = []
    private static _instance: TriggerLayers

    public static get Instance(): TriggerLayers {
        return this._instance || (this._instance = new this())
    }

    public getLayerId(layerName: string): number {
        let index = TriggerLayers.layers.indexOf(layerName)
        if(index < 0){
            TriggerLayers.layers.push(layerName)
            return Math.pow(2, TriggerLayers.layers.length - 1)
        }
        return Math.pow(2, index)
    }

    public checkLayerIds(layerNames: Array<string>): number {
        let check = layerNames.map(layerName => TriggerLayers.layers.indexOf(layerName))
        return check.reduce((a,c) => a | c)
    }
}
