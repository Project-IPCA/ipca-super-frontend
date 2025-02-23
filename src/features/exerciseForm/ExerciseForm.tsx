import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
  Input,
  Card,
} from "@material-tailwind/react";
import { v4 as uuidv4 } from "uuid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { useEffect, useState } from "react";
import TextEditor from "./components/TextEditor";
import KeywordConstraints from "./components/KeywordConstraints";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  createExercise,
  EditExerciseFormRequest,
  ExerciseFormRequest,
  ExeriseRequest,
  getExerciseFormError,
  getExerciseFormStatus,
  updateExercise,
  VITE_IPCA_RT,
} from "./redux/exerciseFormSlice";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchExercisesPool } from "../exercisesPool/redux/ExercisesPoolSlice";
import { useParams } from "react-router-dom";
import { FormUseData } from "../exercisesPool/ExercisesPool";
import {
  fetchExercisesInfo,
  getExercisesInfoState,
} from "../exerciseInfo/redux/exerciseInfoSlice";
import axiosInstance from "../../utils/axios";
import axios from "axios";
import { showToast } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import i18n from "../../locales";
import { PYTHON_LANG } from "../../constants/constants";

interface Props {
  open: boolean;
  handleToggle: () => void;
  formUseData: FormUseData;
  exerciseId?: string;
  handleToggleUpdated?: () => void;
  language?: string;
}

export interface SuggestedConstraintData {
  keyword: string;
  limit: number;
}

export interface UserConstraintData {
  keyword: string;
  limit: number;
  active: boolean;
  type: ConstraintType;
}

export interface PythonSuggestedConstraint {
  classes: SuggestedConstraintData[];
  functions: SuggestedConstraintData[];
  imports: SuggestedConstraintData[];
  methods: SuggestedConstraintData[];
  reserved_words: SuggestedConstraintData[];
  variables: SuggestedConstraintData[];
}

export interface PythonUserConstraint {
  classes: UserConstraintData[];
  functions: UserConstraintData[];
  imports: UserConstraintData[];
  methods: UserConstraintData[];
  reserved_words: UserConstraintData[];
  variables: UserConstraintData[];
}

export interface ClangSuggestedConstraint {
  functions: SuggestedConstraintData[];
  includes: SuggestedConstraintData[];
  reserved_words: SuggestedConstraintData[];
  variables: SuggestedConstraintData[];
}

export interface ClangUserConstraint {
  functions: UserConstraintData[];
  includes: UserConstraintData[];
  reserved_words: UserConstraintData[];
  variables: UserConstraintData[];
}

export interface IPythonKeywordConstraints {
  suggested_constraints: PythonSuggestedConstraint;
  user_defined_constraints: PythonUserConstraint;
}

export interface IClangKeywordConstraints {
  suggested_constraints: ClangSuggestedConstraint;
  user_defined_constraints: ClangUserConstraint;
}

interface CheckUserConstraintData extends UserConstraintData {
  is_passed: boolean;
}

interface CheckUserConstraint {
  classes: CheckUserConstraintData[];
  functions: CheckUserConstraintData[];
  imports: CheckUserConstraintData[];
  methods: CheckUserConstraintData[];
  reserved_words: CheckUserConstraintData[];
  variables: CheckUserConstraintData[];
}

interface CheckKeywordReponse {
  status: string;
  keyword_constraint: CheckUserConstraint;
}

type ConstraintType = "eq" | "me" | "le" | "na";

const formDataSchema = yup.object({
  name: yup
    .string()
    .required(i18n.t("feature.exercise_form.error.exercise_name")),
  sourecode: yup.string().required(i18n.t("feature.exercise_form.error.code")),
  content: yup
    .string()
    .required(i18n.t("feature.exercise_form.error.desc"))
    .test(
      "non-empty",
      i18n.t("feature.exercise_form.error.desc"),
      (value: string) => {
        return !!(value && value !== "<p><br></p>");
      },
    ),
});

export type FormData = yup.InferType<typeof formDataSchema>;
export type UserConstraintAction = "add" | "delete" | "update";

const defaultConstraints: IPythonKeywordConstraints = {
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
};

const defaultClangConstraints: IClangKeywordConstraints = {
  suggested_constraints: {
    functions: [],
    variables: [],
    includes: [],
    reserved_words: [],
  },
  user_defined_constraints: {
    functions: [],
    variables: [],
    includes: [],
    reserved_words: [],
  },
};

