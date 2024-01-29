import "./BeerLoading.scss";

interface LoadingProps {
  size?: "small" | "large";
}

export const BeerLoading: React.FC<LoadingProps> = ({ size = "large" }: LoadingProps) => {
  return (
    <div className={"cbf-loading " + (size === "small" ? "cbf-is-small" : "")}>
      <div id="glass">
        <div id="beer"></div>
      </div>
      <div id="handle"></div>
      <div id="top-foam-1"></div>
      <div id="top-foam-2"></div>
      <div id="top-foam-3"></div>
      <div id="top-foam-4"></div>
      <div id="top-foam-5"></div>
      <div id="foam-pop-bubbles"></div>
      <div id="foam-tiny-bubbles-mid"></div>
      <div id="foam-tiny-bubbles-top"></div>
      <div id="foam-tiny-bubbles-low"></div>
      <div id="foam-tiny-bubbles-fast"></div>
    </div>
  );
};
