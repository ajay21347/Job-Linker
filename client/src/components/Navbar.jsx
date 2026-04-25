const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };
  return (
    <div className="flex justify-between items-center p-4 bg-purple-600 text-white">
      <h1 className="text-xl font-bold">Job Portal</h1>

      <button
        onClick={handleLogout}
        className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-gray-200"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
