define([
    'Base/Component',
], function (Component) {

    class NumberList extends Component {
        constructor(options) {
            super(options);
            this.numbersVisual = [];
            this.state.numbers = options.numbers;
        }

        setNumbers(numbers) {
            this.state.numbers = numbers;
            this.update();
        }

        changeNumColor(index, bgColor, reset = true) {

            if (reset) {
                this.resetAllColors();
            }

            this.numbersVisual[index].style.background = bgColor;
        }

        changeAllNumColor(bgColor, reset = true) {

            if (reset) {
                this.resetAllColors();
            }

            for (let i = 0; i < this.numbersVisual.length; i++) {
                this.changeNumColor(i, bgColor, false)
            }
        }

        changeNum(index, number) {
            this.numbersVisual[index].innerHTML = number;
        }

        resetAllColors() {
            for (let i = 0; i < this.numbersVisual.length; i++) {
                this.numbersVisual[i].style.background = null;
            }
        }

        renderContent(options, { numbers }) {
            const numbersRender = numbers.map(function (num) {
                const div = `<div class="numbersList__number">${num}</div>`;
                return div;
            }).join('');

            return `${numbersRender}`;

        }

        render(options, { numbers }) {
            return `<div class="numbersList">${this.renderContent(options, { numbers })}</div>`;
        }

        afterRender() {
            this.numbersVisual = this.getContainer().querySelectorAll('.numbersList__number');
        }
    }

    return NumberList;

});