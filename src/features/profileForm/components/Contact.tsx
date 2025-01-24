import { Input, Select, Option } from "@material-tailwind/react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { ProfileInfo } from "../ProfileForm";
import { Dept, ProfileData } from "../redux/profileFormSlice";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../locales";
import { LANGUAGE } from "../../../constants/constants";

interface Props {
  register: UseFormRegister<ProfileInfo>;
  setValue: UseFormSetValue<ProfileInfo>;
  formData: ProfileData;
}

function Contact({ register, setValue, formData }: Props) {
  const { t } = useTranslation();
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
          label={t("feature.profile.contact.dept")}
          onChange={(val) => setSelectedDept(val)}
          value={selectedDept ? selectedDept : ""}
          size="lg"
        >
          {depts.map((item, index) => (
            <Option key={index} value={item.dept_id}>
              {i18n.language === LANGUAGE.th?item.name_th:item.name_en}
            </Option>
          ))}
        </Select>
      )}
      <Input
        crossOrigin=""
        size="lg"
        placeholder={t("feature.profile.contact.email")}
        label={t("feature.profile.contact.email")}
        {...register("email")}
      />
      <Input
        crossOrigin=""
        size="lg"
        placeholder={t("feature.profile.contact.phone")}
        label={t("feature.profile.contact.phone")}
        {...register("tel")}
      />
    </>
  );
}

export default Contact;
