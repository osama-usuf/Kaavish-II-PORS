import React from "react";
import ReactSelect from "react-select";

import { ThemeContext } from "styled-components";
import * as S from "./styles";
import { IProps } from "./types";

const optionStyle = (customTheme: any) => ({
  option: (
    provided: any,
    state: {
      isSelected: any;
      isFocused: boolean;
      customTheme: any;
      isDisabled: boolean;
    }
  ) => {
    return {
      ...provided,
      alignItems: "center",
      backgroundColor: state.isSelected
        ? customTheme.colors.primaryLight
        : state.isFocused
        ? customTheme.colors.primaryTransparent
        : "white",
      color: state.isDisabled
        ? customTheme.colors.lightFont
        : customTheme.colors.dark,
      display: "flex",
      fontWeight: state.isSelected && customTheme.typography.boldFontWeight,
      margin: "0 auto",
      minHeight: "34px",
      verticalAlign: "middle",
      width: "95%",
    };
  },
});

export const Select: React.FC<IProps> = ({
  value,
  onChange,
  clearable,
  clearValue,
  name,
  options,
  isOptionDisabled,
  customComponents,
  defaultValue,
  menuIsOpen,
  customStyles,
  optionLabelKey = "label",
  optionValueKey = "value",
}: IProps) => {
  const customTheme = React.useContext(ThemeContext);
  const handleChange = (value: any) => {
    if (onChange) {
      name ? onChange(value, name) : onChange(value);
    }
  };

  return (
    <S.Wrapper>
      <ReactSelect
        defaultValue={defaultValue}
        onChange={handleChange}
        value={value}
        clearValue={clearValue}
        menuIsOpen={menuIsOpen}
        menuShouldScrollIntoView={true}
        tabSelectsValue={false}
        getOptionLabel={option => option[optionLabelKey]}
        getOptionValue={option => option[optionValueKey]}
        openMenuOnFocus={true}
        styles={{ ...optionStyle(customTheme), ...customStyles }}
        options={options}
        isOptionDisabled={isOptionDisabled}
        placeholder={""}
        components={customComponents}
        isClearable={clearable}
      ></ReactSelect>
    </S.Wrapper>
  );
};