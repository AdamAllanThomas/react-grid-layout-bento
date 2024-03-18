import React, { ReactNode } from "react";
import { ResponsiveProps, WidthProviderProps } from "react-grid-layout";
interface BentoItemConfig {
    height: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    width: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    content: ReactNode;
}
interface Props extends Partial<Omit<ResponsiveProps, "layouts">>, Partial<WidthProviderProps> {
    items: BentoItemConfig[];
}
export default function BentoGrid({ items, ...props }: Props): React.JSX.Element;
export {};
