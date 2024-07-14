---
# You can also start simply with 'default'
theme: default
# some information about your slides (markdown enabled)
title: Using Signals in React
info: |
  ## How often have you wished for something better than useState and useEffect?
   Do we deserve more predictable and performant tools? 
   I've pondered this a lot. In this talk, we'll explore 
   how our React applications can benefit from State of Art UI state management primitive - signals
# apply unocss classes to the current slide
class: text-center
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# https://sli.dev/guide/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/guide/syntax#mdc-syntax
mdc: true
layout: quote
---

# Using Signals in React

<!-- [TODO]: add info about fact that signals are more predictable to write logic -->

<!--
Yo guys. I hope you had good time of doing programming this day. But maybe you spend this time better

more productive react 

preact signals
-->

---

# About me

- preact-signals enthusiast
- I like performant applications
- professional Javascript hater
- professional React hater
- worked in different JS codebases

<div class='absolute right-[18%] top-[20%] rounded-full overflow-hidden'>
<img src='/self-photo.jpg' class='object-cover w-40 scale-125 aspect-square' />
</div>

<!--
- contributions, own OSS
- sluggish apps like Teams, Slack
- more than 2 years experience. interpreted - complex apps
- not performant, needs fine tuning
- I knew different UI frameworks approaches. This why I creating this talk
-->

---

# Talk structure

- Discuss React statemanagement problems
  - Hard to write any logic
  - Performance problems
- Modern approaches
- Adopting reactivity in React (preact-signals)
- Rewriting app with preact-signals
- preact signals drawbacks
- QA

<!--
- slide text
- Solid.js, Vue.js, Qwik.js, Angular
- how to use it in React
- workshop rewriting app with preact-signals
- cons
- i will answer any questions
-->

---
layout: two-cols-header
layoutClass: gap-x-3
---

## Is React statemanagement any good? Or `useFootGun`

::left::

### Unstable references

```ts{*}
const musicPlayer = useMusicPlayer();
const { togglePlayback } = musicPlayer;
useEffect(() => {
  togglePlayback({
    playbackId: "intro",
    playbackSource: require("./../../../assets/audio/intro.mp3"),
  });
  return () => {
    togglePlayback(undefined);
  };
}, [togglePlayback]);
```

::right::

### Logic on useEffect {v-click}

```ts{hide|*|6-7|16-17|*} {at="+0"}
useEffect(() => {
  if (!connected) {
    return;
  }
  console.log(subscriptions);
  setPaymentsState({
    ...paymentsState,
    subscriptions: subscriptions
  });
}, [connected, subscriptions]);

useEffect(() => {
  if (!connected) {
    return;
  }
  setPaymentsState({
    ...paymentsState,
    products: products
  });
}, [connected, products]);
```

<!--
I've actually made fun of you. Writing logic in react is decent
Let's start with my favorite hook - useFootGun

Logic - is really hard.

Unstable references

Ask about what's wrong with the code?

Stale clojures

It feels unfamiliar for people from other UI frameworks

 
React team made a lot of traps for us.
-->

---

## React performance

```jsx{*|17-26|22|1-6|7-15|*}
const Counter = ({ count, onIncrement }) => (
  <div>
    Count: {count}
    <button onClick={onIncrement}>Increment</button>
  </div>
);
const HugeComponentTree = () => {
  let res = 0;
  const target = 10_000_000 + Math.random() * 10_000_000;
  for (let i = 0; i < target; i++) {
    res += Math.random();
  }
  return res;
};

function App() {
  const [counter, increment] = React.useReducer((count) => count + 1, 0);
  return (
    <>
      <Counter count={counter} onIncrement={increment} />

      <HugeComponentTree  />
    </>
  );
}
```

<!--
React is inefficient by default

Facts: 
- top render forces to reexecute any of it descendants 
- nested components tree - slow

How our render trees looks like?
-->

---

## How do production app render tree look like?

![alt text](/image.png){class='mx-auto max-h-[420px]'}

<!--
- shallow component tree
- deep component tree

What can make our trees more nested: 
- HOCs (styled)
- Providers
- UI libraries
-->

---
class: "relative"
---

## Solid.js - with JSX, but fast

