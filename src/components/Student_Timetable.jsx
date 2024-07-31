import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Student_Timetable() {
    const { programme, course, year, section } = useParams();

    const [subjects, setSubjects] = useState([]);
    const [slot, setSlot] = useState([]);
    const [periodHashmaps, setPeriodHashmaps] = useState([]);
    const [dayOrder, setDayOrder] = useState(null);

    useEffect(() => {
        async function fetchData() {
            await fetchClassid();
            await getDayOrder();
        }
        fetchData();
    }, []);

    async function fetchClassid() {
        const { data, error } = await supabase
        .from('classes')
        .select('id, Slot')
        .eq('Programme', programme)
        .eq('Course', course)
        .eq('Year', year)
        .eq('Section', section);

        if (error) {
        console.error(error);
        } else {
        const classIds = data.map(item => item.id);
        fetchSubjects(classIds);

        let periodMaps = [];
        for (let i = 1; i <= 5; i++) {
            const periods = await fetchPeriods(classIds, i);
            periodMaps.push(periods);
        }
        setPeriodHashmaps(periodMaps);

        const slot = data.map(item => item.Slot);
        setSlot(slot);
        }
    }

    async function fetchPeriods(classIds, order) {
        if (classIds.length === 0) return;
        const { data, error } = await supabase
        .from('periods')
        .select(`
            Period,
            subjects:Subject_id(Subject),
            staffs:Staff_id(Name),
            classrooms:ClassRoom_id(RoomNo)
        `)
        .in('Class_id', classIds)
        .eq('Order', order);

        if (error) {
        console.error(error);
        return {};
        } else {
        const hashmap = data.reduce((map, item) => {
            map[item.Period] = item;
            return map;
        }, {});
        return hashmap;
        }
    }

    async function fetchSubjects(classIds) {
        if (classIds.length === 0) return;
        const { data, error } = await supabase
            .from('subjects')
            .select(`
                Subject,
                staffs:Staff_id(Name)
            `)
            .in('Class_id', classIds);
        if (error) {
            console.error(error);
        } else {
            setSubjects(data);
        }
    }

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

    return (
        <div className="flex justify-center items-center flex-wrap">
            {subjects.length === 0 ? (
                <h2 className="text-sm lg:text-xl min-h-screen flex justify-center items-center">No subjects found. Contact your professor for clarification.</h2>
            ) : (
                <div className="w-full p-5">
                    <h2 className="text-lg lg:text-2xl text-center">{programme} {course} {year} Year - {section} Section</h2>
                    <div className="overflow-x-auto mt-6">
                        <table className="min-w-full bg-white">
                            <tbody>
                                <tr>
                                    <th className="py-5 px-2 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">Day Order</th>
                                    <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{slot === 'A' ? (<>08:15AM - 09:30AM</>) : (<>12:20PM - 01:35PM</>)}</th>
                                    <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{slot === 'A' ? (<>09:35AM - 10:50AM</>) : (<>01:40PM - 02:55PM</>)}</th>
                                    <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{slot === 'A' ? (<>11:00AM - 12:15PM</>) : (<>03:05PM - 04:20PM</>)}</th>
                                    <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{slot === 'A' ? (<>12:20PM - 01:35PM</>) : (<>04:25PM - 05:40PM</>)}</th>
                                </tr>
                                {periodHashmaps.map((periodMap, index) => (
                                    <tr key={index}>
                                        <th className="py-5 px-2 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider" style={index + 1 === dayOrder ? { borderColor: '#93c5fd' } : {}}>{index + 1}</th>
                                        {[1, 2, 3, 4].map(period => (
                                            <td key={period} className="py-5 px-8 border border-gray-200 text-sm lg:text-lg text-gray-700 text-center" style={index + 1 === dayOrder ? { background: '#93c5fd' } : {}}>
                                            {periodMap[period] ? (
                                            <>
                                                <div className="pb-2">{periodMap[period].classrooms.RoomNo}</div>
                                                <div className="pb-2">{periodMap[period].subjects.Subject}</div>
                                                <div>{periodMap[period].staffs.Name}</div>
                                            </>
                                            ) : (
                                            '-'
                                            )}
                                        </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="overflow-x-auto mt-6 flex justify-center">
                        <table className="bg-white">
                            <thead>
                                <tr>
                                    <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">Subject</th>
                                    <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">Staff</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map(subject => (
                                    <tr key={subject.id}>
                                        <td className="py-5 px-8 border border-gray-200 text-sm lg:text-lg text-gray-700">{subject.Subject}</td>
                                        <td className="py-5 px-8 border border-gray-200 text-sm lg:text-lg text-gray-700">{subject.staffs.Name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Student_Timetable;