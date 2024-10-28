import { useState, useContext, useEffect } from "react";
import axios from "../../config/api/axios";
import UserContext from "../../Hooks/UserContext";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { TableHeader } from "../Table";
import Loading from "../Layouts/Loading";
import ErrorStrip from "../ErrorStrip";

const DEFAULT_SCHEDULE = {
  monday: Array(5).fill("--"),
  tuesday: Array(5).fill("--"),
  wednesday: Array(5).fill("--"),
  thursday: Array(5).fill("--"),
  friday: Array(5).fill("--"),
};

const TimeScheduleForm = () => {
  const { user, paperList } = useContext(UserContext);
  const [timeSchedule, setTimeSchedule] = useState(DEFAULT_SCHEDULE);
  const [disabled, setDisabled] = useState(true);
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTimeSchedule = async () => {
      try {
        const response = await axios.get(`time_schedule/${user._id}`);
        setId(response.data._id);
        setTimeSchedule(response.data.schedule);
      } catch (err) {
        if (err?.response?.status === 404) {
          setDisabled(false);
        } else {
          handleError(err);
        }
      }
    };
    fetchTimeSchedule();
  }, [user]);

  const handleFormChange = (e) => {
    const { name: day, value, id: index } = e.target;
    setTimeSchedule((prev) => ({
      ...prev,
      [day]: prev[day].map((item, ind) => (ind === parseInt(index) ? value : item)),
    }));
  };

  const handleError = (err) => {
    setError(err.message || "An error occurred");
    toast.error("Operation failed.");
  };

  const saveTimeSchedule = async (data) => {
    try {
      const response = await axios[data._id ? 'patch' : 'post'](`time_schedule/${user._id}`, data);
      toast.success(response.data.message);
    } catch (err) {
      handleError(err);
    } finally {
      setDisabled(true);
    }
  };

  const deleteTimeSchedule = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`time_schedule/${id}`);
      toast.success(response.data.message);
      setTimeSchedule(DEFAULT_SCHEDULE);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <main className="time_schedule">
      <h2 className="mb-2 mt-3 text-4xl font-bold">Time Schedule</h2>
      <form>
        {timeSchedule.monday ? (
          <div className="my-4 w-full overflow-auto rounded-md border-2 border-slate-900">
            <table className="w-full text-center">
              <TableHeader
                AdditionalHeaderClasses={"h-[3rem]"}
                Headers={["Day/Hour", "I", "II", "III", "IV", "V"]}
              />
              <tbody>
                {Object.entries(timeSchedule).map(([day, values]) => (
                  <tr key={day}>
                    <th className="bg-slate-900 px-4 py-4 text-base capitalize text-slate-100">
                      {day}
                    </th>
                    {values.map((value, index) => (
                      <td key={index} className="border-l-[1px] border-t-[1px] border-slate-400 p-1">
                        <select
                          className="select-img h-[3rem] w-full text-center leading-6 focus:outline-none"
                          value={value}
                          name={day}
                          id={index}
                          disabled={disabled}
                          onChange={handleFormChange}
                        >
                          <option value="--">--</option>
                          {paperList?.map((paper) => (
                            <option key={paper._id} value={paper.name}>
                              {paper.paper}
                            </option>
                          ))}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Loading />
        )}

        <div className="flex gap-4">
          {timeSchedule.monday && (
            <>
              {disabled ? (
                <>
                  <button
                    type="button"
                    className="mb-4 flex items-center gap-2"
                    onClick={() => setDisabled(false)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    type="button"
                    className="mb-4 flex items-center gap-2"
                    onClick={deleteTimeSchedule}
                  >
                    <FaTrash /> Delete
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="mb-4 flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    saveTimeSchedule({ user: user._id, schedule: timeSchedule });
                  }}
                >
                  <FaPlus /> Save
                </button>
              )}
            </>
          )}
        </div>
      </form>
      {error && <ErrorStrip error={error} />}
    </main>
  );
};

export default TimeScheduleForm;
