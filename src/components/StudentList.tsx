import type {
  Student
} from "../types/student";


interface Props {

  students: Student[];

  onPredict:
    (student: Student) => void;

  onEdit:
    (student: Student) => void;

  onDelete:
    (student: Student) => void;
}


function StudentList({
  students,
  onPredict,
  onEdit,
  onDelete,
}: Props) {

  return (

    <div className="card border-0 shadow-sm">

      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h4 className="mb-1">
              Student Data List
            </h4>

            <small className="text-muted">
              Click a student row to generate prediction
            </small>

          </div>


          <span className="badge bg-primary fs-6">

            {students.length} Students

          </span>

        </div>


        {students.length === 0
          ? (

            <div className="empty-state">

              <h5>
                No Students Found
              </h5>

              <p className="text-muted mb-0">
                Add your first student above.
              </p>

            </div>

          )
          : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead className="table-light">

                  <tr>

                    <th>ID</th>

                    <th>Name</th>

                    <th>Age</th>

                    <th>Gender</th>

                    <th>Admission</th>

                    <th>Semester 1</th>

                    <th>Semester 2</th>

                    <th>Actions</th>

                  </tr>

                </thead>


                <tbody>

                  {students.map(
                    (student) => (

                      <tr
                        key={student.id}
                        className="student-row"
                        onClick={() =>
                          onPredict(
                            student
                          )
                        }
                      >

                        <td>
                          {student.id}
                        </td>

                        <td className="fw-semibold">
                          {student.name}
                        </td>

                        <td>
                          {student.age}
                        </td>

                        <td>
                          {student.gender}
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

                          <div className="d-flex gap-2">

                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={(e) => {

                                e.stopPropagation();

                                onEdit(
                                  student
                                );
                              }}
                            >
                              Edit
                            </button>


                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={(e) => {

                                e.stopPropagation();

                                onDelete(
                                  student
                                );
                              }}
                            >
                              Delete
                            </button>

                          </div>

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
  );
}


export default StudentList;