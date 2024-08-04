import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Classroom() {
  const [roomNo, setRoomNo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomNo) {
      const url = `./${roomNo}`;
      navigate(url);
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl min-h-screen px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-blue-600 sm:text-3xl">Classroom Finder</h1>

        <p className="mx-auto mt-2 mb-4 max-w-md text-center text-gray-500">
          Enter the Classroom Number to fetch the Timetable.
        </p>

        <form className="mb-0 mt-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8" onSubmit={handleSubmit}>
          <div>
            <label>Room No</label>
            <div className="relative">
              <input
                type="text"
                name="EmpID"
                id="EmpID"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                required
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
          >
            Submit
          </button>

          <p className="text-center text-sm text-gray-500">
            For Student timetable,
            <Link to={'../'} className="underline pl-1">Click Here</Link>
            <br />
            For Staff timetable,
            <Link to={'./staff'} className="underline pl-1">Click Here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Classroom;