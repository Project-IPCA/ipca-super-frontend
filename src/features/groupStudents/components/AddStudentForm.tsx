import {
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Textarea,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "../../../hooks/store";
import { addStudents, fetchGroupStudents } from "../redux/GroupStudentsSlice";
import { Bounce, toast } from "react-toastify";

interface Props {
  open: boolean;
  handleClose: () => void;
  groupId: string;
}

const formDataSchema = yup.object({
  studentsList: yup
    .string()
    .required("Students is required.")
    .matches(
      /^(\d+\s\d{8}\s[\u0E00-\u0E7F\w]+\s[\u0E00-\u0E7F\w]+\n?)+$/,
      "Incorrect students format.",
    ),
});

export type FormData = yup.InferType<typeof formDataSchema>;

function AddStudentForm({ open, handleClose, groupId }: Props) {
  const dispatch = useAppDispatch();
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(formDataSchema),
    defaultValues: {
      studentsList: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (groupId) {
      const resultAction = await dispatch(
        addStudents({
          groupId: groupId,
          studentsList: data.studentsList,
        }),
      );
      if (addStudents.fulfilled.match(resultAction)) {
        toast.success("Students has been added.", {
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
    await dispatch(fetchGroupStudents({ groupId: groupId, page: 1 }));
    reset();
    handleClose();
  };
  return (
    <Dialog size="md" open={open} handler={handleClose} className="p-4 ">
      <DialogHeader className="relative m-0 block">
        <Typography variant="h4" color="blue-gray">
          Add Students
        </Typography>
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={handleClose}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="space-y-4 pb-6 max-h-[42rem] overflow-scroll">
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-2 text-left font-medium"
          >
            Students List
          </Typography>
          <Textarea
            {...register("studentsList")}
            size="lg"
            rows={20}
            color="gray"
            placeholder={
              "Copy from excel and paste here\n\n1 64010000 John Doe\n2 64010001 James Smith\n3 64010002 Ann Other\n..."
            }
            error={!!errors.studentsList}
            className={`${errors.studentsList ? "!border-t-red-500 focus:!border-t-red-500" : "focus:!border-t-gray-900 !border-t-blue-gray-200"} `}
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography
            variant="small"
            color="red"
            className="mt-1 flex items-center gap-1 font-normal !text-xs"
          >
            {errors.studentsList ? errors.studentsList.message : ""}
          </Typography>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button className="ml-auto" onClick={handleSubmit(onSubmit)}>
          submit
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default AddStudentForm;
