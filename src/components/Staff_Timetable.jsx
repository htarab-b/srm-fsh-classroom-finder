import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Staff_Timetable() {
    const { empid } = useParams();

    const [staffName, setStaffName] = useState([]);
    const [periodHashmapsSlotA, setPeriodHashmapsSlotA] = useState([]);
    const [periodHashmapsSlotB, setPeriodHashmapsSlotB] = useState([]);
    const [dayOrder, setDayOrder] = useState(null);

    useEffect(() => {
        async function fetchData() {
            await fetchStaffid();
            await getDayOrder();
        }
        fetchData();
    }, []);

    async function fetchStaffid() {
        const { data, error } = await supabase
        .from('staffs')
        .select('id, Name')
        .eq('EmpID', empid);

        if (error) {
        console.error(error);
        } else {
        const staffID = data.map(item => item.id);

        let periodMapsSlotA = [];
        for (let i = 1; i <= 5; i++) {
            const periods = await fetchPeriods(staffID, i, 'A');
            periodMapsSlotA.push(periods);
        }
        setPeriodHashmapsSlotA(periodMapsSlotA);

        let periodMapsSlotB = [];
        for (let i = 1; i <= 5; i++) {
            const periods = await fetchPeriods(staffID, i, 'B');
            periodMapsSlotB.push(periods);
        }
        setPeriodHashmapsSlotB(periodMapsSlotB);

        const staffName = data.map(item => item.Name);
        setStaffName(staffName);
        }
    }

    async function fetchPeriods(staffID, order, slot) {
        if (staffID.length === 0) return;
        const { data, error } = await supabase
        .from('periods')
        .select(`
            Period,
            subjects:Subject_id(Subject),
            classes:Class_id(*),
            classrooms:ClassRoom_id(RoomNo)
        `)
        .in('Staff_id', staffID)
        .eq('Slot', slot)
        .eq('Order', order);

        if (error) {
        console.error(error);
        return {};
        } else {
            const hashmap = data.reduce((map, item) => {
                if (!map[item.Period]) {
                    map[item.Period] = []; // Initialize an array for this period
                }
                map[item.Period].push(item); // Add the item to the array
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

    return (
        <div className="flex justify-center items-center flex-wrap">
            {empid.length === 0 ? (
                <h2 className="text-sm lg:text-xl min-h-screen flex justify-center items-center">No subjects found. Contact your professor for further clarifications.</h2>
            ) : (
                <div className="w-full p-5">
                    <h2 className="text-2xl lg:text-4xl text-center">{staffName}</h2>
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
                                {periodHashmapsSlotA.map((periodMap, index) => (
                                    <tr key={index}>
                                        <th
                                            className="py-5 px-2 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider"
                                            style={index + 1 === dayOrder ? { borderColor: '#93c5fd' } : {}}
                                        >
                                            {index + 1}
                                        </th>
                                        {[1, 2, 3, 4].map(period => (
                                            <td
                                                key={period}
                                                className="py-5 px-8 border border-gray-200 text-sm lg:text-lg text-gray-700 text-center"
                                                style={index + 1 === dayOrder ? { background: '#93c5fd' } : {}}
                                            >
                                                {periodMap[period] && periodMap[period].length > 0 ? (
                                                    periodMap[period].map((periodItem, idx) => (
                                                        <div key={idx} className="py-4">
                                                            <div className="pb-1 font-semibold">{periodItem.classrooms.RoomNo}</div>
                                                            <div className="pb-1 text-blue-700 font-semibold">{periodItem.subjects.Subject}</div>
                                                            <div>
                                                                {periodItem.classes.Year} {periodItem.classes.Programme} {periodItem.classes.Course} {periodItem.classes.Section}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
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
                                {periodHashmapsSlotB.map((periodMap, index) => (
                                    <tr key={index}>
                                        <th
                                            className="py-5 px-2 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider"
                                            style={index + 1 === dayOrder ? { borderColor: '#93c5fd' } : {}}
                                        >
                                            {index + 1}
                                        </th>
                                        {[1, 2, 3, 4].map(period => (
                                            <td
                                                key={period}
                                                className="py-5 px-8 border border-gray-200 text-sm lg:text-lg text-gray-700 text-center"
                                                style={index + 1 === dayOrder ? { background: '#93c5fd' } : {}}
                                            >
                                                {periodMap[period] && periodMap[period].length > 0 ? (
                                                    periodMap[period].map((periodItem, idx) => (
                                                        <div key={idx} className="py-4">
                                                            <div className="pb-1 font-semibold">{periodItem.classrooms.RoomNo}</div>
                                                            <div className="pb-1 text-blue-700 font-semibold">{periodItem.subjects.Subject}</div>
                                                            <div>
                                                                {periodItem.classes.Year} {periodItem.classes.Programme} {periodItem.classes.Course} {periodItem.classes.Section}
                                                            </div>
                                                        </div>
                                                    ))
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
                </div>
            )}
        </div>
    );
}

export default Staff_Timetable;