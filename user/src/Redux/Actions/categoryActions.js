import request from '../../utils/request';
import { CATEGORY_FAIL, CATEGORY_REQUEST, CATEGORY_SUCCESS } from '../Constants/CategoryConstants';

export const ListCategory = () => async (dispatch) => {
    try {
        dispatch({ type: CATEGORY_REQUEST });
        const { data } = await request.get(`/api/categorie/`);
        dispatch({ type: CATEGORY_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CATEGORY_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};
