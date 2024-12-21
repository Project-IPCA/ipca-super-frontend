import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { v4 as uuidv4 } from "uuid";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import {
  fetchExercisesInfo,
  Testcase,
  updateExerciseTestcase,
  VITE_IPCA_RT,
} from "../redux/exerciseInfoSlice";
import { useAppDispatch } from "../../../hooks/store";
import { Bounce, toast } from "react-toastify";
import TestcaseInfo from "./TestcaseInfo";

interface Props {
  open: boolean;
  handleToggle: () => void;
  exerciseId: string;
  testcaseList: Testcase[];
}

function TestcaseForm({ open, handleToggle, exerciseId, testcaseList }: Props) {
  const dispatch = useAppDispatch();
  const [jobId, setJobId] = useState<string>();
  const defaultTestcase = {
    exercise_id: exerciseId,
    is_active: true,
    is_ready: "no",
    show_to_student: false,
    testcase_content: "",
    testcase_error: null,
    testcase_id: null,
    testcase_note: null,
    testcase_output: null,
  };

  const [testcases, setTestcases] = useState<Testcase[]>([...testcaseList]);
  const [removed, setRemoved] = useState<string[]>([]);
  useEffect(() => {
    setTestcases(testcaseList);
  }, [testcaseList]);

  const removeTestcase = (index: number) => {
    setTestcases((prevTestcases) =>
      prevTestcases.filter((_, i) => i !== index),
    );
  };

  const updateTestcaseField = (
    index: number,
    field: keyof Testcase,
    value: any,
  ) => {
    setTestcases((prevTestcases) => {
      const updatedTestcases = [...prevTestcases];
      updatedTestcases[index] = {
        ...updatedTestcases[index],
        [field]: value,
      };
      return updatedTestcases;
    });
  };

  const handleSubmitSave = async () => {
    const uuid = uuidv4();
    const request = {
      exercise_id: exerciseId,
      job_id: uuid,
      removed_list: removed,
      testcase_list: testcases,
    };
    const resultAction = await dispatch(updateExerciseTestcase(request));
    if (updateExerciseTestcase.fulfilled.match(resultAction)) {
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
    setJobId(uuid);
  };

  const handleAddRemoved = (testcaseId: string) => {
    if (testcaseId) {
      setRemoved((prev) => [...prev, String(testcaseId)]);
    }
  };

  const handleSubmitRun = async (testcase: Testcase) => {
    const uuid = uuidv4();
    const request = {
      exercise_id: exerciseId,
      job_id: uuid,
      removed_list: [],
      testcase_list: [testcase],
    };
    await dispatch(updateExerciseTestcase(request));
    setJobId(uuid);
  };

  useEffect(() => {
    if (jobId && exerciseId) {
      const evtSource = new EventSource(
        `${VITE_IPCA_RT}/testcase-result/${jobId}`,
      );
      evtSource.onmessage = (event) => {
        if (event.data) {
          if (exerciseId) {
            dispatch(fetchExercisesInfo(exerciseId));
          }
        }
      };
    }
  }, [jobId, exerciseId]);

  return (
    <>
      <Dialog size="xl" open={open} handler={handleToggle} className="p-4">
        <DialogHeader>
          <Typography variant="h4" color="blue-gray">
            Edit Testcase
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={() => handleToggle()}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="lg:h-[42rem] h-[14rem] overflow-scroll">
          {testcases.map((testcase, index) => (
            <TestcaseInfo
              readOnly={false}
              key={index}
              index={index}
              testcase={testcase}
              updateTestcaseField={updateTestcaseField}
              removeTestcase={removeTestcase}
              handleSubmitRun={handleSubmitRun}
              handleAddRemoved={handleAddRemoved}
            />
          ))}
          <Button
            variant="outlined"
            size="sm"
            className="flex items-center gap-3"
            onClick={() => {
              setTestcases((prev) => [...prev, defaultTestcase]);
            }}
          >
            <PlusIcon className="w-5 h-5" />
            Add testcase
          </Button>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            onClick={() => {
              handleSubmitSave();
              handleToggle();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default TestcaseForm;
