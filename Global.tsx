interface GlobalState {
  token: string;
  userId: string;
}

const Global: GlobalState = {
  token: '',
  userId: '',
};

export default Global;