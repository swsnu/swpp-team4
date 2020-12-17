const initialState = {
    allAlgorithmList: [],
    ownedAlgorithmList: [],
};

const algoReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'RESET':
            console.log(state);
            return initialState;
        case 'GET_OWNED_ALGORITHM':
            return {...state, ownedAlgorithmList: action.data};
        case 'GET_ALL_ALGORITHM':
            return {...state, allAlgorithmList: action.data};
        case 'DELETE_ALGORITHM':
            const deletedAlgorithmList = state.ownedAlgorithmList.filter(
                (algo) => algo.id !== action.data,
            );
            return {...state, ownedAlgorithmList: deletedAlgorithmList};
        default:
            break;
    }
    return state;
};

export default algoReducer;
