import {InferType, boolean, object, string} from 'yup';
import {useTranslation} from 'react-i18next';

export const useCreditCardValidationSchema = () => {
  const [t] = useTranslation();

  return object({
    cardNumber: string()
      .required(t('validation.required'))
      .matches(/^\d{4} \d{4} \d{4} \d{4}$/, t('validation.invalidFormat')),
    expiration: string()
      .required(t('validation.required'))
      .matches(/^\d{2}\/\d{2}$/, t('validation.invalidFormat')),
    cv2: string()
      .required(t('validation.required'))
      .matches(/^\d{3}$/, t('validation.invalidFormat')),
    regulationsAccepted: boolean().test(
      'is_true',
      t('validation.required'),
      v => !!v,
    ),
  });
};

export type CreditCardFormState = InferType<
  ReturnType<typeof useCreditCardValidationSchema>
>;
