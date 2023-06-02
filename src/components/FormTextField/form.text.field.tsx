import {TextInput as RNTextInput} from 'react-native';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from 'react-hook-form';
import {HelperText, TextInput} from 'react-native-paper';
import React from 'react';

type FormTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  errors: FieldErrors<T>;
} & Omit<
  React.ComponentProps<typeof TextInput>,
  'value' | 'onBlur' | 'onChange' | 'mode'
>;

const FormTextFieldInner = <T extends FieldValues>(
  {errors, control, name, ...props}: FormTextFieldProps<T>,
  ref: React.ForwardedRef<RNTextInput>,
) => {
  const errorMessage = errors[name]?.message as string;

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onBlur, onChange}}) => (
        <>
          <TextInput
            ref={ref}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            mode="outlined"
            {...props}
          />
          <HelperText type="error" visible>
            {errorMessage || ''}
          </HelperText>
        </>
      )}
    />
  );
};

declare module 'react' {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export const FormTextField = React.forwardRef(FormTextFieldInner);
