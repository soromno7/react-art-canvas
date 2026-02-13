import ImageCardComponent from "./components/ImageCardComponent/ImageCardComponent";
import "./main.scss";

function MainPage() {
  return (
    <main className='main'>
      <h1 className="main__header">Your journey begins here</h1>
      <div className="main__item-list">
        <ImageCardComponent />
        <ImageCardComponent />
        <ImageCardComponent />
        <ImageCardComponent />
        <ImageCardComponent />
        <ImageCardComponent />
        <ImageCardComponent />
        <ImageCardComponent />
        <ImageCardComponent />
      </div>
    </main>
  )
}

export default MainPage