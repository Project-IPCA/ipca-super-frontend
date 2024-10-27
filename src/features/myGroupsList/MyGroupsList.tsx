import { Button, Option, Typography } from "@material-tailwind/react";
import { GroupTable } from "../groupTable";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { fetchMyGroups, getMyGroups } from "./redux/myGroupListSlice";
import { AsyncSelect } from "../../components";

function MyGroupsList() {
  const initialized = useRef(false);
  const dispatch = useAppDispatch();
  const myGroups = useAppSelector(getMyGroups);
  const [page, setPage] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<string>("All");

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(fetchMyGroups({ page: page, year: "All" }));
    }
    return () => {};
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMyGroups({ page: page, year: selectedYear }));
  }, [dispatch, page, selectedYear]);

  useEffect(() => {
    setPage(1);
  }, [selectedYear]);

  const handleNextPage = () => {
    if (page === myGroups.pagination.pages) {
      setPage(1);
    } else {
      setPage(page + 1);
    }
  };
  const handlePrevPage = () => {
    if (page === 1) {
      setPage(myGroups.pagination.pages);
    } else {
      setPage(page - 1);
    }
  };

  const handleYearChange = (value: string | undefined) => {
    if (value) {
      setSelectedYear(value);
    }
  };

  const yearOptions = [
    "All",
    ...myGroups.filters.year.map((year) => year.toString()),
  ];

  return (
    <>
      <Typography variant="h3" className="pb-6">
        My Groups
      </Typography>
      <div className="flex justify-between items-center pb-4">
        <div className="w-36">
          <AsyncSelect
            label="Select Version"
            value={selectedYear ? selectedYear : "All"}
            onChange={handleYearChange}
          >
            {yearOptions.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </AsyncSelect>
        </div>
        <Button size="md">Add Group</Button>
      </div>
      <GroupTable
        groups={myGroups.my_groups}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        page={page}
        pages={myGroups.pagination.pages}
      />
    </>
  );
}

export default MyGroupsList;
