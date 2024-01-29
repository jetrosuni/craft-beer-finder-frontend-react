import { FC, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import "./BeerItem.css";

interface BeerFilterRangeProps {
  min: number;
  max: number;
  step: number;
  label?: string;
  ticks?: string[] | undefined;
  valueProp: number;
  onRangeChange: (dayLimit: number) => void;
}

export const BeerFilterRange: FC<BeerFilterRangeProps> = ({
  min,
  max,
  step,
  label,
  ticks,
  valueProp,
  onRangeChange,
}: BeerFilterRangeProps) => {
  const [value, setValue] = useState(valueProp);

  const debouncedChange = useDebounce(() => {
    onRangeChange(value);
  });

  const onDayRangeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(+event.target.value);
    debouncedChange();
  };

  return (
    <div className="relative mb-6">
      <label
        htmlFor="steps-range"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        id="steps-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
        onChange={onDayRangeChange}
      />
      {ticks?.[0] && (
        <>
          <span className="absolute -bottom-6 start-0 text-sm text-gray-500 dark:text-gray-400">
            {ticks[0]}
          </span>
          <span className="absolute -bottom-6 start-1/4 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 rtl:translate-x-1/2">
            {ticks[1]}
          </span>
          <span className="absolute -bottom-6 start-2/4 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 rtl:translate-x-1/2">
            {ticks[2]}
          </span>
          <span className="absolute -bottom-6 start-3/4 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 rtl:translate-x-1/2">
            {ticks[3]}
          </span>
          <span className="absolute -bottom-6 end-0 text-sm text-gray-500 dark:text-gray-400">
            {ticks[4]}
          </span>
        </>
      )}
      {!ticks && (
        <>
          <span className="absolute -bottom-6 start-0 text-sm text-gray-500 dark:text-gray-400">
            {min}
          </span>
          <span className="absolute -bottom-6 end-0 text-sm text-gray-500 dark:text-gray-400">
            {max}
          </span>
        </>
      )}
    </div>
  );
};
