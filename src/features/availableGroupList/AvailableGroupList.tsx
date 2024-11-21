import { Typography } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  fetchAvailableGroups,
  getAvailableGroups,
} from "./redux/AvailableGroupListSlice";
import { GroupTable } from "../groupTable";
import GroupFilter from "./components/GroupFilter";
import { ALL_VALUE } from "./constants";

export interface FilterForm {
  instructorId: string;
  year: string;
  semester: string;
  classDate: string;
  staffs: string;
}

export type FilterKey =
  | "instructorId"
  | "year"
  | "semester"
  | "classDate"
  | "staffs";

function AvailableGroupList() {
  const initialized = useRef(false);
  const dispatch = useAppDispatch();
  const groups = useAppSelector(getAvailableGroups);
  const [page, setPage] = useState<number>(1);
  const [filterForm, setFilterForm] = useState<FilterForm>({
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

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(
        fetchAvailableGroups({
          instructorId: null,
          staffIds: null,
          year: null,
          semester: null,
          day: null,
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

  const getFormValue = (value: string) => (value === ALL_VALUE ? null : value);
  useEffect(() => {
    dispatch(
      fetchAvailableGroups({
        instructorId: getFormValue(filterForm.instructorId),
        staffIds: getFormValue(filterForm.staffs),
        year: getFormValue(filterForm.year),
        semester: getFormValue(filterForm.semester),
        day: getFormValue(filterForm.classDate),
        page: page,
      }),
    );
  }, [dispatch, page, filterForm]);

  return (
    <>
      <Typography variant="h3" className="pb-6">
        Available Groups
      </Typography>
      <GroupFilter
        filterForm={filterForm}
        filters={groups.filters}
        handleChangeForm={handleChangeForm}
      />
      <GroupTable
        groups={groups.available_groups}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        page={page}
        pages={groups.pagination.pages}
      />
    </>
  );
}

export default AvailableGroupList;