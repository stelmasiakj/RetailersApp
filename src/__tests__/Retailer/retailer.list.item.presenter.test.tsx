import {faker} from '@faker-js/faker';
import {fireEvent, render, screen} from '@testing-library/react-native';
import {RetailerListItemPresenter} from '~/Retailer/components';
import {RetailerListItem} from '~/domain';

describe('retailer list item presenter', () => {
  let retailer: RetailerListItem;
  let onPress: ReturnType<typeof jest.fn>;

  beforeEach(() => {
    retailer = {
      id: faker.number.int(),
      city: faker.location.city(),
      streetName: faker.location.street(),
      streetNumber: faker.string.numeric({length: 2}),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      avatar: faker.image.avatar(),
    };
    onPress = jest.fn();

    render(<RetailerListItemPresenter item={retailer} onPress={onPress} />);
  });

  it('should show retailer name', () => {
    expect(
      screen.getByText(`${retailer.firstName} ${retailer.lastName}`),
    ).toBeVisible();
  });

  it('should show retailer address', () => {
    expect(
      screen.getByText(
        `${retailer.streetName} ${retailer.streetNumber}, ${retailer.city}`,
      ),
    ).toBeVisible();
  });

  it('should render retailer avatar', () => {
    expect(
      screen.getByTestId(`RetailerListItem_${retailer.id}_Image`),
    ).toBeVisible();
    expect(
      screen.getByTestId(`RetailerListItem_${retailer.id}_Image`),
    ).toHaveProp('source', {uri: retailer.avatar});
  });

  it('should call onPress callback', () => {
    fireEvent.press(screen.getByTestId(`RetailerListItem_${retailer.id}`));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(retailer.id);
  });
});
