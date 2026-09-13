import { type ChangeEvent, type FormEvent, useState } from "react";

type Gender = "Male" | "Female";

interface StudentFormData {
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

interface ApiError {
  detail?: string;
}

function PredictionForm() {
  const [formData, setFormData] = useState<StudentFormData>({
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
  });

  const [result, setResult] =
    useState<PredictionResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleBooleanChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value === "true",
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      if (
        Number(formData.semester1_approved_units) >
        Number(formData.semester1_enrolled_units)
      ) {
        throw new Error(
          "Semester 1 approved units cannot be greater than enrolled units."
        );
      }

      if (
        Number(formData.semester2_approved_units) >
        Number(formData.semester2_enrolled_units)
      ) {
        throw new Error(
          "Semester 2 approved units cannot be greater than enrolled units."
        );
      }

      const requestData = {
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

        semester1_enrolled_units: Number(
          formData.semester1_enrolled_units
        ),

        semester1_approved_units: Number(
          formData.semester1_approved_units
        ),

        semester1_grade: Number(
          formData.semester1_grade
        ),

        semester2_enrolled_units: Number(
          formData.semester2_enrolled_units
        ),

        semester2_approved_units: Number(
          formData.semester2_approved_units
        ),

        semester2_grade: Number(
          formData.semester2_grade
        ),
      };

      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(requestData),
        }
      );

      const data:
        | PredictionResponse
        | ApiError = await response.json();

      if (!response.ok) {
        const apiError = data as ApiError;

        throw new Error(
          apiError.detail || "Prediction failed."
        );
      }

      setResult(data as PredictionResponse);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (
    riskLevel: PredictionResponse["risk_level"]
  ) => {
    if (riskLevel === "HIGH") {
      return "bg-danger";
    }

    if (riskLevel === "MEDIUM") {
      return "bg-warning text-dark";
    }

    return "bg-success";
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <div className="card border-0 shadow-lg">
          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              <h4 className="section-title">
                Student Information
              </h4>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">
                    Age
                  </label>

                  <input
                    type="number"
                    name="age"
                    className="form-control"
                    value={formData.age}
                    onChange={handleChange}
                    min={15}
                    max={100}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Gender
                  </label>

                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Admission Grade
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="admission_grade"
                    className="form-control"
                    value={formData.admission_grade}
                    onChange={handleChange}
                    min={0}
                    max={200}
                    required
                  />
                </div>
              </div>

              <h4 className="section-title mt-5">
                Financial Information
              </h4>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">
                    Scholarship Holder
                  </label>

                  <select
                    name="scholarship_holder"
                    className="form-select"
                    value={
                      formData.scholarship_holder
                        ? "true"
                        : "false"
                    }
                    onChange={handleBooleanChange}
                  >
                    <option value="true">
                      Yes
                    </option>

                    <option value="false">
                      No
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
                    onChange={handleBooleanChange}
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
                      formData.tuition_fees_up_to_date
                        ? "true"
                        : "false"
                    }
                    onChange={handleBooleanChange}
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

              <h4 className="section-title mt-5">
                Semester 1
              </h4>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">
                    Enrolled Units
                  </label>

                  <input
                    type="number"
                    name="semester1_enrolled_units"
                    className="form-control"
                    value={
                      formData.semester1_enrolled_units
                    }
                    onChange={handleChange}
                    min={0}
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
                    value={
                      formData.semester1_approved_units
                    }
                    onChange={handleChange}
                    min={0}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Average Grade
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="semester1_grade"
                    className="form-control"
                    value={formData.semester1_grade}
                    onChange={handleChange}
                    min={0}
                    max={20}
                    required
                  />
                </div>
              </div>

              <h4 className="section-title mt-5">
                Semester 2
              </h4>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">
                    Enrolled Units
                  </label>

                  <input
                    type="number"
                    name="semester2_enrolled_units"
                    className="form-control"
                    value={
                      formData.semester2_enrolled_units
                    }
                    onChange={handleChange}
                    min={0}
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
                    value={
                      formData.semester2_approved_units
                    }
                    onChange={handleChange}
                    min={0}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Average Grade
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="semester2_grade"
                    className="form-control"
                    value={formData.semester2_grade}
                    onChange={handleChange}
                    min={0}
                    max={20}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-danger mt-4">
                  {error}
                </div>
              )}

              <div className="d-grid mt-5">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading
                    ? "Predicting..."
                    : "Predict Student Risk"}
                </button>
              </div>
            </form>

            {result && (
              <div className="result-card mt-5">
                <h3 className="text-center mb-4">
                  Prediction Result
                </h3>

                <div className="text-center">
                  <p className="mb-1 text-muted">
                    Predicted Academic Outcome
                  </p>

                  <h2 className="fw-bold">
                    {result.prediction}
                  </h2>

                  <span
                    className={`badge fs-6 ${getRiskClass(
                      result.risk_level
                    )}`}
                  >
                    Risk Level: {result.risk_level}
                  </span>
                </div>

                <hr className="my-4" />

                <h5>
                  Prediction Probabilities
                </h5>

                {Object.entries(
                  result.probabilities
                ).map(
                  ([className, probability]) => (
                    <div
                      className="mb-3"
                      key={className}
                    >
                      <div className="d-flex justify-content-between">
                        <span>
                          {className}
                        </span>

                        <strong>
                          {probability}%
                        </strong>
                      </div>

                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${probability}%`,
                          }}
                          aria-valuenow={probability}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  )
                )}

                {result.student_summary && (
                  <>
                    <hr className="my-4" />

                    <h5>
                      Student Summary
                    </h5>

                    <div className="row mt-3">
                      <div className="col-md-6 mb-2">
                        Semester 1 Pass Rate:{" "}
                        <strong>
                          {
                            result.student_summary
                              .semester1_pass_rate
                          }
                          %
                        </strong>
                      </div>

                      <div className="col-md-6 mb-2">
                        Semester 2 Pass Rate:{" "}
                        <strong>
                          {
                            result.student_summary
                              .semester2_pass_rate
                          }
                          %
                        </strong>
                      </div>

                      <div className="col-md-6 mb-2">
                        Average Grade:{" "}
                        <strong>
                          {
                            result.student_summary
                              .average_semester_grade
                          }
                        </strong>
                      </div>

                      <div className="col-md-6 mb-2">
                        Academic Progress:{" "}
                        <strong>
                          {
                            result.student_summary
                              .academic_progress
                          }
                        </strong>
                      </div>

                      <div className="col-md-6 mb-2">
                        Total Approved Units:{" "}
                        <strong>
                          {
                            result.student_summary
                              .total_approved_units
                          }
                        </strong>
                      </div>

                      <div className="col-md-6 mb-2">
                        Financial Risk Score:{" "}
                        <strong>
                          {
                            result.student_summary
                              .financial_risk_score
                          }
                        </strong>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictionForm;