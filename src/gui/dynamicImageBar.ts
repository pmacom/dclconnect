import { DynamicImage } from './dynamicImage'

/**
 * @public
 */
export enum DynamicBarOrientation {
    CENTER_HORIZONTAL_ALIGNED,
    CENTER_VERTICAL_ALIGNED,
    LEFT_ALIGNED,
    RIGHT_ALIGNED,
    TOP_ALIGNED,
    BOTTOM_ALIGNED,
    VALIGN_CENTER_LEFT_ALIGNED,
    VALIGN_CENTER_RIGHT_ALIGNED,
}

/**
 * @public
 */
export class DynamicImageBar extends DynamicImage {
    private percent: number = 0
    private startPositionX: number
    private startPositionY: number
    private startSourceLeft: number
    private startSourceTop: number
    private startSourceWidth: number
    private startSourceHeight: number
 
    constructor(
        image: UIImage,
        startPercent: number = 0,
        private orientation: DynamicBarOrientation = DynamicBarOrientation.CENTER_HORIZONTAL_ALIGNED
    ){
        super(image)
        this.percent = startPercent
        this.startPositionX = image.data.positionX.value
        this.startPositionY = image.data.positionY.value
        this.startSourceLeft = image.sourceLeft 
        this.startSourceTop = image.sourceTop 
        this.startSourceWidth = image.sourceWidth
        this.startSourceHeight = image.sourceHeight
    }

    getPercent(): number { return this.percent }

    setValue(value: number, duration: number = 2){
        this.percent = value
        let percentWidth
        let percentHeight

        switch(this.orientation){
            case DynamicBarOrientation.CENTER_HORIZONTAL_ALIGNED:
                percentWidth = (this.startSourceWidth/100)*value
                this.moveSourceTo(new Vector2(((this.startSourceWidth/2) - (percentWidth/2))+this.startSourceLeft, this.startSourceTop), duration)
                this.resizeSourceTo(new Vector2(percentWidth, this.startSourceHeight), duration)
                this.resizeTo(new Vector2(percentWidth, this.startSourceHeight), duration)
                break;
            case DynamicBarOrientation.CENTER_VERTICAL_ALIGNED:
                break;
            case DynamicBarOrientation.LEFT_ALIGNED:
                percentWidth = (this.startSourceWidth/100)*value
                this.moveSourceTo(new Vector2(this.startSourceLeft, this.startSourceTop), duration)
                this.resizeSourceTo(new Vector2(percentWidth, this.startSourceHeight), duration)
                this.resizeTo(new Vector2(percentWidth, this.startSourceHeight), duration)
                break;
            case DynamicBarOrientation.RIGHT_ALIGNED:
                percentWidth = (this.startSourceWidth/100)*value
                this.moveSourceTo(new Vector2(this.startSourceLeft + (this.startSourceWidth - percentWidth), this.startSourceTop), duration)
                this.resizeSourceTo(new Vector2(percentWidth, this.startSourceHeight), duration)
                this.resizeTo(new Vector2(percentWidth, this.startSourceHeight), duration)
                break;
            case DynamicBarOrientation.VALIGN_CENTER_LEFT_ALIGNED:
                percentWidth = (this.startSourceWidth/100)*value
                this.moveSourceTo(new Vector2(this.startSourceLeft, this.startSourceTop), duration)
                this.resizeSourceTo(new Vector2(percentWidth, this.startSourceHeight), duration)
                this.resizeTo(new Vector2(percentWidth, this.startSourceHeight), duration)
                this.moveTo(new Vector2(this.startPositionX - ((this.startSourceWidth/2) - (percentWidth/2)), this.startPositionY), 2)
                break;
            case DynamicBarOrientation.VALIGN_CENTER_RIGHT_ALIGNED:
                percentWidth = (this.startSourceWidth/100)*value
                this.moveSourceTo(new Vector2( (this.startSourceLeft+( (this.startSourceWidth)-(percentWidth))), this.startSourceTop), duration)
                this.resizeSourceTo(new Vector2(percentWidth, this.startSourceHeight), duration)
                this.resizeTo(new Vector2(percentWidth, this.startSourceHeight), duration)
                this.moveTo(new Vector2(this.startPositionX + ((this.startSourceWidth/2) - percentWidth/2), this.startPositionY), 2)
                break;
            case DynamicBarOrientation.BOTTOM_ALIGNED:
                percentHeight = (this.startSourceHeight/100)*value
                this.moveSourceTo(new Vector2(this.startSourceLeft, (this.startSourceTop + (this.startSourceHeight - percentHeight))), duration)
                this.resizeSourceTo(new Vector2(this.startSourceWidth, percentHeight), duration)
                this.resizeTo(new Vector2(this.startSourceWidth, percentHeight), duration)
                break;
            case DynamicBarOrientation.TOP_ALIGNED:
                percentHeight = (this.startSourceHeight/100)*value
                this.moveSourceTo(new Vector2(this.startSourceLeft, this.startSourceTop), duration)
                this.resizeSourceTo(new Vector2(this.startSourceLeft, (this.startSourceLeft + percentHeight)), duration)
                this.resizeTo(new Vector2(this.startSourceLeft, (this.startSourceLeft + percentHeight)), duration)
                break;
            default:
                break;
        }
    }

    setOrientation(orientation: DynamicBarOrientation){
        this.orientation = orientation
    }
}
