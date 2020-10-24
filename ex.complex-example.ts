import { register } from './src/index'

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
  // Set up a lockValue. When the focusOnCar changes from this lockValue, the listener will tear down and need to be re-created
  global.once(({ focusOnCar: lockValue }) => {
    // Only set up the listener if there is a car in focus
    if (lockValue) {
      global
        .listenOn('listener2')
        // listen to the next change to lastUpdatedCar
        .fromNext(['lastUpdatedCar'])
        // Tear listener down if the focusOnCar changes
        .while(({ focusOnCar }) => focusOnCar === lockValue)
        .subscribe(({ cars, focusOnCar, lastUpdatedCar }) => {
          if(lastUpdatedCar === focusOnCar) {
            console.log(`Focussed car is ${focusOnCar} and it changed to => ${JSON.stringify(cars[focusOnCar], null, 2)}`)
          }
        })
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