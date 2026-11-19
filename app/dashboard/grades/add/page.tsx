"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[#0b2c5f]">
          Manage Class Details
        </h2>
        <p className="text-sm text-gray-500">
          Manage classes, batches, subjects and fees.
        </p>
      </div>

      <Tabs defaultValue="class" className="w-full">
        <TabsList className="kci-tabs-list">
          <TabsTrigger value="class">Class Details</TabsTrigger>

          <TabsTrigger value="batch">Batch Details</TabsTrigger>

          <TabsTrigger value="subject">Subject Details</TabsTrigger>

          <TabsTrigger value="fee">Fee Details</TabsTrigger>
        </TabsList>

        <TabsContent value="class" className="mt-5">
          <ClassForm onSuccessRefresh={onSuccessRefresh} />
        </TabsContent>

        <TabsContent value="batch">
          <BatchForm refreshKey={refreshKey} />
        </TabsContent>

        <TabsContent value="subject">
          <SubjectForm refreshKey={refreshKey} />
        </TabsContent>

        <TabsContent value="fee">
          <FeeForm refreshKey={refreshKey} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
