export declare const register: <S, SK>() => {
    setState: (stateKey: keyof S, stateAtKey: S[keyof S]) => void;
    fromStateOnce: (fn: (state: S) => any) => void;
    fromState: <K extends keyof S>(subKey: SK, stateKeys: K[], fn: (state: S) => any) => void;
    fromStateWhile: <K_1 extends keyof S>(subKey: SK, condition: (state: S) => boolean, stateKeys: K_1[], fn: (state: S) => any) => void;
    fromNextState: <K_2 extends keyof S>(subKey: SK, stateKeys: K_2[], fn: (state: S) => any) => void;
    fromNextStateWhile: <K_3 extends keyof S>(subKey: SK, condition: (state: S) => boolean, stateKeys: K_3[], fn: (state: S) => any) => void;
};
export declare type LeanState<S, SK> = {
    setState: (state: any, subs: any) => (stateKey: keyof S, stateAtKey: S[keyof S]) => void;
    fromStateOnce: (state: any) => <K extends keyof S>(stateKeys: K[], fn: (state: S) => any) => void;
    fromState: (state: any, subs: any) => <K extends keyof S>(subKey: SK, stateKeys: K[], fn: (state: S) => any) => void;
    fromStateWhile: (state: any, subs: any) => <K extends keyof S>(subKey: SK, condition: (state: S) => boolean, stateKeys: K[], fn: (state: S) => any) => void;
    fromNextState: (subs: any) => <K extends keyof S>(subKey: SK, stateKeys: K[], fn: (state: S) => any) => void;
    fromNextStateWhile: (state: any, subs: any) => <K extends keyof S>(subKey: SK, condition: (state: S) => boolean, stateKeys: K[], fn: (state: S) => any) => void;
};
