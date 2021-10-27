import {
  GlobalCanvas as canvas,
  DynamicImage,
  DynamicContainerRect,
  Wait,
  DCLConnectEase
} from '../../index'

const defaultIconImageURL: string =
  'https://gateway.pinata.cloud/ipfs/QmV5H5evXk3fXvnvMc2YHg4iLyUTmhxgChSxnLQ5g4obyW'
const defaultMenuImageURL: string =
  'https://gateway.pinata.cloud/ipfs/QmaDEZvkVpsiBerEzJXW9fyjBbbg9tq7MpvbuLqY5mvcGF'

const defaultOpacity = 0.5

const slices = [
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

// type Emote = {
//   predefined: PredefinedEmote
// }

// const enum PredefinedEmote {
//   WAVE = 'wave',
//   FIST_PUMP = 'fistpump',
//   ROBOT = 'robot',
//   RAISE_HAND = 'raiseHand',
//   CLAP = 'clap',
//   MONEY = 'money',
//   KISS = 'kiss',
//   TIK = 'tik',
//   HAMMER = 'hammer',
//   TEKTONIK = 'tektonik',
//   DONT_SEE = 'dontsee',
//   HANDS_AIR = 'handsair',
//   SHRUG = 'shrug',
//   DISCO = 'disco',
//   DAB = 'dab',
//   HEAD_EXPLODDE = 'headexplode'
// }
/**
 * @public
 */
class EmoteUI {
  menuContainer: DynamicContainerRect
  emote: string | null = null
  icon: DynamicImage
  iconTexture: Texture | undefined
  menuTexture: Texture | undefined
  buttons: DynamicImage[] = []
  currentEmote: string = ''
  menuVisible: boolean = false
  triggerEmote: any
  PredefinedEmotes: any

  constructor(
    iconTextureUrl: string = defaultIconImageURL,
    menuTextureUrl: string = defaultMenuImageURL
  ) {
    this.iconTexture = new Texture(iconTextureUrl)
    this.menuTexture = new Texture(menuTextureUrl)
  }

  public create(
    triggerEmote: any,
    PredefinedEmotes: any,
    iconTextureURL: string = defaultIconImageURL,
    menuTextureURL: string = defaultMenuImageURL
  ) {
    this.iconTexture = new Texture(iconTextureURL)
    this.menuTexture = new Texture(menuTextureURL)
    this.triggerEmote = triggerEmote
    this.PredefinedEmotes = PredefinedEmotes
    this.menuContainer = new DynamicContainerRect(new UIContainerRect(canvas))
    this.menuContainer.rect.hAlign = 'right'
    this.menuContainer.rect.vAlign = 'top'
    this.menuContainer.rect.positionX = -10
    this.menuContainer.rect.positionY = -130
    this.menuContainer.rect.opacity = 0

    this.icon = new DynamicImage(new UIImage(canvas, this.iconTexture))
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

    slices.forEach(slice => {
      const part = new DynamicImage(
        new UIImage(this.menuContainer.rect, this.menuTexture)
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

  private setEmote(emote: string): void {
    let _emote
    if (emote === 'random') {
      _emote = this.getRandomEmote()
    } else {
      _emote = emote
    }
    const emoteInfo = this.getEmoteInfo(_emote)
    if (emoteInfo[0] && emoteInfo[1]) {
      this.triggerEmote({ predefined: emoteInfo[0] })
      new Wait(() => {
        if (this.currentEmote === emote) {
          this.setEmote(emote)
        }
      }, emoteInfo[1])
    }
  }

  private getEmoteInfo(emote: any): [any | null, number | null] {
    switch (emote) {
      case 'wave':
        return [this.PredefinedEmotes[0], 3]
      case 'fistpump':
        return [this.PredefinedEmotes[1], 3]
      case 'robot':
        return [this.PredefinedEmotes[2], 9]
      case 'raiseHand':
        return [this.PredefinedEmotes[3], 3]
      case 'clap':
        return [this.PredefinedEmotes[4], 5]
      case 'money':
        return [this.PredefinedEmotes[5], 5]
      case 'kiss':
        return [this.PredefinedEmotes[6], 5]
      case 'tik':
        return [this.PredefinedEmotes[7], 10]
      case 'hammer':
        return [this.PredefinedEmotes[8], 11]
      case 'tektonik':
        return [this.PredefinedEmotes[9], 10]
      case 'dontsee':
        return [this.PredefinedEmotes[10], 2]
      case 'handsair':
        return [this.PredefinedEmotes[11], 5]
      case 'shrug':
        return [this.PredefinedEmotes[12], 2]
      case 'disco':
        return [this.PredefinedEmotes[13], 11]
      case 'dab':
        return [this.PredefinedEmotes[14], 3]
      case 'headexplode':
        return [this.PredefinedEmotes[15], 4]
      default:
        return [null, null]
    }
  }

  private getRandomEmote(): any {
    return this.PredefinedEmotes[Math.floor(Math.random() * this.PredefinedEmotes.length)]
  }
}

export const DCLConnectUIEmote = new EmoteUI()
