import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

function Admin() {
    const [classrooms, setClassrooms] = useState([]);
    const [periodHashmapsSlotA, setPeriodHashmapsSlotA] = useState({});
    const [periodHashmapsSlotB, setPeriodHashmapsSlotB] = useState({});
    const [dayOrder, setDayOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInitialData() {
            await getDayOrder();
            await fetchClassrooms();
        }
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (classrooms.length > 0 && dayOrder !== null) {
            fetchPeriodsForClassrooms();
        }
    }, [classrooms, dayOrder]);

    async function fetchClassrooms() {
        const { data, error } = await supabase
            .from('classrooms')
            .select('*');

        if (error) {
            console.error(error);
        } else {
            setClassrooms(data);
        }
    }

    async function fetchPeriodsForClassrooms() {
        const periodMapsSlotA = {};
        const periodMapsSlotB = {};

        for (const classroom of classrooms) {
            console.log(classroom);
            periodMapsSlotA[classroom.RoomNo] = await fetchPeriods(classroom.id, 'A');
            periodMapsSlotB[classroom.RoomNo] = await fetchPeriods(classroom.id, 'B');
        }
        setPeriodHashmapsSlotA(periodMapsSlotA);
        setPeriodHashmapsSlotB(periodMapsSlotB);
        setLoading(false);
    }

    async function fetchPeriods(classroomId, slot) {
        const { data, error } = await supabase
            .from('periods')
            .select(`
                Period,
                subjects:Subject_id(Subject),
                classes:Class_id(*),
                staffs:Staff_id(*)
            `)
            .eq('ClassRoom_id', classroomId)
            .eq('Slot', slot)
            .eq('Order', dayOrder);

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

    if (loading) {
        return (
            <div className="p-5 min-h-screen flex justify-center items-center flex-wrap">
                <h1 className="text-3xl lg:text-4xl text-center w-full">Loading...</h1>
                <p className="text-center text-lg text-gray-500">
                    To fetch a specific Classroom's full Timetable alone,
                    <Link to={'../classroom'} className="underline pl-1">Click Here</Link>
                </p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center flex-wrap">
            <div className="p-5">
                <h1 className="text-3xl lg:text-4xl text-center w-full">Classroom Finder - Admin</h1>
                <p className="text-center text-lg text-gray-500">
                    To get a Classroom's full Timetable,
                    <Link to={'../classroom'} className="underline pl-1">Click Here</Link>
                </p>
            </div>
            {
                classrooms.map(classroom => (
                    <div key={classroom.id} className="w-full p-5 border-t-4 border-black">
                        <h2 className="text-2xl lg:text-4xl text-center">{classroom.RoomNo}</h2>
                        <div className="overflow-x-auto mt-6">
                            <h3 className="text-center text-lg lg:text-2xl mx-auto">Slot A</h3>
                            <table className="min-w-full bg-white">
                                <tbody>
                                    <tr>
                                        <th className="py-5 px-2 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">Day Order</th>
                                        <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">08:15AM - 09:30AM</th>
                                        <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">09:35AM - 10:50AM</th>
                                        <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">11:00AM - 12:15PM</th>
                                        <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">12:20PM - 01:35PM</th>
                                    </tr>
                                    <tr>
                                        <th className="py-5 px-2 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{dayOrder}</th>
                                        {[1, 2, 3, 4].map(period => (
                                            <td key={period} className="py-5 px-8 border border-gray-200 text-sm lg:text-lg text-gray-700 text-center">
                                                {periodHashmapsSlotA[classroom.RoomNo] && periodHashmapsSlotA[classroom.RoomNo][period] ? (
                                                    <>
                                                        <div className="pb-2">{periodHashmapsSlotA[classroom.RoomNo][period].subjects.Subject}</div>
                                                        <div>{periodHashmapsSlotA[classroom.RoomNo][period].classes.Year} {periodHashmapsSlotA[classroom.RoomNo][period].classes.Programme} {periodHashmapsSlotA[classroom.RoomNo][period].classes.Course} {periodHashmapsSlotA[classroom.RoomNo][period].classes.Section}</div>
                                                    </>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                                                </tbody>
                            </table>

                            <h3 className="text-center text-lg lg:text-2xl mx-auto mt-6">Slot B</h3>
                            <table className="min-w-full bg-white">
                                <tbody>
                                    <tr>
                                        <th className="py-5 px-2 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">Day Order</th>
                                        <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">12:20PM - 01:35PM</th>
                                        <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">01:40PM - 02:55PM</th>
                                        <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">03:05PM - 04:20PM</th>
                                        <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">04:25PM - 05:40PM</th>
                                    </tr>
                                    <tr>
                                        <th className="py-5 px-2 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{dayOrder}</th>
                                        {[1, 2, 3, 4].map(period => (
                                            <td key={period} className="py-5 px-8 border border-gray-200 text-sm lg:text-lg text-gray-700 text-center">
                                                {periodHashmapsSlotB[classroom.RoomNo] && periodHashmapsSlotB[classroom.RoomNo][period] ? (
                                                    <>
                                                        <div className="pb-2">{periodHashmapsSlotB[classroom.RoomNo][period].staffs.Name}</div>
                                                        <div className="pb-2">{periodHashmapsSlotB[classroom.RoomNo][period].subjects.Subject}</div>
                                                        <div>{periodHashmapsSlotB[classroom.RoomNo][period].classes.Year} {periodHashmapsSlotB[classroom.RoomNo][period].classes.Programme} {periodHashmapsSlotB[classroom.RoomNo][period].classes.Course} {periodHashmapsSlotB[classroom.RoomNo][period].classes.Section}</div>
                                                    </>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default Admin;