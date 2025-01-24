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
import { flagEn, flagTh } from "../../assets";
import { useTranslation } from "react-i18next";
import { LANGUAGE } from "../../constants/constants";

function Multilingual() {
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
        return flagTh;
      case LANGUAGE.en:
        return flagEn;
    }
  };

  const getLanguageText = () => {
    switch (i18n.language) {
      case LANGUAGE.th:
        return "ภาษาไทย";
      case LANGUAGE.en:
        return "English";
    }
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="top-start">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-3  p-2 text-md font-medium capitalize"
          fullWidth
        >
          <Avatar
            variant="square"
            className="p-[0.25rem]"
            size="sm"
            alt="tania andrew"
            src={getFlagIcon()}
          />
          <Typography color="blue-gray" className="font-normal">
            {getLanguageText()}
          </Typography>
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
