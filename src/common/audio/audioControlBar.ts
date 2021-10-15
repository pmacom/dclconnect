import { DynamicImage } from '../../gui/dynamicImage'
import { DynamicImageBar } from '../..//gui/dynamicImageBar'

import {
    audioIcon,
    videoIcon,
    audioMuteIcon,
    audioMutedIcon,
    audioControlBg,
    audioControlFill,
    clickableBar,
} from './audioControlBarAssets'

/**
 * @public
 */
export class AudioControlBar extends Entity {
    private audioControlBg: DynamicImage
    private audioControlFill: DynamicImageBar
    private audioIcon: DynamicImage
    private audioMuteIcon: DynamicImage
    private audioMutedIcon: DynamicImage
    private isAudible: boolean = true
    private volumePreference: number = 100
    private clickableBars: Array<UIImage> = []
    private maxVolume: number = .2

    constructor(private source: AudioStream | VideoTexture, startMuted?: boolean ){
        super()
        this.audioControlBg = audioControlBg()
        this.audioControlFill = audioControlFill()
        this.audioIcon = source instanceof AudioStream ? audioIcon() : videoIcon()
        this.audioMuteIcon = audioMuteIcon()
        this.audioMutedIcon = audioMutedIcon()
        this.audioIcon.image.onClick = new OnClick(() => { this.setVolumePreference(10)})
        this.audioMuteIcon.image.onClick = new OnClick(() => { log('mute'); this.toggleMute()})
        this.audioMutedIcon.image.onClick = new OnClick(() => { log('muted'); this.toggleMute()})
        this.addComponent(source)
        this.updateGUI()
        this.setVolume(startMuted ? 0 : 100)
        if(startMuted){ this.mute() }
        for(let i = 0; i < 10; i++){
            let bar = clickableBar('audioControl', i, () => {
                let vol = (i+1)*10
                this.setVolumePreference(vol)
                this.setVolume(vol)
                this.updateVolumeBar(vol)
                this.isAudible = true
                this.updateGUI()
            })
            this.clickableBars.push(bar)
        }
        engine.addEntity(this)
    }

    public updateSource(source: AudioStream | VideoTexture){
        this.addComponentOrReplace(source)
        this.unmute()
    }

    private updateGUI(){
        if(this.isAudible){
            this.audioMuteIcon.show()
            this.audioMutedIcon.hide()
        }else{
            this.audioMuteIcon.hide()
            this.audioMutedIcon.show()
        }
    }

    private toggleMute(value?: boolean){
        this.isAudible = !this.isAudible
        this.updateVolumeBar(this.isAudible ? this.volumePreference : 0)
        this.setVolume(this.isAudible ? this.volumePreference : 0)
        this.updateGUI()
    }

    private updateVolumeBar(value: number){
        this.audioControlFill.setValue(value, .5)
    }

    mute(){
        this.isAudible = false
        this.updateVolumeBar(0)
        this.setVolume(0)
        this.updateGUI()
    }

    unmute(){
        this.isAudible = true
        this.updateVolumeBar(this.volumePreference)
        this.setVolume(this.volumePreference)
        this.updateGUI()
    }

    setVolume(value: number){
        this.source.volume = (value/100) * this.maxVolume
        this.updateVolumeBar(value)
    }

    setMaxVolume(value: number){
        this.maxVolume = value
    }

    private setVolumePreference(value: number){
        this.volumePreference = value
    }

    setOffset(yOffset: number){
        let offset = -124 - yOffset
        this.audioControlBg.image.positionY = offset
        this.audioControlFill.image.positionY = offset - 6
        this.audioIcon.image.positionY = offset
        this.audioMuteIcon.image.positionY = offset
        this.audioMutedIcon.image.positionY = offset
        this.clickableBars.forEach(bar => {
            bar.positionY = offset-6
        })
    }

    hide(){
        this.audioControlBg.hide()
        this.audioControlFill.hide()
        this.audioIcon.hide()
        this.audioMuteIcon.hide()
        this.audioMutedIcon.hide()
    }
    show(){
        this.audioControlBg.show()
        this.audioControlFill.show()
        this.audioIcon.show()
        this.audioMuteIcon.show()
        this.audioMutedIcon.show()
    }
}