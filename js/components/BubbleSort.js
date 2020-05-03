define([
    'Base/Component',
    'Comp/Graphic',
    'Comp/NumberList'
], function (Component, Graphic, NumberList) {
    'use strict';

    class BubbleSort extends Component {
        constructor(options) {
            super(options);
            this.state.sorter = null;
            this.state.numbers = this.options.numbers;

            this.state.numbersList = this.childrens.create(NumberList, { numbers: this.state.numbers });
        }

        getCanSort() {
            return this.state.sorter;
        }

        * bubbleSort(arr) {
            let len = arr.length;
            for (let i = 0; i < len; i++) {
                for (let j = 0; j < len - i - 1; j++) {
                    yield { operationType: 1, numberIndexes: [j, j + 1] };
                    if (arr[j] > arr[j + 1]) {
                        // swap
                        const temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                        yield { operationType: 2, numberIndexes: [j, j + 1] };
                    }
                }
                yield { operationType: 3, sortedIndex: len - i - 1 };
            }
            return arr;
        }

        setNumbers(numbers) {
            this.state.numbers = numbers;
            this.state.numbersList.setNumbers(numbers);
            this.state.graphic.setNumbers(numbers);
        }

        renderContent(options, state) {
            this.state.graphic = this.childrens.create(Graphic, { numbers: this.state.numbers });
            return `${this.state.graphic}
            ${this.state.numbersList}
            `;
        }

        render(options, state) {
            return `<div>${this.renderContent(options, state) || ''}</div>`;
        }

        onTick() {
            if (this.state.sorter) {
                const generatorValue = this.state.sorter.next();

                if (generatorValue.value.operationType == 1) {
                    this.state.graphic.changeColor({ numberIndexes: generatorValue.value.numberIndexes, bgStyleColumn: 'yellow', bgStyleNumber: 'yellow' });
                    this.state.numbersList.setNumbers(this.state.numbers);
                    for (let i = 0; i < generatorValue.value.numberIndexes.length; i++) {
                        this.state.numbersList.changeNumColor(generatorValue.value.numberIndexes[i], 'yellow');
                    }
                }

                if (generatorValue.value.operationType == 2) {
                    this.state.graphic.setNumbers(this.state.numbers);
                    this.state.numbersList.setNumbers(this.state.numbers);
                    this.state.graphic.changeColor({ numberIndexes: generatorValue.value.numberIndexes, bgStyleColumn: 'red', bgStyleNumber: 'red' });

                    for (let i = 0; i < generatorValue.value.numberIndexes.length; i++) {
                        const element = generatorValue.value.numberIndexes[i];
                        this.state.numbersList.changeNumColor(element, 'red');
                    }
                }

                if (generatorValue.value.operationType == 3) {
                    this.state.graphic.changeColor({ numberIndexes: [generatorValue.value.sortedIndex], bgStyleColumn: '#00f400', bgStyleNumber: '#00f400' });
                    this.state.numbersList.changeNumColor(generatorValue.value.sortedIndex, '#00f400');
                }

                if (generatorValue.done) {
                    console.log('done');
                    this.state.numbersList.changeAllNumColor('#00f400');
                    this.state.graphic.changeColor({ bgStyleColumn: '#00f400', bgStyleNumber: '#00f400' });
                    return false;
                }
            }

            return true;
        }

        onStartSort() {
            this.state.sorter = this.bubbleSort(this.state.numbers);
        }

        onStopSort() {
            this.state.sorter = null;
        }

    }

    return BubbleSort;
});