import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Student from './components/Student';
import Student_Timetable from './components/Student_Timetable';
import Staff from './components/Staff';
import Staff_Timetable from './components/Staff_Timetable';
import Classroom from './components/Classroom';
import Classroom_Timetable from './components/Classroom_Timetable';
import Editor from './components/Editor';
import Class_Editor from './components/Class_Editor';
import Staff_Editor from './components/Staff_Editor';
import Admin from './components/Admin';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="/" element={<Student />} />
      <Route path="/:programme/:course/:year/:section" element={<Student_Timetable />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/staff/:empid" element={<Staff_Timetable />} />
      <Route path="/classroom" element={<Classroom />} />
      <Route path="/classroom/:roomno" element={<Classroom_Timetable />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/editor/:programme/:course/:year/:section/:order" element={<Class_Editor />} />
      <Route path="/editor/addstaff" element={<Staff_Editor />} />
      <Route path="/admin" element={<Admin />} />
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;