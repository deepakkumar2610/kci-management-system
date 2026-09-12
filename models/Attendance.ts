import mongoose, { Schema, Document, Model } from "mongoose";

export type AttendanceStatus = "Present" | "Absent" | "Leave";

export interface IAttendanceRecord {
  studentId: mongoose.Types.ObjectId;
  status: AttendanceStatus;
}

export interface IAttendance extends Document {
  date: Date;
  classId: mongoose.Types.ObjectId;
  batchId: mongoose.Types.ObjectId;
  records: IAttendanceRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Leave"],
      required: true,
    },
  },
  { _id: false },
);

const AttendanceSchema = new Schema<IAttendance>(
  {
    date: {
      type: Date,
      required: true,
    },

    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    batchId: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },

    records: {
      type: [AttendanceRecordSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate attendance for same class + batch + date
AttendanceSchema.index(
  {
    date: 1,
    classId: 1,
    batchId: 1,
  },
  {
    unique: true,
  },
);

const Attendance: Model<IAttendance> =
  mongoose.models.Attendance ||
  mongoose.model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;
