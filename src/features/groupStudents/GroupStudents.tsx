import { useEffect, useRef, useState } from "react";
import StudentTable from "./components/StudentTable";
import { Button, Typography } from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  fetchGroupStudents,
  getGroupStudents,
  getGroupStudentsError,
} from "./redux/GroupStudentsSlice";
import StudentPermissionForm from "./components/StudentPermissionForm";
import AddStudentForm from "./components/AddStudentForm";
import { Bounce, toast } from "react-toastify";

export interface StudentData {
  name: string;
  kmitlId: string;
  studentId: string;
}

interface Props {
  groupId: string;
}

function GroupStudents({ groupId }: Props) {
  const initialized = useRef(false);
  const dispatch = useAppDispatch();
  const groupStudent = useAppSelector(getGroupStudents);
  const groupStudentError = useAppSelector(getGroupStudentsError);
  const [page, setPage] = useState<number>(1);
  const [openPermForm, setOpenPermForm] = useState<boolean>(false);
  const [openStudentFrom, setOpenStudentForm] = useState<boolean>(false);
  const [studentSelected, setStudentSelected] = useState<StudentData | null>(
    null,
  );

  const handlePermFormClose = () => setOpenPermForm(false);
  const handlePermFormOpen = () => setOpenPermForm(true);
  const handleSetStudent = (student: StudentData) =>
    setStudentSelected(student);
  const handleStudentFormClose = () => setOpenStudentForm(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(fetchGroupStudents({ groupId: groupId, page: page }));
    }
  }, [dispatch, initialized]);

  useEffect(() => {
    if (groupStudentError) {
      toast.error(groupStudentError.error, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }, [dispatch, groupStudentError]);

  const handleChangePage = (direction: "next" | "prev") => {
    setPage((prevPage) => {
      if (direction === "next") {
        return prevPage === groupStudent.pagination.pages ? 1 : prevPage + 1;
      } else if (direction === "prev") {
        return prevPage === 1 ? groupStudent.pagination.pages : prevPage - 1;
      }
      return prevPage;
    });
  };

  useEffect(() => {
    dispatch(fetchGroupStudents({ groupId: groupId, page: page }));
  }, [dispatch, groupId, page]);

  return (
    <>
      <StudentPermissionForm
        page={page}
        open={openPermForm}
        groupId={groupId}
        studentSelected={studentSelected}
        handleClose={handlePermFormClose}
      />
      <AddStudentForm
        open={openStudentFrom}
        handleClose={handleStudentFormClose}
        groupId={groupId}
      />
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
        <Button size="md" onClick={() => setOpenStudentForm(true)}>
          Add Student
        </Button>
      </div>
      <StudentTable
        page={page}
        pages={groupStudent.pagination.pages}
        labInfo={groupStudent.lab_info}
        students={groupStudent.student_list}
        handlePermFormOpen={handlePermFormOpen}
        handleSetStudent={handleSetStudent}
        handleChangePage={handleChangePage}
      />
    </>
  );
}

export default GroupStudents;
