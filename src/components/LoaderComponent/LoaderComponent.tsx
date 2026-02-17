import "./loader.scss";

function LoaderComponent() {
  return (
    <div className="loader__center">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default LoaderComponent;
