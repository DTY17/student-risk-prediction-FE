import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react";

type Gender = "Male" | "Female";

interface Student {
  id: number;

  name: string;

  age: number;

  gender: Gender;

  admission_grade: number;

  scholarship_holder: boolean;

  debtor: boolean;

  tuition_fees_up_to_date: boolean;

  semester1_enrolled_units: number;

  semester1_approved_units: number;

  semester1_grade: number;

  semester2_enrolled_units: number;

  semester2_approved_units: number;

  semester2_grade: number;
}

interface StudentForm {
  name: string;

  age: string;

  gender: Gender;

  admission_grade: string;

  scholarship_holder: boolean;

  debtor: boolean;

  tuition_fees_up_to_date: boolean;

  semester1_enrolled_units: string;

  semester1_approved_units: string;

  semester1_grade: string;

  semester2_enrolled_units: string;

  semester2_approved_units: string;

  semester2_grade: string;
}

interface StudentSummary {
  age: number;

  gender: Gender;

  admission_grade: number;

  semester1_pass_rate: number;

  semester2_pass_rate: number;

  average_semester_grade: number;

  academic_progress: number;

  total_approved_units: number;

  financial_risk_score: number;
}

interface PredictionResponse {
  success: boolean;

  prediction: string;

  risk_level: "HIGH" | "MEDIUM" | "LOW";

  probabilities: Record<string, number>;

  student_summary?: StudentSummary;
}

const initialFormData: StudentForm = {
  name: "",

  age: "",

  gender: "Male",

  admission_grade: "",

  scholarship_holder: false,

  debtor: false,

  tuition_fees_up_to_date: true,

  semester1_enrolled_units: "",

  semester1_approved_units: "",

  semester1_grade: "",

  semester2_enrolled_units: "",

  semester2_approved_units: "",

  semester2_grade: "",
};

