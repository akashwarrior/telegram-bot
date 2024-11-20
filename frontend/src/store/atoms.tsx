import { atom } from "recoil";

const tokenAtom = atom({
    key: 'user',
    default: localStorage.getItem('token'),
    effects_UNSTABLE: [
        ({ onSet }) => {
            onSet((newToken) => {
                newToken ? localStorage.setItem('token', newToken as string) : localStorage.removeItem('token');
            });
        }
    ]
});

const subscribeUserAtom = atom<number>({
    key: 'subscribeUser',
    default: 0
});

const blockedUserAtom = atom<number>({
    key: 'blockedUser',
    default: 0
});

export { subscribeUserAtom, tokenAtom, blockedUserAtom };