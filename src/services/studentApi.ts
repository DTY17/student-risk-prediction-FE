import type {
  PredictionResponse,
  Student,
  StudentCreate,
} from "../types/student";


const API_URL =
  "http://127.0.0.1:8000";


async function getErrorMessage(
  response: Response
) {
  try {

    const data =
      await response.json();

    return (
      data.detail ||
      data.message ||
      "Request failed."
    );

  } catch {

    return "Request failed.";
  }
}


export async function getStudents():
Promise<Student[]> {

  const response = await fetch(
    `${API_URL}/students`
  );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response
      )
    );
  }


  const data =
    await response.json();


  return data.students;
}


export async function createStudent(
  student: StudentCreate
): Promise<Student> {

  const response = await fetch(
    `${API_URL}/students`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify(
          student
        ),
    }
  );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response
      )
    );
  }


  const data =
    await response.json();


  return data.student;
}


export async function updateStudent(
  id: number,
  student: StudentCreate
): Promise<Student> {

  const response = await fetch(
    `${API_URL}/students/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify(
          student
        ),
    }
  );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response
      )
    );
  }


  const data =
    await response.json();


  return data.student;
}


export async function deleteStudent(
  id: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/students/${id}`,
    {
      method: "DELETE",
    }
  );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response
      )
    );
  }
}


export async function predictStudent(
  id: number
): Promise<PredictionResponse> {

  const response = await fetch(
    `${API_URL}/students/${id}/predict`,
    {
      method: "POST",
    }
  );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response
      )
    );
  }


  return response.json();
}