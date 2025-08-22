import mongoose, { mongo } from "mongoose";


const entrySchema = new mongoose.Schema({
  email: { type: String, required: true  },
  name: { type: String, required: true },
});

const resumeSchema = new mongoose.Schema({
  entryId: { type: mongoose.Schema.Types.ObjectId, ref: "Entry", required: true },
    s3url : { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    keywords: { type: [String], default: [] },
});




export const ResumeModel = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);
export const EntryModel = mongoose.models.Entry || mongoose.model("Entry", entrySchema);