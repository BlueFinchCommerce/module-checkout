import { render, screen } from '@testing-library/vue';
import { composeStory } from '@storybook/testing-vue3';
import Meta, { Primary as PrimaryStory } from './Button.stories';

const Primary = composeStory(PrimaryStory, Meta);

test('onclick handler is called', async () => {
  const onClickSpy = jest.fn();
  render(Primary({ onClick: onClickSpy }));
  const buttonElement = screen.getByRole('button');
  buttonElement.click();
  expect(onClickSpy).toHaveBeenCalled();
});
