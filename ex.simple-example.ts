import { register } from './src/index'

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

