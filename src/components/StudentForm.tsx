import { type FormEvent, useState } from "react";

import type { Gender, StudentCreate } from "../types/student";

interface Props {
  onAdd: (student: StudentCreate) => Promise<void>;
}

const emptyForm = {
  name: "",

  age: "",

  gender: "Male" as Gender,

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

function StudentForm({ onAdd }: Props) {
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    const student: StudentCreate = {
      name: form.name,

      age: Number(form.age),

      gender: form.gender,

      admission_grade: Number(form.admission_grade),

      scholarship_holder: form.scholarship_holder,

      debtor: form.debtor,

      tuition_fees_up_to_date: form.tuition_fees_up_to_date,

      semester1_enrolled_units: Number(form.semester1_enrolled_units),

      semester1_approved_units: Number(form.semester1_approved_units),

      semester1_grade: Number(form.semester1_grade),

      semester2_enrolled_units: Number(form.semester2_enrolled_units),

      semester2_approved_units: Number(form.semester2_approved_units),

      semester2_grade: Number(form.semester2_grade),
    };

    if (student.semester1_approved_units > student.semester1_enrolled_units) {
      setError(
        "Semester 1 approved units cannot be greater than enrolled units.",
      );

      return;
    }

    if (student.semester2_approved_units > student.semester2_enrolled_units) {
      setError(
        "Semester 2 approved units cannot be greater than enrolled units.",
      );

      return;
    }

    try {
      setLoading(true);

      await onAdd(student);

      setForm(emptyForm);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to add student.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-5">
      <div className="card-body p-4">
        <h4 className="section-title">Add Student Data</h4>

        <form onSubmit={handleSubmit}>
          <h6 className="form-section-heading">Personal Information</h6>

          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Student Name</label>

              <input
                className="form-control"
                value={form.name}
                required
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Age</label>

              <input
                type="number"
                className="form-control"
                min={15}
                max={100}
                value={form.age}
                required
                onChange={(e) =>
                  setForm({
                    ...form,
                    age: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Gender</label>

              <select
                className="form-select"
                value={form.gender}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gender: e.target.value as Gender,
                  })
                }
              >
                <option value="Male">Male</option>

                <option value="Female">Female</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Admission Grade</label>

              <input
                type="number"
                className="form-control"
                min={0}
                max={200}
                step="0.01"
                required
                value={form.admission_grade}
                onChange={(e) =>
                  setForm({
                    ...form,
                    admission_grade: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <h6 className="form-section-heading mt-4">Financial Information</h6>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Scholarship Holder</label>

              <select
                className="form-select"
                value={String(form.scholarship_holder)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    scholarship_holder: e.target.value === "true",
                  })
                }
              >
                <option value="false">No</option>

                <option value="true">Yes</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Debtor</label>

              <select
                className="form-select"
                value={String(form.debtor)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    debtor: e.target.value === "true",
                  })
                }
              >
                <option value="false">No</option>

                <option value="true">Yes</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Tuition Fees Up To Date</label>

              <select
                className="form-select"
                value={String(form.tuition_fees_up_to_date)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tuition_fees_up_to_date: e.target.value === "true",
                  })
                }
              >
                <option value="true">Yes</option>

                <option value="false">No</option>
              </select>
            </div>
          </div>

          <SemesterFields
            title="Semester 1"
            enrolled={form.semester1_enrolled_units}
            approved={form.semester1_approved_units}
            grade={form.semester1_grade}
            onEnrolled={(value) =>
              setForm({
                ...form,
                semester1_enrolled_units: value,
              })
            }
            onApproved={(value) =>
              setForm({
                ...form,
                semester1_approved_units: value,
              })
            }
            onGrade={(value) =>
              setForm({
                ...form,
                semester1_grade: value,
              })
            }
          />

          <SemesterFields
            title="Semester 2"
            enrolled={form.semester2_enrolled_units}
            approved={form.semester2_approved_units}
            grade={form.semester2_grade}
            onEnrolled={(value) =>
              setForm({
                ...form,
                semester2_enrolled_units: value,
              })
            }
            onApproved={(value) =>
              setForm({
                ...form,
                semester2_approved_units: value,
              })
            }
            onGrade={(value) =>
              setForm({
                ...form,
                semester2_grade: value,
              })
            }
          />

          {error && <div className="alert alert-danger mt-4">{error}</div>}

          <div className="text-end mt-4">
            <button className="btn btn-primary px-4" disabled={loading}>
              {loading ? "Saving..." : "+ Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface SemesterProps {
  title: string;

  enrolled: string;

  approved: string;

  grade: string;

  onEnrolled: (value: string) => void;

  onApproved: (value: string) => void;

  onGrade: (value: string) => void;
}

function SemesterFields({
  title,
  enrolled,
  approved,
  grade,
  onEnrolled,
  onApproved,
  onGrade,
}: SemesterProps) {
  return (
    <>
      <h6 className="form-section-heading mt-4">{title}</h6>

      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Enrolled Units</label>

          <input
            type="number"
            min={0}
            className="form-control"
            value={enrolled}
            required
            onChange={(e) => onEnrolled(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Approved Units</label>

          <input
            type="number"
            min={0}
            className="form-control"
            value={approved}
            required
            onChange={(e) => onApproved(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Average Grade</label>

          <input
            type="number"
            min={0}
            max={20}
            step="0.01"
            className="form-control"
            value={grade}
            required
            onChange={(e) => onGrade(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}

export default StudentForm;
