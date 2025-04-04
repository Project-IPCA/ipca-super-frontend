import { useEffect, useState, Fragment } from "react";
import {
  PythonSuggestedConstraint,
  PythonUserConstraint,
  SuggestedConstraintData,
  UserConstraintData,
  UserConstraintAction,
  ClangUserConstraint,
  ClangSuggestedConstraint,
} from "../ExerciseForm";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
  Card,
  CardBody,
  IconButton,
  Checkbox,
  Select,
  Option,
  Input,
} from "@material-tailwind/react";
import { startCase } from "lodash";
import {
  ChevronDownIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

type ConstraintsType = "suggested" | "user";

interface Props {
  constraintsType: ConstraintsType;
  constraints:
    | PythonSuggestedConstraint
    | PythonUserConstraint
    | ClangUserConstraint
    | ClangSuggestedConstraint;
  handleUserConstraints?: (
    key: keyof PythonUserConstraint,
    action: UserConstraintAction,
    data?: UserConstraintData,
    index?: number,
  ) => void;
  isEdit: boolean;
}

function KeywordConstraints({
  constraintsType,
  constraints,
  handleUserConstraints,
  isEdit,
}: Props) {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { t } = useTranslation();

  const handleOpen = (key: string) => {
    if (openKeys.includes(key)) {
      setOpenKeys(openKeys.filter((k) => k !== key));
    } else {
      setOpenKeys([...openKeys, key]);
    }
  };

  const addUserConstraintBySuggested = (
    key: keyof PythonSuggestedConstraint,
    data?: SuggestedConstraintData,
  ) => {
    if (handleUserConstraints) {
      let sendData: UserConstraintData;
      if (data) {
        sendData = {
          keyword: data.keyword,
          limit: data.limit,
          type: "eq",
          active: true,
        };
      } else {
        sendData = {
          keyword: "",
          limit: 1,
          type: "eq",
          active: true,
        };
      }
      handleUserConstraints(key, "add", sendData);
    }
  };

  const onUserConstraintChange = (
    parentKey: keyof PythonUserConstraint,
    key: keyof UserConstraintData,
    item: UserConstraintData,
    index: number,
    e: React.ChangeEvent<HTMLInputElement> | string | undefined,
  ) => {
    if (handleUserConstraints) {
      const value =
        key === "type"
          ? e
          : key === "active"
            ? (e as React.ChangeEvent<HTMLInputElement>).target.checked
            : key === "limit"
              ? parseInt(
                  (e as React.ChangeEvent<HTMLInputElement>).target.value,
                )
              : (e as React.ChangeEvent<HTMLInputElement>).target.value;
      const newItem = {
        ...item,
        [key]: value,
      };
      handleUserConstraints(parentKey, "update", newItem, index);
    }
  };

  useEffect(() => {
    const keysToOpen = Object.entries(constraints)
      .filter(([, val]) => val.length)
      .map(([key]) => key);

    if (keysToOpen.length) {
      setOpenKeys((prev) => [...prev, ...keysToOpen]);
    }
  }, [constraints]);

  return (
    <Fragment>
      {(
        Object.entries(constraints) as [
          keyof (PythonSuggestedConstraint | PythonUserConstraint),
          (SuggestedConstraintData | UserConstraintData)[],
        ][]
      ).map(([key, value]) => (
        <Accordion
          open={openKeys.includes(key)}
          className="mb-2 rounded-lg border border-blue-gray-100 px-4 "
          key={key}
          icon={
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                openKeys.includes(key) ? "rotate-180" : ""
              }`}
            />
          }
        >
          <AccordionHeader
            onClick={() => handleOpen(key)}
            className={`border-b-0 transition-colors`}
          >
            <Typography>
              {startCase(key)} ({Array.isArray(value) ? value.length : 0})
            </Typography>
          </AccordionHeader>
          <AccordionBody
            className={`pt-0 text-base font-normal  ${constraintsType === "suggested" ? "px-4" : "md:px-2"}`}
          >
            {constraintsType === "suggested" ? (
              value.length ? (
                (value as SuggestedConstraintData[]).map((item, idx) => (
                  <div className="grid grid-cols-12 gap-2 mb-2" key={idx}>
                    <Card className="border-[1px] col-span-6" shadow={false}>
                      <CardBody className="!py-2 !px-4">
                        {item.keyword}
                      </CardBody>
                    </Card>
                    <Card className="border-[1px] col-span-2" shadow={false}>
                      <CardBody className="!py-2 !px-4">{item.limit}</CardBody>
                    </Card>
                    {isEdit ? (
                      <IconButton
                        variant="text"
                        className="text-green-400"
                        onClick={() => addUserConstraintBySuggested(key, item)}
                      >
                        <PlusCircleIcon className="w-6 h-6" />
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </div>
                ))
              ) : (
                <Typography>
                  {t("feature.exercise_form.constraint.no")}
                </Typography>
              )
            ) : constraintsType === "user" ? (
              <div>
                {value.length ? (
                  (value as UserConstraintData[]).map((item, idx) => (
                    <div className="grid grid-cols-12 gap-2 mb-4" key={idx}>
                      {" "}
                      <div
                        className={`${
                          isEdit ? "col-span-1" : "col-span-2"
                        } self-center`}
                      >
                        <Checkbox
                          className={`${openKeys.includes(key) ? "" : "hidden"}`}
                          color="blue"
                          checked={item.active}
                          crossOrigin=""
                          onChange={(e) =>
                            onUserConstraintChange(key, "active", item, idx, e)
                          }
                          disabled={!isEdit}
                        />
                      </div>
                      <div
                        className={` absolute md:w-32 w-20  md:left-[4rem] left-[3.5rem] ${openKeys.includes(key) ? "" : "hidden"}`}
                      >
                        <Input
                          label="Keyword"
                          value={item.keyword}
                          crossOrigin=""
                          className="w-full !absolute !z-[9999]"
                          containerProps={{ className: "!min-w-0" }}
                          onChange={(e) =>
                            onUserConstraintChange(key, "keyword", item, idx, e)
                          }
                          disabled={!isEdit}
                        />
                      </div>
                      <div
                        className={`col-span-4 absolute md:!w-16 w-[3.3rem] ${openKeys.includes(key) ? "md:left-[12.5rem] left-[8.7rem]" : "hidden"} w-40`}
                      >
                        <Select
                          label="Type"
                          value={item.type}
                          containerProps={{ className: "!min-w-0" }}
                          onChange={(e) =>
                            onUserConstraintChange(key, "type", item, idx, e)
                          }
                          className=""
                          menuProps={{ className: "!z-[9999]" }}
                          disabled={!isEdit}
                        >
                          <Option value="eq">=</Option>
                          <Option value="me">≥</Option>
                          <Option value="le">≤</Option>
                          <Option value="na">✕</Option>
                        </Select>
                      </div>
                      {item.type != "na" ? (
                        <div
                          className={`absolute lg:!w-16 w-[3.5rem]  ${openKeys.includes(key) ? "md:left-[17rem] left-[12.2rem]" : "hidden"}`}
                        >
                          <Input
                            label="Limit"
                            value={item.limit ? item.limit : ""}
                            crossOrigin=""
                            type="number"
                            containerProps={{ className: "!min-w-0" }}
                            onChange={(e) => {
                              onUserConstraintChange(
                                key,
                                "limit",
                                item,
                                idx,
                                e,
                              );
                            }}
                            disabled={!isEdit}
                            min={1}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      {isEdit ? (
                        <div
                          className={`absolute md:!w-16 ${openKeys.includes(key) ? "md:left-[21.6rem] left-[16rem]" : "hidden"}`}
                        >
                          <IconButton
                            variant="text"
                            className="text-red-400"
                            onClick={() => {
                              if (handleUserConstraints) {
                                handleUserConstraints(
                                  key,
                                  "delete",
                                  undefined,
                                  idx,
                                );
                              }
                            }}
                          >
                            <MinusCircleIcon className="w-6 h-6" />
                          </IconButton>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))
                ) : (
                  <div>
                    <Typography>
                      {t("feature.exercise_form.constraint.no")}
                    </Typography>
                  </div>
                )}
                {isEdit ? (
                  <Typography
                    onClick={() => addUserConstraintBySuggested(key)}
                    className="underline text-indigo-900 w-fit hover:cursor-pointer"
                  >
                    {t("feature.exercise_form.constraint.add")}
                  </Typography>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <Typography>
                {t("feature.exercise_form.constraint.invalid")}
              </Typography>
            )}
          </AccordionBody>
        </Accordion>
      ))}
    </Fragment>
  );
}

export default KeywordConstraints;
