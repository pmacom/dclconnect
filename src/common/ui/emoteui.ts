import { triggerEmote, PredefinedEmote } from '@decentraland/RestrictedActions'
import {
  GlobalCanvas as canvas,
  DynamicImage,
  DynamicText,
  DynamicContainerRect,
  Wait,
  DCLConnectEase
} from '../../index'

const defaultOpacity = 0.5
/**
 * @public
 */
export class EmoteUI {
  menuContainer: DynamicContainerRect
  emote: string | null = null
  icon: DynamicImage
  buttons: DynamicImage[] = []
  currentEmote: string = ''
  menuVisible: boolean = false
  slices = [
    //Prefix non-buttons with "spacer"
    { x: 0, y: 0, w: 100, h: 50, px: 5, py: 145, name: 'spacertop' },
    { x: 0, y: 50, w: 12, h: 250, px: 5, py: 95, name: 'spacerleft' },
    { x: 12, y: 50, w: 75, h: 27, px: 17, py: 95, name: 'robot' },
    { x: 12, y: 77, w: 75, h: 12, px: 17, py: 68, name: 'spacer1' },
    { x: 12, y: 89, w: 75, h: 27, px: 17, py: 56, name: 'tik' },
    { x: 12, y: 116, w: 75, h: 13, px: 17, py: 29, name: 'spacer2' },
    { x: 12, y: 129, w: 75, h: 27, px: 17, py: 16, name: 'tektonik' },
    { x: 12, y: 156, w: 75, h: 13, px: 17, py: -11, name: 'spacer3' },
    { x: 12, y: 169, w: 75, h: 27, px: 17, py: -24, name: 'disco' },
    { x: 12, y: 196, w: 75, h: 13, px: 17, py: -51, name: 'spacer4' },
    { x: 12, y: 209, w: 75, h: 27, px: 17, py: -64, name: 'handsair' },
    { x: 12, y: 236, w: 75, h: 13, px: 17, py: -91, name: 'spacer5' },
    { x: 12, y: 249, w: 75, h: 27, px: 17, py: -104, name: 'random' },
    { x: 12, y: 276, w: 75, h: 24, px: 17, py: -131, name: 'spacer6' },
    { x: 87, y: 50, w: 13, h: 250, px: 92, py: 95, name: 'spacerright' }
  ]
  constructor(
    iconTexture = 'https://gateway.pinata.cloud/ipfs/QmV5H5evXk3fXvnvMc2YHg4iLyUTmhxgChSxnLQ5g4obyW',
    menuTexture = 'https://gateway.pinata.cloud/ipfs/QmaDEZvkVpsiBerEzJXW9fyjBbbg9tq7MpvbuLqY5mvcGF'
    // iconTexture = 'https://pmacom.github.io/assets/danceicon.png',
    // menuTexture = 'https://pmacom.github.io/assets/dancemenu.png'
  ) {
    const iconTx = new Texture(iconTexture)
    const menuTx = new Texture(menuTexture)

    this.menuContainer = new DynamicContainerRect(new UIContainerRect(canvas))
    this.menuContainer.rect.hAlign = 'right'
    this.menuContainer.rect.vAlign = 'top'
    this.menuContainer.rect.positionX = -10
    this.menuContainer.rect.positionY = -130
    this.menuContainer.rect.opacity = 0

    this.icon = new DynamicImage(new UIImage(canvas, iconTx))
    this.icon.image.vAlign = 'top'
    this.icon.image.hAlign = 'right'
    this.icon.image.positionX = -60
    this.icon.image.positionY = 60
    this.icon.image.sourceLeft = 0
    this.icon.image.sourceTop = 0
    this.icon.image.sourceWidth = 83
    this.icon.image.sourceHeight = 83
    this.icon.image.width = 83 / 2
    this.icon.image.height = 83 / 2
    this.icon.image.onClick = new OnClick(() => {
      this.menuVisible = !this.menuVisible
      if (this.menuVisible) {
        this.menuContainer.scaleIn(0.5, DCLConnectEase.easeInOutElastic)
        this.menuContainer.fadeIn(0.25)
      } else {
        this.menuContainer.scaleOut(0.5, DCLConnectEase.easeInOutElastic)
        this.menuContainer.fadeOut(0.25)
      }
    })

    this.slices.forEach(slice => {
      const part = new DynamicImage(
        new UIImage(this.menuContainer.rect, menuTx)
      )
      part.image.sourceLeft = slice.x * 2
      part.image.sourceTop = slice.y * 2
      part.image.sourceWidth = slice.w * 2
      part.image.sourceHeight = slice.h * 2
      part.image.positionY = slice.py
      part.image.positionX = slice.px
      part.image.width = slice.w
      part.image.height = slice.h
      part.image.vAlign = 'top'
      part.image.hAlign = 'left'
      part.image.opacity = defaultOpacity
      if (slice.name.substring(0, 6) !== 'spacer') {
        part.image.onClick = new OnClick(() => {
          //reset default opacity on all
          this.buttons.forEach(button => {
            button.image.opacity = defaultOpacity
          })
          if (this.currentEmote !== slice.name) {
            this.currentEmote = slice.name
            this.setEmote(this.currentEmote)
            part.image.opacity = 1
          } else {
            this.currentEmote = ''
          }
        })
        this.buttons.push(part)
      }
    })
  }

