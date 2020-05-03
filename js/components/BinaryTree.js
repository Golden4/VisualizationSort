define([
    'Base/Component'
], function (Component) {
    'use strict';

    class TreeNode extends Component {

        constructor(options) {
            super(options);
            this.state.leftNode = options.leftNode;
            this.state.rightNode = options.leftNode;
            this.state.binaryTree = options.binaryTree;
            this.state.index = options.index;
            this.state.number = options.number;
            this.state.bgColor = options.bgColor;
            this.state.parentNode = options.parentNode;
        }

        getLeftNode() {
            return this.state.leftNode;
        }

        getRightNode() {
            return this.state.rightNode;
        }

        getParentNode() {
            return this.state.parentNode;
        }

        update() {
            this.getContainer().innerHTML = this.renderContent(this.options, this.state);
        }

        setLeftNode(number, index) {
            this.state.leftNode = this.childrens.create(TreeNode, { number, index, binaryTree: this.state.binaryTree, parentNode: this });
            // this.state.leftNode.mount(this.getContainer());
            return this.state.leftNode;
        }

        setRightNode(number, index) {
            this.state.rightNode = this.childrens.create(TreeNode, { number, index, binaryTree: this.state.binaryTree, parentNode: this });
            // this.state.rightNode.mount(this.getContainer());

            return this.state.rightNode;
        }

        setStyle(style) {
            this.state.style = style;
        }

        reset() {
            this.state.style = '';
        }

        renderContent(options, state) {
            if (this.state.binaryTree.needResetChildren)
                this.reset();

            let leftNodeRender;
            if (this.state.leftNode) {
                leftNodeRender = this.state.leftNode;
            } else {
                leftNodeRender = '<div class="binary-tree__nodes">*</div>';
            }

            let rightNodeRender;
            if (this.state.rightNode) {
                rightNodeRender = this.state.rightNode;
            } else {
                rightNodeRender = '<div class="binary-tree__nodes">*</div>';
            }

            if (!this.state.rightNode && !this.state.leftNode) {
                leftNodeRender = '';
                rightNodeRender = '';
            }

            const childrenNodesRender = `<div class="binary-tree__field">
                ${leftNodeRender}
                ${rightNodeRender}
            </div>`;

            let style = this.state.style;
            if (style)
                style = ` style="${this.state.style}"`;
            else style = '';

            return `<div class="binary-tree__node" ${style}>${this.state.number}</div>
                ${childrenNodesRender}`;
        }

        render(options, state) {
            return `<div class="binary-tree__nodes">
                ${this.renderContent(options, state)}
            </div>`;
        }
    }

    class BinaryTree extends Component {

        constructor(options) {
            super(options);
            this.state.number = this.options.number;
            this.state.index = this.options.index;
            this.needResetChildren = false;
        }

        getRootNode() {
            if (!this.treeNode)
                this.createRootNode();

            return this.treeNode;
        }

        resetChildrens() {
            this.needResetChildren = true;
            this.update();
            this.needResetChildren = false;
        }

        deleteRootNodeAndChildrens() {
            this.unmountChildren();
            this.update();
        }

        createRootNode() {
            this.treeNode = this.childrens.create(TreeNode, { number: this.state.number, index: this.state.index, binaryTree: this });
        }

        update() {
            this.getContainer().innerHTML = this.renderContent();
        }

        renderContent() {
            return this.treeNode;
        }

        render(options, { number, index }) {
            return `<div class="binary-tree">
                ${this.renderContent() || ''}
                </div>`;
        }
    }

    return BinaryTree;
});
