import { MdPeople } from "react-icons/md";
import Skill from "./Skill/Skill";
import { IoMdSearch } from "react-icons/io";
import OtherSkill from "./OtherSkill/OtherSkill";
import SkillResult from "./SkillResult/SkillResult";
import axios from "axios";
import { useState } from "react";

const SkillsP3 = () => {
  document.title = "Select Skills | Udemy";
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (input: string) => {
    if (input.length > 1) {
      try {
        const response = await axios.get(
          `https://api.datamuse.com/words?rel_trg=${encodeURIComponent(input)}&max=30`
        );

        setSuggestions(response.data.map((item: any) => item.word));
      } catch (error) {
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="mb-[2em] ml-[8em] w-[700px] p-[2em] text-start">
      <div className="mb-[2em] flex flex-col items-start justify-start gap-[1em] rounded-[1em] border border-[#d2caff] bg-[#f2efff] p-[1em]">
        <div className=" flex  items-center gap-[0.5em] text-[1.2em]">
          <MdPeople />
          <b>You're in the right place!</b>
        </div>
        <p>
          <span className="font-sans font-extrabold">1,607,173</span> people learn Financial
          Analysis on Udemy.
        </p>
      </div>
      <div>
        <h2 className="mb-[1em] text-[1.3em]">What skills are you interested in?</h2>
        <p className="mb-[1em]">
          Choose a few to start with. You can change these or follow more skills in the future.
        </p>
        <div className="mb-[0.5em] flex w-[600px]  flex-wrap items-center gap-[0.5em] rounded-[0.3em] border border-gray-400 p-[1em] hover:bg-gray-100">
          <Skill skillName="Next.js" />
          <Skill skillName="JavaScript" />
          <Skill skillName="React JS" />
          <Skill skillName="HTML" />
          <Skill skillName="MongoDB" />
          <Skill skillName="Django" />
          <Skill skillName="Front End Web Development" />
          <Skill skillName="CSS" />
          <Skill skillName="Node.Js" />
          <Skill skillName="Web Development" />
          <form className="flex w-full  items-center justify-start gap-[0.2em] text-[1.2em]">
            <div className="rounded-[0.2em] p-[0.5em] hover:bg-purpleHoverBtn">
              <IoMdSearch className="text-[1.5em]" />
            </div>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              type="text"
              placeholder="Search for a skill"
              className="w-full bg-white p-[0.5em] caret-gray-400 placeholder:text-gray-500 hover:bg-gray-100 focus:outline-none"
            />
          </form>
        </div>
        <div
          className={`${
            suggestions.length > 0
              ? "absolute z-[200] h-[300px] overflow-y-auto bg-white"
              : "hidden"
          } w-[600px] rounded-[0.5em] border border-gray-300 p-[2em] text-center shadow-skillsShadow`}
        >
          {suggestions.length > 0 ? (
            <div>
              {suggestions.map((word, index) => (
                <SkillResult key={index} skillResultName={word} />
              ))}
            </div>
          ) : (
            <div>
              <b>No results</b>
            </div>
          )}
        </div>
        <div className="mb-[1.5em] flex flex-col items-start justify-start gap-[1em]">
          <b className="font-sans font-extrabold">Software</b>
          <OtherSkill otherSkillName="Microsoft Excel" />
        </div>
        <div>
          <b>Other skills</b>
          <div className="mb-[0.5em] flex w-[600px]  flex-wrap items-center gap-[0.5em] rounded-[0.3em] p-[1em]">
            <OtherSkill otherSkillName="Finance Fundamentals" />
            <OtherSkill otherSkillName="Financial Modeling" />
            <OtherSkill otherSkillName="Financial Statement" />
            <OtherSkill otherSkillName="Accounting" />
            <OtherSkill otherSkillName="Financial Accounting" />
            <OtherSkill otherSkillName="Investing" />
            <OtherSkill otherSkillName="Company Valuation" />
            <OtherSkill otherSkillName="Stock Trading" />
            <OtherSkill otherSkillName="Financial Management" />
            <OtherSkill otherSkillName="Value Investing" />
            <OtherSkill otherSkillName="Financial Markets" />
            <OtherSkill otherSkillName="Corporate Finance" />
            <OtherSkill otherSkillName="Fundamental Analysis" />
            <OtherSkill otherSkillName="Technical Analysis(finance)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsP3;
