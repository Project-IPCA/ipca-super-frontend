import { Button, Option, Typography } from "@material-tailwind/react";
import { GroupTable } from "../groupTable";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { fetchMyGroups, getMyGroups } from "./redux/myGroupListSlice";
import { AsyncSelect } from "../../components";
import { GroupForm } from "../groupForm";
import { useTranslation } from "react-i18next";
import RoleProtection from "../../components/roleProtection/RoleProtection";
import {
  ALL_LABEL,
  ALL_VALUE,
  GROUP_ADMIN,
  PROGRAMMING_LANG_OPTIONS,
} from "../../constants/constants";
import { validateQuery } from "../../utils";

function MyGroupsList() {
  const initialized = useRef(false);
  const dispatch = useAppDispatch();
  const myGroups = useAppSelector(getMyGroups);
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<string>(ALL_VALUE);
  const [seletctedLang, setSelectedLang] = useState<string>(ALL_VALUE);
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
      dispatch(fetchMyGroups({ page: page }));
    }
    return () => {};
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchMyGroups({
        page: page,
        year: validateQuery(selectedYear),
        language: validateQuery(seletctedLang),
      }),
    );
  }, [dispatch, page, selectedYear, seletctedLang]);

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

  const yearOptions = useMemo(
    () => [
      ALL_VALUE,
      ...[...(myGroups.filters.year || [])]
        .sort((a, b) => b - a)
        .map((year) => year.toString()),
    ],
    [myGroups.filters.year],
  );

  const handleLangChange = (value: string | undefined) => {
    if (value) {
      setSelectedLang(value);
    }
  };

  const langOptions = [
    { label: ALL_LABEL, value: ALL_VALUE },
    ...PROGRAMMING_LANG_OPTIONS,
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
      <div className="flex flex-col lg:flex-row lg:justify-between gap-2 lg:gap-0 items-center pb-4">
        <div className="flex lg:flex-row flex-col lg:gap-y-0 gap-y-3 items-center gap-x-2 flex-grow lg:w-fit w-full">
          <div className="lg:w-44 w-full">
            <AsyncSelect
              label={t("feature.my_groups_list.filter.year")}
              value={selectedYear ? selectedYear : ALL_VALUE}
              onChange={handleYearChange}
              containerProps={{
                className: "lg:!min-w-44 ",
              }}
            >
              {yearOptions.map((year) => (
                <Option key={year} value={year}>
                  {year === ALL_VALUE
                    ? t("feature.my_groups_list.filter.all")
                    : year}
                </Option>
              ))}
            </AsyncSelect>
          </div>
          <div className="lg:w-44 w-full">
            <AsyncSelect
              label={t("feature.my_groups_list.filter.prog_lang")}
              value={seletctedLang ? seletctedLang : ALL_VALUE}
              onChange={handleLangChange}
              containerProps={{
                className: "lg:!min-w-44",
              }}
            >
              {langOptions.map((lang) => (
                <Option key={lang.value} value={lang.value}>
                  {lang.value === ALL_VALUE
                    ? t("feature.my_groups_list.filter.all")
                    : lang.label}
                </Option>
              ))}
            </AsyncSelect>
          </div>
        </div>
        <RoleProtection acceptedPermission={[GROUP_ADMIN]}>
          <Button
            className="w-full lg:w-fit"
            size="md"
            onClick={() => setFormOpen(true)}
          >
            {t("feature.my_groups_list.button.add_group")}
          </Button>
        </RoleProtection>
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
