# dclconnect

## Installation

To use any of the helpers provided by the dclconnect utils library

1.) Please install both dclconnect AND the ecs scene utility library

```
npm install dclconnect
npm install @dcl/ecs-scene-utils
```

2.) In your `tsconfig.json` - add a new `path` that points to BOTH the dclconnect package AND the ecs-scene-utils libraries.

3.) Also be sure to add the `include` path. You do not need to alter anything else in this file. The code below is what it should look like after a brand new `dcl init` project is created.

```json
{
  "compilerOptions": {
    "outFile": "./bin/game.js",
    "allowJs": true,
    "strict": true,
    "paths": {
      "dclconnect": ["./node_modules/dclconnect/dist/index.d.ts"],
      "@dcl/ecs-scene-utils": [
        "./node_modules/@dcl/ecs-scene-utils/dist/index.d.ts"
      ]
    }
  },
  "include": [
    "src/**/*.ts",
    "./node_modules/@dcl/ecs-scene-utils/dist/index.js",
    "./node_modules/dclconnect/dist/index.js"
  ],
  "extends": "./node_modules/decentraland-ecs/types/tsconfig.json"
}
```

## Getting the lastest version

`npm install --save dclconnect@next` to get the latest version

## BoxHighlight

[![Experiment #6.1 - BoxHighlight](https://i.ytimg.com/vi/3g2ao_MjQyI/hqdefault.jpg)](https://youtu.be/3g2ao_MjQyI)

### Create New

The `BoxHighlight` component is a graphical, non-colliding entity that can be used to attract attention to the user. It's used heavily within this package, but it can also be instanced on it's own.

`BoxHighlight` has three required arguments:

- `position`: `Vector3` for the position
- `scale`: `Vector3` for the scale
- `direction`: `String` indicates the direction the effect should face.
- Options: "top" | "bottom" | "north" | "south" | "east" | "west"

### Example

```ts
import { BoxHighlight } from 'dclconnect'

const bh = new BoxHighlight(
  new Vector3(5, 2.5, 5),
  new Vector3(5, 5, 5),
  'north'
)
```

### BoxHighlight.(setStripeColor/setSurfaceColor)

You can set the color (and emission) of the stripes/surface with these methods. The color values are generally between 0-1 instead of 0-255. However, if you set any of the red, green, blue values to above 1, it will glow brightly! It looks cool.

```ts
bh.setStripeColor(new Color3(1, 1, 0))
bh.setSurfaceColor(new Color3(0, 10, 1))
```

### BoxHighlight.(setPosition/setScale)

You can adjust the position, height, width and depth of the BoxHighlight by invoking the following methods. You just need to pass along the x, y, z as parameters.

```ts
bh.setPosition(8, 3, 8)
bh.setScale(3, 6, 3)
```

### BoxHighlight.(setDirection)

Indicate the direction that the BoxHighlight effect should point.
Options: "top" | "bottom" | "north" | "south" | "east" | "west"

It's not encouraged to rotate a BoxHighlight for a few reasons. In short, this is due to the way that triggers, zones and other internal dcl entities work with collisions. You _can_ technically rotate it, however there will be unintended effects.

```ts
bh.setDirection('top')
```

## SplitFlap

[![Experiment #7 - SplitFlap](https://img.youtube.com/vi/ZgK7BxVIobo/maxresdefault.jpg)](https://youtu.be/ZgK7BxVIobo)

### Example

```ts
import { SplitFlap } from "dclconnect"

// Creates a display that is 11 characters long
const sf = new SplitFlap(11)
sf.setText("Event Soon!")

// Alternatively you can include the initial text in the same command
const sf2 = new SplitFlap(11, "Event Soon!")

// To quickly flip to the text without having to wait for it to cycle
// through all of the characters, you can set the `quick` value to true
const sf2.setText("Event Over!", true)
```

## DynamicImage

Examples coming soon

## DynamicImageBar

Examples coming soon

## AudioControlBar

[![Experiment #6.1 - BoxHighlight](https://i.ytimg.com/vi/a4zhezccygc/hqdefault.jpg)](https://youtu.be/a4zhezccygc)

### AudioStreams

Please review the official `AudioStreams` docs for setting up your audio streams properly.

```ts
// For AudioStreams
const audioControlBar = new AudioControlBar(
  new AudioStream('https://ice1.somafm.com/groovesalad-128-mp3')
)
```

### VideoStreams

Please review the official `VideoTexture` docs for setting up a video screen properly.

```ts
// For VideoTextures
const vclip = new VideoClip('https://Somedomain/Video.m3u8')
const myVideoTexture = new VideoTexture(vclip)
const audioControlVideoBar = new AudioControlBar(myVideoTexture)
```

### Placement

```ts
// Once you have created an AudioControlBar you can adjust
// it's placement on the left hand side of the screen
audioControlVideoBar.setOffset(34)
```

### Other Features/Settings

```ts
// Mute and Unmute the audio
audioControlVideoBar.mute()
audioControlVideoBar.unmute()

// Set the volume (0-100)
audioControlVideoBar.setVolume(50)

// Set the Maximum Volume (Careful with this. Some videos/streams are LOUD.
// So this is an audio dampener of sorts. Default: .2
audioControlVideoBar.setMaxVolume(1)
```

## Wait system

```ts
import { Wait } from 'dclconnect'

//Delay a function for 5 seconds

//Use anywhere
new Wait(() => {
  //executes after 5 seconds
}, 5)
```

## Debouncer

The debouncer throttles a previous callback function from executing when the Debouncer.action() is called again subsequently

```ts
import { Debouncer } from 'dclconnect'

//add a debouncer with a 1.5 second timer
const debouncer = new Debouncer(args => {
  //logic to debounce
  log('Delayed action is complete')
}, 1.5)

// enables the debouncer OR reset the debouncer
// optionally you may pass arguments through to the callback function
debouncer.action(args)
```

## onLook

Add an onLook event to your entity with ease.

```ts
import { OnLook } from 'dclconnect'

export class HighlightableBox extends Entity {
  private material = new Material()

  constructor() {
    super()
    this.addComponent(
      new Transform({
        position: new Vector3(8, 1, 8)
      })
    )
    this.addComponent(new BoxShape())

    this.addComponent(
      new OnLook({
        onFocus: () => this.highlight(true),
        onBlur: () => this.highlight(false),
        distance: 100
      })
    )

    this.material.albedoColor = Color3.Blue()
    this.material.metallic = 0.9
    this.material.roughness = 0.1
    this.addComponent(this.material)

    engine.addEntity(this)
  }

  highlight(isActive: boolean) {
    this.material.albedoColor = isActive ? Color3.Yellow() : Color3.Blue()
  }
}
```

## DCLConnectUIEmote

Add a UI element to control automatic emoting. DCLConnectUIEmote.create() requires `triggerEmote` (args[0]), while `iconTextureUrl` (args[1]) and `menuTextureUrl` (args[2]) are optional arguments.

Update `scene.json` to include the following:

```
"requiredPermissions": [
  "ALLOW_TO_TRIGGER_AVATAR_EMOTE"
],
```

Usage:

```ts
import { triggerEmote, PredefinedEmote } from '@decentraland/RestrictedActions'
import { DCLConnectUIEmote } from 'dclconnect'

DCLConnectUIEmote.create(triggerEmote, PredefinedEmote)
```
