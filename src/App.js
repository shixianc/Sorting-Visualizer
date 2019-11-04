import React from 'react';
import SortingVisualizer from './SortingVisualizer/SortingVisualizer';
import './App.css';

function App() {
    let div = <>
        <div className="App">
            <div className="website-header"><div className="disable-select">Sorting Algorithms Visualizer</div></div>
            <SortingVisualizer></SortingVisualizer>
        </div>
    </>;
    return div;
}
export default App;

//TODO:把buttons放到单独的files，保证在bars的下面