[Test it out](https://playground.solidjs.com/anonymous/0eca54da-e148-424f-bdd0-640bcfce8223){class='absolute right-18 bottom-5 z-10'}

````md magic-move
```tsx
const Counter = ({ count, onIncrement }) => (
  <div>
    Count: {count}
    <button onClick={onIncrement}>Increment</button>
  </div>
);
const HugeComponentTree = () => {
  let res = 0;
  const target = 10_000_000 + Math.random() * 10_000_000;
  for (let i = 0; i < target; i++) res += Math.random();
  return res;
};

function App() {
  const [counter, increment] = React.useReducer((count) => count + 1, 0);
  return (
    <>
      <Counter count={counter} onIncrement={increment} />
      <HugeComponentTree />
    </>
  );
}
```

```tsx
const Counter = (props) => (
  <div>
    Count: {props.count}
    <button onClick={() => props.onIncrement()}>Increment</button>
  </div>
);
const HugeComponentTree = () => {
  let res = 0;
  const target = 10_000_000 + Math.random() * 10_000_000;
  for (let i = 0; i < target; i++) res += Math.random();
  return res;
};

function App() {
  const [counter, setCounter] = createSignal(0);
  const increment = () => setCounter((it) => it + 1);
  return (
    <>
      <Counter count={counter()} onIncrement={increment} />

      <HugeComponentTree />
    </>
  );
}
```
````

<!--
Are there something better? Components is cheap
Difference:
- components is executes once
- no VDOM

How:
- reactive system
- know exactly what need to be reexecuted
- huge component will be executed only once
-->

---

## Should we rewrite our projects with Solid.js?

### Of course not{v-click class='h-full flex flex-col gap-4 items-center justify-center'}

<!--
Read.

No. 
- ecosystem
- cost - no sense
- you can solve performance problems in React

You must have a good reason for new rewrite, but you can start new projects with solid.js.
-->

---

## Technologies do not matter much

![alt text](/image-2.png){v-click class='max-h-[38vh]'}

<!--
You can build poor product with great technologies and create great ones with Javascript on backend.

Pains in react - new approaches
-->

---

## Can we adopt the same patterns in React?

````md magic-move
```tsx{none|*}
const Counter = ({ count, onIncrement }) => (
  <div>
    Count: {count}
    <button onClick={onIncrement}>Increment</button>
  </div>
);
const HugeComponentTree = () => {
  let res = 0;
  const target = 10_000_000 + Math.random() * 10_000_000;
  for (let i = 0; i < target; i++) res += Math.random();
  return res;
};

function App() {
  const [counter, increment] = React.useReducer((count) => count + 1, 0);
  return (
    <>
      <Counter count={counter} onIncrement={increment} />
      <HugeComponentTree />
    </>
  );
}
```

```tsx
const Counter = ({ count, onIncrement }) => (
  <div>
    Count: {count}
    <button onClick={onIncrement}>Increment</button>
  </div>
);
const HugeComponentTree = () => {
  let res = 0;
  const target = 10_000_000 + Math.random() * 10_000_000;
  for (let i = 0; i < target; i++) res += Math.random();
  return res;
};

function App() {
  const [counter, increment] = [useSignal(0), () => counter.value++];
  return (
    <>
      <Counter count={counter} onIncrement={increment} />
      <HugeComponentTree />
    </>
  );
}
```
````

---
layout: iframe
url: https://stackblitz.com/edit/vitejs-vite-zuyyux?embed=1&file=src%2FApp.jsx
---

<!--
Now we just updating components that really needs to be updated
-->

---

# Preact signals API

<v-switch>

<template #1>

```ts twoslash
import { signal } from "@preact/signals-core";

const counter = signal(10);
```

</template>

<template #2>

```ts twoslash
import { signal } from "@preact/signals-core";

const counter = signal(10);

type Simplify<T extends Record<any, any>> = {
  [TKey in keyof T]: T[TKey];
};
type Sig = Simplify<typeof counter>;
```

</template>

<template #3>

```ts twoslash
import { signal, computed } from "@preact/signals-core";

const counter = signal(10);
const doubled = computed(() => counter.value * 2);
```

</template>

<template #4>

```ts {monaco-run} {height: 'auto'}
import { signal, computed, effect } from "@preact/signals-core";

const counter = signal(10);
const doubled = computed(() => counter.value * 2);

effect(() => {
  console.log(doubled.value);
});
```

</template>

</v-switch>

<!--
Let's explore api of signals

Check signal type.

value, peek - subscribtions of parent scope to signal

Check computed signal type

effects

Writing part:
- show how effects reacts on signal change
- how to dispose effect
- show example with conditional execution of effect (add logCounter signal)
- show effect dispose function
- show infinite loop caused by effect
-->

---
layout: quote
class: text-center
---

# Let's explore how to use preact signals in practice

---

## Signals downsides

<v-clicks>

- complexity
- debugging
- mixing `useState` with signals

</v-clicks>

<!--
Seems like signals is cool and we should use it everywhere

[click]
gives you an opportunity to add unnecessary complexity to the app. You can make simple things harder

[click]

It can be tricky to debug reactivity, because side effect can throw when you do not expect it to
[click]
If you want to create computed/memos/effect - you need to convert all values from state to signals or vice versa


Every technology should be used with a purpose...
-->

---
layout: quote
class: text-center
---

## One more thing

---
layout: iframe
url: https://stackblitz.com/edit/vitejs-vite-unqckw?embed=1&file=src%2FApp.tsx
---

---
layout: iframe
url: https://preact-signals.netlify.app/
---

---

<!-- [TODO] add linkedin in with info -->

# Thank you for attention

<div class="grid grid-cols-[1fr_1fr_1fr] gap-4">

<div class="flex flex-col items-start gap-2 [&>p]:contents">
<a href='https://t.me/javastrippt'>Telegram (javastrippt)</a>
<img alt='alt text' src='/tg-qr-code.svg' />
</div>

<div class="flex flex-col items-start gap-2">
<a href='https://github.com/XantreDev'>
GitHub (XantreDev)
</a>
<img alt="alt text" src='/github-qr-code.svg' />
</div>

<div class="flex flex-col items-start gap-2">
<a href='https://x.com/Xantre_'>
Twitter/X (Xantre_)
</a>
<img alt="alt text" src="/twitter-qr-code.svg" />
</div>

</div>

<!--
Спасибо

Канал

Github

Twitter

Презентация - в open source

Спасибо саше

Отвечаем на вопросы
-->
