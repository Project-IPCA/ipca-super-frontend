import { Option, Select } from "@material-tailwind/react";
import { AsyncSelect } from "../../../components";
import { FilterForm, FilterKey } from "../AvailableGroupList";
import { Filters } from "../redux/AvailableGroupListSlice";
import { ALL_VALUE } from "../constants";
import { useEffect, useMemo } from "react";
import { DAY_OF_WEEK } from "../../../constants/constants";
import { useTranslation } from "react-i18next";
import { getDayFromDayEnum } from "../../../utils";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  fetchProfile,
  getUserId,
} from "../../profileForm/redux/profileFormSlice";

interface Props {
  filters: Filters;
  filterForm: FilterForm;
  handleChangeForm: (key: FilterKey, value: string) => void;
}

function GroupFilter({ filters, filterForm, handleChangeForm }: Props) {
  const { t, i18n } = useTranslation();
  const userId = useAppSelector(getUserId);
  const dispatch = useAppDispatch();
  const instructorOptions = useMemo(
    () => [
      {
        staff_id: ALL_VALUE,
        f_name: t("feature.available_group_list.filter.all"),
        l_name: "",
      },
      ...filters.instructors.map((instructor) => instructor),
    ],
    [filters.instructors],
  );

  useEffect(() => {
    if (!userId) {
      dispatch(fetchProfile());
    }
  }, [dispatch, userId]);

  const yearOptions = useMemo(() => {
    if (filters.years != null && filters.years.length) {
      return [
        ALL_VALUE,
        ...[...(filters.years || [])]
          .sort((a, b) => b - a)
          .map((year) => year.toString()),
      ];
    } else {
      return [ALL_VALUE];
    }
  }, [filters.years]);

  const semesterOptions = [
    ALL_VALUE,
    ...Array.from({ length: 3 }, (_, index) => (index + 1).toString()),
  ];

  const classDateOptions = [ALL_VALUE, ...DAY_OF_WEEK];

  return (
    <div className="flex justify-start items-center pb-4 w-full gap-x-3 lg:flex-row flex-col gap-y-4">
      <AsyncSelect
        label={t("feature.available_group_list.filter.instructor")}
        value={filterForm.instructorId}
        onChange={(val) => {
          if (val) {
            handleChangeForm("instructorId", val);
          }
        }}
        containerProps={{
          className: "!min-w-28 ",
        }}
      >
        {instructorOptions.map((option) => (
          <Option key={option.staff_id} value={option.staff_id}>
            {`${option.f_name} ${option.l_name}`}
          </Option>
        ))}
      </AsyncSelect>
      <AsyncSelect
        label={t("feature.available_group_list.filter.staff")}
        value={filterForm.staffs}
        onChange={(val) => {
          if (val) {
            handleChangeForm("staffs", val);
          }
        }}
        containerProps={{
          className: "!min-w-28 ",
        }}
      >
        {instructorOptions
          .filter((option) => option.staff_id !== userId)
          .map((option) => (
            <Option key={option.staff_id} value={option.staff_id}>
              {`${option.f_name} ${option.l_name}`}
            </Option>
          ))}
      </AsyncSelect>
      <AsyncSelect
        label={t("feature.available_group_list.filter.year")}
        value={filterForm.year}
        onChange={(val) => {
          if (val) {
            handleChangeForm("year", val);
          }
        }}
        containerProps={{
          className: "!min-w-28 ",
        }}
      >
        {yearOptions.map((option) => (
          <Option key={option} value={option}>
            {option === ALL_VALUE
              ? t("feature.available_group_list.filter.all")
              : option}
          </Option>
        ))}
      </AsyncSelect>
      <Select
        label={t("feature.available_group_list.filter.semester")}
        value={filterForm.semester}
        onChange={(val) => {
          if (val) {
            handleChangeForm("semester", val);
          }
        }}
        containerProps={{
          className: "!min-w-28 ",
        }}
      >
        {semesterOptions.map((option) => (
          <Option key={option} value={option}>
            {option === ALL_VALUE
              ? t("feature.available_group_list.filter.all")
              : option}
          </Option>
        ))}
      </Select>
      <Select
        label={t("feature.available_group_list.filter.class_date")}
        value={filterForm.classDate}
        onChange={(val) => {
          if (val) {
            handleChangeForm("classDate", val);
          }
        }}
        containerProps={{
          className: "!min-w-28 ",
        }}
      >
        {classDateOptions.map((option) => (
          <Option key={option} value={option}>
            {option === ALL_VALUE
              ? t("feature.available_group_list.filter.all")
              : getDayFromDayEnum(option, i18n.language)}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default GroupFilter;
