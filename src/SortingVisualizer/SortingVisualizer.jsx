import React from 'react';
import './SortingVisualizer.css';
import {bubbleSortAnimations, mergeSortAnimations, quickSortAnimations, heapSortAnimations} from '../sortingAlgorithms/sortingAlgorithms';

//Constant Parameters:
const MAIN_COLOR = 'Teal';
const COMPARING_COLOR = 'Yellow';
const HIGHLIGHT_COLOR = 'Red';
const FINISH_COLOR = 'Purple';
const ANIMATION_SPEED = 3; //lower -> faster
const BUBBLE_SPEED = 0.2;
const TOTAL_BARS = window.innerWidth/5 - 30;
//const TOTAL_BARS = 8; for testing use
//90 is the button height plus margins for better display
const MAX_BAR_HEIGHT = window.innerHeight - 140;
//total number of nodes on top stack of mergesort, used for changing finish_color
const MERGESORT_TOP_STACK = TOTAL_BARS * 3 * (Math.log2(TOTAL_BARS) - 1);

export default class SortingVisualizer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            array: [],
        };
    }

    componentDidMount() {
        this.resetArray();
    }

    resetArray() {
        const barsArray = document.getElementsByClassName('array-bar');
        if (barsArray.length !== 0){
            for (let i = 0; i < TOTAL_BARS; i++){
                barsArray[i].style.backgroundColor = MAIN_COLOR;
            }
        }

        const array = [];
        for (let i = 0; i < TOTAL_BARS; i++){
            array.push(randomIntGenerator(5, MAX_BAR_HEIGHT));
        }
        this.setState({array});
    }

    mergeSort(){
        const animations = mergeSortAnimations(this.state.array);
        const barsArray = document.getElementsByClassName('array-bar');
        for (let i = 0; i < animations.length; i++){
            const colorChanging = i % 3 !== 2;   //true, true, false
            if (colorChanging){
                const [bar1Index, bar2Index] = animations[i];
                const bar1Style = barsArray[bar1Index].style;
                const bar2Style = barsArray[bar2Index].style;
                const color = i % 3 === 0 ? COMPARING_COLOR : MAIN_COLOR;
                setTimeout(() => {
                    bar1Style.backgroundColor = i >= MERGESORT_TOP_STACK? FINISH_COLOR : color;
                    bar2Style.backgroundColor = i >= MERGESORT_TOP_STACK? FINISH_COLOR : color;
                },  i * ANIMATION_SPEED);
            } else {
                setTimeout(() => {
                    const [bar1Index, newHeight] = animations[i];
                    const bar1Style = barsArray[bar1Index].style;
                    bar1Style.height = `${newHeight}px`;
                }, i* ANIMATION_SPEED);
            }
        }
    }


    quickSort(){
        const animationsArray = quickSortAnimations(this.state.array);

        const pivotAnimations = animationsArray[0];
        const animations = animationsArray[1];

        const barsArray = document.getElementsByClassName('array-bar');

        let i = 0, loopsOffset = 0;
        while (i < pivotAnimations.length){

            //highlighting pivot and record number of while loops
            const [pivotIndex, loops] = pivotAnimations[i];
            const pivotStyle = barsArray[pivotIndex].style;
            setTimeout(() => {
                pivotStyle.backgroundColor = HIGHLIGHT_COLOR;
            }, (i + loopsOffset) * ANIMATION_SPEED);

            for (let j = 0; j < loops * 3; j++){

                let step = (loopsOffset + j) % 3;
                if (step === 0){
                    const aIndex = animations[loopsOffset + j];
                    const aStyle = barsArray[aIndex].style;
                    setTimeout(() => {
                        aStyle.backgroundColor = COMPARING_COLOR;
                    }, (i+ j+loopsOffset) * ANIMATION_SPEED);
                } else if (step === 1){
                    const [aIndex, bIndex, heightA, heightB] = animations[loopsOffset + j];
                    if (aIndex === bIndex){
                        continue;
                    }
                    const aStyle = barsArray[aIndex].style;
                    const bStyle = barsArray[bIndex].style;
                    setTimeout(() => {
                        const colorTemp1 = aStyle.backgroundColor;
                        aStyle.backgroundColor = bStyle.backgroundColor;
                        bStyle.backgroundColor = colorTemp1;
                        aStyle.height = `${heightB}px`;
                        bStyle.height = `${heightA}px`;
                    }, (i+ j+loopsOffset) * ANIMATION_SPEED);
                } else {  //j === 2
                    const aIndex = animations[loopsOffset + j];
                    const aStyle = barsArray[aIndex].style;
                    setTimeout(() => {
                        aStyle.backgroundColor = MAIN_COLOR;
                    }, (i + j+loopsOffset) * ANIMATION_SPEED);
                }
            }
            loopsOffset += loops * 3;

            //revert pivot color
            i++;
            const newIndex = pivotAnimations[i];
            const newStyle = barsArray[newIndex].style;
            setTimeout(() => {
                newStyle.backgroundColor = MAIN_COLOR;
            }, (i+loopsOffset) * ANIMATION_SPEED);

            //swap back pivot and color
            i++;
            const [iIndex, rightIndex, iHeight, rightHeight] = pivotAnimations[i];
            const iStyle = barsArray[iIndex].style;
            const rightStyle = barsArray[rightIndex].style;
            setTimeout(() => {
                iStyle.height = `${rightHeight}px`;
                rightStyle.height = `${iHeight}px`;
            }, (i+loopsOffset) * ANIMATION_SPEED);

            i++;

            if (i === pivotAnimations.length){
                //finalizing - setting all bars to finish color
                setTimeout(()=>{
                    for (let i = 0; i < TOTAL_BARS; i++){
                        barsArray[i].style.backgroundColor = FINISH_COLOR;
                    }
                }, (i + loopsOffset) * ANIMATION_SPEED);
            }
        }


    }

    heapSort() {

        const animations = heapSortAnimations(this.state.array);
        const barsArray = document.getElementsByClassName('array-bar');

        let finishPivot = this.state.array.length - 1;
        for (let i = 0; i < animations.length; i++) {
            const colorChanging = i % 3 !== 2;   //true, true, false
            if (colorChanging) {
                const [bar1Index, bar2Index] = animations[i];
                const bar1Style = barsArray[bar1Index].style;
                const bar2Style = barsArray[bar2Index].style;
                const color = i % 3 === 0 ? COMPARING_COLOR : MAIN_COLOR;
                setTimeout(() => {
                    bar1Style.backgroundColor = color;
                    if (bar1Index === 0 && bar2Index === finishPivot){
                        bar2Style.backgroundColor = FINISH_COLOR;
                        finishPivot--;
                    }
                }, i * ANIMATION_SPEED);
            } else {
                const [bar1Index, bar2Index, height1, height2] = animations[i];
                const bar1Style = barsArray[bar1Index].style;
                const bar2Style = barsArray[bar2Index].style;
                setTimeout(() => {
                    bar1Style.height = `${height2}px`;
                    bar2Style.height = `${height1}px`;
                }, i * ANIMATION_SPEED);
            }
        }

        //fix first bar exception -> finish color
        setTimeout(() => {
            barsArray[0].style.backgroundColor = FINISH_COLOR;
        }, animations.length * ANIMATION_SPEED);
    }

    bubbleSort(){
        const animations = bubbleSortAnimations(this.state.array);
        const barsArray = document.getElementsByClassName('array-bar');
        for (let i = 0; i < animations.length; i++){
            let step = i % 3;
            if (step === 2){
                const [bar1Index, bar2Index, height1, height2] = animations[i];
                const bar1Style = barsArray[bar1Index].style;
                const bar2Style = barsArray[bar2Index].style;
                setTimeout(() => {
                    bar1Style.height = `${height2}px`;
                    bar2Style.height = `${height1}px`;
                }, i * BUBBLE_SPEED)
            } else { // step == 1 / 2 color changing
                const [bar1Index, bar2Index] = animations[i];
                const bar1Style = barsArray[bar1Index].style;
                const bar2Style = barsArray[bar2Index].style;
                const color = step === 0 ? COMPARING_COLOR : MAIN_COLOR;
                setTimeout(() => {
                    bar1Style.backgroundColor = color;
                    bar2Style.backgroundColor = color;
                }, i * BUBBLE_SPEED)
            }
        }
        setTimeout(()=>{
            for (let i = 0; i < TOTAL_BARS; i++){
                barsArray[i].style.backgroundColor = FINISH_COLOR;
            }
        }, (animations.length) * BUBBLE_SPEED);
    }

    render() {
        const {array} = this.state;

        return (

            <div className="array-container">
                {array.map((value, idx) => (
                    <div
                        className="array-bar"
                        key={idx}
                        style={{
                            value: `${value}`,
                            backgroundColor: MAIN_COLOR,
                            height: `${value}px`,
                        }}/>
                ))}
                <div className="new-button" onClick={() => this.resetArray()}><div className="disable-select">Generate New Array</div></div>
                <div className="algorithm-button" onClick={() => this.mergeSort()}><div className="disable-select">Merge Sort</div></div>
                <div className="algorithm-button" onClick={() => this.quickSort()}><div className="disable-select">Quick Sort</div></div>
                <div className="algorithm-button" onClick={() => this.heapSort()}><div className="disable-select">Heap Sort</div></div>
                <div className="algorithm-button" onClick={() => {

                    function bubbleAlert() {
                        alert("Due to Bubble Sort's O(n^2) average time complexity, its Animation is speed up by 15 times faster");
                    }

                    bubbleAlert(); this.bubbleSort()}}><div className="disable-select">Bubble Sort</div></div>
            </div>
        );
    }
}

function randomIntGenerator(left, right) {
    return Math.floor(Math.random() * (right - left + 1) + left);
}


