import { useRef } from "react";
import { useSetRecoilState } from "recoil";
import { tokenAtom } from "../store/atoms";

export default function Header() {
    const setSession = useSetRecoilState(tokenAtom);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <header>
            <p>Admin Panel</p>
            <div>
                <div>
                    <img onClick={() => inputRef.current?.focus()} alt="search icon" src="https://img.icons8.com/ios/452/search--v1.png" />
                    <input ref={inputRef} type="search" placeholder="Search" />
                </div>
                <nav>
                    <img
                        onClick={() => setSession(null)}
                        src={`https://ui-avatars.com/api/?name=admin&background=random`}
                        alt="logo"
                    />
                </nav>
            </div>
        </header>
    )
}