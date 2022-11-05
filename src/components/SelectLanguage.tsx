import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

type languageProps = {
  isLoading: boolean;
  language: string[];
  handleSelectLanguage: (arg: string) => void;
  currentSelected: string;
};

const SelectLanguage: React.FC<languageProps> = ({
  language,
  isLoading,
  handleSelectLanguage,
  currentSelected,
}: languageProps) => {
  const handleChangeLanguage = (e: SelectChangeEvent) => {
    handleSelectLanguage(e.target.value as string);
  };

  return (
    <>
      <Box sx={{ minWidth: '180' }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Language</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentSelected}
            label="Language"
            onChange={handleChangeLanguage}
          >
            {language.length ? (
              language.map((item: string, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))
            ) : (
              <MenuItem value={''}>
                {isLoading ? 'Loading' : 'Enter user name first'}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

export default SelectLanguage;
