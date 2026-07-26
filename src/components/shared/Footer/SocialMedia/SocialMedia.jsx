import { Link } from "react-router-dom";

function SocialMedia() {
  return (
    <>
      <div className="grid grid-cols-4 justify-evenly">
        <div className="col-span-1 mx-2 flex justify-center items-center">
          <Link
            target="_blank"
            to="https://www.instagram.com/b_smi1e/"
          >
            <i className="fa-brands fa-instagram text-white rounded-full p-2 custom-text-lg border-white border-[3px]"></i>
          </Link>
        </div>

        <div className="col-span-1 mx-2 flex justify-center items-center">
          <Link
            target="_blank"
            to="https://www.facebook.com/people/Bella-Smile-%D8%A8%D9%8A%D9%84%D8%A7-%D8%B3%D9%85%D8%A7%D9%8A%D9%84/61583812910379/"
          >
            <i className="fa-brands fa-facebook text-white rounded-full p-2 custom-text-lg border-white border-[3px]"></i>
          </Link>
        </div>

        <div className="col-span-1 mx-2 flex justify-center items-center">
          <Link
            target="_blank"
            to="https://wa.me/+201024981900"
          >
            <i className="fa-brands fa-whatsapp text-white rounded-full p-2 custom-text-lg border-white border-[3px]"></i>
          </Link>
        </div>
      </div>
    </>
  );
}

export default SocialMedia;