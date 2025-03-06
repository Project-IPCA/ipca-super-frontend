import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  clearGroupFormError,
  fetchDepartments,
  fetchStaffs,
  getDepartments,
  getGroupFormError,
} from "../groupForm/redux/groupFormSlice";
import { useEffect, useRef } from "react";
import {
  clearAdminFormError,
  createAdmin,
  getAdminFormError,
  getAdminFormStatus,
} from "./redux/adminFormSlice";
import { showToast } from "../../utils/toast";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Option,
  Typography,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { AsyncSelect } from "../../components";
import { GENDER_LIST, LANGUAGE, ROLE } from "../../constants/constants";
import { useTranslation } from "react-i18next";
import i18n from "../../locales";
import { getGenderFromEnum, getRoleFromEnum } from "../../utils";
import usePermission from "../../hooks/usePermission";

interface Props {
  open: boolean;
  onClose: () => void;
}

const formDataSchema = yup.object({
  username: yup.string().required(i18n.t("feature.admin_form.error.username")),
  f_name: yup.string().required(i18n.t("feature.admin_form.error.f_name")),
  l_name: yup.string().required(i18n.t("feature.admin_form.error.l_name")),
  role: yup.string().required(i18n.t("feature.admin_form.error.role")),
  gender: yup.string().required(i18n.t("feature.admin_form.error.gender")),
  dept_id: yup.string().required(i18n.t("feature.admin_form.error.dept")),
});

export type FormData = yup.InferType<typeof formDataSchema>;

function AdminForm({ open, onClose }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const departments = useAppSelector(getDepartments);
  const groupFormError = useAppSelector(getGroupFormError);
  const adminFormError = useAppSelector(getAdminFormError);
  const isFetching = useAppSelector(getAdminFormStatus);
  const { role } = usePermission();
  const initialized = useRef(false);
  const defaultForm = {
    username: "",
    f_name: "",
    l_name: "",
    role: "",
    gender: "",
    dept_id: "",
  };
  const {
    control,
    formState: { errors, isDirty },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(formDataSchema),
    defaultValues: defaultForm,
  });

  const ROLE_LIST = [
    ROLE.ta,
    ROLE.supervisor,
    role === ROLE.beyonder || role === ROLE.supervisor ? ROLE.executive : null,
  ].filter(Boolean) as string[];

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(fetchDepartments());
    }
  }, [dispatch, initialized]);

  useEffect(() => {
    if (groupFormError) {
      showToast({
        variant: "error",
        message: groupFormError.error,
      });
      dispatch(clearGroupFormError());
    }
    if (adminFormError) {
      showToast({
        variant: "error",
        message: adminFormError.error,
      });
      dispatch(clearAdminFormError());
    }
  }, [dispatch, groupFormError, adminFormError]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const request = {
      username: data.username,
      f_name: data.f_name,
      l_name: data.l_name,
      role: data.role,
      gender: data.gender,
      dept_id: data.dept_id,
    };
    const resultAction = await dispatch(createAdmin(request));
    if (createAdmin.fulfilled.match(resultAction)) {
      showToast({
        variant: "success",
        message: "Admin has been created.",
      });
    }
    reset(defaultForm);
    dispatch(fetchStaffs(role == ROLE.beyonder ? null : "1"));
    if (!isFetching) {
      onClose();
    }
  };
  return (
    <>
      <Dialog size="sm" open={open} handler={onClose} className="p-4 !z-[500]">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            {t("feature.admin_form.title")}
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
              {t("feature.admin_form.label.username")}
            </Typography>
            <Input
              {...register("username")}
              crossOrigin=""
              color="gray"
              size="lg"
              placeholder={t("feature.admin_form.label.username")}
              error={!!errors.username}
              className={`  ${
                errors.username
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
              {errors.username ? errors.username.message : ""}
            </Typography>
          </div>

          <div className="flex lg:flex-row flex-col gap-4">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                {t("feature.admin_form.label.f_name")}
              </Typography>
              <Input
                {...register("f_name")}
                crossOrigin=""
                color="gray"
                size="lg"
                placeholder={t("feature.admin_form.label.f_name")}
                error={!!errors.f_name}
                className={`  ${
                  errors.f_name
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
                {errors.f_name ? errors.f_name.message : ""}
              </Typography>
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                {t("feature.admin_form.label.l_name")}
              </Typography>
              <Input
                {...register("l_name")}
                crossOrigin=""
                color="gray"
                size="lg"
                placeholder={t("feature.admin_form.label.l_name")}
                error={!!errors.l_name}
                className={`  ${
                  errors.l_name
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
                {errors.l_name ? errors.l_name.message : ""}
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
                {t("feature.admin_form.label.role")}
              </Typography>
              <Controller
                name="role"
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
                      error={!!errors.role}
                    >
                      {ROLE_LIST.map((role) => (
                        <Option key={role} value={role}>
                          {getRoleFromEnum(role, i18n.language)}
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
                {errors.role ? errors.role.message : ""}
              </Typography>
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                {t("feature.admin_form.label.gender")}
              </Typography>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => {
                  return (
                    <AsyncSelect
                      {...field}
                      variant="outlined"
                      size="lg"
                      color="gray"
                      error={!!errors.gender}
                      containerProps={{
                        className: "!min-w-full",
                      }}
                      labelProps={{
                        className: "before:mr-0 after:ml-0",
                      }}
                    >
                      {GENDER_LIST.map((gender) => (
                        <Option key={gender} value={gender}>
                          {getGenderFromEnum(gender, i18n.language)}
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
                {errors.gender ? errors.gender.message : ""}
              </Typography>
            </div>
          </div>
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              {t("feature.admin_form.label.dept")}
            </Typography>
            <Controller
              name="dept_id"
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
                    error={!!errors.dept_id}
                  >
                    {departments.map((dept) => (
                      <Option key={dept.dept_id} value={dept.dept_id}>
                        {i18n.language === LANGUAGE.th
                          ? dept.name_th
                          : dept.name_en}
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
              {errors.dept_id ? errors.dept_id.message : ""}
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            className="ml-auto"
            onClick={handleSubmit(onSubmit)}
            disabled={!isDirty}
            loading={isFetching}
          >
            {t("common.button.submit")}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default AdminForm;
