import { Button, Option, Typography } from "@material-tailwind/react";
import { GroupTable } from "../groupTable";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { fetchMyGroups, getMyGroups } from "./redux/myGroupListSlice";
import { AsyncSelect } from "../../components";
import { GroupForm } from "../groupForm";
import { useTranslation } from "react-i18next";

function MyGroupsList() {
  const initialized = useRef(false);
  const dispatch = useAppDispatch();
  const myGroups = useAppSelector(getMyGroups);
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formGroupId, setFormGrouopId] = useState<string | null>(null);

  const handleFormClose = () => {
    setFormGrouopId(null);
    setFormOpen(false);
  };

  const handleFormOpen = () => setFormOpen(true);

  const handleSetGroupId = (groupId: string | null) => setFormGrouopId(groupId);

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
    ...(myGroups.filters.year || []).map((year) => year.toString()),
  ];

  return (
    <>
      <GroupForm
        open={formOpen}
        onClose={handleFormClose}
        groupId={formGroupId}
      />
      <Typography variant="h3" className="pb-6">
        {t("feature.my_groups_list.title")}
      </Typography>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 items-center pb-4">
        <div className="w-full sm:w-36">
          <AsyncSelect
            label={t("feature.my_groups_list.filter.year")}
            value={selectedYear ? selectedYear : "All"}
            onChange={handleYearChange}
          >
            {yearOptions.map((year) => (
              <Option key={year} value={year}>
                {year === "All" ? t("feature.my_groups_list.filter.all") : year}
              </Option>
            ))}
          </AsyncSelect>
        </div>
        <Button
          className="w-full sm:w-fit"
          size="md"
          onClick={() => setFormOpen(true)}
        >
          {t("feature.my_groups_list.button.add_group")}
        </Button>
      </div>
      <GroupTable
        groups={myGroups.my_groups}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleFormOpen={handleFormOpen}
        handleSetGroupId={handleSetGroupId}
        page={page}
        pages={myGroups.pagination.pages}
      />
    </>
  );
}

export default MyGroupsList;
