import { useEffect, useRef, useState } from "react";
import StudentTable from "./components/StudentTable";
import { Button, Typography } from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  fetchGroupStudents,
  getGroupStudents,
} from "./redux/GroupStudentsSlice";

interface Props {
  groupId: string;
}

function GroupStudents({ groupId }: Props) {
  const initialized = useRef(false);
  const dispatch = useAppDispatch();
  const groupStudent = useAppSelector(getGroupStudents);
  const [page, setPage] = useState<number>(1);
  const pages = 10;

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(fetchGroupStudents(groupId));
    }
  }, [dispatch, initialized]);

  console.log(groupStudent.student_list);

  return (
    <>
      <div className="flex justify-between items-center pb-4">
        <div className="flex gap-x-5">
          <div className="flex items-center gap-x-1">
            <span className="mx-auto mb-1 block h-3 w-3 rounded-full bg-green-900 content-['']" />
            <Typography variant="h6" color="blue-gray">
              {`Online: ${groupStudent.student_list.reduce((total, student) => total + Number(student.status), 0)}`}
            </Typography>
          </div>
          <div className="flex items-center gap-x-1">
            <span className="mx-auto mb-1 block h-3 w-3 rounded-full bg-red-900 content-['']" />
            <Typography variant="h6" color="blue-gray">
              {`Ofline: ${groupStudent.student_list.reduce((total, student) => total + Number(!student.status), 0)}`}
            </Typography>
          </div>
          <Typography variant="h6" color="blue-gray">
            {`Total: ${groupStudent.student_list.length}`}
          </Typography>
        </div>
        <Button size="md">Add Student</Button>
      </div>
      <StudentTable
        page={page}
        pages={pages}
        labInfo={groupStudent.lab_info}
        students={groupStudent.student_list}
      />
    </>
  );
}

export default GroupStudents;