  setEmote(emote: string): void {
    let _emote
    if (emote === 'random') {
      _emote = this.getRandomEmote()
    } else {
      _emote = emote
    }
    const emoteInfo = this.getEmoteInfo(_emote)
    if (emoteInfo[0] && emoteInfo[1]) {
      triggerEmote({ predefined: emoteInfo[0] })
      new Wait(() => {
        if (this.currentEmote === emote) {
          this.setEmote(emote)
        }
      }, emoteInfo[1])
    }
  }

  getEmoteInfo(emote: string): [PredefinedEmote | null, number | null] {
    switch (emote) {
      case 'wave':
        return [PredefinedEmote.WAVE, 3]
      case 'fistpump':
        return [PredefinedEmote.FIST_PUMP, 3]
      case 'robot':
        return [PredefinedEmote.ROBOT, 9]
      case 'raiseHand':
        return [PredefinedEmote.RAISE_HAND, 3]
      case 'clap':
        return [PredefinedEmote.CLAP, 5]
      case 'money':
        return [PredefinedEmote.MONEY, 5]
      case 'kiss':
        return [PredefinedEmote.KISS, 5]
      case 'tik':
        return [PredefinedEmote.TIK, 10]
      case 'hammer':
        return [PredefinedEmote.HAMMER, 11]
      case 'tektonik':
        return [PredefinedEmote.TEKTONIK, 10]
      case 'dontsee':
        return [PredefinedEmote.DONT_SEE, 2]
      case 'handsair':
        return [PredefinedEmote.HANDS_AIR, 5]
      case 'shrug':
        return [PredefinedEmote.SHRUG, 2]
      case 'disco':
        return [PredefinedEmote.DISCO, 11]
      case 'dab':
        return [PredefinedEmote.DAB, 3]
      case 'headexplode':
        return [PredefinedEmote.HEAD_EXPLODDE, 4]
      default:
        return [null, null]
    }
  }

  getRandomEmote(): PredefinedEmote {
    const emotes = [
      PredefinedEmote.WAVE,
      PredefinedEmote.FIST_PUMP,
      PredefinedEmote.ROBOT,
      PredefinedEmote.RAISE_HAND,
      PredefinedEmote.CLAP,
      PredefinedEmote.MONEY,
      PredefinedEmote.KISS,
      PredefinedEmote.TIK,
      PredefinedEmote.HAMMER,
      PredefinedEmote.TEKTONIK,
      PredefinedEmote.DONT_SEE,
      PredefinedEmote.HANDS_AIR,
      PredefinedEmote.SHRUG,
      PredefinedEmote.DISCO,
      PredefinedEmote.DAB,
      PredefinedEmote.HEAD_EXPLODDE
    ]
    return emotes[Math.floor(Math.random() * emotes.length)]
  }
}
