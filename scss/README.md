# Design Style Guide

## How to use this guide

Always look into this guide first when you are trying to design a new component.
Try to reuse as much as possible of already existing components.
If there is a component but is slightly different than you need, consider to use a BEM modifier and make only a new variant of it.
Also, you can make your new component the general component and convert the existing code into a variant.

## How should my development process look like

Open this style guide and start designing your new component here first and try to think about all the cases and variants
(check the [Storybook docs](https://storybook.js.org/docs/react/writing-docs/introduction) for more info).
It's only an HTML page with a single component so the development will be way faster when you don't have to deal with compilation the whole application.
Once you prototype it you can easily test it on different screens and devices.
Make sure you provide enough documentation for others and try to think twice about proper naming.

## Naming Conventions - BEM

The **Block, Element, Modifier** methodology is a popular naming convention for classes in HTML and CSS.
Do not use `camelCase` in class names, it's against the BEM spec.

```css
.block {}

.block__element {}

.block--modifier {}
.block__element--modifier {}
```

## Units

If possible use REMs everywhere.
Try to avoid using pixels at all, it does not scale properly on higher pixel ratios.
Also don't use zero at the beginning of floating numbers.
It's unnecessary long and against SASS standard.

```css
font-size: .7rem; // OK

font-size: 0.7rem; // WRONG
```

## Colors

Always check this [doc](?path=/docs/base-colors--brand) for already existing color variables.
If there is specific color or anything close, reuse it, please.
Other than that, introduce a new variable and try to think twice about correct name for the color.
Also don't forget to create a documentation for the new color.
We don't want to end up with gazillion of colors without even knowing of them.

## Cascading

Try to avoid cascading as much as possible.
It generates a lot of unnecessary code into the final CSS.
Usually there is no need to have more than 3 levels.

## Pictures

Always cover at least pixel ratio 2x.
Use proper SASS variables and think mobile first.
For higher resolutions specify wider pictures to not force mobile devices to always download the large picture.
The `$appVersion` variable makes sure we load always correct picture after new version is released.
Check the example below:

```css
.contact-form {
    background: url('/images/contact-xs.png?v' + $appVersion) no-repeat center;

    @media (min-resolution: $pixelratio-2x) {
        background-image: url('/images/contact-xs@2x.png?v' + $appVersion);
    }

    @include media-breakpoint-up(sm) {
        background-image: url('/images/contact-sm.png?v' + $appVersion);

        @media (min-resolution: $pixelratio-2x) {
            background-image: url('/images/contact-sm@2x.png?v' + $appVersion);
        }
    }
}
```

## Framework

We use Bootstrap framework so try to take advantage of it as much as possible.
We don't want to reinvent the wheel.
