import { useState } from 'react';
import './App.css';
import Button from './components/Button';

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <h1>Location de matériel</h1>
            <Button content={"Clics : " + count} onClick={() => setCount(count + 1)} />
        </>

    )

}

export default App;