"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_grid_layout_1 = require("react-grid-layout");
class BIT2D {
    constructor(rows, cols) {
        this.rows = rows + 1;
        this.cols = cols + 1;
        this.tree = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    }
    update(row, col, delta) {
        for (let i = row; i < this.rows; i += i & -i) {
            for (let j = col; j < this.cols; j += j & -j) {
                this.tree[i][j] += delta;
            }
        }
    }
    query(row, col) {
        let sum = 0;
        for (let i = row; i > 0; i -= i & -i) {
            for (let j = col; j > 0; j -= j & -j) {
                sum += this.tree[i][j];
            }
        }
        return sum;
    }
    queryRange(row1, col1, row2, col2) {
        return (this.query(row2, col2) -
            this.query(row1 - 1, col2) -
            this.query(row2, col1 - 1) +
            this.query(row1 - 1, col1 - 1));
    }
    isEmpty(row1, col1, row2, col2) {
        return this.queryRange(row1, col1, row2, col2) === 0;
    }
}
const itemSizes = {
    "2xs": 1,
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
    xl: 6,
    "2xl": 7,
    "3xl": 8,
};
function generateLayout(items, cols) {
    const layout = [];
    const bit2d = new BIT2D(1000, cols);
    const findSpaceForItem = (itemWidth, itemHeight) => {
        for (let y = 1;; ++y) {
            for (let x = 1; x <= cols - itemWidth + 1; ++x) {
                if (bit2d.isEmpty(y, x, y + itemHeight - 1, x + itemWidth - 1)) {
                    for (let dy = 0; dy < itemHeight; ++dy) {
                        for (let dx = 0; dx < itemWidth; ++dx) {
                            bit2d.update(y + dy, x + dx, 1);
                        }
                    }
                    return { x: x - 1, y: y - 1 };
                }
            }
        }
    };
    items.forEach((item, i) => {
        const itemWidth = itemSizes[item.width];
        const itemHeight = itemSizes[item.height];
        const position = findSpaceForItem(itemWidth, itemHeight);
        layout.push(Object.assign(Object.assign({}, position), { w: itemWidth, h: itemHeight, i: i.toString() }));
    });
    return { md: layout };
}
const ResponsiveGridLayout = (0, react_grid_layout_1.WidthProvider)(react_grid_layout_1.Responsive);
function BentoGrid({ items }) {
    const cols = { lg: 8, md: 8, sm: 4, xs: 2, xxs: 1 };
    const layout = generateLayout(items, cols.lg);
    return (react_1.default.createElement(ResponsiveGridLayout, { className: "layout", layouts: layout, compactType: "horizontal", autoSize: true, isResizable: false, rowHeight: 90, breakpoints: { lg: 1200, md: 600, sm: 480, xs: 120, xxs: 0 }, cols: cols, isDraggable: false }, items.map((item, i) => (react_1.default.createElement("div", { key: i, style: { width: "100%", height: "100%" } }, item.content)))));
}
exports.default = BentoGrid;
