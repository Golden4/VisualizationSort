define([
    'Base/Component'
], function (Component) {
    'use strict';

    class Params extends Component {

        constructor(options) {
            super(options);
            this.state.component = options.component;
        }

        afterMount() {
            const randomButton = this.getContainer().querySelector(".params__randomButton");
            this.subscribeTo(randomButton, 'click', this.randomBtn.bind(this));

            const setButton = this.getContainer().querySelector(".params__setButton");
            this.subscribeTo(setButton, 'click', this.setBtn.bind(this));
        }

        randomBtn() {
            const randomArraySize = this.getContainer().querySelector(".params__randomArraySize").value;
            const array = Array.from({ length: randomArraySize }, () => Math.floor(Math.random() * 50));
            console.log(this.state.component);
            this.options.page.module.setNumbers(array);
        }

        setBtn() {
            const numberArray = this.getContainer().querySelector(".params__numberArray").value;
            const array = numberArray.split(',').map(Number);
            console.log(this.state.page);
            this.options.page.module.setNumbers(array);
        }

        render() {
            return `<div class="params module">
            <p class="field params__field">Размер массива:<input class="params__randomArraySize" type="number" value="10"></p>
            <p class="field params__button"><input class="params__randomButton" type="button" value="Задать случайный массив"></p>
            <p class="field params__field">Задать массив:<textarea class="params__numberArray"></textarea> Целые числа через запятые<br>Пример: 10,5,20,30,-5,-6</p>
            <p class="field params__button"><input class="params__setButton" type="button" value="Задать"></p>
        </div>`;
        }
    }

    return Params;
});
