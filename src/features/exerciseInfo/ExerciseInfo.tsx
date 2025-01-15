import {
  Alert,
  Button,
  Card,
  CardBody,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  fetchExercisesPool,
  getExercisesPoolState,
} from "../exercisesPool/redux/ExercisesPoolSlice";
import { useEffect, useState } from "react";
import {
  fetchExercisesInfo,
  getExercisesInfoState,
} from "./redux/exerciseInfoSlice";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import KeywordConstraints from "../exerciseForm/components/KeywordConstraints";
import TextEditor from "../exerciseForm/components/TextEditor";
import { ExerciseForm } from "../exerciseForm";
import { FormUseData } from "../exercisesPool/ExercisesPool";
import TestcaseForm from "./components/TestcaseForm";
import TestcaseInfo from "./components/TestcaseInfo";
import { IKeywordConstraints } from "../exerciseForm/ExerciseForm";
import { deleteExercise } from "../exerciseForm/redux/exerciseFormSlice";
import { showToast } from "../../utils/toast";
import { ConfirmModal } from "../../components";

function ExerciseInfo() {
  const { groupId, chapterIdx, exerciseId, level } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const exercisesPoolState = useAppSelector(getExercisesPoolState);
  const exerciseInfoState = useAppSelector(getExercisesInfoState);
  const key = `${groupId}.${chapterIdx}`;
  const exercisesPool = exercisesPoolState[key]?.chapterDetail;
  const exerciseInfoKey = `${exerciseId}`;
  const exercise = exerciseInfoState[exerciseInfoKey]?.exerciseInfo;
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [testcaseFormOpen, setTestcaseFormOpen] = useState<boolean>(false);
  const [formUseData, setFormUseData] = useState<FormUseData>({
    chapterId: "",
    level: "",
  });
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const handleToggleForm = () => setFormOpen(!formOpen);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const handleToggleTestcaseForm = () => setTestcaseFormOpen(!testcaseFormOpen);

  const [constraints, setConstraints] = useState<IKeywordConstraints>({
    suggested_constraints: {
      classes: [],
      functions: [],
      reserved_words: [],
      methods: [],
      variables: [],
      imports: [],
    },
    user_defined_constraints: {
      classes: [],
      functions: [],
      reserved_words: [],
      methods: [],
      variables: [],
      imports: [],
    },
  });

  const handleDelete = async () => {
    if (exerciseId && groupId && chapterIdx) {
      const resultAction = await dispatch(deleteExercise(exerciseId));
      if (deleteExercise.fulfilled.match(resultAction)) {
        showToast({
          variant: "success",
          message: "Exercise has been delete.",
        });
      }
      dispatch(
        fetchExercisesPool({
          groupId: groupId,
          chapterIdx: parseInt(chapterIdx),
        })
      );
      navigate(-1);
    }
  };

  useEffect(() => {
    if (exercise) {
      setConstraints(() => {
        return {
          suggested_constraints: exercise?.suggested_constraints,
          user_defined_constraints: exercise?.user_defined_constraints,
        };
      });
    }
  }, [exercise]);

  useEffect(() => {
    if (!exercisesPool && groupId && chapterIdx) {
      dispatch(
        fetchExercisesPool({
          groupId: groupId,
          chapterIdx: parseInt(chapterIdx),
        })
      );
    }
  }, [dispatch, exercisesPool, groupId, chapterIdx]);

  useEffect(() => {
    if (!exercise && exerciseId) {
      dispatch(fetchExercisesInfo(exerciseId));
    }
  }, [dispatch, exercise, exerciseId]);

  return (
    <>
      <ConfirmModal
        open={openDelete}
        title="Delete Exercise?"
        description={
          <>
            Are you sure you want to delete exercise <b>{exercise?.name}</b>?
            This process cannot be undone.
          </>
        }
        confirmLabel="Delete"
        type="error"
        handleClose={handleCloseDelete}
        handleSubmit={handleDelete}
      />
      <TestcaseForm
        exerciseId={exerciseId ?? ""}
        open={testcaseFormOpen}
        handleToggle={handleToggleTestcaseForm}
        testcaseList={exercise?.testcase_list || []}
      />
      <ExerciseForm
        open={formOpen}
        handleToggle={handleToggleForm}
        formUseData={formUseData}
        exerciseId={exercise?.exercise_id}
      />
      <div className="flex justify-start items-center pb-4 gap-x-2">
        <IconButton variant="text">
          <ArrowLeftIcon className="w-5 h-5" onClick={() => navigate(-1)} />
        </IconButton>
        <Typography variant="h3">
          Chapter {chapterIdx} {exercisesPool?.chapter_name}
        </Typography>
      </div>
      <div className="w-full flex justify-end mb-4">
        <Button
          className="mr-4"
          variant="outlined"
          color="red"
          onClick={() => handleOpenDelete()}
        >
          delete
        </Button>
        <Button
          onClick={() => {
            handleToggleForm();
            if (chapterIdx && level) {
              setFormUseData({
                chapterId: chapterIdx,
                level: level,
              });
            }
          }}
        >
          Edit Exercise
        </Button>
      </div>
      <Card className="border-[1px] mb-4">
        <CardBody>
          <div className="w-full ">
            <Typography variant="small" className="pt-4 font-medium">
              Level {level ?? ""}
            </Typography>
            <Typography variant="h4" className="pt-1 pb-2">
              {exercise?.name ?? ""}
            </Typography>
          </div>
          <TextEditor value={exercise?.content ?? ""} />
        </CardBody>
      </Card>
      <Card className="border-[1px] mb-4">
        <CardBody>
          <Typography variant="h5" className="pb-2">
            Soure Code
          </Typography>
          <Card
            className={`border-[1px] focus-within:border-2  overflow-hidden 
                 focus-within:!border-gray-900 `}
            shadow={false}
          >
            <CodeMirror
              height={"300px"}
              className="focus:!outline-none focus:ring-0 focus:border-none "
              value={exercise?.sourcecode}
              extensions={[python()]}
              readOnly={true}
              editable={false}
              placeholder="Put your code here..."
            />
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <Typography color="blue-gray" className="mb-2">
                Suggested Keyword Constraints
              </Typography>
              <KeywordConstraints
                constraintsType="suggested"
                constraints={constraints.suggested_constraints}
                isEdit={false}
              />
            </div>
            <div>
              <Typography color="blue-gray" className="mb-2">
                User defined Keyword Constraints
              </Typography>
              <KeywordConstraints
                constraintsType="user"
                constraints={constraints.user_defined_constraints}
                isEdit={false}
              />
            </div>
          </div>
        </CardBody>
      </Card>
      <Card className="border-[1px] mb-4">
        <CardBody>
          <div className="flex justify-between mb-4">
            <Typography variant="h5" className="pt-1 pb-2">
              Testcases
            </Typography>
            <div className="flex gap-x-2">
              <Button size="sm" onClick={() => handleToggleTestcaseForm()}>
                Edit Testcase
              </Button>
            </div>
          </div>
          {exercise && exercise?.testcase_list.length < 0 ? (
            <Alert variant="ghost">
              <span>No testcase available.</span>
            </Alert>
          ) : (
            exercise &&
            exercise.testcase_list.map((testcase, index) => (
              <TestcaseInfo
                readOnly={true}
                key={index}
                index={index}
                testcase={testcase}
              />
            ))
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default ExerciseInfo;
