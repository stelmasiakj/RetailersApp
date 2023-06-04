import dump from './dump.json';

type DataShape = typeof dump;

let data: DataShape = JSON.parse(JSON.stringify(dump));

const reload = () => {
  data = JSON.parse(JSON.stringify(dump));
};

export const fakeDB = {
  data,
  reload,
};
