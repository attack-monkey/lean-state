# lean-state
A State Manager built for Lean Functional Typescript

> Checkout: https://github.com/attack-monkey/Lean-Functional-Typescript

# Install

```

npm i lean-state

```

# Use

```

import { register } from 'lean-state'

```

# Basics

First the State interface is created which can be thought of as a schema for your state.

```typescript

interface State {
  greeting?: string
}

```

```typescript

followed by a DU (Discriminated Union) of listener-ids - which represent the individual listeners listening for state changes

type Listeners =
  | 'myListener'

```

Then register State with 

```typescript

`import { register } from 'lean-state'`

const { setState, fromState, fromStateWhile } = register<State, Listeners>()

```

^^ This creates a library of functions that are aware of the State and Listeners within your app.

To initialise state at a given node:

```typescript

setState('greeting', 'hello world') // sends data to state.greeting

```

To register a listener and listen for state changes...

```typescript

// listens to changes in state.greeting and calls myPureFunction with it

fromState(
  'myListener',
  ['greeting'],
  ({ greeting }) => myPureFunction(greeting)
) 

```

To mutate data

```typescript

setState('greeting', 'hello again') // send a data change.

```

# A more complex example

```typescript

// Managing Records of things ...

/*
 * State is a key-val store with Reactive data-flow.
 * So while you can listen for changes in a val at a given key, it's all or nothing.
 * You can't listen for some changes in a val and not others.
 * So when dealing with Records of items, you still need to think in terms of key-val.
 * This requires using other key-vals to help only respond to changes that you care about.
 */

type Cat = {
  name: string
}

type Cats = Record<string, Cat>

// Here we'll use currentCatId to focus in on one particular cat at a time.
// We then use catUpdatedId to indicate which cat is being updated. 
// We listen to this rather than listening to `cats` - because `cats` tells us when any change to `cats` occurs.
// We only care about the currentCat.

// This is a very efficient data-flow, since nothing is actually listening to cats.
// Even currentCatId is a once-only-listener.
// The only thing being listened to is catUpdatedId, and this listener is cleaned up whenever the current cat changes.

type Global = {
  cats: Cats
  currentCatId: string
  catUpdatedId?: string
}

type GlobalListeners =
  | 'myListener'

const global = register<Global, GlobalListeners>()

global.setState('cats', { '1': { name: 'garfield' }})
global.setState('currentCatId', '1')

const listenToNewCat = () => {

  // get the current catId
  global.fromStateOnce(['currentCatId'], ({ currentCatId: comparisonId }) => {
    console.log(`I am the new current cat ${comparisonId}.`)
    // listen for updates on the catUpdatedId ONLY while the current id remains the same - otherwise destroy this listener.
    global.fromNextStateWhile('myListener', ({ currentCatId }) => currentCatId === comparisonId, ['catUpdatedId'], ({ cats, currentCatId, catUpdatedId }) => {
      // Only respond to changes in the current cat
      if(currentCatId === catUpdatedId) {
        console.log(`I am current cat ${ currentCatId } and I just got updated. My name is ${cats ? cats[currentCatId as string].name : 'unknown'}`)
      }
    })
  })
}

listenToNewCat()

const newCats: Cats = {
  '1': {
    name: 'felix'
  }
}

global.setState('cats', newCats)
global.setState('catUpdatedId', '1')

const newCats_: Cats = {
  ...newCats, 
  '2': {
    name: 'Sylvester'
  }
}


global.setState('cats', newCats_)
global.setState('catUpdatedId', '2')

global.setState('currentCatId', '2')
listenToNewCat()

const newCats__: Cats = {
  ...newCats, 
  '2': {
    name: 'Puss n Boots'
  }
}

global.setState('cats', newCats__)
global.setState('catUpdatedId', '2')

```