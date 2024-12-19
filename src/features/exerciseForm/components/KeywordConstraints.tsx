import { useEffect, useState, Fragment } from "react";
import {
  SuggestedConstraint,
  UserConstraint,
  SuggestedConstraintData,
  UserConstraintData,
  UserConstraintAction,
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

type ConstraintsType = "suggested" | "user";

interface Props {
  constraintsType: ConstraintsType;
  constraints: SuggestedConstraint | UserConstraint;
  handleUserConstraints?: (
    key: keyof UserConstraint,
    action: UserConstraintAction,
    data?: UserConstraintData,
    index?: number
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

  const handleOpen = (key: string) => {
    if (openKeys.includes(key)) {
      setOpenKeys(openKeys.filter((k) => k !== key));
    } else {
      setOpenKeys([...openKeys, key]);
    }
  };

  const addUserConstraintBySuggested = (
    key: keyof SuggestedConstraint,
    data?: SuggestedConstraintData
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
    parentKey: keyof UserConstraint,
    key: keyof UserConstraintData,
    item: UserConstraintData,
    index: number,
    e: React.ChangeEvent<HTMLInputElement> | string | undefined
  ) => {
    if (handleUserConstraints) {
      const value =
        key === "type"
          ? e
          : key === "active"
          ? (e as React.ChangeEvent<HTMLInputElement>).target.checked
          : key === "limit"
          ? parseInt((e as React.ChangeEvent<HTMLInputElement>).target.value)
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
          keyof (SuggestedConstraint | UserConstraint),
          (SuggestedConstraintData | UserConstraintData)[]
        ][]
      ).map(([key, value]) => (
        <Accordion
          open={openKeys.includes(key)}
          className="mb-2 rounded-lg border border-blue-gray-100 px-4 overflow-visible"
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
          <AccordionBody className="pt-0 text-base font-normal px-4 ">
            {constraintsType === "suggested" ? (
              value.length ? (
                (value as SuggestedConstraintData[]).map((item, idx) => (
                  <div className="grid grid-cols-12 gap-2" key={idx}>
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
                <Typography>No constraints added yet.</Typography>
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
                          color="blue"
                          checked={item.active}
                          crossOrigin=""
                          onChange={(e) =>
                            onUserConstraintChange(key, "active", item, idx, e)
                          }
                          disabled={!isEdit}
                        />
                      </div>
                      <div className="col-span-4">
                        <Input
                          label="Keyword"
                          value={item.keyword}
                          crossOrigin=""
                          className="w-full"
                          containerProps={{ className: "!min-w-0" }}
                          onChange={(e) =>
                            onUserConstraintChange(key, "keyword", item, idx, e)
                          }
                          disabled={!isEdit}
                          required
                        />
                      </div>
                      <div className="col-span-4">
                        <Select
                          label="Type"
                          value={item.type}
                          containerProps={{ className: "!min-w-0" }}
                          onChange={(e) =>
                            onUserConstraintChange(key, "type", item, idx, e)
                          }
                          menuProps={{ className: "z-[999]" }}
                          disabled={!isEdit}
                        >
                          <Option value="eq">= Equal</Option>
                          <Option value="me">≥ More than equal</Option>
                          <Option value="le">≤ Less than equal</Option>
                          <Option value="na">✕ Not apprear</Option>
                        </Select>
                      </div>
                      {item.type != "na" ? (
                        <div className="col-span-2">
                          <Input
                            label="Limit"
                            value={item.limit}
                            crossOrigin=""
                            type="number"
                            containerProps={{ className: "!min-w-0" }}
                            onKeyDown={(e) => {
                              if (
                                e.key !== "ArrowUp" &&
                                e.key !== "ArrowDown"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) =>
                              onUserConstraintChange(key, "limit", item, idx, e)
                            }
                            disabled={!isEdit}
                            required
                            min={1}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      {isEdit ? (
                        <div className="col-span-1 self-center">
                          {" "}
                          <IconButton
                            variant="text"
                            className="text-red-400"
                            onClick={() => {
                              if (handleUserConstraints) {
                                handleUserConstraints(
                                  key,
                                  "delete",
                                  undefined,
                                  idx
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
                    <Typography>No constraints added yet.</Typography>
                  </div>
                )}
                {isEdit ? (
                  <Typography
                    onClick={() => addUserConstraintBySuggested(key)}
                    className="underline text-indigo-900 w-fit hover:cursor-pointer"
                  >
                    Add new keyword constraints
                  </Typography>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <Typography>Invalid Constraints Type</Typography>
            )}
          </AccordionBody>
        </Accordion>
      ))}
    </Fragment>
  );
}

export default KeywordConstraints;
