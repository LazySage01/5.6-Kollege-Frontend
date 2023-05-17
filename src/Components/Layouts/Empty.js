import React, { useContext, useEffect } from "react";
import UserContext from "../../Hooks/UserContext";
import axios from "../../config/api/axios";

const Empty = () => {
  const { setPaperList, user } = useContext(UserContext);
  useEffect(() => {
    const getPapers = async () => {
      const response = await axios.get("paper/teacher/" + user._id);
      setPaperList(response.data);
    };
    getPapers();
  }, [user, setPaperList]);

  return (
    <div className="empty">
      <h2>
        College based
        <br /> Data Management System
      </h2>
      <h3>TODO</h3>
      <ol>
        <li>Add Reducer Hook.</li>
        <li>Refactor Code.</li>
      </ol>
    </div>
  );
};

export default Empty;