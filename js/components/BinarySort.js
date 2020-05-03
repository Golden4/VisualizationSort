define([
    'Base/Component',
    'Comp/BinaryTree',
    'Comp/NumberList'
], function (Component, BinaryTree, NumberList) {
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

            if (this.options.numbers) {
                this.state.numbers = this.options.numbers;
            }

            this.state.numbersList = this.childrens.create(NumberList, { numbers: this.state.numbers });
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
            this.state.numbersList.setNumbers(numbers);
            this.state.binaryTree.deleteRootNodeAndChildrens();
        }

        renderContent(options, { numbers }) {
            this.state.binaryTree = this.childrens.create(BinaryTree, { number: numbers[0], index: 0 });
            return `${this.state.numbersList}
            ${this.state.binaryTree}`;
        }

        render(options, { numbers }) {
            return `
            <div class="binary-sort">
            ${this.renderContent(options, { numbers })}
            </div>`;
        }

        onTick() {
            if (this.state.sorter) {
                const generatorValue = this.state.sorter.next();
                if (generatorValue.value) {
                    if (generatorValue.value.operationType == 1) {
                        if (generatorValue.value.init) {
                            this.state.numbersList.changeNumColor(generatorValue.value.numIndex, 'yellow');
                            this.state.curNode = this.state.binaryTree.getRootNode();
                            this.state.binaryTree.resetChildrens();
                            this.state.curNode.setStyle('background: yellow');
                        } else {
                            if (generatorValue.value.key) {
                                if (generatorValue.value.right) {
                                    if (this.state.curNode) {
                                        this.state.curNode = this.state.curNode.setRightNode(generatorValue.value.key);
                                        if (this.state.curNode)
                                            this.state.curNode.setStyle('background: red');
                                    }
                                }
                                if (generatorValue.value.left) {
                                    if (this.state.curNode) {
                                        this.state.curNode = this.state.curNode.setLeftNode(generatorValue.value.key);
                                        if (this.state.curNode)
                                            this.state.curNode.setStyle('background: red');
                                    }
                                }
                            } else {
                                if (generatorValue.value.right) {
                                    if (this.state.curNode) {
                                        this.state.curNode = this.state.curNode.getRightNode();
                                        if (this.state.curNode)
                                            this.state.curNode.setStyle('background: yellow');
                                    }
                                }

                                if (generatorValue.value.left) {
                                    if (this.state.curNode) {
                                        this.state.curNode = this.state.curNode.getLeftNode();
                                        if (this.state.curNode)
                                            this.state.curNode.setStyle('background: yellow');
                                    }
                                }
                            }
                            this.state.binaryTree.update();
                        }
                    }

                    if (generatorValue.value.operationType == 2) {
                        if (generatorValue.value.init) {
                            this.state.curNode = this.state.binaryTree.getRootNode();
                            this.state.binaryTree.resetChildrens();
                            this.state.curNode.setStyle('background: orange');
                            this.state.curNumberIndex = 0;
                        } else {
                            if (generatorValue.value.goParent) {
                                if (this.state.curNode)
                                    this.state.curNode = this.state.curNode.getParentNode();
                            }

                            if (generatorValue.value.left) {
                                if (this.state.curNode) {
                                    this.state.curNode = this.state.curNode.getLeftNode();
                                    if (this.state.curNode)
                                        this.state.curNode.setStyle('background: orange');
                                }
                            }

                            if (generatorValue.value.right) {
                                if (this.state.curNode) {
                                    this.state.curNode = this.state.curNode.getRightNode();
                                    if (this.state.curNode)
                                        this.state.curNode.setStyle('background: orange');
                                }
                            }

                            if (generatorValue.value.key) {
                                if (this.state.curNode) {
                                    this.state.numbersList.changeNum(this.state.curNumberIndex, this.state.curNode.state.number);
                                    this.state.curNode.setStyle('background: #00f400');
                                }
                                this.state.numbersList.changeNumColor(this.state.curNumberIndex, '#00f400', false);
                                this.state.curNumberIndex++;
                            }
                        }

                        this.state.binaryTree.update();
                    }
                }

                if (generatorValue.done) {
                    console.log('done');
                    this.onStopSort();
                    return false;
                }
            }

            return true;
        }

        onStartSort() {
            if (!this.state.tree) {
                this.state.binaryTree.deleteRootNodeAndChildrens();
                this.state.binaryTree.setState({ number: this.state.numbers[0] });
                this.state.tree = new Tree(this.state.numbers[0], 0);
                this.state.sorter = this.binaryTree(this.state.numbers);
            }
        }

        onStopSort() {
            this.state.sorter = null;
            this.state.tree = null;
        }
    }

    return BinarySort;
});
