import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Class_Editor() {
    let { programme, course, year, section, order } = useParams();
    const navigate = useNavigate();
    const [classID, setClassID] = useState('');

    const [staffs, setStaffs] = useState([]);

    const [classSubjects, setClassSubjects] = useState([]);
    const [staffSubjects, setStaffSubjects] = useState([]);
    const [slot, setSlot] = useState('');
    const [periodHashmaps, setPeriodHashmaps] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await fetchClassid();
            await fetchAllStaffs();
        }
        fetchData();
    }, [programme, course, year, section, order]);

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
            return;
        }

        const id = data.map(item => item.id);
        setClassID(id);
        let classIds = data ? data.map(item => item.id) : [];
        setClassID(classIds);
        if (classIds.length === 0) {
            const insertResult = await supabase
                .from('classes')
                .insert({
                    Programme: programme,
                    Course: course,
                    Year: year,
                    Section: section,
                    Slot: (year === 'II') ? 'B' : 'A'
                })
                .select('id');
            if (insertResult.error) {
                console.error(insertResult.error);
                return;
            }
            classIds = insertResult.data.map(item => item.id);
            setClassID(classIds);
        }

        fetchSubjects(classIds);

        let periodMaps = [];
        const periods = await fetchClassPeriods(classIds, order);
        if (periods) periodMaps.push(periods);
        setPeriodHashmaps(periodMaps);

        const slot = data ? data.map(item => item.Slot) : [];
        setSlot(slot);
    }

    async function fetchClassPeriods(classIds, order) {
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
        const { data, error } = await supabase
            .from('subjects')
            .select(`
                id,
                Subject,
                staffs:Staff_id(id, Name)
            `)
            .in('Class_id', classIds);
        if (error) {
            console.error(error);
        } else {          
            setClassSubjects(data);  
            const staffSubjectsPromises = data.map(async (subject) => {
                const staffPeriods = await fetchStaffPeriods(subject.staffs.id, order);
                return {
                    ...subject,
                    staffPeriods
                };
            });
            
            const subjectsWithPeriods = await Promise.all(staffSubjectsPromises);
            setStaffSubjects(subjectsWithPeriods);
        }
    }

    async function fetchStaffPeriods(staffId, order) {
        const { data, error } = await supabase
            .from('periods')
            .select(`
                Period,
                subjects:Subject_id(Subject),
                classes:Class_id(*),
                classrooms:ClassRoom_id(RoomNo)
            `)
            .eq('Staff_id', staffId)
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

    async function fetchAllStaffs() {
        let { data, error } = await supabase
            .from('staffs')
            .select('*');
        if (error) {
            console.error('Error accessing Database: ', error);
            return;
        }
        if (!data || !Array.isArray(data)) {
            console.error('No data found or data is not an array');
            return;
        }

        setStaffs(data);
    }

    const addPeriod = async (e, period) => {
        e.preventDefault();

        const classroom = document.getElementById(`classroom-${period}`).value;
        const subject = document.getElementById(`subject-${period}`).value;

        let { data, error } = await supabase
            .from('classrooms')
            .select('id')
            .eq('RoomNo', classroom)
            .single();
        if (error) {
            console.error('Error fetching Room ID:', error);
            return;
        }
        const classroom_id = data.id;

        ({ data, error } = await supabase
            .from('subjects')
            .select('id, Staff_id')
            .eq('Subject', subject)
            .eq('Class_id', classID[0])
            .single());
        if (error) {
            console.error('Error fetching Subject ID and Staff ID:', error);
            return;
        }
        const subject_id = data.id;
        const staff_id = data.Staff_id;

        // Check if the period already exists
        ({ data, error } = await supabase
            .from('periods')
            .select('*')
            .eq('Class_id', classID[0])
            .eq('Order', order)
            .eq('Slot', slot[0])
            .eq('Period', period)
            .single());
        if (error && error.code !== 'PGRST116') {
            console.error('Error checking if period exists :', error);
            return;
        }
        console.log(data);

        if (data) { // Perform update operation
            if (data.ClassRoom_id !== classroom_id) { // Check Classroom availability
                let { classroomData, error } = await supabase
                    .from('periods')
                    .select('*')
                    .eq('Order', order)
                    .eq('Slot', slot[0])
                    .eq('Period', period)
                    .eq('ClassRoom_id', classroom_id)
                    .single();
                if (error && error.code !== 'PGRST116') {
                    console.error('Error checking Database :', error);
                    return;
                }
                if (classroomData) {
                    window.alert('Classroom Not Available');
                    return;
                }
            }
            console.log(data);
            if (data.Staff_id !== staff_id) { // Check Staff availability
                let { staffData, error } = await supabase
                    .from('periods')
                    .select('*')
                    .eq('Order', order)
                    .eq('Slot', slot[0])
                    .eq('Period', period)
                    .eq('Staff_id', staff_id)
                    .single();
                if (error && error.code !== 'PGRST116') {
                    console.error('Error checking Database :', error);
                    return;
                }
                if (staffData) {
                    window.alert('Staff Not Available');
                    return;
                }
            }

            ({ data, error } = await supabase
                .from('periods')
                .update({
                    ClassRoom_id: classroom_id,
                    Staff_id: staff_id,
                    Subject_id: subject_id
                })
                .eq('Class_id', classID[0])
                .eq('Order', order)
                .eq('Slot', slot[0])
                .eq('Period', period));
            if (error) {
                console.error('Error updating period :', error);
            }
        } else { // Perform insert operation

            // Check Classroom Availablity
            ({ data, error } = await supabase
                .from('periods')
                .select('*')
                .eq('Order', order)
                .eq('Slot', slot[0])
                .eq('Period', period)
                .eq('ClassRoom_id', classroom_id)
                .single());
            if (error && error.code !== 'PGRST116') {
                console.error('Error checking Database :', error);
                return;
            }
            if (data) {
                window.alert('Classroom Not Available');
                return;
            }

            // Check Staff Availablity
            ({ data, error } = await supabase
                .from('periods')
                .select('*')
                .eq('Order', order)
                .eq('Slot', slot[0])
                .eq('Period', period)
                .eq('Staff_id', staff_id)
                .single());
            if (error && error.code !== 'PGRST116') {
                console.error('Error checking Database :', error);
                return;
            }
            if (data) {
                window.alert('Staff Not Available');
                return;
            }

            // Insert into Database
            ({ data, error } = await supabase
                .from('periods')
                .insert({
                    Class_id: classID[0],
                    Order: order,
                    Slot: slot[0],
                    Period: period,
                    ClassRoom_id: classroom_id,
                    Staff_id: staff_id,
                    Subject_id: subject_id
                }));
            if (error) {
                console.error('Error inserting period :', error);
            }
        }

        await fetchSubjects(classID);
    };

    const deletePeriod = async (period) => {
    let { data, error } = await supabase
        .from('periods')
        .delete()
        .eq('Class_id', classID[0])
        .eq('Order', order)
        .eq('Slot', slot[0])
        .eq('Period', period);
    if (error) {
        console.error('Error deleting period :', error);
    }
    await fetchClassid(); // Refresh the data after deletion
    await fetchClassPeriods(classID, order);
    document.getElementById(period).reset();
}

    const addSubject = async (e) =>{
        e.preventDefault();

        let formstaffid = document.getElementById('addsubject-staff').value;
        let subject = document.getElementById('addsubject-subject').value;
        let subj_type = document.getElementById('addsubject-type').value;

        console.log(formstaffid);

        let { data, error } = await supabase
            .from('staffs')
                .select('id')
                .eq('EmpID', formstaffid)
                .single();
        if (error) {
            console.error('Error fetching staff id :', error);
        }
        const staff_id = data.id;

        // Check if the Subject name has a Duplicate
        ({ data, error } = await supabase
            .from('subjects')
            .select('*')
            .eq('Class_id', classID[0])
            .eq('Subject', subject)
            .single());
        if (error && error.code !== 'PGRST116') {
            console.error('Error checking Database :', error);
            return;
        }
        while (data) {
            subject += "_";
            ({ data, error } = await supabase
                .from('subjects')
                .select('*')
                .eq('Class_id', classID[0])
                .eq('Subject', subject)
                .single());
            if (error && error.code !== 'PGRST116') {
                console.error('Error checking Database :', error);
                return;
            }
        }

        ({ data, error } = await supabase
            .from('subjects')
            .insert({
                Class_id: classID[0],
                Staff_id: staff_id,
                Subject: subject,
                Type: subj_type
            }));
        if (error) {
            console.error('Error inserting subject :', error);
        }

        await fetchSubjects(classID);

        document.getElementById("addsubject-form").reset();
    }

    const deleteSubject = async (subject_id) => {
        console.log(subject_id)
        let { data, error } = await supabase
            .from('subjects')
            .delete()
            .eq('id', subject_id);
        if (error) {
            console.error('Error deleting subject :', error);
        }
        await fetchSubjects(classID);
    }

    const changeClass = (e) => {
        e.preventDefault();
        const url = `/editor/${programme}/${course}/${document.getElementById('Year').value}/${document.getElementById('Section').value}/${order}`;
        navigate(url);
        window.location.reload();
    }

    return (
        <div className="flex justify-center items-center flex-wrap">
            <div className="w-full p-5">
                <h2 className="text-lg lg:text-2xl text-center">{programme} {course}</h2>
                <form action="" onSubmit={(e) => changeClass(e)} className="flex justify-center items-center">
                    <label className="mr-3">Year</label>
                    <select
                        id="Year"
                        className="rounded-lg border-gray-800 p-4 pe-12 text-sm shadow-sm"
                        required
                        defaultValue={year}
                    >
                        <option value="I">I</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                    </select>
                    <label className="mx-3">Section</label>
                    <select
                        id="Section"
                        className="rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                        required
                        defaultValue={section}
                    >
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
                    <button type="submit" className="ml-5 px-5 py-2 bg-blue-600 text-white">Switch</button>
                </form>
                <nav className="flex justify-center p-5 mt-3">
                    <Link to={`/editor/${programme}/${course}/${year}/${section}/1`} className="p-5 bg-slate-200 mx-2 hover:bg-blue-600 hover:text-white transition-all duration-300" style={order === '1' ? {background:'#2563eb', color:'#fff'} : {}}>Day Order 1</Link>
                    <Link to={`/editor/${programme}/${course}/${year}/${section}/2`} className="p-5 bg-slate-200 mx-2 hover:bg-blue-600 hover:text-white transition-all duration-300" style={order === '2' ? {background:'#2563eb', color:'#fff'} : {}}>Day Order 2</Link>
                    <Link to={`/editor/${programme}/${course}/${year}/${section}/3`} className="p-5 bg-slate-200 mx-2 hover:bg-blue-600 hover:text-white transition-all duration-300" style={order === '3' ? {background:'#2563eb', color:'#fff'} : {}}>Day Order 3</Link>
                    <Link to={`/editor/${programme}/${course}/${year}/${section}/4`} className="p-5 bg-slate-200 mx-2 hover:bg-blue-600 hover:text-white transition-all duration-300" style={order === '4' ? {background:'#2563eb', color:'#fff'} : {}}>Day Order 4</Link>
                    <Link to={`/editor/${programme}/${course}/${year}/${section}/5`} className="p-5 bg-slate-200 mx-2 hover:bg-blue-600 hover:text-white transition-all duration-300" style={order === '5' ? {background:'#2563eb', color:'#fff'} : {}}>Day Order 5</Link>
                </nav>

                <datalist id="subjects-datalist">
                    {classSubjects.map((item, key) =>
                        <option key={key} value={item.Subject}>
                            {item.staffs.Name}
                        </option>
                    )}
                </datalist>

                <datalist id="staffs-datalist">
                    {staffs.map((item, key) =>
                        <option key={key} value={item.EmpID}>
                            {item.Name}
                        </option>
                    )}
                </datalist>

                <div className="overflow-x-auto mt-6">
                    <table className="min-w-full bg-white">
                        <tbody>
                            <tr>
                                <th className="py-5 px-2 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">Class</th>
                                <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{slot[0] === 'A' ? (<>08:15AM - 09:30AM</>) : (<>12:20PM - 01:35PM</>)}</th>
                                <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{slot[0] === 'A' ? (<>09:35AM - 10:50AM</>) : (<>01:40PM - 02:55PM</>)}</th>
                                <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{slot[0] === 'A' ? (<>11:00AM - 12:15PM</>) : (<>03:05PM - 04:20PM</>)}</th>
                                <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{slot[0] === 'A' ? (<>12:20PM - 01:35PM</>) : (<>04:25PM - 05:40PM</>)}</th>
                            </tr>
                            {periodHashmaps.map((periodMap, index) => (
                                <tr key={index}>
                                    <th className="py-5 px-2 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider w-44">{year} {programme} {course} {section}</th>
                                    {[1, 2, 3, 4].map(period => (
                                        <td key={period} className="py-5 px-8 border border-gray-200 text-sm lg:text-lg text-gray-700 text-center">
                                            {periodMap[period] ? (
                                                <form onSubmit={(e) => addPeriod(e, period)} id={period}>
                                                    <input type="text" name={`classroom-${period}`} id={`classroom-${period}`} placeholder='Room No' className="border border-gray-400 px-2 text-base w-full my-2" defaultValue={periodMap[period].classrooms.RoomNo} required />
                                                    <input type="text" name={`subject-${period}`} id={`subject-${period}`} placeholder='Subject' list="subjects-datalist" className="border border-gray-400 px-2 text-base w-full my-2" defaultValue={periodMap[period].subjects.Subject} required />
                                                    <button type="submit" className="bg-blue-600 px-5 py-2 text-white my-2">Add Period</button>
                                                    <button type="button" className="bg-red-600 px-5 py-2 text-white my-2" onClick={() => deletePeriod(period)}>Delete Period</button>
                                                </form>
                                            ) : (
                                                <form onSubmit={(e) => addPeriod(e, period)} id={period}>
                                                    <input type="text" name={`classroom-${period}`} id={`classroom-${period}`} placeholder='Room No' className="border border-gray-400 px-2 text-base w-full my-2" required />
                                                    <input type="text" name={`subject-${period}`} id={`subject-${period}`} placeholder='Subject' list="subjects-datalist" className="border border-gray-400 px-2 text-base w-full my-2" required />
                                                    <button type="submit" className="bg-blue-600 px-5 py-2 text-white my-2">Add Period</button>
                                                    <button type="button" className="bg-red-600 px-5 py-2 text-white my-2" onClick={() => deletePeriod(period)}>Delete Period</button>
                                                </form>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h3 className="text-2xl text-center mt-6">Course handling Faculty Members</h3>
                <div className="overflow-x-auto mt-2 flex justify-center">
                    <table className="bg-white min-w-full">
                        <thead>
                            <tr>
                                <th className="py-5 px-2 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">Staff</th>
                                <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{slot[0] === 'A' ? (<>08:15AM - 09:30AM</>) : (<>12:20PM - 01:35PM</>)}</th>
                                <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{slot[0] === 'A' ? (<>09:35AM - 10:50AM</>) : (<>01:40PM - 02:55PM</>)}</th>
                                <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{slot[0] === 'A' ? (<>11:00AM - 12:15PM</>) : (<>03:05PM - 04:20PM</>)}</th>
                                <th className="py-5 px-8 border border-gray-200 bg-blue-600 text-center text-sm lg:text-xl font-medium text-white uppercase tracking-wider">{slot[0] === 'A' ? (<>12:20PM - 01:35PM</>) : (<>04:25PM - 05:40PM</>)}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffSubjects.map((staffSubject, index) => (
                                <tr key={index}>
                                    <th className="py-5 px-2 border border-gray-200 bg-blue-600 text-center text-sm lg:text-lg font-medium text-white tracking-wider w-44"><p className="mb-3">{staffSubject.staffs.Name}</p><p className="mt-3 text-sm">{staffSubject.Subject}</p><p><button className="bg-red-600 px-3 py-1 text-white mx-2 text-xs mt-4" onClick={() => deleteSubject(staffSubject.id)}>Delete Subject</button></p></th>
                                    {[1, 2, 3, 4].map(period => (
                                        <td key={period} className="border border-gray-200 text-sm lg:text-lg text-gray-700 text-center">
                                            {staffSubject.staffPeriods && staffSubject.staffPeriods[period] ? (
                                                <div className="py-5 px-8 " style={classID == staffSubject.staffPeriods[period].classes.id ? {background: '#93c5fd'} : {}}>
                                                    <div className="pb-2">{staffSubject.staffPeriods[period].classrooms.RoomNo}</div>
                                                    <div className="pb-2">{staffSubject.staffPeriods[period].subjects.Subject}</div>
                                                    <div>{staffSubject.staffPeriods[period].classes.Year} {staffSubject.staffPeriods[period].classes.Programme} {staffSubject.staffPeriods[period].classes.Course} {staffSubject.staffPeriods[period].classes.Section}</div>
                                                </div>
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

                <div className="py-5 px-2 border border-gray-200 text-2xl text-center">
                    <h3 className="mb-4">Add new Subject</h3>
                    <form onSubmit={(e) => addSubject(e)} id='addsubject-form'>
                        <input type="text" name='addsubject-staff' id='addsubject-staff' list="staffs-datalist" placeholder='Staff ID' className="border border-gray-400 px-2 text-base w-44 mx-2" required />
                        <input type="text" name='addsubject-subject' id='addsubject-subject' placeholder='Subject Name' className="border border-gray-400 px-2 text-base w-44 mx-2" required />
                        <select name="addsubject-type" id="addsubject-type" className="border border-gray-400 px-2 text-base w-44 mx-2">
                            <option value="Major">Major</option>
                            <option value="Elective">Elective</option>
                        </select>
                        <button type="submit" className="bg-blue-600 px-5 py-2 text-white mx-2 text-lg">Add Subject</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Class_Editor;