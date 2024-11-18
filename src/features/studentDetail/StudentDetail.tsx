import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { IconButton, Typography } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  fetchStudentInfo,
  getStudentDetailState,
} from "./redux/studentDetailSlice";
import { useEffect } from "react";

function StudentDetail() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const studentState = useAppSelector(getStudentDetailState);
  const { studentId } = useParams();

  const studentInfo = studentState[String(studentId)]?.studentInfo;

  useEffect(() => {
    dispatch(fetchStudentInfo(String(studentId)));
  }, [dispatch, studentId]);

  console.log(studentInfo);

  return (
    <>
      <div className="flex justify-start items-center pb-4 gap-x-2">
        <IconButton variant="text">
          <ArrowLeftIcon className="w-5 h-5" onClick={() => navigate(-1)} />
        </IconButton>
        <Typography variant="h3">Student {studentInfo?.kmitl_id}</Typography>
      </div>
    </>
  );
}

export default StudentDetail;
