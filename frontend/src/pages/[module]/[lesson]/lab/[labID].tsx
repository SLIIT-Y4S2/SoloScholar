import { useLocation } from "react-router-dom";
import QuestionCardForLab from "../../../../Components/lab/QuestionCardForLab";

export default function LabSession() {
  const location = useLocation();

  return (
    <div className="flex items-center justify-center py-6" key={location.key}>
      <div className="flex flex-col gap-6 w-max">
        <QuestionCardForLab />
      </div >
    </div>
  );
}
