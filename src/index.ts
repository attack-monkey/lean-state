type Subscriptions<S> = Record<string, Record<string, (s: S) => void >>

const setState_ = <S>(state, subs) => (stateKey: keyof S, stateAtKey: S[keyof S]) => {
  const state_ = state as S
  const subs_ = subs as Subscriptions<S>
  ;state_[stateKey] = stateAtKey

  ;subs_[stateKey as string] && Object.keys(subs[stateKey] as Object).forEach(subKey => {
    subs_[stateKey as string][subKey as string](state_)
  })
}

const fromStateOnce_ = <S, SK>(state, subs) => <K extends keyof S>(stateKeys: K[], fn: (state: S) => any) => {
  const state_ = state as S
  fn(state_)
}

const fromState_ = <S, SK>(state, subs) => <K extends keyof S>(subKey: SK, stateKeys: K[], fn: (state: S) => any) => {
  const state_ = state as S
  const subs_ = subs as Subscriptions<S>
  stateKeys.forEach(stateKey => {
    subs_[stateKey as string] = subs_[stateKey as string] ? subs_[stateKey as string] : {}
    subs_[stateKey as string][subKey as unknown as string] = fn as any
  })
  fn(state_)
}

const fromNextState_ = <S, SK>(state, subs) => <K extends keyof S>(subKey: SK, stateKeys: K[], fn: (state: S) => any) => {
  const state_ = state as S
  const subs_ = subs as Subscriptions<S>
  stateKeys.forEach(stateKey => {
    subs_[stateKey as string] = subs_[stateKey as string] ? subs_[stateKey as string] : {}
    subs_[stateKey as string][subKey as unknown as string] = fn as any
  })
}

const fromStateWhile_ = <S, SK>(state, subs) => <K extends keyof S>(subKey: SK, condition: (state: S) => boolean, stateKeys: K[], fn: (state: S) => any) => {
  const state_ = state as S
  const subs_ = subs as Subscriptions<S>
  if(condition(state_)) {
    stateKeys.forEach(stateKey => {
      subs_[stateKey as string] = subs_[stateKey as string] ? subs_[stateKey as string] : {}
      subs_[stateKey as string][subKey as unknown as string] = fn as any
    })
    fn(state_)
  } else {
    stateKeys.forEach(stateKey => {
      delete subs_[stateKey as string][subKey as unknown as string]
    })
  }
}

const fromNextStateWhile_ = <S, SK>(state, subs) => <K extends keyof S>(subKey: SK, condition: (state: S) => boolean, stateKeys: K[], fn: (state: S) => any) => {
  const state_ = state as S
  const subs_ = subs as Subscriptions<S>
  if(condition(state_)) {
    stateKeys.forEach(stateKey => {
      subs_[stateKey as string] = subs_[stateKey as string] ? subs_[stateKey as string] : {}
      subs_[stateKey as string][subKey as unknown as string] = fn as any
    })
  } else {
    stateKeys.forEach(stateKey => {
      delete subs_[stateKey as string][subKey as unknown as string]
    })
  }
}

export const register = <S, SK>() => {
  let state: any = {}
  let subs: any = {}
  return {
    setState: setState_<S>(state, subs),
    fromStateOnce: fromStateOnce_<S, SK>(state, subs),
    fromState: fromState_<S, SK>(state, subs),
    fromStateWhile: fromStateWhile_<S, SK>(state, subs),
    fromNextState: fromNextState_<S, SK>(state, subs),
    fromNextStateWhile: fromNextStateWhile_<S, SK>(state, subs)
  }
}