function ExerciseForm({
  open,
  handleToggle,
  formUseData,
  exerciseId,
  language,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const error = useAppSelector(getExerciseFormError);
  const exerciseInfoState = useAppSelector(getExercisesInfoState);
  const exerciseInfoKey = `${exerciseId}`;
  const exercise = exerciseInfoState[exerciseInfoKey]?.exerciseInfo;
  const isFetching = useAppSelector(getExerciseFormStatus);
  const [tempConstraint, setTempConstraint] =
    useState<IPythonKeywordConstraints>(defaultConstraints);
  const [clangTempConstraint, setClangTempConstraint] =
    useState<IClangKeywordConstraints>(defaultClangConstraints);
  const [isConstraintDirty, setIsConstraintDirty] = useState<boolean>(false);
  const { groupId, chapterIdx } = useParams();
  const [jobId, setJobId] = useState<string>();

  useEffect(() => {
    if (!exercise && exerciseId) {
      dispatch(fetchExercisesInfo(exerciseId));
    }
  }, [dispatch, exercise, exerciseId]);

  const defaultForm = {
    name: "",
    sourecode: "",
    content: "<p><br></p>",
  };
  const {
    formState: { errors, isDirty },
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(formDataSchema),
    defaultValues: defaultForm,
  });

  const formData = watch();

  const [constraints, setConstraints] =
    useState<IPythonKeywordConstraints>(defaultConstraints);

  const [clangConstraints, setClangConstraints] =
    useState<IClangKeywordConstraints>(defaultClangConstraints);

  useEffect(() => {
    if (exercise) {
      if (language === PYTHON_LANG) {
        setConstraints(() => {
          return {
            suggested_constraints: exercise?.suggested_constraints,
            user_defined_constraints: exercise?.user_defined_constraints,
          };
        });
        setTempConstraint(() => {
          return {
            suggested_constraints: exercise?.suggested_constraints,
            user_defined_constraints: exercise?.user_defined_constraints,
          };
        });
      } else {
        setClangConstraints(() => {
          return {
            suggested_constraints: exercise?.suggested_constraints,
            user_defined_constraints: exercise?.user_defined_constraints,
          };
        });
        setClangTempConstraint(() => {
          return {
            suggested_constraints: exercise?.suggested_constraints,
            user_defined_constraints: exercise?.user_defined_constraints,
          };
        });
      }
    }
  }, [exercise]);

  useEffect(() => {
    if (language === PYTHON_LANG) {
      setIsConstraintDirty(
        JSON.stringify(constraints) !== JSON.stringify(tempConstraint),
      );
    } else {
      setIsConstraintDirty(
        JSON.stringify(clangConstraints) !==
          JSON.stringify(clangTempConstraint),
      );
    }
  }, [
    constraints,
    clangConstraints,
    clangTempConstraint,
    tempConstraint,
    language,
  ]);

  const handleToggleAndReset = () => {
    handleToggle();
    reset(defaultForm);
    setConstraints(defaultConstraints);
    setClangConstraints(defaultClangConstraints);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await axiosInstance.post(
        `/common/keyword_check/${language?.toLocaleLowerCase()}`,
        {
          exercise_kw_list:
            language === PYTHON_LANG
              ? constraints.user_defined_constraints
              : clangConstraints.user_defined_constraints,
          sourcecode: data.sourecode,
        },
      );
      const responseData: CheckKeywordReponse = response.data;
      if (responseData.status == "failed") {
        const errConstraints = Object.entries(responseData.keyword_constraint)
          .filter(
            ([, val]) =>
              val.length > 0 &&
              val.some((item: CheckUserConstraintData) => !item.is_passed),
          )
          .reduce(
            (acc, [key, val]) => ({
              ...acc,
              [key]: val.filter(
                (item: CheckUserConstraintData) => !item.is_passed,
              ),
            }),
            {} as Record<string, CheckUserConstraintData[]>,
          );
        Object.entries(errConstraints).map(([key, val]) => {
          val.map((data: CheckUserConstraintData) => {
            showToast({
              variant: "error",
              message: `Recheck your ${key} ${data.keyword}`,
            });
          });
        });
        return;
      }
      const uuid = uuidv4();
      const exerciseData = {
        name: data.name,
        sourcecode: data.sourecode,
        content: data.content,
        keyword_constraints: {
          suggested_constraints:
            language === PYTHON_LANG
              ? constraints.suggested_constraints
              : clangConstraints.suggested_constraints,
          user_defined_constraints:
            language === PYTHON_LANG
              ? constraints.user_defined_constraints
              : clangConstraints.user_defined_constraints,
        },
      };
      const createRequest: ExerciseFormRequest = {
        ...exerciseData,
        chapter_id: formUseData.chapterId,
        level: formUseData.level,
      };

      const updateRequest: EditExerciseFormRequest = {
        ...createRequest,
        job_id: uuid,
        exercise_id: exerciseId || "",
      };

      setJobId(uuid);

      if (formUseData.level && formUseData.chapterId) {
        if (exerciseId) {
          const exerciseRequest: ExeriseRequest = {
            request: updateRequest,
            language: language || "",
          };
          const resultAction = await dispatch(updateExercise(exerciseRequest));
          if (updateExercise.fulfilled.match(resultAction)) {
            showToast({
              variant: "success",
              message: "Exercise has been updated.",
            });
          }
        } else {
          const exerciseRequest: ExeriseRequest = {
            request: createRequest,
            language: language || "",
          };
          const resultAction = await dispatch(createExercise(exerciseRequest));
          if (createExercise.fulfilled.match(resultAction)) {
            showToast({
              variant: "success",
              message: "Exercise has been created.",
            });
          }
        }
      }

      if (groupId && chapterIdx) {
        await dispatch(
          fetchExercisesPool({
            groupId: groupId,
            chapterIdx: parseInt(chapterIdx),
          }),
        );
      }
      if (exerciseId) {
        dispatch(fetchExercisesInfo(exerciseId));
      }
      if (!isFetching) {
        handleToggleAndReset();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showToast({
          variant: "error",
          message: err.response?.data?.error,
        });
      }
    }
  };

  useEffect(() => {
    if (error) {
      showToast({
        variant: "error",
        message: error.error,
      });
    }
  }, [error]);

  useEffect(() => {
    if (exerciseId && exercise && !open) {
      reset({
        name: exercise.name,
        content: exercise.content,
        sourecode: exercise.sourcecode,
      });
    }
  }, [reset, exerciseId, exercise, open]);

  useEffect(() => {
    if (jobId && exerciseId) {
      const evtSource = new EventSource(
        `${VITE_IPCA_RT}/testcase-result/${jobId}`,
      );

      const entTimeOut = setTimeout(() => {
        if (evtSource) {
          evtSource.close();
          dispatch(fetchExercisesInfo(exerciseId));
        }
      }, 3000);

      evtSource.onmessage = (event) => {
        if (event.data) {
          if (!exercise && exerciseId) {
            dispatch(fetchExercisesInfo(exerciseId));
            evtSource.close();
            clearTimeout(entTimeOut);
          }
        }
      };

      return () => {
        evtSource.close();
        clearTimeout(entTimeOut);
      };
    }
  }, [jobId, exerciseId]);

  const handleUserConstraints = (
    key: keyof PythonUserConstraint | keyof ClangUserConstraint,
    action: UserConstraintAction,
    data?: UserConstraintData,
    index?: number,
  ) => {
    const currentItems =
      language === PYTHON_LANG
        ? [
            ...constraints.user_defined_constraints[
              key as keyof PythonUserConstraint
            ],
          ]
        : [
            ...clangConstraints.user_defined_constraints[
              key as keyof ClangUserConstraint
            ],
          ];

    switch (action) {
      case "add":
        if (data !== undefined) {
          if (language === PYTHON_LANG) {
            setConstraints((prev) => {
              return {
                ...prev,
                user_defined_constraints: {
                  ...prev.user_defined_constraints,
                  [key]: [...currentItems, data],
                },
              };
            });
          } else {
            setClangConstraints((prev) => {
              return {
                ...prev,
                user_defined_constraints: {
                  ...prev.user_defined_constraints,
                  [key]: [...currentItems, data],
                },
              };
            });
          }
        }
        break;
      case "update":
        if (index !== undefined && data !== undefined) {
          currentItems[index] = data;
          if (language === PYTHON_LANG) {
            setConstraints((prev) => {
              return {
                ...prev,
                user_defined_constraints: {
                  ...prev.user_defined_constraints,
                  [key]: currentItems,
                },
              };
            });
          } else {
            setClangConstraints((prev) => {
              return {
                ...prev,
                user_defined_constraints: {
                  ...prev.user_defined_constraints,
                  [key]: currentItems,
                },
              };
            });
          }
        }
        break;
      case "delete":
        if (index !== undefined) {
          currentItems.splice(index, 1);
          if (language === PYTHON_LANG) {
            setConstraints((prev) => {
              return {
                ...prev,
                user_defined_constraints: {
                  ...prev.user_defined_constraints,
                  [key]: currentItems,
                },
              };
            });
          } else {
            setClangConstraints((prev) => {
              return {
                ...prev,
                user_defined_constraints: {
                  ...prev.user_defined_constraints,
                  [key]: currentItems,
                },
              };
            });
          }
        }
        break;
    }
  };

  const analyzeKeywordList: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await axiosInstance.post(
        `/common/get_keyword_list/${language?.toLowerCase()}`,
        {
          sourcecode: data.sourecode,
        },
      );
      if (response.data.status !== "error") {
        if (language === PYTHON_LANG) {
          setConstraints((constraint) => {
            return { ...constraint, suggested_constraints: response.data.data };
          });
        } else {
          setClangConstraints((constraint) => {
            return { ...constraint, suggested_constraints: response.data.data };
          });
        }
        return;
      }
      showToast({
        variant: "error",
        message: response.data.message,
      });
    } catch (err) {
      let errorMessage = "An unexpected error occurred";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message;
      }
      showToast({
        variant: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <>
      <Dialog
        size="xl"
        open={open}
        handler={() => {
          if (exerciseId) {
            handleToggle();
          } else {
            handleToggleAndReset();
          }
        }}
        className="p-4 lg:mb-0 mb-12"
      >
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            {exerciseId
              ? t("feature.exercise_form.title.edit")
              : t("feature.exercise_form.title.add")}
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            {`${t("feature.exercise_form.desc")} ${formUseData.level}`}
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={() => {
              if (exerciseId) {
                handleToggle();
              } else {
                handleToggleAndReset();
              }
            }}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="lg:h-[42rem] h-[14rem] overflow-scroll space-y-4">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              {t("feature.exercise_form.label.exercise_name")}
            </Typography>
            <Input
              {...register("name")}
              crossOrigin=""
              color="gray"
              size="lg"
              placeholder={t("feature.exercise_form.label.exercise_name")}
              error={!!errors.name}
              className={`  ${
                errors.name
                  ? "!border-t-red-500 focus:!border-t-red-500"
                  : "focus:!border-t-gray-900 !border-t-blue-gray-200"
              } `}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography
              variant="small"
              color="red"
              className="mt-1 flex items-center gap-1 font-normal !text-xs"
            >
              {errors.name ? errors.name.message : ""}
            </Typography>
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              {t("feature.exercise_form.label.desc")}
            </Typography>
            <TextEditor
              value={formData.content}
              onChange={(val) =>
                setValue("content", val, { shouldDirty: true })
              }
              errors={errors}
              exerciseId={exerciseId}
            />
            <Typography
              variant="small"
              color="red"
              className="mt-1 flex items-center gap-1 font-normal !text-xs"
            >
              {errors.content ? errors.content.message : ""}
            </Typography>
          </div>
          <div>
            <div className="flex justify-between items-end mb-2">
              <Typography
                variant="small"
                color="blue-gray"
                className="text-left font-medium"
              >
                {t("feature.exercise_form.label.code")}
              </Typography>
              <Button
                size="sm"
                variant="outlined"
                onClick={handleSubmit(analyzeKeywordList)}
              >
                {t("feature.exercise_form.button.analyze")}
              </Button>
            </div>
            <Card
              className={`border-[1px] focus-within:border-2  overflow-hidden 
                ${
                  errors.sourecode
                    ? "!border-red-500 focus-within:!border-red-500"
                    : "focus-within:!border-gray-900 !border-blue-gray-200"
                }`}
              shadow={false}
            >
              <CodeMirror
                height={"300px"}
                className="focus:!outline-none focus:ring-0 focus:border-none "
                value={formData.sourecode}
                extensions={[python()]}
                onChange={(val) =>
                  setValue("sourecode", val, { shouldDirty: true })
                }
                placeholder={t("feature.exercise_form.placeholder.code")}
              />
            </Card>
            <Typography
              variant="small"
              color="red"
              className="mt-1 flex items-center gap-1 font-normal !text-xs"
            >
              {errors.sourecode ? errors.sourecode.message : ""}
            </Typography>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="text-left font-medium mb-2"
              >
                {t("feature.exercise_form.label.sug_const")}
              </Typography>
              <KeywordConstraints
                constraintsType="suggested"
                constraints={
                  language === PYTHON_LANG
                    ? constraints.suggested_constraints
                    : clangConstraints.suggested_constraints
                }
                handleUserConstraints={handleUserConstraints}
                isEdit={true}
              />
            </div>
            <div className="relative">
              <Typography
                variant="small"
                color="blue-gray"
                className="text-left font-medium mb-2"
              >
                {t("feature.exercise_form.label.user_const")}
              </Typography>
              <KeywordConstraints
                constraintsType="user"
                constraints={
                  language === PYTHON_LANG
                    ? constraints.user_defined_constraints
                    : clangConstraints.user_defined_constraints
                }
                handleUserConstraints={handleUserConstraints}
                isEdit={true}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            className="ml-auto"
            onClick={handleSubmit(onSubmit)}
            disabled={!(isDirty || isConstraintDirty)}
            loading={isFetching}
          >
            {t("common.button.submit")}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default ExerciseForm;
