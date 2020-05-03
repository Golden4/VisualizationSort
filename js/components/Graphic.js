define([
    'Base/Component',
    'Comp/NumberList'
], function (Component, NumberList) {
    'use strict';

    class Graphic extends Component {

        constructor(options) {
            super(options);
            this.state.columnsVisual = [];
            if (this.options.numbers) {
                this.state.numbers = this.options.numbers;
            } else
                this.state.numbers = Array.from({ length: 40 }, () => Math.floor(Math.random() * 40));
        }

        changeColor({ numberIndexes, bgStyleNumber, bgStyleColumn, reset = true }) {

            if (reset) {
                this.resetAllColors();
            }

            if (numberIndexes) {
                for (let i = 0; i < numberIndexes.length; i++) {
                    this.state.columnsVisual[numberIndexes[i]].style.background = bgStyleColumn;
                }
            } else {
                for (let i = 0; i < this.state.columnsVisual.length; i++) {
                    this.state.columnsVisual[i].style.background = bgStyleColumn;
                }
            }
        }

        resetAllColors() {
            for (let i = 0; i < this.state.columnsVisual.length; i++) {
                this.state.columnsVisual[i].style.background = null;
            }
        }

        setNumbers(numbers = []) {
            this.state.numbers = numbers;
            this.update();
        }

        renderContent(options, { numbers }) {
            const maxNum = Math.max.apply(null, numbers);
            const minNum = Math.min.apply(null, numbers);

            const s = function (num) {
                let div = document.createElement('div');
                div.className = "graphic__column";
                const persent = (((num - minNum) * 96) / (maxNum - minNum)) + 2;
                div.style.height = persent + '%';

                return div.outerHTML;
            }.bind(this);

            const graphicRender = numbers.map(s).join('');

            return `
            <div class="graphic__maxNum">${maxNum}</div>
            <div class="graphic__minNum">${minNum}</div>
            <div class="graphic__visual">${graphicRender}</div>`;
        }

        render(options, { numbers }) {
            return `<div class="graphic">
            ${this.renderContent(options, { numbers })}
            </div>`;
        }

        afterRender() {
            this.state.columnsVisual = this.getContainer().querySelectorAll('.graphic__column');
        }
    }

    return Graphic;
});