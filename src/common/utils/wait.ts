/**
 * @public
 */
export class Wait {
    constructor(func: Function, delay: number){
        waitSystem.addWaitAction(func, delay)
    }
}

interface IWaitAction {
    func: Function
    delay: number
    timer: number
}

class WaitSystem implements ISystem {
    private actions: Array<IWaitAction> = []

    addWaitAction(func: Function, delay: number){
        this.actions.push({ func, delay, timer: 0 })
        engine.addSystem(this)
    }

    update(dt: number){
        if(this.actions.length){
            this.actions.forEach((action, index) => {
                action.timer+=dt
                if(action.timer >= action.delay){
                    action.func()
                    this.actions.splice(index, 1)
                }
            })
        }else{
            engine.removeSystem(this)
        }
    }
}

const waitSystem = new WaitSystem()
