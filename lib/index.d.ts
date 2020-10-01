export declare const register: <S, SK>() => {
    setState: (stateKey: keyof S, stateAtKey: S[keyof S]) => void;
    fromStateOnce: <K extends keyof S>(stateKeys: K[], fn: (state: S) => any) => void;
    fromState: <K_1 extends keyof S>(subKey: SK, stateKeys: K_1[], fn: (state: S) => any) => void;
    fromStateWhile: <K_2 extends keyof S>(subKey: SK, condition: (state: S) => boolean, stateKeys: K_2[], fn: (state: S) => any) => void;
    fromNextState: <K_3 extends keyof S>(subKey: SK, stateKeys: K_3[], fn: (state: S) => any) => void;
    fromNextStateWhile: <K_4 extends keyof S>(subKey: SK, condition: (state: S) => boolean, stateKeys: K_4[], fn: (state: S) => any) => void;
};
