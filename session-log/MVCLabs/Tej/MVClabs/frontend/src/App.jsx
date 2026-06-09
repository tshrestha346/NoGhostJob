import { useEffect, useState } from "react";
import { fetchTasks } from "./services/api";

export default function App(){
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks().then(setTasks).catch(console.error);
    }, []);

    return (
        <div>
            <h1>Tasks</h1>
            {tasks.map((t) => (
                <div key={t.id}>{t.title}</div>
            ))}
        </div>
    );
}