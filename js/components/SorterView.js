define([
    'Base/Component',
    'Comp/Graphic'
], function (Component, Graphic) {
    'use strict';

    class SorterView extends Component {

        constructor(options) {
            super(options);

            if (this.options.numbers)
                this.state.numbers = this.options.numbers;
            else
                this.state.numbers = [];

            this.state.sourceNumbers = [...this.state.numbers];
            this.state.timerInterval = 1000;
            this.state.speed = 1;
            this.state.title = this.options.title;
            this.state.sorterComponent = this.options.sorterComponent;
            this.state.isSorting = false;
        }

        setNumbers(numbers) {
            this.state.numbers = numbers;
            this.state.sourceNumbers = [...this.state.numbers];
            this.reset();
        }

        renderContent(options, { title, sorterComponent }) {
            if (!this.state.sorter) {
                return `<div class="title visualization__title">${title}</div>
                <div class="visualization__content">Задайте массив!</div>`;
            }

            return `<div class="title visualization__title">${title}</div>
            <div class="visualization__field">Скорость: <span class="visualization__speedValue">200</span></div>
                <input class="visualization__addSpeed" type="button" value="Увеличить">
                <input class="visualization__removeSpeed" type="button" value="Уменьшить">
                
                <input class="visualization__resetButton" type="button" value="Сброс">
                <input class="visualization__sortButton" type="button" value="Сортировать">
                <input class="visualization__stopSortButton" type="button" value="Остановить">
                <div class="visualization__content">
                    ${this.state.sorter}
                </div>`;
        }

        render(options, { title, sorterComponent }) {
            return `<div class="module visualization">
                ${this.renderContent(options, { title, sorterComponent })}
            </div>
            `;
        }

        afterRender() {
            if (this.state.sorter) {
                this.sortButton = this.getContainer().querySelector(".visualization__sortButton");
                this.subscribeTo(this.sortButton, 'click', this.startSortBtn.bind(this));

                this.addSpeedButton = this.getContainer().querySelector(".visualization__addSpeed");
                this.subscribeTo(this.addSpeedButton, 'click', this.addSpeedBtn.bind(this));

                this.removeSpeedButton = this.getContainer().querySelector(".visualization__removeSpeed");
                this.subscribeTo(this.removeSpeedButton, 'click', this.removeSpeedBtn.bind(this));

                this.stopSortButton = this.getContainer().querySelector(".visualization__stopSortButton");
                this.subscribeTo(this.stopSortButton, 'click', this.stopSortBtn.bind(this));

                this.resetButton = this.getContainer().querySelector(".visualization__resetButton");
                this.subscribeTo(this.resetButton, 'click', this.resetBtn.bind(this));

                this.state.speedValue = this.getContainer().querySelector(".visualization__speedValue");
                this.state.speedValue.innerHTML = this.state.speed + 'x';
            }
        }

        addSpeedBtn() {
            if (this.state.speed < 2) {
                this.state.speed += 0.25;

                this.state.timerInterval = 500 / this.state.speed;

                this.state.speedValue.innerHTML = this.state.speed + 'x';
            }
        }

        removeSpeedBtn() {
            if (this.state.speed > 0.25) {
                this.state.speed -= 0.25;

                this.state.timerInterval = 500 / this.state.speed;

                this.state.speedValue.innerHTML = this.state.speed + 'x';
            }
        }

        startSortBtn() {
            this.state.sorter.onStartSort();

            if (this.state.sorter.getCanSort() && !this.state.isSorting)
                this.startSort();
        }

        stopSortBtn() {
            this.stopSort();
        }

        resetBtn() {
            this.state.numbers = [...this.state.sourceNumbers];
            this.reset();
        }

        reset() {
            this.stopSort();
            this.unmountChildren();
            this.state.sorter = this.childrens.create(this.state.sorterComponent, { numbers: this.state.numbers });
            this.update();
        }

        recursivelyTimeout(action) {
            if (this.state.isSorting) {
                if (action()) {
                    setTimeout(() => { this.recursivelyTimeout(action) }, this.state.timerInterval);
                }
            }
        }

        startSort() {
            if (!this.state.isSorting) {
                this.state.isSorting = true;
                this.state.sorter.setNumbers(this.state.numbers);

                this.recursivelyTimeout(() => {
                    return this.state.sorter.onTick.bind(this.state.sorter)();
                });
            }
        }

        stopSort() {
            this.state.isSorting = false;
        }

    }

    return SorterView;
});