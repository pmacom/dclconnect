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
    private system: ISystem

    constructor(){
        this.system = this
    }

    addWaitAction(func: Function, delay: number){
      let wait = { func, delay, timer: 0 }
      this.actions.push(wait)
      if(!this.system.active){
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
