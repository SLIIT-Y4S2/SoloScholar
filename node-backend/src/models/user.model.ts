// import mongoose from "mongoose";
// import bcrypt from "bcrypt";

// export interface UserInput {
//   studentId: string;
//   name: string;
//   password: string;
//   role: "student" | "lecturer";
// }

// export interface UserDocument extends UserInput, mongoose.Document {
//   createdAt: Date;
//   updatedAt: Date;
//   comparePassword(candidatePassword: string): Promise<Boolean>;
// }

// const userSchema = new mongoose.Schema(
//   {
//     studentId: { type: String, required: true, unique: true },
//     name: { type: String, required: true },
//     password: { type: String, required: true },
//     role: {
//       type: String,
//       enum: ["student", "lecturer"],
//       default: "student",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// userSchema.pre("save", async function (next) {
//   let user = this as UserDocument;

//   if (!user.isModified("password")) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(10);

//   const hash = bcrypt.hashSync(user.password, salt);

//   user.password = hash;

//   return next();
// });

// userSchema.methods.comparePassword = async function (
//   candidatePassword: string
// ): Promise<boolean> {
//   const user = this as UserDocument;

//   return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
// };

// const UserModel = mongoose.model<UserDocument>("User", userSchema);

// export default UserModel;
