define([
    'Base/Component'
], function (Component) {
    'use strict';

    class Graphic extends Component {

        constructor(options) {
            super(options);
            this.columnsVisual = [];
            this.numbersVisual = [];

            if (this.options.numbers) {
                this.state.numbers = this.options.numbers;
            } else
                this.state.numbers = Array.from({ length: 40 }, () => Math.floor(Math.random() * 40));;
        }

        afterMount() {
            this.setNumbers(this.state.numbers);
        }

        changeColor({ numberIndexes, bgStyleNumber, bgStyleColumn, reset = true }) {

            if (reset) {
                this.resetAllColors();
            }

            if (numberIndexes) {
                for (let i = 0; i < numberIndexes.length; i++) {
                    this.columnsVisual[numberIndexes[i]].style.background = bgStyleColumn;
                    this.numbersVisual[numberIndexes[i]].style.background = bgStyleNumber;
                }
            } else {
                for (let i = 0; i < this.columnsVisual.length; i++) {
                    this.columnsVisual[i].style.background = bgStyleColumn;
                    this.numbersVisual[i].style.background = bgStyleNumber;
                }
            }
        }

        resetAllColors() {
            for (let i = 0; i < this.columnsVisual.length; i++) {
                this.columnsVisual[i].style.background = null;
            }

            for (let i = 0; i < this.numbersVisual.length; i++) {
                this.numbersVisual[i].style.background = null;
            }
        }

        setNumbers(numbers = []) {
            const maxNum = Math.max.apply(null, numbers);
            const minNum = Math.min.apply(null, numbers);
            this.getContainer().querySelector('.graphic__maxNum').innerHTML = maxNum;
            this.getContainer().querySelector('.graphic__minNum').innerHTML = minNum;

            const graphicVisual = this.getContainer().querySelector('.graphic__visual');
            const graphicNumbersList = this.getContainer().querySelector('.numbersList');
            graphicVisual.innerHTML = '';
            graphicNumbersList.innerHTML = '';
            this.columnsVisual = [];
            this.numbersVisual = [];

            for (let i = 0; i < numbers.length; i++) {
                let div = document.createElement('div');
                div.className = "graphic__column";
                const persent = (((numbers[i] - minNum) * 96) / (maxNum - minNum)) + 2;
                div.style.height = persent + '%';
                graphicVisual.append(div);
                this.columnsVisual.push(div);

                let divN = document.createElement('div');
                divN.className = "numbersList__number";
                divN.innerHTML = numbers[i];
                graphicNumbersList.append(divN);
                this.numbersVisual.push(divN);
            }
        }

        render(options) {
            return `<div class="graphic">
                <div class="graphic__maxNum">max</div>
                <div class="graphic__minNum">min</div>
                <div class="graphic__visual"></div>
                <div class="numbersList">
                </div>
            </div>`;
        }
    }

    return Graphic;
});