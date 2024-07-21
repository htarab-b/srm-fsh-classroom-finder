import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Student() {
  const [programme, setProgramme] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (programme && course && year && section) {
      const url = `/${programme}/${course}/${year}/${section}`;
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
          Enter your class details to view your timetable.
        </p>

        <form className="mb-0 mt-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8" onSubmit={handleSubmit}>
          <div>
            <label>Programme</label>
            <div className="relative">
              <select
                name="Programme"
                id="Programme"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                required
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
              >
                <option value="" disabled>Select</option>
                <option value="BA">BA</option>
                <option value="BCA">BCA</option>
                <option value="BCom">BCom</option>
                <option value="BEd">BEd</option>
                <option value="BS">BS</option>
                <option value="BSc">BSc</option>
                <option value="Certificate">Certificate</option>
                <option value="Diploma">Diploma</option>
                <option value="MA">MA</option>
                <option value="MCA">MCA</option>
                <option value="MCom">MCom</option>
                <option value="MSc">MSc</option>
                <option value="MSW">MSW</option>
                <option value="PG Diploma">PG Diploma</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
          </div>

          <div>
            <label>Course</label>
            <div className="relative">
              <select
                name="Course"
                id="Course"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                <option value="" disabled>Select</option>
                <option value="English">English</option>
                <option value="Journalism and Mass Communication">Journalism and Mass Communication</option>
                <option value="Computer Applications">Computer Applications</option>
                <option value="Data Science">Data Science</option>
                <option value="Accounting & Finance">Accounting & Finance</option>
                <option value="Commerce">Commerce</option>
                <option value="Corporate Secretaryship">Corporate Secretaryship</option>
                <option value="Finance and Taxation">Finance and Taxation</option>
                <option value="Information System and Management">Information System and Management</option>
                <option value="Professional Accounting">Professional Accounting</option>
                <option value="Banking, Financial Services, and Insurance">Banking, Financial Services, and Insurance</option>
                <option value="International Accounting & Finance">International Accounting & Finance</option>
                <option value="Biological Science">Biological Science</option>
                <option value="Commerce & Accounting">Commerce & Accounting</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Economics">Economics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physical Science">Physical Science</option>
                <option value="Social Science">Social Science</option>
                <option value="Tamil">Tamil</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Hotel & Catering Management">Hotel & Catering Management</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Computer Science Specialization in Cyber Security">Computer Science Specialization in Cyber Security</option>
                <option value="Defence and Strategic Studies">Defence and Strategic Studies</option>
                <option value="Fashion Designing">Fashion Designing</option>
                <option value="Physical Education, Health Education and Sports">Physical Education, Health Education and Sports</option>
                <option value="Psychology">Psychology</option>
                <option value="Statistics">Statistics</option>
                <option value="Visual Communication">Visual Communication</option>
                <option value="Basic French">Basic French</option>
                <option value="Certified Financial Management">Certified Financial Management</option>
                <option value="Counter-Terrorism">Counter-Terrorism</option>
                <option value="Financial Management">Financial Management</option>
                <option value="Fire Fighting and Fire Safety">Fire Fighting and Fire Safety</option>
                <option value="First Aid and Safety Management">First Aid and Safety Management</option>
                <option value="Hotel Management and Catering Science">Hotel Management and Catering Science</option>
                <option value="Yoga">Yoga</option>
                <option value="Applied Data Science">Applied Data Science</option>
                <option value="Organic Chemistry">Organic Chemistry</option>
                <option value="Disaster Management">Disaster Management</option>
                <option value="Master of Social Work">Master of Social Work</option>
                <option value="Culinary Arts">Culinary Arts</option>
              </select>
            </div>
          </div>

          <div>
            <label>Year</label>
            <div className="relative">
              <select
                name="Year"
                id="Year"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="" disabled>Select</option>
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
              </select>
            </div>
          </div>

          <div>
            <label>Section</label>
            <div className="relative">
              <select
                name="Section"
                id="Section"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                required
                value={section}
                onChange={(e) => setSection(e.target.value)}
              >
                <option value="" disabled>Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
                <option value="H">H</option>
                <option value="I">I</option>
                <option value="J">J</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
          >
            Submit
          </button>

          <p className="text-center text-sm text-gray-500">
            For Staff timetable,
            <Link to={'./staff'} className="underline pl-1">Click Here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Student;