import {
  useEffect,
  useState
} from "react";


import StudentForm
  from "./components/StudentForm";

import StudentList
  from "./components/StudentList";

import PredictionModal
  from "./components/PredictionModal";

import EditStudentModal
  from "./components/EditStudentModal";


import {
  createStudent,
  deleteStudent,
  getStudents,
  predictStudent,
  updateStudent,
} from "./services/studentApi";


import type {
  PredictionResponse,
  Student,
  StudentCreate
} from "./types/student";


function App() {

  const [students, setStudents] =
    useState<Student[]>([]);

  const [loadingStudents, setLoadingStudents] =
    useState(true);

  const [pageError, setPageError] =
    useState("");


  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);


  const [editingStudent, setEditingStudent] =
    useState<Student | null>(null);


  const [prediction, setPrediction] =
    useState<PredictionResponse | null>(
      null
    );


  const [predictionLoading, setPredictionLoading] =
    useState(false);


  const [predictionError, setPredictionError] =
    useState("");


  const loadStudents =
    async () => {

      try {

        setLoadingStudents(
          true
        );

        setPageError("");

        const data =
          await getStudents();

        setStudents(
          data
        );

      } catch (error) {

        setPageError(
          error instanceof Error
            ? error.message
            : "Unable to load students."
        );

      } finally {

        setLoadingStudents(
          false
        );
      }
    };


  useEffect(() => {

    loadStudents();

  }, []);


  const handleAdd =
    async (
      student: StudentCreate
    ) => {

      await createStudent(
        student
      );

      await loadStudents();
    };


  const handleDelete =
    async (
      student: Student
    ) => {

      const confirmed =
        window.confirm(
          `Delete ${student.name}?`
        );


      if (!confirmed) {
        return;
      }


      try {

        await deleteStudent(
          student.id
        );

        await loadStudents();

      } catch (error) {

        alert(
          error instanceof Error
            ? error.message
            : "Delete failed."
        );
      }
    };


  const handleUpdate =
    async (
      id: number,
      data: StudentCreate
    ) => {

      await updateStudent(
        id,
        data
      );

      await loadStudents();
    };


  const handlePredict =
    async (
      student: Student
    ) => {

      setSelectedStudent(
        student
      );

      setPrediction(
        null
      );

      setPredictionError(
        ""
      );

      setPredictionLoading(
        true
      );


      try {

        const result =
          await predictStudent(
            student.id
          );

        setPrediction(
          result
        );

      } catch (error) {

        setPredictionError(
          error instanceof Error
            ? error.message
            : "Prediction failed."
        );

      } finally {

        setPredictionLoading(
          false
        );
      }
    };


  return (

    <div className="app-wrapper">

      <nav className="navbar navbar-dark bg-primary shadow-sm">

        <div className="container">

          <span className="navbar-brand fw-bold">
            Student Academic Risk Prediction System
          </span>

        </div>

      </nav>


      <main className="container py-5">

        <div className="mb-4">

          <h2 className="fw-bold">
            Student Management
          </h2>

          <p className="text-muted">
            Add, update and delete student information.
            Click a student row to generate an ML prediction.
          </p>

        </div>


        <StudentForm
          onAdd={
            handleAdd
          }
        />


        {pageError && (

          <div className="alert alert-danger">
            {pageError}
          </div>

        )}


        {loadingStudents
          ? (

            <div className="text-center py-5">

              <div className="spinner-border text-primary" />

              <p className="mt-2">
                Loading students...
              </p>

            </div>

          )
          : (

            <StudentList

              students={
                students
              }

              onPredict={
                handlePredict
              }

              onEdit={
                setEditingStudent
              }

              onDelete={
                handleDelete
              }

            />

          )}


        <PredictionModal

          student={
            selectedStudent
          }

          prediction={
            prediction
          }

          loading={
            predictionLoading
          }

          error={
            predictionError
          }

          onClose={() => {

            setSelectedStudent(
              null
            );

            setPrediction(
              null
            );

          }}

        />


        <EditStudentModal

          student={
            editingStudent
          }

          onClose={() =>
            setEditingStudent(
              null
            )
          }

          onSave={
            handleUpdate
          }

        />

      </main>

    </div>
  );
}


export default App;