import LoginButton from "../button/LoginButton";
import LogoutButton from "../button/LogoutButton";
import MainButton from "../button/MainButton";
import RegisterButton from "../button/RegisterButton";

const Navbar = () => {
  return (
    <div className=" flex justify-center ">
      <div className="w-full flex justify-between items-center py-2 px-6  bg-zinc-800 text-gray-100">
        <div>
          <MainButton />
        </div>

        <div className="flex gap-4 items-center">
          <RegisterButton />
          <LoginButton />
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
