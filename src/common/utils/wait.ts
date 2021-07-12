/**
 * @public
 */
export class Wait {
    reset: Function
    constructor(func: Function, delayInSeconds: number){
        this.reset = waitSystem.addWaitAction(func, delayInSeconds)
    }
}

interface IWaitAction {
    func: Function
    delay: number
    timer: number
}

class WaitSystem implements ISystem {
    private actions: Array<IWaitAction> = []

    addWaitAction(func: Function, delay: number): Function{
        let wait = { func, delay, timer: 0 }
        let count = this.actions.length
        this.actions.push(wait)
		if (count === 0) {
			engine.addSystem(this)
		}
        return () => (wait.timer = 0)
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
