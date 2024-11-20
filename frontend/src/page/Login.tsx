import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { tokenAtom } from '../store/atoms';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

export default function Login() {
    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const submitRef = useRef<HTMLButtonElement>(null);
    const [user, setUser] = useRecoilState(tokenAtom);

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailRef.current?.value || !passwordRef.current?.value) return;
        submitRef.current?.setAttribute('disabled', 'true');
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios.post('http://localhost:8081/login', {
            username: email,
            password: password
        }).then((response) => {
            setUser(response.data.token);
        }).catch((error) => {
            console.log(error);
            submitRef.current?.removeAttribute('disabled');
            alert(error.message)
        })
    }

    return (
        <section>
            <form className="loginContainer" onSubmit={handleSubmit}>
                <img className='logo' src={"src/assets/react.svg"} alt='Logo' />
                <h1>Sign in</h1>
                <span>Use your Admin Account</span>
                <input
                    type="text"
                    ref={emailRef}
                    required
                    defaultValue={"admin"}
                    placeholder="Email or phone"
                />
                <input
                    type="password"
                    ref={passwordRef}
                    required
                    defaultValue={"admin"}
                    min={6}
                    placeholder="Email your password"
                />
                <div>
                    <a onClick={() => alert("Currently in progress")}>Forgot your password?</a>
                    <button
                        type="submit"
                        onSubmit={handleSubmit}
                        ref={submitRef}
                    >Sign in</button>
                </div>
            </form>
        </section >
    )
}