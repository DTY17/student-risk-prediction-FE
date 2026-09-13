import type {
  PredictionResponse,
  Student
} from "../types/student";


interface Props {

  student: Student | null;

  prediction:
    PredictionResponse | null;

  loading: boolean;

  error: string;

  onClose: () => void;
}


function PredictionModal({
  student,
  prediction,
  loading,
  error,
  onClose,
}: Props) {

  if (!student) {
    return null;
  }


  const riskClass = (
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

    <div className="prediction-modal-overlay">

      <div className="prediction-modal">

        <div className="modal-header-custom">

          <div>

            <h4 className="mb-1">
              {student.name}
            </h4>

            <small className="text-muted">
              Academic Risk Prediction
            </small>

          </div>


          <button
            className="btn-close"
            onClick={onClose}
          />

        </div>


        <div className="modal-body-custom">

          <div className="student-information-card">

            <div className="row">

              <div className="col-4">

                <small className="text-muted d-block">
                  Age
                </small>

                <strong>
                  {student.age}
                </strong>

              </div>


              <div className="col-4">

                <small className="text-muted d-block">
                  Gender
                </small>

                <strong>
                  {student.gender}
                </strong>

              </div>


              <div className="col-4">

                <small className="text-muted d-block">
                  Admission Grade
                </small>

                <strong>
                  {
                    student
                      .admission_grade
                  }
                </strong>

              </div>

            </div>

          </div>


          {loading && (

            <div className="text-center py-5">

              <div className="spinner-border text-primary" />

              <p className="mt-3 text-muted">
                Running ML prediction...
              </p>

            </div>

          )}


          {error && (

            <div className="alert alert-danger mt-4">
              {error}
            </div>

          )}


          {!loading &&
            prediction && (

              <div className="mt-4">

                <div className="prediction-result text-center">

                  <p className="text-muted">
                    Predicted Academic Outcome
                  </p>

                  <h1 className="prediction-title">
                    {
                      prediction
                        .prediction
                    }
                  </h1>


                  <span
                    className={
                      `badge fs-6 ${
                        riskClass(
                          prediction
                            .risk_level
                        )
                      }`
                    }
                  >

                    Risk Level:{" "}
                    {
                      prediction
                        .risk_level
                    }

                  </span>

                </div>


                <hr />


                <h5>
                  Probabilities
                </h5>


                {Object.entries(
                  prediction
                    .probabilities
                ).map(
                  ([
                    name,
                    value
                  ]) => (

                    <div
                      key={name}
                      className="mb-3"
                    >

                      <div className="d-flex justify-content-between">

                        <span>
                          {name}
                        </span>

                        <strong>
                          {value}%
                        </strong>

                      </div>


                      <div className="progress">

                        <div
                          className="progress-bar"
                          style={{
                            width:
                              `${value}%`
                          }}
                        />

                      </div>

                    </div>

                  )
                )}


                <hr />


                <h5>
                  Academic Analysis
                </h5>


                <div className="row g-3 mt-1">

                  <Summary
                    title="Semester 1 Pass Rate"
                    value={
                      `${prediction
                        .student_summary
                        .semester1_pass_rate}%`
                    }
                  />

                  <Summary
                    title="Semester 2 Pass Rate"
                    value={
                      `${prediction
                        .student_summary
                        .semester2_pass_rate}%`
                    }
                  />

                  <Summary
                    title="Average Grade"
                    value={
                      prediction
                        .student_summary
                        .average_semester_grade
                    }
                  />

                  <Summary
                    title="Academic Progress"
                    value={
                      prediction
                        .student_summary
                        .academic_progress
                    }
                  />

                  <Summary
                    title="Approved Units"
                    value={
                      prediction
                        .student_summary
                        .total_approved_units
                    }
                  />

                  <Summary
                    title="Financial Risk"
                    value={
                      prediction
                        .student_summary
                        .financial_risk_score
                    }
                  />

                </div>

              </div>

            )}

        </div>


        <div className="modal-footer-custom">

          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}


function Summary({
  title,
  value
}: {
  title: string;
  value: string | number;
}) {

  return (

    <div className="col-md-6">

      <div className="summary-box">

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


export default PredictionModal;