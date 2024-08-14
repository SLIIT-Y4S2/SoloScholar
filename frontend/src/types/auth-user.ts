export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "learner" | "instructor";
  createdAt: string;
  updatedAt: string;
}
