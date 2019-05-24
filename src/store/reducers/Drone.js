import * as actions from "../actions";

const initialState = {
  loading: false,
  data: {}
};

const toF = c => (c * 9) / 5 + 32;

const startLoading = (state, action) => {
  return { ...state, loading: true };
};

const droneDataRecevied = (state, action) => {

  return {
    ...state,
    loading: false,
    data: action.resData
  };
};

const handlers = {
  [actions.FETCH_DRONE_DATA]: startLoading,
  [actions.DRONE_DATA_RECEIVED]: droneDataRecevied
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
