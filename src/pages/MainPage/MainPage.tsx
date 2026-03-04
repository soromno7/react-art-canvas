import { useEffect, useState } from "react";
import ImageCardComponent from "./components/ImageCardComponent/ImageCardComponent";
import "./main.scss";
import { getAllDrawings } from "../../supabase/supabaseService";
import LoaderComponent from "../../components/LoaderComponent/LoaderComponent";

interface IDrawing {
  id: number;
  author_name: string;
  title: string;
  image_url: string;
  created_at: string;
}

function MainPage() {
  const [drawings, setDrawings] = useState<IDrawing[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadDrawings();
  }, []);

  const loadDrawings = async () => {
    try {
      const data = await getAllDrawings();
      setDrawings(data);
      console.log(data);
    } catch (error) {
      console.error("Error loading drawings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoaderComponent />;

  return (
    <main className="main">
      <h1 className="main__header">Your journey begins here</h1>
      <div className="main__item-list">
        {drawings.length === 0 ? (
          <span>No</span>
        ) : (
          drawings.map((el) => <ImageCardComponent key={el.id} {...el} />)
        )}
      </div>
    </main>
  );
}

export default MainPage;
