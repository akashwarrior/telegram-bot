import '../styles/Card.css';

export default function Card({ title, users }: { title: string, users: number }) {
    return (
        <div className="card">
            <h2>{title}</h2>
            <p>{users}</p>
        </div>
    );
};