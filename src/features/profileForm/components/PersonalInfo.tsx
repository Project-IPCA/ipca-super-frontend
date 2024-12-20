import { Input, Radio, Typography } from "@material-tailwind/react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { ProfileInfo } from "../ProfileForm";
import DatePicker from "./DatePicker";
import { ProfileData } from "../redux/profileFormSlice";

interface Props {
  register: UseFormRegister<ProfileInfo>;
  setValue: UseFormSetValue<ProfileInfo>;
  formData: ProfileData;
}

function PersonalInfo({ register, setValue, formData }: Props) {
  return (
    <form className="mt-8 mb-2   space-y-5">
      <div className="flex lg:flex-row flex-col lg:gap-y-0 gap-y-5 gap-x-2 ">
        <Input
          {...register("f_name")}
          crossOrigin=""
          size="lg"
          placeholder="First Name"
          label="First Name"
          disabled
        />
        <Input
          {...register("l_name")}
          crossOrigin=""
          size="lg"
          placeholder="Last Name"
          label="Last Name"
          disabled
        />
      </div>
      <div className="flex lg:flex-row flex-col lg:gap-y-0 gap-y-5 gap-x-2 ">
        <Input
          {...register("nickname")}
          crossOrigin=""
          size="lg"
          placeholder="Nickname"
          label="Nickname"
        />
        <DatePicker setValue={setValue} formData={formData} />
      </div>
      <div>
        <Typography variant="h5">Gender</Typography>
        <div className="flex flex-col sm:flex-row w-max gap-4">
          <Radio
            crossOrigin=""
            label="Male"
            value="MALE"
            {...register("gender", { required: true })}
          />
          <Radio
            crossOrigin=""
            label="Female"
            value="FEMALE"
            {...register("gender", { required: true })}
          />
          <Radio
            crossOrigin=""
            label="Other"
            value="OTHER"
            {...register("gender", { required: true })}
          />
        </div>
      </div>
    </form>
  );
}

export default PersonalInfo;
