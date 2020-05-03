define([
    'Base/Component',
    'Menu',
    'Comp/Params',
    'SorterView',
    'Comp/BubbleSort',
    'Comp/BinarySort',
    'css!Page/css/Page.css'
], function (Component, Menu, Params, SorterView, BubbleSort, BinarySort) {
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

        // mountComponentToSecondaryColumn(component, options) {
        //     if (this.module)
        //         this.module.unmount();
        //     this.module = this.childrens.create(component, options);
        //     this.module.mount(this.getContainer().querySelector('.content__secondary-column'));
        //     return this.module;
        // }

        render() {

            // this.binarySort = this.childrens.create(SorterView, { sorterComponent: BinarySort, title: 'Сортировка бинарным деревом', size: 20 });
            this.module = this.childrens.create(SorterView, { sorterComponent: BubbleSort, title: 'Сортировка пузырьком', size: 10 })

            return `
            <div class="page">
                        <div class="content">
                            <div class="content__main-column">
                                ${this.childrens.create(Params, { page: this })}
                                ${this.module}
                            </div>
                            <div class="content__secondary-column">
                                ${this.childrens.create(Menu, { page: this })}
                            </div>
                        </div>
                    </div>`;
        }
    }

    return Page;
});
