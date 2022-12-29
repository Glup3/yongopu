import { type Dayjs } from "dayjs";
import React from "react";
import {
  classnames,
  backgroundColor,
  borderRadius,
  aspectRatio,
  display,
  flexDirection,
  justifyContent,
  height,
  width,
  alignItems,
  animation,
  opacity,
  fontWeight,
  // type TFontSize,
} from "tailwindcss-classnames";

export type GridItemState = "NORMAL" | "DEFEATED" | "SUCCEEDED" | "STARTED" | "LOADING";

type Props = {
  date: Dayjs;
  state: GridItemState;
  isToday: boolean;
  isFaded: boolean;
};

const stylesDiv = (state: GridItemState, isFaded: boolean) =>
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
    opacity({ "opacity-50": isFaded }),
  );

const stylesText = (isCircled: boolean) =>
  classnames(
    borderRadius("rounded-full"),
    backgroundColor({ "bg-gray-300": isCircled }),
    display("flex"),
    flexDirection("flex-col"),
    justifyContent("justify-center"),
    // fontSize("text-[100%]" as TFontSize),
    fontWeight("font-medium"),
    width("w-10"),
    height("h-10"),
  );

export const CalendarGridItem: React.FC<Props> = ({ date, state, isToday, isFaded }) => {
  return (
    <div className={stylesDiv(state, isFaded)}>
      <div className={stylesText(isToday)}>{date.format("DD")}</div>
    </div>
  );
};
