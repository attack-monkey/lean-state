type Subscriptions<S> = Record<string, Record<string, (s: S) => void>>

const set_ = <S>(state, subs) => <K extends keyof S>(key: K) => ({
  with: (value: S[K]) => {
    const state_ = state as S
    const subs_ = subs as Subscriptions<S>
      ; state_[key] = value
      ; subs_[key as string] && Object.keys(subs[key] as Object).forEach(subKey => {
        subs_[key as string][subKey as string](state_)
      })
  },
  at: <IK extends keyof S[K]>(itemKey: IK) => ({
    with: (item: S[K][IK]) => {
      const state_ = state as S
      const subs_ = subs as Subscriptions<S>
      set_<S>(state_, subs_)(key).with({ ...state_[key], [itemKey] : item } as unknown as S[K])
    }
  })
})

const get_ = <S>(state: S) => () => state

const once_ = <S>(state: S) => (fn: (state: S) => any) => {
  fn(state)
}

const listenOn_ = <S, SK>(state, subs) => (subKey: SK) => ({
  for: <K extends keyof S>(keys: K[]) => ({
    subscribe: (fn: (state: S) => any) => {
      const state_ = state as S
      const subs_ = subs as Subscriptions<S>
      keys.forEach(stateKey => {
        subs_[stateKey as string] = subs_[stateKey as string] ? subs_[stateKey as string] : {}
        subs_[stateKey as string][subKey as unknown as string] = fn as any
      })
      fn(state_)
    },
    while: (condition: (state: S) => boolean) => ({
      subscribe: (fn: (state: S) => any) => {
        const state_ = state as S
        const subs_ = subs as Subscriptions<S>
        if (condition(state_)) {
          keys.forEach(stateKey => {
            subs_[stateKey as string] = subs_[stateKey as string] ? subs_[stateKey as string] : {}
            subs_[stateKey as string][subKey as unknown as string] = (state: S) => {
              // test condition on all future calls
              if (condition(state)) { fn(state) }
              else {
                keys.forEach(stateKey => {
                  if (subs_[stateKey as string] && subs_[stateKey as string][subKey as unknown as string]) {
                    delete subs_[stateKey as string][subKey as unknown as string]
                  }
                })
              }
            }
          })  
          fn(state_)
        }
      }
    })
  }),
  fromNext: <K extends keyof S>(keys: K[]) => ({
    subscribe: (fn: (state: S) => any) => {
      const subs_ = subs as Subscriptions<S>
      keys.forEach(stateKey => {
        subs_[stateKey as string] = subs_[stateKey as string] ? subs_[stateKey as string] : {}
        subs_[stateKey as string][subKey as unknown as string] = fn as any
      })
    },
    while: (condition: (state: S) => boolean) => ({
      subscribe: (fn: (state: S) => any) => {
        const state_ = state as S
        const subs_ = subs as Subscriptions<S>
        keys.forEach(stateKey => {
          subs_[stateKey as string] = subs_[stateKey as string] ? subs_[stateKey as string] : {}
          subs_[stateKey as string][subKey as unknown as string] = (state: S) => {
            // test condition on all future calls
            if (condition(state)) { fn(state) }
            else {
              keys.forEach(stateKey => {
                if (subs_[stateKey as string] && subs_[stateKey as string][subKey as unknown as string]) {
                  delete subs_[stateKey as string][subKey as unknown as string]
                }
              })
            }
          }
        })
      }
    })
  })
})

export const register = <S, SK>() => {
  let state: any = {}
  let subs: any = {}
  return {
    set: set_<S>(state, subs),
    get: get_<S>(state),
    once: once_<S>(state),
    listenOn: listenOn_<S, SK>(state, subs),
  }
}

export type LeanState<S, SK> = {
  set: <K extends keyof S>(key: K) => ({
    with: (value: S[K]) => void
  })
  get: <S>() => S
  once: (fn: (state: S) => any) => void
  listenOn: (subscriptionKey: SK) => ({
    for: <K extends keyof S>(key: K[]) => ({
      while: (condition: (state: S) => boolean) => ({
        subscribe: (fn: (state: S) => any) => void
      })
      subscribe: (fn: (state: S) => any) => void
    })
    fromNext: <K extends keyof S>(key: K[]) => ({
      while: (condition: (state: S) => boolean) => ({
        subscribe: (fn: (state: S) => any) => void
      })
      subscribe: (fn: (state: S) => any) => void
    })
  })
}


