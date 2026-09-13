export type Gender =
  | "Male"
  | "Female";


export interface Student {
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


export type StudentCreate =
  Omit<Student, "id">;


export interface StudentSummary {

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


export interface PredictionResponse {

  student?: {
    id: number;
    name: string;
  };

  success: boolean;

  prediction: string;

  risk_level:
    | "HIGH"
    | "MEDIUM"
    | "LOW";

  probabilities: Record<
    string,
    number
  >;

  student_summary:
    StudentSummary;
}