function StudentDashboard() {
  const [formData, setFormData] =
    useState<StudentForm>(initialFormData);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const [prediction, setPrediction] =
    useState<PredictionResponse | null>(null);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  const [showModal, setShowModal] =
    useState<boolean>(false);

  // =========================================================
  // LOAD STUDENTS FROM LOCAL STORAGE
  // =========================================================

  useEffect(() => {
    const savedStudents =
      localStorage.getItem("students");

    if (savedStudents) {
      setStudents(
        JSON.parse(savedStudents)
      );
    }
  }, []);

  // =========================================================
  // SAVE STUDENTS TO LOCAL STORAGE
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "students",
      JSON.stringify(students)
    );
  }, [students]);

  // =========================================================
  // NORMAL INPUT CHANGE
  // =========================================================

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,

      [name]: value,
    }));
  };

  // =========================================================
  // BOOLEAN CHANGE
  // =========================================================

  const handleBooleanChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,

      [name]: value === "true",
    }));
  };

  // =========================================================
  // ADD STUDENT
  // =========================================================

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (
      Number(
        formData.semester1_approved_units
      ) >
      Number(
        formData.semester1_enrolled_units
      )
    ) {
      setError(
        "Semester 1 approved units cannot be greater than enrolled units."
      );

      return;
    }

    if (
      Number(
        formData.semester2_approved_units
      ) >
      Number(
        formData.semester2_enrolled_units
      )
    ) {
      setError(
        "Semester 2 approved units cannot be greater than enrolled units."
      );

      return;
    }

    const newStudent: Student = {
      id: Date.now(),

      name: formData.name,

      age: Number(formData.age),

      gender: formData.gender,

      admission_grade: Number(
        formData.admission_grade
      ),

      scholarship_holder:
        formData.scholarship_holder,

      debtor:
        formData.debtor,

      tuition_fees_up_to_date:
        formData.tuition_fees_up_to_date,

      semester1_enrolled_units:
        Number(
          formData.semester1_enrolled_units
        ),

      semester1_approved_units:
        Number(
          formData.semester1_approved_units
        ),

      semester1_grade:
        Number(
          formData.semester1_grade
        ),

      semester2_enrolled_units:
        Number(
          formData.semester2_enrolled_units
        ),

      semester2_approved_units:
        Number(
          formData.semester2_approved_units
        ),

      semester2_grade:
        Number(
          formData.semester2_grade
        ),
    };

    setStudents((previous) => [
      ...previous,

      newStudent,
    ]);

    setFormData(
      initialFormData
    );
  };

  // =========================================================
  // CLICK STUDENT
  // =========================================================

  const handleStudentClick =
    async (student: Student) => {

      setSelectedStudent(
        student
      );

      setShowModal(true);

      setPrediction(null);

      setError("");

      setLoading(true);

      try {
        const requestData = {
          age:
            student.age,

          gender:
            student.gender,

          admission_grade:
            student.admission_grade,

          scholarship_holder:
            student.scholarship_holder,

          debtor:
            student.debtor,

          tuition_fees_up_to_date:
            student.tuition_fees_up_to_date,

          semester1_enrolled_units:
            student.semester1_enrolled_units,

          semester1_approved_units:
            student.semester1_approved_units,

          semester1_grade:
            student.semester1_grade,

          semester2_enrolled_units:
            student.semester2_enrolled_units,

          semester2_approved_units:
            student.semester2_approved_units,

          semester2_grade:
            student.semester2_grade,
        };

        const response =
          await fetch(
            "http://127.0.0.1:8000/predict",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  requestData
                ),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              "Prediction failed."
          );
        }

        setPrediction(
          data as PredictionResponse
        );
      } catch (err) {
        if (
          err instanceof Error
        ) {
          setError(
            err.message
          );
        } else {
          setError(
            "Prediction failed."
          );
        }
      } finally {
        setLoading(false);
      }
    };

  // =========================================================
  // DELETE STUDENT
  // =========================================================

  const deleteStudent = (
    id: number
  ) => {
    setStudents(
      students.filter(
        (student) =>
          student.id !== id
      )
    );
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    setShowModal(false);

    setSelectedStudent(null);

    setPrediction(null);

    setError("");
  };

  // =========================================================
  // RISK CLASS
  // =========================================================

  const getRiskClass = (
    risk: string
  ) => {
    if (risk === "HIGH") {
      return "bg-danger";
    }

    if (risk === "MEDIUM") {
      return "bg-warning text-dark";
    }

    return "bg-success";
  };

  return (
    <>
      {/* ====================================== */}
      {/* PAGE HEADER */}
      {/* ====================================== */}

      <div className="mb-4">
        <h2 className="fw-bold">
          Student Management
        </h2>

        <p className="text-muted">
          Add student academic information and
          click a student from the list to view
          their academic risk prediction.
        </p>
      </div>

      {/* ====================================== */}
      {/* ADD STUDENT */}
      {/* ====================================== */}

      <div className="card border-0 shadow-sm mb-5">
        <div className="card-body p-4">

          <h4 className="section-title">
            Add Student Data
          </h4>

          <form
            onSubmit={
              handleSubmit
            }
          >

            {/* PERSONAL INFORMATION */}

            <h6 className="form-section-heading">
              Personal Information
            </h6>

            <div className="row g-3">

              <div className="col-md-3">

                <label className="form-label">
                  Student Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter name"
                  required
                />

              </div>

              <div className="col-md-3">

                <label className="form-label">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  className="form-control"
                  value={
                    formData.age
                  }
                  onChange={
                    handleChange
                  }
                  min={15}
                  max={100}
                  required
                />

              </div>

              <div className="col-md-3">

                <label className="form-label">
                  Gender
                </label>

                <select
                  name="gender"
                  className="form-select"
                  value={
                    formData.gender
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>
                </select>

              </div>

              <div className="col-md-3">

                <label className="form-label">
                  Admission Grade
                </label>

                <input
                  type="number"
                  name="admission_grade"
                  className="form-control"
                  step="0.01"
                  min={0}
                  max={200}
                  value={
                    formData
                      .admission_grade
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

            </div>

            {/* FINANCIAL */}

            <h6 className="form-section-heading mt-4">
              Financial Information
            </h6>

            <div className="row g-3">

              <div className="col-md-4">

                <label className="form-label">
                  Scholarship Holder
                </label>

                <select
                  name="scholarship_holder"
                  className="form-select"
                  value={
                    formData
                      .scholarship_holder
                      ? "true"
                      : "false"
                  }
                  onChange={
                    handleBooleanChange
                  }
                >
                  <option value="false">
                    No
                  </option>

                  <option value="true">
                    Yes
                  </option>
                </select>

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Debtor
                </label>

                <select
                  name="debtor"
                  className="form-select"
                  value={
                    formData.debtor
                      ? "true"
                      : "false"
                  }
                  onChange={
                    handleBooleanChange
                  }
                >
                  <option value="false">
                    No
                  </option>

                  <option value="true">
                    Yes
                  </option>
                </select>

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Tuition Fees Up To Date
                </label>

                <select
                  name="tuition_fees_up_to_date"
                  className="form-select"
                  value={
                    formData
                      .tuition_fees_up_to_date
                      ? "true"
                      : "false"
                  }
                  onChange={
                    handleBooleanChange
                  }
                >
                  <option value="true">
                    Yes
                  </option>

                  <option value="false">
                    No
                  </option>
                </select>

              </div>

            </div>

            {/* SEMESTER 1 */}

            <h6 className="form-section-heading mt-4">
              Semester 1
            </h6>

            <div className="row g-3">

              <div className="col-md-4">

                <label className="form-label">
                  Enrolled Units
                </label>

                <input
                  type="number"
                  name="semester1_enrolled_units"
                  className="form-control"
                  min={0}
                  value={
                    formData
                      .semester1_enrolled_units
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Approved Units
                </label>

                <input
                  type="number"
                  name="semester1_approved_units"
                  className="form-control"
                  min={0}
                  value={
                    formData
                      .semester1_approved_units
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Average Grade
                </label>

                <input
                  type="number"
                  name="semester1_grade"
                  className="form-control"
                  min={0}
                  max={20}
                  step="0.01"
                  value={
                    formData
                      .semester1_grade
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

            </div>

            {/* SEMESTER 2 */}

            <h6 className="form-section-heading mt-4">
              Semester 2
            </h6>

            <div className="row g-3">

              <div className="col-md-4">

                <label className="form-label">
                  Enrolled Units
                </label>

                <input
                  type="number"
                  name="semester2_enrolled_units"
                  className="form-control"
                  min={0}
                  value={
                    formData
                      .semester2_enrolled_units
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Approved Units
                </label>

                <input
                  type="number"
                  name="semester2_approved_units"
                  className="form-control"
                  min={0}
                  value={
                    formData
                      .semester2_approved_units
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Average Grade
                </label>

                <input
                  type="number"
                  name="semester2_grade"
                  className="form-control"
                  min={0}
                  max={20}
                  step="0.01"
                  value={
                    formData
                      .semester2_grade
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

            </div>

            {error && !showModal && (
              <div className="alert alert-danger mt-4">
                {error}
              </div>
            )}

            <div className="text-end mt-4">

              <button
                type="submit"
                className="btn btn-primary px-4"
              >
                + Add Student
              </button>

            </div>

          </form>

        </div>
      </div>

      {/* ====================================== */}
      {/* STUDENT LIST */}
      {/* ====================================== */}

      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>
              <h4 className="mb-1">
                Student Data List
              </h4>

              <small className="text-muted">
                Click a student to view their prediction
              </small>
            </div>

            <span className="badge bg-primary fs-6">
              {students.length} Students
            </span>

          </div>

          {students.length === 0 ? (

            <div className="empty-state">

              <h5>
                No Students Added
              </h5>

              <p className="text-muted mb-0">
                Add your first student using the form above.
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead className="table-light">

                  <tr>
                    <th>#</th>

                    <th>
                      Name
                    </th>

                    <th>
                      Age
                    </th>

                    <th>
                      Gender
                    </th>

                    <th>
                      Admission Grade
                    </th>

                    <th>
                      Semester 1
                    </th>

                    <th>
                      Semester 2
                    </th>

                    <th>
                      Action
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {students.map(
                    (
                      student,
                      index
                    ) => (

                      <tr
                        key={
                          student.id
                        }
                        className="student-row"
                        onClick={() =>
                          handleStudentClick(
                            student
                          )
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td className="fw-semibold">
                          {
                            student.name
                          }
                        </td>

                        <td>
                          {
                            student.age
                          }
                        </td>

                        <td>
                          {
                            student.gender
                          }
                        </td>

                        <td>
                          {
                            student
                              .admission_grade
                          }
                        </td>

                        <td>
                          {
                            student
                              .semester1_grade
                          }
                        </td>

                        <td>
                          {
                            student
                              .semester2_grade
                          }
                        </td>

                        <td>

                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              deleteStudent(
                                student.id
                              );
                            }}
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* ====================================== */}
      {/* PREDICTION POPUP */}
      {/* ====================================== */}

      {showModal &&
        selectedStudent && (

          <div className="prediction-modal-overlay">

            <div className="prediction-modal">

              <div className="modal-header-custom">

                <div>

                  <h4 className="mb-1">
                    {
                      selectedStudent.name
                    }
                  </h4>

                  <small className="text-muted">
                    Student Prediction Details
                  </small>

                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={
                    closeModal
                  }
                />

              </div>

              <div className="modal-body-custom">

                {/* STUDENT DATA */}

                <div className="student-information-card">

                  <h5>
                    Student Information
                  </h5>

                  <div className="row mt-3">

                    <div className="col-md-4 mb-3">
                      <span className="detail-label">
                        Age
                      </span>

                      <strong>
                        {
                          selectedStudent.age
                        }
                      </strong>
                    </div>

                    <div className="col-md-4 mb-3">
                      <span className="detail-label">
                        Gender
                      </span>

                      <strong>
                        {
                          selectedStudent.gender
                        }
                      </strong>
                    </div>

                    <div className="col-md-4 mb-3">
                      <span className="detail-label">
                        Admission Grade
                      </span>

                      <strong>
                        {
                          selectedStudent
                            .admission_grade
                        }
                      </strong>
                    </div>

                  </div>

                </div>

                {/* LOADING */}

                {loading && (

                  <div className="text-center py-5">

                    <div
                      className="spinner-border text-primary"
                      role="status"
                    />

                    <p className="mt-3 text-muted">
                      Generating prediction...
                    </p>

                  </div>

                )}

                {/* ERROR */}

                {error &&
                  showModal && (

                    <div className="alert alert-danger mt-4">
                      {error}
                    </div>

                  )}

                {/* RESULT */}

                {!loading &&
                  prediction && (

                    <div className="mt-4">

                      <div className="prediction-result text-center">

                        <p className="text-muted mb-2">
                          Predicted Academic Outcome
                        </p>

                        <h1 className="prediction-title">
                          {
                            prediction.prediction
                          }
                        </h1>

                        <span
                          className={`badge fs-6 ${getRiskClass(
                            prediction.risk_level
                          )}`}
                        >
                          Risk Level:{" "}
                          {
                            prediction.risk_level
                          }
                        </span>

                      </div>

                      <hr className="my-4" />

                      <h5 className="mb-3">
                        Prediction Probabilities
                      </h5>

                      {Object.entries(
                        prediction.probabilities
                      ).map(
                        ([
                          className,
                          probability,
                        ]) => (

                          <div
                            className="mb-3"
                            key={
                              className
                            }
                          >

                            <div className="d-flex justify-content-between mb-1">

                              <span>
                                {
                                  className
                                }
                              </span>

                              <strong>
                                {
                                  probability
                                }
                                %
                              </strong>

                            </div>

                            <div className="progress">

                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                  width: `${probability}%`,
                                }}
                              />

                            </div>

                          </div>

                        )
                      )}

                      {prediction.student_summary && (

                        <>

                          <hr className="my-4" />

                          <h5>
                            Academic Analysis
                          </h5>

                          <div className="row mt-3">

                            <div className="col-md-6 mb-3">

                              <div className="summary-box">

                                <span>
                                  Semester 1 Pass Rate
                                </span>

                                <strong>
                                  {
                                    prediction
                                      .student_summary
                                      .semester1_pass_rate
                                  }
                                  %
                                </strong>

                              </div>

                            </div>

                            <div className="col-md-6 mb-3">

                              <div className="summary-box">

                                <span>
                                  Semester 2 Pass Rate
                                </span>

                                <strong>
                                  {
                                    prediction
                                      .student_summary
                                      .semester2_pass_rate
                                  }
                                  %
                                </strong>

                              </div>

                            </div>

                            <div className="col-md-6 mb-3">

                              <div className="summary-box">

                                <span>
                                  Average Grade
                                </span>

                                <strong>
                                  {
                                    prediction
                                      .student_summary
                                      .average_semester_grade
                                  }
                                </strong>

                              </div>

                            </div>

                            <div className="col-md-6 mb-3">

                              <div className="summary-box">

                                <span>
                                  Academic Progress
                                </span>

                                <strong>
                                  {
                                    prediction
                                      .student_summary
                                      .academic_progress
                                  }
                                </strong>

                              </div>

                            </div>

                            <div className="col-md-6 mb-3">

                              <div className="summary-box">

                                <span>
                                  Approved Units
                                </span>

                                <strong>
                                  {
                                    prediction
                                      .student_summary
                                      .total_approved_units
                                  }
                                </strong>

                              </div>

                            </div>

                            <div className="col-md-6 mb-3">

                              <div className="summary-box">

                                <span>
                                  Financial Risk
                                </span>

                                <strong>
                                  {
                                    prediction
                                      .student_summary
                                      .financial_risk_score
                                  }
                                </strong>

                              </div>

                            </div>

                          </div>

                        </>

                      )}

                    </div>

                  )}

              </div>

              <div className="modal-footer-custom">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={
                    closeModal
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

    </>
  );
}

export default StudentDashboard;