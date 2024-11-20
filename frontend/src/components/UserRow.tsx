import { useRecoilValue, useSetRecoilState } from "recoil";
import { blockedUserAtom, subscribeUserAtom, tokenAtom } from "../store/atoms";
import axios from "axios";

export default function UserRow({ user, subscribed }: { user: Array<number | string>, subscribed: boolean }) {
    const session = useRecoilValue(tokenAtom);
    const setSubscribedUser = useSetRecoilState(subscribeUserAtom);
    const setBlockedUser = useSetRecoilState(blockedUserAtom);

    const handleSubscription = async (session: string | null) => {
        console.log('session', session);
        setSubscribedUser(prev => prev + 1);
        setBlockedUser(prev => prev > 0 ? prev - 1 : 0);
        await axios.get(`http://localhost:8081/unblock/${user[0]}`, {
            headers: {
                Authorization: session
            }
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleBlock = async (session: string | null) => {
        setBlockedUser(prev => prev + 1);
        setSubscribedUser(prev => prev > 0 ? prev - 1 : 0);
        await axios.get(`http://localhost:8081/block/${user[0]}`, {
            headers: {
                Authorization: session
            }
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <li key={user[0]}>
            <div>
                <p>{user[0]}</p>
                <p>{user[1]}</p>
            </div>
            <div>
                <input type='radio' name={`${user[0]}subscibed`} value='subscribed' id={`${user[0]}subscribe`} defaultChecked={subscribed}
                    onChange={(e) => {
                        if (e.target.checked) {
                            handleSubscription(session);
                        } else {
                            handleBlock(session);
                        }
                    }}
                />
                <label htmlFor={`${user[0]}subscribe`}>Subscribed</label>
                <input type='radio' name={`${user[0]}subscibed`} value='blocked' id={`${user[0]}blocked`} defaultChecked={!subscribed}
                    onChange={(e) => {
                        if (e.target.checked) {
                            handleBlock(session);
                        } else {
                            handleSubscription(session);
                        }
                    }}
                />
                <label htmlFor={`${user[0]}blocked`}>Blocked</label>
            </div>
        </li>
    )
}