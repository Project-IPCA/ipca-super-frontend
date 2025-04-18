import { Typography } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  fetchAvailableGroups,
  getAvailableGroups,
} from "./redux/AvailableGroupListSlice";
import { GroupTable } from "../groupTable";
import GroupFilter from "./components/GroupFilter";
import {
  fetchProfile,
  getProfile,
} from "../profileForm/redux/profileFormSlice";
import { GroupForm } from "../groupForm";
import { useTranslation } from "react-i18next";
import { ALL_VALUE } from "../../constants/constants";
import { validateQuery } from "../../utils";

export interface FilterForm {
  language: string;
  instructorId: string;
  year: string;
  semester: string;
  classDate: string;
  staffs: string;
}

export type FilterKey =
  | "language"
  | "instructorId"
  | "year"
  | "semester"
  | "classDate"
  | "staffs";

function AvailableGroupList() {
  const initialized = useRef(false);
  const dispatch = useAppDispatch();
  const groups = useAppSelector(getAvailableGroups);
  const profile = useAppSelector(getProfile);
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(1);
  const [groupSelected, setGroupSelected] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [filterForm, setFilterForm] = useState<FilterForm>({
    language: ALL_VALUE,
    instructorId: ALL_VALUE,
    year: ALL_VALUE,
    semester: ALL_VALUE,
    classDate: ALL_VALUE,
    staffs: ALL_VALUE,
  });
  const handleChangeForm = (key: FilterKey, value: string) => {
    setFilterForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFormClose = () => {
    setGroupSelected(null);
    setFormOpen(false);
  };

  const handleFormOpen = () => setFormOpen(true);

  const handleSetGroupId = (groupId: string | null) =>
    setGroupSelected(groupId);

  useEffect(() => {
    if (!profile.profile.f_name) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(
        fetchAvailableGroups({
          page: 1,
        }),
      );
    }
    return () => {};
  }, [dispatch, initialized]);

  const handleNextPage = () => {
    if (page === groups.pagination.pages) {
      setPage(1);
    } else {
      setPage(page + 1);
    }
  };
  const handlePrevPage = () => {
    if (page === 1) {
      setPage(groups.pagination.pages);
    } else {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    dispatch(
      fetchAvailableGroups({
        instructorId: validateQuery(filterForm.instructorId),
        staffIds: validateQuery(filterForm.staffs),
        year: validateQuery(filterForm.year),
        semester: validateQuery(filterForm.semester),
        day: validateQuery(filterForm.classDate),
        language: validateQuery(filterForm.language),
        page: page,
      }),
    );
  }, [dispatch, page, filterForm]);

  return (
    <>
      <GroupForm
        open={formOpen}
        onClose={handleFormClose}
        groupId={groupSelected}
      />
      <Typography variant="h3" className="pb-6">
        {t("feature.available_group_list.title")}
      </Typography>
      <GroupFilter
        filterForm={filterForm}
        filters={groups.filters}
        handleChangeForm={handleChangeForm}
      />
      <GroupTable
        userId={profile.profile.user_id}
        groups={groups.available_groups}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleFormOpen={handleFormOpen}
        handleSetGroupId={handleSetGroupId}
        page={page}
        pages={groups.pagination.pages}
      />
    </>
  );
}

export default AvailableGroupList;
