"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
function BentoGrid(_a) {
    var { items } = _a, props = __rest(_a, ["items"]);
    const cols = { lg: 8, md: 8, sm: 4, xs: 1, xxs: 1 };
    const rHeight = props.rowHeight || 90;
    const bPos = props.breakpoints || {
        lg: 1200,
        md: 600,
        sm: 400,
        xs: 150,
        xxs: 100,
    };
    const columns = props.cols || cols;
    const layout = generateLayout(items, columns.lg);
    return (react_1.default.createElement(ResponsiveGridLayout, Object.assign({ className: props.className || "layout", layouts: layout, compactType: props.compactType || "horizontal", autoSize: props.autoSize || true, isResizable: props.isResizable || false, rowHeight: rHeight, breakpoints: bPos, cols: columns, isDraggable: props.isDraggable || false }, props), items.map((item, i) => (react_1.default.createElement("div", { key: i, style: { width: "100%", height: "100%" } }, item.content)))));
}
exports.default = BentoGrid;
