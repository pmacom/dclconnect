import { GlobalCanvas } from "../../gui/canvas";
import { DynamicImage } from "../../gui/dynamicImage";
import { DynamicBarOrientation, DynamicImageBar } from "../../gui/dynamicImageBar";

const audioControl = "https://pmacom.github.io/assets/audioControlBar.png"
export const audioControlTexture = new Texture(audioControl)

const offsetX = 15;
const offsetY = -160;
const volumeOffsetX = 15+32;
const volumeOffsetY = -160;

export interface GUIImageOptions {
    width: number | string
    height: number | string
    sourceX: number
    sourceY: number
    positionX: number
    positionY: number
    vAlign: string
    hAlign: string
}

export const createImage = (
    name: string,
    imageTexture: Texture,
    options: GUIImageOptions
): UIImage => {
    let image =  new UIImage(GlobalCanvas, imageTexture)
    image.name = name
    image.width = options.width
    image.height = options.height
    image.sourceLeft = options.sourceX
    image.sourceTop = options.sourceY
    image.sourceWidth = typeof options.width == 'string' ? 0 : options.width
    image.sourceHeight = typeof options.height == 'string' ? 0 : options.height
    image.positionX = options.positionX
    image.positionY = options.positionY
    image.vAlign = options.vAlign
    image.hAlign = options.hAlign
    image.sizeInPixels = true
    image.opacity = 1
    return image
}


export const audioControlBg = () : DynamicImage => {
    /* Initial Values */
    let image = createImage("audioTest", audioControlTexture, {
        width: 79,
        height: 32,
        sourceX: 33,
        sourceY: 0,
        positionX: volumeOffsetX,
        positionY: volumeOffsetY,
        vAlign: "top",
        hAlign: "left",
    })
    image.opacity = 1
    image.sizeInPixels = true
    return new DynamicImage(image)
}

export const audioControlFill = () : DynamicImageBar => {
    /* Initial Values */
    let startPercent = 0
    let image = createImage("audioControlFill", audioControlTexture, {
        width: 68,
        height: 20,
        sourceX: 39,
        sourceY: 39,
        positionX: volumeOffsetX + 6, // offsetX + 6,
        positionY: volumeOffsetY - 6, // offsetX + 5,
        vAlign: "top",
        hAlign: "left",
    })
    image.opacity = 1
    image.sizeInPixels = true
    let bar = new DynamicImageBar(image, 0, DynamicBarOrientation.LEFT_ALIGNED)
    bar.setValue(0)
    return bar
}

const spacing = 2;
export const clickableBar = (uniqueName: string, index: number, func: Function) : UIImage =>  {
    let image =  new UIImage(GlobalCanvas, audioControlTexture)
    image.name = `${uniqueName}_${index}`
    image.width = 5+spacing
    image.height = 20
    image.sourceLeft = 0
    image.sourceTop = 66
    image.sourceWidth = 5
    image.sourceHeight = 20
    image.positionX = volumeOffsetX + ((5*index)+(spacing*index))+6
    image.positionY = volumeOffsetY - 6
    image.sizeInPixels = true
    image.opacity = 1
    image.vAlign = "top",
    image.hAlign = "left",
    image.onClick = new OnClick(() => {
        log('changing volume')
        func()
    })
    return image
}


export const audioIcon = () : DynamicImage => {
    /* Initial Values */
    let image = createImage("audioIcon", audioControlTexture, {
        width: 32,
        height: 32,
        sourceX: 0,
        sourceY: 33,
        positionX: offsetX,
        positionY: offsetY,
        vAlign: "top",
        hAlign: "left",
    })
    image.opacity = 1
    image.sizeInPixels = true
    return new DynamicImage(image)
}

export const videoIcon = () : DynamicImage => {
    /* Initial Values */
    let image = createImage("videoIcon", audioControlTexture, {
        width: 32,
        height: 32,
        sourceX: 0,
        sourceY: 0,
        positionX: offsetX,
        positionY: offsetY,
        vAlign: "top",
        hAlign: "left",
    })
    image.opacity = 1
    image.sizeInPixels = true
    return new DynamicImage(image)
}

export const audioMuteIcon = () : DynamicImage => {
    /* Initial Values */
    let image = createImage("audioMuteIcon", audioControlTexture, {
        width: 32,
        height: 32,
        sourceX: 113,
        sourceY: 0,
        positionX: offsetX + 113,
        positionY: offsetY,
        vAlign: "top",
        hAlign: "left",
    })
    image.opacity = 1
    image.sizeInPixels = true
    return new DynamicImage(image)
}

export const audioMutedIcon = () : DynamicImage => {
    /* Initial Values */
    let image = createImage("audioMutedIcon", audioControlTexture, {
        width: 32,
        height: 32,
        sourceX: 113,
        sourceY: 33,
        positionX: offsetX + 113,
        positionY: offsetY,
        vAlign: "top",
        hAlign: "left",
    })
    image.opacity = 1
    image.sizeInPixels = true
    return new DynamicImage(image)
}
