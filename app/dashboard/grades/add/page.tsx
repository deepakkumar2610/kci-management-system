import ClassForm from "@/app/components/ClassForm";
import BatchForm from "@/app/components/BatchForm";
import SubjectForm from "@/app/components/SubjectForm";
import FeeForm from "@/app/components/FeeForm";

export default function Page() {
  return (
    <>
      <ClassForm />
      <hr className="my-5" />
      <BatchForm />
      <hr className="my-5" />
      <SubjectForm />
      <hr className="my-5" />
      <FeeForm />
    </>
  );
}
