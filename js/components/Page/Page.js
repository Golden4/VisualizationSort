define([
    'Base/Component',
    'Menu',
    'Comp/Params',
    'SorterView',
    'Comp/BubbleSort',
    'Comp/BinarySort',
    'css!Page/css/Page.css'
], function (Component, Menu, Params) {
    'use strict';

    class Page extends Component {

        constructor(options) {
            super(options);
        }

        mountComponentToMainColumn(component, options) {
            if (this.module)
                this.module.unmount();

            this.module = this.childrens.create(component, options);
            this.module.mount(this.getContainer().querySelector('.content__main-column'));
            return this.module;
        }

        render() {
            return `
            <div class="page">
                        <div class="content">
                            <div class="content__main-column">
                                ${this.childrens.create(Params, { page: this })}
                                ${this.module || ''}
                            </div>
                            <div class="content__secondary-column">
                                ${this.childrens.create(Menu, { page: this })}
                                <div class="module">
                                    <p class="title module__title">Инструкция</p>
                                    <p>- Выбрать метод сортировки из меню</p>
                                    <p>- Задать массив</p>
                                    <p>- Нажать кнопку сортировать</p>
                                </div>
                                <div class="module">
                                   © Special for Tensor by Alsynbaev F.
                                </div>
                            </div>
                        </div>
                    </div>`;
        }
    }

    return Page;
});
