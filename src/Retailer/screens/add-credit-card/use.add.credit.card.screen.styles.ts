import {useStylesheet} from '~/designSystem';

export const useCreditCardScreenStyles = () => {
  return useStylesheet(
    ({colors, spacing}) => ({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },

      submit: {
        marginTop: spacing[32],
      },
      flexOne: {
        flex: 1,
      },
      scrollContent: {
        padding: spacing[20],
        minHeight: '100%',
      },
      inputsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[8],
      },
      inputContainer: {
        flex: 1,
      },
      switchWithLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing[8],
      },
      regulationsLink: {
        color: colors.primary,
      },
    }),
    [],
  );
};
