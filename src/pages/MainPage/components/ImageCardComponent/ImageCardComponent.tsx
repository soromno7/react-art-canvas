import { FaUserCircle } from "react-icons/fa";

import "./image-card.scss";

interface IUserCard {
  id: number;
  author_name: string;
  title: string;
  image_url: string;
  created_at: string;
}

function ImageCardComponent({
  author_name: username,
  created_at: date,
  title,
  image_url: imageURL,
}: IUserCard) {
  const formattedDate = new Date(date).toLocaleDateString();
  return (
    <div className="image_card_item">
      <div className="card_item__image">
        <img src={imageURL} />
      </div>
      <div className="card_item__data">
        <div className="card_item_data__top">
          <div className="card_item__user">
            <FaUserCircle className="card_item_user__image" size="30px" />
            <span className="card_item_user__name">{username}</span>
          </div>
          <span className="card_item__date">{formattedDate}</span>
        </div>
        <h3 className="card_item__title">{title}</h3>
      </div>
    </div>
  );
}

export default ImageCardComponent;
