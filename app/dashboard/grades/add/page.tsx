"use client";
import { useState } from "react";
import ClassForm from "@/app/components/ClassForm";
import BatchForm from "@/app/components/BatchForm";
import SubjectForm from "@/app/components/SubjectForm";
import FeeForm from "@/app/components/FeeForm";

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0);

  const onSuccessRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (  
    <>
      <ClassForm onSuccessRefresh={onSuccessRefresh} />
      <hr className="my-5" />
      <BatchForm refreshKey={refreshKey} />
      <hr className="my-5" />
      <SubjectForm refreshKey={refreshKey} />
      <hr className="my-5" />
      <FeeForm refreshKey={refreshKey} />
    </>
  );
}
