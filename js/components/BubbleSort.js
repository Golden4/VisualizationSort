define([
    'Base/Component',
    'Comp/Graphic'
], function (Component, Graphic) {
    'use strict';

    class BubbleSort extends Component {
        constructor(options) {
            super(options);
            this.state.sorter = null;
            this.state.numbers = this.options.numbers;
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
            this.state.graphic.setNumbers(numbers);
        }

        render(options) {
            this.state.graphic = this.childrens.create(Graphic, { numbers: this.state.numbers });
            return `<div>${this.state.graphic}</div>`;
        }

        onTick(self) {
            if (self.state.sorter) {
                const generatorValue = self.state.sorter.next();

                if (generatorValue.value.operationType == 1) {
                    self.state.graphic.changeColor({ numberIndexes: generatorValue.value.numberIndexes, bgStyleColumn: 'yellow', bgStyleNumber: 'yellow' });
                }

                if (generatorValue.value.operationType == 2) {
                    self.state.graphic.setNumbers(self.state.numbers);
                    self.state.graphic.changeColor({ numberIndexes: generatorValue.value.numberIndexes, bgStyleColumn: 'red', bgStyleNumber: 'red' });
                }

                if (generatorValue.value.operationType == 3) {
                    self.state.graphic.changeColor({ numberIndexes: [generatorValue.value.sortedIndex], bgStyleColumn: '#00f400', bgStyleNumber: '#00f400' });
                }

                if (generatorValue.done) {
                    console.log('done');
                    self.state.graphic.changeColor({ bgStyleColumn: '#00f400', bgStyleNumber: '#00f400' });
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