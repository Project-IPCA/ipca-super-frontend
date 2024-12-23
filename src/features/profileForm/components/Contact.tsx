import { Input, Select, Option } from "@material-tailwind/react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { ProfileInfo } from "../ProfileForm";
import { Dept, ProfileData } from "../redux/profileFormSlice";
import { useEffect, useState } from "react";

interface Props {
  register: UseFormRegister<ProfileInfo>;
  setValue: UseFormSetValue<ProfileInfo>;
  formData: ProfileData;
}

function Contact({ register, setValue, formData }: Props) {
  const [selectedDept, setSelectedDept] = useState<string>();
  const [depts, setDepts] = useState<Dept[]>();

  useEffect(() => {
    if (!depts && formData?.selected?.departments?.length > 0) {
      setDepts(formData.selected.departments);
    }
    if (!selectedDept && formData?.profile?.dept?.dept_id) {
      setSelectedDept(formData.profile.dept.dept_id);
    }
  }, [formData]);

  useEffect(() => {
    setValue("dept_id", selectedDept ? selectedDept : "");
  }, [selectedDept]);

  return (
    <>
      {depts && (
        <Select
          label="Department"
          onChange={(val) => setSelectedDept(val)}
          value={selectedDept ? selectedDept : ""}
          size="lg"
        >
          {depts.map((item, index) => (
            <Option key={index} value={item.dept_id}>
              {item.name}
            </Option>
          ))}
        </Select>
      )}
      <Input
        crossOrigin=""
        size="lg"
        placeholder="Email"
        label="Email"
        {...register("email")}
      />
      <Input
        crossOrigin=""
        size="lg"
        placeholder="Phone Number"
        label="Phone Number"
        {...register("tel")}
      />
    </>
  );
}

export default Contact;
