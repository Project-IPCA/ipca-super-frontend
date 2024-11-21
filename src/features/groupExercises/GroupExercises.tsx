import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { useEffect, useMemo, useRef, useState } from "react";
import GroupSummary from "./components/GroupSummary";
import {
  clearGroupExercisesError,
  fetchGroupExercises,
  getGroupExercise,
  getGroupExerciseError,
} from "./redux/groupExercisesSlice";
import ExerciseTable from "./components/ExerciseTable";
import PermissionForm from "../permissionForm/PermissionForm";
import { Bounce, toast } from "react-toastify";
interface Props {
  groupId: string;
}

export interface ChapterData {
  chapterId: string;
  chapterIndex: number;
  chapterName: string;
}

function GroupExercises({ groupId }: Props) {
  const initialized = useRef(false);
  const dispatch = useAppDispatch();
  const groupDetail = useAppSelector(getGroupExercise);
  const error = useAppSelector(getGroupExerciseError);
  const [openAccessForm, setOpenAccessForm] = useState<boolean>(false);
  const [chapterSelected, setChapterSelected] = useState<ChapterData | null>(
    null,
  );

  const handleAccessFormClose = () => setOpenAccessForm(false);
  const handleAccessFormOpen = () => setOpenAccessForm(true);

  const handleSetChapter = (chapterSelected: ChapterData) =>
    setChapterSelected(chapterSelected);

  useEffect(() => {
    if (!initialized.current && groupId) {
      initialized.current = true;
      dispatch(fetchGroupExercises(groupId));
    }
    return () => {};
  }, [dispatch, groupId, initialized]);

  const sortedChapterList = useMemo(
    () =>
      [...(groupDetail?.group_chapter_permissions || [])].sort(
        (a, b) => a.chapter_index - b.chapter_index,
      ),
    [groupDetail],
  );

  useEffect(() => {
    if (error) {
      toast.error(error.error, {
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
      dispatch(clearGroupExercisesError());
    }
  });

  return (
    <div>
      <PermissionForm
        open={openAccessForm}
        handleClose={handleAccessFormClose}
        chapterSelected={chapterSelected}
      />
      <GroupSummary groupData={groupDetail} />
      <ExerciseTable
        chapterList={sortedChapterList}
        handleAccessFormOpen={handleAccessFormOpen}
        handleSetChapter={handleSetChapter}
      />
    </div>
  );
}

export default GroupExercises;
