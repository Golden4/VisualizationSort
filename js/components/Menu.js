define([
    'Base/Component'
], function (Component) {
    'use strict';

    class Menu extends Component {

        constructor(options) {
            super(options);
            this.state.navLinks = [{
                linkTitle: 'Пузырьком',
                pathComponent: 'Comp/BubbleSort',
                titleComponent: 'Сортировка пузырьком'
            },
            {
                linkTitle: 'Бинарным деревом',
                pathComponent: 'Comp/BinarySort',
                titleComponent: 'Сортировка бинарным деревом'
            }];

            this.state.curActiveLink = 0;
        }

        afterMount() {
            const list = this.getContainer().querySelectorAll('.nav__link');

            for (let i = 0; i < list.length; i++) {
                this.subscribeTo(list[i], 'click', this.linkBtn.bind(this, i));
            }

            this.linkBtn(this.state.curActiveLink);
        }

        linkBtn(index) {
            this.state.curActiveLink = index;

            const afterLoadComponents = function (SorterView, component) {
                this.options.page.mountComponentToMainColumn(SorterView, { sorterComponent: component, title: this.state.navLinks[index].titleComponent });
            }.bind(this);

            requirejs(['SorterView', this.state.navLinks[index].pathComponent], afterLoadComponents);
        }

        render() {
            return `<div class="nav module">
                <p class="title module__title">Методы сортировки</p>
                <ul class="nav__list">
                ${this.state.navLinks.map((link) => {
                return `<li class="nav__link">
                        <a href="#">${link.linkTitle}</a>
                    </li>`
            }).join('')}
                </ul>
            </div>`;
        }
    }

    return Menu;
});
