import React, { ReactNode } from "react";
import {
  Responsive,
  ResponsiveProps,
  WidthProvider,
  WidthProviderProps,
} from "react-grid-layout";

export interface BentoItemConfig {
  height: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  width: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  content: ReactNode;
}

class BIT2D {
  tree: number[][];
  rows: number;
  cols: number;
  constructor(rows: number, cols: number) {
    this.rows = rows + 1;
    this.cols = cols + 1;
    this.tree = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(0)
    );
  }
  update(row: number, col: number, delta: number) {
    for (let i = row; i < this.rows; i += i & -i) {
      for (let j = col; j < this.cols; j += j & -j) {
        this.tree[i][j] += delta;
      }
    }
  }
  query(row: number, col: number): number {
    let sum = 0;
    for (let i = row; i > 0; i -= i & -i) {
      for (let j = col; j > 0; j -= j & -j) {
        sum += this.tree[i][j];
      }
    }
    return sum;
  }
  queryRange(row1: number, col1: number, row2: number, col2: number): number {
    return (
      this.query(row2, col2) -
      this.query(row1 - 1, col2) -
      this.query(row2, col1 - 1) +
      this.query(row1 - 1, col1 - 1)
    );
  }
  isEmpty(row1: number, col1: number, row2: number, col2: number): boolean {
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

function generateLayout(items: BentoItemConfig[], cols: number) {
  const layout: { x: number; y: number; w: number; h: number; i: string }[] =
    [];
  const bit2d = new BIT2D(1000, cols);
  const findSpaceForItem = (itemWidth: number, itemHeight: number) => {
    for (let y = 1; ; ++y) {
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
    layout.push({
      ...position,
      w: itemWidth,
      h: itemHeight,
      i: i.toString(),
    });
  });
  return { md: layout };
}

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Props
  extends Partial<Omit<ResponsiveProps, "layouts">>,
    Partial<WidthProviderProps> {
  items: BentoItemConfig[];
}

export default function BentoGrid({ items, ...props }: Props) {
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
  return (
    <ResponsiveGridLayout
      className={props.className || "layout"}
      layouts={layout}
      compactType={props.compactType || "horizontal"}
      autoSize={props.autoSize || true}
      isResizable={props.isResizable || false}
      rowHeight={rHeight}
      breakpoints={bPos}
      cols={columns}
      isDraggable={props.isDraggable || false}
      {...props}
    >
      {items.map((item, i) => (
        <div key={i} style={{ width: "100%", height: "100%" }}>
          {item.content}
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
