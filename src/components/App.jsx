import { useEffect } from "react";
import React from 'react';

const App = () => {
    const url = 'http://localhost:3000/contactos';
    fetch(url)
    .then(response => response.json())
    .then(data => console.log(data));
    return (
        <h1>React</h1>
    )
}

export default App;