import React from "react";

const OrganizationForm = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const formData = new FormData(target);
    const email = formData.get("email");
  };

  return (
    <form className="mt-2 w-full space-y-4" onSubmit={handleSubmit}>
      <input
        required
        type="email"
        name="email"
        id="email"
        placeholder="Enter your work email address"
        className="w-full rounded-[0.3em] border border-[#9194ac] bg-white p-5 font-sans
      text-black transition-colors duration-200 ease-in-out placeholder:font-extrabold 
      placeholder:text-courseNameColorTxt hover:bg-gray-50 focus:border-purple-800 
      focus:bg-white focus:text-black 
      focus:outline-none"
      />
      <button
        type="submit"
        className="w-full rounded-[0.3em] bg-btnColor px-4 py-3 
      text-center font-extrabold text-white transition-colors
      duration-200 ease-in-out hover:bg-[#892de1]"
      >
        Continue
      </button>
    </form>
  );
};

export default OrganizationForm;
