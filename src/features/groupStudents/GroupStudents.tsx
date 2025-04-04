import { useEffect, useRef, useState } from "react";
import StudentTable from "./components/StudentTable";
import { Button, Typography } from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  fetchGroupStudents,
  getGroupStudents,
  getGroupStudentsError,
  setOnlineStudents,
  getOnlineStudents,
  VITE_IPCA_RT,
  getGroupStudentsStatus,
} from "./redux/GroupStudentsSlice";
import AddStudentForm from "./components/AddStudentForm";
import { StudentPermissionForm } from "../studentPermissionForm";
import { showToast } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import RoleProtection from "../../components/roleProtection/RoleProtection";
import { GROUP_ADMIN } from "../../constants/constants";

export interface StudentData {
  name: string;
  kmitlId: string;
  studentId: string;
}

interface Props {
  groupId: string;
}

function GroupStudents({ groupId }: Props) {
  const { t } = useTranslation();
  const initialized = useRef(false);
  const dispatch = useAppDispatch();
  const groupStudent = useAppSelector(getGroupStudents);
  const groupStudentError = useAppSelector(getGroupStudentsError);
  const onlineStudent = useAppSelector(getOnlineStudents);
  const [page, setPage] = useState<number>(1);
  const [openPermForm, setOpenPermForm] = useState<boolean>(false);
  const [openStudentFrom, setOpenStudentForm] = useState<boolean>(false);
  const [studentSelected, setStudentSelected] = useState<StudentData | null>(
    null,
  );
  const isFetching = useAppSelector(getGroupStudentsStatus);

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
      const addStudents = groupStudentError.error?.split("\n");
      if (addStudents?.length) {
        addStudents.forEach((err) => {
          showToast({
            variant: "error",
            message: err,
          });
        });
      } else {
        showToast({
          variant: "error",
          message: groupStudentError.error,
        });
      }
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

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const evtSource = new EventSource(
      `${VITE_IPCA_RT}/online-students/${groupId}?token=${token}`,
    );
    evtSource.onmessage = (event) => {
      if (event.data) {
        const rawData = JSON.parse(event.data);
        dispatch(setOnlineStudents(rawData));
      }
    };
    return () => {
      evtSource.close();
    };
  }, []);

  return (
    <>
      <StudentPermissionForm
        open={openPermForm}
        handleClose={handlePermFormClose}
        studentId={studentSelected?.studentId || ""}
        kmitlId={studentSelected?.kmitlId || ""}
        name={studentSelected?.name || ""}
        page={page}
        groupId={groupId}
      />
      <RoleProtection acceptedPermission={[GROUP_ADMIN]}>
        <AddStudentForm
          open={openStudentFrom}
          handleClose={handleStudentFormClose}
          groupId={groupId}
        />
      </RoleProtection>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center pb-4">
        {isFetching ? (
          <Typography
            as="div"
            className="h-3 w-60 rounded-full bg-gray-300 mb-4"
          >
            &nbsp;
          </Typography>
        ) : (
          <>
            <div className="flex gap-x-5">
              <div className="flex items-center gap-x-1">
                <span className="mx-auto mb-1 block h-3 w-3 rounded-full bg-green-900 content-['']" />
                <Typography variant="h6" color="blue-gray">
                  {`${t("feature.group_students.online")}: ${onlineStudent.length}`}
                </Typography>
              </div>
              <div className="flex items-center gap-x-1">
                <span className="mx-auto mb-1 block h-3 w-3 rounded-full bg-red-900 content-['']" />
                <Typography variant="h6" color="blue-gray">
                  {`${t("feature.group_students.offline")}: ${groupStudent.total_student - onlineStudent.length}`}
                </Typography>
              </div>
              <Typography variant="h6" color="blue-gray">
                {`${t("feature.group_students.total")}: ${groupStudent.total_student}`}
              </Typography>
            </div>
            <RoleProtection acceptedPermission={[GROUP_ADMIN]}>
              <Button
                className="w-full sm:w-fit"
                size="md"
                onClick={() => setOpenStudentForm(true)}
              >
                {t("feature.group_students.button.add")}
              </Button>
            </RoleProtection>
          </>
        )}
      </div>
      <StudentTable
        page={page}
        pages={groupStudent.pagination.pages}
        labInfo={groupStudent.lab_info}
        students={groupStudent.student_list}
        onlineStudent={onlineStudent}
        handlePermFormOpen={handlePermFormOpen}
        handleSetStudent={handleSetStudent}
        handleChangePage={handleChangePage}
      />
    </>
  );
}

export default GroupStudents;
