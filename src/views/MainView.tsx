import type { Beer, FilterValues, Venue } from "../types";
import { useEffect, useRef, useState } from "react";
import { backendService } from "../services/backendService";
import { BeerList } from "../components/BeerList";
import { BeerLoading } from "../components/BeerLoading";
import { BeerFilter } from "../components/BeerFilter";

export function MainView() {
  const refreshTimer = useRef<number | undefined>(undefined);
  const genericErrorMessage = "Connection failed ... please try again later ...";
  const [errorMessage, setErrorMsg] = useState<undefined | string>(undefined);
  const [beerList, setBeerList] = useState<undefined | readonly Beer[]>(undefined);
  const [venues, setVenues] = useState<undefined | readonly Venue[]>(undefined);
  const [isDisplayLoadingIcon, setIsDisplayLoadingIcon] = useState(false);
  const [isFullListLoaded, setIsFullListLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isWaitingForResponse = useRef(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    searchBeerString: "",
    searchVenueString: "",
    dayLimit: 5,
    ratingMin: 3.75,
    beerStylesAll: ["light", "dark", "sour", "other"],
    beerStylesSelected: [],
  });

  const resolveRequest = (response: Beer[], isSetTimeout = false): void => {
    if (response[0]?.beerId && response[0].beerId > 0) {
      setBeerList(Object.freeze(response));
    }

    if (!isFullListLoaded && isSetTimeout) {
      // NOTE: Wait a moment before executing to make sure the DOM gets refreshed
      setTimeout(() => {
        requestBeers(false, true);
      }, 2500);
    }
  };

  const requestBeers = (initialDataOnly = false, isSilent = false): void => {
    if (isWaitingForResponse.current) {
      return;
    }

    if (!isSilent) {
      setIsLoading(true);
    }

    if (initialDataOnly) {
      backendService
        .getTopBeers()
        .then((res: Beer[]) => {
          resolveRequest(res, true);

          setIsDisplayLoadingIcon(false);
        })
        .catch((err) => {
          console.log(err);

          setErrorMsg(genericErrorMessage);
        })
        .finally(() => {
          isWaitingForResponse.current = false;
          setIsLoading(false);
        });

      return;
    }

    backendService
      .getAllBeers()
      .then((res: Beer[]) => {
        resolveRequest(res);

        setIsFullListLoaded(true);
      })
      .catch((err) => {
        console.log(err);

        setErrorMsg(genericErrorMessage);
      })
      .finally(() => {
        isWaitingForResponse.current = false;
        setIsLoading(false);
      });
  };

  const isBeerNameSearch = !!(
    filterValues.searchBeerString && filterValues.searchBeerString.length > 2
  );

  const isVenueSearch = !!(
    filterValues.searchVenueString && filterValues.searchVenueString.length > 2
  );

  const filteredBeerNames = beerList?.filter((beer) =>
    isBeerNameSearch
      ? beer.name.toLowerCase().includes(filterValues.searchBeerString.toLowerCase())
      : true,
  );

  const filteredVenues = filteredBeerNames?.filter((beer) =>
    isVenueSearch
      ? beer.venues.some((venue) =>
          venue.name.toLowerCase().includes(filterValues.searchVenueString.toLowerCase()),
        )
      : true,
  );

  const filteredLightBeers = filteredVenues?.filter((beer) =>
    !filterValues.beerStylesSelected.includes("light") ? beer.style !== "light" : true,
  );

  const filteredDarkBeers = filteredLightBeers?.filter((beer) =>
    !filterValues.beerStylesSelected.includes("dark") ? beer.style !== "dark" : true,
  );

  const filteredSourBeers = filteredDarkBeers?.filter((beer) =>
    !filterValues.beerStylesSelected.includes("sour") ? beer.style !== "sour" : true,
  );

  const filteredOtherBeers = filteredSourBeers?.filter((beer) =>
    !filterValues.beerStylesSelected.includes("other") ? beer.style !== "other" : true,
  );

  const filteredDayLimit = filteredOtherBeers?.filter(
    (beer) => !!beer.venues.some((venue) => venue.daysAgo <= filterValues.dayLimit),
  );

  const filteredBeerList = filteredDayLimit?.filter((beer) =>
    isBeerNameSearch
      ? filteredBeerNames
      : isVenueSearch
        ? true
        : beer.rating >= filterValues.ratingMin,
  );

  useEffect(() => {
    setBeerList(undefined);
    setFilterValues({
      ...filterValues,
      beerStylesSelected: filterValues.beerStylesAll,
    });
    setIsDisplayLoadingIcon(true);
    setIsFullListLoaded(false);

    const requestVenues = (): void => {
      backendService
        .getVenues()
        .then((res: Venue[]) => {
          setVenues(res);
        })
        .catch((err) => {
          console.log(err);

          setErrorMsg(genericErrorMessage);
        });
    };

    requestVenues();
    requestBeers(true, false);

    if (!refreshTimer.current) {
      refreshTimer.current = window.setInterval(() => {
        requestBeers(false, true);
      }, 1200000);
    }

    return () => {
      clearInterval(refreshTimer.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mt-6 text-center lg:mt-10">
      <h1 className="text-2xl font-bold sm:mb-3 lg:mb-5 lg:text-4xl xl:text-5xl">
        {import.meta.env.VITE_CRAFT_BEER_FINDER_TITLE}
      </h1>
      {isDisplayLoadingIcon && isLoading && <BeerLoading />}
      {!!errorMessage && <div className="mb-3 text-red-600">{errorMessage}</div>}
      {!isLoading && !!venues?.[0] && !errorMessage && (
        <div className="sticky top-0 z-50 border-b-4 border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <BeerFilter
            venues={venues}
            filterValues={filterValues}
            isBeerSearch={isBeerNameSearch}
            isVenueSearch={isVenueSearch}
            setFilterValues={setFilterValues}
          />
        </div>
      )}
      <BeerList beerList={filteredBeerList} dayLimit={filterValues.dayLimit} />
      {!isDisplayLoadingIcon && !isFullListLoaded && (
        <div className="relative mt-6 pb-24 italic">
          <p>Serving more beer ... please wait ...</p>
          <div className="absolute left-2/4 top-0 md:top-[-2.5rem]">
            <BeerLoading size="small" />
          </div>
        </div>
      )}
      {isFullListLoaded && !isLoading && !!filteredBeerList?.length && (
        <footer className="my-8 text-xs font-bold">Data provided by Untappd</footer>
      )}
      {isFullListLoaded && !isLoading && !filteredBeerList?.length && (
        <div className="my-6">No results found with the selected filters.</div>
      )}
    </section>
  );
}

/*
        @change-filter-search-string="onFilterSearchStringChanged"
        @change-filter-venue-string="onFilterVenueStringChanged"
        @change-filter-beer-style="onFilterBeerStyleChanged"
        @change-filter-day-range="onFilterDayRangeChanged"
        @change-filter-rating-range="onFilterRatingRangeChanged"
*/
