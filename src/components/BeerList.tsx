import type { Beer } from "../types";
import { createRef } from "react";
import { InView } from "react-intersection-observer";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { BeerItem } from "./BeerItem";
import "./BeerList.css";

interface BeerListProps {
  beerList?: Beer[];
  dayLimit: number;
}

export const BeerList: React.FC<BeerListProps> = ({ beerList, dayLimit }: BeerListProps) => {
  if (!beerList) {
    return;
  }

  return (
    <TransitionGroup appear={true} enter={true} exit={true} className="beer-list" component="ul">
      {beerList.map((beer) => {
        const nodeRef = createRef<HTMLLIElement>();

        return (
          <CSSTransition
            key={`beer-${beer.beerId}`}
            nodeRef={nodeRef}
            timeout={200}
            classNames="beer-list"
          >
            <li ref={nodeRef} style={{ minHeight: 110 }}>
              <InView>
                {({ inView, ref }) => (
                  <div ref={ref}>
                    {inView ? <BeerItem beer={beer} dayLimit={dayLimit} /> : null}
                  </div>
                )}
              </InView>
            </li>
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
};
