define([
    'Base/Component',
    'Comp/BinaryTree'
], function (Component, BinaryTree) {
    'use strict';

    class Tree {
        constructor(key, index) {
            this.left;
            this.right;
            this.key = key;
            this.index = index;
        }

        /*  insert (добавление нового поддерева (ключа))
            сравнить ключ добавляемого поддерева (К) с ключом корневого узла (X).
            Если K>=X, рекурсивно добавить новое дерево в правое поддерево.
            Если K<X, рекурсивно добавить новое дерево в левое поддерево.
            Если поддерева нет, то вставить на это место новое дерево
        */
        *insert(aTree, index) {
            if (aTree.key < this.key) {
                if (this.left) {
                    yield { operationType: 1, left: true };
                    yield* this.left.insert(aTree, index);
                }
                else {
                    yield { operationType: 1, left: true, key: aTree.key, index };
                    this.left = aTree;
                }
            } else {
                if (this.right) {
                    yield { operationType: 1, right: true };
                    yield* this.right.insert(aTree, index);
                }
                else {
                    yield { operationType: 1, right: true, key: aTree.key, index };
                    this.right = aTree;
                }
            }
        }

        /*  traverse (обход)
            Рекурсивно обойти левое поддерево.
            Применить функцию f (печать) к корневому узлу.
            Рекурсивно обойти правое поддерево.
        */

        *traverse(visitor) {
            if (this.left) {
                yield { operationType: 2, left: true };
                yield* this.left.traverse(visitor);
            }

            yield* visitor.visit(this);

            if (this.right) {
                yield { operationType: 2, right: true };
                yield* this.right.traverse(visitor);
            }

            yield { operationType: 2, goParent: true };
        }
    }

    class TreeVisitor {
        *visit(node) {
            yield { operationType: 2, key: node.key, index: node.index };
        }
    };


    class BinarySort extends Component {

        constructor(options) {
            super(options);
            this.nodes = [];
            this.numbersVisual = [];

            if (this.options.numbers) {
                this.state.numbers = this.options.numbers;
            } else
                this.state.numbers = Array.from({ length: 10 }, () => Math.floor(Math.random() * 40));;
        }

        getCanSort() {
            return this.state.sorter && this.state.tree;
        }

        *binaryTree(arr) {
            yield { operationType: 1, init: true, numIndex: 0, key: arr[0] };

            for (let i = 1; i < arr.length; i++) {
                yield { operationType: 1, init: true, numIndex: i, key: arr[i] };
                yield* this.state.tree.insert(new Tree(arr[i]), i);
            }

            yield { operationType: 2, init: true };
            yield* this.state.tree.traverse(new TreeVisitor());
        }

        setNumbers(numbers) {
            this.state.numbers = numbers;
            this.state.binaryTree.deleteRootNodeAndChildrens();
            this.state.binaryTree.setState({ number: this.state.numbers[0] });
            this.state.tree = new Tree(this.state.numbers[0], 0);
            this.state.sorter = this.binaryTree(this.state.numbers);
        }

        changeAllNodeColor(bgColor) {
            for (let i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].className == 'binarytree__node')
                    this.nodes[i].style.background = bgColor;
            }
        }

        changeNodeColor({ nodeIndex, treeLevel, bgColor }) {

            const node = this.getNode(nodeIndex, treeLevel);
            if (node.className == 'binarytree__node') {
                node.style.background = bgColor;
            }
        }

        changeNumColor(index, bgColor, reset = true) {

            if (reset) {
                this.resetAllColors();
            }
            this.numbersVisual[index].style.background = bgColor;
        }

        changeNum(index, number) {
            this.numbersVisual[index].innerHTML = number;
        }

        resetAllColors() {
            for (let i = 0; i < this.numbersVisual.length; i++) {
                this.numbersVisual[i].style.background = null;
                // this.nodes[i].style.background = null;
            }
        }

        renderNumbers(numbers = []) {

            this.numbersVisual = [];

            const numbersRender = numbers.map(function (num) {
                const div = `<div class="numbersList__number">${num}</div>`;

                const htmlObject = document.createElement('div');
                htmlObject.innerHTML = div;

                return div;
            }).join('');

            return `<div class="numbersList">${numbersRender}</div>`;
        }

        renderTree(numbers = []) {
            this.nodes = [];

            this.state.binarytree = document.querySelector(".binarytree");
            // this.state.binarytree.innerHTML = '';
            const graphicNumbersList = document.createElement('div');
            graphicNumbersList.className = "numbersList";
            this.state.binarytree.append(graphicNumbersList);

            graphicNumbersList.innerHTML = '';

            for (let i = 0; i < numbers.length; i++) {
                let divN = document.createElement('div');
                divN.className = "numbersList__number";
                divN.innerHTML = numbers[i];
                graphicNumbersList.append(divN);
            }
        }

        update() {
            this.getContainer().innerHTML = this.renderContent();
        }

        renderContent() {

            this.state.binaryTree = this.childrens.create(BinaryTree, { number: this.state.numbers[0], index: 0 });

            return `${this.renderNumbers(numbers)}
            ${this.state.binaryTree}`;
        }

        render(options, { numbers }) {

            return `
            <div class="binary-sort">
            ${this.renderContent()}
            </div>`;
        }

        afterMount() {
            this.numbersVisual = this.getContainer().querySelectorAll('.numbersList__number');
        }

        onTick(self) {
            if (self.state.sorter) {
                const generatorValue = self.state.sorter.next();
                if (generatorValue.value) {
                    if (generatorValue.value.operationType == 1) {
                        if (generatorValue.value.init) {
                            self.changeNumColor(generatorValue.value.numIndex, 'yellow');
                            self.state.curNode = self.state.binaryTree.getRootNode();
                            self.state.binaryTree.resetChildrens();
                            self.state.curNode.setStyle('background: yellow');
                        } else {
                            if (generatorValue.value.key) {
                                if (generatorValue.value.right) {
                                    self.state.curNode = self.state.curNode.setRightNode(generatorValue.value.key);
                                    if (self.state.curNode)
                                        self.state.curNode.setStyle('background: red');
                                }
                                if (generatorValue.value.left) {
                                    self.state.curNode = self.state.curNode.setLeftNode(generatorValue.value.key);
                                    if (self.state.curNode)
                                        self.state.curNode.setStyle('background: red');
                                }
                            } else {
                                if (generatorValue.value.right) {
                                    self.state.curNode = self.state.curNode.getRightNode();
                                    if (self.state.curNode)
                                        self.state.curNode.setStyle('background: yellow');
                                }

                                if (generatorValue.value.left) {
                                    self.state.curNode = self.state.curNode.getLeftNode();
                                    if (self.state.curNode)
                                        self.state.curNode.setStyle('background: yellow');
                                }
                            }
                            self.state.binaryTree.update();
                        }
                    }

                    if (generatorValue.value.operationType == 2) {
                        if (generatorValue.value.init) {
                            self.state.curNode = self.state.binaryTree.getRootNode();
                            self.state.binaryTree.resetChildrens();
                            self.state.curNode.setStyle('background: orange');
                            self.state.curNumberIndex = 0;
                        } else {
                            if (generatorValue.value.goParent) {
                                self.state.curNode = self.state.curNode.getParentNode();
                            }

                            if (generatorValue.value.left) {
                                self.state.curNode = self.state.curNode.getLeftNode();
                                if (self.state.curNode)
                                    self.state.curNode.setStyle('background: orange');
                            }

                            if (generatorValue.value.key) {
                                self.changeNum(self.state.curNumberIndex, self.state.curNode.state.number);
                                self.changeNumColor(self.state.curNumberIndex, '#00f400', false);
                                if (self.state.curNode)
                                    self.state.curNode.setStyle('background: #00f400');
                                self.state.curNumberIndex++;
                            }

                            if (generatorValue.value.right) {
                                self.state.curNode = self.state.curNode.getRightNode();
                                if (self.state.curNode)
                                    self.state.curNode.setStyle('background: orange');

                            }
                        }

                        self.state.binaryTree.update();
                    }
                }

                if (generatorValue.done) {
                    console.log('done');
                    self.changeAllNodeColor('#00f400');
                    return false;
                }
            }

            return true;
        }


        onStartSort() {
            this.state.binaryTree.deleteRootNodeAndChildrens();
            this.state.binaryTree.setState({ number: this.state.numbers[0] });
            this.state.tree = new Tree(this.state.numbers[0], 0);
            this.state.sorter = this.binaryTree(this.state.numbers);
        }

        onStopSort() {
            this.state.sorter = null;
            this.state.tree = null;
        }
    }

    return BinarySort;
});
