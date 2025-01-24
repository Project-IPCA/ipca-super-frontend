import {
  Input,
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Option,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AsyncSelect } from "../../components";
import * as yup from "yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AVAILABLE_TIME,
  DAY_OF_WEEK,
  SEMESTER,
} from "../../constants/constants";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  clearGroupFormError,
  createStudentGroup,
  fetchDepartments,
  fetchGroupInfo,
  fetchStaffs,
  getDepartments,
  getGroupFormError,
  getGroupInfo,
  getStaffs,
  updateStudentGroup,
} from "./redux/groupFormSlice";
import { useEffect, useRef } from "react";
import MultiSelect from "./components/MultiSelect";
import { fetchMyGroups } from "../myGroupsList/redux/myGroupListSlice";
import { showToast } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { getDayFromDayEnum } from "../../utils";
import i18n from "../../locales";

interface Props {
  open: boolean;
  onClose: () => void;
  groupId?: string | null;
}

const formDataSchema = yup.object({
  groupName: yup
    .string()
    .required(i18n.t("feature.group_form.error.group_name")),
  groupNumber: yup
    .string()
    .required(i18n.t("feature.group_form.error.group_number.required"))
    .matches(
      /^[0-9]+$/,
      i18n.t("feature.group_form.error.group_number.number"),
    ),
  dayOfWeek: yup
    .string()
    .required(i18n.t("feature.group_form.error.day_of_week")),
  classTime: yup
    .string()
    .required(i18n.t("feature.group_form.error.class_time")),
  semester: yup.string().required(i18n.t("feature.group_form.error.semester")),
  year: yup.string().required(i18n.t("feature.group_form.error.year")),
  departmentId: yup.string().required(i18n.t("feature.group_form.error.dept")),
  staffs: yup
    .array()
    .of(
      yup.object({
        value: yup.string().required(),
        label: yup.string().required(),
      }),
    )
    .required(),
});

export type FormData = yup.InferType<typeof formDataSchema>;

