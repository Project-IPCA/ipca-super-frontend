import { PencilIcon } from "@heroicons/react/24/solid";
import { profileNone } from "../../../assets";
import { getProfileStatus, ProfileData } from "../redux/profileFormSlice";
import { useAppSelector } from "../../../hooks/store";
import { Typography } from "@material-tailwind/react";

interface Props {
  formData: ProfileData;
  profileImage: string | null;
  onImageChange: (image: string) => void;
  onFileChange: (file: File | null) => void;
}

const ProfileImage = ({
  formData,
  profileImage,
  onImageChange,
  onFileChange,
}: Props) => {
  const isFetching = useAppSelector(getProfileStatus);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        onImageChange(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center items-center mb-6">
      {isFetching ? (
        <Typography
          as="div"
          variant="lead"
          className="h-40 w-40 rounded-full bg-gray-300"
        >
          &nbsp;
        </Typography>
      ) : (
        <div className="relative w-40 h-40">
          <img
            src={
              profileImage
                ? profileImage
                : formData.profile.avatar || profileNone
            }
            alt="avatar"
            className="inline-block relative object-cover object-center rounded-full w-40 h-40"
          />
          <label
            htmlFor="file-upload"
            className="absolute min-w-10 min-h-10 rounded-full p-2 text-xs font-medium leading-none grid place-items-center bottom-[13%] right-[13%] translate-x-2/4 translate-y-2/4 bg-black text-white border-2 border-white cursor-pointer"
          >
            <PencilIcon />
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
