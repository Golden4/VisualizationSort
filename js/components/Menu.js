define([
    'Base/Component'
], function (Component) {
    'use strict';

    class Menu extends Component {

        constructor(options) {
            super(options);
        }

        afterMount() {
            const list = this.getContainer().querySelectorAll('.nav__link');

            for (let i = 0; i < list.length; i++) {
                this.subscribeTo(list[i], 'click', this.clickList.bind(this, i));
            }
        }

        clickList(index) {
            const listComponents = ['Comp/BubbleSort', 'Comp/BinarySort'];

            const sa = function (SorterView, comp) {
                console.log(this);
                this.options.page.mountComponentToMainColumn(SorterView, { sorterComponent: comp, title: 'Сортировка пузырьком', size: 10 });
            }.bind(this);

            requirejs(['SorterView', listComponents[index]], sa);
        }

        render() {
            return `<div class="nav module">
                <p class="title module__title">Методы сортировки</p>
                <ul class="nav__list">
                    <li class="nav__link">
                        <a href="#">Пузырьком</a>
                    </li>
                    <li class="nav__link">
                        <a href="#">Бинарным деревом</a>
                    </li>
                </ul>
            </div>`;
        }
    }

    return Menu;
});
