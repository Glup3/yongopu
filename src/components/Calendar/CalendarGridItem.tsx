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
  textAlign,
  display,
  flex,
  flexDirection,
  justifyContent,
  height,
  width,
  flexGrow,
  alignItems,
  fontSize,
  type TFontSize,
} from "tailwindcss-classnames";

type GridItemState = "NORMAL" | "DEFEATED" | "SUCCEEDED" | "STARTED";

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
    }),
    aspectRatio("aspect-square"),
    alignItems("items-center"),
    display("flex"),
    justifyContent("justify-center"),
  );

const stylesText = (isCircled: boolean) =>
  classnames(
    borderWidth("border-2"),
    borderRadius({ "rounded-full": isCircled }),
    borderStyle("border-solid"),
    borderColor("border-blue-800"),
    display("flex"),
    padding("p-1"),
    flexDirection("flex-col"),
    justifyContent("justify-center"),
    // fontSize("text-[100%]" as TFontSize),
    width("w-8"),
    height("h-8"),

    // textAlign("text-center"),
    // justifyContent("justify-center"),
    // flexGrow("grow-0"),
  );

export const CalendarGridItem: React.FC<Props> = ({ date, state, isToday }) => {
  return (
    <div className={stylesDiv(state)}>
      <div className={stylesText(isToday)}>{date.format("DD")}</div>
    </div>
  );
};
