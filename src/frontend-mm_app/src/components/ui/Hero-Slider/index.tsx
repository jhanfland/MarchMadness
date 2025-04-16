import { useEffect, useRef } from "react";
import heroPNG from "../../../../public/basketball.jpg";
import hero2PNG from "../../../../public/cooperFlaggDunking.jpeg";
import hero3PNG from "../../../../public/MarylandWinning.webp";
import "./index.css";

function Slider({className}: {className: string}) {
  const firstImageRef = useRef(null);

  useEffect(() => {
    // Remove the temporary "initial" class after a short delay
    const timer = setTimeout(() => {
      if (firstImageRef.current) {
        firstImageRef.current.classList.remove("initial");
      }
    }, 50);

    const intervalID = setInterval(changeSlide, 6000);
    return () => {
      clearTimeout(timer);
      clearInterval(intervalID);
    };
  }, []);

  const changeSlide = () => {
    const active = document.getElementsByClassName("active")[0];
    const imagesArray = document.getElementsByClassName("slider")[0].children;
    for (let i = 0; i < imagesArray.length; i++) {
      if (imagesArray[i] === active) {
        imagesArray[i].classList.remove("active");
        imagesArray[(i + 1) % imagesArray.length].classList.add("active");
        break;
      }
    }
  };
  
  return (
    <div className={`slider ${className}`}>
      {/* Apply both "active" and "initial" classes to the first image */}
      <img ref={firstImageRef} src={heroPNG} className="active initial" alt="Hero" />
      <img src={hero2PNG} id="slider-img2" alt="Hero 2" />
      <img src={hero3PNG} id="slider-img3" alt="Hero 3" />
    </div>
  );
}

export default Slider;

