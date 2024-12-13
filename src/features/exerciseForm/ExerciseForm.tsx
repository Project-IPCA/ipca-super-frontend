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
  getExerciseFormError,
  updateExercise,
  VITE_IPCA_RT,
} from "./redux/exerciseFormSlice";
import { Bounce, toast } from "react-toastify";
import * as yup from "yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchExercisesPool } from "../exercisesPool/redux/ExercisesPoolSlice";
import { useParams } from "react-router-dom";
import { FormUseData } from "../exercisesPool/ExercisesPool";
import {
  fetchExercisesInfo,
  getExercisesInfoState,
} from "../exerciseInfo/redux/exerciseInfoSlice";

interface Props {
  open: boolean;
  handleToggle: () => void;
  formUseData: FormUseData;
  exerciseId?: string;
  handleToggleUpdated?: () => void;
}

interface Constraint {
  keyword: string;
  limit: number;
}

export interface Constraints {
  classes: Constraint[];
  functions: Constraint[];
  imports: Constraint[];
  methods: Constraint[];
  reverse_words: Constraint[];
  variablse: Constraint[];
}

interface KeywordConstraints {
  suggested_constraints: Constraints;
  user_defined_constraints: Constraints;
}

const formDataSchema = yup.object({
  name: yup.string().required("Name is required."),
  sourecode: yup.string().required("Source code is required."),
  content: yup
    .string()
    .required("Content is required.")
    .test("non-empty", "Content is required.", (value: string) => {
      return !!(value && value !== "<p><br></p>");
    }),
});

export type FormData = yup.InferType<typeof formDataSchema>;

function ExerciseForm({
  open,
  handleToggle,
  formUseData,
  exerciseId,
  handleToggleUpdated,
}: Props) {
  const dispatch = useAppDispatch();
  const error = useAppSelector(getExerciseFormError);
  const exerciseInfoState = useAppSelector(getExercisesInfoState);
  const exerciseInfoKey = `${exerciseId}`;
  const exercise = exerciseInfoState[exerciseInfoKey]?.exerciseInfo;
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
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(formDataSchema),
    defaultValues: defaultForm,
  });

  const formData = watch();

  const [constraints, setConstraints] = useState<KeywordConstraints>({
    suggested_constraints: {
      reverse_words: [],
      functions: [],
      methods: [],
      variablse: [],
      imports: [],
      classes: [],
    },
    user_defined_constraints: {
      reverse_words: [],
      functions: [],
      methods: [],
      variablse: [],
      imports: [],
      classes: [],
    },
  });

  const handleToggleAndReset = () => {
    handleToggle();
    reset(defaultForm);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const uuid = uuidv4();
    const exerciseData = {
      name: data.name,
      sourcecode: data.sourecode,
      content: data.content,
      keyword_constraints: {
        suggested_constraints: null,
        user_defined_constraints: null,
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
        const resultAction = await dispatch(updateExercise(updateRequest));
        if (updateExercise.fulfilled.match(resultAction)) {
          toast.success("Exercise has been updated.", {
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
        if (handleToggleUpdated) {
          handleToggleUpdated();
        }
      } else {
        const resultAction = await dispatch(createExercise(createRequest));
        if (createExercise.fulfilled.match(resultAction)) {
          toast.success("Exercise has been created.", {
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
    handleToggleAndReset();
  };

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
      evtSource.onmessage = (event) => {
        if (event.data) {
          if (!exercise && exerciseId) {
            dispatch(fetchExercisesInfo(exerciseId));
          }
        }
      };
    }
  }, [jobId, exerciseId]);

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
        className="p-4 "
      >
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            {exerciseId ? "Edit Exercise" : "Add Exercise"}
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            {`Level ${formUseData.level}`}
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={() => handleToggleAndReset()}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="h-[42rem] overflow-scroll space-y-4">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Exercise Name
            </Typography>
            <Input
              {...register("name")}
              crossOrigin=""
              color="gray"
              size="lg"
              placeholder="Group Name"
              error={!!errors.name}
              className={`  ${errors.name ? "!border-t-red-500 focus:!border-t-red-500" : "focus:!border-t-gray-900 !border-t-blue-gray-200"} `}
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
              Description
            </Typography>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextEditor
                  value={field.value}
                  onChange={field.onChange}
                  errors={errors}
                />
              )}
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
                Source Code
              </Typography>
              <Button size="sm" variant="outlined">
                Analyze Code
              </Button>
            </div>
            <Card
              className={`border-[1px] focus-within:border-2  overflow-hidden 
                ${errors.sourecode ? "!border-red-500 focus-within:!border-red-500" : "focus-within:!border-gray-900 !border-blue-gray-200"}`}
              shadow={false}
            >
              <CodeMirror
                height={"300px"}
                className="focus:!outline-none focus:ring-0 focus:border-none "
                value={formData.sourecode}
                extensions={[python()]}
                onChange={(val) => setValue("sourecode", val)}
                placeholder="Put your code here..."
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
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="text-left font-medium mb-2"
              >
                Suggested Keyword Constraints
              </Typography>
              <KeywordConstraints
                constraints={constraints.suggested_constraints}
              />
            </div>
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="text-left font-medium mb-2"
              >
                User defined Keyword Constraints
              </Typography>
              <KeywordConstraints
                constraints={constraints.user_defined_constraints}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button className="ml-auto" onClick={handleSubmit(onSubmit)}>
            submit
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default ExerciseForm;
