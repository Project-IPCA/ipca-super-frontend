import {
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Option,
  Select,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateChapterPermission } from "./redux/permissionFormSlice";
import { PERMISSION_VALUE, TABS_VALUE, TIME_RANGE } from "./constants";
import { ChapterData } from "../groupExercises/GroupExercises";
import { useAppDispatch } from "../../hooks/store";
import { ALLOW_TYPE, PERMISIION_PREFIX } from "../../constants/constants";
import { fetchGroupExercises } from "../groupExercises/redux/groupExercisesSlice";
import SinglePermission from "./components/SinglePermission";
import { showToast } from "../../utils/toast";
import { useTranslation } from "react-i18next";

export interface ChapterPermission {
  timeDuration?: number | null;
  type: string;
  timeStart?: Date | null;
  timeEnd?: Date | null;
}

interface Props {
  open: boolean;
  handleClose: () => void;
  chapterSelected: ChapterData | null;
}

function PermissionForm({ open, handleClose, chapterSelected }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { groupId } = useParams();

  const [permSelected, setPermSelected] = useState<string>(
    PERMISSION_VALUE.all,
  );

  const inititalPerm: ChapterPermission = {
    type: ALLOW_TYPE.always,
    timeDuration: null,
    timeStart: null,
    timeEnd: null,
  };

  const [accessPerm, setAccessPerm] = useState<ChapterPermission>(inititalPerm);
  const [submitPerm, setSubmitPerm] = useState<ChapterPermission>(inititalPerm);
  const [allPerm, setAllPerm] = useState<ChapterPermission>(inititalPerm);

  const handleChangePerm = (
    tab: string | null,
    type: string,
    timeDuration: number | null,
  ) => {
    const perm = {
      type: type,
      timeDuration: timeDuration,
    };
    if (tab === TABS_VALUE.accessExercise) {
      setAccessPerm(perm);
    } else if (tab === TABS_VALUE.allowSubmit) {
      setSubmitPerm(perm);
    } else {
      setAllPerm(perm);
    }
  };

  const handleChangePermDateTime = (
    tab: string | null,
    timeRange: string,
    time: Date,
  ) => {
    const updatePermission = (
      setter: React.Dispatch<React.SetStateAction<ChapterPermission>>,
    ) => {
      setter((prevPerm) => ({
        ...prevPerm,
        [timeRange]: time,
      }));
    };

    if (!tab) {
      updatePermission(setAllPerm);
    } else if (tab === TABS_VALUE.accessExercise) {
      updatePermission(setAccessPerm);
    } else if (tab === TABS_VALUE.allowSubmit) {
      updatePermission(setSubmitPerm);
    }
  };

  const getPermTime = (
    permType: string,
    timeRange: string,
    timeDuration?: number | null,
    dateTime?: Date | null,
  ): string | null => {
    if (permType === ALLOW_TYPE.timer) {
      const timeStart = new Date();
      if (timeRange === TIME_RANGE.timeStart) {
        return timeStart.toISOString();
      } else {
        const timeEndTimeStamp =
          timeStart.getTime() + (timeDuration || 0) * 1000;
        const timeEnd = new Date(timeEndTimeStamp);
        return timeEnd.toISOString();
      }
    } else {
      return dateTime?.toISOString() || null;
    }
  };

  const handleSubmit = async () => {
    const createPermissionPayload = (
      prefix: string,
      perm: ChapterPermission,
      sync: boolean,
    ) => ({
      chapter_id: chapterSelected?.chapterId || "",
      group_id: groupId || "",
      permission: {
        prefix,
        type: perm.type,
        time_start: getPermTime(
          perm.type,
          TIME_RANGE.timeStart,
          perm.timeDuration,
          perm.timeStart,
        ),
        time_end: getPermTime(
          perm.type,
          TIME_RANGE.timeEnd,
          perm.timeDuration,
          perm.timeEnd,
        ),
      },
      sync,
    });

    const resetPermissionType = (
      setPerm: React.Dispatch<React.SetStateAction<ChapterPermission>>,
    ) => {
      setPerm((prevPerm) => ({
        ...prevPerm,
        type: ALLOW_TYPE.always,
      }));
    };

    switch (permSelected) {
      case PERMISSION_VALUE.all:
        await dispatch(
          updateChapterPermission(
            createPermissionPayload(PERMISIION_PREFIX.access, allPerm, true),
          ),
        );
        resetPermissionType(setAllPerm);
        break;

      case PERMISSION_VALUE.access:
        await dispatch(
          updateChapterPermission(
            createPermissionPayload(
              PERMISIION_PREFIX.access,
              accessPerm,
              false,
            ),
          ),
        );
        resetPermissionType(setAccessPerm);
        break;

      case PERMISSION_VALUE.submit:
        await dispatch(
          updateChapterPermission(
            createPermissionPayload(
              PERMISIION_PREFIX.submit,
              submitPerm,
              false,
            ),
          ),
        );
        resetPermissionType(setSubmitPerm);
        break;

      case PERMISSION_VALUE.custom:
        await dispatch(
          updateChapterPermission(
            createPermissionPayload(
              PERMISIION_PREFIX.access,
              accessPerm,
              false,
            ),
          ),
        );
        await dispatch(
          updateChapterPermission(
            createPermissionPayload(
              PERMISIION_PREFIX.submit,
              submitPerm,
              false,
            ),
          ),
        );
        resetPermissionType(setAccessPerm);
        resetPermissionType(setSubmitPerm);
        break;
    }
    showToast({
      variant: "success",
      message: "Permission has been updated.",
    });
    if (groupId) {
      dispatch(fetchGroupExercises(groupId));
    }
    handleClose();
  };

  useEffect(() => {
    if (open) {
      setPermSelected(PERMISSION_VALUE.all);
    }
  }, [open]);

  const PERMISSION_SELECTED = [
    {
      label: t("feature.perm_form.perm_selected.all"),
      value: PERMISSION_VALUE.all,
    },
    {
      label: t("feature.perm_form.perm_selected.access"),
      value: PERMISSION_VALUE.access,
    },
    {
      label: t("feature.perm_form.perm_selected.submit"),
      value: PERMISSION_VALUE.submit,
    },
    {
      label: t("feature.perm_form.perm_selected.custom"),
      value: PERMISSION_VALUE.custom,
    },
  ];

  return (
    <>
      <Dialog size="sm" open={open} handler={handleClose} className="p-4 ">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            {t("feature.perm_form.title")}
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            {`${t("feature.perm_form.desc")} ${chapterSelected?.chapterIndex}. ${chapterSelected?.chapterName}`}
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
          <div className="w-full pb-2">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              {t("feature.perm_form.label.perm_selected")}
            </Typography>
            <Select
              variant="outlined"
              size="lg"
              color="gray"
              value={permSelected}
              onChange={(val) => {
                if (val) {
                  setPermSelected(val);
                }
              }}
              containerProps={{
                className: "!min-w-full",
              }}
              labelProps={{
                className: "before:mr-0 after:ml-0",
              }}
            >
              {PERMISSION_SELECTED.map((perm) => (
                <Option key={perm.value} value={perm.value}>
                  {perm.label}
                </Option>
              ))}
            </Select>
          </div>
          {permSelected === PERMISSION_VALUE.all && (
            <SinglePermission
              tab={null}
              permissionType={allPerm.type}
              handleChangePerm={handleChangePerm}
              handleChangePermDateTime={handleChangePermDateTime}
            />
          )}
          {permSelected === PERMISSION_VALUE.custom && (
            <>
              <SinglePermission
                tab={TABS_VALUE.accessExercise}
                permissionType={accessPerm.type}
                handleChangePerm={handleChangePerm}
                handleChangePermDateTime={handleChangePermDateTime}
              />
              <SinglePermission
                tab={TABS_VALUE.allowSubmit}
                permissionType={submitPerm.type}
                handleChangePerm={handleChangePerm}
                handleChangePermDateTime={handleChangePermDateTime}
              />
            </>
          )}
          {permSelected === PERMISSION_VALUE.access && (
            <SinglePermission
              tab={TABS_VALUE.accessExercise}
              permissionType={accessPerm.type}
              handleChangePerm={handleChangePerm}
              handleChangePermDateTime={handleChangePermDateTime}
            />
          )}
          {permSelected === PERMISSION_VALUE.submit && (
            <SinglePermission
              tab={TABS_VALUE.allowSubmit}
              permissionType={submitPerm.type}
              handleChangePerm={handleChangePerm}
              handleChangePermDateTime={handleChangePermDateTime}
            />
          )}
        </DialogBody>
        <DialogFooter>
          <Button className="ml-auto" onClick={() => handleSubmit()}>
            {t("common.button.submit")}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default PermissionForm;
