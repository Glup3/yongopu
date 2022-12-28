import { type Dayjs } from "dayjs";
import React from "react";
import {
  classnames,
  backgroundColor,
  borderRadius,
  borderWidth,
  borderStyle,
  borderColor,
  padding,
  aspectRatio,
  display,
  flexDirection,
  justifyContent,
  height,
  width,
  alignItems,
  animation,
  // type TFontSize,
} from "tailwindcss-classnames";

export type GridItemState = "NORMAL" | "DEFEATED" | "SUCCEEDED" | "STARTED" | "LOADING";

type Props = {
  date: Dayjs;
  state: GridItemState;
  isToday: boolean;
};

const stylesDiv = (state: GridItemState) =>
  classnames(
    backgroundColor({
      "bg-slate-200": state === "NORMAL",
      "bg-green-500": state === "SUCCEEDED",
      "bg-red-400": state === "DEFEATED",
      "bg-sky-400": state === "STARTED",
      "bg-gray-200": state === "LOADING",
    }),
    aspectRatio("aspect-square"),
    alignItems("items-center"),
    display("flex"),
    justifyContent("justify-center"),
    animation({ "animate-pulse": state === "LOADING" }),
  );

const stylesText = (isCircled: boolean) =>
  classnames(
    borderWidth("border-2"),
    borderRadius("rounded-full"),
    borderStyle({ "border-solid": isCircled, "border-none": !isCircled }),
    borderColor("border-blue-800"),
    display("flex"),
    padding("p-1"),
    flexDirection("flex-col"),
    justifyContent("justify-center"),
    // fontSize("text-[100%]" as TFontSize),
    width("w-8"),
    height("h-8"),
  );

export const CalendarGridItem: React.FC<Props> = ({ date, state, isToday }) => {
  return (
    <div className={stylesDiv(state)}>
      <div className={stylesText(isToday)}>{date.format("DD")}</div>
    </div>
  );
};
