import Header from '../components/Header';
import Card from '../components/Card';
import UserRow from '../components/UserRow';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil';
import { blockedUserAtom, subscribeUserAtom, tokenAtom } from '../store/atoms';
import axios from 'axios';

function App() {
  const session = useRecoilValue(tokenAtom);
  const [subscribedUser, setSubscribedUser] = useState([]);
  const [blockedUser, setBlockedUser] = useState([]);
  const [subscribeUser, setSubscribeUser] = useRecoilState(subscribeUserAtom);
  const [blockUser, setBlockUser] = useRecoilState(blockedUserAtom);
  const naivgate = useNavigate();

  useEffect(() => {
    if (!session || session === null) {
      naivgate('/login');
    }
    axios.get('http://localhost:8081/users', {
      headers: {
        Authorization: session
      }
    }).then(({ data }) => {
      const subscribers = data.subscribers;
      setSubscribedUser(subscribers);
      setBlockedUser(data.blockedUsers);
      setSubscribeUser(subscribers.length);
      setBlockUser(data.blockedUsers.length);
    });
  }, [session]);

  return (
    <div>
      <Header />

      <section>
        <h1>Users</h1>

        <div className='cards'>
          <Card title="Total Users" users={subscribeUser + blockUser} />
          <Card title="Subscribed Users" users={subscribeUser} />
          <Card title='Blocked Users' users={blockUser} />
        </div>

        <ul className='lists'>

          {/* Subscribed Users */}
          {subscribedUser.map((user) => (
            <UserRow user={user} subscribed={true} key={user[0]}/>
          ))}


          {/* Blocked Users */}
          {blockedUser.map((user) => (
            <UserRow user={user} subscribed={false} key={user[0]}/>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default App;