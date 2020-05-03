define([
    'Base/Component'
], function (Component) {
    'use strict';

    class Params extends Component {

        constructor(options) {
            super(options);
            this.state.component = options.component;
        }

        afterRender() {
            const randomButton = this.getContainer().querySelector(".params__randomButton");
            this.subscribeTo(randomButton, 'click', this.randomBtn.bind(this));

            const setButton = this.getContainer().querySelector(".params__setButton");
            this.subscribeTo(setButton, 'click', this.setBtn.bind(this));
        }

        randomBtn() {
            const sizeElem = this.getContainer().querySelector(".params__randomArraySize");
            let randomArraySize = sizeElem.value;
            const intervalStart = this.getContainer().querySelector(".params__intervalStart").value;
            const intervalEnd = this.getContainer().querySelector(".params__intervalEnd").value;

            if (randomArraySize > 20) {
                randomArraySize = 20;
                sizeElem.value = 20;
            }

            if (randomArraySize <= 0) {
                randomArraySize = 1;
                sizeElem.value = 1;
            }

            const array = Array.from({ length: randomArraySize }, () => (Math.floor(Math.random() * (intervalEnd - intervalStart)) + parseInt(intervalStart)));
            this.options.page.module.setNumbers(array);
        }

        setBtn() {
            const numberArray = this.getContainer().querySelector(".params__numberArray").value;
            let array = numberArray.split(',').map(Number);
            array = array.splice(0, 20);
            this.options.page.module.setNumbers(array);
        }

        render() {
            return `<div class="params module">
            <p class="field params__field">Размер массива <br>(не более 20):<input class="params__randomArraySize" type="number" value="10"></p>
            <p class="field params__field">Интервал чисел:<span class="params__intervals"><input class="params__intervalStart" type="number" value="-20"><input class="params__intervalEnd" type="number" value="20"></span></p>
            <p class="field params__button"><input class="params__randomButton" type="button" value="Задать случайный массив"></p>
            <p class="field params__field">Задать массив <br>(не более 20):<textarea class="params__numberArray"></textarea> Целые числа через запятые<br>Пример: 10,5,20,30,-5,-6</p>
            <p class="field params__button"><input class="params__setButton" type="button" value="Задать массив"></p>
        </div>`;
        }
    }

    return Params;
});
