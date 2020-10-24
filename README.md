# lean-state 2.0
A State Manager built for Lean Functional Typescript

> Checkout: https://github.com/attack-monkey/Lean-Functional-Typescript

# Changes from 1.x

- Syntax changes to add more context to queries

# Install

```

npm i lean-state

```

# Use

```

import { register } from 'lean-state'

```

# Basics

```typescript

import { register } from 'lean-state'

type Global = {
  greeting: string
}

type Listeners =
  | 'listener1'
  | 'listener2'
  | 'listener3'

// register
const global = register<Global, Listeners>()

// set
global.set('greeting').with('hello world')

// get
console.log(
  global.get().greeting
)

// get the current and pass to function
global.once(
  ({ greeting }) => console.log(greeting)
)

// set up a listener...
global
  .listenOn('listener1')
  .for(['greeting'])
  .subscribe(({ greeting }) => console.log('listener1: ' + greeting))

// make changes and the listener will react
global.set('greeting').with('howdy y\'all')
global.set('greeting').with('wassup')
global.set('greeting').with('g\'day mate')

// set up a listener that auto tears down when a condition is no longer met
global
  .listenOn('listener2')
  .for(['greeting'])
  .while(({ greeting }) => greeting !== 'stop listening')
  .subscribe(({ greeting }) => console.log('listener2: ' + greeting))

// make changes and both listeners will react
global.set('greeting').with('good day')

// this next change will trigger listener2 to tear down...
global.set('greeting').with('stop listening')

// listeners can also be set up to listen, starting from the next change...
global
  .listenOn('listener3')
  .fromNext(['greeting'])
  .while(({ greeting }) => greeting !== 'stop listening')
  .subscribe(({ greeting }) => console.log('listener3: ' + greeting))

// And more changes...
global.set('greeting').with('heeeey!!!')
global.set('greeting').with('stop listening')

```

# A complex example

Lean-state is a key-value store, so while complex data can be stored at a given key, 
listeners can only listen to changes at that top-level key.

This isn't really a problem at all - but does change the way you think about listening to changes in data.

If for example a key stores a Record of items - but your app is focused on changes only at a given item - then it's a good idea to
also capture which id is being focused on and which id is being changed.

```typescript

import { register } from 'lean-state'

type Car = {
  make: string
  color: string
}

type Global = {
  cars: Record<string, Car>
  lastUpdatedCar: string,
  focusOnCar: string
}

type Listeners = 
  | 'listener1'
  | 'listener2'

const global = register<Global, Listeners>()

const listenToAllCarChanges = () => {
  global
    .listenOn('listener1')
    .fromNext(['lastUpdatedCar'])
    .subscribe(({ cars, lastUpdatedCar }) =>
      console.log(`change to car ${lastUpdatedCar} => ${JSON.stringify(cars[lastUpdatedCar], null, 2)}`)
    )
}

const listenToNewFocusCar = (id: string) => {
  // Set up the car to focus on
  global.set('focusOnCar').with(id)
  global
    .listenOn('listener2')
    // listen to the next change to lastUpdatedCar
    .fromNext(['lastUpdatedCar'])
    .subscribe(({ cars, focusOnCar, lastUpdatedCar }) => {
      if(lastUpdatedCar === focusOnCar) {
        console.log(`Focussed car is ${focusOnCar} and it changed to => ${JSON.stringify(cars[focusOnCar], null, 2)}`)
      }
    })
}

const setInitialData = () => {
  global.set('cars').with({
    '1': { make: 'Toyota', color: 'red' },
    '2': { make: 'Toyota', color: 'blue'}
  })
  global.set('focusOnCar').with('1')
}

const updateCar = (id: string) => ({
  with: (car: Car) => {
    global.set('cars').at(id).with(car)
    global.set('lastUpdatedCar').with(id)
  }
})

// Set up data
setInitialData()

// Set up listeners
listenToAllCarChanges()
listenToNewFocusCar('1')

// Make updates
updateCar('3').with({ make: 'Corvette', color: 'red' })
updateCar('1').with({ make: 'Ferrari', color: 'pink' })

// Change focus car, which re-creates the listener
listenToNewFocusCar('2')

// Make more changes
updateCar('1').with({ make: 'Ferrari', color: 'red' })
updateCar('2').with({ make: 'Lamborgini', color: 'grey' })

```