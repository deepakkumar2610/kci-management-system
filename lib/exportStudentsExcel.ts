import apiHandler from "@/lib/api";
import * as XLSX from "xlsx";

interface Student {
  _id: string;
  fullName: string;
  contact?: string;
  email?: string;
  parentName?: string;
  parentContact?: string;
  medium?: string;
  classId?: {
    name?: string;
  };
}

interface StudentsResponse {
  success: boolean;
  data: Student[];
}

export const exportStudentsExcel = async (
  search: string = "",
  grade: string = "",
): Promise<boolean> => {
  try {
    // Fetch all students matching the selected filters
    const params = new URLSearchParams({
      all: "true",
      search: search.trim(),
    });

    if (grade) {
      params.set("grade", grade);
    }

    const response = await apiHandler.get<StudentsResponse>(
      `/students?${params.toString()}`,
    );

    const allStudents = response.data.data;

    if (!allStudents || allStudents.length === 0) {
      return false;
    }

    // Prepare Excel data
    const excelData = allStudents.map((student, index) => ({
      "Sr. No.": index + 1,
      "Student Name": student.fullName || "-",
      Grade: student.classId?.name || "-",
      Medium: student.medium || "-",
      "Student Contact": student.contact || "-",
      "Parent Name": student.parentName || "-",
      "Parent Contact": student.parentContact || "-",
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 25 },
      { wch: 18 },
      { wch: 15 },
      { wch: 18 },
      { wch: 25 },
      { wch: 18 },
      { wch: 30 },
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Details");

    // Download Excel file
    const date = new Date().toISOString().slice(0, 10);

    XLSX.writeFile(workbook, `KCI_Student_List_${date}.xlsx`);

    return true;
  } catch (error) {
    console.error("Excel export error:", error);
    throw error;
  }
};
