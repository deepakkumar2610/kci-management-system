import mongoose, { Schema } from "mongoose";

const admissionSchema = new Schema(
  {
    data: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Admission ||
  mongoose.model("Admission", admissionSchema);
