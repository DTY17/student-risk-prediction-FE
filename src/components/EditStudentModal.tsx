import { type FormEvent, useEffect, useState } from "react";

import type { Gender, Student, StudentCreate } from "../types/student";

interface Props {
  student: Student | null;

  onClose: () => void;

  onSave: (id: number, data: StudentCreate) => Promise<void>;
}

function EditStudentModal({ student, onClose, onSave }: Props) {
  const [form, setForm] = useState<StudentCreate | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (student) {
      const { id: _id, ...data } = student;

      setForm(data);
    }
  }, [student]);

  if (!student || !form) {
    return null;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    if (form.semester1_approved_units > form.semester1_enrolled_units) {
      setError("Semester 1 approved units cannot exceed enrolled units.");

      return;
    }

    if (form.semester2_approved_units > form.semester2_enrolled_units) {
      setError("Semester 2 approved units cannot exceed enrolled units.");

      return;
    }

    try {
      setLoading(true);

      await onSave(student.id, form);

      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-modal-overlay">
      <div className="prediction-modal">
        <div className="modal-header-custom">
          <h4>Edit Student</h4>

          <button className="btn-close" onClick={onClose} />
        </div>

        <form onSubmit={submit}>
          <div className="modal-body-custom">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>

                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Age</label>

                <input
                  type="number"
                  className="form-control"
                  value={form.age}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      age: Number(e.target.value),
                    })
                  }
                  required
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

              <div className="col-md-6">
                <label className="form-label">Admission Grade</label>

                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={form.admission_grade}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      admission_grade: Number(e.target.value),
                    })
                  }
                />
              </div>

              <BooleanSelect
                title="Scholarship Holder"
                value={form.scholarship_holder}
                onChange={(value) =>
                  setForm({
                    ...form,
                    scholarship_holder: value,
                  })
                }
              />

              <BooleanSelect
                title="Debtor"
                value={form.debtor}
                onChange={(value) =>
                  setForm({
                    ...form,
                    debtor: value,
                  })
                }
              />

              <BooleanSelect
                title="Tuition Fees Up To Date"
                value={form.tuition_fees_up_to_date}
                onChange={(value) =>
                  setForm({
                    ...form,
                    tuition_fees_up_to_date: value,
                  })
                }
              />

              <NumberField
                title="Semester 1 Enrolled"
                value={form.semester1_enrolled_units}
                onChange={(value) =>
                  setForm({
                    ...form,
                    semester1_enrolled_units: value,
                  })
                }
              />

              <NumberField
                title="Semester 1 Approved"
                value={form.semester1_approved_units}
                onChange={(value) =>
                  setForm({
                    ...form,
                    semester1_approved_units: value,
                  })
                }
              />

              <NumberField
                title="Semester 1 Grade"
                value={form.semester1_grade}
                step="0.01"
                onChange={(value) =>
                  setForm({
                    ...form,
                    semester1_grade: value,
                  })
                }
              />

              <NumberField
                title="Semester 2 Enrolled"
                value={form.semester2_enrolled_units}
                onChange={(value) =>
                  setForm({
                    ...form,
                    semester2_enrolled_units: value,
                  })
                }
              />

              <NumberField
                title="Semester 2 Approved"
                value={form.semester2_approved_units}
                onChange={(value) =>
                  setForm({
                    ...form,
                    semester2_approved_units: value,
                  })
                }
              />

              <NumberField
                title="Semester 2 Grade"
                value={form.semester2_grade}
                step="0.01"
                onChange={(value) =>
                  setForm({
                    ...form,
                    semester2_grade: value,
                  })
                }
              />
            </div>

            {error && <div className="alert alert-danger mt-4">{error}</div>}
          </div>

          <div className="modal-footer-custom">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={onClose}
            >
              Cancel
            </button>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BooleanSelect({
  title,
  value,
  onChange,
}: {
  title: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="col-md-4">
      <label className="form-label">{title}</label>

      <select
        className="form-select"
        value={String(value)}
        onChange={(e) => onChange(e.target.value === "true")}
      >
        <option value="true">Yes</option>

        <option value="false">No</option>
      </select>
    </div>
  );
}

function NumberField({
  title,
  value,
  step = "1",
  onChange,
}: {
  title: string;
  value: number;
  step?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="col-md-4">
      <label className="form-label">{title}</label>

      <input
        type="number"
        min={0}
        step={step}
        className="form-control"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default EditStudentModal;
