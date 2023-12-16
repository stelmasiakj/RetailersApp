import {
  formatDate,
  formatTime,
  formatAddress,
  formatDatetime,
  formatPhoneNumber,
} from '../../utils/format.utils';

describe('format utils', () => {
  it('should format date', () => {
    const date = new Date(2023, 5, 22);

    const result = formatDate(date);

    expect(result).toBe('22.06.2023');
  });

  it('should format time', () => {
    const date = new Date(2023, 5, 22, 12, 15);

    const result = formatTime(date);

    expect(result).toBe('12:15');
  });

  it('should format date and time', () => {
    const date = new Date(2023, 5, 22, 12, 15);

    const result = formatDatetime(date);

    expect(result).toBe('22.06.2023/12:15');
  });

  it('should format address', () => {
    const address = {
      city: 'Kraków',
      streetName: 'Racławicka',
      streetNumber: '5',
    };

    const result = formatAddress(address);

    expect(result).toBe('Racławicka 5, Kraków');
  });

  it('should format phone number', async () => {
    const phoneNumber = '+48504752630';

    const result = formatPhoneNumber(phoneNumber);

    expect(result).toBe('+48 504 752 630');
  });
});
