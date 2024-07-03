import { useState } from 'react';
import { Button, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, useColorModeValue, Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { TfiWorld } from 'react-icons/tfi';
import { FaCheck } from 'react-icons/fa';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  
  // State to keep track of the selected language
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
  };

  const selectedBgColor = useColorModeValue("gray.300", "gray.600");
  const selectedTextColor = useColorModeValue("black", "white");

  return (
    <Popover placement="top">
      <PopoverTrigger>
        <Button
          position={"fixed"}
          bottom={5}
          right={5}
          bg={useColorModeValue("rgb(237,242,247)", "gray.dark")}
          size={{
            base: "sm",
            sm: "md",
          }}
          p={2}
          borderRadius="md"
        >
          <TfiWorld />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        bg={useColorModeValue("rgb(237,242,247)", "gray.dark")}
        borderColor={useColorModeValue("gray.300", "gray.dark")}
        borderWidth="1px"
        boxShadow="lg"
        width="140px" // Adjusted width to be more compact
        padding="1"
        borderRadius="md"
      >
        <PopoverArrow />
        <PopoverHeader
          fontWeight="bold"
          border="0"
          textAlign="center"
          color={useColorModeValue("gray.700", "gray.300")}
          fontSize="xs" // Adjusted font size
          padding="2"
        >
          {t('chooseLanguage')}
        </PopoverHeader>
        <PopoverBody textAlign="center" padding="1">
          <Button
            onClick={() => handleLanguageChange('vn')}
            bg={selectedLanguage === 'vn' ? selectedBgColor : 'transparent'}
            color={selectedLanguage === 'vn' ? selectedTextColor : 'inherit'}
            width="100%"
            justifyContent="space-between"
            _hover={{ bg: selectedBgColor, color: selectedTextColor }}
            padding="1"
            fontSize="xs" // Adjusted font size
            borderRadius="md"
            mb={1} // Margin between buttons
          >
            {t('vn')}
            {selectedLanguage === 'vn' && <Icon as={FaCheck} ml={1} />}
          </Button>
          <Button
            onClick={() => handleLanguageChange('en')}
            bg={selectedLanguage === 'en' ? selectedBgColor : 'transparent'}
            color={selectedLanguage === 'en' ? selectedTextColor : 'inherit'}
            width="100%"
            justifyContent="space-between"
            _hover={{ bg: selectedBgColor, color: selectedTextColor }}
            padding="1"
            fontSize="xs" // Adjusted font size
            borderRadius="md"
          >
            {t('en')}
            {selectedLanguage === 'en' && <Icon as={FaCheck} ml={1} />}
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default LanguageSwitcher;
