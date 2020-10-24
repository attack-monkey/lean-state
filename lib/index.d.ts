export declare const register: <S, SK>() => {
    set: <K extends keyof S>(key: K) => {
        with: (value: S[K]) => void;
        at: <IK extends keyof S[K]>(itemKey: IK) => {
            with: (item: S[K][IK]) => void;
        };
    };
    get: () => S;
    once: (fn: (state: S) => any) => void;
    listenOn: (subKey: SK) => {
        for: <K_1 extends keyof S>(keys: K_1[]) => {
            subscribe: (fn: (state: S) => any) => void;
            while: (condition: (state: S) => boolean) => {
                subscribe: (fn: (state: S) => any) => void;
            };
        };
        fromNext: <K_2 extends keyof S>(keys: K_2[]) => {
            subscribe: (fn: (state: S) => any) => void;
            while: (condition: (state: S) => boolean) => {
                subscribe: (fn: (state: S) => any) => void;
            };
        };
    };
};
export declare type LeanState<S, SK> = {
    set: <K extends keyof S>(key: K) => ({
        with: (value: S[K]) => void;
    });
    get: <S>() => S;
    once: (fn: (state: S) => any) => void;
    listenOn: (subscriptionKey: SK) => ({
        for: <K extends keyof S>(key: K[]) => ({
            while: (condition: (state: S) => boolean) => ({
                subscribe: (fn: (state: S) => any) => void;
            });
            subscribe: (fn: (state: S) => any) => void;
        });
        fromNext: <K extends keyof S>(key: K[]) => ({
            while: (condition: (state: S) => boolean) => ({
                subscribe: (fn: (state: S) => any) => void;
            });
            subscribe: (fn: (state: S) => any) => void;
        });
    });
};
