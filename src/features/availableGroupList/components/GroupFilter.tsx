import { Option, Select } from "@material-tailwind/react";
import { AsyncSelect } from "../../../components";
import { FilterForm, FilterKey } from "../AvailableGroupList";
import { Filters } from "../redux/AvailableGroupListSlice";
import { ALL_LABEL, ALL_VALUE } from "../constants";
import { useMemo } from "react";
import { capitalize } from "lodash";
import { DAY_OF_WEEK } from "../../../constants/constants";

interface Props {
  filters: Filters;
  filterForm: FilterForm;
  handleChangeForm: (key: FilterKey, value: string) => void;
}

function GroupFilter({ filters, filterForm, handleChangeForm }: Props) {
  const instructorOptions = useMemo(
    () => [
      {
        supervisor_id: ALL_VALUE,
        f_name: ALL_LABEL,
        l_name: "",
      },
      ...filters.instructors.map((instructor) => instructor),
    ],
    [filters.instructors]
  );

  const yearOptions = useMemo(() => {
    if (filters.years != null && filters.years.length) {
      return [ALL_VALUE, ...filters.years.map((year) => year.toString())];
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
        label="Instructor"
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
          <Option key={option.supervisor_id} value={option.supervisor_id}>
            {`${option.f_name} ${option.l_name}`}
          </Option>
        ))}
      </AsyncSelect>
      <AsyncSelect
        label="Staff"
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
        {instructorOptions.map((option) => (
          <Option key={option.supervisor_id} value={option.supervisor_id}>
            {`${option.f_name} ${option.l_name}`}
          </Option>
        ))}
      </AsyncSelect>
      <AsyncSelect
        label="Year"
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
            {option === ALL_VALUE ? ALL_LABEL : option}
          </Option>
        ))}
      </AsyncSelect>
      <Select
        label="Semester"
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
            {option === ALL_VALUE ? ALL_LABEL : option}
          </Option>
        ))}
      </Select>
      <Select
        label="Class Date"
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
            {option === ALL_VALUE ? ALL_LABEL : capitalize(option)}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default GroupFilter;
