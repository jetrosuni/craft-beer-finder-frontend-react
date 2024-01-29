import type { Beer, Venue } from "../types";
import { FC } from "react";
import { beerColors } from "../config/beerColors";
import "./BeerItem.css";

interface BeerItemProps {
  beer: Beer;
  dayLimit: number;
}

export const BeerItem: FC<BeerItemProps> = ({ beer, dayLimit }: BeerItemProps) => {
  const tulipGlassSvg = (): string => {
    if (beerColors.dark.some((bc) => bc.test(beer.styleName.toLowerCase()))) {
      return new URL("../assets/img/tulip-glass-dark.svg", import.meta.url).toString();
    } else if (beerColors.light.some((bc) => bc.test(beer.styleName.toLowerCase()))) {
      return new URL("../assets/img/tulip-glass-light.svg", import.meta.url).toString();
    }

    return new URL("../assets/img/tulip-glass.svg", import.meta.url).toString();
  };

  const daysAgoString = (daysAgo: number): string => {
    return daysAgo === 0
      ? '<span class="cbf-global-is-today">today</span>'
      : daysAgo === 1
        ? '<span class="cbf-global-is-yesterday">1 day ago</span>'
        : daysAgo > 1 && daysAgo < 4
          ? '<span class="cbf-global-is-some-days-ago">' + daysAgo + " days ago</span>"
          : '<span class="cbf-global-is-many-days-ago">' + daysAgo + " days ago</span>";
  };

  const venuesList = (): string => {
    let venueStr = "";

    beer.venues.forEach((venue: Venue) => {
      venueStr +=
        venue.daysAgo <= dayLimit ? venue.name + " (" + daysAgoString(venue.daysAgo) + ") — " : "";
    });

    return venueStr.slice(0, -2);
  };

  const flagSvg = (): string => {
    return new URL(
      import.meta.env.VITE_CRAFT_BEER_FINDER_PUBLIC_PATH +
        "img/flags/" +
        beer.country.toLowerCase() +
        ".svg",
      import.meta.url,
    ).toString();
  };

  return (
    <div className="mb-5 md:mb-3">
      <div className="grid grid-cols-10 grid-rows-1 gap-3 sm:gap-2">
        <div className="pt-1.5">
          <img
            src={tulipGlassSvg()}
            className="float-right w-6"
            loading="lazy"
            width="24"
            height="41"
            alt="pint"
          />
        </div>
        <div className="mx-auto text-center text-xs leading-7 md:mt-1 md:text-base">
          <strong>{beer.rating}</strong>
          <div className="is-size-7">({beer.ratingCount})</div>
        </div>
        <div className="col-span-8 ml-2 leading-7">
          <p className="break-words">{beer.name}</p>
          <div className="cbf-tiny-flag float-left mr-2">
            <div
              style={{ backgroundImage: `url(${flagSvg()})` }}
              className="h-full bg-cover bg-center bg-no-repeat"
            ></div>
          </div>
          <p className="my-1 text-sm uppercase leading-6">
            ({beer.country}) {beer.styleName}
          </p>
          <div className="mt-1 text-gray-500">
            <span dangerouslySetInnerHTML={{ __html: venuesList() }}></span>
          </div>
        </div>
      </div>
    </div>
  );
};
