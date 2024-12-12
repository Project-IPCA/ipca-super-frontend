import { useState } from "react";
import { Constraints } from "../ExerciseForm";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
  Card,
  CardBody,
  IconButton,
} from "@material-tailwind/react";
import { startCase } from "lodash";
import { ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

interface Props {
  constraints: Constraints;
}

function KeywordConstraints({ constraints }: Props) {
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const handleOpen = (key: string) => {
    if (openKeys.includes(key)) {
      setOpenKeys(openKeys.filter((k) => k !== key));
    } else {
      setOpenKeys([...openKeys, key]);
    }
  };

  return (
    <>
      {Object.entries(constraints).map(([key, value]) => (
        <Accordion
          open={openKeys.includes(key)}
          className="mb-2 rounded-lg border border-blue-gray-100 px-4"
          key={key}
          icon={
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${openKeys.includes(key) ? "rotate-180" : ""}`}
            />
          }
        >
          <AccordionHeader
            onClick={() => handleOpen(key)}
            className={`border-b-0 transition-colors`}
          >
            <Typography>{startCase(key)} (2)</Typography>
          </AccordionHeader>
          <AccordionBody className="pt-0 text-base font-normal px-4">
            {key !== "functions" ? (
              <div className="grid grid-cols-12 gap-2">
                <Card className="border-[1px] col-span-6" shadow={false}>
                  <CardBody className="!py-2 !px-4">heollo</CardBody>
                </Card>
                <Card className="border-[1px] col-span-2" shadow={false}>
                  <CardBody className="!py-2 !px-4">12</CardBody>
                </Card>
                <IconButton variant="text" className="text-green-400">
                  <PlusCircleIcon className="w-6 h-6" />
                </IconButton>
                <Card className="border-[1px] col-span-6" shadow={false}>
                  <CardBody className="!py-2 !px-4">heollo</CardBody>
                </Card>
                <Card className="border-[1px] col-span-2" shadow={false}>
                  <CardBody className="!py-2 !px-4">12</CardBody>
                </Card>
                <IconButton variant="text" className="text-green-400">
                  <PlusCircleIcon className="w-6 h-6" />
                </IconButton>
              </div>
            ) : (
              <Typography>No constraints added yet.</Typography>
            )}
          </AccordionBody>
        </Accordion>
      ))}
    </>
  );
}

export default KeywordConstraints;
