import React, { ReactNode } from "react";
interface BentoItemConfig {
    height: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    width: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    content: ReactNode;
}
interface Props {
    items: BentoItemConfig[];
}
export default function BentoGrid({ items }: Props): React.JSX.Element;
export {};
