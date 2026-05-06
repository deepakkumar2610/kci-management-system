export interface AdmissionFormValues {
  fullName: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  aadhar: string;
  contact: string;
  email: string;

  parentName: string;
  relation: string;
  occupation: string;
  parentContact: string;
  parentEmail: string;
  address: string;
  motherName: string;

  lastSchool: string;
  previousBoard: string;
  previousClass: string;
  percentage: string;
  previousMedium: string;

  currentClass: string;
  currentMedium: string;
  batch: string;
  subjects: string;

  declaration: boolean;
  photo: File | null;
}
