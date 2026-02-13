import testImage from "./test.jpg";
import { FaUserCircle } from "react-icons/fa";

import "./image-card.scss";

function ImageCardComponent() {
  return (
    <div className="image_card_item">
      <div className="card_item__image">
        <img src={testImage} />
      </div>
      <div className="card_item__data">
        <div className="card_item_data__top">
          <div className="card_item__user">
            {/* <div className="card_item_user__image"> */}
              <FaUserCircle className="card_item_user__image" size="30px" />
            {/* </div> */}
            <span className="card_item_user__name">nonameduser</span>
          </div>
          <span className="card_item__date">3 hours ago</span>
        </div>
        <h3 className="card_item__title">some stupid shit i created</h3>
      </div>
    </div>
  );
}

export default ImageCardComponent;
