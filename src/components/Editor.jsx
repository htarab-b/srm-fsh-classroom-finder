import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Editor() {
    const [programme, setProgramme] = useState('');
    const [course, setCourse] = useState('');
    const [year, setYear] = useState('');
    const [section, setSection] = useState('');
    const navigate = useNavigate();

    const [dayOrder, setDayOrder] = useState(null);

    useEffect(() => {
        async function fetchData() {
            await getDayOrder();
        }
        fetchData();
    }, []);

    async function getDayOrder() {
        const { data, error } = await supabase
            .from('dayorder')
            .select('Date, Order');

        if (error) {
            console.error(error);
        } else {
            const db_date = data ? data.map(item => new Date(item.Date)) : [];
            const db_order = data ? data.map(item => item.Order) : [];

            const today = new Date();
            const day_diff = Math.floor((today - db_date[0]) / (1000 * 60 * 60 * 24)); // Calculate day difference

            let week_day_no = db_date[0].getDay(); // Get weekday number (0-6, 0 = Sunday)
            let current_order = db_order[0];

            for (let i = 0; i < day_diff; i++) {
                if (week_day_no < 5) { // Monday to Friday
                    current_order += 1;
                }
                week_day_no += 1;
                if (week_day_no > 6) week_day_no = 0; // Reset to Sunday if over Saturday
                if (current_order === 6) current_order = 1; // Reset order cycle
            }

            setDayOrder(current_order);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (programme && course && year && section) {
        const url = `./${programme}/${course}/${year}/${section}/1`;
        navigate(url);
        } else {
        alert('Please fill in all fields');
        }
    };

    const changeDayOrder = async (e) => {
        e.preventDefault();
        await supabase
            .from('dayorder')
            .update({'Date': new Date(), 'Order': dayOrder});
    }

    return (
        <div className="mx-auto max-w-screen-xl min-h-screen px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="mx-auto">
                <h1 className="text-center text-2xl font-bold text-blue-600 sm:text-3xl">Classroom Editor</h1>

                <p className="mx-auto mt-2 mb-4 max-w-md text-center text-gray-500">
                Enter the class details to modify the timetable.
                </p>

                <div className="absolute left-10 w-1/5">
                    <form className="mb-0 mt-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8" onSubmit={changeDayOrder}>
                        <div>
                            <label>Day Order</label>
                            <div className="relative">
                            <select
                                name="Day Order"
                                id="Day Order"
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                required
                                value={dayOrder}
                                onChange={(e) => setDayOrder(e.target.value)}
                            >
                                <option value="" disabled>Select</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
                        >
                            Change
                        </button>
                    </form>
                </div>
                <div>
                </div>
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
                                <option value="" disabled selected>Select</option>
                                <option value="Biochemistry">Biochemistry</option>
                                <option value="Biotechnology">Biotechnology</option>
                                <option value="Career Guidance">Career Guidance</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Commerce">Commerce</option>
                                <option value="Computer Applications">Computer Applications</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Corporate Secretaryship and Accounting & Finance">Corporate Secretaryship and Accounting & Finance</option>
                                <option value="Defence and Strategic Studies">Defence and Strategic Studies</option>
                                <option value="Economics">Economics</option>
                                <option value="Education">Education</option>
                                <option value="English">English</option>
                                <option value="Fashion Designing">Fashion Designing</option>
                                <option value="French">French</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Journalism and Mass Communication">Journalism and Mass Communication</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Mathematics & Statistics">Mathematics & Statistics</option>
                                <option value="Physical Education, Health Education and Sports">Physical Education, Health Education and Sports</option>
                                <option value="Physics">Physics</option>
                                <option value="Psychology">Psychology</option>
                                <option value="Social Work">Social Work</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Visual Communication">Visual Communication</option>
                                <option value="Yoga">Yoga</option>
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
                            For Staff Editor,
                            <Link to={'./addstaff'} className="underline pl-1">Click Here</Link>
                        </p>
                    </form>
            </div>
        </div>
    );
}

export default Editor;