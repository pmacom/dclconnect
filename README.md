#dclconnect

## Using this Utils library

To use any of the helpers provided by the dclconnect utils library

1.) Install it as an `npm` package. Run this command in your scene's project folder:

```
npm install dclconnect
```

2.) Add a new `path` that points to the dclconnect package. Also be sure to add the `include` path. You do not need to alter anything else in this file.

```
{
  "compilerOptions": {
	...
    "paths": {
      "dclconnect": [
        "./node_modules/dclconnect/dist/index.d.ts"
      ]
    },
	...
  },
  "include": [
    "src/**/*.ts",
    "./node_modules/dclconnect/dist/index.js"
  ],
  ...
}
```

## BoxHighlight

[![Experiment #6.1 - BoxHighlight](https://img.youtube.com/vi/3g2ao_MjQyI/maxresdefault.jpg)](https://youtu.be/3g2ao_MjQyI)

### Create New

The `BoxHighlight` component is a graphical, non-colliding entity that can be used to attract attention to the user. It's used heavily within this package, but it can also be instanced on it's own.

`BoxHighlight` has three required arguments:

- `position`: `Vector3` for the position
- `scale`: `Vector3` for the scale
- `direction`: `String` indicates the direction the effect should face.
 - Options: "top" | "bottom" | "north" | "south" | "east" | "west"


### Example

```
import { BoxHighlight } from "dclconnect";

const bh = new BoxHighlight(
    new Vector3(5,2.5,5),
    new Vector3(5,5,5),
    "north"
)
```

### BoxHighlight.(setStripeColor/setSurfaceColor)

You can set the color (and emission) of the stripes/surface with these methods. The color values are generally between 0-1 instead of 0-255. However, if you set any of the red, green, blue values to above 1, it will glow brightly! It looks cool.


```
bh.setStripeColor(new Color3(1,1,0))
bh.setSurfaceColor(new Color3(0,10,1))
```

### BoxHighlight.(setPosition/setScale)

You can adjust the position, height, width and depth of the BoxHighlight by invoking the following methods. You just need to pass along the x, y, z as parameters.


```
bh.setPosition(8, 3, 8)
bh.setScale(3, 6, 3)
```

### BoxHighlight.(setDirection)

Indicate the direction that the BoxHighlight effect should point.
Options: "top" | "bottom" | "north" | "south" | "east" | "west"

It's not encouraged to rotate a BoxHighlight for a few reasons. In short, this is due to the way that triggers, zones and other internal dcl entities work with collisions. You *can* technically rotate it, however there will be unintended effects.

```
bh.setDirection("top")
```

## SplitFlap

[![Experiment #7 - SplitFlap](https://img.youtube.com/vi/ZgK7BxVIobo/maxresdefault.jpg)](https://youtu.be/ZgK7BxVIobo)


### Example

```ts
import { SplitFlap } from "dclconnect";

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


## DynamicImageBar