import dunkingImg from "/basketball.jpg";
import { Link } from "react-router-dom";

export default function Homepage() {

  return (
    <div className="relative min-h-[87vh]">
      {/* Background image layer with low opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('basketballcourt.jpg')",
          opacity: 0.1,
        }}
      ></div>
      <div className="relative flex items-center justify-center min-h-[80vh]">
        <div className="flex gap-8">
          <div className="flex flex-col gap-2 mr-9">
            <p className="text-xl">
              One stop for all your March <br /> Madness needs
            </p>
            <h1 className="font-extrabold text-5xl primary-text-color">
              BRACKETS <br /> SCORES <br /> & <br /> MORE
            </h1>
            <p className="text-lg text-gray-500">
              Best March Madness platform out with live <br /> scores and
              comprehensive betting <br /> information
            </p>
            <Link
              to="/signup"
              className="bg-[var(--primary-color)] py-3 px-9 rounded-md font-extrabold text-lg my-4 w-max hover:bg-blue-900 hover:text-white"
            >
              SIGN UP NOW
            </Link>
          </div>

          <img
            src={dunkingImg}
            width="800px"
            alt="Dunking Basketball"
          />
        </div>
      </div>
    </div>
  );
}
