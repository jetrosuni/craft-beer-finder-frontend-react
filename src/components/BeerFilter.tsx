import type { BeerStyleName, FilterValues, Venue } from "../types";
import { FC, useEffect, useRef, useState } from "react";
import { Autocomplete, initTE, Input } from "tw-elements";
import { useDebounce } from "../hooks/useDebounce";
import { BeerFilterRange } from "../components/BeerFilterRange";
import { BeerFilterStyle } from "../components/BeerFilterStyle";
import DarkModeButton from "../components/DarkModeButton";
import "./BeerFilter.css";

interface FilterProps {
  venues: readonly Venue[];
  filterValues: FilterValues;
  isBeerSearch: boolean;
  isVenueSearch: boolean;
  setFilterValues: React.Dispatch<React.SetStateAction<FilterValues>>;
}

export const BeerFilter: FC<FilterProps> = ({
  venues,
  filterValues,
  isBeerSearch,
  isVenueSearch,
  setFilterValues,
}: FilterProps) => {
  const [searchStr, setSearchStr] = useState(filterValues.searchBeerString);
  const ensureMinimumInputLength = (str: string): string =>
    str.length && str.length > 2 ? str : "";
  const onSearchStringChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const input = (event.currentTarget as HTMLInputElement).value;
    setSearchStr(input);
    debouncedSearchChange();
  };
  const debouncedSearchChange = useDebounce(() => {
    setFilterValues({
      ...filterValues,
      searchBeerString: ensureMinimumInputLength(searchStr),
    });
  });

  const onBeerStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selection = (event.currentTarget as HTMLInputElement).value as BeerStyleName;
    const currentBeerStyles = [...filterValues.beerStylesSelected];
    if (currentBeerStyles.includes(selection)) {
      const index = filterValues.beerStylesSelected.indexOf(selection);
      if (index !== -1) {
        currentBeerStyles.splice(index, 1);
      }
    } else {
      currentBeerStyles.push(selection);
    }
    setFilterValues({
      ...filterValues,
      beerStylesSelected: currentBeerStyles,
    });
  };

  const onDayRangeChange = (dayLimit: number) => {
    setFilterValues({
      ...filterValues,
      dayLimit,
    });
  };

  const onRatingRangeChange = (ratingMin: number) => {
    setFilterValues({
      ...filterValues,
      ratingMin,
    });
  };

  const isInitialized = useRef(false);
  useEffect(() => {
    if (!venues[0]?.id || isInitialized.current) {
      return;
    }

    isInitialized.current = true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    initTE({ Input });

    const venueFilterEl = document.getElementById("venue-filter");
    if (venueFilterEl) {
      const venueNames = venues.map((venue) => venue.name);
      const filter = (input: string) =>
        venueNames.filter((venue: string) => venue.toLowerCase().includes(input.toLowerCase()));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      new Autocomplete(venueFilterEl, {
        filter,
        noResults: "No venue found.",
      });

      const onVenueChange = (e: CustomEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        const selection = (e as any).value as string; // NOTE: value property doesn't exist in CustomEvent as it's unique for TW Elements Autocomplete component
        setFilterValues({
          ...filterValues,
          searchVenueString: selection,
        });
      };
      venueFilterEl.addEventListener("itemSelect.te.autocomplete", onVenueChange as EventListener);
      venueFilterEl.addEventListener("update.te.autocomplete", onVenueChange as EventListener);
    }
  }, [filterValues, setFilterValues, venues]);

  return (
    <section className="mx-3 mt-1.5 pt-3 text-left text-xs sm:mt-3 sm:text-sm md:text-base">
      <div className="grid grid-cols-7">
        <BeerFilterStyle
          beerStyles={filterValues.beerStylesAll}
          selectedStyles={filterValues.beerStylesSelected}
          isDisabled={isBeerSearch}
          onBeerStyleChange={onBeerStyleChange}
        />
        <div className="cbf-tiny-screen-support ml-auto">
          <DarkModeButton />
        </div>
      </div>
      <div className="grid grid-cols-6">
        <div className={"pr-1 pt-5" + (isBeerSearch ? " cbf-global-is-ignored" : "")}>
          <p>Day limit</p>
          <p>
            {filterValues.dayLimit === 0 ? "today" : "0–" + filterValues.dayLimit + " days ago"}
          </p>
        </div>
        <div
          className={
            "col-span-5 pt-5" + (isBeerSearch ? " cbf-global-is-ignored pointer-events-none" : "")
          }
        >
          <BeerFilterRange
            min={0}
            max={7}
            step={1}
            valueProp={filterValues.dayLimit}
            onRangeChange={onDayRangeChange}
          />
        </div>
        <div
          className={"pr-1 pt-5" + (isBeerSearch || isVenueSearch ? " cbf-global-is-ignored" : "")}
        >
          <p>Rating</p>
          <p>{`${filterValues.ratingMin}–5 stars`}</p>
        </div>
        <div
          className={
            "col-span-5 pt-5" +
            (isBeerSearch || isVenueSearch ? " cbf-global-is-ignored pointer-events-none" : "")
          }
        >
          <BeerFilterRange
            min={3.5}
            max={4.5}
            step={0.25}
            ticks={["3.5", "3.75", "4.0", "4.25", "4.5"]}
            valueProp={filterValues.ratingMin}
            onRangeChange={onRatingRangeChange}
          />
        </div>
        <div className="col-span-3 pr-5 pt-5">
          <div className="mb-3">
            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
              <input
                id="search-field"
                type="search"
                className="focus:border-primary dark:focus:border-primary relative m-0 block min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.32rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:text-neutral-200"
                placeholder="Find a beer"
                aria-label="Find a beer"
                value={searchStr}
                onInput={onSearchStringChanged}
              />
            </div>
          </div>
        </div>
        <div
          className={
            "col-span-3 pt-5" + (isBeerSearch ? " cbf-global-is-ignored pointer-events-none" : "")
          }
        >
          <div className="relative" data-te-input-wrapper-init id="venue-filter">
            <input
              type="search"
              className="peer-focus:border-primary dark:peer-focus:border-primary peer block min-h-[auto] w-full rounded border-neutral-300 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear placeholder:opacity-0 focus:placeholder:opacity-100 motion-reduce:transition-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
              id="beerFilterFormVenueInput"
            />
            <label
              htmlFor="beerFilterFormVenueInput"
              className="peer-focus:border-primary dark:peer-focus:border-primary pointer-events-none absolute left-3 top-0 mb-0 max-w-[80%] origin-[0_0] truncate pt-[0.37rem] text-base leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:bg-white peer-data-[te-input-focused]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-focused]:scale-[0.8] peer-data-[te-input-state-active]:scale-[0.8] peer-data-[te-input-focused]:bg-white peer-data-[te-input-state-active]:bg-white motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:bg-neutral-900 dark:peer-data-[te-input-focused]:bg-neutral-900 dark:peer-data-[te-input-state-active]:bg-neutral-900"
            >
              Filter by venue
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};
