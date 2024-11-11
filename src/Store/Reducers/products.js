const initialState = {
  posts: {},
};

const PostReducer = (state = initialState, action) => {
  switch (action.type) {
    case "posts": {
      return { ...state, posts: action.payload };
    }
    default:
      return state;
  }
};

export default PostReducer;
