import { Wait } from './wait'
/**
 * @public
 */
export class Debouncer {
	wait: Wait | null = null
	constructor(
		private onWaitingCompleteCallback: Function,
		private delayInSeconds: number,
		private onWaitingCallback?: Function
	) {}
	public action(...args: any) {
		if (!this.wait) {
			this.wait = new Wait(() => {
				this.onWaitingCompleteCallback(args)
				this.wait = null
			}, this.delayInSeconds)
		} else {
			this.wait.reset()
			if (this.onWaitingCallback) {
				this.onWaitingCallback()
			}
		}
	}
}
