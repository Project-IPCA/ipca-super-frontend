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
import { useTranslation } from "react-i18next";
import { LANGUAGE } from "../../constants/constants";
import { CodeBracketIcon } from "@heroicons/react/24/outline";

function ExerciseInfo() {
  const { t, i18n } = useTranslation();
  const { groupId, chapterIdx, exerciseId, level } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const exercisesPoolState = useAppSelector(getExercisesPoolState);
  const exerciseInfoState = useAppSelector(getExercisesInfoState);
  const key = `${groupId}.${chapterIdx}`;
  const exercisesPool = exercisesPoolState[key]?.chapterDetail;
  const exerciseInfoKey = `${exerciseId}`;
  const exercise = exerciseInfoState[exerciseInfoKey]?.exerciseInfo;
  const isFetching = exerciseInfoState[exerciseInfoKey]?.isFetching;
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
        }),
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
        }),
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
        title={t("feature.exercise_info.modal.delete.title")}
        description={
          <>
            {t("feature.exercise_info.modal.delete.msg1")}{" "}
            <b>{exercise?.name}</b>
            {i18n.language === LANGUAGE.en ? "?" : ""}{" "}
            {t("feature.exercise_info.modal.delete.msg2")}
          </>
        }
        confirmLabel={t("common.button.delete")}
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
        <div className="flex justify-start items-center gap-x-2">
          <Typography variant="h3">
            {t("feature.exercise_info.title")}
          </Typography>
          {isFetching ? (
            <Typography
              as="div"
              variant="h3"
              className="h-6 w-32 rounded-full bg-gray-300 "
            >
              &nbsp;
            </Typography>
          ) : (
            <Typography variant="h3">
              {chapterIdx} {exercisesPool?.chapter_name}
            </Typography>
          )}
        </div>
      </div>
      <div className="w-full flex justify-end mb-4">
        <Button
          className="mr-4"
          variant="outlined"
          disabled={isFetching}
          color="red"
          onClick={() => handleOpenDelete()}
        >
          {t("feature.exercise_info.button.delete")}
        </Button>
        <Button
          disabled={isFetching}
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
          {t("feature.exercise_info.button.edit_exercise")}
        </Button>
      </div>
      <Card className="border-[1px] mb-4">
        <CardBody>
          <div className="w-full ">
            {isFetching ? (
              <>
                <Typography
                  as="div"
                  variant="small"
                  className="block mt-4 h-3 w-24 rounded-lg bg-gray-300"
                >
                  &nbsp;
                </Typography>
                <Typography
                  as="div"
                  variant="small"
                  className="block mt-4 mb-6 h-5 w-1/3 rounded-lg bg-gray-300"
                >
                  &nbsp;
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="small" className="pt-4 font-medium">
                  {t("feature.exercise_info.desc")} {level ?? ""}
                </Typography>
                <Typography variant="h4" className="pt-1 pb-2">
                  {exercise?.name ?? ""}
                </Typography>
              </>
            )}
          </div>
          {isFetching ? (
            <>
              {Array.from({ length: 9 }).map((_, index) => (
                <Typography
                  as="div"
                  variant="paragraph"
                  className="mb-3 h-2 w-full rounded-full bg-gray-300"
                  key={index}
                >
                  &nbsp;
                </Typography>
              ))}
              <Typography
                as="div"
                variant="paragraph"
                className="mb-3 h-2 w-11/12 rounded-full bg-gray-300"
              >
                &nbsp;
              </Typography>
            </>
          ) : (
            <TextEditor value={exercise?.content ?? ""} />
          )}
        </CardBody>
      </Card>
      <Card className="border-[1px] mb-4">
        <CardBody>
          {isFetching ? (
            <Typography
              as="div"
              variant="h5"
              className="block h-5 mb-3 w-36 rounded-full bg-gray-300"
            >
              &nbsp;
            </Typography>
          ) : (
            <Typography variant="h5" className="pb-2">
              {t("feature.exercise_info.code")}
            </Typography>
          )}
          <Card
            className={`border-[1px] focus-within:border-2  overflow-hidden 
                 focus-within:!border-gray-900 `}
            shadow={false}
          >
            {isFetching ? (
              <div className="grid w-full h-[300px]  animate-pulse place-items-center rounded-lg bg-gray-300">
                <CodeBracketIcon className="h-12 w-12 text-gray-500" />
              </div>
            ) : (
              <CodeMirror
                height={"300px"}
                className="focus:!outline-none focus:ring-0 focus:border-none "
                value={exercise?.sourcecode}
                extensions={[python()]}
                readOnly={true}
                editable={false}
              />
            )}
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              {isFetching ? (
                <>
                  <Typography
                    as="div"
                    variant="small"
                    className="block h-3 mb-4 w-1/2 rounded-full bg-gray-300"
                  >
                    &nbsp;
                  </Typography>
                  <div className="space-y-2">
                    {[...Array(6)].map((_, index) => (
                      <Typography
                        key={index}
                        as="div"
                        variant="small"
                        className="h-12 w-full rounded-lg bg-gray-300"
                      >
                        &nbsp;
                      </Typography>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Typography color="blue-gray" className="mb-2">
                    {t("feature.exercise_info.constraint.sug_const")}
                  </Typography>
                  <KeywordConstraints
                    constraintsType="suggested"
                    constraints={constraints.suggested_constraints}
                    isEdit={false}
                  />
                </>
              )}
            </div>
            <div>
              {isFetching ? (
                <>
                  <Typography
                    as="div"
                    variant="small"
                    className="block h-3 mb-4 w-1/2 rounded-full bg-gray-300"
                  >
                    &nbsp;
                  </Typography>
                  <div className="space-y-2">
                    {[...Array(6)].map((_, index) => (
                      <Typography
                        key={index}
                        as="div"
                        variant="small"
                        className="h-12 w-full rounded-lg bg-gray-300"
                      >
                        &nbsp;
                      </Typography>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Typography color="blue-gray" className="mb-2">
                    {t("feature.exercise_info.constraint.user_const")}
                  </Typography>
                  <KeywordConstraints
                    constraintsType="user"
                    constraints={constraints.user_defined_constraints}
                    isEdit={false}
                  />
                </>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
      <Card className="border-[1px] mb-4">
        <CardBody>
          <div className="flex justify-between mb-4">
            {isFetching ? (
              <Typography
                as="div"
                variant="h5"
                className="block h-5  w-36 rounded-full bg-gray-300"
              >
                &nbsp;
              </Typography>
            ) : (
              <Typography variant="h5" className="pt-1 pb-2">
                {t("feature.exercise_info.testcase")}
              </Typography>
            )}
            <div className="flex gap-x-2">
              <Button
                size="sm"
                disabled={isFetching}
                onClick={() => handleToggleTestcaseForm()}
              >
                {t("feature.exercise_info.button.edit_testcase")}
              </Button>
            </div>
          </div>
          {isFetching ? (
            <div className="flex lg:flex-row flex-col w-full gap-2">
              <div className="flex flex-col gap-y-3 w-full">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Card
                    key={index}
                    className="px-5 py-3 bg-white border-[1px] shadow-none"
                  >
                    <Typography
                      as="div"
                      variant="paragraph"
                      className="h-2 w-1/4 rounded-full bg-gray-300"
                    >
                      &nbsp;
                    </Typography>
                    <div className="flex lg:flex-row flex-col w-full gap-x-2">
                      {[...Array(2)].map((_, index) => (
                        <Typography
                          as="div"
                          key={index}
                          className="h-40 w-full rounded-lg bg-gray-300 mt-3"
                        >
                          &nbsp;
                        </Typography>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : exercise && exercise?.testcase_list.length < 0 ? (
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
