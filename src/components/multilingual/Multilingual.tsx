import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { flagEn, flagTh, flagCirEn, flagCirTh } from "../../assets";
import { useTranslation } from "react-i18next";
import { LANGUAGE } from "../../constants/constants";

interface Props {
  variant?: "long" | "short";
}

function Multilingual({ variant = "long" }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { i18n } = useTranslation();

  const langs = [
    {
      label: "ภาษาไทย",
      icon: flagTh,
      lang: "th",
    },
    {
      label: "English",
      icon: flagEn,
      lang: "en",
    },
  ];

  const getFlagIcon = () => {
    switch (i18n.language) {
      case LANGUAGE.th:
        return variant === "long" ? flagTh : flagCirTh;
      case LANGUAGE.en:
        return variant === "long" ? flagEn : flagCirEn;
      default:
        return variant === "long" ? flagEn : flagCirEn;
    }
  };

  const getLanguageText = () => {
    switch (i18n.language) {
      case LANGUAGE.th:
        return "ภาษาไทย";
      case LANGUAGE.en:
        return "English";
      default:
        return "English";
    }
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="top-start">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className={`flex items-center gap-3   text-md font-medium capitalize ${variant === "long" ? "p-2" : "p-0 !rounded-full"}`}
          fullWidth
        >
          <Avatar
            variant={variant === "long" ? "square" : "circular"}
            className={`p-[0.25rem] ${variant === "short" ? "w-8 h-8" : ""} `}
            size="sm"
            alt="flag"
            src={getFlagIcon()}
          />
          {variant === "long" && (
            <Typography color="blue-gray" className="font-normal">
              {getLanguageText()}
            </Typography>
          )}
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {langs.map(({ label, icon, lang }) => {
          return (
            <MenuItem
              key={label}
              onClick={() => {
                i18n.changeLanguage(lang);
                setIsMenuOpen(false);
              }}
              className={`flex items-center gap-1 rounded `}
            >
              <Avatar
                variant="square"
                className="p-[0.35rem]"
                size="sm"
                src={icon}
              />

              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color="inherit"
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

export default Multilingual;
