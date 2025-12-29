import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Logo from "./components/Logo";
import Navbar from "./components/Navbar";
import Cards from "./components/Cards";
import Loader from "./components/Loader.jsx";
import Footer2 from './Footers/Footer2/Fotter2.jsx';

const Main_page = ({
  isAdmin = false,
  onDelete,
  onUpdate,
}) => {
  const [data, setData] = useState([]);
const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://taza041.pythonanywhere.com/home/")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setActiveCategory(0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

useEffect(() => {
  const container = document.querySelector(".Cards");
  if (!container) return;

  const cards = container.children;
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: document.querySelector(".main-scroll"),
      threshold: 0.2,
    }
  );

  Array.from(cards).forEach(card => observer.observe(card));

  return () => observer.disconnect();
}, [activeCategory]);

useEffect(() => {
  const scrollContainer = document.querySelector(".main-scroll");
  if (scrollContainer) {
    scrollContainer.scrollTo({
      top: 0,
      behavior: "instant", // أو "smooth" إذا بدك
    });
  }
}, [activeCategory]);


  /* ================= حذف فوري ================= */
  const handleDelete = async (mealId) => {
    if (!window.confirm("متأكد من الحذف؟")) return;

    try {
      await onDelete(mealId);

      setData((prev) =>
        prev.map((cat) => ({
          ...cat,
          meals: cat.meals.filter(
            (meal) => meal.id !== mealId
          ),
        }))
      );

      toast.success("تم حذف الوجبة");
    } catch {
      toast.error("فشل الحذف");
    }
  };

  /* ================= تعديل فوري ================= */
  const handleUpdate = async (mealId, updatedData) => {
    try {
      await onUpdate(mealId, updatedData);

      setData((prev) =>
        prev.map((cat) => ({
          ...cat,
          meals: cat.meals.map((meal) =>
            meal.id === mealId
              ? { ...meal, ...updatedData }
              : meal
          ),
        }))
      );

      toast.success("تم تحديث الوجبة");
    } catch {
      toast.error("فشل التحديث");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <Navbar
            categories={data}
            active={activeCategory}
            setActive={setActiveCategory}
          />
        </div>
      </header>

      <main className="main-scroll">
        <div className="content-wrap">
          {activeCategory !== null && data[activeCategory] && (
          <Cards
            meals={data[activeCategory].meals}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            onUpdateProduct={handleUpdate}
            Categories={data}
          />
        )}
        </div>
      </main>

    </div>
  );
};

export default Main_page;