function GroupForm({ open, onClose, groupId = null }: Props) {
  const dispatch = useAppDispatch();
  const departments = useAppSelector(getDepartments);
  const groupFormError = useAppSelector(getGroupFormError);
  const groupInfo = useAppSelector(getGroupInfo);
  const staffs = useAppSelector(getStaffs);
  const { t, i18n } = useTranslation();
  const initialized = useRef(false);
  const defaultForm = {
    groupName: "",
    groupNumber: "",
    dayOfWeek: "",
    classTime: "",
    semester: "",
    year: "",
    departmentId: "",
    staffs: [],
  };
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(formDataSchema),
    defaultValues: defaultForm,
  });

  useEffect(() => {
    if (groupId && !groupInfo[groupId]) {
      dispatch(fetchGroupInfo(groupId));
    }
  }, [dispatch, groupId]);

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return `${parseInt(hours, 10)}:${minutes}`;
  };

  useEffect(() => {
    if (groupId && groupInfo[groupId]) {
      const newGroupInfo = groupInfo[groupId];
      const classTime = `${formatTime(newGroupInfo.time_start)} - ${formatTime(newGroupInfo.time_end)}`;
      const staffs = newGroupInfo.staffs.map((staff) => ({
        value: staff.supervisor_id,
        label: `${staff.f_name} ${staff.l_name}`,
      }));
      reset({
        groupName: newGroupInfo.name,
        groupNumber: newGroupInfo.group_no.toString() || "",
        dayOfWeek: newGroupInfo.day,
        classTime: classTime,
        semester: newGroupInfo.semester.toString(),
        year: newGroupInfo.year.toString(),
        departmentId: newGroupInfo.department.dept_id,
        staffs: staffs,
      });
    }
  }, [groupId, groupInfo]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(fetchDepartments());
      dispatch(fetchStaffs());
    }
  }, [dispatch, initialized]);

  const staffsOptions = staffs.map((staff) => ({
    value: staff.supervisor_id,
    label: `${staff.f_name} ${staff.l_name}`,
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: groupId ? 5 : 2 }, (_, i) =>
    (currentYear + 1 - i).toString(),
  );

  useEffect(() => {
    if (groupFormError) {
      showToast({
        variant: "error",
        message: "groupFormError.error",
      });
      dispatch(clearGroupFormError());
    }
  }, [dispatch, groupFormError]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const classTime = data.classTime.split(" - ");
    const staffs = data.staffs.map((staff) => ({ staff_id: staff.value }));
    const request = {
      name: data.groupName,
      number: parseInt(data.groupNumber),
      day: data.dayOfWeek,
      time_start: classTime[0],
      time_end: classTime[1],
      year: parseInt(data.year),
      semester: parseInt(data.semester),
      dept_id: data.departmentId,
      staffs: staffs,
    };
    if (groupId) {
      const resultAction = await dispatch(
        updateStudentGroup({ request: request, groupId: groupId }),
      );
      if (updateStudentGroup.fulfilled.match(resultAction)) {
        showToast({
          variant: "success",
          message: "Student group has been updated.",
        });
        dispatch(fetchGroupInfo(groupId));
      }
    } else {
      const resultAction = await dispatch(createStudentGroup(request));
      if (createStudentGroup.fulfilled.match(resultAction)) {
        showToast({
          variant: "success",
          message: "Student group has been created.",
        });
      }
    }
    dispatch(fetchMyGroups({ year: "All", page: 1 }));
    reset(defaultForm);
    onClose();
  };

  return (
    <>
      <Dialog size="sm" open={open} handler={onClose} className="p-4 !z-[500]">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            {groupId
              ? t("feature.group_form.title.edit")
              : t("feature.group_form.title.create")}
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={() => {
              reset(defaultForm);
              onClose();
            }}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6 lg:h-full  h-[14rem] lg:overflow-y-visible overflow-y-scroll">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              {t("feature.group_form.label.group_name")}
            </Typography>
            <Input
              {...register("groupName")}
              crossOrigin=""
              color="gray"
              size="lg"
              placeholder={t("feature.group_form.label.group_name")}
              error={!!errors.groupName}
              className={`  ${errors.groupName ? "!border-t-red-500 focus:!border-t-red-500" : "focus:!border-t-gray-900 !border-t-blue-gray-200"} `}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography
              variant="small"
              color="red"
              className="mt-1 flex items-center gap-1 font-normal !text-xs"
            >
              {errors.groupName ? errors.groupName.message : ""}
            </Typography>
          </div>

          <div className="flex lg:flex-row flex-col gap-4">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                {t("feature.group_form.label.group_number")}
              </Typography>
              <Input
                {...register("groupNumber")}
                crossOrigin=""
                color="gray"
                size="lg"
                placeholder={t("feature.group_form.label.group_number")}
                error={!!errors.groupNumber}
                className={`  ${errors.groupNumber ? "!border-t-red-500 focus:!border-t-red-500" : "focus:!border-t-gray-900 !border-t-blue-gray-200"} `}
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography
                variant="small"
                color="red"
                className="mt-1 flex items-center gap-1 font-normal !text-xs"
              >
                {errors.groupNumber ? errors.groupNumber.message : ""}
              </Typography>
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                {t("feature.group_form.label.dept")}
              </Typography>
              <Controller
                name="departmentId"
                control={control}
                render={({ field }) => {
                  return (
                    <AsyncSelect
                      {...field}
                      variant="outlined"
                      size="lg"
                      color="gray"
                      containerProps={{
                        className: "!min-w-full",
                      }}
                      labelProps={{
                        className: "before:mr-0 after:ml-0",
                      }}
                      error={!!errors.departmentId}
                    >
                      {departments.map((dept) => (
                        <Option key={dept.dept_id} value={dept.dept_id}>
                          {dept.dept_name}
                        </Option>
                      ))}
                    </AsyncSelect>
                  );
                }}
              />
              <Typography
                variant="small"
                color="red"
                className="mt-1 flex items-center gap-1 font-normal !text-xs"
              >
                {errors.departmentId ? errors.departmentId.message : ""}
              </Typography>
            </div>
          </div>
          <div className="flex lg:flex-row flex-col gap-4">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                {t("feature.group_form.label.day_of_week")}
              </Typography>
              <Controller
                name="dayOfWeek"
                control={control}
                render={({ field }) => {
                  return (
                    <AsyncSelect
                      {...field}
                      variant="outlined"
                      size="lg"
                      color="gray"
                      containerProps={{
                        className: "!min-w-full",
                      }}
                      labelProps={{
                        className: "before:mr-0 after:ml-0",
                      }}
                      error={!!errors.dayOfWeek}
                    >
                      {DAY_OF_WEEK.map((day) => (
                        <Option key={day} value={day}>
                          {getDayFromDayEnum(day, i18n.language)}
                        </Option>
                      ))}
                    </AsyncSelect>
                  );
                }}
              />
              <Typography
                variant="small"
                color="red"
                className="mt-1 flex items-center gap-1 font-normal !text-xs"
              >
                {errors.dayOfWeek ? errors.dayOfWeek.message : ""}
              </Typography>
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                {t("feature.group_form.label.class_time")}
              </Typography>
              <Controller
                name="classTime"
                control={control}
                render={({ field }) => {
                  return (
                    <AsyncSelect
                      {...field}
                      variant="outlined"
                      size="lg"
                      color="gray"
                      error={!!errors.classTime}
                      containerProps={{
                        className: "!min-w-full",
                      }}
                      labelProps={{
                        className: "before:mr-0 after:ml-0",
                      }}
                    >
                      {AVAILABLE_TIME.map((time) => (
                        <Option key={time} value={time}>
                          {time}
                        </Option>
                      ))}
                    </AsyncSelect>
                  );
                }}
              />
              <Typography
                variant="small"
                color="red"
                className="mt-1 flex items-center gap-1 font-normal !text-xs"
              >
                {errors.classTime ? errors.classTime.message : ""}
              </Typography>
            </div>
          </div>
          <div className="flex lg:flex-row flex-col gap-4">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                {t("feature.group_form.label.year")}
              </Typography>
              <Controller
                name="year"
                control={control}
                render={({ field }) => {
                  return (
                    <AsyncSelect
                      {...field}
                      variant="outlined"
                      size="lg"
                      color="gray"
                      error={!!errors.year}
                      containerProps={{
                        className: "!min-w-full",
                      }}
                      labelProps={{
                        className: "before:mr-0 after:ml-0",
                      }}
                    >
                      {years.map((year) => (
                        <Option key={year} value={year}>
                          {year}
                        </Option>
                      ))}
                    </AsyncSelect>
                  );
                }}
              />
              <Typography
                variant="small"
                color="red"
                className="mt-1 flex items-center gap-1 font-normal !text-xs"
              >
                {errors.year ? errors.year.message : ""}
              </Typography>
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                {t("feature.group_form.label.semester")}
              </Typography>
              <Controller
                name="semester"
                control={control}
                render={({ field }) => {
                  return (
                    <AsyncSelect
                      {...field}
                      variant="outlined"
                      size="lg"
                      color="gray"
                      error={!!errors.semester}
                      containerProps={{
                        className: "!min-w-full",
                      }}
                      labelProps={{
                        className: "before:mr-0 after:ml-0",
                      }}
                    >
                      {SEMESTER.map((semester) => (
                        <Option key={semester} value={semester}>
                          {semester}
                        </Option>
                      ))}
                    </AsyncSelect>
                  );
                }}
              />
              <Typography
                variant="small"
                color="red"
                className="mt-1 flex items-center gap-1 font-normal !text-xs"
              >
                {errors.semester ? errors.semester.message : ""}
              </Typography>
            </div>
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              {t("feature.group_form.label.staffs")}
            </Typography>
            <Controller
              name="staffs"
              control={control}
              render={({ field }) => (
                <MultiSelect field={field} staffs={staffsOptions} />
              )}
            />
            <Typography
              variant="small"
              color="red"
              className="mt-1 flex items-center gap-1 font-normal !text-xs"
            >
              {errors.staffs ? errors.staffs.message : ""}
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button className="ml-auto" onClick={handleSubmit(onSubmit)}>
            {t("common.button.submit")}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default GroupForm;
