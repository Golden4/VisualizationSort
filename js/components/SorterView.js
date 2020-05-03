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
            else if (this.options.size) {
                this.state.numbers = Array.from({ length: this.options.size }, () => Math.floor(Math.random() * 50));
            } else {
                this.state.numbers = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50));
            }

            this.state.sourceNumbers = [...this.state.numbers];
            this.state.timerInterval = 300;
            this.state.title = this.options.title;
            this.state.sorterComponent = this.options.sorterComponent;
            this.state.isSorting = false;
        }

        setNumbers(numbers) {
            this.state.numbers = numbers;
            this.state.sourceNumbers = [...this.state.numbers];
            this.state.sorter.setNumbers(numbers);
        }

        render(options, { title, sorterComponent }) {
            this.state.sorter = this.childrens.create(sorterComponent, { numbers: this.state.numbers });

            return `<div class="module visualization"><div class="title visualization__title">${title}</div>
            <div class="visualization__field">Интервал между операциями: <span class="visualization__speedValue">200</span></div>
            <input class="visualization__addSpeed" type="button" value="Увеличить">
            <input class="visualization__removeSpeed" type="button" value="Уменьшить">
            
            <input class="visualization__resetButton" type="button" value="Сброс">
            <input class="visualization__sortButton" type="button" value="Сортировать">
            <input class="visualization__stopSortButton" type="button" value="Остановить">
            <div class="visualization__content">
                ${this.state.sorter}
                </div>
            </div>
            `;
        }

        afterMount() {
            const sortBtn = this.getContainer().querySelector(".visualization__sortButton");
            this.subscribeTo(sortBtn, 'click', this.startSortBtn.bind(this));

            const addSpeedBtn = this.getContainer().querySelector(".visualization__addSpeed");
            this.subscribeTo(addSpeedBtn, 'click', this.addSpeedBtn.bind(this));

            const removeSpeedBtn = this.getContainer().querySelector(".visualization__removeSpeed");
            this.subscribeTo(removeSpeedBtn, 'click', this.removeSpeedBtn.bind(this));

            const stopSortButton = this.getContainer().querySelector(".visualization__stopSortButton");
            this.subscribeTo(stopSortButton, 'click', this.stopSortBtn.bind(this));

            const resetButton = this.getContainer().querySelector(".visualization__resetButton");
            this.subscribeTo(resetButton, 'click', this.resetBtn.bind(this));

            this.state.speedValue = this.getContainer().querySelector(".visualization__speedValue");
            this.state.speedValue.innerHTML = this.state.timerInterval + 'ms';
        }

        addSpeedBtn() {

            if (this.state.timerInterval >= 100) {
                this.state.timerInterval += 50;
            }

            this.state.speedValue.innerHTML = this.state.timerInterval + 'ms';
        }

        removeSpeedBtn() {

            if (this.state.timerInterval > 100) {
                this.state.timerInterval -= 50;
            }

            this.state.speedValue.innerHTML = this.state.timerInterval + 'ms';
        }

        startSortBtn() {
            this.state.sorter.onStartSort();

            if (this.state.sorter.getCanSort() && !this.state.isSorting)
                this.startSort(this.state.timerInterval);
        }

        stopSortBtn() {
            this.stopSort();
        }

        resetBtn() {
            this.stopSort();
            this.state.sorter.setNumbers(this.state.sourceNumbers);
            this.state.numbers = [...this.state.sourceNumbers];
        }

        recursivelyTimeout(self, action) {
            if (self.state.isSorting) {
                if (action()) {
                    setTimeout(() => { self.recursivelyTimeout(self, action) }, self.state.timerInterval);
                }
            }
        }

        startSort() {
            this.stopSort();
            this.state.isSorting = true;
            const self = this;
            this.state.sorter.setNumbers(this.state.numbers);
            this.recursivelyTimeout(self, () => { return self.state.sorter.onTick(self.state.sorter) });
        }

        stopSort() {
            this.state.isSorting = false;
        }

    }

    return SorterView;
});