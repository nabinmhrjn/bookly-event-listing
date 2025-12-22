import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = "uploads/eventImage";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    // Check file type (allow only jpg, png, and pdf)
    const allowedFileTypes = ["image/jpeg", "image/png"];

    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // Pass the error using MulterError constructor
        cb(
            new multer.MulterError(
                "LIMIT_FILE_TYPE",
                "Invalid file type. Only JPG, PNG, and PDF files are allowed."
            ),
            false
        );
    }
};

const limits = { fileSize: 4 * 1024 * 1024 };

const upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter,
});

export const eventImageUpload = (req, res, next) => {
    upload.single("eventImage")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            let errorMessage = "Error processing file upload";

            if (err.code === "LIMIT_FILE_SIZE") {
                errorMessage = "File size exceeds the allowed limit of 2MB";
            } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
                errorMessage = "Too many files uploaded or invalid field name";
            } else if (err.code === "LIMIT_FILE_TYPE") {
                errorMessage =
                    "Invalid file type. Only JPG, PNG, and PDF files are allowed";
            }

            return res.status(400).json({
                msg: "error",
                multerError: {
                    code: err.code,
                    message: errorMessage,
                },
            });
        } else if (err) {
            // Handle other non-Multer errors
            console.error("Other error during file upload:", err);
            return res.status(500).json({
                msg: "error",
                error: "Internal Server Error",
            });
        }

        // If no Multer error, proceed to the next middleware (e.g., the controller)
        next();
    });
}