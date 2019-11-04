export function mergeSortAnimations(array){
    const animations = [];

    //corner case
    if (array.length <= 1){
        return array;
    }

    const helper = array.slice();
    mergeSortHelper(array, helper, animations, 0, array.length - 1);
    return animations;
}

function mergeSortHelper(array, helper, animations, left, right) {
    if (left === right){
        return;
    }
    const middleIndex = Math.floor((right+left) / 2);
    mergeSortHelper(helper, array, animations, left, middleIndex);
    mergeSortHelper(helper, array, animations, middleIndex + 1, right);

    //merging
    let i = left, j = middleIndex + 1, k = left;
    while (i <= middleIndex && j <= right){

        //selecting two bars adding color
        animations.push([i, j]);
        //revert two bars to original color
        animations.push([i, j]);

        if (helper[i] < helper[j]){
            animations.push([k, helper[i]]);
            array[k++] = helper[i++];
        } else {
            animations.push([k, helper[j]]);
            array[k++] = helper[j++];
        }
    }
    //adding remaining numbers to original array
    while(i <= middleIndex) {
        animations.push([i, i]);
        animations.push([i, i]);
        animations.push([k, helper[i]]);
        array[k++] = helper[i++];
    }
    while(j <= right){
        animations.push([j, j]);
        animations.push([j, j]);
        animations.push([k, helper[j]]);
        array[k++] = helper[j++];
    }
}

export function quickSortAnimations(array){
    const pivotAnimations = [];
    const animations = [];
    if (array.length <= 1){
        return array;
    }
    quickSortHelper(array, pivotAnimations, animations, 0, array.length - 1);
    return [pivotAnimations, animations];
}

function quickSortHelper(array, pivotAnimations, animations, left, right){
    if (left >= right){
        return;
    }

    //const index = Math.floor(Math.random() * (right - left + 1) + left);
    //however, for simplicity we set index to right for each stack.
    const index = right;
    pivotAnimations.push([index, right - left]); //1.1 highlight pivot index, and record while loop iterations.

    let i = left, j = right - 1;
    while (i <= j){

        //2.1 highlight with comparing color
        animations.push(i);

        if (array[i] <= array[index]){

            //2.2 swap heights and color
            animations.push([i, i, array[i], array[i]]);
            //2.3 revert its highlight color
            animations.push(i);

            i++;
        } else {

            //2.2 swap heights and color
            animations.push([i, j, array[i], array[j]]);
            //2.3 revert its highlight color
            animations.push(j);

            swap(array, i, j);
            j--;
        }
    }

    // 1.2 revert pivot highlight
    pivotAnimations.push(index);
    //1.3 swap back animation
    pivotAnimations.push([i, index, array[i], array[index]]);

    swap(array, i, right);

    quickSortHelper(array, pivotAnimations, animations, left, i - 1);
    quickSortHelper(array, pivotAnimations, animations, i + 1, right);

}

function swap(array, i, j){
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

export function heapSortAnimations(array){
    const animations = [];

    //corner cases
    if (array.length <= 1){
        return array;
    }

    const n = array.length;

    //heapify
    // "curr = n / - 1" represents the last internal nodes. takes O(n) time to achieve max heap
    for (let curr = Math.floor(n / 2 - 1); curr >= 0; curr--){
        heapify(array, animations, n, curr);
    }

    //sort
    for (let i = n - 1; i >= 0; i--){

        //animations explanation : 1. highlight 2. de-highlight 3. swap bars' heights
        animations.push([0, i]);
        animations.push([0, i]);
        animations.push([0, i, array[0], array[i]]);

        //swapping the current max to the right side -> achieve an ascending array.
        swap(array, 0, i);

        heapify(array, animations, i, 0);
    }

    return animations;
}

function heapify(array, animations, size, currMax){    // "percolate down"  -> becomes a max heap
    let max = currMax;
    let leftNode = currMax * 2 + 1;
    let rightNode = currMax * 2 + 2;

    if (leftNode < size && array[leftNode] > array[max]){
        max = leftNode;
    }
    if (rightNode < size && array[rightNode] > array[max]){
        max = rightNode;
    }

    if (max !== currMax){

        animations.push([max, currMax]);
        animations.push([max, currMax]);
        animations.push([max, currMax, array[max], array[currMax]]);

        swap(array, max, currMax);
        heapify(array, animations, size, max);
    }
}

export function bubbleSortAnimations(array){
    const animations = [];
    if (array.length <= 1){
        return array;
    }
    for (let i = 0; i < array.length - 1; i++){
        for (let j = 0; j < array.length - 1 - i; j ++){

            //adding color to the two comparing bars
            animations.push([j, j + 1]);
            //revert comparing colors
            animations.push([j, j + 1]);

            if (array[j] > array[j + 1]){
                animations.push([j, j + 1, array[j], array[j + 1]]);
                swap(array, j, j + 1);
            } else {
                animations.push([j, j, array[j], array[j]]);
            }

        }
    }

    return animations;
}