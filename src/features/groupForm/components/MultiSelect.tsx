import { ControllerRenderProps } from "react-hook-form";
import Select from "react-select";
import makeAnimated from "react-select/animated";

type FormData = {
  staffs: { value: string; label: string }[];
};

interface Props {
  field: ControllerRenderProps<FormData>;
  staffs: { label: string; value: string }[];
}
function MultiSelect({ field, staffs }: Props) {
  const animatedComponent = makeAnimated();
  return (
    <Select
      {...field}
      closeMenuOnSelect={false}
      components={animatedComponent}
      isMulti
      menuPlacement="top"
      options={staffs}
      value={field.value}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          cursor: "pointer",
          transitionProperty: "all",
          minHeight: "20px",
          border: "1px solid #B0BEC5",
          transition: "border 0.2s ease-in-out",
          boxShadow: "none",
          borderRadius: "7px",
          boxSizing: "border-box",
          backgroundColor: "white",
          "&:hover": {
            border: "1px solid #B0BEC5",
          },
          "&:focus-within": {
            border: "2px solid #000",
            padding: "6px 2px",
          },
          padding: "7px 3px",
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          margin: "4px 0 0 0",
          borderRadius: "7px",
          border: "0.3px solid #eceff1",
          overflow: "hidden",
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          padding: "8px 12px",
        }),
        menuList: (baseStyles) => ({
          ...baseStyles,
          padding: 0,
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          fontSize: "0.875rem",
          fontWeight: "normal",
          padding: "0.4rem 12px",
          backgroundColor: state.isSelected ? "#f8f9fa" : "white",
          cursor: "pointer",
          color: "#607D8B",
          "&:hover": {
            backgroundColor: "#F0F2F4",
            color: "#263139",
            borderRadius: "7px",
          },
          "&:active": {
            backgroundColor: "#f8f9fa",
          },
        }),
        dropdownIndicator: (baseStyles) => ({
          ...baseStyles,
          color: "#607D8B",
          alignItems: "center",
          width: "34px",
          height: "34px",
          padding: "0 8px",
          "&:hover": {
            color: "#607D8B",
            cursor: "pointer",
          },
        }),

        clearIndicator: (baseStyles) => ({
          ...baseStyles,
          color: "#607D8B",
          alignItems: "center",
          width: "34px",
          height: "34px",
          padding: "0 8px",
          "&:hover": {
            color: "#607D8B",
            cursor: "pointer",
          },
        }),
        valueContainer: (baseStyles) => ({
          ...baseStyles,
          padding: "0 8px",
        }),
        placeholder: () => ({
          display: "none",
        }),
        multiValueRemove: (baseStyles) => ({
          ...baseStyles,
          color: "#607D8B",
          "&:hover": {
            backgroundColor: "transparent",
            color: "#607D8B",
          },
        }),
        multiValue: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: "#F0F2F4",
        }),
        multiValueLabel: (baseStyles) => ({
          ...baseStyles,
          fontWeight: "normal",
          color: "#263139",
        }),
        noOptionsMessage: (baseStyles) => ({
          ...baseStyles,
          display: "none",
        }),
      }}
      onChange={(newValue) => {
        field.onChange(newValue || []);
      }}
    />
  );
}

export default MultiSelect;
