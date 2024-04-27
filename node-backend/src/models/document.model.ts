import { model, Schema } from "mongoose";

interface PDFDocument {
    name: string;
    size: number;
    url: string;
    mimeType: string;
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new Schema<PDFDocument>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        size: {
            type: Number,
            required: true,
        },
        url: {
            type: String,
            required: true,
            unique: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const PDFDocumentModel = model<PDFDocument>("Document", documentSchema);

export default PDFDocumentModel;