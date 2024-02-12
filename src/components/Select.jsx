import React, { useState } from 'react';
import { default as ReactSelect, createFilter } from 'react-select';
import { cls } from '../utils';

const filterOption = createFilter();

const BaseSelect = ({
  className,
  isDisabled = false,
  isMultiple = false,
  getOptionLabel = (item) => item.label,
  getOptionValue = (item) => item.value,
  ...props
}) => {
  const classNames = {
    // container: () => '',
    control: () =>
      cls(
        '!min-h-12 !cursor-pointer !border-2 !rounded-xl',
        '!border-slate-200 !bg-slate-50 hover:!bg-slate-200',
        'dark:!border-slate-800 dark:!bg-slate-950 dark:hover:!bg-slate-800'
      ),
    dropdownIndicator: () => '!text-slate-500',
    // group: () => '',
    // groupHeading: () => '',
    // indicatorsContainer: () => '',
    indicatorSeparator: () => 'invisible',
    input: () => '!text-black dark:!text-white',
    // loadingIndicator: () => '',
    // loadingMessage: () => '',
    menu: () =>
      cls(
        'border !rounded-xl ',
        'border-slate-200 !bg-slate-50',
        'dark:border-slate-800 dark:!bg-slate-950'
      ),
    menuList: () => 'rounded-xl !p-0',
    // menuPortal: () => '',
    // multiValue: () => '',
    // multiValueLabel: () => '',
    // multiValueRemove: () => '',
    // noOptionsMessage: () => '',
    option: ({ isSelected, isDisabled }) =>
      cls(
        isDisabled ? 'opacity-50 pointer-events-none' : '!cursor-pointer',
        isSelected
          ? '!bg-blue-500 hover:!bg-blue-600'
          : '!bg-slate-50 hover:!bg-slate-200 dark:!bg-slate-950 dark:hover:!bg-slate-800'
      ),
    placeholder: () => '!text-black dark:!text-white',
    singleValue: () => '!text-black dark:!text-white',
    // valueContainer: () => '',
    // clearIndicator: () => '',
  };

  return (
    <ReactSelect
      isDisabled={isDisabled}
      isMulti={isMultiple}
      className={cls('w-full', className)}
      classNames={classNames}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      {...props}
    />
  );
};

const ProgressiveSelect = ({
  options,
  getOptionLabel,
  getOptionValue,
  ...props
}) => {
  const N = 100;

  const [position, setPosition] = useState(N);
  const [opts, setOpts] = useState(options);

  const onInputChange = (value) =>
    setOpts(
      options.filter((option) =>
        filterOption(
          {
            label: getOptionLabel(option),
            value: getOptionValue(option),
            data: option,
          },
          value
        )
      )
    );

  const onMenuScrollToBottom = () => setPosition((prev) => prev + N);

  return (
    <BaseSelect
      options={opts.slice(0, position)}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      onMenuScrollToBottom={onMenuScrollToBottom}
      onInputChange={onInputChange}
      {...props}
    />
  );
};

export const Select = ({ options, ...props }) => {
  if (!options) throw Error('Missing required prop: options');

  if (options.length > 100)
    return <ProgressiveSelect options={options} {...props} />;
  return <BaseSelect options={options} {...props} />;
};

export default Select;
